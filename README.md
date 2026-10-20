# EAPCET College Allocation Predictor & Student Guidance System

A full-stack web application that helps AP EAPCET and TG EAPCET aspirants explore suitable engineering colleges and branches using their entrance examination rank, category, preferred branch, and available historical counselling cutoff data.

The platform combines college allocation prediction, college-specific cutoff analysis, counselling-phase comparisons, prediction history, and AI-powered student guidance in one place.

> **Disclaimer:** Predictions are estimates based on available historical data and do not guarantee admission or actual seat allotment.

## Live Application

- **Frontend:** https://eapcet-college-allocation-predictor.onrender.com/
- **Backend API:** https://eapcet-college-allocation-predictor-dwec.onrender.com/
- **GitHub Repository:** https://github.com/dileepkumar-valluri/EAPCET-College-Allocation-Predictor

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Team Contributions](#team-contributions)
- [Limitations](#limitations)
- [Future Enhancements](#future-enhancements)
- [Disclaimer](#disclaimer)

## Project Overview

Choosing an engineering college after EAPCET counselling can be challenging. Students need to understand historical cutoff ranks, branch availability, reservation categories, and counselling-phase outcomes before preparing their college preferences.

The **EAPCET College Allocation Predictor & Student Guidance System** is designed to simplify this process by providing data-driven college recommendations and student guidance through a web-based platform.

The system uses available historical counselling datasets to analyze a student's details and present potentially suitable colleges and engineering branches. It also provides college-specific analysis and an AI-powered assistant for general admission-related questions.

The platform is intended to support informed decision-making, not replace official counselling procedures.

## Key Features

### 1. Student Registration and Authentication

- Student registration and login.
- Session-based authentication.
- Student profile and account information.
- Access to personal prediction history, subject to database configuration and successful API operations.

### 2. College Allocation Prediction

Students can provide relevant details, including:

- EAPCET examination rank.
- Examination state: Andhra Pradesh (AP) or Telangana (TG), where supported by the available dataset.
- Reservation category.
- Preferred engineering branch.

The system analyzes available historical cutoff information and returns potentially suitable colleges with relevant cutoff details and estimated outcomes.

### 3. College-Specific Analysis

- Analyze selected colleges and engineering branches.
- Compare a student's rank with available historical cutoff ranks.
- Examine counselling-phase outcomes where the required data is available.
- Help students understand how their rank compares with historical admission trends.

### 4. AI-Powered Student Guidance

- AI assistant for EAPCET-related questions.
- General guidance about colleges, branches, cutoff ranks, and counselling.
- Explanations to help students understand their available options.
- AI responses powered by the configured Groq API integration.

AI-generated answers should be checked against official counselling information, especially for admission rules, eligibility, and deadlines.

### 5. Historical Counselling Data

- Designed to support AP EAPCET and TG EAPCET historical datasets.
- Processes college, branch, category, cutoff-rank, and counselling-phase information, depending on dataset availability.
- Supports future dataset updates and improvements to the prediction process.

**Data availability note:** Support for a state or counselling phase depends on the datasets actually imported and available to the application. An advertised feature does not imply that every dataset is currently available.

### 6. Prediction History

- Retrieve previously recorded predictions for a student.
- Review past prediction results when the required database tables, authentication, and backend functionality are available.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS, CSS |
| UI and Animations | Motion, Lucide React |
| Backend | Python, Flask |
| Database | MySQL |
| Data Processing | Pandas, NumPy |
| AI Integration | Groq API |
| API Communication | HTTP/REST APIs |
| Version Control | Git, GitHub |
| Deployment | Render |
| Development Environment | Visual Studio Code |

## Project Architecture

The application separates the frontend, backend, database, historical datasets, and AI integration.

```text
EAPCET-College-Allocation-Predictor/
├── backend/
│   ├── app.py
│   ├── ai_assistant.py
│   ├── college_analysis.py
│   ├── config.py
│   ├── data_loader.py
│   ├── phase_predictor.py
│   └── ...
├── data/
│   └── Historical counselling datasets
├── docs/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── AIAssistant.jsx
│   │   ├── App.jsx
│   │   ├── Auth.jsx
│   │   ├── MyProfile.jsx
│   │   ├── Prediction.jsx
│   │   ├── PredictionHistory.jsx
│   │   ├── api.js
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── tests/
├── requirements.txt
├── eapcet_db_backup.sql
└── README.md
```

*This is a high-level representation. Some files and directories may be omitted or vary in the actual repository.*

## How It Works

1. **Student input:** The student enters their examination rank, state, category, and preferred engineering branch.
2. **API request:** The React frontend sends the required information to the Flask backend.
3. **Data analysis:** The backend processes the request against the available historical counselling data and applicable prediction logic.
4. **College recommendations:** The system returns matching results and relevant historical cutoff information where available.
5. **Student guidance:** The student can explore college-specific analysis, review prediction history, and ask the AI assistant general questions.

The reliability of the results depends on dataset quality, data coverage, and the correctness of the implemented prediction logic.

## Getting Started

### Prerequisites

Install the following software before running the application locally:

- Python 3.10 or another Python version compatible with the project dependencies.
- Node.js and npm.
- MySQL Server or a compatible hosted MySQL database.
- Git.
- Visual Studio Code or another code editor.

### 1. Clone the Repository

```bash
git clone https://github.com/dileepkumar-valluri/EAPCET-College-Allocation-Predictor.git
cd EAPCET-College-Allocation-Predictor
```

### 2. Set Up the Python Backend

Create a virtual environment from the project root.

**Windows PowerShell:**

```powershell
py -3.10 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```bash
python -m pip install -r requirements.txt
```

If Python 3.10 is not installed, use a compatible installed Python version supported by the project's dependencies.

### 3. Configure Environment Variables

Configure the backend environment variables using the project's supported configuration method.

Example `.env` values for a local MySQL setup:

```env
FLASK_SECRET_KEY=replace_with_a_secure_random_secret

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=eapcet_db

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

Use the actual database credentials and the AI model supported by your Groq account. The model value above is an example configuration consistent with the current project setup; verify provider availability if the model changes.

**Security requirements:**

- Never commit `.env` files, API keys, passwords, or production secrets to GitHub.
- Ensure `.env` is included in `.gitignore`.
- Keep production credentials in the backend service's environment settings.
- Do not expose secret values in frontend code or public logs.
- Confirm that the backend configuration actually loads `.env` files if you use them locally.

### 4. Set Up the Database

1. Start your local MySQL server or configure access to a compatible hosted database.
2. Create the required database.
3. Import `eapcet_db_backup.sql` if it contains the schema and data needed by the application.
4. Confirm that the imported database name matches `DB_NAME`.
5. Verify that the required tables, columns, and historical counselling records match the backend code.

The SQL backup may contain only the data available when it was created. Check its contents before assuming that all states, years, categories, or counselling phases are covered.

### 5. Start the Backend

From the project root, with the virtual environment activated:

```bash
python -m backend.app
```

The Flask development server should start on the configured local port, typically `5000`, unless the application specifies another port.

### 6. Start the Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, typically:

```text
http://localhost:5173
```

Ensure the frontend API configuration points to the correct backend URL and that Flask CORS and session-cookie settings support local development.

For local development, the frontend's `VITE_API_BASE_URL` must match the API URL convention used by the application. Check `frontend/src/api.js` and the existing Vite environment configuration before changing it.

## Deployment

The application is deployed using Render.

### Frontend

- Deployed as a Render Static Site.
- Uses React and Vite for the production build.
- Requires the correct backend API base URL.

### Backend

- Deployed as a Render Web Service.
- Runs the Flask application using Gunicorn.
- Requires valid database credentials and access to the hosted MySQL database.
- Requires the Groq API key and supported model configuration for AI assistant requests.

### Production Configuration

Configure backend environment variables in the Render backend service, not only in the local `.env` file.

For the frontend, configure the production API base URL as:

```env
VITE_API_BASE_URL=https://eapcet-college-allocation-predictor-dwec.onrender.com/api
```

Vite environment variables are incorporated during the frontend build. After changing this variable, trigger a new frontend build and deployment.

After deployment:

1. Check the backend health endpoint.
2. Verify database connectivity and required data availability.
3. Test registration, login, profile access, and logout.
4. Test predictions with representative inputs and known historical cutoff records.
5. Verify college analysis and counselling-phase comparisons.
6. Test prediction history and the AI assistant.
7. Review Render logs for failed requests, database errors, and external API errors.

Always test code changes locally where practical, commit and push verified changes to GitHub, and confirm the resulting deployment status.

## Team Contributions

The project can be organized into the following responsibilities. Replace these descriptions with the actual team members' names and verified contributions before using this section for academic submission.

1. **Frontend Development:** React components, UI implementation, forms, navigation, and frontend-to-backend API integration.
2. **Backend Development:** Flask endpoints, request validation, authentication, session handling, and API logic.
3. **Data Processing and Prediction:** Historical dataset collection, preprocessing, database preparation, cutoff analysis, and prediction logic.
4. **AI Guidance, Testing, and Deployment:** AI assistant integration, application testing, documentation, deployment configuration, and verification.

## Limitations

- Predictions depend on the completeness and correctness of the historical counselling datasets.
- Historical cutoffs do not guarantee future admission or seat allotment.
- Dataset coverage may vary by state, year, category, branch, college, and counselling phase.
- Missing or outdated records can reduce the usefulness of recommendations.
- AI-generated guidance may be incomplete or inaccurate and should not replace official counselling information.
- Features that rely on an unavailable dataset, misconfigured API, or inaccessible database may not function correctly until the dependency is resolved.
- Actual seat allotment depends on official rules, eligibility, seat availability, reservation policies, candidate preferences, and the applicable counselling process.

## Future Enhancements

- Incorporate and validate newer AP EAPCET and TG EAPCET counselling datasets.
- Improve prediction logic using comprehensive historical cutoff data.
- Expand college, branch, category, and counselling-phase comparisons.
- Add more detailed explanations of prediction results.
- Improve database validation, API reliability, authentication, and error handling.
- Expand personalized student guidance and AI assistant capabilities.
- Add automated tests for critical backend and frontend workflows.
- Improve dataset update and validation workflows.

## Disclaimer

This project is an educational guidance tool and is not affiliated with or endorsed by an official EAPCET counselling authority.

The college recommendations and estimated outcomes are based on the historical data available to the application. They do not guarantee admission, eligibility, or seat allotment. Students should consult the official AP EAPCET or TG EAPCET counselling website and current admission notifications before making final decisions.
