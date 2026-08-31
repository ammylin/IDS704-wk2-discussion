# 23andMe Data Crisis: Choose-Your-Own-Adventure Ethics Simulation
## Discussion led by Ammy Lin and Tonantzin Real Rojas

An interactive, browser-based ethics simulation for **IDS 704: Data Science Ethics and Policy** (Week 2 Discussion). Players select one of four distinct stakeholder roles to experience the ethical dilemmas around genetic data privacy, corporate bankruptcy, informed consent, and individual responsibility.

> **Reality check:** This simulation is inspired by real events involving 23andMe, but scenarios, offers, decisions, and dilemmas are hypothetical and designed for classroom ethical analysis.

> **Development Note:** This interactive web simulation was built using **Gemini 3.7 Flash**, with the prompt to generate the entire web experience based on our custom classroom game design and scenario outlines.

## Choose Your Character

On the opening screen, students select one of four roles:

| Character | Perspective & Dilemma |
|---|---|
| 🛒 **The Consumer** | Trusted 23andMe with their DNA years ago; now faces the terms & conditions fine-print reality, chooses comfort levels with data sharing, and confronts what happens to their genome during bankruptcy. |
| 💼 **The Executive** | CEO running out of cash with 400 employees and creditors at the door. Needs to decide whether to accept an unrestricted $50M buyout from Big Pharma, sell with conditions, or liquidate and destroy the data. |
| 🏢 **The Buyer** | Business acquisition lead at NovaCure Pharmaceuticals evaluating how to use the 15M genetic database to discover new medicines while balancing user consent and public trust. |
| 🔬 **The Data Scientist** | Senior data scientist with **$87,000 in student loan debt** who discovers soft-deleted user records in the sale pipeline. Faces the whistleblower dilemma: speak up and risk career ruin/debt default, or stay quiet and survive. |

---

## Simulation Stages

| Stage | Title | Description |
|---|---|---|
| 01 | **Character Selection** | Choose one of the 4 roles. |
| 02 | **Role Context & Briefing** | Immersive briefing for your character. *The Consumer* gets the interactive 30-second Terms of Service consent challenge; other roles review stakeholder stats and context. |
| 03 | **Data Interactions** | Role-specific prompt selecting which data categories to share, monetize, acquire, or audit. |
| 04 | **The Core Dilemma & Consequences** | Major decision point tailored to your role with dynamic **immediate consequence narratives** and tradeoff matrices across competing ethical dimensions. |
| 05 | **The Twists** | 3 escalating complications and moral pressure points specific to your role. |
| 06 | **Data Ownership** | The universal question: *Who should control genetic and health data?* |
| 07 | **Final Reflection & Results Submission** | Personal path recap, one-click **email results sharing to instructors**, and preview of other roles' dilemmas for classroom debate. |

---

## Key Features

- **Accessible Language**: Clear, scenario-driven phrasing for all roles, including the Buyer perspective.
- **Immediate Consequences**: Each choice in Stage 4 generates an immediate narrative aftermath card showing what happens next before reviewing broader tradeoffs.
- **Email / Share Results**: Students can click to open their default email client with their simulation answers pre-formatted to send to instructors, or copy the results directly to the clipboard.
- **Back Navigation**: Includes a top-bar `← BACK` button and Left Arrow shortcut to revisit previous screens.

---

## Getting Started

No build tools or dependencies are required, as the simulation is a self-contained static web application.

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

3. Or visit [https://ammylin.github.io/IDS704-wk2-discussion/](https://ammylin.github.io/IDS704-wk2-discussion/). 

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `→` / `Space` | Advance to next stage |
| `←` | Previous stage |
| `R` | Restart / choose new character |

## License & Attribution

Created for educational use in IDS 704: Data Science Ethics and Policy with Professor Jana Schaich Borg at Duke University. Developed using **Gemini 3.7 Flash** based on custom classroom ethics game design.
