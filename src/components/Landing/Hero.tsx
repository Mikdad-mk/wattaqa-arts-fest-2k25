import Image from "next/image";

export function Hero() {
  return (
    <div className="h-screen relative overflow-hidden bg-white flex flex-col"
         style={{
           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
           backgroundSize: '40px 40px'
         }}>
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-xl">Festival 2K25</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-gray-500">
          <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
          <a href="#lineup" className="hover:text-gray-900 transition-colors">Teams</a>
          <a href="#schedule" className="hover:text-gray-900 transition-colors">Schedule</a>
          <a href="#tickets" className="hover:text-gray-900 transition-colors">Register</a>
          <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
        </div>
        
        <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors">
          Join Festival
        </button>
      </nav>

      {/* Hero Section - Full Screen Height */}
      <div className="flex-1 flex flex-col justify-center text-center px-8 max-w-6xl mx-auto w-full">
        
        {/* User avatars and rating */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center mr-2">
            <div className="text-2xl mr-2">🎭</div>
          </div>
          <div className="flex -space-x-2 mr-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white"></div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full border-2 border-white"></div>
            <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-rose-400 rounded-full border-2 border-white"></div>
            <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-sm font-bold">+</span>
            </div>
          </div>
          <span className="text-gray-600 text-sm">135+ talented students</span>
        </div>

        {/* Main heading */}
        <div className="relative mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Celebrate diversity<br />
            with our festival
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
          Join three dynamic teams competing across 200+ programs<br />
          in arts, sports, and creative excellence
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          <button className="bg-black text-white px-8 py-4 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors text-lg">
            <span>Watch Highlights</span>
            <span className="text-yellow-400">⚡</span>
          </button>
          <button className="text-gray-500 hover:text-gray-900 transition-colors text-lg">
            View Schedule
          </button>
        </div>    
    {/* Three Animated Image Containers */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 max-w-5xl mx-auto">
          
          {/* Green container - Team Sumud */}
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl w-full md:w-80 h-80 relative overflow-hidden flex items-center justify-center cursor-pointer transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 animate-fade-in-up group"
               style={{ animationDelay: '0.2s' }}>
            
            {/* Floating animation background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-300/20 to-emerald-600/20 animate-pulse"></div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="text-white text-center relative z-10 group-hover:text-white transition-colors duration-300">
              <div className="w-20 h-20 mx-auto mb-3 border-2 border-white/30 rounded-xl flex items-center justify-center group-hover:border-white/50 group-hover:scale-110 transition-all duration-300">
                <Image
                  src="/images/coconut-tree-svgrepo-com.svg"
                  alt="Team Sumud"
                  width={40}
                  height={40}
                  className="group-hover:scale-110 transition-transform duration-300 filter brightness-0 invert"
                />
              </div>
              <h3 className="text-lg font-bold mb-1">Team Sumud</h3>
              <p className="text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">Arts & Sports Excellence</p>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
          </div>

          {/* Blue container - Team Aqsa (taller) */}
          <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl w-full md:w-80 h-96 relative overflow-hidden flex items-center justify-center cursor-pointer transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 animate-fade-in-up group"
               style={{ animationDelay: '0.4s' }}>
            
            {/* Floating animation background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-cyan-600/20 animate-pulse"></div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="text-white text-center relative z-10 group-hover:text-white transition-colors duration-300">
              <div className="w-20 h-20 mx-auto mb-3 border-2 border-white/30 rounded-xl flex items-center justify-center group-hover:border-white/50 group-hover:scale-110 transition-all duration-300">
                <Image
                  src="/images/coconut-tree-svgrepo-com.svg"
                  alt="Team Aqsa"
                  width={40}
                  height={40}
                  className="group-hover:scale-110 transition-transform duration-300 filter brightness-0 invert"
                />
              </div>
              <h3 className="text-lg font-bold mb-1">Team Aqsa</h3>
              <p className="text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">Creative & Athletic Champions</p>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
            
            {/* Special glow effect for center box */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer transition-opacity duration-500"></div>
          </div> 
         {/* Red container - Team Inthifada */}
          <div className="bg-gradient-to-br from-red-400 to-rose-500 rounded-3xl w-full md:w-80 h-80 relative overflow-hidden flex items-center justify-center cursor-pointer transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 animate-fade-in-up group"
               style={{ animationDelay: '0.6s' }}>
            
            {/* Floating animation background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-300/20 to-rose-600/20 animate-pulse"></div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="text-white text-center relative z-10 group-hover:text-white transition-colors duration-300">
              <div className="w-20 h-20 mx-auto mb-3 border-2 border-white/30 rounded-xl flex items-center justify-center group-hover:border-white/50 group-hover:scale-110 transition-all duration-300">
                <Image
                  src="/images/coconut-tree-svgrepo-com.svg"
                  alt="Team Inthifada"
                  width={40}
                  height={40}
                  className="group-hover:scale-110 transition-transform duration-300 filter brightness-0 invert"
                />
              </div>
              <h3 className="text-lg font-bold mb-1">Team Inthifada</h3>
              <p className="text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">Innovation & Competition</p>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}