'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Check, X } from 'lucide-react';
import { adminApi, MOCK_REVIEWS } from '@/lib/api';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>(MOCK_REVIEWS);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        adminApi.get('/admin/reviews')
            .then(res => { if (res.data.data?.length) setReviews(res.data.data); })
            .catch(() => setReviews(MOCK_REVIEWS))
            .finally(() => setLoading(false));
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try { await adminApi.patch(`/admin/reviews/${id}`, { status }); } catch { }
        setReviews(prev => prev.map(r => r._id === id ? { ...r, status } : r));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-night-900">Reviews</h1>
                    <p className="text-gray-400 text-sm">{reviews.length} total · {reviews.filter(r => r.status === 'pending').length} awaiting approval</p>
                </div>
                {loading && <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {reviews.map((review, i) => (
                    <motion.div key={review._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                                    {review.userName?.[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-night-900">{review.userName}</p>
                                    <p className="text-xs text-gray-400">{review.destination}</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${review.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {review.status}
                            </span>
                        </div>

                        <div className="flex gap-0.5 mb-2">
                            {[...Array(5)].map((_, j) => (
                                <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                            ))}
                        </div>

                        {review.title && <p className="font-semibold text-sm text-night-900 mb-1">{review.title}</p>}
                        <p className="text-sm text-gray-500 leading-relaxed mb-4">{review.text}</p>

                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                            <div className="flex gap-2">
                                {review.status !== 'published' && (
                                    <button onClick={() => updateStatus(review._id, 'published')}
                                        className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Approve">
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}
                                {review.status !== 'rejected' && (
                                    <button onClick={() => updateStatus(review._id, 'rejected')}
                                        className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {reviews.length === 0 && <div className="text-center py-16 text-gray-400">No reviews yet</div>}
        </div>
    );
}
