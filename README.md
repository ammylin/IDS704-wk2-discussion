# 23andMe Crisis Desk — Ethics Simulation

An interactive, browser-based simulation for **IDS 704: Ethics in Data Science** (Week 2 Discussion). Players step into the role of the 23andMe data science leadership team and navigate a series of ethical dilemmas around genetic data privacy, informed consent, and corporate responsibility.

## Overview

The simulation presents a 9-stage decision-making experience built around the real-world scenario of 23andMe's financial crisis and the fate of its genetic database. Participants make choices, confront twists, and ultimately draft their own "Data Science Constitution."

### Stages

| Stage | Title | Description |
|-------|-------|-------------|
| 01 | **Introduction** | Framing — you are the 23andMe data science team |
| 02 | **What Data Would You Sell?** | Select which categories of user data you'd be comfortable selling |
| 03 | **Privacy Policy & Consent** | Read a mock privacy policy under a 30-second timer, then reflect on whether signing equals informed consent |
| 04 | **Bankruptcy Crisis** | 23andMe goes bankrupt — a pharma company offers $50M for the genetic database. Sell, sell with conditions, or refuse? |
| 05 | **The Twists** | Five escalating twists challenge your earlier decision (anonymization promises, medical research potential, data combination, deletion requests) |
| 06 | **Data Ownership** | Vote on who should control the data — users, the company, the buyer, government, or no one |
| 07 | **Your Own Research** | Reflect on what you'd promise participants when collecting sensitive data for your own projects |
| 08 | **Write the Rules** | Choose three non-negotiable principles for your "Data Science Constitution" |
| 09 | **Final Reflection** | Open discussion on what we owe people when we collect their data |

## Getting Started

No build tools or dependencies are required — the simulation is a self-contained static site.

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/IDS704-wk2-discussion.git
   cd IDS704-wk2-discussion
   ```

2. **Open in a browser**
   ```bash
   open index.html        # macOS
   xdg-open index.html    # Linux
   start index.html       # Windows
   ```

   Or serve locally with any static server:
   ```bash
   python3 -m http.server 8000
   ```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `Space` | Advance to the next stage |
| `←` | Go back to the previous stage |
| `R` | Restart the simulation |
| `1`–`5` | Quick-select numbered choices on applicable stages |

## Project Structure

```
IDS704-wk2-discussion/
├── index.html   # Page structure and all 9 simulation stages
├── script.js    # State management, navigation, timer, and interaction logic
├── style.css    # Responsive styling with glassmorphism / DNA-helix theme
└── README.md
```

## Customization

- **Edit stage content** — Update the HTML in `index.html`. Each stage lives in its own `<section class="screen" data-stage="N">` block.
- **Change twist prompts** — Modify the `twistDeck` array at the top of `script.js`.
- **Adjust the consent timer** — Change `consentTimerSeconds` in the state object inside `script.js` (default: 30 seconds).
- **Restyle** — CSS custom properties in `:root` at the top of `style.css` control the color palette.

## License

This project was created for educational use in IDS 704 at Duke University.