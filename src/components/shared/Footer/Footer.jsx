import React from "react";
import { Link, useLocation } from "react-router";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from '../../../assets/logo.png';

const Footer = () => {
  const location = useLocation();

  // ✅ Active checks
  const isHomeActive = location.pathname === "/";
  const isAllScholarshipsActive = location.pathname === "/all-scholarships";

  return (
    <footer className="bg-[#F4FAF9] border-t border-secondary/70 text-gray-700 mt-14">
      <div className="w-11/12 mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 items-start">

        {/* Logo & Description */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10">
              <img src={logo} alt="ScholarHub" className="w-full h-full" />
            </div>
            <span className="font-bold text-2xl md:text-3xl text-primary">
              Scholar<span className="text-secondary">Hub</span>
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Discover, apply, and track scholarships worldwide. Your journey to success starts here.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left lg:ml-14">
          <h3 className="text-xl font-semibold mb-2 md:mb-4 text-primary">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={`transition-colors hover:text-secondary ${
                  isHomeActive ? "text-secondary font-semibold" : ""
                }`}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/all-scholarships"
                className={`transition-colors hover:text-secondary ${
                  isAllScholarshipsActive ? "text-secondary font-semibold" : ""
                }`}
              >
                All Scholarships
              </Link>
            </li>

            {/* FAQ unchanged */}
            <li>
              <Link to="/#faq" className="hover:text-secondary transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h3 className="text-xl font-semibold mb-2 md:mb-4 text-primary">Connect With Us</h3>
          <div className="flex gap-4 text-xl text-primary mb-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
              <FaXTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
              <FaLinkedinIn />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Subscribe */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h3 className="text-xl font-semibold mb-2 md:mb-4 text-primary">Subscribe</h3>
          <p className="text-gray-600 text-sm mb-2">
            Get updates about latest scholarships
          </p>
          <form className="flex flex-col w-full max-w-sm gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="input input-bordered border-primary rounded-tr-2xl rounded-bl-2xl w-full px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="btn btn-secondary btn-outline px-3 py-2 rounded-tr-2xl rounded-bl-2xl text-black hover:text-white"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-primary/20"></div>

      {/* Copyright */}
      <div className="w-11/12 mx-auto py-4 text-center text-gray-500 text-sm space-y-1">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-primary">Scholar<span className="text-secondary">Hub</span></span>. All rights reserved.
        </p>
        <p>
         Designed & Developed by
           <a
            href="https://md-elius-dev-portfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary font-medium hover:underline ml-1"
          >
            MD. ELIUS
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
