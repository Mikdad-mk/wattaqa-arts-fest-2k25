import { getGoogleSheetsClient, SPREADSHEET_CONFIG, convertToSheetFormat, getSheetHeaders, convertFromSheetFormat } from './googleSheets';
import { getDatabase } from './mongodb';
import { Team, Candidate, Programme } from '@/types';
import { ObjectId } from 'mongodb';

export class GoogleSheetsSync {
  private sheets: any;
  private db: any;

  constructor() {
    this.initializeClients();
  }

  // Helper function to validate ObjectId
  private isValidObjectId(id: string): boolean {
    try {
      return ObjectId.isValid(id) && (new ObjectId(id)).toString() === id;
    } catch {
      return false;
    }
  }

  // Helper function to add delay between API calls
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Batch update sheet IDs to avoid quota limits
  private async batchUpdateSheetIds(sheetName: string, updates: { rowIndex: number, id: string }[]): Promise<void> {
    if (updates.length === 0) return;

    try {
      // Group updates into batches of 10 to avoid quota limits
      const batchSize = 10;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        
        const requests = batch.map(update => ({
          range: `${sheetName}!A${update.rowIndex}`,
          values: [[update.id]]
        }));

        await this.sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
          requestBody: {
            valueInputOption: 'RAW',
            data: requests
          }
        });

