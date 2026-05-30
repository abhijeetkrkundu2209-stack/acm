import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">ACM - HIT</h2>
            <p className="text-sm">
              Innovate. Collaborate. Create. <br />
              Empowering tech minds at HIT.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-blue-400 transition">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-blue-400 transition">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <Link href="#" className="hover:text-blue-400">
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link href="#" className="hover:text-blue-400">
                <i className="fab fa-instagram"></i>
              </Link>
              <Link href="#" className="hover:text-blue-400">
                <i className="fab fa-linkedin-in"></i>
              </Link>


            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
          © {new Date().getFullYear()} ACM - HIT. All rights reserved.

          <br />

          Contributers :-
          <Link href="https://www.linkedin.com/in/satyam-bhardwaj7/" className="hover:text-blue-400">
              <p>Satyam Kumar</p>
          </Link>
          <Link href="https://www.linkedin.com/in/deepak-kumar-0b4ba3280/" className="hover:text-blue-400">
              <p>Deepak Kumar</p>
          </Link>
          <Link href="https://www.linkedin.com/in/aman-kumar-76656b254/" className="hover:text-blue-400">
              <p>Aman Kumar</p>
          </Link>
          <Link href="https://www.linkedin.com/in/bibhuti-vishal-jha-0906012a7/" className="hover:text-blue-400">
              <p>Bibhuti Vishal</p>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
