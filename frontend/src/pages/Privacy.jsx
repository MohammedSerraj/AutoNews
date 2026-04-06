
import React from 'react';

export default function Privacy() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <header className="mb-16 border-b border-gray-100 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-nyt-heading mb-6 tracking-tight text-black text-center">Privacy Policy</h1>
          <p className="text-xs text-center text-gray-400 font-bold uppercase tracking-widest leading-loose">
            Last Updated: {lastUpdated}
          </p>
        </header>

        <article className="prose prose-lg max-w-none font-nyt-body text-gray-800 leading-relaxed space-y-12">
          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-black mb-6">1. Introduction</h2>
            <p>
              TangierTimes respects your privacy and is committed to protecting the personal 
              information you share with us. This policy explains how we collect, use, and safeguard your 
              data when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-black mb-6">2. Information We Collect</h2>
            <p className="mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><b>Account Information:</b> Name, email address, and password when you register.</li>
              <li><b>Communication:</b> Details shared when you contact our newsroom or support.</li>
              <li><b>Social Auth:</b> Information provided by third-party services (like Google) when you use Social Login.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-black mb-6">3. Cookies and Tracking</h2>
            <p>
              We use cookies to enhance your experience, analyze site traffic, and serve relevant advertisements. 
              By continuing to use TangierTimes, you consent to our use of cookies in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-black mb-6">4. How We Use Data</h2>
            <p className="mb-4">We use your data to:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Provide and maintain our personalized news services.</li>
              <li>Authenticate your account and protect against unauthorized access.</li>
              <li>Communicate important updates regarding your account or our services.</li>
              <li>Improve site performance and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-black mb-6">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time via your  
               <b>Account Settings</b>. If you wish to permanently delete your data, please contact our support team.
            </p>
          </section>

          <section className="bg-gray-50 p-8 rounded-sm italic border-l-4 border-black">
            <h2 className="text-lg font-bold text-black mb-4 not-italic">Contact Us</h2>
            <p className="text-sm text-gray-600 leading-loose">
              If you have any questions about this Privacy Policy, please reach out to our Data Protection Officer at:
              <br />
              <strong className="text-black font-bold uppercase tracking-widest block mt-2 text-xs">privacy@tangiertimes.com</strong>
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
