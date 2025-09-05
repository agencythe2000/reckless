// Reckless Court System
let recklessEntries = [];
let currentCase = null;
let sentences = [];
let isSpinning = false;

// Use centralized configuration
const GOOGLE_SHEETS_CONFIG = window.RECKLESS_CONFIG.googleSheets;

// No default sentences - user will input their own

// Load reckless entries from Google Sheets
async function loadRecklessEntries() {
    showLoading(true);
    try {
        const response = await fetch(`${GOOGLE_SHEETS_CONFIG.scriptUrl}?action=getSubmissions`, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (response.ok) {
            const data = await response.json();
            const allEntries = data.submissions || [];
            // Filter only reckless entries
            recklessEntries = allEntries.filter(entry => entry.judgment === 'reckless');
            console.log('Reckless entries loaded:', recklessEntries.length);
            updateCourtStats();
            renderRecklessEntries();
            loadSentences();
            return true;
        }
    } catch (error) {
        console.error('Error loading reckless entries:', error);
        showMessage('Error loading reckless entries from Google Sheets', 'error');
    } finally {
        showLoading(false);
    }
    
    return false;
}

// Load sentences from localStorage
function loadSentences() {
    try {
        const stored = localStorage.getItem('recklessSentences');
        if (stored) {
            sentences = JSON.parse(stored);
        } else {
            sentences = [];
            saveSentences();
        }
        renderWheel();
        loadSentencesToTextarea();
    } catch (error) {
        console.error('Error loading sentences:', error);
        sentences = [];
        saveSentences();
    }
}

// Save sentences to localStorage
function saveSentences() {
    try {
        localStorage.setItem('recklessSentences', JSON.stringify(sentences));
    } catch (error) {
        console.error('Error saving sentences:', error);
    }
}

// Update court statistics
function updateCourtStats() {
    const totalReckless = recklessEntries.length;
    const awaitingSentence = recklessEntries.filter(entry => entry.judgment === 'reckless').length;
    const sentencedToday = 0; // Could be enhanced to track daily sentences
    
    document.getElementById('total-reckless').textContent = totalReckless;
    document.getElementById('awaiting-sentence').textContent = awaitingSentence;
    document.getElementById('sentenced-today').textContent = sentencedToday;
}

// Generate submission type display info
function getSubmissionTypeInfo(type) {
    const typeMap = {
        'kev-coin': { text: '⚡ KEV COIN', class: 'kev-coin' },
        'hate-coin': { text: '💀 HATE COIN', class: 'hate-coin' },
        'court-case': { text: '⚖️ COURT CASE', class: 'court-case' },
        'write-down': { text: '📝 WRITE THIS DOWN', class: 'write-down' }
    };
    return typeMap[type] || { text: 'UNKNOWN', class: 'unknown' };
}

// Render a single reckless entry
function renderRecklessEntry(entry) {
    const typeInfo = getSubmissionTypeInfo(entry.type);
    const date = new Date(entry.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `
        <div class="reckless-entry" data-id="${entry.id}" onclick="selectCase(${entry.id})">
            <div class="entry-header">
                <div class="entry-info">
                    <div class="entry-name">${entry.name}</div>
                    <div class="entry-type ${typeInfo.class}">${typeInfo.text}</div>
                </div>
                <div class="entry-meta">
                    <div class="entry-date">📅 ${date}</div>
                    <div class="entry-id">#${entry.id}</div>
                </div>
            </div>
            
            <div class="entry-message">"${entry.message}"</div>
            
            <div class="entry-status">
                <span class="status-badge reckless">🔥 AWAITING SENTENCE</span>
            </div>
        </div>
    `;
}

// Render all reckless entries
function renderRecklessEntries() {
    const entriesList = document.getElementById('reckless-entries-list');
    if (entriesList) {
        entriesList.innerHTML = recklessEntries.map(entry => renderRecklessEntry(entry)).join('');
    }
}

// Filter entries by type
function filterRecklessEntries(filterType) {
    const entriesList = document.getElementById('reckless-entries-list');
    if (!entriesList) return;
    
    let filteredData = recklessEntries;
    
    if (filterType !== 'all') {
        filteredData = recklessEntries.filter(entry => entry.type === filterType);
    }
    
    entriesList.innerHTML = filteredData.map(entry => renderRecklessEntry(entry)).join('');
}

// Handle filter button clicks
function handleCourtFilterClick(event) {
    const filterType = event.target.getAttribute('data-filter');
    
    // Update active button
    document.querySelectorAll('.court-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter entries
    filterRecklessEntries(filterType);
}

// Select a case for judgment
function selectCase(entryId) {
    currentCase = recklessEntries.find(entry => entry.id === entryId);
    if (currentCase) {
        showCurrentCase();
        enableSpinButton();
    }
}

// Show current case details
function showCurrentCase() {
    const caseSection = document.getElementById('current-case-section');
    const caseInfo = document.getElementById('current-case-info');
    
    if (currentCase) {
        const typeInfo = getSubmissionTypeInfo(currentCase.type);
        const date = new Date(currentCase.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        caseInfo.innerHTML = `
            <div class="case-details">
                <div class="case-header-info">
                    <div class="case-name">${currentCase.name}</div>
                    <div class="case-type ${typeInfo.class}">${typeInfo.text}</div>
                </div>
                <div class="case-message">"${currentCase.message}"</div>
                <div class="case-meta">
                    <span class="case-date">📅 ${date}</span>
                    <span class="case-id">#${currentCase.id}</span>
                </div>
            </div>
        `;
        
        caseSection.style.display = 'block';
    }
}

// Enable spin button
function enableSpinButton() {
    const spinBtn = document.getElementById('spin-wheel');
    spinBtn.disabled = false;
    spinBtn.classList.add('enabled');
}

// Render the wheel
function renderWheel() {
    const wheelSections = document.getElementById('wheel-sections');
    if (!wheelSections) return;
    
    const sectionCount = sentences.length;
    const sectionAngle = 360 / sectionCount;
    
    wheelSections.innerHTML = sentences.map((sentence, index) => {
        const angle = index * sectionAngle;
        const rotation = `rotate(${angle}deg)`;
        const textRotation = `rotate(${-angle}deg)`;
        
        return `
            <div class="wheel-section" style="transform: ${rotation}">
                <div class="section-text" style="transform: ${textRotation}">
                    ${sentence.substring(0, 30)}${sentence.length > 30 ? '...' : ''}
                </div>
            </div>
        `;
    });
}

// Spin the wheel
function spinWheel() {
    if (isSpinning || !currentCase) return;
    
    isSpinning = true;
    const wheel = document.getElementById('sentence-wheel');
    const spinBtn = document.getElementById('spin-wheel');
    
    // Disable spin button
    spinBtn.disabled = true;
    spinBtn.classList.remove('enabled');
    
    // Calculate random spin
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalAngle = (spins * 360) + (Math.random() * 360);
    
    // Apply spin animation
    wheel.style.transition = 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)';
    wheel.style.transform = `rotate(${finalAngle}deg)`;
    
    // Determine result after animation
    setTimeout(() => {
        const sectionCount = sentences.length;
        const sectionAngle = 360 / sectionCount;
        const normalizedAngle = ((finalAngle % 360) + 360) % 360;
        const sectionIndex = Math.floor(normalizedAngle / sectionAngle);
        const selectedSentence = sentences[sectionIndex];
        
        showSpinResult(selectedSentence);
        isSpinning = false;
        
        // Reset wheel position
        setTimeout(() => {
            wheel.style.transition = 'none';
            wheel.style.transform = 'rotate(0deg)';
        }, 2000);
    }, 4000);
}

// Show spin result
function showSpinResult(sentence) {
    showMessage(`🎰 WHEEL RESULT: ${sentence}`, 'info');
    
    // Update sentence text area
    const sentenceText = document.getElementById('sentence-text');
    sentenceText.value = sentence;
}

// Mark case as safe
async function markAsSafe() {
    if (!currentCase) return;
    
    const sentenceText = document.getElementById('sentence-text').value.trim();
    if (!sentenceText) {
        showMessage('Please enter a sentence before marking as safe', 'error');
        return;
    }
    
    await updateCaseJudgment(currentCase.id, 'safe', sentenceText);
    showMessage('Case marked as SAFE!', 'success');
    resetCurrentCase();
}

// Mark case as sentenced
async function markAsSentenced() {
    if (!currentCase) return;
    
    const sentenceText = document.getElementById('sentence-text').value.trim();
    if (!sentenceText) {
        showMessage('Please enter a sentence before marking as sentenced', 'error');
        return;
    }
    
    await updateCaseJudgment(currentCase.id, 'sentenced', sentenceText);
    showMessage('Case marked as SENTENCED!', 'success');
    resetCurrentCase();
}

// Update case judgment in Google Sheets
async function updateCaseJudgment(entryId, judgment, sentence) {
    try {
        const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'updateJudgmentWithSentence',
                data: {
                    id: entryId,
                    judgment: judgment,
                    sentence: sentence
                }
            })
        });
        
        // Update local data
        const entry = recklessEntries.find(e => e.id === entryId);
        if (entry) {
            entry.judgment = judgment;
            entry.sentence = sentence;
        }
        
        // Remove from reckless entries list
        recklessEntries = recklessEntries.filter(e => e.id !== entryId);
        renderRecklessEntries();
        updateCourtStats();
        
        console.log('Case judgment updated successfully');
        return true;
    } catch (error) {
        console.error('Error updating case judgment:', error);
        showMessage('Error updating case judgment', 'error');
        return false;
    }
}

