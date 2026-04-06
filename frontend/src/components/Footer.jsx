
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-nyt-black text-white mt-auto py-12 md:block hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-nyt-heading">TangierTimes</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Delivering trusted journalism from Northern Morocco since 2026. 
              Our mission is to bring high-quality English reporting to the Tangier community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Sections</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/category/World" className="text-gray-400 hover:text-white transition-colors">World</Link></li>
              <li><Link to="/category/Politics" className="text-gray-400 hover:text-white transition-colors">Politics</Link></li>
              <li><Link to="/category/Business" className="text-gray-400 hover:text-white transition-colors">Business</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Subscription Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">
              Get full digital access to Morocco's premier English daily.
            </p>
            <Link 
              to="/login" 
              className="inline-block w-full text-center px-4 py-2 border border-white text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Subscribe Now
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 tracking-widest uppercase">
          <p>© 2026 TangierTimes. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">Facebook</a>
            <a href="#" className="hover:text-white">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
