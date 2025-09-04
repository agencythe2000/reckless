// Docket data structure - Easy to manage and edit!
const docketData = [
    {
        id: 1,
        caseNumber: "CASE-2024-001",
        defendant: "Johnny \"The Reckless\" Smith",
        charges: "Reckless driving, Excessive speed, Endangering public safety",
        status: "AWAITING TRIAL",
        date: "2024-01-15"
    },
    {
        id: 2,
        caseNumber: "CASE-2024-002", 
        defendant: "Sarah \"Wild Card\" Johnson",
        charges: "Disorderly conduct, Public disturbance, Resisting arrest",
        status: "IN CUSTODY",
        date: "2024-01-16"
    },
    {
        id: 3,
        caseNumber: "CASE-2024-003",
        defendant: "Mike \"Mad Dog\" Wilson",
        charges: "Assault, Battery, Destruction of property",
        status: "BAIL SET",
        date: "2024-01-17"
    },
    {
        id: 4,
        caseNumber: "CASE-2024-004",
        defendant: "Lisa \"Lightning\" Brown",
        charges: "Fraud, Identity theft, Money laundering",
        status: "UNDER INVESTIGATION",
        date: "2024-01-18"
    },
    {
        id: 5,
        caseNumber: "CASE-2024-005",
        defendant: "Tony \"Tornado\" Davis",
        charges: "Burglary, Theft, Breaking and entering",
        status: "CONVICTED",
        date: "2024-01-19"
    },
    {
        id: 6,
        caseNumber: "CASE-2024-006",
        defendant: "Rita \"Rampage\" Martinez",
        charges: "Drug possession, Drug trafficking, Conspiracy",
        status: "PLEA BARGAIN",
        date: "2024-01-20"
    },
    {
        id: 7,
        caseNumber: "CASE-2024-007",
        defendant: "Carlos \"Chaos\" Rodriguez",
        charges: "Armed robbery, Assault with deadly weapon, Evading arrest",
        status: "FUGITIVE",
        date: "2024-01-21"
    },
    {
        id: 8,
        caseNumber: "CASE-2024-008",
        defendant: "Amanda \"Anarchy\" Taylor",
        charges: "Vandalism, Trespassing, Disturbing the peace",
        status: "COMMUNITY SERVICE",
        date: "2024-01-22"
    }
];

// Betting data structure - Easy to manage and edit!
// All users have 50 Kev Coins by default
const bettingData = [
    {
        id: 1,
        name: "Rere",
        avatar: "R",
        betDetails: "Manchester United to win vs Liverpool"
    },
    {
        id: 2,
        name: "Pav",
        avatar: "P",
        betDetails: "Liverpool to win vs Manchester United"
    },
    {
        id: 3,
        name: "Wajid",
        avatar: "W",
        betDetails: "Draw between Man Utd and Liverpool"
    },
    {
        id: 4,
        name: "Abs",
        avatar: "A",
        betDetails: "Over 2.5 goals in the match"
    },
    {
        id: 5,
        name: "Peter",
        avatar: "P",
        betDetails: "Both teams to score in first half"
    },
    {
        id: 6,
        name: "Lil Yoyo",
        avatar: "L",
        betDetails: "25 coins on this and 5 coins on that"
    },
    {
        id: 7,
        name: "WildWill",
        avatar: "W",
        betDetails: "Rashford to score anytime"
    },
    {
        id: 8,
        name: "TheGreatOne",
        avatar: "T",
        betDetails: "Exact score: 2-1 to Liverpool"
    }
];

// Statements data structure - Easy to manage and edit!
const statementsData = [
    {
        id: 1,
        speaker: "Rere",
        quote: "I can beat anyone at FIFA with my eyes closed",
        date: "2024-01-15"
    },
    {
        id: 2,
        speaker: "Pav",
        quote: "Manchester United is the best team in the universe",
        date: "2024-01-16"
    },
    {
        id: 3,
        speaker: "Wajid",
        quote: "I once scored 10 goals in one match... in my dreams",
        date: "2024-01-17"
    },
    {
        id: 4,
        speaker: "Abs",
        quote: "I'm so good at betting, I can predict the weather",
        date: "2024-01-18"
    },
    {
        id: 5,
        speaker: "Peter",
        quote: "I have a PhD in being reckless",
        date: "2024-01-19"
    },
    {
        id: 6,
        speaker: "Lil Yoyo",
        quote: "I once won a coin flip 50 times in a row... allegedly",
        date: "2024-01-20"
    }
];