// Reset current case
function resetCurrentCase() {
    currentCase = null;
    document.getElementById('current-case-section').style.display = 'none';
    document.getElementById('sentence-text').value = '';
    document.getElementById('spin-wheel').disabled = true;
    document.getElementById('spin-wheel').classList.remove('enabled');
}

// Load sentences into textarea
function loadSentencesToTextarea() {
    const textarea = document.getElementById('wheel-sentences-textarea');
    if (textarea) {
        textarea.value = sentences.join('\n');
    }
}

// Update sentences from textarea
function updateSentencesFromTextarea() {
    const textarea = document.getElementById('wheel-sentences-textarea');
    if (!textarea) return;
    
    const text = textarea.value.trim();
    if (!text) {
        showMessage('Please enter at least one sentence', 'error');
        return;
    }
    
    // Split by newlines and filter out empty lines
    const newSentences = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
    if (newSentences.length === 0) {
        showMessage('Please enter at least one valid sentence', 'error');
        return;
    }
    
    sentences = newSentences;
    saveSentences();
    renderWheel();
    showMessage(`Updated wheel with ${sentences.length} sentences!`, 'success');
}

// Clear all sentences
function clearAllSentences() {
    if (sentences.length === 0) {
        showMessage('No sentences to clear', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all sentences from the wheel?')) {
        sentences = [];
        saveSentences();
        renderWheel();
        loadSentencesToTextarea();
        showMessage('All sentences cleared from wheel!', 'success');
    }
}

// Show/hide loading overlay
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

// Show success/error messages
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.court-message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'court-message-popup';
    messageDiv.textContent = message;
    
    // Style based on type
    let backgroundColor, boxShadow;
    
    switch (type) {
        case 'success':
            backgroundColor = 'linear-gradient(145deg, #00ff00, #00cc00)';
            boxShadow = '0 0 30px rgba(0, 255, 0, 0.7)';
            break;
        case 'error':
            backgroundColor = 'linear-gradient(145deg, #ff0040, #cc0000)';
            boxShadow = '0 0 30px rgba(255, 0, 64, 0.7)';
            break;
        case 'warning':
            backgroundColor = 'linear-gradient(145deg, #ffaa00, #ff8800)';
            boxShadow = '0 0 30px rgba(255, 170, 0, 0.7)';
            break;
        case 'info':
            backgroundColor = 'linear-gradient(145deg, #8b00ff, #6600cc)';
            boxShadow = '0 0 30px rgba(139, 0, 255, 0.7)';
            break;
        default:
            backgroundColor = 'linear-gradient(145deg, #ff6b35, #ff0040)';
            boxShadow = '0 0 30px rgba(255, 107, 53, 0.7)';
    }
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        text-shadow: 0 0 10px #ffffff;
        box-shadow: ${boxShadow};
        z-index: 1000;
        animation: messageSlideIn 0.5s ease-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 4 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'messageSlideOut 0.5s ease-out';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 500);
    }, 4000);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Load reckless entries
    await loadRecklessEntries();
    
    // Set up filter buttons
    const filterButtons = document.querySelectorAll('.court-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleCourtFilterClick);
    });
    
    // Set up wheel controls
    document.getElementById('spin-wheel').addEventListener('click', spinWheel);
    document.getElementById('update-sentences').addEventListener('click', updateSentencesFromTextarea);
    document.getElementById('clear-sentences').addEventListener('click', clearAllSentences);
    
    // Set up sentence buttons
    document.getElementById('mark-safe').addEventListener('click', markAsSafe);
    document.getElementById('mark-sentenced').addEventListener('click', markAsSentenced);
    
    console.log('Reckless Court initialized! ⚖️');
});

// Add CSS for message animations
const style = document.createElement('style');
style.textContent = `
    @keyframes messageSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes messageSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
