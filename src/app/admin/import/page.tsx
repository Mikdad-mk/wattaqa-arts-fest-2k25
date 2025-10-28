'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

interface SheetAnalysis {
  name: string;
  rowCount: number;
  columnCount: number;
  headers: string[];
  dataRowCount: number;
  sampleData: string[][];
  isEmpty: boolean;
  hasHeaders: boolean;
}

interface SpreadsheetAnalysis {
  title: string;
  sheets: SheetAnalysis[];
}

export default function ImportPage() {
  const [analysis, setAnalysis] = useState<SpreadsheetAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);
  const [mappings, setMappings] = useState<{ [sheetName: string]: { [ourField: string]: string } }>({});

  // Field mappings for different data types
  const fieldMappings = {
    teams: {
      name: 'Team Name',
      color: 'Color',
      description: 'Description', 
      captain: 'Captain',
      members: 'Members',
      points: 'Points'
    },
    candidates: {
      chestNumber: 'Chest Number',
      name: 'Name',
      team: 'Team',
      section: 'Section',
      points: 'Points'
    },
    programmes: {
      code: 'Code',
      name: 'Programme Name',
      category: 'Category',
      section: 'Section',
      positionType: 'Position Type',
      status: 'Status'
    }
  };

  // Analyze spreadsheet
  const analyzeSpreadsheet = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analyze-sheets');
      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.spreadsheet);
        
        // Initialize mappings for each sheet
        const initialMappings: { [sheetName: string]: { [ourField: string]: string } } = {};
        data.spreadsheet.sheets.forEach((sheet: SheetAnalysis) => {
          initialMappings[sheet.name] = {};
        });
        setMappings(initialMappings);
      } else {
        alert(`Error: ${data.error}\n\nSuggestions:\n${data.suggestions?.join('\n') || 'Check your configuration'}`);
      }
    } catch (error) {
      console.error('Error analyzing spreadsheet:', error);
      alert('Failed to analyze spreadsheet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzeSpreadsheet();
  }, []);

  // Update field mapping
  const updateMapping = (sheetName: string, ourField: string, sheetColumn: string) => {
    setMappings(prev => ({
      ...prev,
      [sheetName]: {
        ...prev[sheetName],
        [ourField]: sheetColumn
      }
    }));
  };

  // Import sheet data
  const importSheetData = async (sheetName: string, dataType: 'teams' | 'candidates' | 'programmes') => {
    try {
      setImporting(sheetName);
      
      const mapping = mappings[sheetName];
      if (!mapping || Object.keys(mapping).length === 0) {
        alert('Please set up field mappings first');
        return;
      }

      // Convert data using our API
      const convertResponse = await fetch('/api/analyze-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import-sheet-data',
          sheetName,
          mapping
        })
      });

      const convertData = await convertResponse.json();
      if (!convertData.success) {
        alert(`Conversion failed: ${convertData.error}`);
        return;
      }

      // Import to MongoDB using sync API
      const importResponse = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import-converted-data',
          type: dataType,
          data: convertData.data
        })
      });

      const importResult = await importResponse.json();
      if (importResult.success) {
        alert(`Successfully imported ${convertData.data.length} ${dataType} records!`);
      } else {
        alert(`Import failed: ${importResult.error}`);
      }

    } catch (error) {
      console.error('Import error:', error);
      alert('Import failed');
    } finally {
      setImporting(null);
    }
  };

  // Auto-detect field mappings
  const autoDetectMapping = (sheetName: string, dataType: 'teams' | 'candidates' | 'programmes') => {
    const sheet = analysis?.sheets.find(s => s.name === sheetName);
    if (!sheet) return;

    const expectedFields = fieldMappings[dataType];
    const detectedMapping: { [ourField: string]: string } = {};

    // Try to match headers with expected fields
    for (const [ourField, expectedHeader] of Object.entries(expectedFields)) {
      // Look for exact match first
      let matchedHeader = sheet.headers.find(h => 
        h.toLowerCase() === expectedHeader.toLowerCase()
      );

      // If no exact match, try partial match
      if (!matchedHeader) {
        matchedHeader = sheet.headers.find(h => 
          h.toLowerCase().includes(expectedHeader.toLowerCase()) ||
          expectedHeader.toLowerCase().includes(h.toLowerCase())
        );
      }

      if (matchedHeader) {
        detectedMapping[ourField] = matchedHeader;
      }
    }

    setMappings(prev => ({
      ...prev,
      [sheetName]: detectedMapping
    }));
  };

  if (loading) {
    return (
      <>
        <Breadcrumb pageName="Import Existing Data" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Analyzing your spreadsheet...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Import Existing Data" />

      <div className="space-y-6">
        {/* Spreadsheet Overview */}
        <ShowcaseSection title={`📊 ${analysis?.title || 'Your Spreadsheet'}`}>
          {analysis ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Found {analysis.sheets.length} sheet(s) with data ready to import
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.sheets.map((sheet) => (
                  <div key={sheet.name} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">📋 {sheet.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Headers: {sheet.headers.length}</p>
                      <p>Data Rows: {sheet.dataRowCount}</p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        sheet.dataRowCount > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {sheet.dataRowCount > 0 ? '✓ Has Data' : 'ℹ️ Empty'}
                      </div>
                    </div>
                    
                    {sheet.headers.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Headers:</p>
                        <div className="flex flex-wrap gap-1">
                          {sheet.headers.slice(0, 3).map((header, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">
                              {header}
                            </span>
                          ))}
                          {sheet.headers.length > 3 && (
                            <span className="text-xs text-gray-500">+{sheet.headers.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to analyze spreadsheet</p>
              <button 
                onClick={analyzeSpreadsheet}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Retry Analysis
              </button>
            </div>
          )}
        </ShowcaseSection>

        {/* Import Sheets */}
        {analysis && analysis.sheets.filter(s => s.dataRowCount > 0).map((sheet) => (
          <ShowcaseSection key={sheet.name} title={`Import ${sheet.name} Data`}>
            <div className="space-y-4">
              {/* Data Type Selection */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">1. Select Data Type</h4>
                <div className="flex gap-2">
                  {(['teams', 'candidates', 'programmes'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => autoDetectMapping(sheet.name, type)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Import as {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field Mapping */}
              {mappings[sheet.name] && Object.keys(mappings[sheet.name]).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">2. Map Fields</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(mappings[sheet.name]).map(([ourField, sheetColumn]) => (
                      <div key={ourField} className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700 w-24">
                          {ourField}:
                        </span>
                        <select
                          value={sheetColumn}
                          onChange={(e) => updateMapping(sheet.name, ourField, e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Select column</option>
                          {sheet.headers.map((header) => (
                            <option key={header} value={header}>{header}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Data Preview */}
              {sheet.sampleData.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">3. Preview Data</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {sheet.headers.map((header, idx) => (
                            <th key={idx} className="px-3 py-2 text-left font-medium text-gray-700">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sheet.sampleData.map((row, idx) => (
                          <tr key={idx} className="border-t">
                            {row.map((cell, cellIdx) => (
                              <td key={cellIdx} className="px-3 py-2 text-gray-600">
                                {cell || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Import Button */}
              {mappings[sheet.name] && Object.keys(mappings[sheet.name]).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">4. Import Data</h4>
                  <div className="flex gap-2">
                    {(['teams', 'candidates', 'programmes'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => importSheetData(sheet.name, type)}
                        disabled={importing === sheet.name}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        {importing === sheet.name ? 'Importing...' : `Import as ${type}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ShowcaseSection>
        ))}

        {/* Instructions */}
        <ShowcaseSection title="How to Import Your Data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Step-by-Step Process</h4>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Choose what type of data each sheet contains (Teams, Candidates, or Programmes)</li>
                <li>Map your sheet columns to our system fields</li>
                <li>Preview the data to make sure mapping is correct</li>
                <li>Click import to add the data to your database</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">After Import</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Your existing data will be available in the admin panel</li>
                <li>• Future changes in admin panel will sync to Google Sheets</li>
                <li>• You can edit data in Google Sheets and sync back</li>
                <li>• Bidirectional sync will be fully enabled</li>
              </ul>
            </div>
          </div>
        </ShowcaseSection>
      </div>
    </>
  );
}