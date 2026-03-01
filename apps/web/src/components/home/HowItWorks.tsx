"use client";

import { MapPin, SlidersHorizontal, Sparkles, CreditCard } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: "Choose Your Destination",
      description: "Explore handpicked destinations across India and select where your journey begins."
    },
    {
      icon: SlidersHorizontal,
      title: "Customize with FIT",
      description: "Add experiences, adjust stays, and build your perfect itinerary with full flexibility."
    },
    {
      icon: Sparkles,
      title: "AI Smart Suggestions",
      description: "Get intelligent recommendations to optimize your route, activities, and budget."
    },
    {
      icon: CreditCard,
      title: "Book & Travel",
      description: "Confirm your trip with transparent pricing and travel with complete peace of mind."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">
          How It Works
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-14">
          Plan your trip in minutes with our flexible and AI-powered travel system.
        </p>

        <div className="grid md:grid-cols-4 gap-6 mt-12">
          {steps.map((step, index) => {
  const Icon = step.icon;
  return (
    <div
      key={index}
      className="relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
    >
      {/* Step Number */}
      <span className="absolute top-4 right-6 text-5xl font-bold text-gray-100">
        0{index + 1}
      </span>

      {/* Icon */}
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-brand-50 mb-6">
        <Icon className="w-7 h-7 text-brand-500" />
      </div>

      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
      <p className="text-gray-600 text-sm">{step.description}</p>
    </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}