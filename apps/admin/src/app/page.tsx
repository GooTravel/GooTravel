'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

// Default admin (used when backend is offline)
const MOCK_ADMIN = {
    _id: 'mock_admin_001',
    name: 'Admin',
    email: 'admin@gotravel.in',
    role: 'admin',
};
const MOCK_PASSWORD = 'GoTravel@Admin2024';

export default function AdminLoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Try API login first
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/login`,
                form,
                { timeout: 4000 }
            );
            const user = res.data.data;
            if (!['admin', 'superadmin'].includes(user.role)) {
                toast.error('Access denied. Admin only.');
                setLoading(false);
                return;
            }
            localStorage.setItem('gt_admin_token', res.data.token);
            localStorage.setItem('gt_admin_user', JSON.stringify(user));
            toast.success(`Welcome, ${user.name}!`);
            router.push('/dashboard');
            return;
        } catch {
            // API offline — try mock credentials
        }

        // Mock login fallback (works when backend is offline)
        if (form.email === MOCK_ADMIN.email && form.password === MOCK_PASSWORD) {
            localStorage.setItem('gt_admin_token', 'mock_token_dev_only');
            localStorage.setItem('gt_admin_user', JSON.stringify(MOCK_ADMIN));
            toast.success('Welcome, Admin! (demo mode)');
            router.push('/dashboard');
        } else {
            toast.error('Invalid credentials. Use admin@gotravel.in / GoTravel@Admin2024');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Demo mode notice */}
                <div className="mb-4 bg-orange-500/20 border border-orange-500/30 rounded-2xl p-3.5 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-orange-200">
                        <strong className="text-orange-300">Demo mode:</strong> If backend is offline, sign in with{' '}
                        <code className="bg-white/10 px-1.5 py-0.5 rounded">admin@gotravel.in</code> /{' '}
                        <code className="bg-white/10 px-1.5 py-0.5 rounded">GoTravel@Admin2024</code>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-[#FF6B35] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">G</div>
                        <h1 className="text-2xl font-bold text-[#1a1a2e]">GoTravel Admin</h1>
                        <p className="text-gray-500 text-sm mt-1">Sign in to manage your travel platform</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" value={form.email}
                                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                placeholder="admin@gotravel.in"
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all" />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type={showPass ? 'text' : 'password'} value={form.password}
                                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                placeholder="••••••••"
                                required
                                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all" />
                            <button type="button" onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-[#FF6B35] hover:bg-[#e55a24] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                            ) : 'Sign In to Admin'}
                        </button>
                    </form>
                    <p className="text-center text-xs text-gray-400 mt-6">GoTravel Admin Panel · Restricted Access</p>
                </div>
            </div>
        </div>
    );
}
