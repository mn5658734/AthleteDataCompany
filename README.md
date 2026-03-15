# Athlete Data Company – Web Application

India’s largest **AI-powered Athlete Discovery & Intelligence Marketplace** – full web application with routing, live data, and working discovery flows.

## How to run

Open `index.html` in a browser (double-click or use a local server):

```bash
# Optional: serve with a local server
npx serve .
# or
python3 -m http.server 8000
```

Then open **http://localhost:8000** (or open `index.html` directly).

## Features

- **URL routing** – Hash-based routes (e.g. `#/`, `#/brand/discovery`, `#/brand/athlete/1`) so you can bookmark and refresh any screen.
- **Data layer** – Mock athlete database (`data.js`) with 12+ athletes; filter by sport, role, age, region, AI scores, budget, verified. Shortlist persisted in `localStorage`.
- **Discovery** – Filters and search update results in real time. “Apply filters” and search-as-you-type. Athlete cards are generated from data; clicking a card opens that athlete’s profile.
- **Discovery Assistant** – AI suggestion button runs a “thinking” animation and shows suggested athletes from the same data; suggestion chips (e.g. “Cricket, North India”) apply filters and show suggestions. Click a suggestion card to expand details or “View full profile.”
- **Brand athlete profile** – Dynamic content for the selected athlete (name, sport, scores, AI insights). Add/remove from shortlist (saved in `localStorage`). “Send inquiry” pre-fills the athlete in the inquiry form.
- **Persona journeys** – Athlete (Registration → Profile → Dashboard), Brand (Register → Discovery → Athlete profile → Inquiry → Proposal), Admin (Login → Governance → Revenue).

## Landing page

- **Hero** with vision and value proposition  
- **Persona buttons**: Athlete · Brand / Agency · Admin  
- **Choose your journey** with persona cards and Fan card (SportsTrade link)  

## Navigation

- **Landing**: Click any persona to start that journey.  
- **Journey screens**: **← Home** returns to landing.  
- **Discovery**: Use filters, search, or the Discovery Assistant; click an athlete card or AI suggestion to view profile.  
- **Profile**: “Add to shortlist” / “Remove from shortlist,” “Send inquiry,” “View full profile” from AI overlay.  

No backend required; all state is in-memory with shortlist in `localStorage`. Ready for demo, stakeholder review, or wiring to a real API later.
