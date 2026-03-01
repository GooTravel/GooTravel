'use client';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Package, DollarSign, Star, ArrowUpRight } from 'lucide-react';
import { MOCK_REVENUE_CHART } from '@/lib/api';

const BOOKING_STATUS = [
    { label: 'Confirmed', value: 189, color: '#22c55e', pct: 62 },
    { label: 'Pending', value: 31, color: '#f59e0b', pct: 13 },
    { label: 'Cancelled', value: 14, color: '#ef4444', pct: 6 },
    { label: 'Completed', value: 58, color: '#3b82f6', pct: 19 },
];

const TOP_DESTINATIONS = [
    { name: 'Kashmir', bookings: 68, revenue: 1292032, growth: 24 },
    { name: 'Goa', bookings: 54, revenue: 701946, growth: 18 },
    { name: 'Manali', bookings: 47, revenue: 563953, growth: 31 },
    { name: 'Kerala', bookings: 42, revenue: 713958, growth: 15 },
    { name: 'Leh Ladakh', bookings: 23, revenue: 689977, growth: 42 },
];

const LEAD_FUNNEL = [
    { stage: 'Total Leads', count: 412, color: 'bg-blue-500' },
    { stage: 'Contacted', count: 289, color: 'bg-indigo-500' },
    { stage: 'Interested', count: 176, color: 'bg-purple-500' },
    { stage: 'Converted', count: 98, color: 'bg-green-500' },
];

const MONTHLY = [
    { month: 'Oct', revenue: 680000, bookings: 182 },
    { month: 'Nov', revenue: 820000, bookings: 201 },
    { month: 'Dec', revenue: 1050000, bookings: 243 },
    { month: 'Jan', revenue: 940000, bookings: 198 },
    { month: 'Feb', revenue: 980000, bookings: 234 },
];

function MiniBarChart({ data }: { data: typeof MOCK_REVENUE_CHART }) {
    const max = Math.max(...data.map(d => d.revenue));
    return (
        <div className="flex items-end gap-1 h-24">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-sm bg-brand-500/80 hover:bg-brand-500 transition-colors cursor-pointer"
                        style={{ height: `${(d.revenue / max) * 100}%`, minHeight: 2 }} title={`${d._id}: ₹${d.revenue.toLocaleString('en-IN')}`} />
                </div>
            ))}
        </div>
    );
}

