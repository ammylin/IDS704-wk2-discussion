// ── Configuration & State ───────────────────────────────────────────────────

const totalStages = 7;

// Default instructor/facilitator email addresses
const DEFAULT_RECIPIENT_EMAILS = [
    "ammy.lin@duke.edu",
    "tonantzin.realrojas@duke.edu"
];

const state = {
    selectedRole: null, // "consumer", "executive", "buyer", "data-scientist"
    currentStage: 0,
    // Stage 2 (Consumer)
    consentChoice: null,
    consentUnderstanding: null,
    confidenceRating: null,
    // Stage 3 (Data Selection)
    selectedDataTypes: [],
    // Stage 4 (Core Dilemma)
    dilemmaChoice: null,
    // Stage 5 (Twists)
    twistIndex: 0,
    twistAnswers: [],
    // Stage 6 (Ownership)
    ownerChoice: null,
    // Timer
    consentTimerSeconds: 30,
    consentTimerId: null,
};

// ── Role Content Definitions ────────────────────────────────────────────────

const roleProfiles = {
    consumer: {
        id: "consumer",
        name: "THE CONSUMER",
        icon: "🛒",
        context: {
            eyebrow: "STAGE 02 • YOUR PERSPECTIVE",
            title: "YOU SENT YOUR SALIVA IN A TUBE.",
            lead: "Five years ago, you paid $99 to find out where your family came from and check for hereditary health conditions.",
            bodyHtml: `
                <div class="context-story-card">
                    <p>You checked a quick box saying <em>"I agree to the Terms of Service"</em> without reading the fine print.</p>
                    <p>Now news alerts pop up: <strong>23andMe is going bankrupt</strong>, and the company might sell its entire database to the highest bidder to pay its debts.</p>
                    <p class="callout-text">Let's look at what you actually agreed to back then.</p>
                </div>
            `,
            showPolicy: true,
        },
        dataPrompt: {
            eyebrow: "STAGE 03 • YOUR COMFORT ZONE",
            title: "WHAT DATA WOULD YOU BE OKAY SHARING?",
            prompt: "Select the kinds of personal data you would be comfortable with 23andMe sharing with other companies.",
            discussion: "What makes sharing one category of data feel safer or riskier than another? Is genetic data fundamentally different from your shopping history or location?",
            note: "Consider: If your credit card is stolen, you cancel it. If your DNA is leaked, you cannot change your genome.",
        },
        dilemma: {
            eyebrow: "STAGE 04 • BREAKING NEWS",
            title: "YOUR DNA IS ABOUT TO BE AUCTIONED.",
            headline: "23andMe is entering bankruptcy. A large pharmaceutical company has offered $50 million to buy the customer database.",
            prompt: "WHAT ACTION DO YOU TAKE AS A CONSUMER?",
            choices: [
                {
                    id: "delete",
                    label: "1. DEMAND IMMEDIATE DATA DELETION",
                    desc: "Request that your account, raw genetic data, and physical saliva sample be completely wiped from company servers."
                },
                {
                    id: "join-lawsuit",
                    label: "2. JOIN A CLASS-ACTION LAWSUIT",
                    desc: "Join other customers to legally block the sale until every user is asked for fresh permission."
                },
                {
                    id: "accept-research",
                    label: "3. ALLOW THE TRANSFER TO HELP MEDICAL RESEARCH",
                    desc: "Let the pharma company have your data, hoping it helps discover treatments for serious diseases."
                }
            ],
            tradeoffs: {
                delete: [
                    { dimension: "Personal Privacy Protection", level: "positive" },
                    { dimension: "Control Over Your Future", level: "positive" },
                    { dimension: "Contribution to Medical Cures", level: "negative" },
                    { dimension: "Guarantee (Will backup servers actually wipe it?)", level: "mixed" },
                ],
                "join-lawsuit": [
                    { dimension: "Standing Up for User Rights", level: "positive" },
                    { dimension: "Immediate Resolution", level: "negative" },
                    { dimension: "Public Awareness & Media Attention", level: "positive" },
                    { dimension: "Court Delays & Legal Costs", level: "mixed" },
                ],
                "accept-research": [
                    { dimension: "Potential for Life-Saving Treatments", level: "positive" },
                    { dimension: "Personal & Family Privacy Risk", level: "negative" },
                    { dimension: "Private Company Profiting From Your DNA", level: "negative" },
                    { dimension: "No Hassle or Legal Battles", level: "mixed" },
                ]
            },
            consequences: {
                delete: {
                    title: "CONSEQUENCE: You Submitted a Deletion Demand",
                    story: "You receive an automated email: <em>'Your request is queued. However, data already shared with research partners or stored in analytical models cannot be retrieved.'</em>",
                    impact: "Your profile is removed from the active website, but your genetic markers remain baked into past statistical studies."
                },
                "join-lawsuit": {
                    title: "CONSEQUENCE: You Joined the Class-Action",
                    story: "A federal judge places a temporary restraining order on the database sale. The news goes viral, sparking a national debate on digital ownership.",
                    impact: "The sale is frozen for months. 23andMe warns that without cash from the sale, servers will be shut off without an orderly shutdown."
                },
                "accept-research": {
                    title: "CONSEQUENCE: You Allowed the Data Transfer",
                    story: "The buyer absorbs your files into their cloud platform. Two years later, they announce a patent for a profitable new cancer immunotherapy.",
                    impact: "You contributed to medical progress, but you receive no share of profits and have no control over future company buyouts."
                }
            },
            discussion: "If you delete your profile, what happens to research models that were already trained using your genetic data?"
        },
        twists: [
            {
                title: "The buyer promises that your name and email will be stripped from your DNA before researchers see it.",
                question: "Does this make you feel secure about the sale?"
            },
            {
                title: "Even if your siblings never took a DNA test, your test results reveal roughly 50% of their genetic code.",
                question: "Do you have the moral right to decide what happens to shared family DNA?"
            },
            {
                title: "The buyer discovers a new treatment for Alzheimer's using this database.",
                question: "Does saving lives justify selling the data without asking you again?"
            }
        ],
        ownerQuestion: "Does your answer change knowing that your genetic data can also expose your biological family members?"
    },

    executive: {
        id: "executive",
        name: "THE EXECUTIVE",
        icon: "💼",
        context: {
            eyebrow: "STAGE 02 • THE BOARDROOM",
            title: "THE COMPANY IS RUNNING OUT OF CASH.",
            lead: "As the Chief Executive Officer, you are responsible for 400 employees, company debts, and shareholders.",
            stats: [
                { value: "$50M", label: "Cash Burn / Year" },
                { value: "400", label: "Employees At Risk" },
                { value: "15M+", label: "Genotyped Customers" },
                { value: "30 Days", label: "Cash Remaining" }
            ],
            bodyHtml: `
                <div class="context-story-card">
                    <p>The original business model hit a wall: once people find their ancestry results, they stop paying monthly fees.</p>
                    <p>Lenders and creditors are demanding payment. If the company goes into liquidation, a court trustee will sell all company assets to the highest bidder anyway.</p>
                    <p class="callout-text">Your most valuable remaining asset is the database of 15+ million customer DNA records.</p>
                </div>
            `,
            showPolicy: false,
        },
        dataPrompt: {
            eyebrow: "STAGE 03 • ASSET VALUATION",
            title: "WHAT ASSETS DO YOU PUT UP FOR SALE?",
            prompt: "Select the categories of user data you are willing to bundle into the sale package.",
            discussion: "Which data categories bring in the highest price, and which ones carry the highest legal and ethical risks?",
            note: "Valuation reality: Bundling health surveys with DNA data makes the database worth 5x more than raw DNA alone.",
        },
        dilemma: {
            eyebrow: "STAGE 04 • THE BUYOUT OFFER",
            title: "A $50,000,000 LIFELINE FROM A PHARMA COMPANY.",
            headline: "NovaCure Pharmaceuticals offers $50M cash for full ownership of 23andMe's customer database.",
            prompt: "WHAT DO YOU PROPOSE TO THE BOARD OF DIRECTORS?",
            choices: [
                {
                    id: "sell-unrestricted",
                    label: "1. ACCEPT THE FULL $50M SALE",
                    desc: "Sell the complete database without restrictions to pay all debts and provide severance to your 400 employees."
                },
                {
                    id: "sell-conditional",
                    label: "2. SELL WITH PRIVACY CONDITIONS",
                    desc: "Require the buyer to follow the original privacy rules and give users 30 days to opt out (accepting a 40% lower purchase price)."
                },
                {
                    id: "destroy-liquidate",
                    label: "3. REFUSE THE SALE AND PURGE THE DATA",
                    desc: "Block the sale and order the customer database deleted before shutting down the company."
                }
            ],
            tradeoffs: {
                "sell-unrestricted": [
                    { dimension: "Paying Debts & Employee Severance", level: "positive" },
                    { dimension: "Preventing Immediate Bankruptcy Lawsuits", level: "positive" },
                    { dimension: "Customer Trust & Company Legacy", level: "negative" },
                    { dimension: "Risk of Government Privacy Investigations", level: "negative" },
                ],
                "sell-conditional": [
                    { dimension: "Lower Cash Payout (Debts only partly paid)", level: "mixed" },
                    { dimension: "Respecting Customer Expectations", level: "positive" },
                    { dimension: "Risk that the Buyer Walks Away", level: "mixed" },
                    { dimension: "Strong Legal & Ethical Defense", level: "positive" },
                ],
                "destroy-liquidate": [
                    { dimension: "Total Customer Privacy Protection", level: "positive" },
                    { dimension: "Lawsuits from Creditors against the Board", level: "negative" },
                    { dimension: "Zero Severance for 400 Laid-off Workers", level: "negative" },
                    { dimension: "Loss of Research Data for Future Cures", level: "negative" },
                ]
            },
            consequences: {
                "sell-unrestricted": {
                    title: "CONSEQUENCE: Full Sale Approved",
                    story: "The wire transfer clears. 400 employees receive severance packages and debts are settled. But the headlines are brutal: <em>'23andMe Sells Millions of Genomes to Big Pharma.'</em>",
                    impact: "State Attorneys General launch investigations into whether the sale broke state consumer protection laws."
                },
                "sell-conditional": {
                    title: "CONSEQUENCE: Conditional Sale Negotiated",
                    story: "NovaCure accepts a $30M price tag. 1.2 million users opt out and have their records deleted. The remaining 14M records are transferred with strict privacy caps.",
                    impact: "You preserved employee benefits and respected user choices, but creditors sue the board for accepting a lower purchase offer."
                },
                "destroy-liquidate": {
                    title: "CONSEQUENCE: Data Wiped, Immediate Liquidation",
                    story: "Engineers run the deletion scripts. Privacy advocates praise the decision as a landmark victory for human rights.",
                    impact: "Creditors file emergency lawsuits against board members personally for destroying company assets, and staff receive zero severance."
                }
            },
            discussion: "Under corporate law, company executives have a duty to get the most money possible for creditors during bankruptcy. Is breaking customer trust an acceptable price?"
        },
        twists: [
            {
                title: "A foreign healthcare company offers $120M (more than double), but operates outside US privacy regulations.",
                question: "Do you take the higher bid to save more jobs and pay off all debt?"
            },
            {
                title: "State regulators warn they will sue if you sell data from users who never checked 'research consent'.",
                question: "Do you spend scarce cash fighting them in court to close the deal?"
            },
            {
                title: "Your engineering lead warns that processing user deletion requests will delay the sale by 6 months, causing immediate shutdown.",
                question: "Do you proceed with the sale without waiting for pending deletion requests?"
            }
        ],
        ownerQuestion: "Does your answer change if selling the database is the only way to pay your employees severance?"
    },

    buyer: {
        id: "buyer",
        name: "THE BUYER",
        icon: "🏢",
        context: {
            eyebrow: "STAGE 02 • THE OPPORTUNITY",
            title: "A CHANCE TO BUY 15 MILLION GENETIC PROFILES.",
            lead: "You lead business acquisitions at NovaCure Pharmaceuticals, a company developing treatments for major illnesses.",
            stats: [
                { value: "$1.2B", label: "Avg Drug Cost" },
                { value: "10-15 Yrs", label: "Time to Market" },
                { value: "85%", label: "Lab Failure Rate" },
                { value: "15M", label: "Patient Profiles" }
            ],
            bodyHtml: `
                <div class="context-story-card">
                    <p>Developing new medications is slow, risky, and expensive. Having access to 15 million people's DNA paired with their health survey answers could help uncover treatments for cancer, Alzheimer's, and rare diseases.</p>
                    <p>Building a database like this from scratch would take decades and cost billions. 23andMe's bankruptcy gives your team a rare shortcut.</p>
                    <p class="callout-text">Your challenge: How to use this data to find new medicines without triggering public backlash or government fines.</p>
                </div>
            `,
            showPolicy: false,
        },
        dataPrompt: {
            eyebrow: "STAGE 03 • TARGETING DATA",
            title: "WHICH DATASETS DOES YOUR RESEARCH TEAM NEED?",
            prompt: "Select the types of user data your scientific team needs to discover new treatments.",
            discussion: "If genetic data is stripped of lifestyle details and medical symptoms, does it lose its value for finding treatments?",
            note: "Medical insight: Without paired health details (family history, diet, diagnosed conditions), raw DNA is much harder to use for developing targeted drugs.",
        },
        dilemma: {
            eyebrow: "STAGE 04 • THE ACQUISITION PLAN",
            title: "HOW DO YOU PLAN TO USE THE DATA?",
            headline: "NovaCure is preparing its final proposal for the bankruptcy court tomorrow morning.",
            prompt: "WHAT ACQUISITION PLAN DO YOU SUBMIT?",
            choices: [
                {
                    id: "clean-slate",
                    label: "1. BUY WITHOUT PAST RESTRICTIONS",
                    desc: "Buy the database free and clear of old promises, applying NovaCure's own standard terms for research and drug commercialization."
                },
                {
                    id: "honor-consent",
                    label: "2. HONOR OLD PRIVACY RULES & ASK FOR NEW CONSENT",
                    desc: "Only use data from customers who opted into research, and reach out to request fresh consent for commercial drug trials."
                },
                {
                    id: "open-consortium",
                    label: "3. SHARE WITH UNIVERSITIES AS AN OPEN ALLIANCE",
                    desc: "Partner with universities and public health agencies to share findings openly, while keeping first rights to make new drugs."
                }
            ],
            tradeoffs: {
                "clean-slate": [
                    { dimension: "Speed in Developing New Medicines", level: "positive" },
                    { dimension: "Maximum Corporate Profitability", level: "positive" },
                    { dimension: "Public Trust & Customer Approval", level: "negative" },
                    { dimension: "Risk of Regulatory Lawsuits & Fines", level: "negative" },
                ],
                "honor-consent": [
                    { dimension: "Ethical Standing & Consumer Respect", level: "positive" },
                    { dimension: "Compliance with Privacy Regulators", level: "positive" },
                    { dimension: "Smaller Usable Dataset (many won't respond)", level: "negative" },
                    { dimension: "Return on Financial Investment", level: "mixed" },
                ],
                "open-consortium": [
                    { dimension: "Global Scientific & Public Benefit", level: "positive" },
                    { dimension: "High Academic & Community Goodwill", level: "positive" },
                    { dimension: "Exclusive Commercial Monopoly", level: "negative" },
                    { dimension: "Complex Multi-Organization Management", level: "mixed" },
                ]
            },
            consequences: {
                "clean-slate": {
                    title: "CONSEQUENCE: Unrestricted Access Acquired",
                    story: "Your scientists begin running drug discovery algorithms across all 15M genomes. Within 6 months, promising targets for autoimmune disorders are found.",
                    impact: "Consumer groups organize boycotts, and the Federal Trade Commission files an inquiry into your company's data practices."
                },
                "honor-consent": {
                    title: "CONSEQUENCE: New Consent Campaign Launched",
                    story: "NovaCure emails all users asking for clear permission. About 40% enthusiastically agree, while 60% ignore or delete their accounts.",
                    impact: "Your dataset is smaller, but every record is legally bulletproof, and medical journals praise your transparent ethical standards."
                },
                "open-consortium": {
                    title: "CONSEQUENCE: Open Research Consortium Formed",
                    story: "NovaCure joins forces with the NIH and leading research universities. Global scientists discover three new genetic markers for Parkinson's disease.",
                    impact: "Your company is hailed as a leader in open science, though investors complain that profits must be shared with research partners."
                }
            },
            discussion: "When you buy factory equipment at an auction, you have no relationship with the previous customers. Does buying personal genetic data follow the same rule?"
        },
        twists: [
            {
                title: "Your scientists discover that rare genetic markers can be matched back to real names using public family tree websites.",
                question: "Do you allow internal research teams to re-identify patients to verify clinical outcomes?"
            },
            {
                title: "A major health insurance company offers to split the purchase cost if you share health risk scores on customer groups.",
                question: "Do you partner with the insurance company to save acquisition costs?"
            },
            {
                title: "Government regulators say they will approve the purchase only if any medicines you invent are sold at affordable, capped prices.",
                question: "Do you still go through with buying the database under price limits?"
            }
        ],
        ownerQuestion: "Does your answer change if commercial incentives are the most realistic way to fund expensive life-saving clinical trials?"
    },

    "data-scientist": {
        id: "data-scientist",
        name: "THE DATA SCIENTIST",
        icon: "🔬",
        context: {
            eyebrow: "STAGE 02 • THE ETHICAL DILEMMA",
            title: "YOU DISCOVER WHAT'S IN THE SALE DATA.",
            lead: "You are a Senior Data Scientist at 23andMe. You have $87,000 in student loan debt and financially support your family.",
            stats: [
                { value: "$87,000", label: "Student Loan Debt" },
                { value: "$1,450", label: "Monthly Payment" },
                { value: "Work Visa", label: "Tied to Employment" },
                { value: "2 Weeks", label: "Emergency Savings" }
            ],
            bodyHtml: `
                <div class="context-story-card">
                    <p>While preparing the data export files for potential buyers, you discover that the dataset includes records from customers who clicked <strong>'Delete My Account'</strong> over the past two years.</p>
                    <p>Because of engineering backlogs, their records were hidden on the website but remained stored in the main data warehouse.</p>
                    <p class="callout-text">When you flag this to your manager, they quietly tell you: <em>"Don't hold up this sale. If this deal falls through, everyone is laid off by Friday—including you."</em></p>
                </div>
            `,
            showPolicy: false,
        },
        dataPrompt: {
            eyebrow: "STAGE 03 • AUDITING THE PIPELINE",
            title: "WHICH LEFTOVER DATA IS THE MOST HARMFUL TO LEAK?",
            prompt: "Select the categories of un-scrubbed data that you are most concerned to find in the export bucket.",
            discussion: "Why is an internal data scientist often the only checkpoint between technical convenience and violating people's rights?",
            note: "Engineering reality: In massive data systems, completely deleting all traces of a user's record across backups requires significant time and effort.",
        },
        dilemma: {
            eyebrow: "STAGE 04 • THE WHISTLEBLOWER CHOICE",
            title: "SPEAK UP OR PROTECT YOUR LIVELIHOOD?",
            headline: "The data package is scheduled to transfer to the buyer's servers at midnight.",
            prompt: "WHAT CHOICE DO YOU MAKE TONIGHT?",
            choices: [
                {
                    id: "whistleblow",
                    label: "1. BLOW THE WHISTLE EXTERNALLY",
                    desc: "Send evidence of the undeleted user records to federal regulators and investigative journalists. (Risk getting fired, sued, and defaulting on student loans)."
                },
                {
                    id: "internal-escalate",
                    label: "2. ESCALATE INTERNALLY TO THE BOARD",
                    desc: "Threaten to resign immediately and write a formal memo to the Board of Directors demanding the data transfer be paused until records are cleaned."
                },
                {
                    id: "stay-quiet",
                    label: "3. STAY QUIET & PROTECT YOUR FINANCES",
                    desc: "Keep your head down, process the files, keep your job, and make your student loan payments."
                }
            ],
            tradeoffs: {
                whistleblow: [
                    { dimension: "Personal Integrity & Public Duty", level: "positive" },
                    { dimension: "Protecting 100,000+ Deleted Users", level: "positive" },
                    { dimension: "Personal Financial Stability ($87k Debt)", level: "negative" },
                    { dimension: "Threat of Blacklisting & Retaliation", level: "negative" },
                ],
                "internal-escalate": [
                    { dimension: "Professional Due Diligence", level: "positive" },
                    { dimension: "Chance to Fix the Problem Internally", level: "mixed" },
                    { dimension: "Risk of Being Sidelined or Quietly Let Go", level: "negative" },
                    { dimension: "Protection of Work Visa & Standing", level: "mixed" },
                ],
                "stay-quiet": [
                    { dimension: "Financial Security & Loan Payments", level: "positive" },
                    { dimension: "Family Protection & Job Continuity", level: "positive" },
                    { dimension: "Complicity in Unethical Data Transfer", level: "negative" },
                    { dimension: "Long-term Moral Weight & Guilt", level: "negative" },
                ]
            },
            consequences: {
                whistleblow: {
                    title: "CONSEQUENCE: You Blew the Whistle",
                    story: "Your leak breaks on front-page news. Regulators freeze the transaction. You are fired the next morning and your company threatens legal action for leaking internal files.",
                    impact: "You protected thousands of users, but your income stops immediately, putting your visa status and loan payments in immediate danger."
                },
                "internal-escalate": {
                    title: "CONSEQUENCE: You Wrote the Board Memo",
                    story: "The Board holds an emergency meeting and delays the sale by two weeks to scrub deleted records. Management is furious with you for slowing the deal.",
                    impact: "The records get cleaned up, but you are excluded from future leadership meetings and assigned to minor maintenance tasks."
                },
                "stay-quiet": {
                    title: "CONSEQUENCE: You Followed Orders",
                    story: "The transfer completes at midnight. The buyout funds your paycheck and loan payments. Six months later, a cybersecurity audit discovers the undeleted records.",
                    impact: "You kept your job and financial stability, but your name is on the data pipeline documentation, and colleagues wonder who approved the transfer."
                }
            },
            discussion: "Ethics has real costs. When doing the right thing puts your rent, food, or $87k in student debt at risk, how much personal sacrifice is reasonable to expect from an employee?"
        },
        twists: [
            {
                title: "A colleague tells you they are preparing an anonymous regulatory tip and asks you to co-sign it.",
                question: "Do you join the complaint knowing there is strength in numbers, but discovery is likely?"
            },
            {
                title: "The buyer offers a $40,000 cash bonus to data science employees who stay on to help integrate the database.",
                question: "Does the chance to pay off nearly half your student loans tempt you to help with the transfer?"
            },
            {
                title: "You have code access to quietly run a script that permanently deletes the leftover records before you leave work.",
                question: "Do you take matters into your own hands by secretly deleting the data yourself?"
            }
        ],
        ownerQuestion: "Does your answer change when an individual employee is forced to bear the ethical burden of a multi-million dollar corporate system?"
    }
};

