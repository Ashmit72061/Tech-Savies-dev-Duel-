import PropTypes from 'prop-types';
import Icon from '../atoms/Icon';

export default function DashboardHeader({ title, onMenuClick }) {
    return (
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-surface-light/80 dark:bg-card-dark/80 backdrop-blur-sm flex items-center justify-between px-6 z-20 sticky top-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                >
                    <Icon name="menu" />
                </button>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white hidden sm:block">{title}</h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar (Hidden on mobile) */}
                <div className="hidden md:flex relative items-center">
                    <Icon name="search" size={20} className="absolute left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none text-sm focus:ring-1 focus:ring-primary w-64"
                    />
                </div>

                <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <Icon name="notifications" className="text-gray-600 dark:text-gray-300" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-card-dark"></span>
                </button>

                <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border-2 border-transparent hover:border-primary cursor-pointer transition-colors">
                    JD
                </div>
            </div>
        </header>
    );
}

DashboardHeader.propTypes = {
    title: PropTypes.string,
    onMenuClick: PropTypes.func.isRequired,
};
