'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

interface SyncConfig {
  spreadsheetId: string;
  sheetsConfigured: boolean;
  availableTypes: string[];
  syncActions: string[];
}

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

interface SyncResult {
  success: boolean;
  message?: string;
  error?: string;
  imported?: number;
  skipped?: number;
  total?: number;
  count?: number;
  timestamp: string;
}

export default function DataImportPage() {
  const [config, setConfig] = useState<SyncConfig | null>(null);
  const [analysis, setAnalysis] = useState<SpreadsheetAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [results, setResults] = useState<{ [key: string]: SyncResult }>({});
  const [mappings, setMappings] = useState<{ [sheetName: string]: { [ourField: string]: string } }>({});
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced' | 'custom'>('simple');

  const dataTypes = [
    { key: 'basic', label: 'Festival Info', icon: '🏛️', description: 'Basic festival information and settings' },
    { key: 'candidates', label: 'Candidates', icon: '👥', description: 'Participant information and details' },
    { key: 'programmes', label: 'Programmes', icon: '📋', description: 'Event programmes and activities' },
    { key: 'results', label: 'Results', icon: '🥇', description: 'Competition results and winners' }
  ];

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

  // Fetch sync configuration
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sync');
      const data = await response.json();
      
      if (data.success) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Error fetching sync config:', error);
    } finally {
      setLoading(false);
    }
  };

  // Analyze spreadsheet
  const analyzeSpreadsheet = async () => {
    try {
      setAnalyzing(true);
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
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Handle simple import (quota-friendly)
  const handleSimpleImport = async (type: string) => {
    const actionKey = `simple-import-${type}`;
    
    try {
      setProcessing(actionKey);
      
      const response = await fetch('/api/simple-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'import-from-sheets',
          type: type
        }),
      });

      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [actionKey]: {
          success: data.success,
          message: data.message,
          error: data.error,
          imported: data.imported,
          skipped: data.skipped,
          total: data.total,
          timestamp: new Date().toLocaleString()
        }
      }));

      if (data.success) {
        showNotification(`✅ ${data.message}`, 'success');
      }
    } catch (error) {
      console.error('Simple import error:', error);
      setResults(prev => ({
        ...prev,
        [actionKey]: {
          success: false,
          error: 'Network error',
          timestamp: new Date().toLocaleString()
        }
      }));
    } finally {
      setProcessing(null);
    }
  };

  // Handle advanced sync (with quota limits)
  const handleAdvancedSync = async (action: 'sync-to-sheets' | 'sync-from-sheets', type: string) => {
    const actionKey = `${action}-${type}`;
    
    try {
      setProcessing(actionKey);
      
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, type }),
      });

      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [actionKey]: {
          success: data.success,
          message: data.message,
          error: data.error,
          count: data.result?.count,
          timestamp: new Date().toLocaleString()
        }
      }));

      if (data.success) {
        showNotification(`✅ ${data.message}`, 'success');
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Advanced sync error:', error);
      alert('Sync failed: Network error');
    } finally {
      setProcessing(null);
    }
  };

  // Handle bulk operations
  const handleBulkImport = async () => {
    for (const dataType of dataTypes) {
      await handleSimpleImport(dataType.key);
      // Add delay between imports
      if (dataType.key !== dataTypes[dataTypes.length - 1].key) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

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

  // Import sheet data with custom mapping
  const importSheetData = async (sheetName: string, dataType: 'teams' | 'candidates' | 'programmes') => {
    try {
      setProcessing(`custom-import-${sheetName}`);
      
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
        showNotification(`Successfully imported ${convertData.data.length} ${dataType} records!`, 'success');
        setResults(prev => ({
          ...prev,
          [`custom-import-${sheetName}`]: {
            success: true,
            message: `Imported ${convertData.data.length} records`,
            imported: convertData.data.length,
            timestamp: new Date().toLocaleString()
          }
        }));
      } else {
        alert(`Import failed: ${importResult.error}`);
      }

    } catch (error) {
      console.error('Import error:', error);
      alert('Import failed');
    } finally {
      setProcessing(null);
    }
  };

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 rounded-lg shadow-lg z-50`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  if (loading) {
    return (
      <>
        <Breadcrumb pageName="Data Import - All Features" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading import configuration...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Data Import - All Features" />

      <div className="space-y-6">
        {/* Configuration Status */}
        <ShowcaseSection title="🔧 Configuration Status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Sheets Status
                </label>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  config?.sheetsConfigured 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {config?.sheetsConfigured ? '✓ Configured' : '✗ Not Configured'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spreadsheet ID
                </label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-sm text-gray-700 break-all">
                    {config?.spreadsheetId || 'Not configured'}
                  </code>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Data Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {dataTypes.map((type) => (
                    <span 
                      key={type.key}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {type.icon} {type.label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Actions
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleBulkImport}
                    disabled={processing !== null}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    🚀 Import All Data
                  </button>
                  <button
                    onClick={analyzeSpreadsheet}
                    disabled={analyzing}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    {analyzing ? 'Analyzing...' : '🔍 Analyze Sheets'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* Import Method Tabs */}
        <ShowcaseSection title="📊 Choose Import Method">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('simple')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'simple'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🚀 Simple Import (Recommended)
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'advanced'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⚡ Advanced Sync
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'custom'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎯 Custom Mapping
              </button>
            </nav>
          </div>

          {/* Simple Import Tab */}
          {activeTab === 'simple' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-2">✅ Quota-Friendly Import</h4>
                <p className="text-sm text-green-700">
                  Import data from Google Sheets to MongoDB without hitting API quota limits. 
                  Uses read-only operations that are safe for large datasets.
                </p>
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> Teams are pre-configured (SMD→SUMUD, INT→INTIFADA, AQS→AQSA) and don't need importing.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataTypes.map((dataType) => (
                  <div key={dataType.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl">{dataType.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{dataType.label}</h4>
                        <p className="text-xs text-gray-500">{dataType.description}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleSimpleImport(dataType.key)}
                      disabled={processing === `simple-import-${dataType.key}`}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                    >
                      {processing === `simple-import-${dataType.key}` ? 'Importing...' : `Import ${dataType.label}`}
                    </button>

                    {/* Show results */}
                    {results[`simple-import-${dataType.key}`] && (
                      <div className="mt-3 p-3 rounded-lg text-sm">
                        {results[`simple-import-${dataType.key}`].success ? (
                          <div className="bg-green-50 border border-green-200 text-green-800">
                            <p className="font-medium">✅ Success!</p>
                            <p>Imported: {results[`simple-import-${dataType.key}`].imported}</p>
                            {results[`simple-import-${dataType.key}`].skipped! > 0 && (
                              <p>Skipped: {results[`simple-import-${dataType.key}`].skipped}</p>
                            )}
                            <p className="text-xs mt-1">{results[`simple-import-${dataType.key}`].timestamp}</p>
                          </div>
                        ) : (
                          <div className="bg-red-50 border border-red-200 text-red-800">
                            <p className="font-medium">❌ Error</p>
                            <p>{results[`simple-import-${dataType.key}`].error}</p>
                            <p className="text-xs mt-1">{results[`simple-import-${dataType.key}`].timestamp}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Sync Tab */}
          {activeTab === 'advanced' && config?.sheetsConfigured && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Quota-Limited Operations</h4>
                <p className="text-sm text-yellow-700">
                  These operations use Google Sheets write APIs and may hit quota limits with large datasets. 
                  Use sparingly and wait between operations.
                </p>
              </div>

              {/* Push to Google Sheets */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">📤 Push Data to Google Sheets</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataTypes.map((dataType) => (
                    <div key={dataType.key} className="border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xl">{dataType.icon}</span>
                        <h5 className="font-medium text-gray-900">{dataType.label}</h5>
                      </div>
                      
                      <button
                        onClick={() => handleAdvancedSync('sync-to-sheets', dataType.key)}
                        disabled={processing === `sync-to-sheets-${dataType.key}`}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                      >
                        {processing === `sync-to-sheets-${dataType.key}` ? 'Pushing...' : 'Push to Sheets'}
                      </button>

                      {results[`sync-to-sheets-${dataType.key}`] && (
                        <div className="mt-2 text-xs">
                          {results[`sync-to-sheets-${dataType.key}`].success ? (
                            <p className="text-green-600">✅ {results[`sync-to-sheets-${dataType.key}`].timestamp}</p>
                          ) : (
                            <p className="text-red-600">❌ {results[`sync-to-sheets-${dataType.key}`].timestamp}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pull from Google Sheets */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">📥 Pull Data from Google Sheets</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataTypes.map((dataType) => (
                    <div key={dataType.key} className="border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xl">{dataType.icon}</span>
                        <h5 className="font-medium text-gray-900">{dataType.label}</h5>
                      </div>
                      
                      <button
                        onClick={() => handleAdvancedSync('sync-from-sheets', dataType.key)}
                        disabled={processing === `sync-from-sheets-${dataType.key}`}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                      >
                        {processing === `sync-from-sheets-${dataType.key}` ? 'Pulling...' : 'Pull from Sheets'}
                      </button>

                      {results[`sync-from-sheets-${dataType.key}`] && (
                        <div className="mt-2 text-xs">
                          {results[`sync-from-sheets-${dataType.key}`].success ? (
                            <p className="text-green-600">✅ {results[`sync-from-sheets-${dataType.key}`].timestamp}</p>
                          ) : (
                            <p className="text-red-600">❌ {results[`sync-from-sheets-${dataType.key}`].timestamp}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Custom Mapping Tab */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-800 mb-2">🎯 Custom Field Mapping</h4>
                <p className="text-sm text-purple-700">
                  Import data from any sheet structure by mapping your columns to our system fields. 
                  Perfect for existing spreadsheets with different column names.
                </p>
              </div>

              {!analysis ? (
                <div className="text-center py-8">
                  <button
                    onClick={analyzeSpreadsheet}
                    disabled={analyzing}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-lg"
                  >
                    {analyzing ? 'Analyzing...' : '🔍 Analyze Spreadsheet Structure'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Spreadsheet Overview */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">📊 {analysis.title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {analysis.sheets.map((sheet) => (
                        <div key={sheet.name} className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">📋 {sheet.name}</h5>
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

                  {/* Import Sheets with Custom Mapping */}
                  {analysis.sheets.filter(s => s.dataRowCount > 0).map((sheet) => (
                    <div key={sheet.name} className="border border-purple-200 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Import {sheet.name} Data</h4>
                      
                      {/* Data Type Selection */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">1. Select Data Type</h5>
                        <div className="flex gap-2">
                          {(['teams', 'candidates', 'programmes'] as const).map((type) => (
                            <button
                              key={type}
                              onClick={() => autoDetectMapping(sheet.name, type)}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                            >
                              Import as {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Field Mapping */}
                      {mappings[sheet.name] && Object.keys(mappings[sheet.name]).length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">2. Map Fields</h5>
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
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">3. Preview Data</h5>
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
                                {sheet.sampleData.slice(0, 3).map((row, idx) => (
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
                          <h5 className="text-sm font-medium text-gray-700 mb-2">4. Import Data</h5>
                          <div className="flex gap-2">
                            {(['teams', 'candidates', 'programmes'] as const).map((type) => (
                              <button
                                key={type}
                                onClick={() => importSheetData(sheet.name, type)}
                                disabled={processing === `custom-import-${sheet.name}`}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm"
                              >
                                {processing === `custom-import-${sheet.name}` ? 'Importing...' : `Import as ${type}`}
                              </button>
                            ))}
                          </div>

                          {/* Show custom import results */}
                          {results[`custom-import-${sheet.name}`] && (
                            <div className="mt-3 p-3 rounded-lg text-sm">
                              {results[`custom-import-${sheet.name}`].success ? (
                                <div className="bg-green-50 border border-green-200 text-green-800">
                                  <p className="font-medium">✅ Success!</p>
                                  <p>Imported: {results[`custom-import-${sheet.name}`].imported}</p>
                                  <p className="text-xs mt-1">{results[`custom-import-${sheet.name}`].timestamp}</p>
                                </div>
                              ) : (
                                <div className="bg-red-50 border border-red-200 text-red-800">
                                  <p className="font-medium">❌ Error</p>
                                  <p>{results[`custom-import-${sheet.name}`].error}</p>
                                  <p className="text-xs mt-1">{results[`custom-import-${sheet.name}`].timestamp}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </ShowcaseSection>

        {/* Usage Guide */}
        <ShowcaseSection title="📖 Import Methods Comparison">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Simple Import */}
            <div className="border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🚀</span>
                <h4 className="font-medium text-green-800">Simple Import</h4>
              </div>
              <div className="space-y-2 text-sm text-green-700">
                <p><strong>Best for:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Initial data import</li>
                  <li>Large datasets</li>
                  <li>Daily operations</li>
                  <li>Reliable imports</li>
                </ul>
                <p><strong>Benefits:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>No quota issues</li>
                  <li>Fast and reliable</li>
                  <li>Handles blank rows</li>
                  <li>Safe for bulk data</li>
                </ul>
              </div>
            </div>

            {/* Advanced Sync */}
            <div className="border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">⚡</span>
                <h4 className="font-medium text-blue-800">Advanced Sync</h4>
              </div>
              <div className="space-y-2 text-sm text-blue-700">
                <p><strong>Best for:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Bidirectional sync</li>
                  <li>Team collaboration</li>
                  <li>Backup to sheets</li>
                  <li>Occasional updates</li>
                </ul>
                <p><strong>Caution:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Has quota limits</li>
                  <li>Use sparingly</li>
                  <li>Wait between operations</li>
                  <li>May overwrite data</li>
                </ul>
              </div>
            </div>

            {/* Custom Mapping */}
            <div className="border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🎯</span>
                <h4 className="font-medium text-purple-800">Custom Mapping</h4>
              </div>
              <div className="space-y-2 text-sm text-purple-700">
                <p><strong>Best for:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Existing spreadsheets</li>
                  <li>Different column names</li>
                  <li>Complex data structures</li>
                  <li>One-time migrations</li>
                </ul>
                <p><strong>Features:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Flexible field mapping</li>
                  <li>Auto-detection</li>
                  <li>Data preview</li>
                  <li>Custom validation</li>
                </ul>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* Recommended Workflow */}
        <ShowcaseSection title="🎯 Recommended Workflow">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Initial Setup</h4>
                <p className="text-sm text-gray-600">Use <strong>Simple Import</strong> or <strong>Custom Mapping</strong> for initial data</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Daily Operations</h4>
                <p className="text-sm text-gray-600">Use the <strong>admin panel</strong> for regular operations</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">3️⃣</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Team Updates</h4>
                <p className="text-sm text-gray-600">Use <strong>Advanced Sync</strong> to share with team</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">4️⃣</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Maintenance</h4>
                <p className="text-sm text-gray-600">Periodic sync to keep everything updated</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">💡 Pro Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Start with Simple Import</strong> - it's the most reliable method</li>
                <li>• <strong>Use Custom Mapping</strong> for existing spreadsheets with different structures</li>
                <li>• <strong>Admin panel operations</strong> don't use Google Sheets quotas</li>
                <li>• <strong>Advanced Sync</strong> is great for team collaboration but use sparingly</li>
                <li>• <strong>Wait 2-3 minutes</strong> between advanced sync operations</li>
                <li>• <strong>Always test</strong> with small datasets first</li>
              </ul>
            </div>
          </div>
        </ShowcaseSection>

        {/* Current Processing Status */}
        {processing && (
          <ShowcaseSection title="🔄 Current Operation">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div>
                  <p className="font-medium text-blue-800">Processing: {processing}</p>
                  <p className="text-sm text-blue-600">Please wait while the operation completes...</p>
                </div>
              </div>
            </div>
          </ShowcaseSection>
        )}
      </div>
    </>
  );
}