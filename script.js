// This file is designed so a beginner can easily edit the simulation flow.
// To change stages, update the HTML in index.html.
// To change the twist prompts, adjust the twistDeck array below.
// To change a choice label, update the matching button text in the HTML.

const totalStages = 9;

// ── State ────────────────────────────────────────────────────────────────────

const state = {
    currentStage: 0,
    // Stage 2
    soldData: [],
    // Stage 3
    consentChoice: null,
    consentUnderstanding: null,
    confidenceRating: null,
    // Stage 4
    bankruptcyChoice: null,
    // Stage 5
    twistIndex: 0,
    twistAnswers: [],
    obligationsShown: false,
    selectedObligations: [],
    // Stage 6
    ownerChoice: null,
    // Stage 7
    selectedCommitments: [],
    // Stage 8
    selectedPrinciples: [],
    principleRanking: [],
    // Stage 9
    reflections: { own: null, family: null, public: null },
    textResponses: {},
    // Timer
    consentTimerSeconds: 30,
    consentTimerId: null,
};

// ── Data ─────────────────────────────────────────────────────────────────────

const twistDeck = [
    {
        title: "The buyer promises to follow the existing privacy agreement.",
        question: "Does this change your decision?",
    },
    {
        title: "The buyer says the data will be anonymized.",
        question: "Does this change your decision?",
    },
    {
        title: "The research could potentially contribute to new treatments for serious diseases.",
        question: "Does this change your decision?",
    },
    {
        title: "The buyer wants to combine the genetic data with purchasing and location data.",
        question: "Does this change your decision?",
    },
    {
        title: "Some users explicitly asked for their data to be deleted.",
        question: "Can the company sell the database anyway?",
    },
];

const tradeoffProfiles = {
    sell: [
        { dimension: "Financial Sustainability", level: "positive" },
        { dimension: "User Trust", level: "negative" },
        { dimension: "Privacy Protection", level: "negative" },
        { dimension: "Research / Public Benefit", level: "mixed" },
    ],
    "sell-conditions": [
        { dimension: "Financial Sustainability", level: "mixed" },
        { dimension: "User Trust", level: "mixed" },
        { dimension: "Privacy Protection", level: "mixed" },
        { dimension: "Research / Public Benefit", level: "positive" },
    ],
    refuse: [
        { dimension: "Financial Sustainability", level: "negative" },
        { dimension: "User Trust", level: "positive" },
        { dimension: "Privacy Protection", level: "positive" },
        { dimension: "Research / Public Benefit", level: "negative" },
    ],
};

const principleDescriptions = {
    "MEANINGFUL INFORMED CONSENT":
        "We will ensure that participants truly understand what they are agreeing to — not merely sign a document.",
    "DATA MINIMIZATION":
        "We will collect only the data we need, and nothing more.",
    "USER CONTROL AND DELETION":
        "We will give people meaningful control over their data, including the right to have it deleted.",
    "TRANSPARENCY":
        "We will be clear and honest about how data is collected, used, and shared.",
    "PRIVACY AND SECURITY":
        "We will protect data from unauthorized access and treat privacy as a fundamental right.",
    "RESTRICTIONS ON COMMERCIALIZATION":
        "We will not treat personal data as a commodity to be bought and sold without meaningful safeguards.",
    "RESEARCH / PUBLIC BENEFIT":
        "We will ensure that data use serves the public good and advances beneficial research.",
    "ACCOUNTABILITY":
        "We will take responsibility for our data practices and their consequences.",
};

// ── DOM References ───────────────────────────────────────────────────────────

const stageNumberEl = document.getElementById("stage-number");
const stageTotalEl = document.getElementById("stage-total");
const progressFillEl = document.getElementById("progress-fill");
const screens = [...document.querySelectorAll(".screen")];
const countdownValueEl = document.getElementById("countdown-value");
const consentRevealEl = document.getElementById("consent-reveal");
const bankruptcySummaryEl = document.getElementById("bankruptcy-summary");
const twistTitleEl = document.getElementById("twist-title");
const twistQuestionEl = document.getElementById("twist-question");
const twistIndexTextEl = document.getElementById("twist-index-text");
const twistSummaryEl = document.getElementById("twist-summary");
const ownerSummaryEl = document.getElementById("owner-summary");
const principleLimitNoteEl = document.getElementById("principle-limit-note");

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

