# 🌿 EcoScore: Gamifying Society Sustainability

![Hackathon](https://img.shields.io/badge/Hackathon-Project-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Prototype-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> **"Measurable Sustainability for a Better Tomorrow."**

**EcoScore** is a revolutionary scoring application designed for residential societies to monitor, rate, and improve their energy consumption and carbon footprint. By leveraging technology to track electricity/water usage and verify it via **OCR**, we turn ecological responsibility into a competitive and rewarding experience for residents.

---

## 📖 Table of Contents
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)

---

## 🚨 Problem Statement
In modern residential societies, individual carbon footprints often go unnoticed. Residents lack:
1.  **Real-time awareness** of their energy impact compared to neighbors.
2.  **Motivation** to reduce consumption (electricity/water).
3.  **Verification** mechanisms for claiming "eco-friendly" status.

This leads to excessive waste, higher costs, and a degrading local ecological zone.

---

## 💡 Our Solution
**EcoScore** acts as a digital auditor and motivator. It calculates a "Sustainability Score" for every flat based on their monthly consumption averages. 

* **For Residents:** It’s a game. Lower your usage, increase your score, earn badges, and get certified.
* **For Societies:** It’s a management tool. Identify high-consumption zones and maintain a hygienic, low-carbon environment.

---

## ✨ Key Features

### 1. 📊 Smart Scoring Algorithm
* Rates every flat on a scale (e.g., 1-10 or A-F grading) based on the **point average** of their monthly electricity and water consumption.
* Dynamic comparison with society averages to highlight top performers.

### 2. 🏆 Gamification & Certification
* **Eco-Certificates:** Residents who maintain low consumption for consecutive months receive digital certificates.
* **Leaderboards:** Friendly competition between flats to see who has the lowest carbon footprint.
* **Motivation:** Encourages a behavioral shift towards better ecological habits.

### 3. 🌍 Carbon Footprint Tracker
* Visual graphs showing the direct environmental impact of the user's consumption (e.g., "You saved 10 trees this month!").
* Alerts for "Red Zones" (high pollution/consumption areas) within the society.

---

## 🛠 Tech Stack & Architecture

⟶ This application is built for **efficiency**, **scalability**, and **speed**, ensuring a seamless experience for hundreds of residents simultaneously.

| Component | Technology | Why we chose it? |
| :--- | :--- | :--- |
| **Frontend** | **React** | React offers a *robust ecosystem, powerful debugging tools, and extensive community support*. |
| **Backend** | **Node.js** | Its non-blocking I/O model is perfect for handling multiple concurrent requests without lag. |
| **Database** | **MongoDB** | A flexible NoSQL schema allows us to easily store diverse data types—from user profiles and image URLs to complex time-series consumption data. |
---

## Api And Routes Technology


## 📂 Folder Structure

⟶ The codebase is organized into two main directories for separation of concerns, making it easy for judges and developers to navigate.

