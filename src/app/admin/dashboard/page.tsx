export default function DashboardPage() {
  return (
    <div className="space-y-8">
      
      {/* Header Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">🎭</span>
              </div>
              <span className="text-gray-600 text-sm font-medium">Festival Management</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-gray-900">
              Festival 2K25 Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Arts & Sports Festival Management System
            </p>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 bg-green-500 rounded-full border-2 border-white"></div>
              <div className="w-10 h-10 bg-blue-500 rounded-full border-2 border-white"></div>
              <div className="w-10 h-10 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-gray-600 text-sm">3 Active Teams</span>
          </div>
        </div>
      </div>
      
      {/* Festival Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">👥</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">135</p>
              <p className="text-gray-600 font-medium text-sm">Students</p>
            </div>
          </div>
          <p className="text-gray-900 font-semibold">Total Students</p>
          <p className="text-gray-600 text-sm mt-1">All teams registered</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🎨</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">200+</p>
              <p className="text-gray-600 font-medium text-sm">Programs</p>
            </div>
          </div>
          <p className="text-gray-900 font-semibold">Total Programs</p>
          <p className="text-gray-600 text-sm mt-1">Arts & Sports events</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🏆</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-gray-600 font-medium text-sm">Teams</p>
            </div>
          </div>
          <p className="text-gray-900 font-semibold">Active Teams</p>
          <p className="text-gray-600 text-sm mt-1">Sumud • Aqsa • Inthifada</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🎪</span>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">Active</p>
              <p className="text-gray-600 font-medium text-sm">Status</p>
            </div>
          </div>
          <p className="text-gray-900 font-semibold">Festival Status</p>
          <p className="text-gray-600 text-sm mt-1">Festival 2K25 in progress</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">➕</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Add New Program</p>
                  <p className="text-gray-600 text-sm">Register arts or sports event</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Team Performance</p>
                  <p className="text-gray-600 text-sm">Check team scores and rankings</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📧</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Send Updates</p>
                  <p className="text-gray-600 text-sm">Notify students and teams</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">📈</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Team Sumud registered</p>
                <p className="text-gray-600 text-sm">45 students joined Team Sumud</p>
                <p className="text-gray-500 text-xs mt-1">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🎨</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">New art program added</p>
                <p className="text-gray-600 text-sm">Digital Art Competition scheduled</p>
                <p className="text-gray-500 text-xs mt-1">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⚽</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Sports schedule updated</p>
                <p className="text-gray-600 text-sm">Football tournament times revised</p>
                <p className="text-gray-500 text-xs mt-1">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Management Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">👥</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Team Management</h3>
          </div>
          <button className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200">
            Manage Teams
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:shadow-sm transition-shadow duration-200">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Team Sumud</h4>
            <p className="text-gray-600 text-sm mb-3">Arts & Sports Excellence</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="text-gray-900 font-bold">45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Programs:</span>
                <span className="text-gray-900 font-bold">8</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:shadow-sm transition-shadow duration-200">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Team Aqsa</h4>
            <p className="text-gray-600 text-sm mb-3">Creative & Athletic</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="text-gray-900 font-bold">45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Programs:</span>
                <span className="text-gray-900 font-bold">8</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:shadow-sm transition-shadow duration-200">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Team Inthifada</h4>
            <p className="text-gray-600 text-sm mb-3">Innovation & Competition</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="text-gray-900 font-bold">45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Programs:</span>
                <span className="text-gray-900 font-bold">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}