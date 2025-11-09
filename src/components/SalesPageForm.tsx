import React, { useState } from "react";
import { SalesPageFormData } from "../types";
import "./SalesPageForm.css";

interface SalesPageFormProps {
  onSubmit: (data: SalesPageFormData) => void;
  isLoading: boolean;
}

export const SalesPageForm: React.FC<SalesPageFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<SalesPageFormData>({
    "Business/Product Name": "",
    "Industry/Business Type": "",
    "Target Audience (Be Specific)": "",
    "Top 3 Product Benefits": "",
    "Unique Value Proposition": "",
    "Top 3 Pain Points You Solve": "",
    "Existing Copy Sample (Optional)": "",
    "Funnel Strategy (paste here)": "",
    "Market Research Data (paste here)": "",
    "Primary Funnel Type": "VSL Funnel",
    "Brand Voice & Personality": "",
    "Special Offers / Urgency Elements": "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData["Business/Product Name"].trim()) {
      newErrors["Business/Product Name"] = "Business name is required";
    }
    if (!formData["Industry/Business Type"].trim()) {
      newErrors["Industry/Business Type"] = "Industry type is required";
    }
    if (!formData["Target Audience (Be Specific)"].trim()) {
      newErrors["Target Audience (Be Specific)"] =
        "Target audience is required";
    }
    if (!formData["Unique Value Proposition"].trim()) {
      newErrors["Unique Value Proposition"] = "Value proposition is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="sales-page-form-container">
      <form onSubmit={handleSubmit} className="sales-page-form">
        <div className="form-header">
          <h2 className="form-title">Sales Page Generator</h2>
          <p className="form-subtitle">
            Create high-converting sales page copy
          </p>
        </div>

        {/* Business Information */}
        <div className="form-section">
          <h3 className="section-label">Business Information</h3>

          <div className="form-group">
            <label htmlFor="businessName">
              Business/Product Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="businessName"
              name="Business/Product Name"
              value={formData["Business/Product Name"]}
              onChange={handleChange}
              placeholder="Enter your business name"
              className={errors["Business/Product Name"] ? "error" : ""}
              disabled={isLoading}
            />
            {errors["Business/Product Name"] && (
              <span className="error-message">
                {errors["Business/Product Name"]}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="industryType">
              Industry/Business Type <span className="required">*</span>
            </label>
            <input
              type="text"
              id="industryType"
              name="Industry/Business Type"
              value={formData["Industry/Business Type"]}
              onChange={handleChange}
              placeholder="e.g., SaaS, E-commerce, Coaching"
              className={errors["Industry/Business Type"] ? "error" : ""}
              disabled={isLoading}
            />
            {errors["Industry/Business Type"] && (
              <span className="error-message">
                {errors["Industry/Business Type"]}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="targetAudience">
              Target Audience <span className="required">*</span>
            </label>
            <textarea
              id="targetAudience"
              name="Target Audience (Be Specific)"
              value={formData["Target Audience (Be Specific)"]}
              onChange={handleChange}
              placeholder="Describe your ideal customer"
              rows={3}
              className={errors["Target Audience (Be Specific)"] ? "error" : ""}
              disabled={isLoading}
            />
            {errors["Target Audience (Be Specific)"] && (
              <span className="error-message">
                {errors["Target Audience (Be Specific)"]}
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="form-section">
          <h3 className="section-label">Product Details</h3>

          <div className="form-group">
            <label htmlFor="valueProp">
              Unique Value Proposition <span className="required">*</span>
            </label>
            <textarea
              id="valueProp"
              name="Unique Value Proposition"
              value={formData["Unique Value Proposition"]}
              onChange={handleChange}
              placeholder="What makes you different?"
              rows={3}
              className={errors["Unique Value Proposition"] ? "error" : ""}
              disabled={isLoading}
            />
            {errors["Unique Value Proposition"] && (
              <span className="error-message">
                {errors["Unique Value Proposition"]}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="productBenefits">Top 3 Product Benefits</label>
            <textarea
              id="productBenefits"
              name="Top 3 Product Benefits"
              value={formData["Top 3 Product Benefits"]}
              onChange={handleChange}
              placeholder="List the top 3 benefits"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="painPoints">Top 3 Pain Points You Solve</label>
            <textarea
              id="painPoints"
              name="Top 3 Pain Points You Solve"
              value={formData["Top 3 Pain Points You Solve"]}
              onChange={handleChange}
              placeholder="What problems do you solve?"
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Funnel Configuration */}
        <div className="form-section">
          <h3 className="section-label">Funnel Configuration</h3>

          <div className="form-group">
            <label htmlFor="funnelType">Primary Funnel Type</label>
            <select
              id="funnelType"
              name="Primary Funnel Type"
              value={formData["Primary Funnel Type"]}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="VSL Funnel">VSL Funnel</option>
              <option value="Webinar Funnel">Webinar Funnel</option>
              <option value="Call Funnel">Call Funnel</option>
              <option value="Challenge Funnel">Challenge Funnel</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="brandVoice">Brand Voice & Personality</label>
            <input
              type="text"
              id="brandVoice"
              name="Brand Voice & Personality"
              value={formData["Brand Voice & Personality"]}
              onChange={handleChange}
              placeholder="e.g., Professional, Friendly, Bold"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialOffers">
              Special Offers / Urgency Elements
            </label>
            <textarea
              id="specialOffers"
              name="Special Offers / Urgency Elements"
              value={formData["Special Offers / Urgency Elements"]}
              onChange={handleChange}
              placeholder="e.g., Limited time discount, bonus packages"
              rows={2}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Strategy & Research Inputs */}
        <div className="form-section">
          <h3 className="section-label">Strategy & Research (Optional)</h3>

          <div className="form-group">
            <label htmlFor="funnelStrategy">
              Funnel Strategy
              <span className="help-text">
                (Paste your funnel strategy document)
              </span>
            </label>
            <textarea
              id="funnelStrategy"
              name="Funnel Strategy (paste here)"
              value={formData["Funnel Strategy (paste here)"]}
              onChange={handleChange}
              placeholder="Paste your funnel strategy here..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="marketResearch">
              Market Research Data
              <span className="help-text">
                (Paste output from Market Research agent)
              </span>
            </label>
            <textarea
              id="marketResearch"
              name="Market Research Data (paste here)"
              value={formData["Market Research Data (paste here)"]}
              onChange={handleChange}
              placeholder="Paste market research data here..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="existingCopy">
              Existing Copy Sample (optional)
            </label>
            <textarea
              id="existingCopy"
              name="Existing Copy Sample (Optional)"
              value={formData["Existing Copy Sample (Optional)"]}
              onChange={handleChange}
              placeholder="Paste any existing copy"
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                Generating Sales Page...
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Sales Page
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
