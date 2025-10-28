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

export default function SyncManagerPage() {
  const [config, setConfig] = useState<SyncConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [results, setResults] = useState<{ [key: string]: SyncResult }>({});

  const dataTypes = [
    { key: 'candidates', label: 'Candidates', icon: '👥', description: 'Participant information and details' },
    { key: 'programmes', label: 'Programmes', icon: '📋', description: 'Event programmes and activities' },
    { key: 'results', label: 'Results', icon: '🥇', description: 'Competition results and winners' }
  ];

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
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = `✅ ${data.message}`;
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
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
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = `✅ ${data.message}`;
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
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

  const handleBulkSync = async (action: 'sync-to-sheets' | 'sync-from-sheets') => {
    for (const dataType of dataTypes) {
      await handleAdvancedSync(action, dataType.key);
      // Add delay between syncs to avoid quota issues
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  };

  if (loading) {
    return (
      <>
        <Breadcrumb pageName="Sync Manager - All Features" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading sync configuration...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Sync Manager - All Features" />

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
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-700">
                    <strong>Note:</strong> Teams and Festival Info are fixed and do not sync with Google Sheets.
                  </p>
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
                    onClick={() => handleBulkSync('sync-to-sheets')}
                    disabled={processing !== null}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    📤 Push All to Sheets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* Simple Import (Recommended) */}
        <ShowcaseSection title="🚀 Simple Import (Recommended - No Quota Issues)">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-green-800 mb-2">✅ Quota-Friendly Import</h4>
            <p className="text-sm text-green-700">
              Import data from Google Sheets to MongoDB without hitting API quota limits. 
              Uses read-only operations that are safe for large datasets.
            </p>
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
        </ShowcaseSection>

        {/* Advanced Sync (Use Carefully) */}
        {config?.sheetsConfigured && (
          <ShowcaseSection title="⚠️ Advanced Sync (Use Carefully - Has Quota Limits)">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Quota-Limited Operations</h4>
              <p className="text-sm text-yellow-700">
                These operations use Google Sheets write APIs and may hit quota limits with large datasets. 
                Use sparingly and wait between operations.
              </p>
            </div>

            {/* Sync to Google Sheets */}
            <div className="mb-8">
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

            {/* Sync from Google Sheets */}
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
          </ShowcaseSection>
        )}

        {/* Usage Guide */}
        <ShowcaseSection title="📖 How to Use Each Method">
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

            {/* Push to Sheets */}
            <div className="border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">📤</span>
                <h4 className="font-medium text-blue-800">Push to Sheets</h4>
              </div>
              <div className="space-y-2 text-sm text-blue-700">
                <p><strong>Best for:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Updating Google Sheets</li>
                  <li>Sharing with team</li>
                  <li>Backup to sheets</li>
                  <li>Occasional sync</li>
                </ul>
                <p><strong>Caution:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Has quota limits</li>
                  <li>Use sparingly</li>
                  <li>Wait between operations</li>
                </ul>
              </div>
            </div>

            {/* Pull from Sheets */}
            <div className="border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">📥</span>
                <h4 className="font-medium text-purple-800">Pull from Sheets</h4>
              </div>
              <div className="space-y-2 text-sm text-purple-700">
                <p><strong>Best for:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Team made changes</li>
                  <li>Collaborative editing</li>
                  <li>External updates</li>
                  <li>Periodic sync</li>
                </ul>
                <p><strong>Caution:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Has quota limits</li>
                  <li>May overwrite data</li>
                  <li>Use with care</li>
                </ul>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* Recommended Workflow */}
        <ShowcaseSection title="🎯 Recommended Workflow">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Initial Setup</h4>
                <p className="text-sm text-gray-600">Use <strong>Simple Import</strong> to get your existing Google Sheets data into the system</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Daily Operations</h4>
                <p className="text-sm text-gray-600">Use the <strong>admin panel</strong> for regular add/edit/delete operations</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">3️⃣</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Occasional Sync</h4>
                <p className="text-sm text-gray-600">Use <strong>Advanced Sync</strong> when you need to update Google Sheets</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">💡 Pro Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Start with Simple Import</strong> to get your data in safely</li>
                <li>• <strong>Use admin panel</strong> for daily operations (no quota limits)</li>
                <li>• <strong>Push to Sheets</strong> occasionally to keep team updated</li>
                <li>• <strong>Pull from Sheets</strong> when team makes changes</li>
                <li>• <strong>Wait 2-3 minutes</strong> between advanced sync operations</li>
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