├── Backend/  
│   ├── middleware/  
│   │   ├── fetchUser.js  
│   │   └── points-allocation-algo.md  
│   ├── models/  
│   │   ├── admin.js  
│   │   ├── communityGoal.js  
│   │   ├── consumptionRecord.js  
│   │   ├── pointsRecord.js  
│   │   ├── society.js  
│   │   ├── unit.js  
│   │   └── user.js  
│   ├── routes/  
│   │   ├── auth.js  
│   │   ├── consumption.js  
│   │   ├── goals.js  
│   │   ├── points.js  
│   │   ├── resident.js  
│   │   ├── test.js  
│   │   └── user.js  
│   ├── services/  
│   │   └── pointsService.js  
│   ├── .gitignore  
│   ├── adminDataBase.js  
│   ├── flow.txt  
│   ├── index.js  
│   ├── package-lock.json  
│   ├── package.json  
│   └── userDataBase.js  
├── Frontend/  
│   ├── public/  
│   │   └── vite.svg  
│   ├── src/  
│   │   ├── assets/  
│   │   │   └── react.svg  
│   │   ├── components/  
│   │   │   ├── atoms/  
│   │   │   │   ├── Badge.jsx  
│   │   │   │   ├── Button.jsx  
│   │   │   │   ├── Card.jsx  
│   │   │   │   ├── Icon.jsx  
│   │   │   │   └── Input.jsx  
│   │   │   ├── charts/  
│   │   │   │   └── ConsumptionTrendChart.jsx  
│   │   │   ├── molecules/  
│   │   │   │   ├── DashboardHeader.jsx  
│   │   │   │   ├── PublicNavbar.jsx  
│   │   │   │   └── Sidebar.jsx  
│   │   │   ├── settings/  
│   │   │   │   ├── NotificationSettings.jsx  
│   │   │   │   └── PrivacySettings.jsx  
│   │   │   └── ProtectedRoute.jsx  
│   │   ├── contexts/  
│   │   │   └── AuthContext.jsx  
│   │   ├── layouts/  
│   │   │   └── DashboardLayout.jsx  
│   │   ├── pages/  
│   │   │   ├── AdminDashboard.jsx  
│   │   │   ├── AdminRegistrationPage.jsx  
│   │   │   ├── CommunityGoalsPage.jsx  
│   │   │   ├── ContactUsPage.jsx  
│   │   │   ├── CreateSocietyPage.jsx  
│   │   │   ├── InputDataPage.jsx  
│   │   │   ├── LandingPage.jsx  
│   │   │   ├── LoginPage.jsx  
│   │   │   ├── ResidentDashboard.jsx  
│   │   │   ├── ResidentLoginPage.jsx  
│   │   │   ├── ResidentRegistrationPage.jsx  
│   │   │   ├── SettingsPage.jsx  
│   │   │   ├── SocietyImpactPage.jsx  
│   │   │   └── TestPage.jsx  
│   │   ├── services/  
│   │   │   ├── api.js  
│   │   │   ├── consumptionService.js  
│   │   │   ├── goalsService.js  
│   │   │   ├── pointsService.js  
│   │   │   └── userService.js  
│   │   ├── temp-htmls/  
│   │   │   ├── admin-create-new-society.html  
│   │   │   ├── admin-dashboard.html  
│   │   │   ├── admin-input-data.html  
│   │   │   ├── admin-login-screen.html  
│   │   │   ├── admin-registration.html  
│   │   │   ├── admin-society-view.html  
│   │   │   ├── community-goals.html  
│   │   │   ├── landing.html  
│   │   │   ├── resident-dashboard.html  
│   │   │   ├── resident-login.html  
│   │   │   ├── resident-registration.html  
│   │   │   ├── society-environment-impact-dashboard.html  
│   │   │   └── user-profile-setting.html  
│   │   ├── App.jsx  
│   │   ├── index.css  
│   │   └── main.jsx  
│   ├── .env  
│   ├── .gitignore  
│   ├── eslint.config.js  
│   ├── index.html  
│   ├── package-lock.json  
│   ├── package.json  
│   ├── README.md  
│   └── vite.config.js  
└── README.md  
 

# 🚀 Getting Started
# To run this project locally for evaluation:

## Prerequisites

## Node.js installed

### MongoDB running locally or a cloud URI  

### React Native environment set up (CLI or Expo)  

### 1. Clone the Repository  
#### git clone [https://github.com/Ashmit72061/Tech-Savies-dev-Duel-.git](https://github.com/Ashmit72061/Tech-Savies-dev-Duel-.git)  
#### cd Tech-Savies-dev-Duel-  
### 2. Setup Backend  
#### cd Backend  
#### npm install  
## Create a .env file and add your MONGO_URI and PORT  
#### node index.js  
#### Server will start on http://localhost:5000  
### 3. Setup Frontend  
#### cd ../Frontend  
#### npm install  
#### npm start  
## Press 'a' for Android or 'i' for iOS (or scan QR with Expo Go)  

# 🔮 Future Roadmap (Upcoming Updates)
## 📸 OCR-Based Verification (In Progress)
⟶ We are currently developing an Optical Character Recognition (OCR) module.

## Goal: In the next update, users will simply upload a photo of their utility bill. The system will automatically extract the unit consumption digits, verifying the data without manual entry.

# 🔌 IoT Integration
⟶ Direct integration with smart meters to remove the need for any manual input or scanning.

# 🤖 AI Integration
⟶ Personalized tips on how to reduce bills based on usage patterns.

# 👨‍💻 Contributors  
## Team Tech-Savies - Building a Greener Future, One Flat at a Time.  
