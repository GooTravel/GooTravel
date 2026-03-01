'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, ToggleLeft, ToggleRight, Star, Clock, DollarSign, X, Save, Trash2 } from 'lucide-react';
import { adminApi, MOCK_DESTINATIONS } from '@/lib/api';
import toast from 'react-hot-toast';

const EMPTY_DEST = {
    name: '', slug: '', state: '', description: '',
    basePrice: '', duration: '', rating: 4.5, reviewCount: 0,
    isFeatured: false, isActive: true, highlights: '',
    travelType: 'leisure', difficulty: 'easy',
};

function DestinationModal({ dest, onClose, onSave }: { dest: any; onClose: () => void; onSave: (d: any) => void }) {
    const [form, setForm] = useState({ ...EMPTY_DEST, ...dest });
    const [saving, setSaving] = useState(false);
    const isEdit = !!dest._id;

    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.state || !form.basePrice || !form.duration) {
            toast.error('Please fill all required fields');
            return;
        }
        setSaving(true);
        const payload = {
            ...form,
            basePrice: Number(form.basePrice),
            duration: Number(form.duration),
            highlights: typeof form.highlights === 'string'
                ? form.highlights.split(',').map((h: string) => h.trim()).filter(Boolean)
                : form.highlights,
            slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        };
        try {
            if (isEdit) {
                await adminApi.patch(`/destinations/${dest._id}`, payload);
            } else {
                await adminApi.post('/destinations', payload);
            }
        } catch { /* offline — still update UI */ }
        onSave({ ...payload, _id: dest._id || `d_${Date.now()}` });
        toast.success(isEdit ? 'Destination updated!' : 'Destination created!');
        setSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-night-900">{isEdit ? 'Edit Destination' : 'Add New Destination'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Kashmir"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">State *</label>
                            <input value={form.state} onChange={e => set('state', e.target.value)} placeholder="e.g. Jammu & Kashmir"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">URL Slug</label>
                            <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="auto-generated if blank"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Base Price (₹) *</label>
                            <input type="number" value={form.basePrice} onChange={e => set('basePrice', e.target.value)} placeholder="e.g. 18999" min={0}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Duration (Days) *</label>
                            <input type="number" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="e.g. 7" min={1}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Travel Type</label>
                            <select value={form.travelType} onChange={e => set('travelType', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                                {['leisure', 'adventure', 'honeymoon', 'family', 'pilgrimage', 'wildlife'].map(t => (
                                    <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Difficulty</label>
                            <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                                {['easy', 'moderate', 'challenging'].map(d => (
                                    <option key={d} value={d} className="capitalize">{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Rating (1–5)</label>
                            <input type="number" step="0.1" min={1} max={5} value={form.rating} onChange={e => set('rating', Number(e.target.value))}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Describe this destination..."
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Highlights (comma-separated)</label>
                        <input value={Array.isArray(form.highlights) ? form.highlights.join(', ') : form.highlights}
                            onChange={e => set('highlights', e.target.value)}
                            placeholder="Dal Lake, Gulmarg, Pahalgam, Shikara Ride"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                    </div>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-brand-500" />
                            <span className="text-sm font-medium text-gray-700">Active (visible to users)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-brand-500" />
                            <span className="text-sm font-medium text-gray-700">Featured (shown on homepage)</span>
                        </label>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors disabled:opacity-60">
                            <Save className="w-4 h-4" />{saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<any[]>(MOCK_DESTINATIONS);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState<{ open: boolean; dest: any }>({ open: false, dest: {} });

    useEffect(() => {
        setLoading(true);
        adminApi.get('/destinations?limit=50')
            .then(res => { if (res.data.data?.length) setDestinations(res.data.data); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const openAdd = () => setModal({ open: true, dest: {} });
    const openEdit = (dest: any) => setModal({ open: true, dest });

    const handleSave = (saved: any) => {
        setDestinations(prev => {
            const idx = prev.findIndex(d => d._id === saved._id);
            if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
            return [saved, ...prev];
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this destination? This cannot be undone.')) return;
        try { await adminApi.delete(`/destinations/${id}`); } catch { }
        setDestinations(prev => prev.filter(d => d._id !== id));
        toast.success('Destination deleted');
    };

    const toggleActive = async (id: string, isActive: boolean) => {
        try { await adminApi.patch(`/destinations/${id}`, { isActive: !isActive }); } catch { }
        setDestinations(prev => prev.map(d => d._id === id ? { ...d, isActive: !isActive } : d));
        toast.success(!isActive ? 'Destination activated — now visible to users' : 'Destination deactivated — hidden from users');
    };

    const toggleFeatured = async (id: string, isFeatured: boolean) => {
        try { await adminApi.patch(`/destinations/${id}`, { isFeatured: !isFeatured }); } catch { }
        setDestinations(prev => prev.map(d => d._id === id ? { ...d, isFeatured: !isFeatured } : d));
    };

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {modal.open && (
                    <DestinationModal dest={modal.dest} onClose={() => setModal({ open: false, dest: {} })} onSave={handleSave} />
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Destinations</h1>
                    <p className="text-gray-400 text-sm">{destinations.length} total · {destinations.filter(d => d.isActive).length} active · {destinations.filter(d => d.isFeatured).length} featured</p>
                </div>
                <div className="flex items-center gap-3">
                    {loading && <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />}
                    <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-all text-sm">
                        <Plus className="w-4 h-4" /> Add Destination
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {destinations.map((dest) => (
                    <div key={dest._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gradient-to-r from-night-900 to-night-800 p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                                    <p className="text-white/60 text-sm">{dest.state}</p>
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                    {dest.isFeatured && <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">Featured</span>}
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dest.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                        {dest.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1 text-white/70"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{dest.rating}</span>
                                <span className="flex items-center gap-1 text-white/70"><Clock className="w-3.5 h-3.5" />{dest.duration}D</span>
                                <span className="flex items-center gap-1 text-white/70"><DollarSign className="w-3.5 h-3.5" />₹{dest.basePrice?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button onClick={() => toggleActive(dest._id, dest.isActive)}
                                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${dest.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                                    {dest.isActive ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                                    {dest.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button onClick={() => toggleFeatured(dest._id, dest.isFeatured)}
                                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${dest.isFeatured ? 'text-gray-500 hover:bg-gray-50' : 'text-brand-500 hover:bg-brand-50'}`}>
                                    <Star className="w-4 h-4" />
                                    {dest.isFeatured ? 'Unfeature' : 'Feature'}
                                </button>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => openEdit(dest)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors" title="Edit">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(dest._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
