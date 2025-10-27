"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-white/20 shadow-2xl"
            : "bg-black/10 backdrop-blur-sm border-b border-white/5"
            }`}>
            <div className={`transition-all duration-500 ease-in-out ${isScrolled ? "max-w-7xl mx-auto" : "max-w-5xl mx-auto"
                } px-4 sm:px-6 lg:px-8`}>
                <div className={`flex items-center justify-between transition-all duration-500 ease-in-out ${isScrolled ? "h-16" : "h-12"
                    }`}>
                    <div className="flex items-center">
                        <Link href="/" className={`font-bold text-white transition-all duration-500 ease-in-out ${isScrolled ? "text-2xl" : "text-xl"
                            }`}>
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                🎨 FESTIVAL
                            </span>
                            <span className="text-white ml-1">2K25</span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className={`ml-10 flex items-baseline transition-all duration-500 ease-in-out ${isScrolled ? "space-x-8" : "space-x-6"
                            }`}>
                            <a href="#about" className={`text-white hover:text-purple-300 transition-all duration-300 ${isScrolled ? "text-base font-medium" : "text-sm font-normal"
                                }`}>About</a>
                            <a href="#lineup" className={`text-white hover:text-purple-300 transition-all duration-300 ${isScrolled ? "text-base font-medium" : "text-sm font-normal"
                                }`}>Teams</a>
                            <a href="#schedule" className={`text-white hover:text-purple-300 transition-all duration-300 ${isScrolled ? "text-base font-medium" : "text-sm font-normal"
                                }`}>Schedule</a>
                            <a href="#contact" className={`text-white hover:text-purple-300 transition-all duration-300 ${isScrolled ? "text-base font-medium" : "text-sm font-normal"
                                }`}>Contact</a>
                            <Link href="/admin/dashboard" className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 ${isScrolled ? "px-4 py-2 text-sm font-semibold" : "px-3 py-1.5 text-xs font-medium"
                                }`}>
                                Admin
                            </Link>
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`text-white hover:text-purple-300 transition-all duration-300 ${isScrolled ? "p-2" : "p-1"
                                }`}
                        >
                            <svg className={`transition-all duration-300 ${isScrolled ? "h-6 w-6" : "h-5 w-5"
                                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu with animation */}
            <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                } ${isScrolled ? "bg-black/95" : "bg-black/40"} backdrop-blur-xl`}>
                <div className="px-4 pt-2 pb-3 space-y-1">
                    <a href="#about"
                        onClick={() => setIsOpen(false)}
                        className="block text-white hover:text-purple-300 px-3 py-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                        About
                    </a>
                    <a href="#lineup"
                        onClick={() => setIsOpen(false)}
                        className="block text-white hover:text-purple-300 px-3 py-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                        Teams
                    </a>
                    <a href="#schedule"
                        onClick={() => setIsOpen(false)}
                        className="block text-white hover:text-purple-300 px-3 py-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                        Schedule
                    </a>
                    <a href="#contact"
                        onClick={() => setIsOpen(false)}
                        className="block text-white hover:text-purple-300 px-3 py-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                        Contact
                    </a>
                    <Link href="/admin/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-3 rounded-lg mx-0 mt-2 text-center font-semibold transition-all duration-300">
                        Admin Dashboard
                    </Link>
                </div>
            </div>
        </nav>
    );
}