function showScreen(index) {
    state.currentStage = clampStage(index);

    screens.forEach((screen, screenIndex) => {
        screen.classList.toggle("active", screenIndex === state.currentStage);
    });

    updateProgress();
    syncStageSpecificUI();

    // Scroll to top of the app shell when changing stages
    document.querySelector(".app-shell").scrollTo({ top: 0, behavior: "smooth" });
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
    // Stage 2: data cards
    document.querySelectorAll(".data-card").forEach((card) => {
        const selected = state.soldData.includes(card.dataset.dataType);
        card.classList.toggle("is-selected", selected);
        card.setAttribute("aria-pressed", String(selected));
    });

    // Stage 3: consent buttons
    document.querySelectorAll("[data-consent]").forEach((button) => {
        button.classList.toggle("is-selected", state.consentChoice === button.dataset.consent);
    });

    document.querySelectorAll("[data-consent-understanding]").forEach((button) => {
        button.classList.toggle("is-selected", state.consentUnderstanding === button.dataset.consentUnderstanding);
    });

    // Stage 3: confidence buttons
    document.querySelectorAll(".confidence-btn").forEach((button) => {
        button.classList.toggle("is-selected", state.confidenceRating === button.dataset.confidence);
    });

    // Stage 4: bankruptcy buttons
    document.querySelectorAll("[data-bankruptcy-choice]").forEach((button) => {
        button.classList.toggle("is-selected", state.bankruptcyChoice === button.dataset.bankruptcyChoice);
    });

    // Stage 5: twist answer buttons
    document.querySelectorAll("[data-twist-answer]").forEach((button) => {
        const selected = state.twistAnswers[state.twistIndex] === button.dataset.twistAnswer;
        button.classList.toggle("is-selected", selected);
    });

    // Stage 5: obligation buttons
    document.querySelectorAll(".obligation-btn").forEach((button) => {
        const selected = state.selectedObligations.includes(button.dataset.obligation);
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });

    // Stage 6: owner buttons
    document.querySelectorAll(".owner-btn").forEach((button) => {
        button.classList.toggle("is-selected", state.ownerChoice === button.dataset.owner);
    });

    // Stage 7: commitment buttons
    document.querySelectorAll(".commitment-btn").forEach((button) => {
        const selected = state.selectedCommitments.includes(button.dataset.commitment);
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });

    // Stage 8: principle cards
    document.querySelectorAll(".principle-card").forEach((button) => {
        const selected = state.selectedPrinciples.includes(button.dataset.principle);
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });

    // Stage 9: reflection buttons
    document.querySelectorAll("[data-reflection-cat]").forEach((button) => {
        const cat = button.dataset.reflectionCat;
        const ans = button.dataset.reflectionAns;
        button.classList.toggle("is-selected", state.reflections[cat] === ans);
    });
}

// ── Consent Timer ────────────────────────────────────────────────────────────

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

// ── Twist Display ────────────────────────────────────────────────────────────

function updateTwistDisplay() {
    const twist = twistDeck[state.twistIndex] || twistDeck[0];
    const currentNumber = Math.min(state.twistIndex + 1, twistDeck.length);
    twistIndexTextEl.textContent = `TWIST ${String(currentNumber).padStart(2, "0")}`;
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

    // Show CONTINUE button only after last twist is answered
    const isLastTwist = state.twistIndex === twistDeck.length - 1;
    const hasAnsweredLastTwist = state.twistAnswers[state.twistIndex];
    const revealBtn = document.getElementById("reveal-next-twist");
    const continueBtn = document.getElementById("continue-after-twists");

    if (isLastTwist && hasAnsweredLastTwist) {
        revealBtn.classList.add("hidden");
        continueBtn.classList.remove("hidden");
    } else {
        revealBtn.classList.remove("hidden");
        continueBtn.classList.add("hidden");
    }
}

function revealNextTwist() {
    if (state.twistIndex < twistDeck.length - 1) {
        state.twistIndex += 1;
        updateTwistDisplay();
    }
}

// ── Stage 4: Bankruptcy Choice & Tradeoffs ───────────────────────────────────

function setBankruptcyChoice(choice) {
    const labels = {
        sell: "You chose to SELL the data.",
        "sell-conditions": "You chose to SELL WITH CONDITIONS.",
        refuse: "You chose to REFUSE the sale.",
    };
    bankruptcySummaryEl.textContent = labels[choice];
    bankruptcySummaryEl.classList.remove("hidden");
}

