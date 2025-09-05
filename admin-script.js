// Admin Portal for Reckless Submission System
let adminSubmissionsData = [];
let pendingChanges = new Map(); // Track unsaved changes

// Use centralized configuration
const GOOGLE_SHEETS_CONFIG = window.RECKLESS_CONFIG.googleSheets;

// Load submissions from Google Sheets
async function loadSubmissionsFromGoogleSheets() {
    showLoading(true);
    try {
        const response = await fetch(`${GOOGLE_SHEETS_CONFIG.scriptUrl}?action=getSubmissions`, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (response.ok) {
            const data = await response.json();
            adminSubmissionsData = data.submissions || [];
            console.log('Submissions loaded from Google Sheets:', adminSubmissionsData.length);
            console.log('Sample submission data:', adminSubmissionsData[0]);
            updateStats();
            renderAllAdminEntries();
            return true;
        }
    } catch (error) {
        console.error('Error loading from Google Sheets:', error);
        showMessage('Error loading submissions from Google Sheets, trying localStorage fallback', 'warning');
        
        // Fallback to localStorage
        try {
            const stored = localStorage.getItem('recklessSubmissions');
            if (stored) {
                adminSubmissionsData = JSON.parse(stored);
                console.log('Submissions loaded from localStorage:', adminSubmissionsData.length);
                updateStats();
                renderAllAdminEntries();
                return true;
            }
        } catch (localError) {
            console.error('Error loading from localStorage:', localError);
        }
    } finally {
        showLoading(false);
    }
    
    return false;
}

// Save judgment changes to Google Sheets
async function saveJudgmentChanges() {
    if (pendingChanges.size === 0) {
        showMessage('No changes to save', 'info');
        return;
    }

    showLoading(true);
    try {
        const changes = Array.from(pendingChanges.entries()).map(([id, judgment]) => ({
            id: parseInt(id),
            judgment: judgment
        }));

        const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'updateJudgments',
                data: changes
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Save result:', result);

        // Clear pending changes
        pendingChanges.clear();
        updateStats();
        showMessage(`Successfully saved ${changes.length} judgment changes!`, 'success');
        
    } catch (error) {
        console.error('Error saving judgments:', error);
        showMessage('Error saving to Google Sheets, saving to localStorage instead', 'warning');
        
        // Fallback to localStorage
        try {
            // Update local data
            changes.forEach(change => {
                const entry = adminSubmissionsData.find(e => e.id == change.id);
                if (entry) {
                    entry.judgment = change.judgment;
                }
            });
            
            // Save to localStorage
            localStorage.setItem('recklessSubmissions', JSON.stringify(adminSubmissionsData));
            
            // Clear pending changes
            pendingChanges.clear();
            updateStats();
            showMessage(`Saved ${changes.length} judgment changes to localStorage!`, 'success');
        } catch (localError) {
            console.error('Error saving to localStorage:', localError);
            showMessage('Error saving judgment changes', 'error');
        }
    } finally {
        showLoading(false);
    }
}

// Update judgment for a specific entry
function updateEntryJudgment(entryId, newJudgment) {
    console.log('Updating judgment for entry:', entryId, 'to:', newJudgment);
    console.log('Available entries:', adminSubmissionsData.map(e => ({ id: e.id, type: typeof e.id })));
    
    // Try both string and number comparison
    let entry = adminSubmissionsData.find(e => e.id == entryId);
    if (!entry) {
        entry = adminSubmissionsData.find(e => e.id === entryId);
    }
    
    if (entry) {
        entry.judgment = newJudgment;
        pendingChanges.set(entryId.toString(), newJudgment);
        console.log('Pending changes:', Array.from(pendingChanges.entries()));
        updateStats();
        renderAllAdminEntries();
    } else {
        console.error('Entry not found:', entryId, 'Available IDs:', adminSubmissionsData.map(e => e.id));
    }
}

// Generate submission type display text and class
function getSubmissionTypeInfo(type) {
    const typeMap = {
        'kev-coin': { text: '⚡ KEV COIN', class: 'kev-coin' },
        'hate-coin': { text: '💀 HATE COIN', class: 'hate-coin' },
        'court-case': { text: '⚖️ COURT CASE', class: 'court-case' },
        'write-down': { text: '📝 WRITE THIS DOWN', class: 'write-down' }
    };
    return typeMap[type] || { text: 'UNKNOWN', class: 'unknown' };
}

// Generate judgment display info
function getJudgmentInfo(judgment) {
    const judgmentMap = {
        'pending': { text: '⏳ PENDING', class: 'pending', color: '#ffaa00' },
        'safe': { text: '✅ SAFE', class: 'safe', color: '#00ff00' },
        'reckless': { text: '🔥 RECKLESS', class: 'reckless', color: '#ff0040' },
        'sentenced': { text: '⚖️ SENTENCED', class: 'sentenced', color: '#8b00ff' }
    };
    return judgmentMap[judgment] || judgmentMap['pending'];
}

// Render a single admin entry
function renderAdminEntry(entry) {
    const typeInfo = getSubmissionTypeInfo(entry.type);
    const judgmentInfo = getJudgmentInfo(entry.judgment);
    const date = new Date(entry.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const hasChanges = pendingChanges.has(entry.id.toString());
    
    return `
        <div class="admin-entry ${hasChanges ? 'has-changes' : ''}" data-type="${entry.type}" data-judgment="${entry.judgment}">
            <div class="admin-entry-header">
                <div class="entry-info">
                    <div class="entry-name">${entry.name}</div>
                    <div class="entry-type ${typeInfo.class}">${typeInfo.text}</div>
                </div>
                <div class="entry-meta">
                    <div class="entry-date">📅 ${date}</div>
                    <div class="entry-id">#${entry.id}</div>
                </div>
            </div>
            
            <div class="admin-entry-message">"${entry.message}"</div>
            
            <div class="admin-entry-actions">
                <div class="current-judgment">
                    <span class="judgment-label">Current Judgment:</span>
                    <span class="judgment-status ${judgmentInfo.class}" style="color: ${judgmentInfo.color}">
                        ${judgmentInfo.text}
                    </span>
                </div>
                
                ${entry.judgment !== 'sentenced' ? `
                <div class="judgment-buttons">
                    <button class="judgment-btn safe-btn ${entry.judgment === 'safe' ? 'active' : ''}" 
                            onclick="updateEntryJudgment(${entry.id}, 'safe')">
                        ✅ SAFE
                    </button>
                    <button class="judgment-btn reckless-btn ${entry.judgment === 'reckless' ? 'active' : ''}" 
                            onclick="updateEntryJudgment(${entry.id}, 'reckless')">
                        🔥 RECKLESS
                    </button>
                </div>
                ` : `
                <div class="sentenced-notice">
                    <span style="color: #8b00ff; font-weight: 700; font-style: italic;">⚖️ SENTENCED - NO CHANGES ALLOWED</span>
                </div>
                `}
            </div>
        </div>
    `;
}

// Render all admin entries
function renderAllAdminEntries() {
    const entriesList = document.getElementById('admin-entries-list');
    if (entriesList) {
        entriesList.innerHTML = adminSubmissionsData.map(entry => renderAdminEntry(entry)).join('');
    }
}

// Filter entries by type or judgment
function filterAdminEntries(filterType) {
    const entriesList = document.getElementById('admin-entries-list');
    if (!entriesList) return;
    
    let filteredData = adminSubmissionsData;
    
    if (filterType === 'pending') {
        filteredData = adminSubmissionsData.filter(entry => entry.judgment === 'pending');
    } else if (filterType === 'sentenced') {
        filteredData = adminSubmissionsData.filter(entry => entry.judgment === 'sentenced');
    } else if (filterType !== 'all') {
        filteredData = adminSubmissionsData.filter(entry => entry.type === filterType);
    }
    
    entriesList.innerHTML = filteredData.map(entry => renderAdminEntry(entry)).join('');
}

// Handle filter button clicks
function handleAdminFilterClick(event) {
    const filterType = event.target.getAttribute('data-filter');
    
    // Update active button
    document.querySelectorAll('.admin-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter entries
    filterAdminEntries(filterType);
}

// Update statistics
function updateStats() {
    const totalEntries = adminSubmissionsData.length;
    const pendingEntries = adminSubmissionsData.filter(e => e.judgment === 'pending').length;
    const safeEntries = adminSubmissionsData.filter(e => e.judgment === 'safe').length;
    const recklessEntries = adminSubmissionsData.filter(e => e.judgment === 'reckless').length;
    const sentencedEntries = adminSubmissionsData.filter(e => e.judgment === 'sentenced').length;
    
    document.getElementById('total-entries').textContent = totalEntries;
    document.getElementById('pending-entries').textContent = pendingEntries;
    document.getElementById('safe-entries').textContent = safeEntries;
    document.getElementById('reckless-entries').textContent = recklessEntries;
    
    // Add sentenced entries to stats if the element exists
    const sentencedElement = document.getElementById('sentenced-entries');
    if (sentencedElement) {
        sentencedElement.textContent = sentencedEntries;
    }
}

// Bulk actions
function markAllSafe() {
    const visibleEntries = document.querySelectorAll('.admin-entry');
    visibleEntries.forEach(entryEl => {
        const entryId = entryEl.querySelector('.judgment-btn').onclick.toString().match(/\d+/)[0];
        updateEntryJudgment(parseInt(entryId), 'safe');
    });
    showMessage('All visible entries marked as SAFE', 'success');
}

function markAllReckless() {
    const visibleEntries = document.querySelectorAll('.admin-entry');
    visibleEntries.forEach(entryEl => {
        const entryId = entryEl.querySelector('.judgment-btn').onclick.toString().match(/\d+/)[0];
        updateEntryJudgment(parseInt(entryId), 'reckless');
    });
    showMessage('All visible entries marked as RECKLESS', 'success');
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
    const existingMessage = document.querySelector('.admin-message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'admin-message-popup';
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
            backgroundColor = 'linear-gradient(145deg, #0066cc, #004499)';
            boxShadow = '0 0 30px rgba(0, 102, 204, 0.7)';
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
    // Load submissions from Google Sheets
    await loadSubmissionsFromGoogleSheets();
    
    // Set up filter buttons
    const filterButtons = document.querySelectorAll('.admin-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleAdminFilterClick);
    });
    
    // Set up bulk action buttons
    document.getElementById('mark-all-safe').addEventListener('click', markAllSafe);
    document.getElementById('mark-all-reckless').addEventListener('click', markAllReckless);
    document.getElementById('save-changes').addEventListener('click', saveJudgmentChanges);
    
    console.log('Reckless Admin Portal initialized! 🔥');
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
