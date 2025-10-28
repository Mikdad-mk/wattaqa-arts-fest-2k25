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

export default function SyncPage() {
  const [config, setConfig] = useState<SyncConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<{ [key: string]: string }>({});

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

  // Handle sync operations
  const handleSync = async (action: 'sync-to-sheets' | 'sync-from-sheets', type: string) => {
    const syncKey = `${action}-${type}`;
    
    try {
      setSyncing(syncKey);
      
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, type }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        setLastSync(prev => ({
          ...prev,
          [syncKey]: new Date().toLocaleString()
        }));
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Sync failed: Network error');
    } finally {
      setSyncing(null);
    }
  };

  if (loading) {
    return (
      <>
        <Breadcrumb pageName="Google Sheets Sync" />
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
      <Breadcrumb pageName="Google Sheets Sync" />

      <div className="space-y-6">
        {/* Configuration Status */}
        <ShowcaseSection title="Sync Configuration">
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
                  <code className="text-sm text-gray-700">
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
                  {config?.availableTypes.map((type) => (
                    <span 
                      key={type}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sync Actions
                </label>
                <div className="flex flex-wrap gap-2">
                  {config?.syncActions.map((action) => (
                    <span 
                      key={action}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {!config?.sheetsConfigured && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Setup Required</h4>
              <p className="text-sm text-yellow-700 mb-3">
                To enable Google Sheets integration, you need to configure the following environment variables:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <code>GOOGLE_SPREADSHEET_ID</code> - Your Google Spreadsheet ID</li>
                <li>• <code>GOOGLE_CLIENT_EMAIL</code> - Service account email</li>
                <li>• <code>GOOGLE_PRIVATE_KEY</code> - Service account private key</li>
                <li>• <code>GOOGLE_PROJECT_ID</code> - Google Cloud project ID</li>
              </ul>
            </div>
          )}
        </ShowcaseSection>

        {/* Sync Operations */}
        {config?.sheetsConfigured && (
          <>
            {/* Sync to Google Sheets */}
            <ShowcaseSection title="Sync to Google Sheets">
              <p className="text-gray-600 mb-4">
                Push data from MongoDB to Google Sheets. This will overwrite existing data in the sheets.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.availableTypes.map((type) => (
                  <div key={type} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </h4>
                    <button
                      onClick={() => handleSync('sync-to-sheets', type)}
                      disabled={syncing === `sync-to-sheets-${type}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                    >
                      {syncing === `sync-to-sheets-${type}` ? 'Syncing...' : 'Sync to Sheets'}
                    </button>
                    {lastSync[`sync-to-sheets-${type}`] && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last sync: {lastSync[`sync-to-sheets-${type}`]}
                      </p>
                    )}
                  </div>
                ))}
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">All Data</h4>
                  <button
                    onClick={() => handleSync('sync-to-sheets', 'all')}
                    disabled={syncing === 'sync-to-sheets-all'}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    {syncing === 'sync-to-sheets-all' ? 'Syncing...' : 'Sync All to Sheets'}
                  </button>
                  {lastSync['sync-to-sheets-all'] && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last sync: {lastSync['sync-to-sheets-all']}
                    </p>
                  )}
                </div>
              </div>
            </ShowcaseSection>

            {/* Sync from Google Sheets */}
            <ShowcaseSection title="Sync from Google Sheets">
              <p className="text-gray-600 mb-4">
                Pull data from Google Sheets to MongoDB. This will update existing records and add new ones.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.availableTypes.map((type) => (
                  <div key={type} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </h4>
                    <button
                      onClick={() => handleSync('sync-from-sheets', type)}
                      disabled={syncing === `sync-from-sheets-${type}`}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                    >
                      {syncing === `sync-from-sheets-${type}` ? 'Syncing...' : 'Sync from Sheets'}
                    </button>
                    {lastSync[`sync-from-sheets-${type}`] && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last sync: {lastSync[`sync-from-sheets-${type}`]}
                      </p>
                    )}
                  </div>
                ))}
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">All Data</h4>
                  <button
                    onClick={() => handleSync('sync-from-sheets', 'all')}
                    disabled={syncing === 'sync-from-sheets-all'}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    {syncing === 'sync-from-sheets-all' ? 'Syncing...' : 'Sync All from Sheets'}
                  </button>
                  {lastSync['sync-from-sheets-all'] && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last sync: {lastSync['sync-from-sheets-all']}
                    </p>
                  )}
                </div>
              </div>
            </ShowcaseSection>

            {/* Instructions */}
            <ShowcaseSection title="How It Works">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Automatic Sync</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• When you add/edit/delete data in the admin panel, it automatically syncs to Google Sheets</li>
                    <li>• Each data type gets its own sheet (Teams, Candidates, Programmes)</li>
                    <li>• MongoDB ObjectIDs are preserved for data integrity</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Manual Sync</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Use "Sync to Sheets" to push current MongoDB data to Google Sheets</li>
                    <li>• Use "Sync from Sheets" to pull changes made directly in Google Sheets</li>
                    <li>• You can edit data directly in Google Sheets and sync back to MongoDB</li>
                  </ul>
                </div>
              </div>
            </ShowcaseSection>
          </>
        )}
      </div>
    </>
  );
}