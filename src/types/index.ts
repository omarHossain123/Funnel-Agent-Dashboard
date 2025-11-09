// ==========================================
// FORM DATA TYPES
// ==========================================

export interface BaseFormData {
  "Business/Product Name": string;
  "Industry/Business Type": string;
  "Target Audience (Be Specific)": string;
  "Top 3 Product Benefits": string;
  "Unique Value Proposition": string;
  "Top 3 Pain Points You Solve": string;
  "Existing Copy Sample (Optional)": string;
}

export interface MarketResearchFormData extends BaseFormData {
  "Primary Funnel Type": string;
  "Conversion Goal & Current Performance": string;
  "Brand Voice & Personality": string;
  "Special Offers/Urgency Elements": string;
  "Success Metrics to Track": string;
  "Funnel Strategy (paste here)": string;
}

export interface SalesPageFormData extends BaseFormData {
  "Funnel Strategy (paste here)": string;
  "Market Research Data (paste here)": string;
  "Primary Funnel Type": string;
  "Brand Voice & Personality": string;
  "Special Offers / Urgency Elements": string;
}

export interface EmailFlowFormData extends BaseFormData {
  "Primary Funnel Type": string;
  "Conversion Goal & Current Performance": string;
  "Brand Voice & Personality": string;
  "Special Offers/Urgency Elements": string;
  "Success Metrics to Track": string;
  "Funnel Strategy (paste here)": string;
}

// ==========================================
// AGENT TYPES
// ==========================================

export type AgentType = "market-research" | "sales-page" | "email-flow";

export interface AgentConfig {
  id: AgentType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// ==========================================
// RESPONSE TYPES
// ==========================================

export interface AgentResponse {
  output: string;
  status: "idle" | "loading" | "success" | "error";
  error?: string;
  timestamp?: number;
}

// ==========================================
// SESSION TYPES
// ==========================================

export interface AgentSession {
  agentType: AgentType;
  formData: any;
  output: string;
  timestamp: number;
  id: string;
}

export interface AppSession {
  currentAgent: AgentType;
  sessions: Record<AgentType, AgentSession | null>;
  lastUpdated: number;
}

// ==========================================
// EXPORT TYPES
// ==========================================

export type ExportFormat = "markdown" | "pdf" | "docx" | "html";

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeMetadata?: boolean;
}
