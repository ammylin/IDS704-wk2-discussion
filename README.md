# 23andMe Crisis Desk — Ethics Simulation

An interactive, browser-based ethics simulation for **IDS 704: Ethics in Data Science** (Week 2 Discussion). Players step into the role of the 23andMe data science leadership team and navigate a series of ethical dilemmas around genetic data privacy, informed consent, data ownership, and corporate responsibility.

> **Reality check:** This simulation is inspired by real events involving 23andMe, but some scenarios, offers, decisions, and consequences are hypothetical and designed for ethical analysis.

## Overview

The simulation presents a 9-stage decision-making experience built around the real-world scenario of 23andMe's financial crisis and the fate of its genetic database. Each stage maps to one or more of the five core discussion questions below, giving students a structured path through competing ethical values before an open discussion.

### Five Discussion Questions

1. Is there anything problematic about 23andMe selling users' genetic, survey, or financial data? If so, what would make it less problematic?
2. To what degree did 23andMe users understand the privacy policy they signed?
3. If you buy data from another company, should you have to follow the same privacy agreement as the original company?
4. If we collect sensitive data for our own research/projects, what agreements should we make with participants when collecting or aggregating that data?
5. If we were on the 23andMe data science team before bankruptcy, what principles, priorities, or values should we refuse to lose sight of?

### Stages

| Stage | Title | Discussion Q | Description |
|-------|-------|:------------:|-------------|
| 01 | **Introduction** | — | Framing — you are the 23andMe data science team |
| 02 | **What Data Would You Sell?** | Q1 | Select which categories of user data you'd be comfortable selling, then reflect on what makes one category more or less acceptable than another |
| 03 | **Privacy Policy & Consent** | Q2 | Read a mock privacy policy under a 30-second timer, respond to a consent prompt, rate your confidence that an average user understood what they agreed to, and reflect on what meaningful informed consent requires |
| 04 | **Bankruptcy Crisis** | Q1, Q3 | 23andMe goes bankrupt — a pharma company offers $50 M for the genetic database. Choose to sell, sell with conditions, or refuse, and see how your choice trades off across financial sustainability, user trust, privacy, and public benefit |
| 05 | **The Twists + Ethical Obligations** | Q3 | Five escalating twists challenge your earlier decision, then you consider whether a data buyer inherits the original company's ethical obligations |
| 06 | **Data Ownership** | Q1, Q3 | Vote on who should control the data — users, the company, the buyer, government, or no one |
| 07 | **Your Own Research** | Q4 | Practical exercise: if someone offered $1 M for your research dataset, what promises would you want to have already made to participants? Select from nine commitments |
| 08 | **Data Science Constitution** | Q5 | Choose three non-negotiable principles, rank them by priority, and generate a personalized, screenshot-worthy Data Science Constitution |
| 09 | **Final Reflection** | All | Review a recap of your decisions, answer three perspective-shift questions ("Would you still choose this?"), see a synthesis of all five discussion questions, and write a final response |

## Key Features

- **Tradeoff visualization** — Stage 4 shows how each bankruptcy decision affects financial sustainability, user trust, privacy protection, and research/public benefit using color-coded indicators
- **Confidence rating** — Stage 3 adds a 5-point scale to measure how well students think users understood the privacy policy
- **Discussion connections** — Compact, visually distinct prompts at the end of key stages link the activity to the five discussion questions
- **Interactive commitments** — Stage 7 lets students select from nine research commitments and see a reflection on the importance of making promises *before* collecting data
- **Ranked constitution** — Stage 8 has students select three principles, rank them, and generates a formal constitution card with articles and descriptions
- **Personal reflections** — Stage 9 asks three perspective-shift questions (your data, your family's data, public scrutiny) with optional text responses
- **Decisions recap** — Stage 9 displays a summary of every major choice the student made throughout the simulation
- **Reality disclaimer** — A subtle note on the intro stage clarifies that some scenarios are hypothetical

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

> Keyboard shortcuts are disabled while typing in a text area.

## Project Structure

```
IDS704-wk2-discussion/
├── index.html   # Page structure and all 9 simulation stages
├── script.js    # State management, navigation, tradeoffs, ranking, and interaction logic
├── style.css    # Responsive styling with glassmorphism / DNA-helix theme
└── README.md
```

## Customization

- **Edit stage content** — Update the HTML in `index.html`. Each stage lives in its own `<section class="screen" data-stage="N">` block.
- **Change twist prompts** — Modify the `twistDeck` array at the top of `script.js`.
- **Change tradeoff profiles** — Edit the `tradeoffProfiles` object in `script.js` to adjust how each bankruptcy decision is scored.
- **Change constitution principles** — Update the principle cards in `index.html` (Stage 8) and the `principleDescriptions` object in `script.js`.
- **Adjust the consent timer** — Change `consentTimerSeconds` in the state object inside `script.js` (default: 30 seconds).
- **Restyle** — CSS custom properties in `:root` at the top of `style.css` control the color palette.

## Accessibility

- All toggle buttons use `aria-pressed` to communicate state to screen readers
- Multi-select items display a `✓` checkmark so selection is not communicated by color alone
- Focus is visible on all interactive elements via `focus-visible` outlines
- Text areas have `aria-label` attributes
- The timer uses both color and a numeric countdown
- Layouts reflow to single-column on mobile

## License

This project was created for educational use in IDS 704 at Duke University.