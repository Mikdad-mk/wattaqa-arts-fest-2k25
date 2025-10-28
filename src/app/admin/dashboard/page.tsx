export default function DashboardPage() {
  return (
    <div className="space-y-8 bg-white min-h-screen"
         style={{
           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
           backgroundSize: '40px 40px'
         }}>
      
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-3xl p-8 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <span className="text-white text-xl font-bold">🎭</span>
              </div>
              <span className="text-blue-600 text-sm font-semibold">Festival Management</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Festival 2K25
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Dashboard
              </span>
            </h1>
            <p className="text-blue-700 text-lg font-medium">
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
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-15"></div>
      </div>
      
      {/* Festival Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">👥</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">135</p>
              <p className="text-green-700 font-medium text-sm">Students</p>
            </div>
          </div>
          <p className="text-green-600 font-semibold">Total Students</p>
          <p className="text-green-600 text-sm mt-1">All teams registered</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🎨</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">200+</p>
              <p className="text-blue-700 font-medium text-sm">Programs</p>
            </div>
          </div>
          <p className="text-blue-600 font-semibold">Total Programs</p>
          <p className="text-blue-600 text-sm mt-1">Arts & Sports events</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🏆</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-600">3</p>
              <p className="text-red-700 font-medium text-sm">Teams</p>
            </div>
          </div>
          <p className="text-red-600 font-semibold">Active Teams</p>
          <p className="text-red-600 text-sm mt-1">Sumud • Aqsa • Inthifada</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🎪</span>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-purple-600">Active</p>
              <p className="text-purple-700 font-medium text-sm">Status</p>
            </div>
          </div>
          <p className="text-purple-600 font-semibold">Festival Status</p>
          <p className="text-purple-600 text-sm mt-1">Festival 2K25 in progress</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white text-lg">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700">Quick Actions</h3>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 group transform hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">➕</span>
                </div>
                <div>
                  <p className="font-bold text-purple-700">Add New Program</p>
                  <p className="text-purple-600 text-sm font-medium">Register arts or sports event</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group transform hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">📊</span>
                </div>
                <div>
                  <p className="font-bold text-blue-700">Team Performance</p>
                  <p className="text-blue-600 text-sm font-medium">Check team scores and rankings</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-4 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 hover:border-red-300 hover:shadow-lg transition-all duration-200 group transform hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">📧</span>
                </div>
                <div>
                  <p className="font-bold text-red-700">Send Updates</p>
                  <p className="text-red-600 text-sm font-medium">Notify students and teams</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-6 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white text-lg">📈</span>
            </div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-600">Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-green-700">Team Sumud registered</p>
                <p className="text-green-600 text-sm font-medium">45 students joined Team Sumud</p>
                <p className="text-green-500 text-xs mt-1 font-medium">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm">🎨</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-blue-700">New art program added</p>
                <p className="text-blue-600 text-sm font-medium">Digital Art Competition scheduled</p>
                <p className="text-blue-500 text-xs mt-1 font-medium">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm">⚽</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-red-700">Sports schedule updated</p>
                <p className="text-red-600 text-sm font-medium">Football tournament times revised</p>
                <p className="text-red-500 text-xs mt-1 font-medium">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Management Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white text-lg">👥</span>
            </div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Team Management</h3>
          </div>
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Manage Teams
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h4 className="text-lg font-bold text-green-700 mb-2">Team Sumud</h4>
            <p className="text-green-600 text-sm mb-3 font-medium">Arts & Sports Excellence</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">Students:</span>
                <span className="text-green-700 font-bold">45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">Programs:</span>
                <span className="text-green-700 font-bold">8</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h4 className="text-lg font-bold text-blue-700 mb-2">Team Aqsa</h4>
            <p className="text-blue-600 text-sm mb-3 font-medium">Creative & Athletic</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-600 font-medium">Students:</span>
                <span className="text-blue-700 font-bold">45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600 font-medium">Programs:</span>
                <span className="text-blue-700 font-bold">8</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-rose-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <h4 className="text-lg font-bold text-red-700 mb-2">Team Inthifada</h4>
            <p className="text-red-600 text-sm mb-3 font-medium">Innovation & Competition</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-red-600 font-medium">Students:</span>
                <span className="text-red-700 font-bold">45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-600 font-medium">Programs:</span>
                <span className="text-red-700 font-bold">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}