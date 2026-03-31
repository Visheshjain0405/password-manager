import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AddPasswordModal from '../components/AddPasswordModal';
import api from '../utils/api';
import { Search, Plus, Copy, MoreVertical, Key, Globe, Eye, EyeOff, Trash2 } from 'lucide-react';

const PasswordItem = ({ id, name, username, password, url, icon: Icon, color, onDelete }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className={`w-12 h-12 rounded-xl ${color || 'bg-indigo-500'} flex items-center justify-center shrink-0`}>
                    {Icon ? <Icon className="w-6 h-6 text-white" /> : <Key className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{name}</h3>
                    <p className="text-sm text-slate-500 truncate">{username}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <div className="relative mr-2 hidden sm:block">
                    <input
                        type={showPassword ? "text" : "password"}
                        readOnly
                        value={password}
                        className="bg-slate-50 border-none rounded-lg py-1.5 px-3 text-sm text-slate-600 w-32 focus:ring-0"
                    />
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
                    >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                </div>

                <button
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Copy Password"
                    onClick={() => navigator.clipboard.writeText(password)}
                >
                    <Copy size={18} />
                </button>
                <button
                    onClick={() => onDelete(id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

const Passwords = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [passwordList, setPasswordList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtering & Pagination State
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchPasswords();
    }, []);

    const fetchPasswords = async () => {
        try {
            const res = await api.get('/passwords');
            setPasswordList(res.data.data);
        } catch (err) {
            console.error('Error fetching passwords:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePassword = async (newPassword) => {
        try {
            const res = await api.post('/passwords', newPassword);
            if (res.data.success) {
                setPasswordList([res.data.data, ...passwordList]);
                setCurrentPage(1);
                if (newPassword.category) setSelectedCategory(newPassword.category);
            }
        } catch (err) {
            console.error('Error saving password:', err);
        }
    };

    const handleDeletePassword = async (id) => {
        if (!window.confirm('Are you sure you want to delete this password?')) return;
        try {
            const res = await api.delete(`/passwords/${id}`);
            if (res.data.success) {
                setPasswordList(passwordList.filter(p => p._id !== id));
            }
        } catch (err) {
            console.error('Error deleting password:', err);
        }
    };

    // Filter Logic
    const filteredPasswords = passwordList.filter(pwd => {
        const matchesCategory = selectedCategory === "All" || pwd.category === selectedCategory;
        const matchesSearch = pwd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pwd.username.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredPasswords.length / itemsPerPage);
    const paginatedPasswords = filteredPasswords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const categories = ["All", "Personal", "Work", "Social", "Shopping", "Finance", "Other"];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

            <AddPasswordModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSavePassword}
            />

            <main className="lg:pl-80 pt-8 pb-12 px-6 sm:px-8 lg:px-10 transition-all duration-300">
                <div className="max-w-5xl mx-auto space-y-6">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Passwords</h2>
                            <p className="text-slate-500">Manage your digital credentials</p>
                        </div>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-600/20 active:scale-95"
                        >
                            <Plus size={20} />
                            <span>Add Password</span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2 pb-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                        ? 'bg-indigo-600 text-white shadow-indigo-glow'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                            <Search className="w-5 h-5 text-slate-400 ml-3" />
                            <input
                                type="text"
                                placeholder="Search passwords..."
                                className="flex-1 py-2 bg-transparent text-sm focus:outline-none text-slate-700 placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-12 text-slate-500">Loading passwords...</div>
                        ) : paginatedPasswords.length > 0 ? (
                            paginatedPasswords.map((pwd) => (
                                <PasswordItem
                                    key={pwd._id}
                                    id={pwd._id}
                                    {...pwd}
                                    onDelete={handleDeletePassword}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                No passwords found matching your criteria.
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>

                            <span className="text-sm font-medium text-slate-600 px-4">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Passwords;
