import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from '../components/molecules/Sidebar';
import DashboardHeader from '../components/molecules/DashboardHeader';

export default function DashboardLayout({ role }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Simple title logic based on path
    const getTitle = () => {
        const path = location.pathname.split('/').pop();
        if (!path || path === role) return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden">
            <Sidebar
                role={role}
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <DashboardHeader
                    title={getTitle()}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto pb-20">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

DashboardLayout.propTypes = {
    role: PropTypes.string.isRequired,
};
