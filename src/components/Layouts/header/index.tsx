"use client";

import { SearchIcon } from "@/assets/icons";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();

  return (
    <header 
      className="sticky top-0 z-30 bg-white border-b border-gray-200 font-poppins shadow-sm"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Mobile Menu & Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-200"
          >
            <MenuIcon />
            <span className="sr-only">Toggle Sidebar</span>
          </button>

          {/* Festival Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">
                Festival 2K25
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 ml-2">
                  Admin
                </span>
              </h1>
              <p className="text-sm text-gray-600">Arts & Sports Management</p>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="search"
              placeholder="Search teams, candidates, results..."
              className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-4">
          {/* Team Status Indicators */}
          <div className="hidden lg:flex items-center space-x-2 mr-4">
            <div className="flex -space-x-1">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full border-2 border-white shadow-sm"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-rose-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <span className="text-sm text-gray-600 font-medium">3 Teams Active</span>
          </div>

          {/* Back to Site Button */}
          <Link 
            href="/" 
            className="hidden xl:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>←</span>
            <span>Festival Site</span>
          </Link>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-600 transition-all duration-200">
              <span className="text-lg">📊</span>
            </button>
            <button className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 text-blue-600 transition-all duration-200">
              <span className="text-lg">🎭</span>
            </button>
          </div>

          <ThemeToggleSwitch />
          <Notification />
          <UserInfo />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative">
          <input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
