import { Link } from 'react-router-dom';
import PublicNavbar from '../components/molecules/PublicNavbar';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';
import Card from '../components/atoms/Card';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center py-12 md:py-20 px-4">
                <div className="max-w-[1200px] w-full flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex flex-col gap-6 flex-1 max-w-2xl text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-text-main dark:text-white">
                            Building a <span className="text-primary">Greener Future</span>, One Household at a Time.
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            Track your consumption, understand your impact, and join your neighbors in creating a sustainable community. It’s not about winning—it’s about changing.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                            <Link to="/resident/login">
                                <Button size="xl">Check My Score</Button>
                            </Link>
                            <Link to="/admin/login">
                                <Button variant="secondary" size="xl">Administrator Portal</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-[600px]">
                        <div className="w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative group">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3v2iqedFxJFzR1iW5-CplzsZrqLeLNFdrcBMpfuc7CkD7ECS4FMiNvVUXF5qDZ1KeZ0-YQ75JUQ59uqN-Q0deCFi6slwn8hYWxhl-VcR9a1gw3Czj2KwxPAtdJXWoJKmtCPEvFwkMU_NVHChKT6ndrULW4GCVuuz4D4oZSD5ctrdjLJF8Kw0Bzf_9iILISEP1Cd836MBbbg2p-UST0UPd-qz4larZ7a_8vaQwPlwu6tKJ9CR6_6AxzvFLJsIcJNcOvgPOdC0TaFA"
                                alt="Sustainable City"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-[#eefbf1] dark:bg-[#1a2e1d] py-16">
                <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
                    <h3 className="text-2xl font-bold max-w-xs text-center md:text-left dark:text-white">
                        Together, we are making a measurable impact.
                    </h3>

                    <div className="flex flex-wrap justify-center gap-6 w-full md:w-auto">
                        {[
                            { icon: 'cloud_off', label: 'CO2 Saved', value: '1,204', unit: 'tons' },
                            { icon: 'home', label: 'Households', value: '840+', unit: '' },
                            { icon: 'bolt', label: 'Conserved', value: '150', unit: 'MWh' },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col gap-1 p-6 bg-white dark:bg-[#253f29] rounded-xl shadow-sm border border-[#cfe7d3] dark:border-[#2f5535] min-w-[180px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon name={stat.icon} className="text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{stat.label}</span>
                                </div>
                                <p className="text-3xl font-black dark:text-white">
                                    {stat.value} <span className="text-lg text-gray-400 font-bold">{stat.unit}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                        <span className="bg-primary/20 text-green-800 dark:text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">Simple Process</span>
                        <h2 className="text-3xl md:text-4xl font-black dark:text-white">How It Works</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Three simple steps to start making a difference today.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: 'edit_note', title: '1. Measure', desc: 'Simple tools to track your household energy, waste, and water consumption patterns.' },
                            { icon: 'lightbulb', title: '2. Learn', desc: 'Receive personalized scores and actionable tips to lower your footprint.' },
                            { icon: 'public', title: '3. Act', desc: 'See the real-world difference your choices make in the collective community score.' },
                        ].map((feature, i) => (
                            <Card key={i} className="p-8 hover:shadow-xl transition-shadow border-none bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-800">
                                <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center text-green-800 dark:text-primary mb-6">
                                    <Icon name={feature.icon} size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gradient-to-br from-primary/10 to-transparent text-center px-4">
                <h2 className="text-3xl md:text-4xl font-black mb-6 dark:text-white">Ready to join the movement?</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join over 800 neighbors who are already tracking their impact and building a sustainable future.
                </p>
                <Link to="/resident/register">
                    <Button size="xl" className="shadow-xl shadow-primary/30 hover:scale-105 transition-transform">Create My Account</Button>
                </Link>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark">
                <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Icon name="eco" className="text-primary" />
                        <span className="font-bold text-lg dark:text-white">EcoScore Community</span>
                    </div>
                    <p className="text-gray-500 text-sm">© 2024 Community Sustainability System.</p>
                </div>
            </footer>
        </div>
    );
}
