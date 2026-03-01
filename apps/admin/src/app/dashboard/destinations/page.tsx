'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, ToggleLeft, ToggleRight, Star, Clock, DollarSign } from 'lucide-react';
import { adminApi, MOCK_DESTINATIONS } from '@/lib/api';

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<any[]>(MOCK_DESTINATIONS);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        adminApi.get('/destinations?limit=50')
            .then(res => { if (res.data.data?.length) setDestinations(res.data.data); })
            .catch(() => setDestinations(MOCK_DESTINATIONS))
            .finally(() => setLoading(false));
    }, []);

    const toggleActive = async (id: string, isActive: boolean) => {
        try { await adminApi.patch(`/destinations/${id}`, { isActive: !isActive }); } catch { }
        setDestinations(prev => prev.map(d => d._id === id ? { ...d, isActive: !isActive } : d));
    };

    const toggleFeatured = async (id: string, isFeatured: boolean) => {
        try { await adminApi.patch(`/destinations/${id}`, { isFeatured: !isFeatured }); } catch { }
        setDestinations(prev => prev.map(d => d._id === id ? { ...d, isFeatured: !isFeatured } : d));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Destinations</h1>
                    <p className="text-gray-400 text-sm">{destinations.length} destinations · {destinations.filter(d => d.isActive).length} active</p>
                </div>
                <div className="flex items-center gap-3">
                    {loading && <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />}
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-all text-sm">
                        <Plus className="w-4 h-4" /> Add Destination
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {destinations.map((dest, i) => (
                    <motion.div key={dest._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                            <div className="flex gap-3">
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
                            <button className="p-2 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors" title="Edit">
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
