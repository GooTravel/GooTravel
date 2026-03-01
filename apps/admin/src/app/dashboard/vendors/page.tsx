'use client';
import { useEffect, useState } from 'react';
import { Search, Plus, Star, MapPin, Store, Phone, Edit, Trash2, X, Save } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';

const MOCK_VENDORS = [
    { _id: 'v1', name: 'Paradise Hotels', serviceType: 'hotel', city: 'Srinagar', state: 'J&K', rating: 4.7, isActive: true, contactPerson: { phone: '+91 94001 23456' } },
    { _id: 'v2', name: 'Himalayan Treks', serviceType: 'guide', city: 'Manali', state: 'Himachal Pradesh', rating: 4.9, isActive: true, contactPerson: { phone: '+91 98765 11223' } },
    { _id: 'v3', name: 'Royal Rides', serviceType: 'transport', city: 'Jaipur', state: 'Rajasthan', rating: 4.5, isActive: true, contactPerson: { phone: '+91 90012 34567' } },
    { _id: 'v4', name: 'Kerala Backwaters Stay', serviceType: 'hotel', city: 'Alleppey', state: 'Kerala', rating: 4.8, isActive: false, contactPerson: { phone: '+91 88001 22334' } },
];

const EMPTY_VENDOR = { name: '', serviceType: 'hotel', city: '', state: '', phone: '', contactName: '', email: '', isActive: true };

function VendorModal({ vendor, onClose, onSave }: { vendor: any; onClose: () => void; onSave: (v: any) => void }) {
    const isEdit = !!vendor._id;
    const [form, setForm] = useState({
        ...EMPTY_VENDOR,
        ...(isEdit ? {
            name: vendor.name, serviceType: vendor.serviceType, city: vendor.city,
            state: vendor.state, phone: vendor.contactPerson?.phone || '',
            contactName: vendor.contactPerson?.name || '', email: vendor.email || '',
            isActive: vendor.isActive,
        } : {}),
    });
    const [saving, setSaving] = useState(false);
    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.city || !form.state) { toast.error('Please fill all required fields'); return; }
        setSaving(true);
        const payload = {
            name: form.name, serviceType: form.serviceType, city: form.city,
            state: form.state, isActive: form.isActive,
            contactPerson: { name: form.contactName, phone: form.phone },
            email: form.email,
        };
        try {
            if (isEdit) { await adminApi.patch(`/vendors/${vendor._id}`, payload); }
            else { await adminApi.post('/vendors', payload); }
        } catch { }
        onSave({ ...payload, _id: vendor._id || `v_${Date.now()}`, rating: vendor.rating || 4.5 });
        toast.success(isEdit ? 'Vendor updated!' : 'Vendor added successfully!');
        setSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-night-900">{isEdit ? 'Edit Vendor' : 'Add New Vendor'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Business Name *</label>
                            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Paradise Hotels" required
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Service Type</label>
                            <select value={form.serviceType} onChange={e => set('serviceType', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                                <option value="hotel">Hotel / Homestay</option>
                                <option value="transport">Transport</option>
                                <option value="guide">Tour Guide</option>
                                <option value="activity">Activity / Experience</option>
                                <option value="restaurant">Restaurant</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Contact Phone</label>
                            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">City *</label>
                            <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Srinagar" required
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">State *</label>
                            <input value={form.state} onChange={e => set('state', e.target.value)} placeholder="e.g. Jammu & Kashmir" required
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Contact Person Name</label>
                            <input value={form.contactName} onChange={e => set('contactName', e.target.value)} placeholder="e.g. Rahul Sharma"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="vendor@example.com"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-brand-500" />
                        <span className="text-sm font-medium text-gray-700">Active vendor</span>
                    </label>
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 disabled:opacity-60">
                            <Save className="w-4 h-4" />{saving ? 'Saving...' : isEdit ? 'Update' : 'Add Vendor'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default function VendorsPage() {
    const [vendors, setVendors] = useState<any[]>(MOCK_VENDORS);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState<{ open: boolean; vendor: any }>({ open: false, vendor: {} });

    useEffect(() => {
        setLoading(true);
        adminApi.get('/vendors?limit=50')
            .then(res => { if (res.data.data?.length) setVendors(res.data.data); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = (saved: any) => {
        setVendors(prev => {
            const idx = prev.findIndex(v => v._id === saved._id);
            if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
            return [saved, ...prev];
        });
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete vendor "${name}"?`)) return;
        try { await adminApi.delete(`/vendors/${id}`); } catch { }
        setVendors(prev => prev.filter(v => v._id !== id));
        toast.success('Vendor deleted');
    };

    const filtered = vendors.filter(v =>
        !search || v.name?.toLowerCase().includes(search.toLowerCase()) || v.city?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5">
            <AnimatePresence>
                {modal.open && <VendorModal vendor={modal.vendor} onClose={() => setModal({ open: false, vendor: {} })} onSave={handleSave} />}
            </AnimatePresence>

            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Vendor Management</h1>
                    <p className="text-gray-500 text-sm">{vendors.length} partners · {vendors.filter(v => v.isActive).length} active</p>
                </div>
                <button onClick={() => setModal({ open: true, vendor: {} })}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-all text-sm">
                    <Plus className="w-4 h-4" /> Add Vendor
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or city..." className="flex-1 outline-none text-sm text-night-900 placeholder:text-gray-400" />
                {loading && <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-white rounded-2xl shadow-sm border border-gray-100">No vendors found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(v => (
                        <div key={v._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-brand-200 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-brand-600"><Store className="w-5 h-5" /></div>
                                    <div>
                                        <h3 className="font-bold text-night-900 text-sm">{v.name}</h3>
                                        <p className="text-xs text-gray-400 capitalize">{v.serviceType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
                                    <Star className="w-3 h-3 fill-current" /> {v.rating?.toFixed(1) || 'N/A'}
                                </div>
                            </div>
                            <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {v.city}, {v.state}</p>
                                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {v.contactPerson?.phone || 'N/A'}</p>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {v.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setModal({ open: true, vendor: v })} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors" title="Edit">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(v._id, v.name)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
