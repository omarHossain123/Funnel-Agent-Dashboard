import React, { useState } from "react";
import { MarketResearchFormData } from "../types";
import "./MarketResearchForm.css";

interface MarketResearchFormProps {
  onSubmit: (data: MarketResearchFormData) => void;
  isLoading: boolean;
}

export const MarketResearchForm: React.FC<MarketResearchFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MarketResearchFormData>({
    "Business/Product Name": "",
    "Industry/Business Type": "",
    "Target Audience (Be Specific)": "",
    "Top 3 Product Benefits": "",
    "Unique Value Proposition": "",
    "Top 3 Pain Points You Solve": "",
    "Existing Copy Sample (Optional)": "",
    // Hidden fields - send empty strings to N8N
    "Primary Funnel Type": "",
    "Conversion Goal & Current Performance": "",
    "Brand Voice & Personality": "",
    "Special Offers/Urgency Elements": "",
    "Success Metrics to Track": "",
    "Funnel Strategy (paste here)": "",
  });

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / 2) * 100;

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="market-research-form">
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <span className="step-text">Step {currentStep} of 2</span>
            <span className="progress-text">{progress}% Complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2 className="section-title">Business Information</h2>
            <p className="section-subtitle">Tell us about your business</p>

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
                placeholder="Enter your business or product name"
                required
              />
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
                required
              />
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
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="productBenefits">
                Top 3 Product Benefits <span className="required">*</span>
              </label>
              <textarea
                id="productBenefits"
                name="Top 3 Product Benefits"
                value={formData["Top 3 Product Benefits"]}
                onChange={handleChange}
                placeholder="List the top 3 benefits"
                rows={4}
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Value & Pain Points */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2 className="section-title">Value & Pain Points</h2>
            <p className="section-subtitle">Define your value proposition</p>

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
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="painPoints">
                Top 3 Pain Points You Solve <span className="required">*</span>
              </label>
              <textarea
                id="painPoints"
                name="Top 3 Pain Points You Solve"
                value={formData["Top 3 Pain Points You Solve"]}
                onChange={handleChange}
                placeholder="What problems do you solve?"
                rows={4}
                required
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
                rows={5}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              ← Back
            </button>
          )}

          {currentStep < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Generating Research..." : "Generate Research"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
