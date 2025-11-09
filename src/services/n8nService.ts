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
   */
  private static async handleStreamingResponse(
    response: Response,
    onChunk: (chunk: string) => void,
    onComplete?: () => void
  ): Promise<string> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (onComplete) onComplete();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

        // Parse SSE data format (data: {...})
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6); // Remove "data: " prefix
            fullText += data;
            onChunk(data);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return fullText;
  }

  /**
   * Handle standard JSON response
   */
  private static async handleJSONResponse(
    response: Response,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const responseText = await response.text();

    console.log("Raw response length:", responseText.length, "characters");

    try {
      const jsonData = JSON.parse(responseText);
      console.log("Parsed JSON successfully");

      // Extract output from various possible response formats
      let markdownText = "";

      if (Array.isArray(jsonData)) {
        // Array response - get first item's output
        console.log("Response is array, extracting first item");
        markdownText =
          jsonData[0]?.output || JSON.stringify(jsonData[0]) || responseText;
      } else if (jsonData.output) {
        // Object with output field
        console.log("Found output field");
        markdownText = jsonData.output;
      } else if (jsonData.text) {
        // Object with text field
        console.log("Found text field");
        markdownText = jsonData.text;
      } else {
        // Use whole response
        console.log("Using whole response as markdown");
        markdownText = JSON.stringify(jsonData, null, 2);
      }

      console.log(
        "✅ Extracted markdown length:",
        markdownText.length,
        "characters"
      );

      // Send the full markdown to the callback
      if (onChunk && markdownText) {
        onChunk(markdownText);
      }

      return markdownText;
    } catch (parseError) {
      console.log("JSON parse failed, using plain text");
      // If JSON parsing fails, return as plain text
      if (onChunk) {
        onChunk(responseText);
      }
      return responseText;
    }
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
