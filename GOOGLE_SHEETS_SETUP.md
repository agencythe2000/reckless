# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for the Reckless Court System.

## System Overview

The Reckless Court System consists of three main portals:

1. **Reckless Submissions** (`reckless-submissions.html` + `submission-script.js`) - Guest submission portal
2. **Reckless Review** (`reckless-review.html` + `admin-script.js`) - Admin review portal  
3. **Reckless Court** (`reckless-court.html` + `court-script.js`) - Final sentencing portal

All portals share the same Google Sheets backend via the `google-apps-script.js` deployment.

## File Structure

```
├── index.html                    # Main portal navigation
├── reckless-submissions.html     # Guest submission portal
├── reckless-review.html          # Admin review portal
├── reckless-court.html           # Court sentencing portal
├── config.js                     # Centralized configuration
├── submission-script.js           # Guest submission functionality
├── admin-script.js               # Admin review functionality
├── court-script.js               # Court sentencing functionality
├── google-apps-script.js         # Google Apps Script (deploy separately)
├── styles.css                    # Shared styling
└── GOOGLE_SHEETS_SETUP.md        # This documentation
```

### JavaScript Files Explained

- **`config.js`**: Centralized configuration file containing Google Sheets settings and system configuration
- **`submission-script.js`**: Handles guest submissions, form validation, and Google Sheets integration for the submission portal
- **`admin-script.js`**: Manages admin review functionality, judgment updates, filtering, and bulk operations
- **`court-script.js`**: Controls the spinning wheel, sentence management, and final sentencing operations
- **`google-apps-script.js`**: Server-side Google Apps Script code that interfaces with Google Sheets (deploy this separately)

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Reckless Submissions" (or any name you prefer)
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit`
   - Sheet ID: `1ABC123DEF456GHI789JKL`

## Step 2: Set up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code and paste the contents of `google-apps-script.js`
4. Replace `YOUR_SHEET_ID` with your actual Sheet ID from Step 1
5. Save the project and give it a name like "Reckless Submissions API"

## Step 3: Deploy as Web App

1. In your Apps Script project, click "Deploy" > "New deployment"
2. Choose "Web app" as the type
3. Set the following:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the Web App URL (it will look like `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

## Step 4: Update Your Website

**🎉 SIMPLIFIED!** You only need to update **one configuration file**:

### Update Centralized Configuration (`config.js`)
1. Open `config.js`
2. Find the `googleSheets` section
3. Replace `scriptUrl` with your actual Google Apps Script URL
4. Replace `sheetId` with your actual Google Sheet ID
5. Replace `sheetName` with your desired sheet tab name (optional)

That's it! All three portals will automatically use these settings.

## Step 5: Test the Integration

1. Open `index.html` (main portal)
2. Navigate to "Reckless Submissions" and submit a test entry
3. Navigate to "Reckless Review" and test judgment updates
4. Navigate to "Reckless Court" and test the spinning wheel
5. Check your Google Sheet to see if the data appears
6. The sheet should have columns: ID, Name, Message, Type, Date, Judgment, Sentence

### Judgment Field

- All new submissions automatically get a judgment status of "pending"
- This field can be manually updated in Google Sheets to track the status of each submission
- Possible judgment values include: "pending", "safe", "reckless", "sentenced"

### Sentence Field

- Added automatically when entries are sentenced in the Reckless Court
- Contains the punishment text assigned to sentenced entries
- Only populated for entries with judgment status "sentenced"

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your Apps Script is deployed as a web app with "Anyone" access
2. **Permission Denied**: Ensure the script has permission to access your Google Sheet
3. **Sheet Not Found**: Double-check the Sheet ID and make sure the sheet exists
4. **Data Not Appearing**: Check the browser console for error messages

### Testing the API:

You can test your Apps Script directly by visiting:
- `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getSubmissions`

This should return a JSON response with your submissions.

## Security Notes

- The current setup allows anyone to read and write to your sheet
- For production use, consider implementing authentication
- Monitor your sheet for spam or inappropriate content
- Consider adding rate limiting to prevent abuse

## Fallback Behavior

If Google Sheets is unavailable, the system will automatically fall back to localStorage, so submissions won't be lost even if the integration fails.
