# Athlete Data Company – Clickable Prototype

India’s largest **AI-powered Athlete Discovery & Intelligence Marketplace** – UI/UX clickable prototype with persona-based journeys.

## How to run

Open `index.html` in a browser (double-click or use a local server):

```bash
# Optional: serve with a local server
npx serve .
# or
python3 -m http.server 8000
```

Then open **http://localhost:8000** (or open `index.html` directly).

## Landing page

- **Hero** with vision and value proposition  
- **Persona buttons**: Athlete · Brand / Agency · Admin  
- **Vision** and **Choose your journey** sections with the same persona entry points  

## Persona journeys (clickable flows)

### 1. Athlete

- **Registration** → Email/OTP/social, sport/role, KYC upload, profile image, T&C  
- **Profile** → Basic info, performance metrics, media (highlight URL, certificates)  
- **Dashboard** → Profile %, AI Performance Score, AI Social Score, profile views, shortlists, inquiries, recent inquiries list  

### 2. Brand / Agency

- **Registration** → Company email, business verification, subscription plan (Starter/Pro/Enterprise), role-based access  
- **Discovery** → Filters (sport, role, age, location, AI scores, growth trend, budget, verified), search, athlete cards  
- **Athlete profile (brand view)** → Full stats, AI Performance/Social/Brand Fit scores, ROI, injury risk, growth graph placeholder  
- **Send inquiry** → Message, NDA request  
- **Create proposal** → Duration, deliverables, budget, documents; status flow (Sent → Under review → Negotiation → Approved → Closed)  

### 3. Admin

- **Login** → Email/password (internal access)  
- **Athlete governance** → Pending KYC, Approve/Reject, verified badge, flag stats, suspend  
- **Brand governance** → Companies, verification, spam, subscription plans  
- **Revenue dashboard** → Subscription revenue, commission %, active brands/athletes, conversion rate, chart placeholder  

## Navigation

- **Landing**: Click any “I’m an Athlete” / “I’m a Brand / Agency” / “Admin” (hero or cards) to start that persona’s first screen.  
- **Journey screens**: Use **← Home** in the top bar to return to the landing page.  
- **In-flow**: Use **Continue →**, **Back**, **View profile**, **Send inquiry**, etc. to move through the prototype.  

No backend or data persistence; all flows are UI-only for demo and stakeholder review.
