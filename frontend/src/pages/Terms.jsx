
import React from 'react';

export default function Terms() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <header className="mb-16 border-b border-gray-100 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-nyt-heading mb-6 tracking-tight text-black text-center uppercase tracking-widest">Terms of Service</h1>
          <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-[0.2em] leading-loose">
            Last Updated: {lastUpdated}
          </p>
        </header>

        <article className="prose prose-lg max-w-none font-nyt-body text-gray-800 leading-relaxed space-y-12">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-6">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the TangierTimes website, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, 
              you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-6">2. Editorial Integrity</h2>
            <p className="mb-4 text-sm leading-loose">
              TangierTimes is committed to accuracy and independence. However, we do not warrant that all 
              content on this site is error-free, complete, or current. We reserve the right to 
              make changes to the content at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-6">3. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials on TangierTimes 
              website for personal, non-commercial transitory viewing only. This is the grant of a 
              license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-sm italic text-gray-500">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose.</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-6">4. User Comments</h2>
            <p>
              TangierTimes provides spaces for user interaction. We do not preview comments but reserve 
              the right to remove any content that is deemed offensive, illegal, or in violation of 
              our community guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-6">5. Limitations</h2>
            <p>
              In no event shall TangierTimes or its suppliers be liable for any damages arising out of 
              the use or inability to use the materials on our website.
            </p>
          </section>

          <section>
             <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-6">6. Governing Law</h2>
             <p>
               Any claim relating to TangierTimes website shall be governed by the laws of the Kingdom of 
               Morocco without regard to its conflict of law provisions.
             </p>
          </section>

          <section className="bg-black text-white p-12 text-center rounded-sm italic">
            <h2 className="text-lg font-bold mb-4 not-italic uppercase tracking-widest leading-loose">Questions?</h2>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest block mt-2">
               LEGAL@TANGIERTIMES.COM
             </p>
          </section>
        </article>
      </div>
    </div>
  );
}
