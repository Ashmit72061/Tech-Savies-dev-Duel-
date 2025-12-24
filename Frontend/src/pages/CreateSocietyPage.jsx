import { useNavigate } from 'react-router-dom';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';

export default function CreateSocietyPage() {
    const navigate = useNavigate();

    return (
        <div className="relative pb-24">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full">
                    <Icon name="arrow_back" />
                </button>
                <h1 className="text-2xl font-bold dark:text-white">Register New Society</h1>
            </div>

            <form className="space-y-8 max-w-4xl mx-auto">
                {/* Identity Section */}
                <Card className="overflow-visible">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <Icon name="badge" className="text-primary" />
                        <h2 className="text-lg font-bold dark:text-white">Identity</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Society Name" placeholder="e.g. Green Valley Heights" fullWidth />
                        <Input label="Registration Number" placeholder="e.g. REG-2024-001" fullWidth />

                        <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Society Logo</label>
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer bg-gray-50 dark:bg-white/5">
                                <Icon name="cloud_upload" size={32} className="text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-primary">Click to upload</span>
                                <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Location Section */}
                <Card>
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <Icon name="location_on" className="text-primary" />
                        <h2 className="text-lg font-bold dark:text-white">Location</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Address Line 1" placeholder="Street address" fullWidth />
                        <Input label="City" placeholder="City" fullWidth />
                        <Input label="State / Province" placeholder="State" fullWidth />
                        <Input label="Postal Code" placeholder="ZIP Code" />
                    </div>
                </Card>

                {/* Setup Section */}
                <Card>
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <Icon name="settings_suggest" className="text-primary" />
                        <h2 className="text-lg font-bold dark:text-white">Initial Setup</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Total Units</label>
                            <Input type="number" placeholder="0" />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Scoring Cycle</label>
                            <select className="w-full h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-background-light dark:bg-surface-dark px-4 font-medium focus:border-primary focus:ring-0">
                                <option>Monthly</option>
                                <option>Quarterly</option>
                                <option>Annually</option>
                            </select>
                        </div>
                    </div>
                </Card>
            </form>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 lg:pl-72 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-4 z-40">
                <Button variant="ghost" onClick={() => navigate('/admin')}>Cancel</Button>
                <Button onClick={() => navigate('/admin')}>
                    <Icon name="check" className="mr-2" />
                    Create Society
                </Button>
            </div>
        </div>
    );
}
