# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for the Reckless Submission Portal.

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

1. Open `script.js` in your website
2. Find the `GOOGLE_SHEETS_CONFIG` section
3. Replace `YOUR_SCRIPT_ID` with the actual Script ID from your Web App URL
4. Replace `YOUR_SHEET_ID` with your actual Sheet ID

## Step 5: Test the Integration

1. Open your website
2. Submit a test entry
3. Check your Google Sheet to see if the data appears
4. The sheet should have columns: ID, Name, Message, Type, Date, Judgment

### Judgment Field

- All new submissions automatically get a judgment status of "pending"
- This field can be manually updated in Google Sheets to track the status of each submission
- Possible judgment values could include: "pending", "approved", "rejected", "under review", etc.

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
