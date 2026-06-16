# Athlete Data Company – Web Application

India’s largest **AI-powered Athlete Discovery & Intelligence Marketplace** – full web application with routing, live data, and working discovery flows.

## How to run

Open `index.html` in a browser (double-click or use a local server):

```bash
npm start
# or
npx serve .
```

Regenerate IPL athlete rankings from match CSV:

```bash
npm run build:ipl
```

Then open **http://localhost:8000** (or open `index.html` directly).

## Features

- **URL routing** – Hash-based routes (e.g. `#/`, `#/brand/discovery`, `#/brand/athlete/1`) so you can bookmark and refresh any screen.
- **Data layer** – IPL 2026 athlete database (`data.js`) with top 50 players derived from `data/ipl_matches_2026.csv`. Scores use POM awards, team win rate, and squad availability. Shortlist persisted in `localStorage`.
- **Discovery** – IPL team filter, search, and ranked athlete cards. Regenerate data with `npm run build:ipl` after updating the CSV.
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
