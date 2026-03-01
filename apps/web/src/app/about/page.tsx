import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Users, Globe2, ShieldCheck, Heart } from 'lucide-react';

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen bg-gray-50 pb-20">

                {/* Header */}
                <section className="bg-night-900 text-white py-20 px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Redefining Travel in India</h1>
                        <p className="text-white/70 text-lg">We believe that every journey should be as unique as the traveler. GoTravel combines cutting-edge AI with deep local expertise to craft experiences you'll never forget.</p>
                    </div>
                </section>

                {/* Vision */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="font-display text-3xl font-bold text-night-900 mb-6">Our Vision</h2>
                       <p className="text-gray-600 mb-4 leading-relaxed"> Founded in 2026, GoTravel was born from a simple belief: planning a personalized trip shouldn’t feel overwhelming. Traditional agencies offer rigid, one-size-fits-all packages, while planning everything yourself can take weeks of research and coordination.
                        </p>

                        <p className="text-gray-800 font-semibold mb-4"> We built something better.
                        </p>

                        <p className="text-gray-600 leading-relaxed"> Our FIT (Flexible Independent Traveler) builder, powered by intelligent AI, lets you craft a fully customized itinerary in minutes. Choose your destinations, add curated experiences, adjust your stay, and see your trip come to life instantly. From the snow-capped peaks of Kashmir to the tranquil backwaters of Kerala, GoTravel brings the best of India to your fingertips — intelligently, seamlessly, and beautifully.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img src="https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000" alt="India" className="rounded-2xl h-64 object-cover w-full" />
                        <img src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1000" alt="Travel" className="rounded-2xl h-64 object-cover w-full mt-8" />
                    </div>
                </section>

                {/* Values */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <h2 className="font-display text-3xl font-bold text-night-900 mb-10 text-center">Core Values</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { icon: Globe2, title: 'Authenticity', desc: 'We partner with local experts to provide genuine cultural experiences.' },
                            { icon: ShieldCheck, title: 'Trust', desc: 'Transparent pricing, secure payments, and verified vendors.' },
                            { icon: Users, title: 'Flexibility', desc: 'Your trip, your rules. Build itineraries that fit your style.' },
                            { icon: Heart, title: 'Passion', desc: 'We love travel as much as you do, and it shows in our service.' },
                        ].map((v, i) => (
                            <div key={i} className="card p-6 text-center">
                                <div className="w-12 h-12 rounded-xl bg-gradient-brand text-white flex items-center justify-center mx-auto mb-4"><v.icon className="w-6 h-6" /></div>
                                <h3 className="font-bold text-night-900 mb-2">{v.title}</h3>
                                <p className="text-sm text-gray-500">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
