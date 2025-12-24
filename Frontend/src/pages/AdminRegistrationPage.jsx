import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';

export default function AdminRegistrationPage() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/admin');
    };

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 relative bg-black">
                <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDm4OSucrBt8mVMVEP1VcEiDttEwFFtw_hqlDqndekeA3oIiEqEUvBE5xS0kalF5HUcDEYCi0YWG3rhziintvMoPpgvYaCYouFB2S9V8ZgRsOOHXyI5qNQgiNIwGqvQobsixCT0wBY_uxX7R_SJIa_c2PCgiCAAjNwyxq3vJrWzxHGhhyEJ80Ml4rRmGkHZaHua3q2sk_GTZuRTdTHM278zQgdUjRGcenNU0BRVxhuI4aUfWg3JgAir9UgVr6_PxE-XeZqMPeNk72E"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    alt="Nature Admin Background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="relative z-10 p-12 mt-auto text-white">
                    <div className="mb-4 text-primary"><Icon name="eco" size={48} filled /></div>
                    <h1 className="text-4xl font-bold mb-4">Admin Control Center</h1>
                    <p className="text-gray-300 max-w-md">Manage communities, approve societies, and drive sustainability scores across your organization.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-surface-light dark:bg-background-dark">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="flex items-center justify-center lg:justify-start gap-2 mb-8 text-primary">
                            <Icon name="arrow_back" /> Back to Home
                        </Link>
                        <h2 className="text-3xl font-black dark:text-white">Create Admin Account</h2>
                        <p className="text-gray-500 mt-2">Set up your administrator credentials</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Full Name"
                            name="name"
                            placeholder="Enter your full name"
                            icon="person"
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="name@organization.com"
                            icon="mail"
                            required
                        />

                        <Input
                            label="Organization Code"
                            name="org_code"
                            placeholder="Enter 6-digit code"
                            icon="badge"
                            required
                        />

                        <div>
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                placeholder="Create a strong password"
                                icon="lock"
                                required
                            />
                            {/* Password Strength Indicator */}
                            <div className="mt-2 flex gap-1 h-1">
                                <div className="flex-1 bg-primary rounded"></div>
                                <div className="flex-1 bg-primary rounded"></div>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-right">Medium strength</p>
                        </div>

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirm_password"
                            placeholder="Re-enter password"
                            icon="lock"
                            required
                        />

                        {/* Terms */}
                        <div className="flex items-start">
                            <div className="flex h-6 items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label className="font-medium dark:text-gray-200">
                                    I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                                </label>
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="w-full">
                            Create Admin Account
                            <Icon name="arrow_forward" className="ml-2" />
                        </Button>
                    </form>

                    <div className="text-center text-sm text-gray-500">
                        Already have an account? <Link to="/admin/login" className="text-primary font-bold hover:underline">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
