import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const adminApi = axios.create({ baseURL: API_BASE });

// Attach JWT token from localStorage on every request
adminApi.interceptors.request.use(cfg => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('gt_admin_token');
        if (token) cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
});

// ─── Mock Data ──────────────────────────────────────────────────────────────
export const MOCK_STATS = {
    totalRevenue: 5280000,
    monthRevenue: 980000,
    totalBookings: 234,
    todayBookings: 7,
    confirmedBookings: 189,
    totalLeads: 412,
    newLeads: 23,
    totalUsers: 1847,
    recentLeads: [
        { _id: '1', contactDetails: { name: 'Priya Sharma', phone: '+91 98765 43210' }, destinationId: { name: 'Kashmir' }, status: 'new', createdAt: new Date().toISOString() },
        { _id: '2', contactDetails: { name: 'Rahul Mehta', phone: '+91 91234 56789' }, destinationId: { name: 'Goa' }, status: 'new', createdAt: new Date().toISOString() },
        { _id: '3', contactDetails: { name: 'Anjali Singh', phone: '+91 87654 32100' }, destinationId: { name: 'Kerala' }, status: 'new', createdAt: new Date().toISOString() },
    ],
    recentBookings: [
        { _id: '1', userId: { name: 'Vikram Patel' }, destinationId: { name: 'Ladakh' }, totalCost: 59998, status: 'confirmed' },
        { _id: '2', userId: { name: 'Sneha Kapoor' }, destinationId: { name: 'Rajasthan' }, totalCost: 42000, status: 'pending' },
        { _id: '3', userId: { name: 'Arjun Nair' }, destinationId: { name: 'Manali' }, totalCost: 23998, status: 'confirmed' },
    ],
};

export const MOCK_REVENUE_CHART = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    return { _id: d.toISOString().split('T')[0], revenue: Math.floor(Math.random() * 80000) + 20000, bookings: Math.floor(Math.random() * 12) + 1 };
});

