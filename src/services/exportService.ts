import { ExportFormat } from "../types";

/**
 * Service for exporting generated content in various formats
 */
export class ExportService {
  /**
   * Export as Markdown file
   */
  static exportAsMarkdown(content: string, filename: string = "output.md") {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    this.downloadBlob(blob, filename);
  }

  /**
   * Export as HTML file
   */
  static exportAsHTML(content: string, filename: string = "output.html") {
    const htmlContent = this.wrapMarkdownInHTML(content);
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    this.downloadBlob(blob, filename);
  }

  /**
   * Export as plain text
   */
  static exportAsText(content: string, filename: string = "output.txt") {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    this.downloadBlob(blob, filename);
  }

  /**
   * Copy to clipboard
   */
  static async copyToClipboard(content: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = content;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(textArea);
      }
    }
  }

  /**
   * Download blob as file
   */
  private static downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Wrap markdown content in HTML template
   */
  private static wrapMarkdownInHTML(content: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Generated Content</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    code {
      background-color: #f6f8fa;
      border-radius: 3px;
      padding: 2px 6px;
      font-family: 'Courier New', monospace;
    }
    pre {
      background-color: #f6f8fa;
      border-radius: 6px;
      padding: 16px;
      overflow: auto;
    }
    blockquote {
      border-left: 4px solid #dfe2e5;
      padding-left: 16px;
      color: #6a737d;
    }
    ul, ol {
      padding-left: 28px;
    }
    li {
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <pre>${this.escapeHtml(content)}</pre>
</body>
</html>`;
  }

  /**
   * Escape HTML special characters
   */
  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Get suggested filename based on agent type and timestamp
   */
  static getSuggestedFilename(agentType: string, format: ExportFormat): string {
    const timestamp = new Date().toISOString().split("T")[0];
    const baseFilename = `${agentType}-${timestamp}`;

    switch (format) {
      case "markdown":
        return `${baseFilename}.md`;
      case "html":
        return `${baseFilename}.html`;
      case "pdf":
        return `${baseFilename}.pdf`;
      case "docx":
        return `${baseFilename}.docx`;
      default:
        return `${baseFilename}.txt`;
    }
  }
}
