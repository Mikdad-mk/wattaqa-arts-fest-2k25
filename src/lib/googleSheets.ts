import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Initialize Google Sheets API
export async function getGoogleSheetsClient() {
  try {
    // Check if all required environment variables are present
    const requiredVars = ['GOOGLE_PROJECT_ID', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_CLIENT_EMAIL'];
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    }

    // Use service account credentials from environment variables
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
    BASIC: 'basic',
    TEAMS: 'team', 
    CANDIDATES: 'candidate',
    PROGRAMMES: 'program',
    RESULTS: 'result'
  }
};

// Helper function to convert array data to sheet format
export function convertToSheetFormat(data: any[], type: 'basic' | 'teams' | 'candidates' | 'programmes' | 'results') {
  if (!data || data.length === 0) return [];

  switch (type) {
    case 'basic':
      return data.map(item => [
        item._id?.toString() || '',
        item.name || '',
        item.year || '',
        item.startDate || '',
        item.endDate || '',
        item.venue || '',
        item.description || '',
        item.status || '',
        item.createdAt?.toISOString() || '',
        item.updatedAt?.toISOString() || ''
      ]);

    case 'teams':
      return data.map(team => [
        team._id?.toString() || '',
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
        result.grade || '',
        result.positionType || '',
        JSON.stringify(result.winners || []),
        result.notes || '',
        result.createdAt?.toISOString() || '',
        result.updatedAt?.toISOString() || ''
      ]);

    default:
      return [];
  }
}

// Helper function to get sheet headers
export function getSheetHeaders(type: 'basic' | 'teams' | 'candidates' | 'programmes' | 'results') {
  switch (type) {
    case 'basic':
      return ['ID', 'Name', 'Year', 'Start Date', 'End Date', 'Venue', 'Description', 'Status', 'Created At', 'Updated At'];
    
    case 'teams':
      return ['ID', 'Name', 'Color', 'Description', 'Captain', 'Members', 'Points', 'Created At', 'Updated At'];

    case 'candidates':
      return ['ID', 'Chest Number', 'Name', 'Team', 'Section', 'Points', 'Created At', 'Updated At'];

    case 'programmes':
      return ['ID', 'Code', 'Name', 'Category', 'Section', 'Position Type', 'Status', 'Created At', 'Updated At'];
    
    case 'results':
      return ['ID', 'Programme', 'Section', 'Grade', 'Position Type', 'Winners', 'Notes', 'Created At', 'Updated At'];

    default:
      return [];
  }
}

// Helper function to safely parse dates
function safeParseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

// Helper function to safely parse integers
function safeParseInt(str: string, defaultValue: number = 0): number {
  if (!str) return defaultValue;
  const parsed = parseInt(str);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Convert sheet row data back to object format
export function convertFromSheetFormat(row: any[], type: 'basic' | 'teams' | 'candidates' | 'programmes' | 'results') {
  if (!row || row.length === 0) return null;

  try {
    switch (type) {
      case 'basic':
        return {
          _id: row[0] || undefined,
          name: row[1] || '',
          year: row[2] || '',
          startDate: safeParseDate(row[3]),
          endDate: safeParseDate(row[4]),
          venue: row[5] || '',
          description: row[6] || '',
          status: row[7] as 'upcoming' | 'ongoing' | 'completed' || 'upcoming',
          createdAt: safeParseDate(row[8]),
          updatedAt: safeParseDate(row[9])
        };

      case 'teams':
        // Skip if essential fields are empty
        if (!row[1] || row[1].toString().trim() === '') {
          return null;
        }

        return {
          _id: row[0] || undefined,
          name: row[1].toString().trim(),
          color: row[2] ? row[2].toString().trim() : '',
          description: row[3] ? row[3].toString().trim() : '',
          captain: row[4] ? row[4].toString().trim() : '',
          members: safeParseInt(row[5], 0),
          points: safeParseInt(row[6], 0),
          createdAt: safeParseDate(row[7]),
          updatedAt: safeParseDate(row[8])
        };

      case 'candidates':
        // Skip if essential fields are empty
        if (!row[1] || !row[2] || !row[3] || !row[4] ||
            row[1].toString().trim() === '' || 
            row[2].toString().trim() === '' || 
            row[3].toString().trim() === '' || 
            row[4].toString().trim() === '') {
          return null;
        }

        return {
          _id: row[0] || undefined,
          chestNumber: row[1].toString().trim(),
          name: row[2].toString().trim(),
          team: row[3].toString().trim(),
          section: row[4].toString().trim() as 'senior' | 'junior' | 'sub-junior' | 'general',
          points: safeParseInt(row[5], 0),
          createdAt: safeParseDate(row[6]),
          updatedAt: safeParseDate(row[7])
        };

      case 'programmes':
        // Skip if essential fields are empty
        if (!row[1] || !row[2] || !row[3] || !row[4] || !row[5] ||
            row[1].toString().trim() === '' || 
            row[2].toString().trim() === '' || 
            row[3].toString().trim() === '' || 
            row[4].toString().trim() === '' || 
            row[5].toString().trim() === '') {
          return null;
        }

        return {
          _id: row[0] || undefined,
          code: row[1].toString().trim(),
          name: row[2].toString().trim(),
          category: row[3].toString().trim() as 'arts' | 'sports',
          section: row[4].toString().trim() as 'senior' | 'junior' | 'sub-junior' | 'general',
          positionType: row[5].toString().trim() as 'individual' | 'group' | 'general',
          status: row[6] ? row[6].toString().trim() as 'active' | 'inactive' | 'completed' : 'active',
          createdAt: safeParseDate(row[7]),
          updatedAt: safeParseDate(row[8])
        };

      case 'results':
        let winners = [];
        try {
          winners = row[5] && row[5] !== '' ? JSON.parse(row[5]) : [];
        } catch (error) {
          console.warn('Invalid JSON in winners field:', row[5]);
          winners = [];
        }
        
        return {
          _id: row[0] || undefined,
          programme: row[1] || '',
          section: row[2] as 'senior' | 'junior' | 'sub-junior' | 'general',
          grade: row[3] as 'A' | 'B' | 'C' | 'D' | 'E' | 'F',
          positionType: row[4] as 'individual' | 'group' | 'general',
          winners: winners,
          notes: row[6] || '',
          createdAt: safeParseDate(row[7]),
          updatedAt: safeParseDate(row[8])
        };

      default:
        return null;
    }
  } catch (error) {
    console.error('Error converting sheet row to object:', error, 'Row:', row);
    return null;
  }
}