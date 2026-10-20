
# EAPCET College Allocation Predictor & Student Guidance System

A web-based platform that helps AP EAPCET and TG EAPCET aspirants explore suitable engineering colleges and branches using their entrance exam rank, category, preferred branch, and historical counselling cutoff data.

## Project Overview

The EAPCET College Allocation Predictor & Student Guidance System provides college recommendations, college-specific cutoff analysis, counselling-phase comparisons, and AI-powered student guidance. It uses historical counselling data to help students make more informed choices during engineering admissions.

**Important:** Predictions are estimates based on available historical data. They do not guarantee actual seat allotment.

## Key Features

### 1. Student Registration and Login
- Student registration and login.
- Session-based authentication.
- Student profile and account information.
- Prediction history support, subject to backend and database configuration.

### 2. College Allocation Prediction
- Accepts entrance exam rank, state, category, and preferred engineering branch.
- Analyzes available historical counselling data.
- Recommends suitable engineering colleges.
- Presents relevant cutoff information and estimated allocation outcomes.

### 3. College-Specific Analysis
- Analyze selected colleges and engineering branches.
- Compare student ranks with historical cutoff ranks.
- Support counselling-phase comparisons where data is available.

### 4. AI-Powered Student Guidance
- AI assistant for EAPCET-related questions.
- General guidance about colleges, branches, cutoffs, and counselling.
- Explanations to help students understand their options.

### 5. Historical Counselling Data
- Supports AP EAPCET and TG EAPCET data where datasets are available.
- Processes college, branch, category, rank, and counselling-phase information.
- Designed to accommodate future dataset updates.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Python, Flask |
| Database | MySQL |
| Data Processing | Pandas, NumPy |
| AI Integration | AI assistant integration |
| Frontend Animations | Motion |
| Icons | Lucide React |
| Version Control | Git, GitHub |
| Deployment | Render |
| Development Environment | Visual Studio Code |

## Project Architecture

```text
EAPCET_College_Predictor/
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

*Note: This is a high-level overview. Some folders and files are omitted for brevity.*

## Live Deployment

- **Frontend:** https://eapcet-college-allocation-predictor.onrender.com/
- **Backend API:** https://eapcet-college-allocation-predictor-dwec.onrender.com/

The frontend and backend are deployed separately. Authentication, profile requests, predictions, and other API-dependent features require the frontend API configuration and backend database connection to be working correctly.

## Local Setup and Installation

### Prerequisites

- Python 3.10 or a compatible Python version.
- Node.js and npm.
- MySQL Server or a compatible hosted MySQL database.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/dileepkumar-valluri/EAPCET-College-Allocation-Predictor.git
cd EAPCET-College-Allocation-Predictor
```

### 2. Set Up the Python Backend

Create and activate a virtual environment.

**Windows PowerShell:**

```powershell
py -3.10 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
python -m pip install -r requirements.txt
```

Configure the backend environment variables before starting the server.

### 3. Configure Environment Variables

Set the following variables in your local environment or an appropriate `.env` file, according to the application's configuration.

```env
FLASK_SECRET_KEY=your_secure_random_secret
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=eapcet_db
```

Use the actual database host, port, username, password, and database name. Do not commit passwords, secret keys, or other credentials to GitHub.

### 4. Prepare the Database

Create or import the required database schema and data using the project's SQL backup or schema scripts. Confirm that the table names and columns match the backend code before running the application.

### 5. Start the Backend

From the project root, with the virtual environment activated:

```bash
python -m backend.app
```

The Flask development server should start on the configured local port, typically `5000`.

### 6. Start the Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, typically:

```text
http://localhost:5173
```

Ensure the frontend API base URL, Flask CORS settings, and session cookie configuration are appropriate for local development.

## Deployment

The project uses Render for deployment.

- The frontend is deployed as a static site.
- The backend is deployed as a Python web service.
- The backend requires correctly configured environment variables and an accessible MySQL database.
- The frontend must send API requests to the deployed backend URL in production.
- CORS and cookie settings must support the deployed frontend and backend origins.

After each code change, test the application locally, commit and push the verified changes to GitHub, and check the corresponding Render deployment logs.

## Team Contributions

The project can be divided into four responsibilities:

1. **Frontend Development:** React components, UI, forms, navigation, and API integration.
2. **Backend Development:** Flask routes, request handling, authentication, and API logic.
3. **Data Processing and Prediction:** Historical dataset validation, preprocessing, cutoff analysis, and prediction logic.
4. **AI Guidance, Testing, and Deployment:** AI assistant integration, testing, documentation, and deployment verification.

Update this section with the actual names and contributions of the team members.

## Project Scope and Limitations

The system provides guidance using the historical datasets available to it. Prediction quality depends on dataset completeness, correctness, counselling rules, category, branch, seat availability, and other admission factors.

Features that depend on an unavailable dataset, an unconfigured API, or an inaccessible database may not work until the relevant dependency is configured.

## Disclaimer

This application is intended for educational guidance only. It does not represent an official counselling authority and cannot guarantee college admission or seat allotment. Final allotments depend on official counselling procedures, eligibility, seat availability, candidate preferences, reservation rules, and the applicable admission guidelines.

## Future Enhancements

- Incorporate newer AP and TG EAPCET counselling datasets.
- Improve prediction logic and historical cutoff analysis.
- Expand personalized college and branch guidance.
- Improve API reliability, authentication, and error handling.
- Add additional student guidance features as the project evolves.
