import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./OutputPanel.css";

interface OutputPanelProps {
  output: string;
  isLoading: boolean;
  error?: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  isLoading,
  error,
}) => {
  return (
    <div className="output-panel">
      <div className="output-header">
        <div className="output-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="output-title">Market Research Output</h2>
          <p className="output-subtitle">Your research will appear here</p>
        </div>
      </div>

      <div className="output-content">
        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">Generating your market research...</p>
            <p className="loading-subtext">This may take a minute or two</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Something went wrong</h3>
            <p className="error-message">{error}</p>
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
            <p className="empty-text">
              Complete the form and click Generate Research
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
