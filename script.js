// This file is designed so a beginner can easily edit the simulation flow.
// To change stages, update the HTML in index.html.
// To change the twist prompts, adjust the array below.
// To change a choice label, update the matching button text in the HTML.

const totalStages = 9;

const state = {
    currentStage: 0,
    soldData: [],
    consentChoice: null,
    consentUnderstanding: null,
    bankruptcyChoice: null,
    twistIndex: 0,
    twistAnswers: [],
    ownerChoice: null,
    selectedPrinciples: [],
    consentTimerSeconds: 30,
    consentTimerId: null,
};

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
const constitutionPanelEl = document.getElementById("constitution-panel");
const constitutionListEl = document.getElementById("constitution-list");
const principleLimitNoteEl = document.getElementById("principle-limit-note");

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

function syncSelectionStates() {
    document.querySelectorAll(".data-card").forEach((card) => {
        card.classList.toggle("is-selected", state.soldData.includes(card.dataset.dataType));
    });

    document.querySelectorAll("[data-consent]").forEach((button) => {
        button.classList.toggle("is-selected", state.consentChoice === button.dataset.consent);
    });

    document.querySelectorAll("[data-consent-understanding]").forEach((button) => {
        button.classList.toggle("is-selected", state.consentUnderstanding === button.dataset.consentUnderstanding);
    });

    document.querySelectorAll("[data-bankruptcy-choice]").forEach((button) => {
        button.classList.toggle("is-selected", state.bankruptcyChoice === button.dataset.bankruptcyChoice);
    });

    document.querySelectorAll("[data-twist-answer]").forEach((button) => {
        const selected = state.twistAnswers[state.twistIndex] === button.dataset.twistAnswer;
        button.classList.toggle("is-selected", selected);
    });

    document.querySelectorAll(".owner-btn").forEach((button) => {
        button.classList.toggle("is-selected", state.ownerChoice === button.dataset.owner);
    });

    document.querySelectorAll(".principle-card").forEach((button) => {
        button.classList.toggle("is-selected", state.selectedPrinciples.includes(button.dataset.principle));
    });
}

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

function setBankruptcyChoice(choice) {
    const labels = {
        sell: "You chose to SELL the data.",
        "sell-conditions": "You chose to SELL WITH CONDITIONS.",
        refuse: "You chose to REFUSE the sale.",
    };
    bankruptcySummaryEl.textContent = labels[choice];
    bankruptcySummaryEl.classList.remove("hidden");
}

function setOwnerChoice(choice) {
    ownerSummaryEl.textContent = `Current position: ${choice}`;
    ownerSummaryEl.classList.remove("hidden");
}

function renderConstitution() {
    if (state.selectedPrinciples.length === 3) {
        constitutionPanelEl.classList.remove("hidden");
        constitutionListEl.innerHTML = state.selectedPrinciples
            .map((principle) => `<span class="constitution-item">${principle}</span>`)
            .join("");
    } else {
        constitutionPanelEl.classList.add("hidden");
        constitutionListEl.innerHTML = "";
    }
}

