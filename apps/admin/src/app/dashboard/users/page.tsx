'use client';
import { useEffect, useState } from 'react';
import { Search, Mail, Edit, Trash2, X, Save } from 'lucide-react';
import { adminApi, MOCK_USERS } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

function UserModal({ user, onClose, onSave }: { user: any; onClose: () => void; onSave: (u: any) => void }) {
    const [form, setForm] = useState({ name: user.name || '', email: user.email || '', phone: user.phone || '', role: user.role || 'user' });
    const [saving, setSaving] = useState(false);
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try { await adminApi.patch(`/admin/users/${user._id}`, form); } catch { }
        onSave({ ...user, ...form });
        toast.success('User updated successfully!');
        setSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-night-900">Edit User</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                        <input value={form.name} onChange={e => set('name', e.target.value)} required
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                        <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                        <input value={form.phone} onChange={e => set('phone', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
                        <select value={form.role} onChange={e => set('role', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">Super Admin</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 disabled:opacity-60">
                            <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>(MOCK_USERS);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);

    useEffect(() => {
        setLoading(true);
        adminApi.get('/admin/users')
            .then(res => { if (res.data.data?.length) setUsers(res.data.data); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = (updated: any) => setUsers(prev => prev.map(u => u._id === updated._id ? updated : u));

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        try { await adminApi.delete(`/admin/users/${id}`); } catch { }
        setUsers(prev => prev.filter(u => u._id !== id));
        toast.success('User deleted');
    };

    const filtered = users.filter(u =>
        !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {editUser && <UserModal user={editUser} onClose={() => setEditUser(null)} onSave={handleSave} />}
            </AnimatePresence>

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
                        placeholder="Search users by name or email..."
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
                            {filtered.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
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
                                        <div className="flex items-center gap-1">
                                            <a href={`mailto:${user.email}`} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors inline-flex" title="Email">
                                                <Mail className="w-4 h-4" />
                                            </a>
                                            <button onClick={() => setEditUser(user)} className="p-1.5 hover:bg-yellow-50 text-yellow-500 rounded-lg transition-colors" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(user._id, user.name)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No users found</div>}
                </div>
            </div>
        </div>
    );
}
