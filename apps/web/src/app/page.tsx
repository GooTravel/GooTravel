import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import HowItWorks from '@/components/home/HowItWorks';
// import StatsSection from '@/components/home/StatsSection';
import FITTeaser from '@/components/home/FITTeaser';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import NewsletterSection from '@/components/home/NewsletterSection';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
    title: 'GooTravel - India\'s Premier Travel Experience | Book Now',
    description: 'Discover magical India with GooTravel. Customized Kashmir, Goa, Kerala, Manali & Rajasthan tours. FIT packages, group tours & honeymoon specials starting ₹',
};

const travelAgencySchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'GooTravel',
    description: 'India\'s premier travel company offering customized tours, FIT packages, and group travel experiences.',
    url: 'https://gootravel.in',
    logo: 'https://gootravel.in/logo.png',
    telephone: '+91-821-802-7137',
    address: { '@type': 'PostalAddress', addressLocality: 'Delhi', addressRegion: 'Delhi', addressCountry: 'IN' },
    priceRange: '₹9,999 - ₹59,999',
    sameAs: ['https://instagram.com/gootravel_india', 'https://facebook.com/gootravelindia'],
};

export default function HomePage() {
    return (
        <>
            <JsonLd data={travelAgencySchema} />
            <Navbar />
            <main>
                <HeroSection />
                <FeaturedDestinations />
                <HowItWorks />
                {/* <StatsSection /> */}
                <FITTeaser />
                <WhyChooseUs />
                <TestimonialsSection />
                <NewsletterSection />
            </main>
            <Footer />
        </>
    );
}