// ── DOM References ───────────────────────────────────────────────────────────

const stageNumberEl = document.getElementById("stage-number");
const stageTotalEl = document.getElementById("stage-total");
const progressFillEl = document.getElementById("progress-fill");
const roleBadgeEl = document.getElementById("role-badge");
const roleBadgeIconEl = document.getElementById("role-badge-icon");
const roleBadgeLabelEl = document.getElementById("role-badge-label");
const backBtnEl = document.getElementById("back-btn");

const screens = [...document.querySelectorAll(".screen")];

// Stage 2
const contextEyebrowEl = document.getElementById("context-eyebrow");
const contextTitleEl = document.getElementById("context-title");
const contextLeadEl = document.getElementById("context-lead");
const contextStatsEl = document.getElementById("context-stats");
const contextBodyEl = document.getElementById("context-body");
const policySectionEl = document.getElementById("policy-section");
const contextContinueBtnEl = document.getElementById("context-continue-btn");
const countdownValueEl = document.getElementById("countdown-value");
const consentRevealEl = document.getElementById("consent-reveal");
const confidenceSectionEl = document.getElementById("confidence-section");

// Stage 3
const dataEyebrowEl = document.getElementById("data-eyebrow");
const dataTitleEl = document.getElementById("data-title");
const dataPromptEl = document.getElementById("data-prompt");
const dataDiscussionTextEl = document.getElementById("data-discussion-text");
const dataDiscussionNoteEl = document.getElementById("data-discussion-note");

