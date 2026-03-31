import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ArrowUpRight, ShieldCheck, FileText, Globe, HardDrive, Key, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    PieChart, 
    Pie, 
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';

const StatCard = ({ title, value, trend, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    <ArrowUpRight size={14} />
                    {trend}
                </div>
            )}
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
    </div>
);

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        passwords: [],
        documents: [],
        loading: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pwdRes, docRes] = await Promise.all([
                    api.get('/passwords'),
                    api.get('/documents')
                ]);

                setStats({
                    passwords: pwdRes.data.data,
                    documents: docRes.data.data,
                    loading: false
                });
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchData();
    }, []);

    const recentPasswords = stats.passwords.slice(0, 3);
    const recentDocuments = stats.documents.slice(0, 3);

    // Calculate total storage
    const totalStorageKB = stats.documents.reduce((acc, doc) => {
        const sizeStr = doc.size || '0 KB';
        const size = parseFloat(sizeStr.split(' ')[0]) || 0;
        return acc + size;
    }, 0);
    const storageDisplay = totalStorageKB > 1024
        ? (totalStorageKB / 1024).toFixed(2) + ' MB'
        : totalStorageKB.toFixed(1) + ' KB';

    // Chart Data Preparation
    const vaultDistribution = [
        { name: 'Passwords', value: stats.passwords.length, color: '#4666f1' },
        { name: 'Documents', value: stats.documents.length, color: '#a855f7' }
    ];

    const categoryData = stats.passwords.reduce((acc, curr) => {
        const cat = curr.category || 'Other';
        const existing = acc.find(item => item.name === cat);
        if (existing) existing.value += 1;
        else acc.push({ name: cat, value: 1 });
        return acc;
    }, []);

    const COLORS = ['#4666f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

    if (stats.loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Loader2 size={40} className="text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium">Securing your session...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

            <main className="lg:pl-64 pt-4 sm:pt-8 pb-12 px-4 sm:px-8 lg:px-10 transition-all duration-300">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Welcome Section */}
                    <div className="relative overflow-hidden bg-indigo-600 rounded-3xl p-8 sm:p-12 shadow-indigo-glow">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                            </h2>
                            <p className="text-indigo-100 text-lg max-w-xl">
                                Your digital wallet is secure. You have {stats.passwords.length} passwords and {stats.documents.length} documents protected.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate('/passwords')}
                                    className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-black/5 hover:bg-indigo-50 transition-colors active:scale-95"
                                >
                                    Manage Passwords
                                </button>
                                <button
                                    onClick={() => navigate('/documents')}
                                    className="bg-indigo-500 text-white border border-indigo-400 px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-400 transition-colors active:scale-95"
                                >
                                    View Documents
                                </button>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-20 -mb-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-2xl"></div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Passwords"
                            value={stats.passwords.length}
                            trend="+New"
                            icon={Key}
                            color="bg-indigo-500"
                        />
                        <StatCard
                            title="Stored Documents"
                            value={stats.documents.length}
                            trend="Real-time"
                            icon={FileText}
                            color="bg-purple-500"
                        />
                        <StatCard
                            title="Storage Used"
                            value={storageDisplay}
                            icon={HardDrive}
                            color="bg-orange-500"
                        />
                    </div>

                    {/* Dynamic Analytics Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Password Categories</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                            cursor={{fill: '#f8fafc'}}
                                        />
                                        <Bar dataKey="value" fill="#4666f1" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Vault Distribution</h3>
                            <div className="h-64 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={vaultDistribution}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {vaultDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                        />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-10">
                                    <span className="text-2xl font-bold text-slate-900">{stats.passwords.length + stats.documents.length}</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total items</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Recent Passwords */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Recent Passwords</h3>
                                <button
                                    onClick={() => navigate('/passwords')}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="space-y-4">
                                {recentPasswords.length > 0 ? (
                                    recentPasswords.map((item) => (
                                        <div
                                            key={item._id}
                                            onClick={() => navigate('/passwords')}
                                            className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group border border-slate-50 hover:border-slate-100"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white`}>
                                                    <Key size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                                                    <p className="text-sm text-slate-500">{item.username}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded hidden min-[400px]:block">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-slate-400 text-sm italic">No passwords saved yet</div>
                                )}
                            </div>
                        </div>

                        {/* Recent Documents */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Recent Documents</h3>
                                <button
                                    onClick={() => navigate('/documents')}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="space-y-4">
                                {recentDocuments.length > 0 ? (
                                    recentDocuments.map((doc) => (
                                        <div
                                            key={doc._id}
                                            onClick={() => navigate('/documents')}
                                            className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group border border-slate-50 hover:border-slate-100"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white`}>
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{doc.name}</h4>
                                                    <p className="text-sm text-slate-500">{doc.type} • {doc.size}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-400 hidden min-[400px]:block">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-slate-400 text-sm italic">No documents uploaded yet</div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
