import { useState } from 'react';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';
import Badge from '../components/atoms/Badge';

export default function InputDataPage() {
    const [wasteSegregation, setWasteSegregation] = useState('yes');

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            building: formData.get('building'),
            flatNumber: formData.get('flatNumber'),
            billingPeriod: formData.get('billingPeriod'),
            electricity: formData.get('electricity'),
            water: formData.get('water'),
            wasteSegregation: formData.get('waste_segregation'),
        };
        console.log('Form submitted:', data);
        // Add your form submission logic here
    };

    const handleReset = (e) => {
        e.preventDefault();
        e.target.form.reset();
        setWasteSegregation('yes');
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Page Heading */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black dark:text-white">Monthly Consumption Entry</h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                    Select a resident flat and enter utility usage metrics for the current billing cycle. Ensure all values are verified before saving.
                </p>
            </div>

            {/* Main Entry Card */}
            <Card className="flex flex-col gap-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {/* Section 1: Target Selection */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">1. Select Target</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Building Select */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold dark:text-gray-200">Building / Block</span>
                                <div className="relative">
                                    <select name="building" className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white h-12 px-4 pr-10 appearance-none focus:ring-2 focus:ring-primary focus:border-primary">
                                        <option value="">Select Block</option>
                                        <option value="A">Block A</option>
                                        <option value="B">Block B</option>
                                        <option value="C">Block C</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <Icon name="expand_more" />
                                    </div>
                                </div>
                            </div>

                            {/* Flat Number */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold dark:text-gray-200">Flat Number</span>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="flatNumber"
                                        className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white h-12 px-4 pr-10 focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="e.g. 402"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                        <Icon name="search" size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Billing Period */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold dark:text-gray-200">Billing Period</span>
                                <input
                                    type="month"
                                    name="billingPeriod"
                                    className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary focus:border-primary"
                                    defaultValue="2023-10"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-gray-700/50" />

                    {/* Section 2: Usage Metrics */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">2. Usage Metrics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Electricity */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold dark:text-gray-200 flex items-center gap-2">
                                    <Icon name="bolt" className="text-yellow-500" filled />
                                    Electricity Usage
                                </span>
                                <div className="flex items-center relative">
                                    <input
                                        type="number"
                                        name="electricity"
                                        min="0"
                                        className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-14 px-4 pr-16 text-lg font-medium focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-4 text-gray-400 text-sm font-medium pointer-events-none">kWh</span>
                                </div>
                            </div>

                            {/* Water */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold dark:text-gray-200 flex items-center gap-2">
                                    <Icon name="water_drop" className="text-blue-500" filled />
                                    Water Usage
                                </span>
                                <div className="flex items-center relative">
                                    <input
                                        type="number"
                                        name="water"
                                        min="0"
                                        className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-14 px-4 pr-16 text-lg font-medium focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-4 text-gray-400 text-sm font-medium pointer-events-none">Liters</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Waste Segregation */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">3. Compliance</h2>
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
                        <Button type="button" variant="secondary" className="flex-1 sm:flex-initial" onClick={handleReset}>
                            Clear Form
                        </Button>
                        <Button type="submit" className="flex-1 sm:flex-initial">
                            <Icon name="save" size={20} className="mr-2" />
                            Save Record
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Recent History */}
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold dark:text-white">Recent Entries</h3>
                    <a href="#" className="text-sm text-primary font-medium hover:underline">View All</a>
                </div>

                <Card padding="p-0" className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                                <tr>
                                    <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Flat</th>
                                    <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Period</th>
                                    <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Elec (kWh)</th>
                                    <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Water (L)</th>
                                    <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Waste</th>
                                    <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {[
                                    { flat: 'A-104', period: 'Oct 2023', elec: 245, water: 1200, waste: 'success' },
                                    { flat: 'B-202', period: 'Oct 2023', elec: 310, water: 1450, waste: 'warning' },
                                    { flat: 'C-405', period: 'Oct 2023', elec: 189, water: 980, waste: 'success' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4 text-sm font-medium dark:text-gray-200">{row.flat}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{row.period}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{row.elec}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{row.water}</td>
                                        <td className="py-3 px-4">
                                            <Badge variant={row.waste}>
                                                {row.waste === 'success' ? 'Yes' : 'Partial'}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button className="text-gray-400 hover:text-primary transition-colors">
                                                <Icon name="edit" size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
