import React, { useState, useRef, useEffect } from "react";
import { ExportService } from "../services/exportService";
import { AgentType } from "../types";
import "./ExportMenu.css";

interface ExportMenuProps {
  content: string;
  agentType: AgentType;
  onCopySuccess: () => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  content,
  agentType,
  onCopySuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCopyToClipboard = async () => {
    try {
      await ExportService.copyToClipboard(content);
      onCopySuccess();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleExportMarkdown = () => {
    const filename = ExportService.getSuggestedFilename(agentType, "markdown");
    ExportService.exportAsMarkdown(content, filename);
    setIsOpen(false);
  };

  const handleExportHTML = () => {
    const filename = ExportService.getSuggestedFilename(agentType, "html");
    ExportService.exportAsHTML(content, filename);
    setIsOpen(false);
  };

  const handleExportText = () => {
    const filename = ExportService.getSuggestedFilename(agentType, "markdown");
    ExportService.exportAsText(content, filename.replace(".md", ".txt"));
    setIsOpen(false);
  };

  if (!content) {
    return null;
  }

  return (
    <div className="export-menu" ref={menuRef}>
      <button
        className="export-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Export options"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Export</span>
        <svg
          className={`export-arrow ${isOpen ? "open" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="export-dropdown">
          <button className="export-option" onClick={handleCopyToClipboard}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <div className="export-option-content">
              <span className="export-option-title">Copy to Clipboard</span>
              <span className="export-option-desc">Copy markdown text</span>
            </div>
            <kbd className="export-kbd">⌘C</kbd>
          </button>

          <div className="export-divider" />

          <button className="export-option" onClick={handleExportMarkdown}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="export-option-content">
              <span className="export-option-title">Download Markdown</span>
              <span className="export-option-desc">Save as .md file</span>
            </div>
          </button>

          <button className="export-option" onClick={handleExportHTML}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <div className="export-option-content">
              <span className="export-option-title">Download HTML</span>
              <span className="export-option-desc">Save as .html file</span>
            </div>
          </button>

          <button className="export-option" onClick={handleExportText}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="export-option-content">
              <span className="export-option-title">Download Text</span>
              <span className="export-option-desc">Save as .txt file</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
