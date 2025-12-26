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
- [Future Roadmap](#-future-roadmap)

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

### 2. 📸 OCR-Based Verification
* **No more manual entry fraud.** Users simply scan their utility bills or meters.
* The app uses **Optical Character Recognition (OCR)** to automatically extract and verify unit consumption, ensuring data integrity.

### 3. 🏆 Gamification & Certification
* **Eco-Certificates:** Residents who maintain low consumption for consecutive months receive digital certificates.
* **Leaderboards:** Friendly competition between flats to see who has the lowest carbon footprint.
* **Motivation:** Encourages a behavioral shift towards better ecological habits.

### 4. 🌍 Carbon Footprint Tracker
* Visual graphs showing the direct environmental impact of the user's consumption (e.g., "You saved 10 trees this month!").
* Alerts for "Red Zones" (high pollution/consumption areas) within the society.

---

## 🛠 Tech Stack & Architecture

This application is built for **efficiency**, **scalability**, and **speed**, ensuring a seamless experience for hundreds of residents simultaneously.

| Component | Technology | Why we chose it? |
| :--- | :--- | :--- |
| **Frontend** | **React Native** | Chosen for its **cross-platform efficiency**. It allows us to deploy a high-performance native mobile app for both iOS and Android from a single codebase, ensuring all society members can access the app regardless of their device. |
| **Backend** | **Node.js** | Its non-blocking I/O model is perfect for handling multiple concurrent requests (like image uploads for OCR) without lag. |
| **Database** | **MongoDB** | A flexible NoSQL schema allows us to easily store diverse data types—from user profiles and image URLs to complex time-series consumption data. |
| **OCR Service** | **Tesseract / Vision API** | Used for accurate extraction of text from meter images. |

---

## 📂 Folder Structure

The codebase is organized into two main directories for separation of concerns, making it easy for judges and developers to navigate.


Tech-Savies-dev-Duel-
├── 📂 Backend/                 # The brain of the application
│   ├── 📂 models/              # Mongoose schemas (User, Flat, UsageLogs)
│   ├── 📂 routes/              # API endpoints (Auth, OCR, Scoring)
│   ├── 📂 controllers/         # Logic for calculating scores and processing images
│   ├── 📂 middleware/          # Auth verification and file upload handling
│   └── server.js               # Entry point for the Node.js server
│
├── 📂 Frontend/                # The mobile application interface
│   ├── 📂 assets/              # Images, fonts, and icons
│   ├── 📂 src/
│   │   ├── 📂 components/      # Reusable UI elements (ScoreCard, CameraView)
│   │   ├── 📂 screens/         # Main app screens (Dashboard, Leaderboard, Scan)
│   │   ├── 📂 services/        # API calls to the backend
│   │   └── App.js              # Main React Native entry component
│   ├── package.json
│
└── README.md                   # Project Documentation

The "font size" in a README.md file is determined by the hashtags (#) you place before the text. If you just copy the plain text without the hashtags, GitHub will treat it as normal (small) paragraph text.

To get the large titles and bold text, you must copy the "Raw Code" below.

Click the "Copy" button on the top-right of this code block and paste it directly into your README.md file on GitHub or your code editor.

Markdown

## 🌿 EcoScore: Gamifying Society Sustainability

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
- [Future Roadmap](#-future-roadmap)

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

### 2. 📸 OCR-Based Verification
* **No more manual entry fraud.** Users simply scan their utility bills or meters.
* The app uses **Optical Character Recognition (OCR)** to automatically extract and verify unit consumption, ensuring data integrity.

### 3. 🏆 Gamification & Certification
* **Eco-Certificates:** Residents who maintain low consumption for consecutive months receive digital certificates.
* **Leaderboards:** Friendly competition between flats to see who has the lowest carbon footprint.
* **Motivation:** Encourages a behavioral shift towards better ecological habits.

### 4. 🌍 Carbon Footprint Tracker
* Visual graphs showing the direct environmental impact of the user's consumption (e.g., "You saved 10 trees this month!").
* Alerts for "Red Zones" (high pollution/consumption areas) within the society.

---

## 🛠 Tech Stack & Architecture

This application is built for **efficiency**, **scalability**, and **speed**, ensuring a seamless experience for hundreds of residents simultaneously.

| Component | Technology | Why we chose it? |
| :--- | :--- | :--- |
| **Frontend** | **React Native** | Chosen for its **cross-platform efficiency**. It allows us to deploy a high-performance native mobile app for both iOS and Android from a single codebase, ensuring all society members can access the app regardless of their device. |
| **Backend** | **Node.js** | Its non-blocking I/O model is perfect for handling multiple concurrent requests (like image uploads for OCR) without lag. |
| **Database** | **MongoDB** | A flexible NoSQL schema allows us to easily store diverse data types—from user profiles and image URLs to complex time-series consumption data. |
| **OCR Service** | **Tesseract / Vision API** | Used for accurate extraction of text from meter images. |

---

## 📂 Folder Structure

The codebase is organized into two main directories for separation of concerns, making it easy for judges and developers to navigate.

Tech-Savies-dev-Duel-/
├── 📂 Backend/                 # The brain of the application
│   ├── 📂 models/              # Mongoose schemas (User, Flat, UsageLogs)
│   ├── 📂 routes/              # API endpoints (Auth, OCR, Scoring)
│   ├── 📂 controllers/         # Logic for calculating scores and processing images
│   ├── 📂 middleware/          # Auth verification and file upload handling
│   └── server.js               # Entry point for the Node.js server
│
├── 📂 Frontend/                # The mobile application interface
│   ├── 📂 assets/              # Images, fonts, and icons
│   ├── 📂 src/
│   │   ├── 📂 components/      # Reusable UI elements (ScoreCard, CameraView)
│   │   ├── 📂 screens/         # Main app screens (Dashboard, Leaderboard, Scan)
│   │   ├── 📂 services/        # API calls to the backend
│   │   └── App.js              # Main React Native entry component
│   ├── package.json
│   └── README.md
│
└── README.md                   # Project Documentation

# 🚀 Getting Started
# To run this project locally for evaluation:

Prerequisites
Node.js installed

MongoDB running locally or a cloud URI

React Native environment set up (CLI or Expo)

1. Clone the Repository

git clone [https://github.com/Ashmit72061/Tech-Savies-dev-Duel-.git](https://github.com/Ashmit72061/Tech-Savies-dev-Duel-.git)
cd Tech-Savies-dev-Duel-

2. Setup Backend

cd Backend
npm install
# Create a .env file and add your MONGO_URI and PORT
node server.js

Server will start on http://localhost:5000

3. Setup Frontend

cd ../Frontend
npm install
npm start
# Press 'a' for Android or 'i' for iOS (or scan QR with Expo Go)

👨‍💻 Contributors
Team Tech-Savies - Building a Greener Future, One Flat at a Time.
