// Form data structure matching the N8N workflow
export interface MarketResearchFormData {
  "Business/Product Name": string;
  "Industry/Business Type": string;
  "Target Audience (Be Specific)": string;
  "Top 3 Product Benefits": string;
  "Unique Value Proposition": string;
  "Top 3 Pain Points You Solve": string;
  "Existing Copy Sample (Optional)": string;
  "Primary Funnel Type": string;
  "Conversion Goal & Current Performance": string;
  "Brand Voice & Personality": string;
  "Special Offers/Urgency Elements": string;
  "Success Metrics to Track": string;
  "Funnel Strategy (paste here)": string;
}

// Response from N8N
export interface AgentResponse {
  output: string;
  status: "loading" | "success" | "error";
  error?: string;
}

// Agent types
export type AgentType = "market-research" | "sales-page" | "email-flow";