// Stage 4
const dilemmaEyebrowEl = document.getElementById("dilemma-eyebrow");
const dilemmaTitleEl = document.getElementById("dilemma-title");
const dilemmaHeadlineEl = document.getElementById("dilemma-headline");
const dilemmaPromptEl = document.getElementById("dilemma-prompt");
const dilemmaChoicesEl = document.getElementById("dilemma-choices");
const dilemmaSummaryEl = document.getElementById("dilemma-summary");
const dilemmaTradeoffPanelEl = document.getElementById("dilemma-tradeoff-panel");
const dilemmaTradeoffGridEl = document.getElementById("dilemma-tradeoff-grid");
const dilemmaDiscussionEl = document.getElementById("dilemma-discussion");
const dilemmaDiscussionTextEl = document.getElementById("dilemma-discussion-text");
const dilemmaContinueBtnEl = document.getElementById("dilemma-continue");

// Stage 5
const twistTitleEl = document.getElementById("twist-title");
const twistQuestionEl = document.getElementById("twist-question");
const twistIndexTextEl = document.getElementById("twist-index-text");
const twistSummaryEl = document.getElementById("twist-summary");
const revealTwistBtnEl = document.getElementById("reveal-next-twist");
const continueAfterTwistsBtnEl = document.getElementById("continue-after-twists");

