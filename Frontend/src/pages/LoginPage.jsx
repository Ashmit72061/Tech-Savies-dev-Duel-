import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';

export default function AdminLoginPage() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
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
                    alt="Nature Login"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="relative z-10 p-12 mt-auto text-white">
                    <div className="mb-4 text-primary"><Icon name="eco" size={48} filled /></div>
                    <h1 className="text-4xl font-bold mb-4">Driving Community Change</h1>
                    <p className="text-gray-300 max-w-md">Monitor, analyze, and improve sustainability scores across households.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-surface-light dark:bg-background-dark">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="flex items-center justify-center lg:justify-start gap-2 mb-8 text-primary">
                            <Icon name="arrow_back" /> Back to Home
                        </Link>
                        <h2 className="text-3xl font-black dark:text-white">Admin Portal</h2>
                        <p className="text-gray-500 mt-2">Sign in to manage your communities</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            icon="person"
                            defaultValue="admin@demo.com"
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            icon="lock"
                            defaultValue="password"
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                            </label>
                            <a href="#" className="text-primary font-bold hover:underline">Forgot password?</a>
                        </div>

                        <Button type="submit" size="lg" className="w-full">Secure Login</Button>
                    </form>

                    <div className="text-center text-sm text-gray-500">
                        Need an account? <Link to="/admin/register" className="text-primary font-bold hover:underline">Register as Admin</Link>
                        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-left">
                            <p className="font-bold mb-1">Demo Credentials:</p>
                            <p>Email: <span className="font-mono bg-white dark:bg-black p-0.5 rounded">admin@demo.com</span></p>
                            <p>Password: <span className="font-mono bg-white dark:bg-black p-0.5 rounded">password</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
