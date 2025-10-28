'use client';

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function TeamsPage() {

  return (
    <>
      <Breadcrumb pageName="Teams" />

      <div className="space-y-6">
        {/* Fixed Teams Information */}
        <ShowcaseSection title="Fixed Festival Teams">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-red-800 mb-2">🔒 Teams are Fixed - No Google Sheets Sync</h4>
            <p className="text-sm text-red-700">
              The three festival teams are permanently configured and do not sync with Google Sheets. 
              Only team captains can be updated through the admin panel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">SMD</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">SUMUD</h4>
                  <p className="text-xs text-gray-500 font-medium">Code: SMD</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Team Sumud - Steadfastness and Perseverance</p>
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700 font-medium">Green Team</span>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">INT</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">INTIFADA</h4>
                  <p className="text-xs text-gray-500 font-medium">Code: INT</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Team Intifada - Uprising and Resistance</p>
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-700 font-medium">Red Team</span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">AQS</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">AQSA</h4>
                  <p className="text-xs text-gray-500 font-medium">Code: AQS</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Team Aqsa - Sacred and Noble</p>
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                <span className="text-sm text-gray-700 font-medium">Black Team</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Team Code Mapping</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <span className="font-bold text-blue-800">SMD</span>
                <span className="mx-2 text-blue-600">→</span>
                <span className="font-bold text-blue-800">SUMUD</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-blue-800">INT</span>
                <span className="mx-2 text-blue-600">→</span>
                <span className="font-bold text-blue-800">INTIFADA</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-blue-800">AQS</span>
                <span className="mx-2 text-blue-600">→</span>
                <span className="font-bold text-blue-800">AQSA</span>
              </div>
            </div>
          </div>
        </ShowcaseSection>



        {/* Sync Configuration */}
        <ShowcaseSection title="Sync Configuration & Data Sources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Fixed Teams */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🔒</span>
                <h4 className="font-medium text-red-800">Fixed Teams (No Sync)</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700 font-medium">SMD → SUMUD</span>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Fixed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700 font-medium">INT → INTIFADA</span>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Fixed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700 font-medium">AQS → AQSA</span>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Fixed</span>
                </div>
              </div>
              <p className="text-xs text-red-600 mt-3 font-medium">
                ❌ These teams do NOT sync with Google Sheets
              </p>
            </div>

            {/* Synced Data */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🔄</span>
                <h4 className="font-medium text-green-800">Synced Data</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 font-medium">Candidates</span>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Syncs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 font-medium">Programmes</span>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Syncs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 font-medium">Results</span>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Syncs</span>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-3 font-medium">
                ✅ These sync bidirectionally with Google Sheets
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-3">📊 How Team Statistics Work</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xs font-bold">👥</span>
                </div>
                <p className="font-medium text-yellow-800">Member Counts</p>
                <p className="text-yellow-700">Auto-calculated from Candidates data (synced)</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xs font-bold">🏆</span>
                </div>
                <p className="font-medium text-yellow-800">Team Points</p>
                <p className="text-yellow-700">Auto-calculated from Results data (synced)</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xs font-bold">👑</span>
                </div>
                <p className="font-medium text-yellow-800">Team Captains</p>
                <p className="text-yellow-700">Managed manually (admin panel only)</p>
              </div>
            </div>
          </div>
        </ShowcaseSection>
      </div>
    </>
  );
}