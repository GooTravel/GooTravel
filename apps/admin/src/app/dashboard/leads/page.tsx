'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Phone, Mail, MessageSquare, ChevronDown, Eye } from 'lucide-react';
import { adminApi, MOCK_LEADS } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
    new: 'bg-orange-100 text-orange-700',
    contacted: 'bg-blue-100 text-blue-700',
    converted: 'bg-green-100 text-green-700',
    lost: 'bg-gray-100 text-gray-600',
};

const STATUSES = ['all', 'new', 'contacted', 'converted', 'lost'];

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>(MOCK_LEADS);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        adminApi.get('/admin/leads')
            .then(res => { if (res.data.data?.length) setLeads(res.data.data); })
            .catch(() => setLeads(MOCK_LEADS))
            .finally(() => setLoading(false));
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try { await adminApi.patch(`/admin/leads/${id}`, { status }); } catch { }
        setLeads(prev => prev.map(l => l._id === id ? { ...l, status } : l));
    };

    const filtered = leads.filter(l => {
        const matchStatus = filter === 'all' || l.status === filter;
        const matchSearch = !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.destination?.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search);
        return matchStatus && matchSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Leads CRM</h1>
                    <p className="text-gray-400 text-sm">{leads.length} total leads · {leads.filter(l => l.status === 'new').length} new</p>
                </div>
                {loading && <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, destination, phone..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === s ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
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
                                {['Lead', 'Destination', 'Travelers', 'Budget', 'Source', 'Status', 'Date', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((lead, i) => (
                                <motion.tr key={lead._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                    className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-night-900">{lead.name}</p>
                                        <p className="text-xs text-gray-400">{lead.email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{lead.destination}</td>
                                    <td className="px-4 py-3 text-gray-600">{lead.travelers}</td>
                                    <td className="px-4 py-3 font-medium text-night-900">₹{(lead.budget || 0).toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">{lead.source?.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="relative">
                                            <select value={lead.status} onChange={e => updateStatus(lead._id, e.target.value)}
                                                className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none appearance-none pr-6 ${STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {['new', 'contacted', 'converted', 'lost'].map(s => <option key={s} value={s} className="bg-white text-gray-900">{s}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <a href={`tel:${lead.phone}`} className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors" title="Call">
                                                <Phone className="w-4 h-4" />
                                            </a>
                                            <a href={`mailto:${lead.email}`} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Email">
                                                <Mail className="w-4 h-4" />
                                            </a>
                                            <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors" title="WhatsApp">
                                                <MessageSquare className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-gray-400 text-sm">No leads found</div>
                    )}
                </div>
            </div>
        </div>
    );
}
