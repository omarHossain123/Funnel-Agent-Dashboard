import React from "react";
import { AgentType } from "../types";
import "./AgentTabs.css";

interface AgentTabsProps {
  activeAgent: AgentType;
  onAgentChange: (agent: AgentType) => void;
  hasOutput: Record<AgentType, boolean>;
}

const AGENTS = [
  {
    id: "market-research" as AgentType,
    name: "Market Research",
    description: "Deep market analysis & insights",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: "#3b82f6",
  },
  {
    id: "sales-page" as AgentType,
    name: "Sales Page",
    description: "High-converting sales copy",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "#10b981",
  },
  {
    id: "email-flow" as AgentType,
    name: "Email Flow",
    description: "Value-dense email flows",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: "#f59e0b",
  },
];

export const AgentTabs: React.FC<AgentTabsProps> = ({
  activeAgent,
  onAgentChange,
  hasOutput,
}) => {
  return (
    <div className="agent-tabs">
      <div className="tabs-header">
        <h2 className="tabs-title">Select an agent to generate content</h2>
      </div>

      <div className="tabs-container">
        {AGENTS.map((agent) => {
          const isActive = activeAgent === agent.id;
          const hasGeneratedOutput = hasOutput[agent.id];

          return (
            <button
              key={agent.id}
              className={`tab-button ${isActive ? "active" : ""}`}
              onClick={() => onAgentChange(agent.id)}
              style={
                {
                  "--tab-color": agent.color,
                } as React.CSSProperties
              }
            >
              <div className="tab-icon-wrapper">
                <div className="tab-icon">{agent.icon}</div>
                {hasGeneratedOutput && (
                  <div className="tab-badge" title="Has generated content">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="12"
                      height="12"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="tab-content">
                <h3 className="tab-name">{agent.name}</h3>
                <p className="tab-description">{agent.description}</p>
              </div>

              {isActive && <div className="tab-active-indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
