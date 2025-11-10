import {
  MarketResearchFormData,
  SalesPageFormData,
  EmailFlowFormData,
} from "../types";

// N8N webhook URLs
const WEBHOOK_URLS = {
  "market-research":
    "https://omar-h.app.n8n.cloud/webhook-test/cb7f1e13-2985-4045-a98c-1f2d327299a8",
  "sales-page":
    "https://omar-h.app.n8n.cloud/webhook-test/9b68b053-a43d-4977-a11b-c4d470ac7bc3",
  "email-flow":
    "https://omar-h.app.n8n.cloud/webhook-test/c5c70d5e-9d36-4daa-8536-e002d29bf8f1",
};

/**
 * Enhanced N8N Service with real streaming support
 */
export class N8NService {
  /**
   * Generic streaming handler for all agents
   */
  private static async streamResponse(
    url: string,
    formData: any,
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<string> {
    console.log("🚀 Sending request to:", url);
    console.log("📦 Form data:", formData);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream, application/json, text/plain, */*",
        },
        body: JSON.stringify(formData),
      });

      console.log("📡 Response status:", response.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      console.log("📄 Content-Type:", contentType);

      // Check if response is streaming (text/event-stream)
      if (contentType?.includes("text/event-stream")) {
        console.log("🌊 Handling as streaming response");
        return await this.handleStreamingResponse(
          response,
          onChunk,
          onComplete
        );
      } else {
        console.log("📦 Handling as JSON/text response");
        const result = await this.handleJSONResponse(response, onChunk);
        // Fire completion callback for non-streaming responses
        if (onComplete) {
          onComplete();
        }
        return result;
      }
    } catch (error) {
      console.error("❌ N8N Service Error:", error);
      if (onError) {
        onError(error as Error);
      }
      throw error;
    }
  }

  /**
   * Handle streaming response (SSE format)
   * FIXED VERSION - Properly handles space-separated JSON objects
   */
  private static async handleStreamingResponse(
    response: Response,
    onChunk: (chunk: string) => void,
    onComplete?: () => void
  ): Promise<string> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = ""; // Buffer for incomplete JSON

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    console.log("🌊 Starting SSE stream parsing...");

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("✅ Stream complete. Total length:", fullText.length);
          if (onComplete) onComplete();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process all complete JSON objects in the buffer
        let startIdx = 0;
        while (startIdx < buffer.length) {
          // Find the start of a JSON object
          const jsonStart = buffer.indexOf("{", startIdx);
          if (jsonStart === -1) break;

          // Find the matching closing brace
          let braceCount = 0;
          let jsonEnd = jsonStart;
          let inString = false;
          let escapeNext = false;

          for (let i = jsonStart; i < buffer.length; i++) {
            const char = buffer[i];

            if (escapeNext) {
              escapeNext = false;
              continue;
            }

            if (char === "\\") {
              escapeNext = true;
              continue;
            }

            if (char === '"') {
              inString = !inString;
              continue;
            }

            if (!inString) {
              if (char === "{") braceCount++;
              if (char === "}") {
                braceCount--;
                if (braceCount === 0) {
                  jsonEnd = i + 1;
                  break;
                }
              }
            }
          }

          // If we found a complete JSON object
          if (braceCount === 0 && jsonEnd > jsonStart) {
            const jsonStr = buffer.substring(jsonStart, jsonEnd);

            try {
              const parsed = JSON.parse(jsonStr);

              // Extract content from SSE message types
              if (parsed.type === "item" && parsed.content) {
                // This is actual content - accumulate and send
                fullText += parsed.content;
                onChunk(parsed.content);
              } else if (parsed.type === "begin") {
                // Stream is starting
                console.log("🚀 Stream begin:", parsed.nodeName || "");
              } else if (parsed.type === "complete") {
                // Stream completed
                console.log(
                  "✅ Stream complete from node:",
                  parsed.nodeName || ""
                );
              }
            } catch (e) {
              console.warn(
                "Failed to parse JSON chunk:",
                jsonStr.substring(0, 50)
              );
            }

            // Move past this JSON object
            startIdx = jsonEnd;
          } else {
            // Incomplete JSON object - wait for more data
            break;
          }
        }

        // Remove processed data from buffer
        buffer = buffer.substring(startIdx);
      }
    } finally {
      reader.releaseLock();
    }

