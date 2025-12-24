import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';

export default function ResidentLoginPage() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/resident');
    };

    return (
        <div className="w-full max-w-screen-2xl mx-auto h-screen flex flex-col lg:flex-row overflow-hidden bg-white dark:bg-gray-900">
            {/* Left Side - Visual Hero */}
            <div className="relative w-full lg:w-1/2 bg-gray-900 flex flex-col justify-between p-8 lg:p-16 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW4t-J4LMxOBz4kI5J304jptrH-EI46xJgB3q-f57WUVXN941tCwc_DGyabR_QixVhjLEOCF1cO-1sXjHp5N1FMplj6l2mxPH2ISlzkA3qE4hopKgdkpoWCc13RmwI133YJpXSAf2y_flhqBVo0o0WoKJigz7qq4xiN6h4l_8BF36VwZItgqHBvSGtAgsXcV__fX4WhYR63o8sYsZqihBya_UKs9Ba2UdiybJvgnFIiLmo41Fbj2AiXYpz2-FBhGKPeiHfvHepvUo"
                        alt="Sustainable community"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/50 to-transparent"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <Icon name="eco" className="text-background-dark" filled />
                        </div>
                        <span className="text-white text-xl font-bold tracking-tight">EcoScore Community</span>
                    </div>
                </div>

                <div className="relative z-10 text-white mt-auto">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl mb-8">
                        <div className="flex items-start gap-4">
                            <Icon name="lightbulb" className="text-primary text-3xl" />
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Community Insight</h3>
                                <p className="text-gray-200 text-sm leading-relaxed">
                                    "Did you know? Our neighborhood reduced water consumption by 18% last month. Log in to see how your household contributed!"
                                </p>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                        Powering a greener future, <br />
                        <span className="text-primary">one home at a time.</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-md">
                        Join your neighbors in tracking consumption, reducing waste, and earning sustainability rewards.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 bg-background-light dark:bg-background-dark flex flex-col justify-center items-center p-8 lg:p-16 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold dark:text-white">Welcome Home</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <Input
                            label="Email or Username"
                            type="email"
                            name="email"
                            placeholder="resident@example.com"
                            icon="mail"
                            defaultValue="resident@demo.com"
                            required
                        />

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium dark:text-gray-300">Password</label>
                                <a href="#" className="text-sm font-medium text-primary hover:text-green-600 dark:hover:text-green-400">
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                icon="lock"
                                defaultValue="password"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                            />
                            <label className="ml-2 block text-sm dark:text-gray-300">Keep me logged in</label>
                        </div>

                        <Button type="submit" size="lg" className="w-full">
                            Log In
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-background-light dark:bg-background-dark text-gray-500">
                                New to the neighborhood?
                            </span>
                        </div>
                    </div>

                    {/* Registration CTA */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-sm font-medium dark:text-white">Create Resident Account</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Start tracking your score today</p>
                        </div>
                        <Link to="/resident/register">
                            <Button variant="ghost" size="sm">Register</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