function showTradeoffs(choice) {
    const panel = document.getElementById("tradeoff-panel");
    const grid = document.getElementById("tradeoff-grid");
    const items = tradeoffProfiles[choice];

    if (!items) return;

    const levelLabels = { positive: "Positive", mixed: "Mixed", negative: "Negative" };

    grid.innerHTML = items
        .map(
            (item) => `
        <div class="tradeoff-item tradeoff-${item.level}">
            <span class="tradeoff-indicator tradeoff-dot-${item.level}" aria-hidden="true"></span>
            <span class="tradeoff-dimension">${item.dimension}</span>
            <span class="tradeoff-level-label">${levelLabels[item.level]}</span>
        </div>`
        )
        .join("");

    panel.classList.remove("hidden");
}

// ── Stage 6: Owner Choice ────────────────────────────────────────────────────

function setOwnerChoice(choice) {
    ownerSummaryEl.textContent = `Current position: ${choice}`;
    ownerSummaryEl.classList.remove("hidden");
}

// ── Stage 7: Commitments ─────────────────────────────────────────────────────

function updateCommitmentsCount() {
    const countEl = document.getElementById("commitments-count");
    countEl.textContent = `${state.selectedCommitments.length} of 9 commitments selected`;

    const reflectionEl = document.getElementById("commitments-reflection");
    if (state.selectedCommitments.length > 0) {
        reflectionEl.classList.remove("hidden");
    } else {
        reflectionEl.classList.add("hidden");
    }
}

// ── Stage 8: Principles, Ranking & Constitution ──────────────────────────────

function updatePrincipleSelection(button) {
    const principle = button.dataset.principle;
    const isSelected = button.classList.contains("is-selected");

    if (isSelected) {
        // Deselecting — also clear ranking
        state.selectedPrinciples = state.selectedPrinciples.filter((item) => item !== principle);
        button.classList.remove("is-selected");
        button.setAttribute("aria-pressed", "false");
        state.principleRanking = [];
        document.getElementById("ranking-section").classList.add("hidden");
        document.getElementById("constitution-card").classList.add("hidden");
        document.getElementById("sacrifice-prompt").classList.add("hidden");
        document.getElementById("stage8-continue").classList.add("hidden");

        principleLimitNoteEl.textContent =
            state.selectedPrinciples.length === 0
                ? "Choose up to three."
                : `${state.selectedPrinciples.length} of 3 selected.`;
        principleLimitNoteEl.style.color = "var(--muted)";
        return;
    }

    if (state.selectedPrinciples.length >= 3) {
        principleLimitNoteEl.textContent = "Deselect a principle before choosing another.";
        principleLimitNoteEl.style.color = "var(--red)";
        button.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-4px)" },
                { transform: "translateX(4px)" },
                { transform: "translateX(0)" },
            ],
            { duration: 200 }
        );
        return;
    }

    // Select
    state.selectedPrinciples.push(principle);
    button.classList.add("is-selected");
    button.setAttribute("aria-pressed", "true");

    if (state.selectedPrinciples.length < 3) {
        principleLimitNoteEl.textContent = `${state.selectedPrinciples.length} of 3 selected.`;
        principleLimitNoteEl.style.color = "var(--muted)";
    } else {
        principleLimitNoteEl.textContent = "Now rank your three principles below.";
        principleLimitNoteEl.style.color = "var(--blue)";
        showRankingSection();
    }
}

function showRankingSection() {
    const section = document.getElementById("ranking-section");
    const optionsContainer = document.getElementById("rank-options");

    // Populate rank options with selected principles
    optionsContainer.innerHTML = state.selectedPrinciples
        .map(
            (p) =>
                `<button class="rank-option-btn" data-rank-principle="${p}" aria-label="Assign rank to ${p}">${p}</button>`
        )
        .join("");

    // If ranking was already started, restore it
    updateRankDisplay();
    section.classList.remove("hidden");

    // Smooth scroll to ranking section
    setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
}