    console.log("📊 Final accumulated text length:", fullText.length);
    return fullText;
  }

  /**
   * Handle standard JSON response
   * Now also handles SSE-formatted responses with wrong Content-Type
   */
  private static async handleJSONResponse(
    response: Response,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const responseText = await response.text();

    console.log("📥 Raw response length:", responseText.length, "characters");

    // Check if this is actually SSE format (even though Content-Type says JSON)
    if (responseText.startsWith('{"type":')) {
      console.log(
        "🔄 Detected SSE format with wrong Content-Type, parsing as SSE..."
      );
      return this.parseSSEFormattedText(responseText, onChunk);
    }

    try {
      const jsonData = JSON.parse(responseText);
      console.log("✅ Parsed JSON successfully");

      // Extract output from various possible response formats
      let markdownText = "";

      if (Array.isArray(jsonData)) {
        // Array response - get first item's output
        console.log("📦 Response is array with", jsonData.length, "items");
        const firstItem = jsonData[0];

        if (firstItem?.output) {
          markdownText = firstItem.output;
          console.log("✅ Found output field in array[0]");
        } else if (typeof firstItem === "string") {
          markdownText = firstItem;
          console.log("✅ Array[0] is plain string");
        } else {
          markdownText = JSON.stringify(firstItem);
          console.log("⚠️ Stringifying array[0] object");
        }
      } else if (jsonData.output) {
        // Object with output field
        markdownText = jsonData.output;
        console.log("✅ Found output field in object");
      } else if (jsonData.text) {
        // Object with text field
        markdownText = jsonData.text;
        console.log("✅ Found text field");
      } else if (jsonData.content) {
        // Object with content field
        markdownText = jsonData.content;
        console.log("✅ Found content field");
      } else {
        // Use whole response
        markdownText = JSON.stringify(jsonData, null, 2);
        console.log("⚠️ No recognized fields, stringifying entire response");
      }

      console.log(
        "📊 Extracted markdown length:",
        markdownText.length,
        "characters"
      );

      // Send the full markdown to the callback
      if (onChunk && markdownText) {
        onChunk(markdownText);
      }

      return markdownText;
    } catch (parseError) {
      console.log("❌ JSON parse failed, using plain text");
      // If JSON parsing fails, return as plain text
      if (onChunk) {
        onChunk(responseText);
      }
      return responseText;
    }
  }

  /**
   * Parse SSE-formatted text (space-separated JSON objects)
   */
  private static parseSSEFormattedText(
    text: string,
    onChunk: (chunk: string) => void
  ): string {
    let fullText = "";
    let buffer = text;
    let startIdx = 0;

    console.log("🌊 Parsing SSE-formatted text...");

    while (startIdx < buffer.length) {
      // Find the start of a JSON object
      const jsonStart = buffer.indexOf("{", startIdx);
      if (jsonStart === -1) break;

      // Find the matching closing brace
      let braceCount = 0;
      let jsonEnd = jsonStart;
      let inString = false;
      let escapeNext = false;

      for (let i = jsonStart; i < buffer.length; i++) {
        const char = buffer[i];

        if (escapeNext) {
          escapeNext = false;
          continue;
        }

        if (char === "\\") {
          escapeNext = true;
          continue;
        }

        if (char === '"') {
          inString = !inString;
          continue;
        }

        if (!inString) {
          if (char === "{") braceCount++;
          if (char === "}") {
            braceCount--;
            if (braceCount === 0) {
              jsonEnd = i + 1;
              break;
            }
          }
        }
      }

      // If we found a complete JSON object
      if (braceCount === 0 && jsonEnd > jsonStart) {
        const jsonStr = buffer.substring(jsonStart, jsonEnd);

        try {
          const parsed = JSON.parse(jsonStr);

          // Extract content from SSE message types
          if (parsed.type === "item" && parsed.content) {
            // This is actual content - accumulate and send
            fullText += parsed.content;
            onChunk(parsed.content);
          } else if (parsed.type === "begin") {
            // Stream is starting
            console.log("🚀 Stream begin:", parsed.nodeName || "");
          } else if (parsed.type === "complete") {
            // Stream completed
            console.log("✅ Stream complete from node:", parsed.nodeName || "");
          }
        } catch (e) {
          console.warn("Failed to parse JSON chunk:", jsonStr.substring(0, 50));
        }

        // Move past this JSON object
        startIdx = jsonEnd;
      } else {
        // Incomplete JSON object - shouldn't happen with full text
        break;
      }
    }

    console.log("📊 Final accumulated text length:", fullText.length);
    return fullText;
  }

  /**
   * Market Research Agent
   */
  static async generateMarketResearch(
    formData: MarketResearchFormData,
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<string> {
    return this.streamResponse(
      WEBHOOK_URLS["market-research"],
      formData,
      onChunk,
      onComplete,
      onError
    );
  }

  /**
   * Sales Page Agent
   */
  static async generateSalesPage(
    formData: SalesPageFormData,
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<string> {
    return this.streamResponse(
      WEBHOOK_URLS["sales-page"],
      formData,
      onChunk,
      onComplete,
      onError
    );
  }

  /**
   * Email Flow Agent
   */
  static async generateEmailFlow(
    formData: EmailFlowFormData,
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<string> {
    return this.streamResponse(
      WEBHOOK_URLS["email-flow"],
      formData,
      onChunk,
      onComplete,
      onError
    );
  }
}