// Function to render a single statement entry
function renderStatementEntry(statement) {
    return `
        <div class="statement-entry">
            <div class="statement-speaker">💬 ${statement.speaker}</div>
            <div class="statement-quote">"${statement.quote}"</div>
            <div class="statement-date">📅 ${statement.date}</div>
        </div>
    `;
}

// Function to render all statement entries
function renderAllStatements() {
    const statementsList = document.getElementById('statements-list');
    if (statementsList) {
        statementsList.innerHTML = statementsData.map(statement => renderStatementEntry(statement)).join('');
    }
}

// Function to add a new statement
function addStatement(speaker, quote, date) {
    const newStatement = {
        id: statementsData.length + 1,
        speaker: speaker,
        quote: quote,
        date: date
    };
    statementsData.push(newStatement);
    renderAllStatements();
}

// Function to remove a statement by ID
function removeStatement(statementId) {
    const index = statementsData.findIndex(statement => statement.id === statementId);
    if (index > -1) {
        statementsData.splice(index, 1);
        renderAllStatements();
    }
}

// Function to update a statement
function updateStatement(statementId, updates) {
    const statement = statementsData.find(statement => statement.id === statementId);
    if (statement) {
        Object.assign(statement, updates);
        renderAllStatements();
    }
}

// Function to render a single docket entry
function renderDocketEntry(entry) {
    return `
        <div class="docket-entry">
            <div class="docket-case-number">📋 ${entry.caseNumber}</div>
            <div class="docket-defendant">⚖️ ${entry.defendant}</div>
            <div class="docket-charges">${entry.charges}</div>
            <div class="docket-status">STATUS: ${entry.status}</div>
            <div class="docket-date">📅 ${entry.date}</div>
        </div>
    `;
}

// Function to render all docket entries
function renderAllDocketEntries() {
    const docketEntries = document.getElementById('docket-entries');
    if (docketEntries) {
        docketEntries.innerHTML = docketData.map(entry => renderDocketEntry(entry)).join('');
    }
}

// Function to add a new docket entry
function addDocketEntry(caseNumber, defendant, charges, status, date) {
    const newEntry = {
        id: docketData.length + 1,
        caseNumber: caseNumber,
        defendant: defendant,
        charges: charges,
        status: status,
        date: date
    };
    docketData.push(newEntry);
    renderAllDocketEntries();
}

// Function to remove a docket entry by ID
function removeDocketEntry(entryId) {
    const index = docketData.findIndex(entry => entry.id === entryId);
    if (index > -1) {
        docketData.splice(index, 1);
        renderAllDocketEntries();
    }
}

// Function to update a docket entry
function updateDocketEntry(entryId, updates) {
    const entry = docketData.find(entry => entry.id === entryId);
    if (entry) {
        Object.assign(entry, updates);
        renderAllDocketEntries();
    }
}

// Function to render a single bet message
function renderBetMessage(bet) {
    return `
        <div class="message">
            <div class="message-avatar">${bet.avatar}</div>
            <div class="message-content">
                <div class="message-name">${bet.name}</div>
                <div class="message-bubble">
                    <div class="bet-details">${bet.betDetails}</div>
                </div>
            </div>
        </div>
    `;
}

// Function to render all betting messages
function renderAllBets() {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = bettingData.map(bet => renderBetMessage(bet)).join('');
    }
}

// Function to add a new bet (easy to use!)
function addBet(name, avatar, betDetails) {
    const newBet = {
        id: bettingData.length + 1,
        name: name,
        avatar: avatar,
        betDetails: betDetails
    };
    bettingData.push(newBet);
    renderAllBets();
}

// Function to remove a bet by ID
function removeBet(betId) {
    const index = bettingData.findIndex(bet => bet.id === betId);
    if (index > -1) {
        bettingData.splice(index, 1);
        renderAllBets();
    }
}

// Function to update a bet
function updateBet(betId, updates) {
    const bet = bettingData.find(bet => bet.id === betId);
    if (bet) {
        Object.assign(bet, updates);
        renderAllBets();
    }
}