function updateRankDisplay() {
    // Update slot displays
    for (let i = 0; i < 3; i++) {
        const valueEl = document.getElementById(`rank-value-${i}`);
        const slot = valueEl.closest(".rank-slot");
        if (state.principleRanking[i]) {
            valueEl.textContent = state.principleRanking[i];
            slot.classList.add("filled");
            slot.setAttribute("aria-label", `Priority ${i + 1}: ${state.principleRanking[i]}. Click to remove.`);
        } else {
            valueEl.textContent = "—";
            slot.classList.remove("filled");
            slot.setAttribute("aria-label", `Priority ${i + 1}, empty`);
        }
    }

    // Update option buttons
    document.querySelectorAll(".rank-option-btn").forEach((btn) => {
        const principle = btn.dataset.rankPrinciple;
        const isRanked = state.principleRanking.includes(principle);
        btn.classList.toggle("is-ranked", isRanked);
        btn.disabled = isRanked;
    });

    // Show constitution if all 3 ranked
    if (state.principleRanking.length === 3) {
        renderConstitutionCard();
    } else {
        document.getElementById("constitution-card").classList.add("hidden");
        document.getElementById("sacrifice-prompt").classList.add("hidden");
        document.getElementById("stage8-continue").classList.add("hidden");
    }
}

