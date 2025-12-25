import { useState, useEffect } from 'react';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';
import Badge from '../components/atoms/Badge';

// Services
import consumptionService from '../services/consumptionService';
import userService from '../services/userService';

// =============================================================================
// TOAST COMPONENT
// =============================================================================

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    return (
        <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up`}>
            <Icon name={type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'} size={20} />
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-75">
                <Icon name="close" size={18} />
            </button>
        </div>
    );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function InputDataPage() {
    // User profile state (for pre-filling)
    const [userProfile, setUserProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    // Form state
    const [wasteSegregation, setWasteSegregation] = useState('yes');
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    // History state
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState(null);

    /**
     * Fetch user profile for pre-filling building/flat
     */
    const fetchUserProfile = async () => {
        setProfileLoading(true);
        try {
            const profile = await userService.getProfile();
            setUserProfile(profile);
        } catch (error) {
            console.error('Fetch profile error:', error);
            // Continue without pre-filled data
        } finally {
            setProfileLoading(false);
        }
    };

    /**
     * Fetch consumption history
     */
    const fetchHistory = async () => {
        setHistoryLoading(true);
        setHistoryError(null);

        try {
            const records = await consumptionService.getHistory({ limit: 5 });
            setHistory(records);
        } catch (error) {
            console.error('Fetch history error:', error);
            setHistoryError('Failed to load history');
        } finally {
            setHistoryLoading(false);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchUserProfile();
        fetchHistory();
    }, []);

    // Parse flat into building and flat number (e.g., "A-402" -> building: "A", flatNumber: "402")
    const parseFlat = (flat) => {
        if (!flat) return { building: '', flatNumber: '' };

        // Try to parse format like "A-402" or "Block A-402"
        const match = flat.match(/^(?:Block\s*)?([A-Za-z])[- ]?(\d+)$/i);
        if (match) {
            return { building: match[1].toUpperCase(), flatNumber: match[2] };
        }

        // If no building prefix, treat as flat number only
        return { building: '', flatNumber: flat };
    };

    const { building: userBuilding, flatNumber: userFlatNumber } = parseFlat(userProfile?.flat);

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.target);
        const data = {
            building: formData.get('building'),
            flatNumber: formData.get('flatNumber'),
            billingPeriod: formData.get('billingPeriod'),
            electricity: formData.get('electricity'),
            water: formData.get('water'),
            wasteSegregation: formData.get('waste_segregation'),
        };

        // Validation
        if (!data.billingPeriod || !data.electricity || !data.water) {
            setToast({ message: 'Please fill in all required fields', type: 'error' });
            setSubmitting(false);
            return;
        }

        try {
            await consumptionService.submitConsumption(data);

            setToast({ message: 'Record saved successfully!', type: 'success' });

            // Reset form (but keep building/flat prefilled)
            const form = e.target;
            form.querySelector('[name="electricity"]').value = '';
            form.querySelector('[name="water"]').value = '';
            setWasteSegregation('yes');

            // Refresh history
            fetchHistory();

        } catch (error) {
            console.error('Submit error:', error);
            setToast({
                message: error.message || 'Failed to save record',
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * Get current billing period default
     */
    const getDefaultBillingPeriod = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Toast notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Page Heading */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black dark:text-white">Monthly Consumption Entry</h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                    Enter your utility usage metrics for the current billing cycle.
                    Your building and flat are automatically filled from your profile.
                </p>
            </div>

            {/* Main Entry Card */}
            <Card className="flex flex-col gap-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {/* Section 1: Target Selection (Pre-filled from profile) */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                            1. Your Unit
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Building - Pre-filled and Read-only */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold dark:text-gray-200 flex items-center gap-2">
                                    Building / Block
                                    <Icon name="lock" size={14} className="text-gray-400" />
                                </span>
                                {profileLoading ? (
                                    <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                                ) : (
                                    <input
                                        type="text"
                                        name="building"
                                        value={userBuilding || 'N/A'}
                                        readOnly
                                        className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 h-12 px-4 cursor-not-allowed"
                                    />
                                )}
                            </div>

                            {/* Flat Number - Pre-filled and Read-only */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold dark:text-gray-200 flex items-center gap-2">
                                    Flat Number
                                    <Icon name="lock" size={14} className="text-gray-400" />
                                </span>
                                {profileLoading ? (
                                    <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                                ) : (
                                    <input
                                        type="text"
                                        name="flatNumber"
                                        value={userFlatNumber || userProfile?.flat || 'N/A'}
                                        readOnly
                                        className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 h-12 px-4 cursor-not-allowed"
                                    />
                                )}
                            </div>

                            {/* Billing Period */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold dark:text-gray-200">
                                    Billing Period <span className="text-red-500">*</span>
                                </span>
                                <input
                                    type="month"
                                    name="billingPeriod"
                                    required
                                    className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary focus:border-primary"
                                    defaultValue={getDefaultBillingPeriod()}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-gray-700/50" />

                    {/* Section 2: Usage Metrics */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                            2. Usage Metrics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Electricity */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold dark:text-gray-200 flex items-center gap-2">
                                    <Icon name="bolt" className="text-yellow-500" filled />
                                    Electricity Usage <span className="text-red-500">*</span>
                                </span>
                                <div className="flex items-center relative">
                                    <input
                                        type="number"
                                        name="electricity"
                                        min="0"
                                        required
                                        className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-14 px-4 pr-16 text-lg font-medium focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-4 text-gray-400 text-sm font-medium pointer-events-none">
                                        kWh
                                    </span>
                                </div>
                            </div>

                            {/* Water */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold dark:text-gray-200 flex items-center gap-2">
                                    <Icon name="water_drop" className="text-blue-500" filled />
                                    Water Usage <span className="text-red-500">*</span>
                                </span>
                                <div className="flex items-center relative">
                                    <input
                                        type="number"
                                        name="water"
                                        min="0"
                                        required
                                        className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-14 px-4 pr-16 text-lg font-medium focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-4 text-gray-400 text-sm font-medium pointer-events-none">
                                        Liters
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Waste Segregation */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                            3. Compliance
                        </h2>
                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-semibold dark:text-gray-200 flex items-center gap-2">
                                <Icon name="recycling" className="text-green-600 dark:text-green-400" />
                                Waste Segregation Status
                            </span>
                            <div className="grid grid-cols-3 gap-3 md:max-w-md">
                                {['yes', 'partial', 'no'].map((option) => (
                                    <label key={option} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="waste_segregation"
                                            value={option}
                                            checked={wasteSegregation === option}
                                            onChange={(e) => setWasteSegregation(e.target.value)}
                                            className="sr-only peer"
                                        />
                                        <div className={`flex items-center justify-center rounded-lg border-2 p-3 transition-all
                                            ${wasteSegregation === option
                                                ? option === 'yes' ? 'bg-primary border-primary text-black shadow-md'
                                                    : option === 'partial' ? 'bg-primary/60 border-primary/60 text-black shadow-md'
                                                        : 'bg-red-400 border-red-400 text-white shadow-md'
                                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}>
                                            <span className="text-sm font-bold capitalize">{option}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 sm:flex-initial"
                            disabled={submitting || profileLoading}
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Icon name="save" size={20} className="mr-2" />
                                    Save Record
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Recent History */}
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold dark:text-white">Recent Entries</h3>
                    <button
                        onClick={fetchHistory}
                        className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                    >
                        <Icon name="refresh" size={16} />
                        Refresh
                    </button>
                </div>

                <Card padding="p-0" className="overflow-hidden">
                    {historyLoading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="text-gray-500 mt-2">Loading history...</p>
                        </div>
                    ) : historyError ? (
                        <div className="p-8 text-center">
                            <Icon name="error" className="text-red-500 mx-auto" size={32} />
                            <p className="text-gray-500 mt-2">{historyError}</p>
                            <Button variant="ghost" size="sm" onClick={fetchHistory} className="mt-2">
                                Retry
                            </Button>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="p-8 text-center">
                            <Icon name="inbox" className="text-gray-400 mx-auto" size={32} />
                            <p className="text-gray-500 mt-2">No entries yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Flat</th>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Period</th>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Elec (kWh)</th>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Water (L)</th>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Waste</th>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {history.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 text-sm font-medium dark:text-gray-200">
                                                {row.building ? `${row.building}-${row.flatNumber}` : row.flatNumber || 'N/A'}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                {row.billingPeriodFormatted}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                {row.electricity}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                {row.water}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant={row.wasteDisplay?.variant || 'neutral'}>
                                                    {row.wasteDisplay?.label || row.wasteSegregation}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant={
                                                    row.status === 'approved' ? 'success' :
                                                        row.status === 'rejected' ? 'error' : 'warning'
                                                }>
                                                    {row.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
