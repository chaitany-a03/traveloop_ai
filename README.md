# Traveloop ✨

**Explore The World Smarter.**

Traveloop is a premium, cinematic AI-powered travel planning platform designed to transform how you explore the world. By combining real-world intelligence from the Google Places API with an advanced AI generation engine, Traveloop crafts highly personalized, geographically logical, and mood-specific travel itineraries in seconds. 

Say goodbye to generic travel templates. Whether you're looking for vibrant nightlife in Goa, a deep cultural dive in Kyoto, or hidden local gems in Mumbai, Traveloop delivers authentic travel experiences wrapped in a stunning startup-quality UI.

![Traveloop Dashboard Overview](https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&q=80)

---

## 🚀 Key Features

*   **🧠 AI Smart Trip Planner:** Enter a destination and a travel mood (e.g., Adventure, Romance, Culture, Nightlife). Traveloop's AI engine instantly generates a day-by-day itinerary grouped by geographic proximity.
*   **📍 Real-World Intelligence:** No fake placeholder data. The platform integrates seamlessly with the **Google Places API** to ensure 90%+ of generated activities are authentic, highly-rated, and exist in the real world.
*   **💎 Hidden Gems Discovery:** Automatically scans your trip destination to curate a personalized list of "Hidden Gems"—local favorites and off-the-beaten-path spots specifically tailored to your travel style.
*   **🎨 Premium Cinematic UI:** A fully custom, investor-ready frontend featuring:
    *   Immersive edge-to-edge layouts
    *   Glassmorphism (backdrop-blur) design system
    *   Fluid micro-interactions and staggered entry animations powered by **Framer Motion**
    *   A travel-magazine style "Discover Destinations" hub
*   **💾 Full Trip Persistence:** AI-generated trips, including full budgets, nested stops, and daily activities, are fully persisted to a PostgreSQL database, allowing you to edit and refine your trip at any time.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Routing:** React Router DOM
*   **State Management:** Zustand

### Backend
*   **Server:** Node.js & Express
*   **Database ORM:** Sequelize
*   **Database:** PostgreSQL (or SQLite for local dev)
*   **AI Engine Integration:** Custom mood-aware itinerary generation logic
*   **External APIs:** Google Places API (Text Search & Details)

---

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v16+)
*   PostgreSQL (optional, can use SQLite)
*   Google Places API Key

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/traveloop.git
cd traveloop
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/traveloop
GOOGLE_PLACES_API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret
```
Run database migrations and start the server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

---

## 💡 How It Works (The AI Engine)

The Traveloop AI engine bypasses the common pitfall of "hallucinated" itineraries by strictly anchoring its generations to geographic reality. 
1.  **Mood Extraction:** The engine interprets the user's selected "Travel Mood".
2.  **Geographic Fetching:** It queries the Google Places API for highly-rated locations matching both the destination and the exact mood.
3.  **Proximity Grouping:** Instead of complex K-Means clustering, it uses lightweight lat/lng proximity sorting to ensure all activities on "Day 1" are actually physically near each other.
4.  **District Labeling:** It dynamically generates human-friendly region labels (e.g., "South Mumbai Heritage Trail").

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/traveloop/issues).

## 📝 License

This project is licensed under the MIT License.
