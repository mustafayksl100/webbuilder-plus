import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
    LayoutDashboard,
    FolderOpen,
    ShoppingCart,
    User,
    LogOut,
    Menu,
    X,
    Boxes
} from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/shop', icon: ShoppingCart, label: 'Market' }, // Label güncellendi
        { to: '/profile', icon: User, label: 'Profil' },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] flex font-[Manrope]">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-72 bg-[#020617] border-r border-slate-800
                transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="h-24 flex items-center justify-between px-8 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Boxes className="w-6 h-6 text-black" />
                        </div>
                        <span className="font-bold text-xl text-white font-[Sora] tracking-tight">WebBuilder</span>
                    </div>
                    <button
                        className="lg:hidden text-slate-400 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-6 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-5 py-4 rounded-xl transition-all font-medium border
                                ${isActive
                                    ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                                    : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900 hover:text-white'
                                }
                            `}
                        >
                            <item.icon className={`w-5 h-5 ${({ isActive }) => isActive ? 'text-emerald-400' : ''}`} />
                            <span className="font-[Sora]">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800 bg-[#020617]">

                    {/* User Info */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center">
                            <span className="text-cyan-400 font-bold font-[Sora] text-lg">
                                {user?.fullName?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-white font-bold font-[Sora] truncate">
                                {user?.fullName || 'Misafir'}
                            </div>
                            <div className="text-xs text-slate-500 truncate font-mono">
                                {user?.email}
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl transition-all group"
                    >
                        <LogOut className="w-4 h-4 group-hover:text-red-400" />
                        <span className="font-medium group-hover:text-red-400">Oturumu Kapat</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative">
                {/* Top Header (Mobile Only) */}
                <header className="lg:hidden h-20 bg-[#020617] border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
                    <button
                        className="text-slate-400 hover:text-white p-2 -ml-2"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                            <Boxes className="w-5 h-5 text-black" />
                        </div>
                        <span className="font-bold text-lg text-white font-[Sora]">WebBuilder</span>
                    </div>
                    <div className="w-8" />
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-[#0f172a]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
