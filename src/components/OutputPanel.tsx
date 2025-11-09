import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExportMenu } from "./ExportMenu";
import { AgentType } from "../types";
import "./OutputPanel.css";

interface OutputPanelProps {
  output: string;
  isLoading: boolean;
  error?: string;
  agentType: AgentType;
  onCopySuccess: () => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  isLoading,
  error,
  agentType,
  onCopySuccess,
}) => {
  const getAgentInfo = () => {
    switch (agentType) {
      case "market-research":
        return {
          title: "Market Research Output",
          subtitle: "Deep market analysis & insights",
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
        };
      case "sales-page":
        return {
          title: "Sales Page Output",
          subtitle: "High-converting sales copy",
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
        };
      case "email-flow":
        return {
          title: "Email Sequence Output",
          subtitle: "Value-dense email flows",
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
        };
    }
  };

  const agentInfo = getAgentInfo();

  return (
    <div className="output-panel">
      <div className="output-header">
        <div className="output-header-left">
          <div className="output-icon">{agentInfo.icon}</div>
          <div>
            <h2 className="output-title">{agentInfo.title}</h2>
            <p className="output-subtitle">{agentInfo.subtitle}</p>
          </div>
        </div>

        <div className="output-header-right">
          {output && !isLoading && !error && (
            <ExportMenu
              content={output}
              agentType={agentType}
              onCopySuccess={onCopySuccess}
            />
          )}
        </div>
      </div>

      <div className="output-content">
        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner-wrapper">
              <div className="loading-spinner"></div>
              <div className="loading-pulse"></div>
            </div>
            <p className="loading-text">Generating your content...</p>
            <p className="loading-subtext">
              AI is analyzing your inputs and crafting the perfect response
            </p>
            {output && (
              <div className="loading-preview">
                <p className="loading-preview-label">Preview:</p>
                <div className="loading-preview-text">
                  {output.slice(0, 200)}...
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Something went wrong</h3>
            <p className="error-message">{error}</p>
            <button
              className="error-retry"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && !output && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="empty-text">Fill out the form and generate content</p>
            <p className="empty-subtext">
              Your AI-generated content will appear here
            </p>
          </div>
        )}

        {!isLoading && !error && output && (
          <div className="markdown-output">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
                h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
                h3: ({ children }) => <h3 className="md-h3">{children}</h3>,
                h4: ({ children }) => <h4 className="md-h4">{children}</h4>,
                p: ({ children }) => <p className="md-p">{children}</p>,
                ul: ({ children }) => <ul className="md-ul">{children}</ul>,
                ol: ({ children }) => <ol className="md-ol">{children}</ol>,
                li: ({ children }) => <li className="md-li">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="md-blockquote">{children}</blockquote>
                ),
                code: ({ node, inline, className, children, ...props }: any) =>
                  inline ? (
                    <code className="md-code-inline" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="md-code-block" {...props}>
                      {children}
                    </code>
                  ),
                strong: ({ children }) => (
                  <strong className="md-strong">{children}</strong>
                ),
                em: ({ children }) => <em className="md-em">{children}</em>,
                hr: () => <hr className="md-hr" />,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="md-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {output}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