// Stage 6
const ownerSummaryEl = document.getElementById("owner-summary");
const ownerRoleQuestionEl = document.getElementById("owner-role-question");

// ── Navigation ───────────────────────────────────────────────────────────────

function clampStage(value) {
    return Math.min(Math.max(value, 0), totalStages - 1);
}

function updateProgress() {
    const progress = ((state.currentStage + 1) / totalStages) * 100;
    stageNumberEl.textContent = String(state.currentStage + 1).padStart(2, "0");
    stageTotalEl.textContent = String(totalStages).padStart(2, "0");
    progressFillEl.style.width = `${progress}%`;
}

function updateRoleBadge() {
    if (!state.selectedRole) {
        roleBadgeEl.classList.add("hidden");
        return;
    }
    const role = roleProfiles[state.selectedRole];
    roleBadgeIconEl.textContent = role.icon;
    roleBadgeLabelEl.textContent = role.name;
    roleBadgeEl.classList.remove("hidden");
}

function showScreen(index) {
    state.currentStage = clampStage(index);

    screens.forEach((screen, screenIndex) => {
        screen.classList.toggle("active", screenIndex === state.currentStage);
    });

    if (backBtnEl) {
        backBtnEl.classList.toggle("hidden", state.currentStage === 0);
    }

    updateProgress();
    syncStageSpecificUI();

    const shell = document.querySelector(".app-shell");
    if (shell) shell.scrollTo({ top: 0, behavior: "smooth" });
}

