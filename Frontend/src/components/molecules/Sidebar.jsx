import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import Icon from '../atoms/Icon';

export default function Sidebar({ role = 'resident', isOpen, onClose }) {
    const location = useLocation();

    /* ================= RESIDENT LINKS ================= */
    const residentLinks = [
        { name: 'Dashboard', icon: 'dashboard', path: '/resident' },
        { name: 'Society Impact', icon: 'domain', path: '/resident/impact' },
        { name: 'Community Goals', icon: 'emoji_events', path: '/resident/goals' },
        { name: 'Input Data', icon: 'edit_note', path: '/resident/input' },

        // ✅ NEW CONTACT US LINK
        { name: 'Contact Us', icon: 'support_agent', path: '/resident/contact' },

        { name: 'Settings', icon: 'settings', path: '/resident/settings' },
    ];

    /* ================= ADMIN LINKS ================= */
    const adminLinks = [
        { name: 'Dashboard', icon: 'dashboard', path: '/admin' },
        { name: 'Societies', icon: 'apartment', path: '/admin/societies' },
        { name: 'Residents', icon: 'group', path: '/admin/residents' },
        { name: 'Approvals', icon: 'fact_check', path: '/admin/approvals' },
        { name: 'Settings', icon: 'settings', path: '/admin/settings' },
    ];

    const links = role === 'admin' ? adminLinks : residentLinks;

    return (
        <>
            {/* ================= MOBILE OVERLAY ================= */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* ================= SIDEBAR ================= */}
            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 transform",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="h-full flex flex-col justify-between p-4">

                    {/* ================= TOP SECTION ================= */}
                    <div className="flex flex-col gap-6">

                        {/* Logo */}
                        <div className="flex items-center gap-3 px-2 h-12">
                            <div className="bg-primary/20 p-2 rounded-lg">
                                <Icon name="eco" className="text-primary" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight text-text-main dark:text-white">
                                    EcoScore
                                </h1>
                                <p className="text-xs text-text-secondary uppercase tracking-wider">
                                    {role} Portal
                                </p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-col gap-1">
                            {links.map((link) => {
                                const isActive = location.pathname === link.path;

                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={clsx(
                                            "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors font-medium text-sm",
                                            isActive
                                                ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                                        )}
                                        onClick={() => onClose && onClose()}
                                    >
                                        <Icon name={link.icon} filled={isActive} />
                                        <span>{link.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* ================= LOGOUT ================= */}
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                        <Link
                            to={role === 'admin' ? '/admin/login' : '/resident/login'}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                            <Icon name="logout" />
                            <span className="font-bold text-sm">Sign Out</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}

Sidebar.propTypes = {
    role: PropTypes.oneOf(['admin', 'resident', 'society']),
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
};