// Tab switching functions
function showMainTab(tabName) {
    // Hide all main tab contents
    const allContents = document.querySelectorAll('.tab-content');
    allContents.forEach(content => content.classList.remove('active'));

    // Hide all sub-tab containers
    const allSubTabs = document.querySelectorAll('.sub-tabs');
    allSubTabs.forEach(subTabs => subTabs.style.display = 'none');

    // Remove active class from all main tabs
    const allMainTabs = document.querySelectorAll('.main-tab');
    allMainTabs.forEach(tab => tab.classList.remove('active'));

    // Show selected main tab content
    document.getElementById(tabName + '-content').classList.add('active');

    // Show corresponding sub-tabs
    document.getElementById(tabName + '-subtabs').style.display = 'flex';

    // Add active class to clicked main tab
    event.target.classList.add('active');

    // Reset sub-tabs to first one
    const subTabs = document.querySelectorAll(`#${tabName}-subtabs .sub-tab`);
    subTabs.forEach((subTab, index) => {
        subTab.classList.remove('active');
        if (index === 0) {
            subTab.classList.add('active');
        }
    });

    // Show first sub-tab content
    const subContents = document.querySelectorAll(`#${tabName}-content .sub-tab-content`);
    subContents.forEach((subContent, index) => {
        subContent.classList.remove('active');
        if (index === 0) {
            subContent.classList.add('active');
        }
    });
}

function showSubTab(mainTab, subTab) {
    // Hide all sub-tab contents for current main tab
    const allSubContents = document.querySelectorAll(`#${mainTab}-content .sub-tab-content`);
    allSubContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all sub-tabs for current main tab
    const allSubTabs = document.querySelectorAll(`#${mainTab}-subtabs .sub-tab`);
    allSubTabs.forEach(tab => tab.classList.remove('active'));

    // Show selected sub-tab content
    document.getElementById(`${mainTab}-${subTab}`).classList.add('active');

    // Add active class to clicked sub-tab
    event.target.classList.add('active');
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize betting chat if on betting page
    if (document.getElementById('chat-messages')) {
        renderAllBets();
    }
    
    // Initialize docket if on docket page
    if (document.getElementById('docket-entries')) {
        renderAllDocketEntries();
    }
    
    // Initialize statements if on statements page
    if (document.getElementById('statements-list')) {
        renderAllStatements();
    }
});

// ========================================
// EASY DOCKET MANAGEMENT EXAMPLES:
// ========================================

// To add a new docket entry, use:
// addDocketEntry("CASE-2024-009", "Defendant Name", "Charges here", "STATUS", "2024-01-23");

// To remove a docket entry by ID:
// removeDocketEntry(1);

// To update a docket entry:
// updateDocketEntry(1, { status: "CONVICTED", charges: "Updated charges" });

// To add multiple docket entries at once:
// const newEntries = [
//     { caseNumber: "CASE-2024-010", defendant: "New Defendant 1", charges: "Charges 1", status: "AWAITING TRIAL", date: "2024-01-24" },
//     { caseNumber: "CASE-2024-011", defendant: "New Defendant 2", charges: "Charges 2", status: "IN CUSTODY", date: "2024-01-25" }
// ];
// newEntries.forEach(entry => addDocketEntry(entry.caseNumber, entry.defendant, entry.charges, entry.status, entry.date));

// ========================================
// EASY BET MANAGEMENT EXAMPLES:
// ========================================
// All users have 50 Kev Coins by default!

// To add a new bet, use:
// addBet("PlayerName", "A", "Description of bet");

// To remove a bet by ID:
// removeBet(1);

// To update a bet:
// updateBet(1, { betDetails: "Updated bet description" });

// To add multiple bets at once:
// const newBets = [
//     { name: "NewPlayer1", avatar: "N", betDetails: "New bet 1" },
//     { name: "NewPlayer2", avatar: "P", betDetails: "New bet 2" }
// ];
// newBets.forEach(bet => addBet(bet.name, bet.avatar, bet.betDetails));

// ========================================
// EASY STATEMENTS MANAGEMENT EXAMPLES:
// ========================================

// To add a new statement, use:
// addStatement("Speaker Name", "The ridiculous thing they said", "2024-01-23");

// To remove a statement by ID:
// removeStatement(1);

// To update a statement:
// updateStatement(1, { quote: "Updated ridiculous statement" });

// To add multiple statements at once:
// const newStatements = [
//     { speaker: "Person1", quote: "Statement 1", date: "2024-01-24" },
//     { speaker: "Person2", quote: "Statement 2", date: "2024-01-25" }
// ];
// newStatements.forEach(statement => addStatement(statement.speaker, statement.quote, statement.date));
