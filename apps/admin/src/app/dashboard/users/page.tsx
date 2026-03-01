'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, ShieldOff, Mail } from 'lucide-react';
import { adminApi, MOCK_USERS } from '@/lib/api';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>(MOCK_USERS);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        adminApi.get('/admin/users')
            .then(res => { if (res.data.data?.length) setUsers(res.data.data); })
            .catch(() => setUsers(MOCK_USERS))
            .finally(() => setLoading(false));
    }, []);

    const filtered = users.filter(u =>
        !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Users</h1>
                    <p className="text-gray-400 text-sm">{users.length} registered users</p>
                </div>
                {loading && <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['User', 'Phone', 'Role', 'Bookings', 'Total Spent', 'Joined', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((user, i) => (
                                <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                    className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                                                {user.name?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-night-900">{user.name}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{user.phone}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${user.role === 'admin' || user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{user.bookingsCount || 0}</td>
                                    <td className="px-4 py-3 font-semibold text-night-900">₹{(user.totalSpent || 0).toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                                    <td className="px-4 py-3">
                                        <a href={`mailto:${user.email}`} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors inline-flex" title="Email">
                                            <Mail className="w-4 h-4" />
                                        </a>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No users found</div>}
                </div>
            </div>
        </div>
    );
}
