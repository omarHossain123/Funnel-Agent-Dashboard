import { MarketResearchFormData } from "../types";

// N8N webhook URLs
const WEBHOOK_URLS = {
  "market-research":
    "https://omar-h.app.n8n.cloud/webhook-test/cb7f1e13-2985-4045-a98c-1f2d327299a8",
  "sales-page":
    "https://omar-h.app.n8n.cloud/webhook-test/9b68b053-a43d-4977-a11b-c4d470ac7bc3",
  "email-flow":
    "https://omar-h.app.n8n.cloud/webhook-test/c5c70d5e-9d36-4daa-8536-e002d29bf8f1",
};

export class N8NService {
  /**
   * Send form data to Market Research Agent
   */
  static async generateMarketResearch(
    formData: MarketResearchFormData,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      const response = await fetch(WEBHOOK_URLS["market-research"], {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the full response as text first
      const responseText = await response.text();

      try {
        // Try to parse as JSON
        const jsonData = JSON.parse(responseText);

        // Extract the output field if it exists
        let markdownText = "";

        if (Array.isArray(jsonData)) {
          // If it's an array, get the first item's output
          markdownText = jsonData[0]?.output || responseText;
        } else if (jsonData.output) {
          // If it's an object with output field
          markdownText = jsonData.output;
        } else {
          // Otherwise use the whole response
          markdownText = responseText;
        }

        // Call the callback with the full markdown
        if (onChunk) {
          onChunk(markdownText);
        }

        return markdownText;
      } catch (parseError) {
        // If JSON parsing fails, return as plain text
        if (onChunk) {
          onChunk(responseText);
        }
        return responseText;
      }
    } catch (error) {
      console.error("Error calling N8N webhook:", error);
      throw error;
    }
  }

  /**
   * Send data to Sales Page Agent
   */
  static async generateSalesPage(
    formData: Partial<MarketResearchFormData> & {
      "Market Research Data (paste here)": string;
    },
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      const response = await fetch(WEBHOOK_URLS["sales-page"], {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;

          if (onChunk) {
            onChunk(chunk);
          }
        }
      }

      return fullText;
    } catch (error) {
      console.error("Error calling N8N webhook:", error);
      throw error;
    }
  }

  /**
   * Send data to Email Flow Agent
   */
  static async generateEmailFlow(
    formData: MarketResearchFormData,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      const response = await fetch(WEBHOOK_URLS["email-flow"], {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;

          if (onChunk) {
            onChunk(chunk);
          }
        }
      }

      return fullText;
    } catch (error) {
      console.error("Error calling N8N webhook:", error);
      throw error;
    }
  }
}
