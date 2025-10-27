export default function DashboardPage() {
  return (
    <div className="space-y-8 bg-white min-h-screen"
         style={{
           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
           backgroundSize: '40px 40px'
         }}>
      
      {/* Header Section */}
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">🎭</span>
              </div>
              <span className="text-gray-600 text-sm font-medium">Festival Management</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-2">
              Festival 2K25
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                Dashboard
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Arts & Sports Festival Management System
            </p>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white"></div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full border-2 border-white"></div>
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-rose-400 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-gray-600 text-sm">3 Active Teams</span>
          </div>
        </div>
        
        {/* Decorative Element */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-10"></div>
      </div>
      
      {/* Festival Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">👥</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">135</p>
              <p className="text-green-700 font-medium text-sm">Students</p>
            </div>
          </div>
          <p className="text-green-600 font-semibold">Total Students</p>
          <p className="text-green-600 text-sm mt-1">All teams registered</p>
          <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🎨</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">200+</p>
              <p className="text-blue-700 font-medium text-sm">Programs</p>
            </div>
          </div>
          <p className="text-blue-600 font-semibold">Total Programs</p>
          <p className="text-blue-600 text-sm mt-1">Arts & Sports events</p>
          <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🏆</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-purple-600">3</p>
              <p className="text-purple-700 font-medium text-sm">Teams</p>
            </div>
          </div>
          <p className="text-purple-600 font-semibold">Active Teams</p>
          <p className="text-purple-600 text-sm mt-1">Sumud • Aqsa • Inthifada</p>
          <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🎪</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-600">Active</p>
              <p className="text-orange-700 font-medium text-sm">Status</p>
            </div>
          </div>
          <p className="text-orange-600 font-semibold">Festival Status</p>
          <p className="text-orange-600 text-sm mt-1">Festival 2K25 in progress</p>
          <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* Quick Actions */}
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 relative overflow-hidden">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">⚡</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="space-y-4">
            <button className="w-full text-left p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">➕</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Add New Program</p>
                  <p className="text-purple-600 font-medium">Register arts or sports event</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">📊</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Team Performance</p>
                  <p className="text-blue-600 font-medium">Check team scores and rankings</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300 transition-all duration-300 transform hover:scale-105 group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">📧</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Send Updates</p>
                  <p className="text-green-600 font-medium">Notify students and teams</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 relative overflow-hidden">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">📈</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Team Sumud registered</p>
                <p className="text-green-600 font-medium text-sm">45 students joined Team Sumud</p>
                <p className="text-gray-500 text-xs mt-1">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🎨</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">New art program added</p>
                <p className="text-blue-600 font-medium text-sm">Digital Art Competition scheduled</p>
                <p className="text-gray-500 text-xs mt-1">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">⚽</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Sports schedule updated</p>
                <p className="text-red-600 font-medium text-sm">Football tournament times revised</p>
                <p className="text-gray-500 text-xs mt-1">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Management Section */}
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">👥</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Team Management</h3>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-full text-sm transition-all duration-300 transform hover:scale-105 shadow-lg">
            Manage Teams
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Team Sumud</h4>
            <p className="text-green-600 font-medium mb-3">Arts & Sports Excellence</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="text-green-600 font-bold">45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Programs:</span>
                <span className="text-green-600 font-bold">8</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Team Aqsa</h4>
            <p className="text-blue-600 font-medium mb-3">Creative & Athletic</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="text-blue-600 font-bold">45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Programs:</span>
                <span className="text-blue-600 font-bold">8</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Team Inthifada</h4>
            <p className="text-red-600 font-medium mb-3">Innovation & Competition</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="text-red-600 font-bold">45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Programs:</span>
                <span className="text-red-600 font-bold">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}