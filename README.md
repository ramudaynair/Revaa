# Reva 🩺  
### An AI-Powered Medical Assistant for Accessible Healthcare Support

Reva is a unified, web-based healthcare assistant designed to provide **quick, reliable, and user-friendly medical guidance** using Machine Learning and Conversational AI. The platform combines a **symptom checker**, **drug recommendation system**, and an **AI medical chatbot**, all within a single responsive web application.

The goal of Reva is not to replace professional healthcare providers, but to help users understand symptoms early, reduce anxiety caused by scattered online information, and guide them toward informed health decisions.

---

## 🚀 Features

- 🤖 **AI Medical Chatbot**  
  Conversational healthcare assistance powered by **Google Gemini**, designed to respond in a calm, friendly, and supportive tone.

- 🧠 **Symptom Checker**  
  Machine-learning–based symptom classification using a structured medical dataset to predict possible conditions.

- 💊 **Drug Recommendation System**  
  Provides commonly used medications based on predicted conditions using a static, curated dataset (informational only).

- 🎙 **Regional Language Voice Input**  
  Voice-based interaction powered by **Sarvam API**, allowing users to speak in regional Indian languages and receive responses in the same language.

- 📊 **Health Data Visualization**  
  Simple charts to help users track symptoms and usage history over time.

- 🔐 **Authentication & Security**  
  JWT-based authentication to protect user sessions and data.

- 📱 **Responsive UI**  
  Optimized for both mobile and desktop devices.

---

## 🏗️ System Architecture (High Level)

Reva follows a modular architecture where each feature operates independently:

- **Frontend**: Handles UI, routing, and user interaction  
- **Backend API**: Processes requests, runs ML inference, and integrates external APIs  
- **ML Models**: Used for symptom classification and rule-based drug recommendation  
- **External Services**:  
  - Google Gemini API (AI chatbot)  
  - Sarvam API (speech-to-text & multilingual support)

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- Radix UI
- React Hook Form + Zod
- Recharts
- Lucide Icons

### Backend & AI
- Gemini API (Conversational AI)
- Sarvam API (Voice & regional language support)
- Random Forest & Logistic Regression (ML models)
- JWT Authentication

### Database
- MongoDB

---

## 📊 Machine Learning Details

- Dataset size: ~5,000 symptom-diagnosis records  
- Models evaluated:
  - Random Forest (87% accuracy)
  - Logistic Regression (79% accuracy)
- Random Forest was selected due to better performance on non-linear symptom patterns.

---

## 📌 Disclaimer

Reva provides **general health information only** and is **not a substitute for professional medical advice, diagnosis, or treatment**. Always consult a qualified healthcare provider for medical concerns.

---

## 🧑‍🤝‍🧑 Team Nexum

- **Fidhaan Aameer**  
- **Ganga Gireesh**  
- **Ram Uday Nair**  
- **Irene Issan**  
- **Jipin Dev**

Department of Computer Science & Engineering  
Toc H Institute of Science & Technology, Kerala, India

---

## 🏆 Achievements

🥇 **First Place Winner**  
**Lifosys Digital Systems × AI Innovation Lab × IEEE CS TOCH Pitch Deck Grand Finale (2025)**

---

## 🔮 Future Scope

- Integration with personal health records
- Wearable device data support
- Larger and more diverse medical datasets
- Advanced conversational memory
- Doctor and pharmacy partnerships
- Real-time monitoring and alerts

---

## 📄 License

This project is intended for academic and educational purposes.
