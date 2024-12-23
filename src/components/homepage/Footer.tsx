"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { Button, Input } from "@nextui-org/react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Branding Section */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="/favicon.ico"
            alt="Logo"
            width={150}
            height={150}
            className="mb-4"
          />
          <p className="text-sm text-gray-400 mt-2">
            Empowering meaningful connections, career growth, and collaboration.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-gray-400 hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="text-gray-400 hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/projects/explore" className="text-gray-400 hover:text-white">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/events" className="text-gray-400 hover:text-white">
                Events
              </Link>
            </li>
            <li>
              <Link href="/careers" className="text-gray-400 hover:text-white">
                Careers
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/help" className="text-gray-400 hover:text-white">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-lg font-bold mb-4">Stay Connected</h3>
          <p className="text-gray-400 mb-4">
            Subscribe to our newsletter for the latest updates.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Input
              placeholder="Enter your email"
              className="text-gray-800 bg-white w-full sm:w-auto"
            />
            <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Social Media and Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-6">
        <div className="flex justify-center space-x-6 mb-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-400 transition duration-300 transform hover:scale-110"
          >
            <FaFacebook size={32} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-200 transition duration-300 transform hover:scale-110"
          >
            <FaTwitter size={32} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-300 transition duration-300 transform hover:scale-110"
          >
            <FaInstagram size={32} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-500 transition duration-300 transform hover:scale-110"
          >
            <FaLinkedin size={32} />
          </a>
        </div>
        <p className="text-gray-400 text-sm text-center">
          &copy; {new Date().getFullYear()} Let&apos;s Connect. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;