function goToNext() {
    if (state.currentStage < totalStages - 1) {
        showScreen(state.currentStage + 1);
    }
}

function goToPrevious() {
    if (state.currentStage > 0) {
        showScreen(state.currentStage - 1);
    }
}

// ── Selection State Sync ─────────────────────────────────────────────────────

function syncSelectionStates() {
    // Character cards
    document.querySelectorAll(".character-card").forEach((card) => {
        card.classList.toggle("is-selected", state.selectedRole === card.dataset.role);
    });

    // Stage 2: consent (consumer)
    document.querySelectorAll("[data-consent]").forEach((button) => {
        button.classList.toggle("is-selected", state.consentChoice === button.dataset.consent);
    });
    document.querySelectorAll("[data-consent-understanding]").forEach((button) => {
        button.classList.toggle("is-selected", state.consentUnderstanding === button.dataset.consentUnderstanding);
    });
    document.querySelectorAll(".confidence-btn").forEach((button) => {
        button.classList.toggle("is-selected", state.confidenceRating === button.dataset.confidence);
    });

    // Stage 3: data cards
    document.querySelectorAll(".data-card").forEach((card) => {
        const selected = state.selectedDataTypes.includes(card.dataset.dataType);
        card.classList.toggle("is-selected", selected);
        card.setAttribute("aria-pressed", String(selected));
    });

    // Stage 4: dilemma choice buttons
    document.querySelectorAll("[data-dilemma-choice]").forEach((button) => {
        button.classList.toggle("is-selected", state.dilemmaChoice === button.dataset.dilemmaChoice);
    });

    // Stage 5: twist answer buttons
    document.querySelectorAll("[data-twist-answer]").forEach((button) => {
        const selected = state.twistAnswers[state.twistIndex] === button.dataset.twistAnswer;
        button.classList.toggle("is-selected", selected);
    });

    // Stage 6: owner buttons
    document.querySelectorAll(".owner-btn").forEach((button) => {
        button.classList.toggle("is-selected", state.ownerChoice === button.dataset.owner);
    });
}

// ── Timer Logic ──────────────────────────────────────────────────────────────

function clearConsentTimer() {
    if (state.consentTimerId) {
        clearInterval(state.consentTimerId);
        state.consentTimerId = null;
    }
}

function startConsentTimer() {
    clearConsentTimer();
    state.consentTimerSeconds = 30;
    countdownValueEl.textContent = String(state.consentTimerSeconds);
    countdownValueEl.classList.remove("warning");

    state.consentTimerId = setInterval(() => {
        state.consentTimerSeconds -= 1;
        countdownValueEl.textContent = String(Math.max(state.consentTimerSeconds, 0));

        if (state.consentTimerSeconds <= 10) {
            countdownValueEl.classList.add("warning");
        }

        if (state.consentTimerSeconds <= 0) {
            clearConsentTimer();
            countdownValueEl.textContent = "0";
            countdownValueEl.classList.add("warning");
        }
    }, 1000);
}

// ── Setup Stages by Role ─────────────────────────────────────────────────────

function setupStage2Context() {
    if (!state.selectedRole) return;
    const role = roleProfiles[state.selectedRole];
    contextEyebrowEl.textContent = role.context.eyebrow;
    contextTitleEl.textContent = role.context.title;
    contextLeadEl.textContent = role.context.lead;

    if (role.context.stats && role.context.stats.length) {
        contextStatsEl.innerHTML = role.context.stats
            .map(s => `<div class="stat-card"><span class="stat-val">${s.value}</span><span class="stat-lbl">${s.label}</span></div>`)
            .join("");
        contextStatsEl.classList.remove("hidden");
    } else {
        contextStatsEl.classList.add("hidden");
        contextStatsEl.innerHTML = "";
    }

    contextBodyEl.innerHTML = role.context.bodyHtml || "";

    if (role.context.showPolicy) {
        policySectionEl.classList.remove("hidden");
        contextContinueBtnEl.classList.add("hidden");
        if (!state.consentChoice) {
            consentRevealEl.classList.add("hidden");
            confidenceSectionEl.classList.add("hidden");
            startConsentTimer();
        } else {
            clearConsentTimer();
            consentRevealEl.classList.remove("hidden");
            if (state.consentUnderstanding) {
                confidenceSectionEl.classList.remove("hidden");
            }
        }
    } else {
        policySectionEl.classList.add("hidden");
        contextContinueBtnEl.classList.remove("hidden");
        clearConsentTimer();
    }
}

