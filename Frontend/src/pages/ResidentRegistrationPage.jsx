import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';

export default function ResidentRegistrationPage() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit Logic
    };

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
            {/* Left Side - Form */}
            <div className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:px-20 xl:px-24 w-full lg:w-1/2">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    {/* Branding */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-primary/20">
                            <Icon name="eco" className="text-primary text-3xl" filled />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight dark:text-white">EcoScore</h2>
                    </div>

                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-bold leading-tight tracking-tight dark:text-white">
                            Join Your Green Community
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Start tracking your household consumption and earning sustainability scores today.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <Input
                            label="Full Name"
                            name="name"
                            placeholder="Jane Doe"
                            icon="person"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                                Society / Building
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon name="location_city" size={20} className="text-gray-400" />
                                </div>
                                <select className="block w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white pl-10 pr-10 py-3 focus:ring-2 focus:ring-primary focus:border-primary">
                                    <option>Select your society</option>
                                    <option>Green Valley Estate</option>
                                    <option>Eco Heights</option>
                                    <option>Sustainable Living Complex</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Input
                                label="Flat / Unit Number"
                                name="flat"
                                placeholder="e.g. B-402"
                                icon="apartment"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Used to map your consumption data correctly.</p>
                        </div>

                        <Input
                            label="Email address"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            icon="mail"
                            required
                        />

                        <div>
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                icon="lock"
                                required
                            />
                            {/* Strength Meter */}
                            <div className="mt-2 flex gap-1 h-1 w-full">
                                <div className="w-1/4 rounded-full bg-primary h-full"></div>
                                <div className="w-1/4 rounded-full bg-primary h-full"></div>
                                <div className="w-1/4 rounded-full bg-gray-200 dark:bg-gray-700 h-full"></div>
                                <div className="w-1/4 rounded-full bg-gray-200 dark:bg-gray-700 h-full"></div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">Strong password</p>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start">
                            <div className="flex h-6 items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                                <label className="font-medium dark:text-gray-200">
                                    I agree to the <a href="#" className="font-semibold text-primary hover:text-green-500">Terms of Service</a> and <a href="#" className="font-semibold text-primary hover:text-green-500">Privacy Policy</a>.
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" size="lg" className="w-full">
                            Create Account
                            <Icon name="arrow_forward" className="ml-2" />
                        </Button>
                    </form>

                    {/* Footer */}
                    <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        Already a member?{' '}
                        <Link to="/resident/login" className="font-semibold text-primary hover:text-green-500">
                            Log In
                        </Link>
                    </p>

                    {/* Trust Badges */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-center gap-6 opacity-70">
                        <div className="flex items-center gap-1.5">
                            <Icon name="shield" size={18} className="text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Secure Data</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Icon name="verified_user" size={18} className="text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Verified Society</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className="relative hidden w-0 flex-1 lg:block">
                <div className="absolute inset-0 h-full w-full bg-slate-900">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuApv1gnz4tbWLzDtrEKldPMIrznL6vrkHkuppso1jGj5V-ju2opT1HgqgM3An5OrF5Yb4GRyR6hEJOjuexrHa-yM0r_37vfyikzjiVZfibY6CKgcQ13J9MGHpc0n5LqVHjuesaZnHP0cc6iQ_L7_LcVOkP5EQO-N0Jf_MhNlH6XfMluzCADwocUXPsbCUg5cgmmfPCw0cN0c4AYhjqnR5uDVs5Z4ChC2ushismtePsY9KQ1PT90nWNMxT93c8EUqAQhraL7OAUP9NI"
                        alt="Modern sustainable apartment building"
                        className="absolute inset-0 h-full w-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/20 to-transparent flex flex-col justify-end p-12 lg:p-16 xl:p-24">
                        <div className="max-w-2xl">
                            <div className="mb-6 flex gap-2">
                                <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/30 backdrop-blur-sm">
                                    Community Impact
                                </span>
                                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm">
                                    3,400+ Households
                                </span>
                            </div>
                            <blockquote className="text-xl font-medium text-white/90 italic">
                                "Since joining EcoScore, our society has reduced energy consumption by 15% and water waste by 22%. It's amazing to see our collective impact."
                            </blockquote>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-700 border-2 border-primary overflow-hidden flex items-center justify-center text-white font-bold">
                                    DC
                                </div>
                                <div>
                                    <div className="text-base font-semibold text-white">David Chen</div>
                                    <div className="text-sm text-primary">Green Valley Estate Resident</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
