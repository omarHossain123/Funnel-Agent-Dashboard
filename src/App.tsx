import React, { useState } from "react";
import { AgentTabs } from "./components/AgentTabs";
import { MarketResearchForm } from "./components/MarketResearchForm";
import { SalesPageForm } from "./components/SalesPageForm";
import { EmailFlowForm } from "./components/EmailFlowForm";
import { OutputPanel } from "./components/OutputPanel";
import { ToastContainer, ToastType } from "./components/Toast";
import {
  AgentType,
  MarketResearchFormData,
  SalesPageFormData,
  EmailFlowFormData,
} from "./types";
import { N8NService } from "./services/n8nService";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./App.css";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface AgentState {
  output: string;
  isLoading: boolean;
  error?: string;
}

function App() {
  // Current active agent
  const [activeAgent, setActiveAgent] = useLocalStorage<AgentType>(
    "active-agent",
    "market-research"
  );

  // Agent states
  const [agentStates, setAgentStates] = useState<Record<AgentType, AgentState>>(
    {
      "market-research": { output: "", isLoading: false },
      "sales-page": { output: "", isLoading: false },
      "email-flow": { output: "", isLoading: false },
    }
  );

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add toast notification
  const addToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  // Remove toast notification
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Handle Market Research submission
  const handleMarketResearchSubmit = async (
    formData: MarketResearchFormData
  ) => {
    // Reset state first
    setAgentStates((prev) => ({
      ...prev,
      "market-research": {
        output: "",
        isLoading: true,
        error: undefined,
      },
    }));

    let accumulatedOutput = "";

    try {
      await N8NService.generateMarketResearch(
        formData,
        (chunk) => {
          // Accumulate chunks locally first
          accumulatedOutput += chunk;
          // Then update state with accumulated output
          setAgentStates((prev) => ({
            ...prev,
            "market-research": {
              ...prev["market-research"],
              output: accumulatedOutput,
            },
          }));
        },
        () => {
          setAgentStates((prev) => ({
            ...prev,
            "market-research": {
              ...prev["market-research"],
              isLoading: false,
            },
          }));
          addToast("Market research generated successfully!", "success");
        },
        (error) => {
          setAgentStates((prev) => ({
            ...prev,
            "market-research": {
              ...prev["market-research"],
              isLoading: false,
              error: error.message,
            },
          }));
          addToast(`Error: ${error.message}`, "error");
        }
      );
    } catch (err) {
      console.error("Market Research Error:", err);
      setAgentStates((prev) => ({
        ...prev,
        "market-research": {
          ...prev["market-research"],
          isLoading: false,
          error:
            err instanceof Error
              ? err.message
              : "Failed to generate market research",
        },
      }));
      addToast("Failed to generate market research", "error");
    }
  };

  // Handle Sales Page submission
  const handleSalesPageSubmit = async (formData: SalesPageFormData) => {
    // Reset state first
    setAgentStates((prev) => ({
      ...prev,
      "sales-page": {
        output: "",
        isLoading: true,
        error: undefined,
      },
    }));

    let accumulatedOutput = "";

    try {
      await N8NService.generateSalesPage(
        formData,
        (chunk) => {
          // Accumulate chunks locally first
          accumulatedOutput += chunk;
          // Then update state with accumulated output
          setAgentStates((prev) => ({
            ...prev,
            "sales-page": {
              ...prev["sales-page"],
              output: accumulatedOutput,
            },
          }));
        },
        () => {
          setAgentStates((prev) => ({
            ...prev,
            "sales-page": {
              ...prev["sales-page"],
              isLoading: false,
            },
          }));
          addToast("Sales page generated successfully!", "success");
        },
        (error) => {
          setAgentStates((prev) => ({
            ...prev,
            "sales-page": {
              ...prev["sales-page"],
              isLoading: false,
              error: error.message,
            },
          }));
          addToast(`Error: ${error.message}`, "error");
        }
      );
    } catch (err) {
      console.error("Sales Page Error:", err);
      setAgentStates((prev) => ({
        ...prev,
        "sales-page": {
          ...prev["sales-page"],
          isLoading: false,
          error:
            err instanceof Error
              ? err.message
              : "Failed to generate sales page",
        },
      }));
      addToast("Failed to generate sales page", "error");
    }
  };

  // Handle Email Flow submission
  const handleEmailFlowSubmit = async (formData: EmailFlowFormData) => {
    // Reset state first
    setAgentStates((prev) => ({
      ...prev,
      "email-flow": {
        output: "",
        isLoading: true,
        error: undefined,
      },
    }));

    let accumulatedOutput = "";

    try {
      await N8NService.generateEmailFlow(
        formData,
        (chunk) => {
          // Accumulate chunks locally first
          accumulatedOutput += chunk;
          // Then update state with accumulated output
          setAgentStates((prev) => ({
            ...prev,
            "email-flow": {
              ...prev["email-flow"],
              output: accumulatedOutput,
            },
          }));
        },
        () => {
          setAgentStates((prev) => ({
            ...prev,
            "email-flow": {
              ...prev["email-flow"],
              isLoading: false,
            },
          }));
          addToast("Email sequence generated successfully!", "success");
        },
        (error) => {
          setAgentStates((prev) => ({
            ...prev,
            "email-flow": {
              ...prev["email-flow"],
              isLoading: false,
              error: error.message,
            },
          }));
          addToast(`Error: ${error.message}`, "error");
        }
      );
    } catch (err) {
      console.error("Email Flow Error:", err);
      setAgentStates((prev) => ({
        ...prev,
        "email-flow": {
          ...prev["email-flow"],
          isLoading: false,
          error:
            err instanceof Error
              ? err.message
              : "Failed to generate email sequence",
        },
      }));
      addToast("Failed to generate email sequence", "error");
    }
  };

  // Handle agent tab change
  const handleAgentChange = (agent: AgentType) => {
    setActiveAgent(agent);
  };

  // Handle copy success
  const handleCopySuccess = () => {
    addToast("Copied to clipboard!", "success");
  };

  // Get current agent state
  const currentState = agentStates[activeAgent];

  // Check which agents have output
  const hasOutput: Record<AgentType, boolean> = {
    "market-research": agentStates["market-research"].output.length > 0,
    "sales-page": agentStates["sales-page"].output.length > 0,
    "email-flow": agentStates["email-flow"].output.length > 0,
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <div className="logo">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="app-title">Agents Dashboard</h1>
              </div>
            </div>
            <div className="header-right">
              <div className="status-badge">
                <span className="status-dot"></span>
                <span>All Systems Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          {/* Agent Tabs */}
          <AgentTabs
            activeAgent={activeAgent}
            onAgentChange={handleAgentChange}
            hasOutput={hasOutput}
          />

          {/* Form & Output Grid */}
          <div className="app-grid">
            {/* Left Column: Forms */}
            <div className="form-column">
              {activeAgent === "market-research" && (
                <MarketResearchForm
                  onSubmit={handleMarketResearchSubmit}
                  isLoading={currentState.isLoading}
                />
              )}
              {activeAgent === "sales-page" && (
                <SalesPageForm
                  onSubmit={handleSalesPageSubmit}
                  isLoading={currentState.isLoading}
                />
              )}
              {activeAgent === "email-flow" && (
                <EmailFlowForm
                  onSubmit={handleEmailFlowSubmit}
                  isLoading={currentState.isLoading}
                />
              )}
            </div>

            {/* Right Column: Output */}
            <div className="output-column">
              <OutputPanel
                output={currentState.output}
                isLoading={currentState.isLoading}
                error={currentState.error}
                agentType={activeAgent}
                onCopySuccess={handleCopySuccess}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