function setupStage3Data() {
    if (!state.selectedRole) return;
    const role = roleProfiles[state.selectedRole];
    dataEyebrowEl.textContent = role.dataPrompt.eyebrow;
    dataTitleEl.textContent = role.dataPrompt.title;
    dataPromptEl.textContent = role.dataPrompt.prompt;
    dataDiscussionTextEl.textContent = role.dataPrompt.discussion;
    dataDiscussionNoteEl.textContent = role.dataPrompt.note;
}

function setupStage4Dilemma() {
    if (!state.selectedRole) return;
    const role = roleProfiles[state.selectedRole];
    dilemmaEyebrowEl.textContent = role.dilemma.eyebrow;
    dilemmaTitleEl.textContent = role.dilemma.title;
    dilemmaHeadlineEl.textContent = role.dilemma.headline;
    dilemmaPromptEl.textContent = role.dilemma.prompt;

    dilemmaChoicesEl.innerHTML = role.dilemma.choices
        .map(c => `
            <button class="choice-btn dilemma-choice-card" data-dilemma-choice="${c.id}">
                <span class="dilemma-card-label">${c.label}</span>
                <span class="dilemma-card-desc">${c.desc}</span>
            </button>
        `)
        .join("");

    if (state.dilemmaChoice) {
        renderDilemmaTradeoffs(state.dilemmaChoice);
    } else {
        dilemmaSummaryEl.classList.add("hidden");
        dilemmaTradeoffPanelEl.classList.add("hidden");
        dilemmaDiscussionEl.classList.add("hidden");
        dilemmaContinueBtnEl.classList.add("hidden");
    }
}

function renderDilemmaTradeoffs(choiceId) {
    if (!state.selectedRole) return;
    const role = roleProfiles[state.selectedRole];
    const choiceObj = role.dilemma.choices.find(c => c.id === choiceId);
    if (!choiceObj) return;

    dilemmaSummaryEl.textContent = `YOUR DECISION: ${choiceObj.label}`;
    dilemmaSummaryEl.classList.remove("hidden");

    const items = role.dilemma.tradeoffs[choiceId] || [];
    const levelLabels = { positive: "Positive", mixed: "Mixed", negative: "Negative" };

    // Dynamic consequence card for this specific choice
    const consequence = role.dilemma.consequences ? role.dilemma.consequences[choiceId] : null;
    let consequenceHtml = "";
    if (consequence) {
        consequenceHtml = `
            <div class="consequence-card">
                <div class="consequence-badge">IMMEDIATE AFTERMATH</div>
                <h4>${consequence.title}</h4>
                <p class="consequence-story">${consequence.story}</p>
                <div class="consequence-impact"><strong>Key Impact:</strong> ${consequence.impact}</div>
            </div>
        `;
    }

    dilemmaTradeoffGridEl.innerHTML = `
        ${consequenceHtml}
        <div class="tradeoff-matrix-title">PROJECTED TRADEOFFS</div>
        <div class="tradeoff-subgrid">
            ${items
                .map(
                    (item) => `
                <div class="tradeoff-item tradeoff-${item.level}">
                    <span class="tradeoff-indicator tradeoff-dot-${item.level}" aria-hidden="true"></span>
                    <span class="tradeoff-dimension">${item.dimension}</span>
                    <span class="tradeoff-level-label">${levelLabels[item.level]}</span>
                </div>`
                )
                .join("")}
        </div>
    `;

    dilemmaTradeoffPanelEl.classList.remove("hidden");
    dilemmaDiscussionTextEl.textContent = role.dilemma.discussion;
    dilemmaDiscussionEl.classList.remove("hidden");
    dilemmaContinueBtnEl.classList.remove("hidden");
}

function updateTwistDisplay() {
    if (!state.selectedRole) return;
    const role = roleProfiles[state.selectedRole];
    const twists = role.twists || [];
    const twist = twists[state.twistIndex] || twists[0];

    twistIndexTextEl.textContent = `TWIST 0${Math.min(state.twistIndex + 1, twists.length)}`;
    twistTitleEl.textContent = twist.title;
    twistQuestionEl.textContent = twist.question;

    const summaryEntries = state.twistAnswers
        .map((answer, index) => {
            if (!answer) return null;
            return `Twist ${index + 1}: ${answer.toUpperCase()}`;
        })
        .filter(Boolean);

    if (summaryEntries.length) {
        twistSummaryEl.textContent = summaryEntries.join(" • ");
        twistSummaryEl.classList.remove("hidden");
    } else {
        twistSummaryEl.classList.add("hidden");
    }

    const isLastTwist = state.twistIndex === twists.length - 1;
    const hasAnsweredLastTwist = !!state.twistAnswers[state.twistIndex];

    if (isLastTwist && hasAnsweredLastTwist) {
        revealTwistBtnEl.classList.add("hidden");
        continueAfterTwistsBtnEl.classList.remove("hidden");
    } else {
        revealTwistBtnEl.classList.remove("hidden");
        continueAfterTwistsBtnEl.classList.add("hidden");
    }
}

function revealNextTwist() {
    if (!state.selectedRole) return;
    const twists = roleProfiles[state.selectedRole].twists || [];
    if (state.twistIndex < twists.length - 1) {
        state.twistIndex += 1;
        updateTwistDisplay();
        syncSelectionStates();
    }
}

function setupStage6Ownership() {
    if (!state.selectedRole) return;
    const role = roleProfiles[state.selectedRole];
    ownerRoleQuestionEl.textContent = role.ownerQuestion;

    if (state.ownerChoice) {
        ownerSummaryEl.textContent = `Selected Position: ${state.ownerChoice}`;
        ownerSummaryEl.classList.remove("hidden");
    } else {
        ownerSummaryEl.classList.add("hidden");
    }
}

// ── Stage 7: Reflection & Email Results ──────────────────────────────────────

