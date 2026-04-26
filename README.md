# AgriAI - Intelligent Agriculture Assistant

AgriAI is a location-aware AI farming assistant designed for Indian conditions. It provides crop recommendations, plant disease detection, and organic treatment suggestions via a multilingual voice and chat interface.

## 🚀 Features

- **Location-Aware**: Automatically maps user coordinates to Indian agro-climatic zones.
- **Crop Recommendation**: Uses XGBoost trained on NPK, rainfall, and climate data.
- **Disease Scanner**: CNN-based image classification for plant diseases.
- **AI Assistant**: Powered by Llama 3 for integrated farming advice.
- **Multilingual Voice**: Support for Hindi, Kannada, Tamil, and English using Whisper and Coqui TTS.
- **Glassmorphism UI**: Modern, premium React dashboard with smooth animations.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: FastAPI (Python), SQLAlchemy, Pydantic.
- **Database**: PostgreSQL with PostGIS extension.
- **AI/ML**: XGBoost, TensorFlow, Llama 3 (via Ollama), Whisper, Coqui TTS.

## 📦 Setup & Installation

### Prerequisites
- Docker & Docker Compose
- Ollama (running locally with `llama3` model)

### Quick Start
1. Clone the repository.
2. Ensure Ollama is running: `ollama run llama3`.
3. Start the services:
   ```bash
   docker-compose up --build
   ```
4. Access the app:
   - Frontend: `http://localhost:5173`
   - API Docs: `http://localhost:8000/docs`

## 📁 Project Structure

```text
agriAI/
├── backend/            # FastAPI source code
│   ├── ml/             # ML training scripts and models
│   ├── routes/         # API endpoints
│   └── utils/          # Location & Auth utilities
├── frontend/           # React source code
│   ├── src/pages/      # Feature pages
│   └── src/components/ # UI components
└── docker-compose.yml  # Orchestration
```

## 🔐 Environment Variables

Create a `.env` file in the root:
```env
DATABASE_URL=postgresql://user:password@db:5432/agriai
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
OLLAMA_BASE_URL=http://host.docker.internal:11434
```

## 🌍 Deployment

### Frontend (Vercel)
1. Push code to GitHub.
2. Import repository in [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add environment variables if needed.
5. Deploy!

### Backend (Render)
1. Push code to GitHub.
2. In [Render](https://render.com), click **New** > **Blueprint**.
3. Connect this repository.
4. Render will automatically spin up:
   - **PostgreSQL Database**
   - **FastAPI Backend** (via `backend/` directory)
5. The `DATABASE_URL` will be automatically linked.

---
*Built with ❤️ for Indian Farmers.*
