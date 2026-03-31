import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Moon, Smartphone, Shield, LogOut, ChevronRight, Mail, Key, Globe, Clock, MapPin } from 'lucide-react';

const SettingsSection = ({ title, children }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">{title}</h3>
        </div>
        <div className="divide-y divide-slate-50">
            {children}
        </div>
    </div>
);

const SettingsItem = ({ icon: Icon, title, description, children }) => (
    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
        <div className="flex items-start gap-4">
            <div className={`p-2.5 rounded-xl mt-1 sm:mt-0 ${Icon ? 'bg-slate-100 text-slate-600' : ''}`}>
                {Icon && <Icon size={20} />}
            </div>
            <div>
                <p className="font-semibold text-slate-900">{title}</p>
                {description && <p className="text-sm text-slate-500 max-w-sm">{description}</p>}
            </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto">
            {children}
        </div>
    </div>
);

const Settings = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);
    const [emailNotifs, setEmailNotifs] = useState(true);

    const Toggle = ({ active, onToggle }) => (
        <button
            onClick={onToggle}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}
        >
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    );

    const loginHistory = [
        { device: 'Chrome on Windows', location: 'Active Location', time: 'Active Now', ip: 'Current Device', icon: Globe, status: 'current' },
        { device: 'Authorized device', location: 'Previously used', time: 'Recently', ip: '---', icon: Smartphone, status: 'authorized' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

            <main className="lg:pl-80 pt-8 pb-12 px-6 sm:px-8 lg:px-10 transition-all duration-300">
                <div className="max-w-4xl mx-auto">

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                        <p className="text-slate-500">Manage your account preferences and configurations</p>
                    </div>

                    <SettingsSection title="Profile & Account">
                        <SettingsItem
                            icon={User}
                            title="Personal Information"
                            description={`${user?.name || 'Loading...'} - Update your name and details.`}
                        >
                            <button className="text-sm text-indigo-600 font-medium hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                                Edit Info
                            </button>
                        </SettingsItem>
                        <SettingsItem
                            icon={Mail}
                            title="Email Address"
                            description={user?.email || 'Loading...'}
                        >
                            <button className="text-sm text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors">
                                Change
                            </button>
                        </SettingsItem>
                    </SettingsSection>

                    <SettingsSection title="Preferences">
                        <SettingsItem
                            icon={Moon}
                            title="Dark Mode"
                            description="Switch between light and dark themes for the interface."
                        >
                            <Toggle active={darkMode} onToggle={() => setDarkMode(!darkMode)} />
                        </SettingsItem>
                        <SettingsItem
                            icon={Bell}
                            title="Email Notifications"
                            description="Receive updates about your security reports and alerts."
                        >
                            <Toggle active={emailNotifs} onToggle={() => setEmailNotifs(!emailNotifs)} />
                        </SettingsItem>
                    </SettingsSection>

                    <SettingsSection title="Security & Access">
                        <SettingsItem
                            icon={Key}
                            title="Master Password"
                            description="Change the password used to unlock your vault."
                        >
                            <button className="text-sm text-indigo-600 font-medium hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                                Update
                            </button>
                        </SettingsItem>

                        <div className="p-6 border-t border-slate-50">
                            <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Shield size={18} className="text-slate-500" />
                                Recent Login Activity
                            </h4>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                {loginHistory.map((login, idx) => (
                                    <div key={idx} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${idx !== loginHistory.length - 1 ? 'border-b border-slate-200' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500">
                                                <login.icon size={18} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">{login.device}</p>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                                    <span className="flex items-center gap-1"><Clock size={10} /> {login.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                                            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">{login.ip}</span>
                                            {login.status === 'current' ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                                    Active Now
                                                </span>
                                            ) : (
                                                <button className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors">
                                                    Revoke
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default Settings;
