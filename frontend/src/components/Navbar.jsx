import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 lg:pl-64 transition-all duration-300">
            <div className="flex items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors relative">
                        <Bell size={20} />
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></div>
                    </button>

                    <button className="flex items-center gap-3 p-1.5 pl-2.5 pr-1.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                        <span className="text-sm font-medium text-slate-700 hidden md:block">
                            {user?.name || 'User'}
                        </span>
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 uppercase">
                            {initials}
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
