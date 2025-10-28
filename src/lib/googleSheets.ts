import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Initialize Google Sheets API
export async function getGoogleSheetsClient() {
  try {
    // Check if all required environment variables are present
    const requiredVars = [
      'GOOGLE_SPREADSHEET_ID',
      'GOOGLE_CLIENT_EMAIL', 
      'GOOGLE_PRIVATE_KEY',
      'GOOGLE_PROJECT_ID'
    ];

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    }

    // Create JWT credentials
    const credentials = {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`,
    };

    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: 'v4', auth });

    return sheets;
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('unregistered callers')) {
        throw new Error('Google Sheets API is not enabled. Please enable it in Google Cloud Console: https://console.cloud.google.com/apis/library/sheets.googleapis.com');
      } else if (error.message.includes('permission') || error.message.includes('403')) {
        throw new Error(`Permission denied. Please share your spreadsheet with: ${process.env.GOOGLE_CLIENT_EMAIL}`);
      } else if (error.message.includes('not found') || error.message.includes('404')) {
        throw new Error('Spreadsheet not found. Check the GOOGLE_SPREADSHEET_ID and make sure the spreadsheet is shared with the service account.');
      }
    }
    
    throw error;
  }
}

// Spreadsheet configuration
export const SPREADSHEET_CONFIG = {
  SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID || '',
  SHEETS: {
    TEAMS: 'Teams',
    CANDIDATES: 'Candidates', 
    RESULTS: 'Results',
    PROGRAMMES: 'Programmes',
    BASIC: 'Festival_Info'
  }
};

// Helper functions for data conversion
export function convertToSheetFormat(data: any[], type: string): any[][] {
  if (!data || data.length === 0) return [];
  
  switch (type) {
    case 'teams':
      return data.map(team => [
        team._id?.toString() || '',
        team.code || '',
        team.name || '',
        team.color || '',
        team.description || '',
        team.captain || '',
        team.members || 0,
        team.points || 0,
        team.createdAt?.toISOString() || '',
        team.updatedAt?.toISOString() || ''
      ]);
      
    case 'candidates':
      return data.map(candidate => [
        candidate._id?.toString() || '',
        candidate.chestNumber || '',
        candidate.name || '',
        candidate.team || '',
        candidate.section || '',
        candidate.grade || '',
        candidate.points || 0,
        candidate.createdAt?.toISOString() || '',
        candidate.updatedAt?.toISOString() || ''
      ]);
      
    case 'programmes':
      return data.map(programme => [
        programme._id?.toString() || '',
        programme.code || '',
        programme.name || '',
        programme.category || '',
        programme.section || '',
        programme.positionType || '',
        programme.status || '',
        programme.createdAt?.toISOString() || '',
        programme.updatedAt?.toISOString() || ''
      ]);
      
    case 'results':
      return data.map(result => [
        result._id?.toString() || '',
        result.programme || '',
        result.section || '',
        result.positionType || '',
        Array.isArray(result.firstPlace) ? result.firstPlace.map((w: any) => `${w.chestNumber}(${w.grade})`).join(', ') : '',
        Array.isArray(result.secondPlace) ? result.secondPlace.map((w: any) => `${w.chestNumber}(${w.grade})`).join(', ') : '',
        Array.isArray(result.thirdPlace) ? result.thirdPlace.map((w: any) => `${w.chestNumber}(${w.grade})`).join(', ') : '',
        result.firstPoints || 0,
        result.secondPoints || 0,
        result.thirdPoints || 0,
        result.notes || '',
        result.createdAt?.toISOString() || '',
        result.updatedAt?.toISOString() || ''
      ]);
      
    default:
      return [];
  }
}

export function getSheetHeaders(type: string): string[] {
  switch (type) {
    case 'teams':
      return ['ID', 'Code', 'Name', 'Color', 'Description', 'Captain', 'Members', 'Points', 'Created', 'Updated'];
      
    case 'candidates':
      return ['ID', 'Chest Number', 'Name', 'Team', 'Section', 'Grade', 'Points', 'Created', 'Updated'];
      
    case 'programmes':
      return ['ID', 'Code', 'Name', 'Category', 'Section', 'Position Type', 'Status', 'Created', 'Updated'];
      
    case 'results':
      return ['ID', 'Programme', 'Section', 'Position Type', '1st Place', '2nd Place', '3rd Place', '1st Points', '2nd Points', '3rd Points', 'Notes', 'Created', 'Updated'];
      
    default:
      return [];
  }
}

export function convertFromSheetFormat(rows: any[][], type: string): any[] {
  if (!rows || rows.length <= 1) return []; // Skip header row
  
  const dataRows = rows.slice(1); // Remove header row
  
  switch (type) {
    case 'teams':
      return dataRows.map(row => ({
        _id: row[0] || undefined,
        code: row[1] || '',
        name: row[2] || '',
        color: row[3] || '',
        description: row[4] || '',
        captain: row[5] || '',
        members: parseInt(row[6]) || 0,
        points: parseInt(row[7]) || 0,
        createdAt: row[8] ? new Date(row[8]) : new Date(),
        updatedAt: row[9] ? new Date(row[9]) : new Date()
      }));
      
    case 'candidates':
      return dataRows.map(row => ({
        _id: row[0] || undefined,
        chestNumber: row[1] || '',
        name: row[2] || '',
        team: row[3] || '',
        section: row[4] || '',
        grade: row[5] || '',
        points: parseInt(row[6]) || 0,
        createdAt: row[7] ? new Date(row[7]) : new Date(),
        updatedAt: row[8] ? new Date(row[8]) : new Date()
      }));
      
    case 'programmes':
      return dataRows.map(row => ({
        _id: row[0] || undefined,
        code: row[1] || '',
        name: row[2] || '',
        category: row[3] || '',
        section: row[4] || '',
        positionType: row[5] || '',
        status: row[6] || 'active',
        createdAt: row[7] ? new Date(row[7]) : new Date(),
        updatedAt: row[8] ? new Date(row[8]) : new Date()
      }));
      
    case 'results':
      return dataRows.map(row => ({
        _id: row[0] || undefined,
        programme: row[1] || '',
        section: row[2] || '',
        positionType: row[3] || '',
        firstPlace: row[4] ? row[4].split(', ').map((w: string) => {
          const match = w.match(/^(.+)\(([A-F])\)$/);
          return match ? { chestNumber: match[1], grade: match[2] } : { chestNumber: w, grade: 'A' };
        }) : [],
        secondPlace: row[5] ? row[5].split(', ').map((w: string) => {
          const match = w.match(/^(.+)\(([A-F])\)$/);
          return match ? { chestNumber: match[1], grade: match[2] } : { chestNumber: w, grade: 'A' };
        }) : [],
        thirdPlace: row[6] ? row[6].split(', ').map((w: string) => {
          const match = w.match(/^(.+)\(([A-F])\)$/);
          return match ? { chestNumber: match[1], grade: match[2] } : { chestNumber: w, grade: 'A' };
        }) : [],
        firstPoints: parseInt(row[7]) || 0,
        secondPoints: parseInt(row[8]) || 0,
        thirdPoints: parseInt(row[9]) || 0,
        notes: row[10] || '',
        createdAt: row[11] ? new Date(row[11]) : new Date(),
        updatedAt: row[12] ? new Date(row[12]) : new Date()
      }));
      
    default:
      return [];
  }
}