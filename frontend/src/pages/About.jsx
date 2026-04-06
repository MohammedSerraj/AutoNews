
import React from 'react';
import { FiAward, FiGlobe, FiUsers, FiMail } from 'react-icons/fi';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="border-b border-gray-100 py-20 bg-gray-50/50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-nyt-heading mb-6 tracking-tight">About TangierTimes</h1>
          <p className="text-xl text-gray-500 italic font-medium max-w-2xl mx-auto leading-relaxed">
            "The truth is rarely pure and never simple." — Oscar Wilde
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-4xl">
        {/* Mission Statement */}
        <section className="mb-24">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-0.5 bg-black"></div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Our Mission</h2>
          </div>
          <div className="prose prose-xl max-w-none font-nyt-body text-gray-800 leading-[1.8]">
             <p className="mb-8">
              Founded in 2026, **TangierTimes** is Northern Morocco's premier English-language digital news organization. 
              Our mission is to deliver rigorous, independent journalism that informs, challenges, and connects 
              the growing international community in Tangier and beyond.
            </p>
            <p>
              In an era of rapid digital change, we remain committed to the timeless values of classic reporting: 
              accuracy, depth, and a relentless pursuit of the truth. We believe that a well-informed public 
              is the cornerstone of a thriving society.
            </p>
          </div>
        </section>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="border-t border-gray-200 pt-8">
            <FiAward className="w-8 h-8 mb-6 text-black" />
            <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">Integrity</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              We maintain strict editorial independence. Our reporting is never influenced by advertisers, 
              political parties, or private interests.
            </p>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <FiGlobe className="w-8 h-8 mb-6 text-black" />
            <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">Global Perspective</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              While our heart is in Tangier, we provide a window to the world, reporting on international events 
              that impact our local community.
            </p>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <FiUsers className="w-8 h-8 mb-6 text-black" />
            <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">Community</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              We are a platform for all voices. We encourage respectful debate and strive to reflect the 
              rich diversity of the Tangier region.
            </p>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <FiMail className="w-8 h-8 mb-6 text-black" />
            <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">Transparency</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              We are accountable to our readers. When we make mistakes, we correct them swiftly and 
              transparently within the same platform.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-black text-white p-12 text-center rounded-sm shadow-2xl">
          <h2 className="text-3xl font-bold font-nyt-heading mb-6">Support Independent Journalism</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm leading-loose uppercase tracking-[0.1em]">
            Join thousands of readers who trust TangierTimes for daily insights from Morocco.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
             <button className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-all w-full sm:w-auto">
               Subscribe Now
             </button>
             <button className="px-8 py-3 border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all w-full sm:w-auto">
               Contact the Newsroom
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