function updatePrincipleSelection(button) {
    const principle = button.dataset.principle;
    const isSelected = button.classList.contains("is-selected");

    if (isSelected) {
        state.selectedPrinciples = state.selectedPrinciples.filter((item) => item !== principle);
        button.classList.remove("is-selected");
        renderConstitution();
        return;
    }

    if (state.selectedPrinciples.length >= 3) {
        principleLimitNoteEl.textContent = "Maximum of three principles. Choose one to replace another.";
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

    principleLimitNoteEl.textContent = "Choose up to three.";
    principleLimitNoteEl.style.color = "var(--muted)";
    state.selectedPrinciples.push(principle);
    button.classList.add("is-selected");
    renderConstitution();
}

function restartSimulation() {
    state.currentStage = 0;
    state.soldData = [];
    state.consentChoice = null;
    state.consentUnderstanding = null;
    state.bankruptcyChoice = null;
    state.twistIndex = 0;
    state.twistAnswers = [];
    state.ownerChoice = null;
    state.selectedPrinciples = [];
    state.consentTimerSeconds = 30;

    clearConsentTimer();
    document.querySelectorAll(".data-card").forEach((card) => card.classList.remove("is-selected"));
    document.querySelectorAll(".choice-btn").forEach((button) => button.classList.remove("is-selected"));
    document.querySelectorAll(".owner-btn").forEach((button) => button.classList.remove("is-selected"));
    document.querySelectorAll(".principle-card").forEach((button) => button.classList.remove("is-selected"));

    consentRevealEl.classList.add("hidden");
    bankruptcySummaryEl.classList.add("hidden");
    twistSummaryEl.classList.add("hidden");
    ownerSummaryEl.classList.add("hidden");
    constitutionPanelEl.classList.add("hidden");
    constitutionListEl.innerHTML = "";
    principleLimitNoteEl.textContent = "Choose up to three.";
    principleLimitNoteEl.style.color = "var(--muted)";

    updateTwistDisplay();
    showScreen(0);
}

function syncStageSpecificUI() {
    syncSelectionStates();

    if (state.currentStage === 3) {
        // Reset consent state when entering stage 3 to show fresh timer
        state.consentChoice = null;
        consentRevealEl.classList.add("hidden");
        startConsentTimer();
    } else {
        clearConsentTimer();
    }

    if (state.currentStage === 4 && state.bankruptcyChoice) {
        setBankruptcyChoice(state.bankruptcyChoice);
    } else if (state.currentStage !== 4) {
        bankruptcySummaryEl.classList.add("hidden");
    }

    if (state.currentStage === 5) {
        updateTwistDisplay();
    }

    if (state.currentStage === 6 && state.ownerChoice) {
        setOwnerChoice(state.ownerChoice);
    } else if (state.currentStage !== 6) {
        ownerSummaryEl.classList.add("hidden");
    }

    if (state.currentStage === 8) {
        renderConstitution();
    }
}

function selectDataCard(card) {
    const type = card.dataset.dataType;
    if (state.soldData.includes(type)) {
        state.soldData = state.soldData.filter((item) => item !== type);
    } else {
        state.soldData.push(type);
    }
    syncSelectionStates();
}

document.addEventListener("click", (event) => {
    const nextTrigger = event.target.closest("[data-next]");
    if (nextTrigger) {
        goToNext();
        return;
    }

    const dataCard = event.target.closest(".data-card");
    if (dataCard) {
        selectDataCard(dataCard);
        return;
    }

    const consentBtn = event.target.closest("[data-consent]");
    if (consentBtn) {
        state.consentChoice = consentBtn.dataset.consent;
        consentRevealEl.classList.remove("hidden");
        syncSelectionStates();
        return;
    }

    const understandingBtn = event.target.closest("[data-consent-understanding]");
    if (understandingBtn) {
        state.consentUnderstanding = understandingBtn.dataset.consentUnderstanding;
        syncSelectionStates();
        return;
    }

    const bankruptcyBtn = event.target.closest("[data-bankruptcy-choice]");
    if (bankruptcyBtn) {
        const choice = bankruptcyBtn.dataset.bankruptcyChoice;
        state.bankruptcyChoice = choice;
        setBankruptcyChoice(choice);
        syncSelectionStates();
        return;
    }

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

    const ownerBtn = event.target.closest(".owner-btn");
    if (ownerBtn) {
        state.ownerChoice = ownerBtn.dataset.owner;
        setOwnerChoice(state.ownerChoice);
        syncSelectionStates();
        return;
    }

    const principleCard = event.target.closest(".principle-card");
    if (principleCard) {
        updatePrincipleSelection(principleCard);
        return;
    }

    const revealTwistBtn = event.target.closest("#reveal-next-twist");
    if (revealTwistBtn) {
        revealNextTwist();
        return;
    }

    const restartBtn = event.target.closest("#restart-btn");
    if (restartBtn) {
        restartSimulation();
        return;
    }
});

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

        if (state.currentStage === 3) {
            const consentButtons = [...document.querySelectorAll("[data-consent]")];
            if (key <= consentButtons.length) {
                consentButtons[key - 1].click();
            }
            return;
        }

        if (state.currentStage === 4) {
            const bankruptcyButtons = [...document.querySelectorAll("[data-bankruptcy-choice]")];
            if (key <= bankruptcyButtons.length) {
                bankruptcyButtons[key - 1].click();
            }
            return;
        }

        if (state.currentStage === 5) {
            const twistButtons = [...document.querySelectorAll("[data-twist-answer]")];
            if (key <= twistButtons.length) {
                twistButtons[key - 1].click();
            }
            return;
        }

        if (state.currentStage === 6) {
            const ownerButtons = [...document.querySelectorAll(".owner-btn")];
            if (key <= ownerButtons.length) {
                ownerButtons[key - 1].click();
            }
        }
    }
});

showScreen(0);
updateTwistDisplay();