function renderConstitutionCard() {
    const card = document.getElementById("constitution-card");
    const articles = document.getElementById("constitution-articles");

    const romanNumerals = ["I", "II", "III"];
    const rankLabels = ["Our highest commitment", "Our core value", "Our guiding principle"];

    articles.innerHTML = state.principleRanking
        .map((principle, i) => {
            const desc = principleDescriptions[principle] || "";
            return `
            <div class="constitution-article">
                <div class="article-header">
                    <span class="article-numeral">ARTICLE ${romanNumerals[i]}</span>
                    <span class="article-rank">${rankLabels[i]}</span>
                </div>
                <h4 class="article-title">${principle}</h4>
                <p class="article-text">${desc}</p>
            </div>`;
        })
        .join("");

    document.getElementById("constitution-date").textContent = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    card.classList.remove("hidden");
    document.getElementById("sacrifice-prompt").classList.remove("hidden");
    document.getElementById("stage8-continue").classList.remove("hidden");

    setTimeout(() => {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
}

// ── Stage 9: Decisions Recap ─────────────────────────────────────────────────

function generateDecisionsRecap() {
    const recap = document.getElementById("decisions-recap");

    const dataStr = state.soldData.length ? state.soldData.join(", ") : "None selected";

    const consentLabels = { agree: "Agreed", decline: "Declined" };
    const consentStr = state.consentChoice ? consentLabels[state.consentChoice] : "No choice made";

    const confidenceLabels = {
        "1": "Not at all",
        "2": "Slightly",
        "3": "Somewhat",
        "4": "Mostly",
        "5": "Completely",
    };
    const confStr = state.confidenceRating ? confidenceLabels[state.confidenceRating] : "Not rated";

    const bankLabels = { sell: "Sell", "sell-conditions": "Sell with conditions", refuse: "Refuse" };
    const bankStr = state.bankruptcyChoice ? bankLabels[state.bankruptcyChoice] : "No choice made";

    const ownerStr = state.ownerChoice || "No choice made";

    const commitStr = state.selectedCommitments.length
        ? `${state.selectedCommitments.length} commitment${state.selectedCommitments.length > 1 ? "s" : ""}`
        : "None selected";

    const constStr = state.principleRanking.length === 3 ? state.principleRanking.join(" → ") : "Not completed";

    recap.innerHTML = `
        <h3>YOUR DECISIONS</h3>
        <div class="recap-grid">
            <div class="recap-item">
                <span class="recap-label">Data you'd sell</span>
                <span class="recap-value">${dataStr}</span>
            </div>
            <div class="recap-item">
                <span class="recap-label">Privacy policy</span>
                <span class="recap-value">${consentStr}</span>
            </div>
            <div class="recap-item">
                <span class="recap-label">User understanding</span>
                <span class="recap-value">${confStr}</span>
            </div>
            <div class="recap-item">
                <span class="recap-label">Bankruptcy decision</span>
                <span class="recap-value">${bankStr}</span>
            </div>
            <div class="recap-item">
                <span class="recap-label">Data ownership</span>
                <span class="recap-value">${ownerStr}</span>
            </div>
            <div class="recap-item">
                <span class="recap-label">Research commitments</span>
                <span class="recap-value">${commitStr}</span>
            </div>
            <div class="recap-item recap-item-wide">
                <span class="recap-label">Constitution</span>
                <span class="recap-value">${constStr}</span>
            </div>
        </div>`;
}

// ── Restart ──────────────────────────────────────────────────────────────────

function restartSimulation() {
    // Reset all state
    state.currentStage = 0;
    state.soldData = [];
    state.consentChoice = null;
    state.consentUnderstanding = null;
    state.confidenceRating = null;
    state.bankruptcyChoice = null;
    state.twistIndex = 0;
    state.twistAnswers = [];
    state.obligationsShown = false;
    state.selectedObligations = [];
    state.ownerChoice = null;
    state.selectedCommitments = [];
    state.selectedPrinciples = [];
    state.principleRanking = [];
    state.reflections = { own: null, family: null, public: null };
    state.textResponses = {};
    state.consentTimerSeconds = 30;

    clearConsentTimer();

    // Clear all selected classes
    document.querySelectorAll(".data-card, .choice-btn, .owner-btn, .principle-card, .commitment-btn, .obligation-btn, .confidence-btn")
        .forEach((el) => {
            el.classList.remove("is-selected");
            if (el.hasAttribute("aria-pressed")) {
                el.setAttribute("aria-pressed", "false");
            }
        });

    // Hide all reveal/dynamic panels
    consentRevealEl.classList.add("hidden");
    document.getElementById("confidence-section").classList.add("hidden");
    bankruptcySummaryEl.classList.add("hidden");
    document.getElementById("tradeoff-panel").classList.add("hidden");
    twistSummaryEl.classList.add("hidden");
    document.getElementById("obligations-section").classList.add("hidden");
    document.getElementById("continue-after-twists").classList.add("hidden");
    ownerSummaryEl.classList.add("hidden");
    document.getElementById("commitments-reflection").classList.add("hidden");
    document.getElementById("ranking-section").classList.add("hidden");
    document.getElementById("constitution-card").classList.add("hidden");
    document.getElementById("sacrifice-prompt").classList.add("hidden");
    document.getElementById("stage8-continue").classList.add("hidden");

    principleLimitNoteEl.textContent = "Choose up to three.";
    principleLimitNoteEl.style.color = "var(--muted)";

    // Reset commitment count
    document.getElementById("commitments-count").textContent = "0 of 9 commitments selected";

    // Clear textareas
    document.querySelectorAll("textarea").forEach((ta) => {
        ta.value = "";
    });

    // Clear decisions recap
    document.getElementById("decisions-recap").innerHTML = "";

    updateTwistDisplay();
    showScreen(0);
}

// ── Stage-Specific UI Sync (called on every stage change) ────────────────────

function syncStageSpecificUI() {
    syncSelectionStates();

    // Stage 3: consent + timer
    if (state.currentStage === 2) {
        if (!state.consentChoice) {
            // Fresh visit — start timer
            consentRevealEl.classList.add("hidden");
            document.getElementById("confidence-section").classList.add("hidden");
            startConsentTimer();
        } else {
            // Revisiting — restore state, don't restart timer
            clearConsentTimer();
            consentRevealEl.classList.remove("hidden");
            if (state.consentUnderstanding) {
                document.getElementById("confidence-section").classList.remove("hidden");
            }
        }
    } else {
        clearConsentTimer();
    }

    // Stage 4: bankruptcy + tradeoffs
    if (state.currentStage === 3) {
        if (state.bankruptcyChoice) {
            setBankruptcyChoice(state.bankruptcyChoice);
            showTradeoffs(state.bankruptcyChoice);
        } else {
            bankruptcySummaryEl.classList.add("hidden");
            document.getElementById("tradeoff-panel").classList.add("hidden");
        }
    } else if (state.currentStage !== 3) {
        bankruptcySummaryEl.classList.add("hidden");
        document.getElementById("tradeoff-panel").classList.add("hidden");
    }

    // Stage 5: twists + obligations
    if (state.currentStage === 4) {
        updateTwistDisplay();
        if (state.obligationsShown) {
            document.getElementById("obligations-section").classList.remove("hidden");
            document.getElementById("continue-after-twists").classList.add("hidden");
        } else {
            document.getElementById("obligations-section").classList.add("hidden");
        }
    }

    // Stage 6: owner
    if (state.currentStage === 5 && state.ownerChoice) {
        setOwnerChoice(state.ownerChoice);
    } else if (state.currentStage !== 5) {
        ownerSummaryEl.classList.add("hidden");
    }

    // Stage 7: commitments
    if (state.currentStage === 6) {
        updateCommitmentsCount();
    }

    // Stage 8: principles + ranking + constitution
    if (state.currentStage === 7) {
        if (state.selectedPrinciples.length === 3) {
            showRankingSection();
            if (state.principleRanking.length === 3) {
                renderConstitutionCard();
            }
        } else {
            document.getElementById("ranking-section").classList.add("hidden");
            document.getElementById("constitution-card").classList.add("hidden");
            document.getElementById("sacrifice-prompt").classList.add("hidden");
            document.getElementById("stage8-continue").classList.add("hidden");
        }
    }

    // Stage 9: recap
    if (state.currentStage === 8) {
        generateDecisionsRecap();
        // Restore textarea values from state
        Object.keys(state.textResponses).forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.value = state.textResponses[id];
        });
    }
}