function getResultsSummaryText() {
    if (!state.selectedRole) return "";
    const role = roleProfiles[state.selectedRole];
    const dataStr = state.selectedDataTypes.length ? state.selectedDataTypes.join(", ") : "None chosen";
    const choiceObj = role.dilemma.choices.find(c => c.id === state.dilemmaChoice);
    const dilemmaStr = choiceObj ? choiceObj.label : "No choice made";
    const ownerStr = state.ownerChoice || "No position chosen";

    let twistText = state.twistAnswers
        .map((a, i) => `  - Twist ${i + 1}: ${a ? a.toUpperCase() : "Skipped"}`)
        .join("\n");

    let consumerDetail = "";
    if (state.selectedRole === "consumer") {
        const consentLabels = { agree: "Agreed without reading", decline: "Declined" };
        consumerDetail = `Terms Acceptance: ${state.consentChoice ? consentLabels[state.consentChoice] : "N/A"}\nConfidence in User Understanding: ${state.confidenceRating || "N/A"}/5\n`;
    }

    return `
========================================
23andMe Ethics Simulation Results
IDS 704: Ethics in Data Science
========================================

Role Played: ${role.name}

${consumerDetail}Data Types Selected for Sharing/Audit:
${dataStr}

Core Dilemma Decision:
${dilemmaStr}

Twist Responses:
${twistText}

Data Ownership Stance:
${ownerStr}

========================================
Generated via 23andMe Crisis Desk
========================================
`.trim();
}

function setupStage7Reflection() {
    if (!state.selectedRole) return;
    const currentRole = roleProfiles[state.selectedRole];

    document.getElementById("recap-role-name").textContent = `${currentRole.icon} ${currentRole.name}`;

    // 1. Recap of this playthrough
    const recapEl = document.getElementById("decisions-recap");
    const dataStr = state.selectedDataTypes.length ? state.selectedDataTypes.join(", ") : "None chosen";
    const choiceObj = currentRole.dilemma.choices.find(c => c.id === state.dilemmaChoice);
    const dilemmaStr = choiceObj ? choiceObj.label : "No choice made";
    const ownerStr = state.ownerChoice || "No position chosen";

    let roleSpecificItemHtml = "";
    if (state.selectedRole === "consumer") {
        const consentLabels = { agree: "Agreed without reading", decline: "Declined" };
        const consentStr = state.consentChoice ? consentLabels[state.consentChoice] : "N/A";
        roleSpecificItemHtml = `
            <div class="recap-item">
                <span class="recap-label">Terms & Privacy Acceptance</span>
                <span class="recap-value">${consentStr}</span>
            </div>
        `;
    }

    recapEl.innerHTML = `
        <h3>YOUR PATH SUMMARY</h3>
        <div class="recap-grid">
            <div class="recap-item">
                <span class="recap-label">Role Played</span>
                <span class="recap-value">${currentRole.icon} ${currentRole.name}</span>
            </div>
            ${roleSpecificItemHtml}
            <div class="recap-item">
                <span class="recap-label">Data Types Selected</span>
                <span class="recap-value">${dataStr}</span>
            </div>
            <div class="recap-item recap-item-wide">
                <span class="recap-label">Core Crisis Decision</span>
                <span class="recap-value">${dilemmaStr}</span>
            </div>
            <div class="recap-item">
                <span class="recap-label">Data Ownership Stance</span>
                <span class="recap-value">${ownerStr}</span>
            </div>
        </div>
    `;

    // 2. Email share section
    const emailContainerEl = document.getElementById("email-results-container");
    if (emailContainerEl) {
        emailContainerEl.innerHTML = `
            <div class="email-results-card">
                <div class="email-card-header">
                    <span class="email-icon">✉️</span>
                    <h4>SHARE RESULTS WITH INSTRUCTORS</h4>
                </div>
                <p class="email-desc">Submit your scenario decisions directly to your discussion leads or download a copy for classroom debate.</p>
                <div class="email-form-grid">
                    <div class="email-input-group">
                        <label for="recipient-email-1">Recipient 1 (Ammy Lin):</label>
                        <input type="email" id="recipient-email-1" value="${DEFAULT_RECIPIENT_EMAILS[0]}" placeholder="ammy.lin@duke.edu" />
                    </div>
                    <div class="email-input-group">
                        <label for="recipient-email-2">Recipient 2 (Tonantzin Real Rojas):</label>
                        <input type="email" id="recipient-email-2" value="${DEFAULT_RECIPIENT_EMAILS[1]}" placeholder="tonantzin.realrojas@duke.edu" />
                    </div>
                </div>
                <div class="email-btn-row">
                    <button id="send-email-btn" class="primary-btn email-action-btn">
                        <span>📧</span> OPEN IN EMAIL CLIENT
                    </button>
                    <button id="copy-summary-btn" class="secondary-btn email-action-btn">
                        <span>📋</span> COPY RESULTS TEXT
                    </button>
                </div>
                <p id="email-status-msg" class="email-status-msg hidden"></p>
            </div>
        `;
    }

    // 3. Role Swap Preview
    const roleSwapGridEl = document.getElementById("role-swap-grid");
    const otherRoles = Object.values(roleProfiles).filter(r => r.id !== state.selectedRole);

    roleSwapGridEl.innerHTML = otherRoles
        .map(r => `
            <div class="role-swap-card">
                <span class="swap-icon">${r.icon}</span>
                <h4>${r.name}</h4>
                <p class="swap-question"><strong>Their Dilemma:</strong> ${r.dilemma.title}</p>
                <p class="swap-reflection"><em>"Would you make the same ethical choices if you held their stakes?"</em></p>
            </div>
        `)
        .join("");

    // 4. Synthesis questions
    const synthesisListEl = document.getElementById("synthesis-list");
    synthesisListEl.innerHTML = `
        <div class="synthesis-item">
            <span class="synthesis-number">1</span>
            <p><strong>Consent Asymmetry:</strong> Can users give genuine informed consent to future corporate transactions when agreeing to terms years earlier?</p>
        </div>
        <div class="synthesis-item">
            <span class="synthesis-number">2</span>
            <p><strong>Shared Genetic Harm:</strong> Genetic data inherently reveals biological relatives. Can one person ethically sell or surrender data that identifies their family?</p>
        </div>
        <div class="synthesis-item">
            <span class="synthesis-number">3</span>
            <p><strong>Corporate Insolvency vs Human Rights:</strong> In bankruptcy, should sensitive biometric data be protected by human rights safeguards, or treated as standard liquidation inventory?</p>
        </div>
        <div class="synthesis-item">
            <span class="synthesis-number">4</span>
            <p><strong>Individual Costs of Ethics:</strong> Why do systems often force lower-level workers (like data scientists with debt) to bear the personal cost of blowing the whistle?</p>
        </div>
    `;
}

// ── Master UI Sync ───────────────────────────────────────────────────────────

