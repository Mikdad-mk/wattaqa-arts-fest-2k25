import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function GalleryPage() {
  return (
    <>
      <Breadcrumb pageName="Gallery" />

      <div className="space-y-6">
        {/* Upload New Images */}
        <ShowcaseSection title="Upload New Images">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Festival Images</h3>
              <p className="text-gray-600 mb-4">Drag and drop images here, or click to select files</p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                Select Images
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select category</option>
                  <option value="events">Events</option>
                  <option value="teams">Teams</option>
                  <option value="performances">Performances</option>
                  <option value="awards">Awards</option>
                  <option value="behind-scenes">Behind the Scenes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event/Team
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                  <option value="">Select event or team</option>
                  <option value="singing">Singing Competition</option>
                  <option value="dance">Dance Performance</option>
                  <option value="sumud">Team Sumud</option>
                  <option value="aqsa">Team Aqsa</option>
                  <option value="inthifada">Team Inthifada</option>
                </select>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* Gallery Categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-center transform hover:scale-105">
            <div className="text-3xl mb-2">🎭</div>
            <h3 className="font-bold text-gray-900 text-sm">All Images</h3>
            <p className="text-xs text-purple-600 font-medium">248 photos</p>
          </button>
          <button className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-center transform hover:scale-105">
            <div className="text-3xl mb-2">🎪</div>
            <h3 className="font-bold text-gray-900 text-sm">Events</h3>
            <p className="text-xs text-blue-600 font-medium">156 photos</p>
          </button>
          <button className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 text-center transform hover:scale-105">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-gray-900 text-sm">Teams</h3>
            <p className="text-xs text-green-600 font-medium">45 photos</p>
          </button>
          <button className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 text-center transform hover:scale-105">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-bold text-gray-900 text-sm">Awards</h3>
            <p className="text-xs text-yellow-600 font-medium">32 photos</p>
          </button>
          <button className="p-4 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 text-center transform hover:scale-105">
            <div className="text-3xl mb-2">🎬</div>
            <h3 className="font-bold text-gray-900 text-sm">Behind Scenes</h3>
            <p className="text-xs text-red-600 font-medium">15 photos</p>
          </button>
        </div>

        {/* Recent Images */}
        <ShowcaseSection title="Recent Images">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Mock Image Cards */}
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="group relative">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <span className="text-gray-600 text-2xl">📷</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button className="bg-white text-gray-900 p-2 rounded-lg text-sm hover:bg-gray-100">
                      View
                    </button>
                    <button className="bg-white text-gray-900 p-2 rounded-lg text-sm hover:bg-gray-100">
                      Edit
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">Event Image {index + 1}</p>
                  <p className="text-xs text-gray-600">March {15 + index}, 2025</p>
                </div>
              </div>
            ))}
          </div>
        </ShowcaseSection>

        {/* Gallery Management */}
        <ShowcaseSection title="Gallery Management">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Total Images</h3>
              <p className="text-2xl font-bold text-gray-900">248</p>
              <p className="text-sm text-gray-600">Across all categories</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">💾</div>
              <h3 className="font-semibold text-gray-900 mb-2">Storage Used</h3>
              <p className="text-2xl font-bold text-gray-900">2.4 GB</p>
              <p className="text-sm text-gray-600">of 10 GB available</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="font-semibold text-gray-900 mb-2">Last Upload</h3>
              <p className="text-2xl font-bold text-gray-900">Today</p>
              <p className="text-sm text-gray-600">15 new images</p>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors">
              Bulk Upload
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors">
              Export Gallery
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors">
              Manage Albums
            </button>
          </div>
        </ShowcaseSection>
      </div>
    </>
  );
}