# 23andMe Data Crisis — Choose-Your-Own-Adventure Ethics Simulation

An interactive, browser-based ethics simulation for **IDS 704: Ethics in Data Science** (Week 2 Discussion). Players select one of four distinct stakeholder roles to experience the ethical dilemmas around genetic data privacy, corporate bankruptcy, informed consent, and individual responsibility.

> **Reality check:** This simulation is inspired by real events involving 23andMe, but scenarios, offers, decisions, and dilemmas are hypothetical and designed for classroom ethical analysis.

## Choose Your Character

On the opening screen, students select one of four roles:

| Character | Perspective & Dilemma |
|---|---|
| 🛒 **The Consumer** | Trusted 23andMe with their DNA years ago. Faces the terms & conditions fine-print reality, chooses comfort levels with data sharing, and confronts what happens to their genome during bankruptcy. |
| 💼 **The Executive** | CEO running out of cash with 400 employees and creditors at the door. Decides whether to accept an unrestricted $50M buyout from Big Pharma, sell with conditions, or liquidate and destroy the data. |
| 🏢 **The Buyer** | VP of M&A at a pharmaceutical company. Balances the opportunity to accelerate drug discovery using 15M patient profiles against the ethical and regulatory obligations inherited from the original company. |
| 🔬 **The Data Scientist** | Senior data scientist with **$87,000 in student loan debt** who discovers soft-deleted user records in the sale pipeline. Faces the whistleblower dilemma: speak up and risk career ruin/debt default, or stay quiet and survive. |

---

## Simulation Stages

| Stage | Title | Description |
|---|---|---|
| 01 | **Character Selection** | Choose one of the 4 roles. |
| 02 | **Role Context & Briefing** | Immersive briefing for your character. *The Consumer* gets the interactive 30-second Terms of Service consent challenge; other roles review stakeholder stats and context. |
| 03 | **Data Interactions** | Role-specific prompt selecting which data categories to share, monetize, acquire, or audit. |
| 04 | **The Core Dilemma** | Major decision point tailored to your role with dynamic tradeoff analysis across competing ethical dimensions. |
| 05 | **The Twists** | 3 escalating complications and moral pressure points specific to your role. |
| 06 | **Data Ownership** | The universal question: *Who should control genetic and health data?* |
| 07 | **Final Reflection & Role Comparison** | Personal path recap + preview of the dilemmas other roles faced to prime in-person classroom discussion. |

---

## Getting Started

No build tools or dependencies are required — the simulation is a self-contained static web application.

1. **Open in a browser**
   ```bash
   open index.html        # macOS
   xdg-open index.html    # Linux
   start index.html       # Windows
   ```

2. Or serve locally:
   ```bash
   python3 -m http.server 8000
   ```

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `→` / `Space` | Advance to next stage |
| `←` | Previous stage |
| `R` | Restart / choose new character |

## License

Created for educational use in IDS 704: Ethics in Data Science at Duke University.