function syncStageSpecificUI() {
    updateRoleBadge();
    syncSelectionStates();

    if (state.currentStage === 1) { // Stage 2 Context
        setupStage2Context();
    } else {
        clearConsentTimer();
    }

    if (state.currentStage === 2) { // Stage 3 Data Selection
        setupStage3Data();
    }

    if (state.currentStage === 3) { // Stage 4 Dilemma
        setupStage4Dilemma();
    }

    if (state.currentStage === 4) { // Stage 5 Twists
        updateTwistDisplay();
    }

    if (state.currentStage === 5) { // Stage 6 Ownership
        setupStage6Ownership();
    }

    if (state.currentStage === 6) { // Stage 7 Reflection
        setupStage7Reflection();
    }
}

// ── Restart Simulation ───────────────────────────────────────────────────────

function restartSimulation() {
    state.selectedRole = null;
    state.currentStage = 0;
    state.consentChoice = null;
    state.consentUnderstanding = null;
    state.confidenceRating = null;
    state.selectedDataTypes = [];
    state.dilemmaChoice = null;
    state.twistIndex = 0;
    state.twistAnswers = [];
    state.ownerChoice = null;
    state.consentTimerSeconds = 30;

    clearConsentTimer();
    syncSelectionStates();
    showScreen(0);
}

// ── Click Event Delegation ───────────────────────────────────────────────────

document.addEventListener("click", (event) => {
    // ── Back Button ──
    if (event.target.closest("#back-btn")) {
        goToPrevious();
        return;
    }

    // ── Restart ──
    if (event.target.closest("#restart-btn")) {
        restartSimulation();
        return;
    }

    // ── Email Actions (Stage 7) ──
    if (event.target.closest("#send-email-btn")) {
        const email1 = document.getElementById("recipient-email-1")?.value.trim() || "";
        const email2 = document.getElementById("recipient-email-2")?.value.trim() || "";
        const recipients = [email1, email2].filter(Boolean).join(",");

        const role = roleProfiles[state.selectedRole];
        const subject = encodeURIComponent(`[IDS 704 Ethics] ${role ? role.name : "Simulation"} Decision Results`);
        const body = encodeURIComponent(getResultsSummaryText());

        const mailtoUrl = `mailto:${recipients}?subject=${subject}&body=${body}`;
        window.open(mailtoUrl, "_blank");

        const statusEl = document.getElementById("email-status-msg");
        if (statusEl) {
            statusEl.textContent = "Opened your default email client with your results pre-populated!";
            statusEl.classList.remove("hidden");
        }
        return;
    }

    if (event.target.closest("#copy-summary-btn")) {
        const summaryText = getResultsSummaryText();
        navigator.clipboard.writeText(summaryText).then(() => {
            const statusEl = document.getElementById("email-status-msg");
            if (statusEl) {
                statusEl.textContent = "✓ Results copied to clipboard! You can paste them anywhere.";
                statusEl.classList.remove("hidden");
            }
        }).catch(() => {
            alert("Could not automatically copy text. Please select and copy manually.");
        });
        return;
    }

    // ── Character Selection (Stage 1) ──
    const charCard = event.target.closest(".character-card");
    if (charCard && state.currentStage === 0) {
        state.selectedRole = charCard.dataset.role;
        syncSelectionStates();
        // Advance to stage 2 automatically
        goToNext();
        return;
    }

    // ── Generic Next Trigger ──
    const nextBtn = event.target.closest("[data-next]");
    if (nextBtn) {
        goToNext();
        return;
    }

    // ── Stage 2: Consent buttons ──
    const consentBtn = event.target.closest("[data-consent]");
    if (consentBtn) {
        state.consentChoice = consentBtn.dataset.consent;
        clearConsentTimer();
        consentRevealEl.classList.remove("hidden");
        syncSelectionStates();
        return;
    }

    // ── Stage 2: Consent understanding ──
    const understandBtn = event.target.closest("[data-consent-understanding]");
    if (understandBtn) {
        state.consentUnderstanding = understandBtn.dataset.consentUnderstanding;
        confidenceSectionEl.classList.remove("hidden");
        syncSelectionStates();
        return;
    }

    // ── Stage 2: Confidence rating ──
    const confBtn = event.target.closest(".confidence-btn");
    if (confBtn) {
        state.confidenceRating = confBtn.dataset.confidence;
        syncSelectionStates();
        return;
    }

    // ── Stage 3: Data cards ──
    const dataCard = event.target.closest(".data-card");
    if (dataCard) {
        const type = dataCard.dataset.dataType;
        if (state.selectedDataTypes.includes(type)) {
            state.selectedDataTypes = state.selectedDataTypes.filter(d => d !== type);
        } else {
            state.selectedDataTypes.push(type);
        }
        syncSelectionStates();
        return;
    }

    // ── Stage 4: Dilemma choices ──
    const dilemmaBtn = event.target.closest("[data-dilemma-choice]");
    if (dilemmaBtn) {
        const choice = dilemmaBtn.dataset.dilemmaChoice;
        state.dilemmaChoice = choice;
        renderDilemmaTradeoffs(choice);
        syncSelectionStates();
        return;
    }

    // ── Stage 5: Twist answers ──
    const twistAnsBtn = event.target.closest("[data-twist-answer]");
    if (twistAnsBtn) {
        const ans = twistAnsBtn.dataset.twistAnswer;
        state.twistAnswers[state.twistIndex] = ans;
        updateTwistDisplay();
        syncSelectionStates();
        return;
    }

    // ── Stage 5: Reveal next twist ──
    if (event.target.closest("#reveal-next-twist")) {
        revealNextTwist();
        return;
    }

    // ── Stage 6: Owner selection ──
    const ownerBtn = event.target.closest(".owner-btn");
    if (ownerBtn) {
        state.ownerChoice = ownerBtn.dataset.owner;
        ownerSummaryEl.textContent = `Selected Position: ${state.ownerChoice}`;
        ownerSummaryEl.classList.remove("hidden");
        syncSelectionStates();
        return;
    }
});

// ── Keyboard Shortcuts ───────────────────────────────────────────────────────

document.addEventListener("keydown", (event) => {
    const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName || "");
    if (isTyping) return;

    if (event.key === "ArrowRight" || event.code === "Space") {
        event.preventDefault();
        goToNext();
        return;
    }
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
        return;
    }
    if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        restartSimulation();
        return;
    }
});

// ── Initialization ───────────────────────────────────────────────────────────

showScreen(0);
