'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, FileText, Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { adminApi, MOCK_STATS, MOCK_REVENUE_CHART } from '@/lib/api';

function StatCard({ title, value, icon: Icon, color, sub, delay = 0 }: any) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold text-night-900">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </motion.div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(MOCK_STATS);
    const [revenueData, setRevenueData] = useState<any[]>(MOCK_REVENUE_CHART);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            adminApi.get('/admin/stats'),
            adminApi.get('/admin/revenue-chart?period=30'),
        ])
            .then(([statsRes, revenueRes]) => {
                setStats(statsRes.data.data || MOCK_STATS);
                setRevenueData(revenueRes.data.data?.length ? revenueRes.data.data : MOCK_REVENUE_CHART);
            })
            .catch(() => {
                setStats(MOCK_STATS);
                setRevenueData(MOCK_REVENUE_CHART);
            })
            .finally(() => setLoading(false));
    }, []);

    const statCards = [
        { title: 'Total Revenue', value: `₹${((stats.totalRevenue || 0) / 100000).toFixed(1)}L`, icon: DollarSign, color: 'bg-green-500', sub: `₹${((stats.monthRevenue || 0) / 100000).toFixed(1)}L this month` },
        { title: 'Total Bookings', value: stats.totalBookings || 0, icon: Package, color: 'bg-blue-500', sub: `${stats.todayBookings || 0} today` },
        { title: 'Confirmed', value: stats.confirmedBookings || 0, icon: CheckCircle, color: 'bg-emerald-500' },
        { title: 'Total Leads', value: stats.totalLeads || 0, icon: FileText, color: 'bg-brand-500', sub: `${stats.newLeads || 0} new` },
        { title: 'Users', value: stats.totalUsers || 0, icon: Users, color: 'bg-purple-500' },
        { title: 'New Leads', value: stats.newLeads || 0, icon: AlertCircle, color: 'bg-orange-500' },
        { title: 'Conversion', value: `${stats.totalLeads > 0 ? Math.round((stats.confirmedBookings / stats.totalLeads) * 100) : 0}%`, icon: TrendingUp, color: 'bg-indigo-500' },
        { title: 'Month Revenue', value: `₹${((stats.monthRevenue || 0) / 100000).toFixed(1)}L`, icon: DollarSign, color: 'bg-teal-500' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Dashboard</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Last updated: {new Date().toLocaleString('en-IN')}</p>
                </div>
                {loading && <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s, i) => <StatCard key={i} {...s} delay={i * 0.05} />)}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-semibold text-night-900 mb-5">Revenue (Last 14 Days)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="_id" tickFormatter={v => v.slice(5)} tick={{ fontSize: 11 }} />
                            <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
                            <Area type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-semibold text-night-900 mb-5">Daily Bookings</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="_id" tickFormatter={v => v.slice(5)} tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="bookings" fill="#1a1a2e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Recent data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-night-900">New Leads</h3>
                        <a href="/dashboard/leads" className="text-sm text-brand-500 hover:text-brand-600 font-medium">View All →</a>
                    </div>
                    <div className="space-y-3">
                        {stats.recentLeads?.map((lead: any) => (
                            <div key={lead._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-brand-50 transition-colors">
                                <div>
                                    <p className="font-medium text-night-900 text-sm">{lead.contactDetails?.name || lead.name}</p>
                                    <p className="text-xs text-gray-400">{lead.destinationId?.name || lead.destination} · {lead.contactDetails?.phone || lead.phone}</p>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">New</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-night-900">Recent Bookings</h3>
                        <a href="/dashboard/bookings" className="text-sm text-brand-500 hover:text-brand-600 font-medium">View All →</a>
                    </div>
                    <div className="space-y-3">
                        {stats.recentBookings?.map((b: any) => (
                            <div key={b._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                <div>
                                    <p className="font-medium text-night-900 text-sm">{b.userId?.name || b.userName}</p>
                                    <p className="text-xs text-gray-400">{b.destinationId?.name || b.destination} · ₹{(b.totalCost || 0).toLocaleString('en-IN')}</p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {b.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