        // Add delay between batches to respect rate limits
        if (i + batchSize < updates.length) {
          await this.delay(1000); // 1 second delay between batches
        }
      }
    } catch (error) {
      console.error('Error batch updating sheet IDs:', error);
      // Don't throw error - this is not critical for the main operation
    }
  }

  private async initializeClients() {
    try {
      this.sheets = await getGoogleSheetsClient();
      this.db = await getDatabase();
    } catch (error) {
      console.error('Error initializing Google Sheets sync:', error);
    }
  }

  // Ensure sheet exists with proper headers
  private async ensureSheetExists(sheetName: string, type: 'basic' | 'teams' | 'candidates' | 'programmes' | 'results') {
    try {
      if (!this.sheets) await this.initializeClients();

      console.log(`Checking if sheet "${sheetName}" exists in spreadsheet: ${SPREADSHEET_CONFIG.SPREADSHEET_ID}`);

      // Check if sheet exists
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
      });

      const sheetExists = spreadsheet.data.sheets?.some((sheet: any) =>
        sheet.properties.title === sheetName
      );

      if (!sheetExists) {
        console.log(`Creating new sheet: ${sheetName}`);

        // Create the sheet
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
          requestBody: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName,
                }
              }
            }]
          }
        });

        // Add headers
        const headers = getSheetHeaders(type);
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
          range: `${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers]
          }
        });

        console.log(`Successfully created sheet "${sheetName}" with headers`);
      } else {
        console.log(`Sheet "${sheetName}" already exists`);
      }
    } catch (error) {
      console.error(`Error ensuring sheet ${sheetName} exists:`, error);
      throw error;
    }
  }

  // Sync data from MongoDB to Google Sheets
  async syncToSheets(type: 'basic' | 'teams' | 'candidates' | 'programmes' | 'results', data?: any[]) {
    try {
      if (!this.sheets || !this.db) await this.initializeClients();

      const sheetName = SPREADSHEET_CONFIG.SHEETS[type.toUpperCase() as keyof typeof SPREADSHEET_CONFIG.SHEETS];
      await this.ensureSheetExists(sheetName, type);

      // Get data from MongoDB if not provided
      if (!data) {
        const collection = this.db.collection(type);
        data = await collection.find({}).toArray();
      }

      // Ensure data is not undefined
      if (!data) {
        data = [];
      }

      // Convert data to sheet format
      const sheetData = convertToSheetFormat(data, type);
      const headers = getSheetHeaders(type);

      // Use batch operations to reduce API calls
      const requests = [];

      // Clear existing data (except headers)
      requests.push({
        range: `${sheetName}!A2:Z`,
        values: []
      });

      // Add new data if available
      if (sheetData.length > 0) {
        requests.push({
          range: `${sheetName}!A2:${String.fromCharCode(64 + headers.length)}${sheetData.length + 1}`,
          values: sheetData
        });
      }

      // Execute batch update
      await this.sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
        requestBody: {
          valueInputOption: 'RAW',
          data: requests
        }
      });

      console.log(`Successfully synced ${data?.length || 0} ${type} records to Google Sheets`);
      return { success: true, count: data?.length || 0 };
    } catch (error) {
      console.error(`Error syncing ${type} to sheets:`, error);
      throw error;
    }
  }

  // Sync data from Google Sheets to MongoDB
  async syncFromSheets(type: 'basic' | 'teams' | 'candidates' | 'programmes' | 'results') {
    try {
      if (!this.sheets || !this.db) await this.initializeClients();

      const sheetName = SPREADSHEET_CONFIG.SHEETS[type.toUpperCase() as keyof typeof SPREADSHEET_CONFIG.SHEETS];

      // Get data from Google Sheets
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
        range: `${sheetName}!A2:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        console.log(`No data found in ${sheetName} sheet`);
        return { success: true, count: 0 };
      }

      const collection = this.db.collection(type);
      let updatedCount = 0;
      let insertedCount = 0;
      const sheetUpdates: { rowIndex: number, id: string }[] = [];

      for (const row of rows) {
        try {
          const record = convertFromSheetFormat(row, type);
          if (!record) {
            console.log('Skipping invalid row:', row);
            continue;
          }

          if (record._id && record._id !== '' && this.isValidObjectId(record._id)) {
            // Update existing record
            const { _id, ...updateData } = record;
            try {
              const result = await collection.updateOne(
                { _id: new ObjectId(_id) },
                { $set: { ...updateData, updatedAt: new Date() } }
              );
              if (result.modifiedCount > 0) updatedCount++;
            } catch (updateError) {
              console.error('Error updating record with ID:', _id, updateError);
              // If update fails, treat as new record
              const { _id: ignoredId, ...insertData } = record;
              const insertResult = await collection.insertOne({
                ...insertData,
                createdAt: new Date(),
                updatedAt: new Date()
              });
              if (insertResult.insertedId) {
                insertedCount++;
                // Queue for batch update
                const rowIndex = rows.indexOf(row) + 2;
                sheetUpdates.push({ rowIndex, id: insertResult.insertedId.toString() });
              }
            }
          } else {
            // Insert new record
            const { _id, ...insertData } = record;
            const result = await collection.insertOne({
              ...insertData,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            if (result.insertedId) {
              insertedCount++;
              // Queue for batch update
              const rowIndex = rows.indexOf(row) + 2; // +2 because sheets are 1-indexed and we skip header
              sheetUpdates.push({ rowIndex, id: result.insertedId.toString() });
            }
          }

          // Add small delay between database operations to avoid overwhelming the system
          if ((updatedCount + insertedCount) % 10 === 0) {
            await this.delay(100); // 100ms delay every 10 operations
          }
        } catch (rowError) {
          console.error('Error processing row:', row, rowError);
          // Continue with next row
          continue;
        }
      }

      // Skip sheet ID updates to avoid quota issues
      // The data is imported to MongoDB successfully, which is the primary goal
      if (sheetUpdates.length > 0) {
        console.log(`Skipping ${sheetUpdates.length} sheet ID updates to avoid quota limits`);
        console.log('Data successfully imported to MongoDB. Sheet IDs can be updated later if needed.');
      }

      console.log(`Successfully synced from Google Sheets: ${insertedCount} inserted, ${updatedCount} updated`);
      return { success: true, inserted: insertedCount, updated: updatedCount };
    } catch (error) {
      console.error(`Error syncing ${type} from sheets:`, error);
      throw error;
    }
  }

  // Add a single record to both MongoDB and Google Sheets
  async addRecord(type: 'basic' | 'teams' | 'candidates' | 'programmes' | 'results', data: any) {
    try {
      if (!this.db) await this.initializeClients();

      // Insert to MongoDB first
      const collection = this.db.collection(type);
      const result = await collection.insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      if (result.insertedId) {
        // Add to Google Sheets
        const recordWithId = { ...data, _id: result.insertedId };
        await this.addToSheet(type, recordWithId);

        return { success: true, id: result.insertedId };
      }

      throw new Error('Failed to insert record to MongoDB');
    } catch (error) {
      console.error(`Error adding ${type} record:`, error);
      throw error;
    }
  }

  // Add record to Google Sheets
  private async addToSheet(type: 'basic' | 'teams' | 'candidates' | 'programmes' | 'results', data: any) {
    try {
      if (!this.sheets) await this.initializeClients();

      const sheetName = SPREADSHEET_CONFIG.SHEETS[type.toUpperCase() as keyof typeof SPREADSHEET_CONFIG.SHEETS];

      // Check if spreadsheet ID is configured
      if (!SPREADSHEET_CONFIG.SPREADSHEET_ID) {
        throw new Error('Google Spreadsheet ID is not configured. Please set GOOGLE_SPREADSHEET_ID in your environment variables.');
      }

      console.log(`Adding record to ${sheetName} sheet in spreadsheet: ${SPREADSHEET_CONFIG.SPREADSHEET_ID}`);

      await this.ensureSheetExists(sheetName, type);

      const sheetData = convertToSheetFormat([data], type);

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_CONFIG.SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: sheetData
        }
      });

      console.log(`Successfully added record to ${sheetName} sheet`);
    } catch (error) {
      console.error(`Error adding record to ${type} sheet:`, error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('404') || error.message.includes('not found')) {
          throw new Error(`Spreadsheet not found. Please check: 1) Spreadsheet ID is correct, 2) Spreadsheet is shared with service account: ${process.env.GOOGLE_CLIENT_EMAIL}`);
        } else if (error.message.includes('403') || error.message.includes('permission')) {
          throw new Error(`Permission denied. Please share the spreadsheet with service account: ${process.env.GOOGLE_CLIENT_EMAIL} with Editor permissions.`);
        }
      }

      throw error;
    }
  }

  // Update a record in both MongoDB and Google Sheets
  async updateRecord(type: 'basic' | 'teams' | 'candidates' | 'programmes' | 'results', id: string, data: any) {
    try {
      if (!this.db) await this.initializeClients();

      // Update MongoDB
      const collection = this.db.collection(type);
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updatedAt: new Date() } }
      );

      if (result.modifiedCount > 0) {
        // Update Google Sheets
        await this.syncToSheets(type);
        return { success: true };
      }

      throw new Error('Failed to update record in MongoDB');
    } catch (error) {
      console.error(`Error updating ${type} record:`, error);
      throw error;
    }
  }

  // Delete a record from both MongoDB and Google Sheets
  async deleteRecord(type: 'basic' | 'teams' | 'candidates' | 'programmes' | 'results', id: string) {
    try {
      if (!this.db) await this.initializeClients();

      // Delete from MongoDB
      const collection = this.db.collection(type);
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount > 0) {
        // Sync to Google Sheets (this will remove the deleted record)
        await this.syncToSheets(type);
        return { success: true };
      }

      throw new Error('Failed to delete record from MongoDB');
    } catch (error) {
      console.error(`Error deleting ${type} record:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const sheetsSync = new GoogleSheetsSync();