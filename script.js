// Guest Submission System for Reckless Interface
let submissionsData = [];

// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
    // Replace with your actual Google Sheets API configuration
    scriptUrl: 'https://script.google.com/macros/s/AKfycbygD65v4-ejO1uvdPqwRGk4kaR1_Nsv6FUjKFXNFJ5kIRLEbus0STyCgLxT3n4CAFoO/exec', // Replace with your Apps Script URL
    sheetId: '1X9xQel2xBwdreSJYeFwSZ9dp3CZVEgkLKCa22deHKKk', // Replace with your Google Sheet ID
    sheetName: 'Reckless Submissions' // Name of the sheet tab
};

// Save submission to Google Sheets
async function saveSubmissionToGoogleSheets(submission) {
    try {
        const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptUrl, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'addSubmission',
                data: {
                    name: submission.name,
                    message: submission.message,
                    type: submission.type,
                    date: submission.date
                }
            })
        });
        
        console.log('Submission sent to Google Sheets');
        return true;
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        // Fallback to localStorage if Google Sheets fails
        saveSubmissionToLocalStorage(submission);
        return false;
    }
}

// Fallback: Save to localStorage
function saveSubmissionToLocalStorage(submission) {
    try {
        const stored = localStorage.getItem('recklessSubmissions');
        const submissions = stored ? JSON.parse(stored) : [];
        submissions.push(submission);
        localStorage.setItem('recklessSubmissions', JSON.stringify(submissions));
        console.log('Submission saved to localStorage as fallback');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Load submissions from Google Sheets
async function loadSubmissionsFromGoogleSheets() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_CONFIG.scriptUrl}?action=getSubmissions`, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (response.ok) {
            const data = await response.json();
            submissionsData = data.submissions || [];
            console.log('Submissions loaded from Google Sheets:', submissionsData.length);
            return true;
        }
    } catch (error) {
        console.error('Error loading from Google Sheets:', error);
    }
    
    // Fallback to localStorage
    return loadSubmissionsFromLocalStorage();
}

// Fallback: Load from localStorage
function loadSubmissionsFromLocalStorage() {
    try {
        const stored = localStorage.getItem('recklessSubmissions');
        if (stored) {
            submissionsData = JSON.parse(stored);
            console.log('Submissions loaded from localStorage:', submissionsData.length);
            return true;
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    submissionsData = [];
    return false;
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

// Render a single submission entry
function renderSubmissionEntry(submission) {
    const typeInfo = getSubmissionTypeInfo(submission.type);
    const date = new Date(submission.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `
        <div class="submission-entry" data-type="${submission.type}">
            <div class="submission-header-info">
                <div class="submission-name">${submission.name}</div>
                <div class="submission-type ${typeInfo.class}">${typeInfo.text}</div>
            </div>
            <div class="submission-message">"${submission.message}"</div>
            <div class="submission-date">📅 ${date}</div>
        </div>
    `;
}

// Render all submissions
function renderAllSubmissions() {
    const submissionsList = document.getElementById('submissions-list');
    if (submissionsList) {
        submissionsList.innerHTML = submissionsData.map(submission => renderSubmissionEntry(submission)).join('');
    }
}

// Add a new submission
async function addSubmission(name, message, type) {
    const newSubmission = {
        id: submissionsData.length > 0 ? Math.max(...submissionsData.map(s => s.id)) + 1 : 1,
        name: name,
        message: message,
        type: type,
        date: new Date().toISOString(),
        judgment: 'pending'
    };
    
    // Try to save to Google Sheets first
    const savedToSheets = await saveSubmissionToGoogleSheets(newSubmission);
    
    if (savedToSheets) {
        // Add to local array for immediate display
        submissionsData.unshift(newSubmission);
        renderAllSubmissions();
    } else {
        // If Google Sheets fails, add to local array and show warning
        submissionsData.unshift(newSubmission);
        renderAllSubmissions();
        showMessage('⚠️ Saved locally - Google Sheets unavailable', 'warning');
    }
}

// Handle form submission
async function handleSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name').trim();
    const message = formData.get('message').trim();
    const type = formData.get('type');
    
    // Validate form data
    if (!name || !message || !type) {
        showMessage('Please fill in all fields!', 'error');
        return;
    }
    
    // Show loading message
    showMessage('🚀 Sending to Reckless Court...', 'info');
    
    // Add the new submission
    await addSubmission(name, message, type);
    
    // Reset form
    event.target.reset();
    
    // Show success message
    showMessage('Submission sent to the Reckless Court! 🔥', 'success');
}

// Filter submissions by type
function filterSubmissions(filterType) {
    const submissionsList = document.getElementById('submissions-list');
    if (!submissionsList) return;
    
    let filteredData = submissionsData;
    if (filterType !== 'all') {
        filteredData = submissionsData.filter(submission => submission.type === filterType);
    }
    
    submissionsList.innerHTML = filteredData.map(submission => renderSubmissionEntry(submission)).join('');
}

// Handle filter button clicks
function handleFilterClick(event) {
    const filterType = event.target.getAttribute('data-filter');
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter submissions
    filterSubmissions(filterType);
}

// Show success/error messages
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-popup';
    messageDiv.textContent = message;
    
    // Style based on type
    let backgroundColor, boxShadow;
    
    switch (type) {
        case 'success':
            backgroundColor = 'linear-gradient(145deg, #ff6b35, #ff0040)';
            boxShadow = '0 0 30px rgba(255, 107, 53, 0.7)';
            break;
        case 'error':
            backgroundColor = 'linear-gradient(145deg, #ff0040, #ff6b35)';
            boxShadow = '0 0 30px rgba(255, 0, 64, 0.7)';
            break;
        case 'warning':
            backgroundColor = 'linear-gradient(145deg, #ff6b35, #ffaa00)';
            boxShadow = '0 0 30px rgba(255, 107, 53, 0.7)';
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

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Load submissions from Google Sheets (with localStorage fallback)
    await loadSubmissionsFromGoogleSheets();
    
    // Render all submissions
    renderAllSubmissions();
    
    // Set up form submission
    const submissionForm = document.getElementById('guest-submission-form');
    if (submissionForm) {
        submissionForm.addEventListener('submit', handleSubmission);
    }
    
    // Set up filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });
    
    console.log('Reckless Interface Guest Portal initialized! 🔥');
});

// Add some sample data for demonstration
if (submissionsData.length === 0) {
    const sampleSubmissions = [
        {
            id: 1,
            name: "Rere",
            message: "I can beat anyone at FIFA with my eyes closed",
            type: "kev-coin",
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            judgment: "pending"
        },
        {
            id: 2,
            name: "Pav",
            message: "Manchester United is the best team in the universe",
            type: "hate-coin",
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            judgment: "pending"
        },
        {
            id: 3,
            name: "Wajid",
            message: "I once scored 10 goals in one match... in my dreams",
            type: "write-down",
            date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            judgment: "pending"
        },
        {
            id: 4,
            name: "Abs",
            message: "I'm so good at betting, I can predict the weather",
            type: "court-case",
            date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            judgment: "pending"
        }
    ];
    
    submissionsData = sampleSubmissions;
    saveSubmissionsToStorage();
    renderAllSubmissions();
}