import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

export default function PublicNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="w-full bg-background-light dark:bg-background-dark border-b border-surface-light dark:border-surface-dark sticky top-0 z-50">
            <div className="max-w-[1200px] mx-auto px-4 md:px-10">
                <div className="flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="size-8 text-primary">
                            <Icon name="eco" size={32} />
                        </div>
                        <span className="text-xl font-bold dark:text-white">EcoScore</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-6">
                            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-200">About</Link>
                            <Link to="/impact" className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-200">Community Impact</Link>
                        </div>
                        <Link to="/resident/login">
                            <Button>Login</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden text-text-main dark:text-white cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <Icon name={isMobileMenuOpen ? "close" : "menu"} />
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-background-light dark:bg-background-dark border-b border-surface-light dark:border-surface-dark px-4 py-4 flex flex-col gap-4 shadow-xl">
                    <Link to="/about" className="text-base font-medium py-2">About</Link>
                    <Link to="/impact" className="text-base font-medium py-2">Community Impact</Link>
                    <Link to="/resident/login" className="w-full">
                        <Button className="w-full">Login</Button>
                    </Link>
                </div>
            )}
        </nav>
    );
}