function DonutChart({ segments }: { segments: typeof BOOKING_STATUS }) {
    const total = segments.reduce((a, s) => a + s.value, 0);
    let cumulative = 0;
    const r = 70, cx = 85, cy = 85, strokeWidth = 22;
    const circum = 2 * Math.PI * r;
    return (
        <div className="flex items-center gap-6">
            <svg viewBox="0 0 170 170" className="w-36 h-36 -rotate-90">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
                {segments.map((s, i) => {
                    const pct = s.value / total;
                    const dashArray = pct * circum;
                    const dashOffset = -cumulative * circum;
                    cumulative += pct;
                    return (
                        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={strokeWidth}
                            strokeDasharray={`${dashArray} ${circum}`} strokeDashoffset={dashOffset} strokeLinecap="round" />
                    );
                })}
            </svg>
            <div className="space-y-2">
                {segments.map(s => (
                    <div key={s.label} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-gray-600">{s.label}</span>
                        <span className="font-semibold text-night-900 ml-auto pl-4">{s.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<'14d' | '30d'>('14d');
    const chartData = MOCK_REVENUE_CHART.slice(period === '14d' ? 0 : -30);

    const kpis = [
        { label: 'Total Revenue', value: '₹52.8L', change: +18, icon: DollarSign, color: 'text-green-600 bg-green-50' },
        { label: 'Bookings', value: '234', change: +12, icon: Package, color: 'text-blue-600 bg-blue-50' },
        { label: 'Active Users', value: '1,847', change: +31, icon: Users, color: 'text-purple-600 bg-purple-50' },
        { label: 'Avg. Rating', value: '4.8★', change: +0.2, icon: Star, color: 'text-yellow-600 bg-yellow-50' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Analytics</h1>
                    <p className="text-gray-400 text-sm">Platform performance overview</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                    {(['14d', '30d'] as const).map(p => (
                        <button key={p} onClick={() => setPeriod(p)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${period === p ? 'bg-white shadow-sm text-night-900' : 'text-gray-500'}`}>
                            {p === '14d' ? 'Last 14 Days' : 'Last 30 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map(kpi => (
                    <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color}`}>
                                <kpi.icon className="w-5 h-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {kpi.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-night-900">{kpi.value}</p>
                        <p className="text-gray-400 text-xs mt-1">{kpi.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-night-900">Revenue Trend</h3>
                            <p className="text-gray-400 text-sm">Daily revenue for selected period</p>
                        </div>
                    </div>
                    <MiniBarChart data={chartData} />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>{chartData[0]?._id}</span>
                        <span>{chartData[chartData.length - 1]?._id}</span>
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-night-900 mb-1">Booking Status</h3>
                    <p className="text-gray-400 text-sm mb-5">Breakdown by status</p>
                    <DonutChart segments={BOOKING_STATUS} />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Top Destinations */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-night-900 mb-5">Top Destinations</h3>
                    <div className="space-y-4">
                        {TOP_DESTINATIONS.map((d, i) => {
                            const maxRev = Math.max(...TOP_DESTINATIONS.map(x => x.revenue));
                            return (
                                <div key={d.name}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
                                            <span className="text-sm font-semibold text-night-900">{d.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-gray-500">{d.bookings} bookings</span>
                                            <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
                                                <ArrowUpRight className="w-3 h-3" />{d.growth}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${(d.revenue / maxRev) * 100}%` }} />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">₹{d.revenue.toLocaleString('en-IN')} revenue</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Lead Funnel */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-night-900 mb-1">Lead Conversion Funnel</h3>
                    <p className="text-gray-400 text-sm mb-5">Pipeline from inquiry to booking</p>
                    <div className="space-y-4">
                        {LEAD_FUNNEL.map((s, i) => {
                            const pct = Math.round((s.count / LEAD_FUNNEL[0].count) * 100);
                            return (
                                <div key={s.stage}>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-sm font-medium text-night-900">{s.stage}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-night-900">{s.count}</span>
                                            <span className="text-xs text-gray-400">{pct}%</span>
                                        </div>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm text-gray-600">Conversion Rate</span>
                            <span className="text-lg font-bold text-green-600">23.8%</span>
                        </div>
                    </div>
                </div>

                {/* Monthly Comparison */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-night-900 mb-5">Monthly Performance</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['Month', 'Revenue', 'Bookings', 'Avg. Booking Value', 'Growth'].map(h => (
                                        <th key={h} className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {MONTHLY.map((m, i) => {
                                    const prev = MONTHLY[i - 1];
                                    const growth = prev ? Math.round(((m.revenue - prev.revenue) / prev.revenue) * 100) : null;
                                    return (
                                        <tr key={m.month} className="hover:bg-gray-50/50">
                                            <td className="py-3 font-semibold text-night-900">{m.month} 2025</td>
                                            <td className="py-3 font-semibold text-night-900">₹{m.revenue.toLocaleString('en-IN')}</td>
                                            <td className="py-3 text-gray-600">{m.bookings}</td>
                                            <td className="py-3 text-gray-600">₹{Math.round(m.revenue / m.bookings).toLocaleString('en-IN')}</td>
                                            <td className="py-3">
                                                {growth !== null ? (
                                                    <span className={`flex items-center gap-1 font-semibold text-xs ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {growth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                                        {growth >= 0 ? '+' : ''}{growth}%
                                                    </span>
                                                ) : <span className="text-gray-400 text-xs">—</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
