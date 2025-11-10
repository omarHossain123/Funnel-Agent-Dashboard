import React, { useState, useEffect, useMemo } from "react";
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
  const [currentPage, setCurrentPage] = useState(0);

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

  // Split content into shorter pages - more aggressive splitting
  const pages = useMemo(() => {
    if (!output) return [output];

    // Strategy 1: Split by H2 headings (##) - most common section divider
    const h2Splits = output
      .split(/(?=^## [^#])/m)
      .filter((page) => page.trim());

    if (h2Splits.length > 1) {
      // If any H2 section is still too long (>3000 chars), split it further
      const refinedPages: string[] = [];

      for (const section of h2Splits) {
        if (section.length <= 3000) {
          refinedPages.push(section);
        } else {
          // Split long sections by H3 headings (###)
          const h3Splits = section
            .split(/(?=^### [^#])/m)
            .filter((s) => s.trim());

          if (h3Splits.length > 1) {
            refinedPages.push(...h3Splits);
          } else {
            // If still no H3s, split by paragraphs at ~2000 char chunks
            const chunks = splitByParagraphs(section, 2000);
            refinedPages.push(...chunks);
          }
        }
      }

      return refinedPages;
    }

    // Strategy 2: If no H2 headings, try H1 headings
    const h1Splits = output.split(/(?=^# [^#])/m).filter((page) => page.trim());

    if (h1Splits.length > 1) {
      return h1Splits;
    }

    // Strategy 3: Fallback - split by smaller character chunks (2000 chars)
    return splitByParagraphs(output, 2000);
  }, [output]);

  // Helper function to split by paragraphs while keeping them together
  const splitByParagraphs = (text: string, maxChars: number): string[] => {
    const pages: string[] = [];
    let currentChunk = "";
    const paragraphs = text.split(/\n\n+/);

    for (const para of paragraphs) {
      if (currentChunk.length + para.length > maxChars && currentChunk) {
        pages.push(currentChunk.trim());
        currentChunk = para;
      } else {
        currentChunk += (currentChunk ? "\n\n" : "") + para;
      }
    }

    if (currentChunk) {
      pages.push(currentChunk.trim());
    }

    return pages.length > 0 ? pages : [text];
  };

  const totalPages = pages.length;
  const currentPageContent = pages[currentPage] || "";

  // Reset to page 0 when output changes
  useEffect(() => {
    setCurrentPage(0);
  }, [output]);

  // Keyboard navigation
  useEffect(() => {
    if (!output) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentPage < totalPages - 1) {
        setCurrentPage((prev) => prev + 1);
      } else if (e.key === "ArrowLeft" && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, output]);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const agentInfo = getAgentInfo();

  return (
    <div className="output-panel">
      <div className="output-header">
        <div className="output-header-left">
          <div className={`output-icon ${agentType}`}>{agentInfo.icon}</div>
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
          <>
            <div className="markdown-output paginated-view">
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
                    <blockquote className="md-blockquote">
                      {children}
                    </blockquote>
                  ),
                  code: ({
                    node,
                    inline,
                    className,
                    children,
                    ...props
                  }: any) =>
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
                {currentPageContent}
              </ReactMarkdown>
            </div>

            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="20"
                    height="20"
                  >
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="pagination-info">
                  <span className="page-number">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <span className="keyboard-hint">Use ← → arrow keys</span>
                </div>

                <button
                  className="pagination-btn"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="20"
                    height="20"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
