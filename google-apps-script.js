// Google Apps Script for Reckless Submission Portal
// This script should be deployed as a web app in Google Apps Script

// Configuration - Replace with your actual Google Sheet ID
const SHEET_ID = '1X9xQel2xBwdreSJYeFwSZ9dp3CZVEgkLKCa22deHKKk'; // Replace with your Google Sheet ID
const SHEET_NAME = 'Reckless Submissions'; // Name of the sheet tab

// Main function to handle HTTP requests
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        
        if (data.action === 'addSubmission') {
            return addSubmission(data.data);
        } else if (data.action === 'updateJudgments') {
            return updateJudgments(data.data);
        } else if (data.action === 'updateJudgmentWithSentence') {
            return updateJudgmentWithSentence(data.data);
        } else if (data.action === 'updateJudgmentToFree') {
            return updateJudgmentToFree(data.data);
        }
        
        return ContentService
            .createTextOutput(JSON.stringify({ error: 'Invalid action' }))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Handle GET requests
function doGet(e) {
    try {
        if (e.parameter.action === 'getSubmissions') {
            return getSubmissions();
        }
        
        return ContentService
            .createTextOutput(JSON.stringify({ error: 'Invalid action' }))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Add a new submission to the Google Sheet
function addSubmission(submissionData) {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
        
        // Create header row if it doesn't exist
        if (sheet.getLastRow() === 0) {
            sheet.getRange(1, 1, 1, 6).setValues([['ID', 'Name', 'Message', 'Type', 'Date', 'Judgment']]);
        }
        
        // Generate new ID
        const lastRow = sheet.getLastRow();
        const newId = lastRow; // Since we start from row 1 (header), the ID is the row number
        
        // Add the submission data
        const rowData = [
            newId,
            submissionData.name,
            submissionData.message,
            submissionData.type,
            submissionData.date,
            'pending' // Default judgment status
        ];
        
        sheet.appendRow(rowData);
        
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: true, 
                message: 'Submission added successfully',
                id: newId
            }))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: false, 
                error: error.toString() 
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Get all submissions from the Google Sheet
function getSubmissions() {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
        const data = sheet.getDataRange().getValues();
        
        // Skip header row
        const submissions = data.slice(1).map((row, index) => ({
            id: row[0] || index + 1,
            name: row[1] || '',
            message: row[2] || '',
            type: row[3] || '',
            date: row[4] || new Date().toISOString(),
            judgment: row[5] || 'pending',
            sentence: row[6] || '' // Include sentence column
        }));
        
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: true, 
                submissions: submissions 
            }))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: false, 
                error: error.toString() 
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Update judgments for multiple entries
function updateJudgments(judgmentUpdates) {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
        const data = sheet.getDataRange().getValues();
        
        let updatedCount = 0;
        
        // Process each judgment update
        judgmentUpdates.forEach(update => {
            const entryId = update.id;
            const newJudgment = update.judgment;
            
            // Find the row with matching ID (column A)
            for (let i = 1; i < data.length; i++) { // Skip header row
                if (data[i][0] == entryId) {
                    // Update the judgment column (column F, index 5)
                    sheet.getRange(i + 1, 6).setValue(newJudgment);
                    updatedCount++;
                    break;
                }
            }
        });
        
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: true, 
                message: `Updated ${updatedCount} judgments successfully`,
                updatedCount: updatedCount
            }))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: false, 
                error: error.toString() 
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Update judgment with sentence for a single entry
function updateJudgmentWithSentence(updateData) {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
        const data = sheet.getDataRange().getValues();
        
        const entryId = updateData.id;
        const newJudgment = updateData.judgment;
        const sentence = updateData.sentence;
        
        // Check if we need to add a sentence column
        if (data.length > 0 && data[0].length < 7) {
            // Add sentence column header
            sheet.getRange(1, 7).setValue('Sentence');
        }
        
        // Find the row with matching ID (column A)
        for (let i = 1; i < data.length; i++) { // Skip header row
            if (data[i][0] == entryId) {
                // Update the judgment column (column F, index 5)
                sheet.getRange(i + 1, 6).setValue(newJudgment);
                // Update the sentence column (column G, index 6)
                sheet.getRange(i + 1, 7).setValue(sentence);
                break;
            }
        }
        
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: true, 
                message: `Updated judgment and sentence for entry ${entryId}`,
                entryId: entryId,
                judgment: newJudgment,
                sentence: sentence
            }))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: false, 
                error: error.toString() 
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Update judgment to 'free' for sentenced entries
function updateJudgmentToFree(updateData) {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
        const data = sheet.getDataRange().getValues();
        
        const entryId = updateData.id;
        
        // Find the row with matching ID (column A)
        for (let i = 1; i < data.length; i++) { // Skip header row
            if (data[i][0] == entryId) {
                // Update the judgment column (column F, index 5) to 'free'
                sheet.getRange(i + 1, 6).setValue('free');
                // Clear the sentence column (column G, index 6) since they're now free
                sheet.getRange(i + 1, 7).setValue('');
                break;
            }
        }
        
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: true, 
                message: `Entry ${entryId} has been set free!`,
                entryId: entryId,
                judgment: 'free'
            }))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: false, 
                error: error.toString() 
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Setup function to create the sheet if it doesn't exist
function setupSheet() {
    try {
        const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
        let sheet = spreadsheet.getSheetByName(SHEET_NAME);
        
        if (!sheet) {
            sheet = spreadsheet.insertSheet(SHEET_NAME);
            // Add header row
            sheet.getRange(1, 1, 1, 6).setValues([['ID', 'Name', 'Message', 'Type', 'Date', 'Judgment']]);
            // Format header row
            sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
            sheet.getRange(1, 1, 1, 6).setBackground('#ff6b35');
            sheet.getRange(1, 1, 1, 6).setFontColor('#ffffff');
        }
        
        console.log('Sheet setup completed successfully');
        return true;
        
    } catch (error) {
        console.error('Error setting up sheet:', error);
        return false;
    }
}
