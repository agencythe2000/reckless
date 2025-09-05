// Centralized Configuration for Reckless Court System
// Update these values in one place for all portals

const RECKLESS_CONFIG = {
    // Google Sheets Configuration
    googleSheets: {
        scriptUrl: 'https://script.google.com/macros/s/AKfycbyBlcJZtSDqUvTmH8ka-tzoUyCDlx_vVTVVFrTS1kl9MLGgDEBYOU6Pha5G_xZ_DfRJ/exec',
        sheetId: '1X9xQel2xBwdreSJYeFwSZ9dp3CZVEgkLKCa22deHKKk',
        sheetName: 'Reckless Submissions'
    },
    
    // System Configuration
    system: {
        appName: 'Reckless Court System',
        version: '1.0.0',
        debugMode: false
    },
    
    // Default Settings
    defaults: {
        judgmentStatus: 'pending',
        maxSubmissionsPerPage: 50,
        wheelSpinDuration: 4000 // milliseconds
    }
};

// Make it globally available
window.RECKLESS_CONFIG = RECKLESS_CONFIG;