// ── Data Card Selection (Stage 2) ────────────────────────────────────────────

function selectDataCard(card) {
    const type = card.dataset.dataType;
    if (state.soldData.includes(type)) {
        state.soldData = state.soldData.filter((item) => item !== type);
    } else {
        state.soldData.push(type);
    }
    syncSelectionStates();
}

// ── Click Event Delegation ───────────────────────────────────────────────────

document.addEventListener("click", (event) => {
    // ── Restart (check before data-next) ──
    const restartBtn = event.target.closest("#restart-btn");
    if (restartBtn) {
        restartSimulation();
        return;
    }

    // ── Continue after twists → show obligations (check before data-next) ──
    const continueAfterTwistsBtn = event.target.closest("#continue-after-twists");
    if (continueAfterTwistsBtn) {
        state.obligationsShown = true;
        document.getElementById("obligations-section").classList.remove("hidden");
        continueAfterTwistsBtn.classList.add("hidden");
        setTimeout(() => {
            document.getElementById("obligations-section").scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 50);
        return;
    }

    // ── Reveal next twist ──
    const revealTwistBtn = event.target.closest("#reveal-next-twist");
    if (revealTwistBtn) {
        revealNextTwist();
        return;
    }

    // ── Generic data-next navigation ──
    const nextTrigger = event.target.closest("[data-next]");
    if (nextTrigger) {
        goToNext();
        return;
    }

    // ── Stage 2: data cards ──
    const dataCard = event.target.closest(".data-card");
    if (dataCard) {
        selectDataCard(dataCard);
        return;
    }

    // ── Stage 3: consent ──
    const consentBtn = event.target.closest("[data-consent]");
    if (consentBtn) {
        state.consentChoice = consentBtn.dataset.consent;
        clearConsentTimer();
        consentRevealEl.classList.remove("hidden");
        syncSelectionStates();
        return;
    }

    // ── Stage 3: consent understanding ──
    const understandingBtn = event.target.closest("[data-consent-understanding]");
    if (understandingBtn) {
        state.consentUnderstanding = understandingBtn.dataset.consentUnderstanding;
        document.getElementById("confidence-section").classList.remove("hidden");
        syncSelectionStates();
        return;
    }

    // ── Stage 3: confidence rating ──
    const confidenceBtn = event.target.closest(".confidence-btn");
    if (confidenceBtn) {
        state.confidenceRating = confidenceBtn.dataset.confidence;
        syncSelectionStates();
        return;
    }

    // ── Stage 4: bankruptcy choice ──
    const bankruptcyBtn = event.target.closest("[data-bankruptcy-choice]");
    if (bankruptcyBtn) {
        const choice = bankruptcyBtn.dataset.bankruptcyChoice;
        state.bankruptcyChoice = choice;
        setBankruptcyChoice(choice);
        showTradeoffs(choice);
        syncSelectionStates();
        return;
    }

    // ── Stage 5: twist answer ──
    const twistAnswerBtn = event.target.closest("[data-twist-answer]");
    if (twistAnswerBtn) {
        const answer = twistAnswerBtn.dataset.twistAnswer;
        state.twistAnswers[state.twistIndex] = answer;
        const label = answer.toUpperCase();
        twistSummaryEl.textContent = `Twist ${state.twistIndex + 1}: ${label}`;
        twistSummaryEl.classList.remove("hidden");
        updateTwistDisplay();
        syncSelectionStates();
        return;
    }

    // ── Stage 5: obligation toggle ──
    const obligationBtn = event.target.closest(".obligation-btn");
    if (obligationBtn) {
        const obligation = obligationBtn.dataset.obligation;
        if (state.selectedObligations.includes(obligation)) {
            state.selectedObligations = state.selectedObligations.filter((o) => o !== obligation);
        } else {
            state.selectedObligations.push(obligation);
        }
        syncSelectionStates();
        return;
    }

    // ── Stage 6: owner ──
    const ownerBtn = event.target.closest(".owner-btn");
    if (ownerBtn) {
        state.ownerChoice = ownerBtn.dataset.owner;
        setOwnerChoice(state.ownerChoice);
        syncSelectionStates();
        return;
    }

    // ── Stage 7: commitment toggle ──
    const commitmentBtn = event.target.closest(".commitment-btn");
    if (commitmentBtn) {
        const commitment = commitmentBtn.dataset.commitment;
        if (state.selectedCommitments.includes(commitment)) {
            state.selectedCommitments = state.selectedCommitments.filter((c) => c !== commitment);
        } else {
            state.selectedCommitments.push(commitment);
        }
        updateCommitmentsCount();
        syncSelectionStates();
        return;
    }

    // ── Stage 8: principle selection ──
    const principleCard = event.target.closest(".principle-card");
    if (principleCard) {
        updatePrincipleSelection(principleCard);
        return;
    }

    // ── Stage 8: rank option click (assign rank) ──
    const rankOptionBtn = event.target.closest(".rank-option-btn");
    if (rankOptionBtn && !rankOptionBtn.disabled) {
        const principle = rankOptionBtn.dataset.rankPrinciple;
        if (state.principleRanking.length < 3 && !state.principleRanking.includes(principle)) {
            state.principleRanking.push(principle);
            updateRankDisplay();
        }
        return;
    }

    // ── Stage 8: rank slot click (remove rank) ──
    const rankSlot = event.target.closest(".rank-slot.filled");
    if (rankSlot) {
        const rankIndex = parseInt(rankSlot.dataset.rank);
        // Remove this rank and everything after it (so ranks stay contiguous)
        state.principleRanking = state.principleRanking.slice(0, rankIndex);
        updateRankDisplay();
        return;
    }

    // ── Stage 9: reflection buttons ──
    const reflectionBtn = event.target.closest("[data-reflection-cat]");
    if (reflectionBtn) {
        const cat = reflectionBtn.dataset.reflectionCat;
        const ans = reflectionBtn.dataset.reflectionAns;
        state.reflections[cat] = ans;
        syncSelectionStates();
        return;
    }
});

// ── Textarea Persistence ─────────────────────────────────────────────────────

document.addEventListener("input", (event) => {
    if (event.target.tagName === "TEXTAREA") {
        state.textResponses[event.target.id] = event.target.value;
    }
});

// ── Keyboard Shortcuts ───────────────────────────────────────────────────────

document.addEventListener("keydown", (event) => {
    const isTypingField = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName || "");
    if (isTypingField) {
        return;
    }

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

    if (["1", "2", "3", "4", "5"].includes(event.key)) {
        const key = Number(event.key);

        // Stage 3 (index 2): consent buttons (1-2) or confidence buttons (1-5)
        if (state.currentStage === 2) {
            const confidenceSection = document.getElementById("confidence-section");
            if (!confidenceSection.classList.contains("hidden")) {
                const confButtons = [...document.querySelectorAll(".confidence-btn")];
                if (key <= confButtons.length) {
                    confButtons[key - 1].click();
                }
            } else {
                const consentButtons = [...document.querySelectorAll("[data-consent]")];
                if (key <= consentButtons.length) {
                    consentButtons[key - 1].click();
                }
            }
            return;
        }

        // Stage 4 (index 3): bankruptcy buttons (1-3)
        if (state.currentStage === 3) {
            const bankruptcyButtons = [...document.querySelectorAll("[data-bankruptcy-choice]")];
            if (key <= bankruptcyButtons.length) {
                bankruptcyButtons[key - 1].click();
            }
            return;
        }

        // Stage 5 (index 4): twist buttons (1-3)
        if (state.currentStage === 4) {
            const twistButtons = [...document.querySelectorAll("[data-twist-answer]")];
            if (key <= twistButtons.length) {
                twistButtons[key - 1].click();
            }
            return;
        }

        // Stage 6 (index 5): owner buttons (1-5)
        if (state.currentStage === 5) {
            const ownerButtons = [...document.querySelectorAll(".owner-btn")];
            if (key <= ownerButtons.length) {
                ownerButtons[key - 1].click();
            }
        }
    }
});

// ── Init ─────────────────────────────────────────────────────────────────────

showScreen(0);
updateTwistDisplay();
