// ── Configuration & State ───────────────────────────────────────────────────

const totalStages = 7;

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
            lead: "Five years ago, you paid $99 to learn where your ancestors came from and discover genetic health risks.",
            bodyHtml: `
                <div class="context-story-card">
                    <p>You checked a box saying "I agree to the Terms of Service" without reading the 42 pages of fine print.</p>
                    <p>Now you see news alerts: <strong>23andMe is facing bankruptcy</strong>, and they might sell their entire database to the highest bidder to pay off debts.</p>
                    <p class="callout-text">Let's see what you actually signed up for back then.</p>
                </div>
            `,
            showPolicy: true,
        },
        dataPrompt: {
            eyebrow: "STAGE 03 • YOUR COMFORT ZONE",
            title: "WHAT DATA ARE YOU COMFORTABLE SHARING?",
            prompt: "Select the types of personal data you would be comfortable with 23andMe sharing with other companies.",
            discussion: "What makes sharing one category of your data more or less acceptable than another? Is genetic data different from location or shopping data?",
            note: "Consider: You can change your password or credit card number if it's breached. You cannot change your DNA.",
        },
        dilemma: {
            eyebrow: "STAGE 04 • BREAKING NEWS",
            title: "YOUR DNA IS ABOUT TO BE AUCTIONED.",
            headline: "23andMe is entering Chapter 11 bankruptcy. A pharmaceutical conglomerate has bid $50M to acquire the customer database.",
            prompt: "WHAT ACTION DO YOU TAKE AS A CONSUMER?",
            choices: [
                { id: "delete", label: "1. REQUEST DATA DELETION", desc: "Demand your account and biological samples be destroyed immediately." },
                { id: "join-lawsuit", label: "2. JOIN CLASS-ACTION LAWSUIT", desc: "Sue to block the transfer of genetic assets without explicit re-consent." },
                { id: "accept-research", label: "3. ALLOW TRANSFER FOR CURES", desc: "Accept the transfer if it promises to advance medical cures and drug discovery." }
            ],
            tradeoffs: {
                delete: [
                    { dimension: "Personal Privacy Protection", level: "positive" },
                    { dimension: "Control Over Future Use", level: "positive" },
                    { dimension: "Contribution to Medical Research", level: "negative" },
                    { dimension: "Certainty (Will backups really be wiped?)", level: "mixed" },
                ],
                "join-lawsuit": [
                    { dimension: "Advocacy for Consumer Rights", level: "positive" },
                    { dimension: "Immediate Resolution", level: "negative" },
                    { dimension: "Public Awareness", level: "positive" },
                    { dimension: "Legal Complexity & Delay", level: "mixed" },
                ],
                "accept-research": [
                    { dimension: "Potential Medical Discoveries", level: "positive" },
                    { dimension: "Personal Privacy & Relative Impact", level: "negative" },
                    { dimension: "Corporate Profit off Your DNA", level: "negative" },
                    { dimension: "Convenience / Peace of Mind", level: "mixed" },
                ]
            },
            discussion: "If you delete your profile, what happens to the aggregate data and research models already trained on your genome?"
        },
        twists: [
            {
                title: "The buyer claims all transferred genetic data will be 'de-identified' and aggregated.",
                question: "Does this ease your privacy concerns?"
            },
            {
                title: "Your biological sibling never signed up for 23andMe, but because you did, 50% of their DNA markers are identifiable.",
                question: "Do you have the moral right to decide what happens to shared family DNA?"
            },
            {
                title: "The acquiring company announces a breakthrough Alzheimer's treatment using this exact database.",
                question: "Does this justify selling the data without your renewed consent?"
            }
        ],
        ownerQuestion: "Does your answer change knowing your biological relatives' privacy is also exposed by your genome?"
    },

    executive: {
        id: "executive",
        name: "THE EXECUTIVE",
        icon: "💼",
        context: {
            eyebrow: "STAGE 02 • THE BOARDROOM",
            title: "THE COMPANY IS RUNNING OUT OF CASH.",
            lead: "As Chief Executive Officer, you are responsible for 400 employees, public shareholders, and creditors.",
            stats: [
                { value: "$50M", label: "Cash Burn / Year" },
                { value: "400", label: "Employees At Risk" },
                { value: "15M+", label: "Genotyped Customers" },
                { value: "30 Days", label: "Runway Remaining" }
            ],
            bodyHtml: `
                <div class="context-story-card">
                    <p>The consumer genetics business model has hit a wall: once people find their ancestry, they stop paying subscription fees.</p>
                    <p>Creditors are at the door. If the company liquidates in Chapter 7 bankruptcy, a court bankruptcy trustee will sell your assets anyway to the highest bidder.</p>
                    <p class="callout-text">Your primary valuable asset is the anonymized database of 15+ million human genomes.</p>
                </div>
            `,
            showPolicy: false,
        },
        dataPrompt: {
            eyebrow: "STAGE 03 • MONETIZATION STRATEGY",
            title: "WHAT ASSETS DO YOU PUT ON THE TABLE?",
            prompt: "Select the categories of user data you are willing to bundle into the asset sale package.",
            discussion: "Which data categories generate the highest commercial valuation, and which ones carry catastrophic reputational/legal risk?",
            note: "Valuation insight: Bundling health surveys + DNA multiplies the database value 5x compared to raw genetic markers alone.",
        },
        dilemma: {
            eyebrow: "STAGE 04 • THE BUYOUT OFFER",
            title: "A $50,000,000 LIFELINE FROM BIG PHARMA.",
            headline: "NovaCure Pharmaceuticals offers $50M in cash for complete access and ownership of 23andMe's research databases.",
            prompt: "WHAT DO YOU PROPOSE TO THE BOARD OF DIRECTORS?",
            choices: [
                { id: "sell-unrestricted", label: "1. ACCEPT UNRESTRICTED SALE", desc: "Sell full database ownership to NovaCure to maximize cash and pay all creditors in full." },
                { id: "sell-conditional", label: "2. SELL WITH ETHICAL STRINGS", desc: "Require NovaCure to guarantee original privacy promises and give users 30 days to opt out (accept 40% lower valuation)." },
                { id: "destroy-liquidate", label: "3. REFUSE & PURGE DATA", desc: "Block the data sale and order all genetic records wiped before entering bankruptcy liquidation." }
            ],
            tradeoffs: {
                "sell-unrestricted": [
                    { dimension: "Fiduciary Duty to Creditors/Investors", level: "positive" },
                    { dimension: "Severance & Survival for Employees", level: "positive" },
                    { dimension: "User Trust & Historical Reputation", level: "negative" },
                    { dimension: "Public Backlash / Regulatory Inquiries", level: "negative" },
                ],
                "sell-conditional": [
                    { dimension: "Fiduciary Compromise (Lower Payout)", level: "mixed" },
                    { dimension: "Ethical Responsibility & User Respect", level: "positive" },
                    { dimension: "Deal Completion Risk (Buyer may walk)", level: "mixed" },
                    { dimension: "Regulatory & Legal Defense", level: "positive" },
                ],
                "destroy-liquidate": [
                    { dimension: "Total User Privacy Protection", level: "positive" },
                    { dimension: "Legal Liability to Creditors (Lawsuits against Board)", level: "negative" },
                    { dimension: "Complete Loss of Jobs & Company Value", level: "negative" },
                    { dimension: "Destruction of Valuable Medical Research", level: "negative" },
                ]
            },
            discussion: "Under corporate law, executives have a fiduciary duty to maximize value for creditors in insolvency. Is breaking trust with users an acceptable price?"
        },
        twists: [
            {
                title: "A foreign healthcare conglomerate offers $120M—more than double NovaCure—but operates outside US FTC jurisdiction.",
                question: "Do you take the higher bid to save more employee jobs and pay off all debt?"
            },
            {
                title: "State Attorneys General warn they will sue to halt any sale that includes users who never checked 'research consent'.",
                question: "Do you spend dwindling cash fighting them in court to close the deal?"
            },
            {
                title: "Your engineering lead warns that extracting and purging opt-outs will delay the sale by 6 months, causing immediate insolvency.",
                question: "Do you proceed with the sale without processing pending deletion requests?"
            }
        ],
        ownerQuestion: "Does your answer change if selling the database is the only way to fund employee severance and prevent immediate collapse?"
    },

    buyer: {
        id: "buyer",
        name: "THE BUYER",
        icon: "🏢",
        context: {
            eyebrow: "STAGE 02 • M&A STRATEGY",
            title: "ACQUIRING THE WORLD'S GENOMIC TREASURY.",
            lead: "You are the VP of Strategic Acquisitions at NovaCure Pharmaceuticals.",
            stats: [
                { value: "$1.2B", label: "Drug Dev Cost" },
                { value: "10-15 Yrs", label: "Time to Market" },
                { value: "85%", label: "Target Failure Rate" },
                { value: "15M", label: "Patient Profiles" }
            ],
            bodyHtml: `
                <div class="context-story-card">
                    <p>Drug discovery is excruciatingly slow and expensive. Access to 15 million genotyped individuals with matched disease histories could unlock treatments for Parkinson's, cancer, and rare autoimmune disorders.</p>
                    <p>Building this cohort from scratch would cost billions and take decades. 23andMe's bankruptcy is a once-in-a-generation acquisition opportunity.</p>
                    <p class="callout-text">Your challenge: How to maximize the research and commercial value of the asset without inciting a regulatory nightmare.</p>
                </div>
            `,
            showPolicy: false,
        },
        dataPrompt: {
            eyebrow: "STAGE 03 • ASSET TARGETING",
            title: "WHICH DATASETS ARE ESSENTIAL TO YOUR PIPELINE?",
            prompt: "Select the data categories your pharmaceutical AI models need to train precision medicine algorithms.",
            discussion: "If genetic data is completely stripped of lifestyle surveys and health symptoms, does it lose its medicinal value?",
            note: "AI research insight: Without linked phenotype data (family history, diet, diagnosed diseases), raw DNA sequences provide limited insight for targeted drug synthesis.",
        },
        dilemma: {
            eyebrow: "STAGE 04 • ACQUISITION TERMS",
            title: "HOW DO YOU STRUCTURE THE DATA ACQUISITION?",
            headline: "NovaCure is drafting its final bid for the bankruptcy court hearing tomorrow morning.",
            prompt: "WHAT ACQUISITION FRAMEWORK DO YOU SUBMIT?",
            choices: [
                { id: "clean-slate", label: "1. BUY WITHOUT PAST LIABILITIES", desc: "Purchase the asset 'free and clear' of prior terms; apply NovaCure's proprietary terms of service." },
                { id: "honor-consent", label: "2. HONOR LEGACY PRIVACY & RE-CONSENT", desc: "Strictly segregate users who opted into research and solicit fresh explicit consent for commercial drug trials." },
                { id: "open-consortium", label: "3. NON-PROFIT RESEARCH ALLIANCE", desc: "Form an open scientific consortium with NIH/Universities, sharing data publicly while keeping royalty rights on discovered targets." }
            ],
            tradeoffs: {
                "clean-slate": [
                    { dimension: "Speed of Drug Discovery Pipeline", level: "positive" },
                    { dimension: "Exclusivity & Commercial Profitability", level: "positive" },
                    { dimension: "Public Trust & Ethical Standing", level: "negative" },
                    { dimension: "FTC & Regulatory Scrutiny", level: "negative" },
                ],
                "honor-consent": [
                    { dimension: "Ethical Legitimacy & User Respect", level: "positive" },
                    { dimension: "Regulatory & Compliance Safety", level: "positive" },
                    { dimension: "Usable Dataset Size (Drop-off up to 60%)", level: "negative" },
                    { dimension: "Return on Investment (ROI)", level: "mixed" },
                ],
                "open-consortium": [
                    { dimension: "Global Scientific & Public Benefit", level: "positive" },
                    { dimension: "Academic & Institutional Goodwill", level: "positive" },
                    { dimension: "Direct Corporate Monopoly Profits", level: "negative" },
                    { dimension: "Complex Multi-Stakeholder Governance", level: "mixed" },
                ]
            },
            discussion: "When you buy physical machines at bankruptcy, you inherit no moral relationship with past customers. Does acquiring intimate personal data follow the same rules?"
        },
        twists: [
            {
                title: "Your modeling team discovers that de-anonymizing rare genetic variants is possible using publicly available genealogy registries.",
                question: "Do you allow internal research teams to re-identify patients to verify clinical outcomes?"
            },
            {
                title: "A major health insurer offers to co-fund the acquisition in exchange for risk-scoring analytics on customer cohorts.",
                question: "Do you monetize the database through secondary insurance partnerships?"
            },
            {
                title: "Federal regulators signal they will approve the purchase only if your patents resulting from the data are capped at generic pricing.",
                question: "Do you still proceed with buying the database under pricing caps?"
            }
        ],
        ownerQuestion: "Does your answer change if commercial incentives are the only realistic engine to fund lifesaving drug trials?"
    },

    "data-scientist": {
        id: "data-scientist",
        name: "THE DATA SCIENTIST",
        icon: "🔬",
        context: {
            eyebrow: "STAGE 02 • THE ETHICAL CRUCIBLE",
            title: "YOU DISCOVER WHAT'S IN THE SALE PIPELINE.",
            lead: "You are a Senior Data Scientist at 23andMe. You have $87,000 in student loan debt and support your family.",
            stats: [
                { value: "$87,000", label: "Student Loan Debt" },
                { value: "$1,450", label: "Monthly Payment" },
                { value: "H-1B / Visa", label: "Dependent on Job" },
                { value: "2 Weeks", label: "Emergency Savings" }
            ],
            bodyHtml: `
                <div class="context-story-card">
                    <p>While preparing the data export pipeline for prospective bidders, you discover that the data dump includes records of users who explicitly hit <strong>'Delete My Account'</strong> over the past two years.</p>
                    <p>Because of engineering backlogs and legacy schema designs, their raw genome files were 'soft-deleted' in UI views but remained in the analytical warehouse.</p>
                    <p class="callout-text">When you flag this to management, a director quietly whispers: <em>"Don't hold up this deal. If the sale collapses, everyone's out of a job by Friday—including you."</em></p>
                </div>
            `,
            showPolicy: false,
        },
        dataPrompt: {
            eyebrow: "STAGE 03 • AUDITING THE PIPELINE",
            title: "WHICH DATA LEAKS POSE THE GRAVEST ETHICAL RISKS?",
            prompt: "Select the categories of residual or unscrubbed data you are most alarmed to find in the unredacted export bucket.",
            discussion: "Why is an internal data scientist often the only barrier between algorithmic convenience and systemic violation of user rights?",
            note: "Engineering reality: In massive distributed data lakes, true 'Right to be Forgotten' compliance is technically demanding and frequently neglected under deadline crunch.",
        },
        dilemma: {
            eyebrow: "STAGE 04 • THE WHISTLEBLOWER DILEMMA",
            title: "SPEAK UP OR PROTECT YOUR LIVELIHOOD?",
            headline: "The data package is scheduled to be transferred to the buyer's cloud infrastructure at midnight.",
            prompt: "WHAT CHOICE DO YOU MAKE TONIGHT?",
            choices: [
                { id: "whistleblow", label: "1. BLOW THE WHISTLE EXTERNALLY", desc: "Leak documentation of the non-deleted records to the FTC and investigative journalists. (Face termination, legal threat, and loan default)." },
                { id: "internal-escalate", label: "2. HARD ESCALATION INTERNALLY", desc: "Threaten to resign immediately and write a formal memo to the Board of Directors demanding a halt until scrubbed." },
                { id: "stay-quiet", label: "3. COMPLY & PROTECT YOUR FINANCIAL SURVIVAL", desc: "Keep your head down, process the pipeline, collect your severance, and pay your student loans." }
            ],
            tradeoffs: {
                whistleblow: [
                    { dimension: "Personal Ethical Integrity & Public Duty", level: "positive" },
                    { dimension: "Protection for 100,000+ Deleted Users", level: "positive" },
                    { dimension: "Personal Financial & Career Stability ($87k Loans)", level: "negative" },
                    { dimension: "Threat of Corporate Lawsuits & Retaliation", level: "negative" },
                ],
                "internal-escalate": [
                    { dimension: "Professional Due Diligence", level: "positive" },
                    { dimension: "Chance of Internal Correction without Scandal", level: "mixed" },
                    { dimension: "Risk of Being Sidelined / Fired Silently", level: "negative" },
                    { dimension: "Personal Career Protection", level: "mixed" },
                ],
                "stay-quiet": [
                    { dimension: "Financial Security & Student Loan Solvency", level: "positive" },
                    { dimension: "Family Protection & Visa/Job Continuity", level: "positive" },
                    { dimension: "Complicity in Unethical Data Transfer", level: "negative" },
                    { dimension: "Long-term Moral Injury & Guilt", level: "negative" },
                ]
            },
            discussion: "Ethics isn't free. When doing the right thing jeopardizes your ability to pay rent or service $87k in student debt, what is the realistic threshold for moral courage?"
        },
        twists: [
            {
                title: "An anonymous colleague tells you they are preparing an SEC whistleblower tip and asks you to sign your name with them.",
                question: "Do you join the whistleblower complaint knowing collective protection is stronger but discovery is guaranteed?"
            },
            {
                title: "The buyer offers retention bonuses of $40,000 cash to all data science staff who transition and support the pipeline integration.",
                question: "Does the immediate opportunity to wipe out half your student loans tempt you to assist the migration?"
            },
            {
                title: "You realize you have write-access to the script repository and could quietly execute an unrecoverable hard-purge of the deleted records before leaving.",
                question: "Do you take matters into your own hands through rogue code intervention?"
            }
        ],
        ownerQuestion: "Does your answer change when an individual technician carries the sole moral burden for a multi-million dollar corporate system?"
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

    dilemmaTradeoffGridEl.innerHTML = items
        .map(
            (item) => `
        <div class="tradeoff-item tradeoff-${item.level}">
            <span class="tradeoff-indicator tradeoff-dot-${item.level}" aria-hidden="true"></span>
            <span class="tradeoff-dimension">${item.dimension}</span>
            <span class="tradeoff-level-label">${levelLabels[item.level]}</span>
        </div>`
        )
        .join("");

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

    // 2. Role Swap Preview
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

    // 3. Synthesis questions
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