export const MOCK_LEADS = [
    { _id: 'l1', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', destination: 'Kashmir', travelers: 2, budget: 37998, status: 'new', source: 'website', message: 'Looking for a honeymoon package', createdAt: new Date().toISOString() },
    { _id: 'l2', name: 'Rahul Mehta', email: 'rahul@email.com', phone: '+91 91234 56789', destination: 'Goa', travelers: 4, budget: 51996, status: 'contacted', source: 'chatbot', message: 'Group trip for 4', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: 'l3', name: 'Anjali Singh', email: 'anjali@email.com', phone: '+91 87654 32100', destination: 'Kerala', travelers: 2, budget: 33998, status: 'converted', source: 'whatsapp', message: 'Anniversary trip', createdAt: new Date(Date.now() - 172800000).toISOString() },
    { _id: 'l4', name: 'Vikram Patel', email: 'vikram@email.com', phone: '+91 76543 21000', destination: 'Ladakh', travelers: 3, budget: 89997, status: 'new', source: 'booking_form', message: 'Adventure trip', createdAt: new Date(Date.now() - 259200000).toISOString() },
    { _id: 'l5', name: 'Sneha Kapoor', email: 'sneha@email.com', phone: '+91 65432 10987', destination: 'Rajasthan', travelers: 5, budget: 105000, status: 'new', source: 'website', message: 'Family vacation', createdAt: new Date(Date.now() - 345600000).toISOString() },
];

export const MOCK_BOOKINGS = [
    { _id: 'b1', userName: 'Vikram Patel', userEmail: 'vikram@email.com', destination: 'Leh Ladakh', travelers: 3, travelDate: '2025-05-15', totalCost: 89997, status: 'confirmed', paymentStatus: 'paid', createdAt: new Date().toISOString() },
    { _id: 'b2', userName: 'Sneha Kapoor', userEmail: 'sneha@email.com', destination: 'Rajasthan', travelers: 5, travelDate: '2025-03-20', totalCost: 105000, status: 'pending', paymentStatus: 'pending', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: 'b3', userName: 'Arjun Nair', userEmail: 'arjun@email.com', destination: 'Manali', travelers: 2, travelDate: '2025-04-10', totalCost: 23998, status: 'confirmed', paymentStatus: 'paid', createdAt: new Date(Date.now() - 172800000).toISOString() },
    { _id: 'b4', userName: 'Priya Sharma', userEmail: 'priya@email.com', destination: 'Kashmir', travelers: 2, travelDate: '2025-06-01', totalCost: 37998, status: 'pending', paymentStatus: 'partial', createdAt: new Date(Date.now() - 259200000).toISOString() },
    { _id: 'b5', userName: 'Rahul Mehta', userEmail: 'rahul@email.com', destination: 'Goa', travelers: 4, travelDate: '2025-02-28', totalCost: 51996, status: 'cancelled', paymentStatus: 'refunded', createdAt: new Date(Date.now() - 432000000).toISOString() },
];

export const MOCK_USERS = [
    { _id: 'u1', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', role: 'user', bookingsCount: 3, totalSpent: 75000, createdAt: new Date(Date.now() - 7776000000).toISOString() },
    { _id: 'u2', name: 'Rahul Mehta', email: 'rahul@email.com', phone: '+91 91234 56789', role: 'user', bookingsCount: 1, totalSpent: 51996, createdAt: new Date(Date.now() - 15552000000).toISOString() },
    { _id: 'u3', name: 'Anjali Singh', email: 'anjali@email.com', phone: '+91 87654 32100', role: 'user', bookingsCount: 5, totalSpent: 195000, createdAt: new Date(Date.now() - 2592000000).toISOString() },
    { _id: 'u4', name: 'Vikram Patel', email: 'vikram@email.com', phone: '+91 76543 21000', role: 'user', bookingsCount: 2, totalSpent: 113000, createdAt: new Date(Date.now() - 31104000000).toISOString() },
];

export const MOCK_REVIEWS = [
    { _id: 'r1', userName: 'Priya Sharma', destination: 'Kashmir', rating: 5, title: 'Magical honeymoon!', text: 'The Kashmir package was beyond perfect. The houseboat stay was unforgettable.', status: 'published', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: 'r2', userName: 'Rahul Mehta', destination: 'Ladakh', rating: 5, title: 'Best bike trip ever!', text: 'Everything was perfectly organized. GoTravel team is outstanding!', status: 'published', createdAt: new Date(Date.now() - 259200000).toISOString() },
    { _id: 'r3', userName: 'Vikram Patel', destination: 'Rajasthan', rating: 4, title: 'Heritage Tour Review', text: 'Great experience. Jaisalmer camel safari was a highlight!', status: 'pending', createdAt: new Date(Date.now() - 432000000).toISOString() },
];

export const MOCK_DESTINATIONS = [
    { _id: 'd1', name: 'Kashmir', slug: 'kashmir', state: 'Jammu & Kashmir', basePrice: 18999, duration: 7, rating: 4.8, reviewCount: 2847, isFeatured: true, isActive: true },
    { _id: 'd2', name: 'Goa', slug: 'goa', state: 'Goa', basePrice: 12999, duration: 5, rating: 4.6, reviewCount: 4521, isFeatured: true, isActive: true },
    { _id: 'd3', name: 'Kerala', slug: 'kerala', state: 'Kerala', basePrice: 16999, duration: 6, rating: 4.9, reviewCount: 3102, isFeatured: true, isActive: true },
    { _id: 'd4', name: 'Rajasthan', slug: 'rajasthan', state: 'Rajasthan', basePrice: 21999, duration: 8, rating: 4.7, reviewCount: 2215, isFeatured: false, isActive: true },
    { _id: 'd5', name: 'Manali', slug: 'manali', state: 'Himachal Pradesh', basePrice: 11999, duration: 5, rating: 4.5, reviewCount: 3890, isFeatured: true, isActive: true },
    { _id: 'd6', name: 'Leh Ladakh', slug: 'ladakh', state: 'Ladakh', basePrice: 29999, duration: 9, rating: 4.9, reviewCount: 1543, isFeatured: true, isActive: true },
];
