import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Initialize Google Sheets API
export async function getGoogleSheetsClient() {
  try {
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
    throw error;
  }
}

// Spreadsheet configuration
export const SPREADSHEET_CONFIG = {
  SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID || '',
  SHEETS: {
    TEAMS: 'Teams',
    CANDIDATES: 'Candidates',
    PROGRAMMES: 'Programmes',
    RESULTS: 'Results',
    SCHEDULE: 'Schedule'
  }
};

// Helper function to convert array data to sheet format
export function convertToSheetFormat(data: any[], type: 'teams' | 'candidates' | 'programmes' | 'results' | 'schedule') {
  if (!data || data.length === 0) return [];

  switch (type) {
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

    default:
      return [];
  }
}

// Helper function to get sheet headers
export function getSheetHeaders(type: 'teams' | 'candidates' | 'programmes' | 'results' | 'schedule') {
  switch (type) {
    case 'teams':
      return ['ID', 'Name', 'Color', 'Description', 'Captain', 'Members', 'Points', 'Created At', 'Updated At'];
    
    case 'candidates':
      return ['ID', 'Chest Number', 'Name', 'Team', 'Section', 'Points', 'Created At', 'Updated At'];
    
    case 'programmes':
      return ['ID', 'Code', 'Name', 'Category', 'Section', 'Position Type', 'Status', 'Created At', 'Updated At'];
    
    default:
      return [];
  }
}

// Convert sheet row data back to object format
export function convertFromSheetFormat(row: any[], type: 'teams' | 'candidates' | 'programmes') {
  if (!row || row.length === 0) return null;

  switch (type) {
    case 'teams':
      return {
        _id: row[0] || undefined,
        name: row[1] || '',
        color: row[2] || '',
        description: row[3] || '',
        captain: row[4] || '',
        members: parseInt(row[5]) || 0,
        points: parseInt(row[6]) || 0,
        createdAt: row[7] ? new Date(row[7]) : new Date(),
        updatedAt: row[8] ? new Date(row[8]) : new Date()
      };

    case 'candidates':
      return {
        _id: row[0] || undefined,
        chestNumber: row[1] || '',
        name: row[2] || '',
        team: row[3] || '',
        section: row[4] as 'senior' | 'junior' | 'sub-junior' | 'general',
        points: parseInt(row[5]) || 0,
        createdAt: row[6] ? new Date(row[6]) : new Date(),
        updatedAt: row[7] ? new Date(row[7]) : new Date()
      };

    case 'programmes':
      return {
        _id: row[0] || undefined,
        code: row[1] || '',
        name: row[2] || '',
        category: row[3] as 'arts' | 'sports',
        section: row[4] as 'senior' | 'junior' | 'sub-junior' | 'general',
        positionType: row[5] as 'individual' | 'group' | 'general',
        status: row[6] as 'active' | 'inactive' | 'completed',
        createdAt: row[7] ? new Date(row[7]) : new Date(),
        updatedAt: row[8] ? new Date(row[8]) : new Date()
      };

    default:
      return null;
  }
}