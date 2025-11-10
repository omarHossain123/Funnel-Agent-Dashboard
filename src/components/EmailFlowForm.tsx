import React, { useState } from "react";
import { EmailFlowFormData } from "../types";
import "./EmailFlowForm.css";

interface EmailFlowFormProps {
  onSubmit: (data: EmailFlowFormData) => void;
  isLoading: boolean;
}

// Local type for user-facing form
interface UserFormData {
  "Business/Product Name": string;
  "Industry/Business Type": string;
  "Target Audience (Be Specific)": string;
  "Top 3 Product Benefits": string;
  "Unique Value Proposition": string;
  "Top 3 Pain Points You Solve": string;
  "Existing Copy Sample (Optional)": string;
}

export const EmailFlowForm: React.FC<EmailFlowFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    "Business/Product Name": "",
    "Industry/Business Type": "",
    "Target Audience (Be Specific)": "",
    "Top 3 Product Benefits": "",
    "Unique Value Proposition": "",
    "Top 3 Pain Points You Solve": "",
    "Existing Copy Sample (Optional)": "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: UserFormData) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData["Business/Product Name"].trim()) {
      newErrors["Business/Product Name"] =
        "Please enter your business or product name";
    }
    if (!formData["Industry/Business Type"].trim()) {
      newErrors["Industry/Business Type"] =
        "Please enter your industry or business type";
    }
    if (!formData["Target Audience (Be Specific)"].trim()) {
      newErrors["Target Audience (Be Specific)"] =
        "Please describe your target audience";
    }
    if (!formData["Top 3 Product Benefits"].trim()) {
      newErrors["Top 3 Product Benefits"] =
        "Please list your top 3 product benefits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData["Unique Value Proposition"].trim()) {
      newErrors["Unique Value Proposition"] =
        "Please enter your unique value proposition";
    }
    if (!formData["Top 3 Pain Points You Solve"].trim()) {
      newErrors["Top 3 Pain Points You Solve"] =
        "Please list the top 3 pain points you solve";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    // Map user form data to expected format with empty strings for extra fields
    const emailFlowData: EmailFlowFormData = {
      ...formData,
      // Hidden fields with empty strings
      "Primary Funnel Type": "",
      "Conversion Goal & Current Performance": "",
      "Brand Voice & Personality": "",
      "Special Offers/Urgency Elements": "",
      "Success Metrics to Track": "",
      "Funnel Strategy (paste here)": "",
    };

    onSubmit(emailFlowData);
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      setErrors({});
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
      setIsSubmitting(false);
    }
  };

  // Progress: 0% at start, 50% at step 2, 100% when submitted
  const getProgress = () => {
    if (isSubmitting) return 100;
    if (currentStep === 1) return 0;
    if (currentStep === 2) return 50;
    return 100;
  };

  const progress = getProgress();

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="email-flow-form">
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
                className={errors["Business/Product Name"] ? "error" : ""}
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
                rows={4}
                className={
                  errors["Target Audience (Be Specific)"] ? "error" : ""
                }
              />
              {errors["Target Audience (Be Specific)"] && (
                <span className="error-message">
                  {errors["Target Audience (Be Specific)"]}
                </span>
              )}
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
                className={errors["Top 3 Product Benefits"] ? "error" : ""}
              />
              {errors["Top 3 Product Benefits"] && (
                <span className="error-message">
                  {errors["Top 3 Product Benefits"]}
                </span>
              )}
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
                className={errors["Unique Value Proposition"] ? "error" : ""}
              />
              {errors["Unique Value Proposition"] && (
                <span className="error-message">
                  {errors["Unique Value Proposition"]}
                </span>
              )}
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
                className={errors["Top 3 Pain Points You Solve"] ? "error" : ""}
              />
              {errors["Top 3 Pain Points You Solve"] && (
                <span className="error-message">
                  {errors["Top 3 Pain Points You Solve"]}
                </span>
              )}
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
              {isLoading
                ? "Generating Email Sequence..."
                : "Generate Email Sequence"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
