# 🔧 Troubleshooting Google Sheets Integration

## Issue: Judgments Not Saving to Google Sheets

If you're experiencing issues where judgments are not saving to Google Sheets from the Reckless Review page, follow these steps:

### Step 1: Test the Connection

1. Open `test-connection.html` in your browser
2. Click the "Test GET Request" button
3. Click the "Test POST Request" button
4. Click the "Test with Sample Data" button

This will help identify where the problem is occurring.

### Step 2: Check Google Apps Script Deployment

The most common issue is that the Google Apps Script is not properly deployed. Here's how to fix it:

#### 2.1 Access Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Open your "Reckless Submission Portal" project
3. Make sure the code in `google-apps-script.js` is copied into the script editor

#### 2.2 Deploy as Web App
1. Click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set the following:
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click "Deploy"
5. **Copy the new web app URL** - this is your new `scriptUrl`

#### 2.3 Update Configuration
1. Open `config.js`
2. Replace the `scriptUrl` with your new web app URL
3. Save the file

### Step 3: Verify Google Sheet Setup

#### 3.1 Check Sheet ID
1. Open your Google Sheet
2. The URL should look like: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
3. Copy the `SHEET_ID` part
4. Update `config.js` with the correct `sheetId`

#### 3.2 Check Sheet Name
1. In your Google Sheet, look at the tab name at the bottom
2. Make sure it matches the `sheetName` in `config.js` (default: "Reckless Submissions")

#### 3.3 Verify Sheet Structure
Your Google Sheet should have these columns:
- Column A: ID
- Column B: Name  
- Column C: Message
- Column D: Type
- Column E: Date
- Column F: Judgment
- Column G: Sentence (optional)

### Step 4: Test the Fix

1. Open `reckless-review.html`
2. Click "🔧 TEST CONNECTION" button
3. You should see a success message
4. Try updating a judgment and clicking "💾 SAVE ALL CHANGES"

### Step 5: Common Error Messages and Solutions

#### "Connection failed: 404"
- **Problem**: Google Apps Script not deployed or wrong URL
- **Solution**: Redeploy the script and update `config.js`

#### "Connection failed: 403"
- **Problem**: Permission denied
- **Solution**: Make sure the web app is set to "Anyone" access

#### "Connection failed: 500"
- **Problem**: Error in Google Apps Script
- **Solution**: Check the script execution logs in Google Apps Script

#### "CORS error"
- **Problem**: Cross-origin request blocked
- **Solution**: The enhanced save function will automatically try no-cors mode

### Step 6: Fallback System

If Google Sheets continues to fail, the system will automatically:
1. Save changes to `localStorage` as a backup
2. Show a warning message
3. Continue working offline

### Step 7: Manual Verification

To verify that judgments are actually being saved:

1. Open your Google Sheet
2. Look at the "Judgment" column (Column F)
3. Check if the values are being updated when you save changes

### Step 8: Debug Information

The system includes extensive logging. Open your browser's developer console (F12) to see:
- Connection attempts
- Request/response data
- Error messages
- Fallback actions

### Step 9: Reset Everything

If nothing works, you can reset the system:

1. Delete all data from your Google Sheet
2. Redeploy the Google Apps Script
3. Update `config.js` with the new URL
4. Test with fresh data

## Quick Fix Checklist

- [ ] Google Apps Script deployed as web app
- [ ] Web app set to "Anyone" access
- [ ] `config.js` updated with correct `scriptUrl`
- [ ] `config.js` updated with correct `sheetId`
- [ ] `config.js` updated with correct `sheetName`
- [ ] Google Sheet has proper column structure
- [ ] Test connection shows success
- [ ] Browser console shows no errors

## Still Having Issues?

If you're still experiencing problems:

1. Check the browser console for error messages
2. Verify the Google Apps Script execution logs
3. Test with the `test-connection.html` page
4. Make sure you're using the latest version of all files

The system is designed to work even if Google Sheets fails, so your data will always be preserved in `localStorage` as a backup.
