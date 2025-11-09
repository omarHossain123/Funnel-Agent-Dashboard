import React, { useState } from "react";
import { MarketResearchForm } from "./components/MarketResearchForm";
import { OutputPanel } from "./components/OutputPanel";
import { MarketResearchFormData } from "./types";
import { N8NService } from "./services/n8nService";
import "./App.css";

function App() {
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleFormSubmit = async (formData: MarketResearchFormData) => {
    setIsLoading(true);
    setError(undefined);
    setOutput("");

    try {
      // Call the N8N webhook with streaming support
      await N8NService.generateMarketResearch(formData, (chunk) => {
        // Update output in real-time as chunks arrive
        setOutput((prev) => prev + chunk);
      });
    } catch (err) {
      console.error("Error generating research:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate research. Please check your N8N webhook URL and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">AI Market Research Dashboard</h1>
          <p className="app-subtitle">
            Generate comprehensive market research powered by AI
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="app-grid">
            <div className="form-column">
              <MarketResearchForm
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
              />
            </div>

            <div className="output-column">
              <OutputPanel
                output={output}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
