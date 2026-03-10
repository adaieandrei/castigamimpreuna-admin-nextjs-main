import React from "react";
import { useRouter } from 'next/router';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';

const navItems = [
    { label: 'Dashboard', path: '/', icon: DashboardIcon },
    { label: 'Meciuri', path: '/games', icon: SportsSoccerIcon },
    { label: 'Bilete', path: '/tickets', icon: ConfirmationNumberIcon },
];

export default function Layout({ children }) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#f0fdf4]">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-4">
                    <div className="flex items-center h-14 gap-1">
                        {/* Brand */}
                        <div className="flex items-center mr-6">
                            <span className="text-lg font-bold text-green-700 tracking-tight">
                                Câștigă Împreună
                            </span>
                        </div>
                        {/* Nav Links */}
                        <div className="flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = router.pathname === item.path;
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => router.push(item.path)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                            ${isActive
                                                ? 'bg-green-50 text-green-700'
                                                : 'text-gray-500 hover:text-green-700 hover:bg-green-50/50'
                                            }`}
                                    >
                                        <Icon sx={{ fontSize: 18 }} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="max-w-[1600px] mx-auto p-4">
                {children}
            </main>
        </div>
    );
}