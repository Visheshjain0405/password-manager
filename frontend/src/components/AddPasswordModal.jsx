import React, { useState, useEffect } from 'react';
import { X, Globe, User, Lock, Eye, EyeOff } from 'lucide-react';

const AddPasswordModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        url: '',
        category: 'Personal'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                username: initialData.username || '',
                password: initialData.password || '',
                url: initialData.url || '',
                category: initialData.category || 'Personal'
            });
        } else {
            setFormData({
                name: '',
                username: '',
                password: '',
                url: '',
                category: 'Personal'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 pointer-events-auto transform transition-all scale-100 opacity-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900">{initialData ? 'Edit Password' : 'Add New Password'}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">

                        <div className="space-y-1.5 has-[input:focus]:text-indigo-600 transition-colors group">
                            <label className="text-sm font-medium text-slate-600 group-has-[input:focus]:text-indigo-600">Site Name</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-has-[input:focus]:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Google, Netflix"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800 placeholder:text-slate-400"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 has-[input:focus]:text-indigo-600 transition-colors group">
                            <label className="text-sm font-medium text-slate-600 group-has-[input:focus]:text-indigo-600">Username / Email</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-has-[input:focus]:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="john.doe@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800 placeholder:text-slate-400"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 has-[input:focus]:text-indigo-600 transition-colors group">
                            <label className="text-sm font-medium text-slate-600 group-has-[input:focus]:text-indigo-600">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-has-[input:focus]:text-indigo-500 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••••••"
                                    className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800 placeholder:text-slate-400"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5 has-[input:focus]:text-indigo-600 transition-colors group">
                            <label className="text-sm font-medium text-slate-600 group-has-[input:focus]:text-indigo-600">Website URL (Optional)</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-has-[input:focus]:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="url"
                                    placeholder="google.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800 placeholder:text-slate-400"
                                    value={formData.url}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 has-[input:focus]:text-indigo-600 transition-colors group">
                            <label className="text-sm font-medium text-slate-600 group-has-[input:focus]:text-indigo-600">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {['Personal', 'Work', 'Social', 'Shopping', 'Finance', 'Other'].map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat })}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${formData.category === cat
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-indigo-glow transition-all active:scale-95"
                            >
                                Save Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddPasswordModal;
