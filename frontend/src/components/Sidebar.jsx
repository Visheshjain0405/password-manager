import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Shield,
    Key,
    FileText,
    Settings,
    LogOut,
    X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const links = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Key, label: 'Passwords', path: '/passwords' },
        { icon: FileText, label: 'Documents', path: '/documents' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-indigo-glow">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">
                            SecurePass
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-2 mt-4">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `
                flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 group
                ${isActive
                                    ? 'bg-indigo-50 text-indigo-700 shadow-sm font-medium'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }
              `}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                        >
                            <link.icon className="w-5 h-5 transition-colors group-hover:text-current" />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full p-3.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
