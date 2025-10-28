'use client';

import { useState } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function SimpleImportPage() {
  const [importing, setImporting] = useState<string | null>(null);
  const [results, setResults] = useState<{ [key: string]: any }>({});

  const dataTypes = [
    { key: 'basic', label: 'Festival Info', description: 'Basic festival information and settings' },
    { key: 'candidates', label: 'Candidates', description: 'Participant information' },
    { key: 'programmes', label: 'Programmes', description: 'Event programmes and activities' },
    { key: 'results', label: 'Results', description: 'Competition results and winners' }
  ];

  const handleImport = async (type: string) => {
    try {
      setImporting(type);
      
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
      
      if (data.success) {
        setResults(prev => ({
          ...prev,
          [type]: {
            success: true,
            message: data.message,
            imported: data.imported,
            skipped: data.skipped,
            total: data.total,
            timestamp: new Date().toLocaleString()
          }
        }));
      } else {
        setResults(prev => ({
          ...prev,
          [type]: {
            success: false,
            error: data.error,
            timestamp: new Date().toLocaleString()
          }
        }));
      }
    } catch (error) {
      console.error('Import error:', error);
      setResults(prev => ({
        ...prev,
        [type]: {
          success: false,
          error: 'Network error',
          timestamp: new Date().toLocaleString()
        }
      }));
    } finally {
      setImporting(null);
    }
  };

  const handleImportAll = async () => {
    for (const dataType of dataTypes) {
      await handleImport(dataType.key);
      // Add delay between imports to be extra safe with quotas
      if (dataType.key !== dataTypes[dataTypes.length - 1].key) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Simple Import (Quota-Friendly)" />

      <div className="space-y-6">
        {/* Info Section */}
        <ShowcaseSection title="📊 Quota-Friendly Import">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-blue-800 mb-2">🚀 Optimized for Google Sheets Quotas</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Read-only operations</strong> - No quota-heavy write operations</li>
              <li>• <strong>Import to database</strong> - Data goes directly to MongoDB</li>
              <li>• <strong>No sheet modifications</strong> - Avoids API write limits</li>
              <li>• <strong>Safe for large datasets</strong> - Won't hit quota limits</li>
            </ul>
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
              <p className="text-xs text-green-700">
                <strong>Teams Note:</strong> Teams are pre-configured (SMD→SUMUD, INT→INTIFADA, AQS→AQSA) and don't need importing.
              </p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleImportAll}
              disabled={importing !== null}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {importing ? 'Importing...' : 'Import All Data'}
            </button>
          </div>
        </ShowcaseSection>

        {/* Individual Import Options */}
        <ShowcaseSection title="Import Individual Data Types">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataTypes.map((dataType) => (
              <div key={dataType.key} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{dataType.label}</h4>
                <p className="text-sm text-gray-600 mb-4">{dataType.description}</p>
                
                <button
                  onClick={() => handleImport(dataType.key)}
                  disabled={importing === dataType.key}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                >
                  {importing === dataType.key ? 'Importing...' : `Import ${dataType.label}`}
                </button>

                {/* Show results */}
                {results[dataType.key] && (
                  <div className="mt-3 p-3 rounded-lg text-sm">
                    {results[dataType.key].success ? (
                      <div className="bg-green-50 border border-green-200 text-green-800">
                        <p className="font-medium">✅ Success!</p>
                        <p>Imported: {results[dataType.key].imported}</p>
                        {results[dataType.key].skipped > 0 && (
                          <p>Skipped: {results[dataType.key].skipped}</p>
                        )}
                        <p className="text-xs mt-1">{results[dataType.key].timestamp}</p>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 text-red-800">
                        <p className="font-medium">❌ Error</p>
                        <p>{results[dataType.key].error}</p>
                        <p className="text-xs mt-1">{results[dataType.key].timestamp}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ShowcaseSection>

        {/* Instructions */}
        <ShowcaseSection title="How This Works">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">✅ What This Does</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Reads data</strong> from your Google Sheets</li>
                <li>• <strong>Imports to MongoDB</strong> (your main database)</li>
                <li>• <strong>Handles duplicates</strong> intelligently</li>
                <li>• <strong>No quota issues</strong> - only uses read operations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">🎯 Best For</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Initial data import</strong> from existing sheets</li>
                <li>• <strong>Large datasets</strong> without quota concerns</li>
                <li>• <strong>One-way sync</strong> from sheets to database</li>
                <li>• <strong>Bulk operations</strong> that need to be reliable</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">💡 After Import</h4>
            <p className="text-sm text-yellow-700">
              Once your data is imported, you can use the admin panel for day-to-day operations. 
              The admin panel doesn't use Google Sheets API quotas, so you can add/edit/delete freely.
            </p>
          </div>
        </ShowcaseSection>
      </div>
    </>
  );
}