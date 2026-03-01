'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, ChevronDown } from 'lucide-react';
import { adminApi, MOCK_BOOKINGS } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
};

const PAYMENT_COLORS: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    partial: 'bg-orange-100 text-orange-700',
    refunded: 'bg-gray-100 text-gray-600',
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>(MOCK_BOOKINGS);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        adminApi.get('/admin/bookings')
            .then(res => { if (res.data.data?.length) setBookings(res.data.data); })
            .catch(() => setBookings(MOCK_BOOKINGS))
            .finally(() => setLoading(false));
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try { await adminApi.patch(`/admin/bookings/${id}/status`, { status }); } catch { }
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
    };

    const filtered = bookings.filter(b => {
        const matchStatus = statusFilter === 'all' || b.status === statusFilter;
        const matchSearch = !search || b.userName?.toLowerCase().includes(search.toLowerCase()) || b.destination?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + (b.totalCost || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Bookings</h1>
                    <p className="text-gray-400 text-sm">{bookings.length} total · Confirmed revenue: ₹{totalRevenue.toLocaleString('en-IN')}</p>
                </div>
                {loading && <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />}
            </div>

            {/* Summary tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['confirmed', 'pending', 'completed', 'cancelled'].map(s => (
                    <div key={s} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <p className="text-sm text-gray-500 capitalize">{s}</p>
                        <p className="text-2xl font-bold text-night-900">{bookings.filter(b => b.status === s).length}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, destination..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${statusFilter === s ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Traveler', 'Destination', 'Travel Date', 'Travelers', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((b, i) => (
                                <motion.tr key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                    className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-night-900">{b.userName || b.userId?.name}</p>
                                        <p className="text-xs text-gray-400">{b.userEmail || b.userId?.email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{b.destination || b.destinationId?.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{b.travelDate ? new Date(b.travelDate).toLocaleDateString('en-IN') : '—'}</td>
                                    <td className="px-4 py-3 text-gray-600">{b.travelers}</td>
                                    <td className="px-4 py-3 font-semibold text-night-900">₹{(b.totalCost || 0).toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${PAYMENT_COLORS[b.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                                            {b.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="relative">
                                            <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}
                                                className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none appearance-none pr-6 capitalize ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {['confirmed', 'pending', 'completed', 'cancelled'].map(s => <option key={s} value={s} className="bg-white text-gray-900 capitalize">{s}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <a href={`/dashboard/bookings/${b._id}`} className="p-1.5 hover:bg-brand-50 text-brand-500 rounded-lg transition-colors inline-flex" title="View">
                                            <Eye className="w-4 h-4" />
                                        </a>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No bookings found</div>}
                </div>
            </div>
        </div>
    );
}
