# Loan Predictor Pro

Loan Predictor Pro is a modern full-stack web application that helps assess the risk of loan default using financial and credit-related information. The platform provides transparent loan approval decisions, detailed risk analysis, personalized recommendations, prediction history tracking, and downloadable PDF reports.


## Overview

Loan Predictor Pro simplifies the process of evaluating loan applications by analyzing critical financial indicators such as credit score, annual income, debt-to-income ratio, employment history, and previous defaults.

The application calculates a risk score, estimates the probability of default, and provides a clear explanation of the decision-making process. The system is designed with transparency, security, and user experience in mind.

---

## Features

### Loan Risk Assessment

* Predict loan default probability
* Automated loan approval/rejection decisions
* Risk score calculation based on financial indicators
* Risk categorization (Low, Medium, High)
* Detailed explanation of prediction results

### Dashboard & Analytics

* Interactive result dashboard
* Visual risk analysis charts
* Historical prediction records
* Track previous loan applications

### Reporting

* Download prediction reports as PDF
* Detailed risk factor breakdown
* Personalized financial recommendations

### Security

* Secure user authentication
* Protected routes
* Row-Level Security (RLS)
* User-specific prediction history

### User Experience

* Responsive design
* Modern UI components
* Real-time prediction results
* Intuitive workflow

---

## Prediction Factors

The risk engine evaluates multiple financial parameters:

| Factor               | Description                  |
| -------------------- | ---------------------------- |
| Credit Score         | Applicant's creditworthiness |
| Annual Income        | Total yearly earnings        |
| Loan Amount          | Requested loan amount        |
| Debt-to-Income Ratio | Existing debt obligations    |
| Employment Length    | Job stability                |
| Previous Defaults    | Historical loan defaults     |
| Open Accounts        | Active credit accounts       |
| Loan Purpose         | Intended use of the loan     |

---

## Workflow

### 1. Authentication

Users create an account or sign in securely using Supabase Authentication.

### 2. Loan Application

Applicants enter their financial and credit information through the loan prediction form.

### 3. Risk Evaluation

The system analyzes:

* Credit Risk
* Income Stability
* Debt Burden
* Loan Affordability
* Employment History
* Previous Default Records

### 4. Decision Generation

The backend calculates a risk score and determines:

* Default Probability
* Risk Level
* Approval Status
* Risk Factors
* Recommendations

### 5. Report Generation

Users can download a comprehensive PDF report containing the complete risk assessment.

---

## Technology Stack

| Category       | Technology                  |
| -------------- | --------------------------- |
| Frontend       | React, TypeScript, Vite     |
| Styling        | Tailwind CSS, shadcn/ui     |
| Charts         | Recharts                    |
| Backend        | Supabase Edge Functions     |
| Database       | PostgreSQL (Supabase)       |
| Authentication | Supabase Auth               |
| PDF Generation | jsPDF                       |
| Deployment     | Vercel / Netlify (Optional) |

---

## Project Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
Loan Application Form
 │
 ▼
Supabase Edge Function
 │
 ▼
Risk Analysis Engine
 │
 ├── Credit Evaluation
 ├── Debt Analysis
 ├── Income Assessment
 ├── Employment Stability
 └── Default History Analysis
 │
 ▼
Prediction Result
 │
 ▼
Database Storage
 │
 ▼
Dashboard & PDF Reports
```

---

## Database

### Table: loan_predictions

Stores:

* User Information
* Loan Application Data
* Risk Score
* Default Probability
* Approval Decision
* Risk Level
* Timestamp

Security is enforced using Supabase Row-Level Security policies.

---


## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/loan-predictor-pro.git
cd loan-predictor-pro
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

---

## Future Enhancements

* Machine Learning Integration
* Logistic Regression Model
* Random Forest Classifier
* XGBoost Model
* EMI Calculator
* Interest Rate Prediction
* Credit Bureau API Integration
* Explainable AI (SHAP)
* Admin Dashboard
* Loan Portfolio Analytics

---

## Limitations

Currently, the project uses a rule-based risk scoring engine rather than a trained machine learning model. Future versions can integrate real-world datasets and predictive machine learning algorithms to improve accuracy.

---

## Learning Outcomes

This project demonstrates:

* Full Stack Web Development
* Authentication & Authorization
* Database Design
* Risk Analysis Systems
* API Integration
* Data Visualization
* PDF Report Generation
* Cloud Backend Services
* Secure Data Management

---

## License

This project is licensed under the MIT License.

