"use client";

import React, { useState } from "react";
import { useEffect } from 'react';
import Link from "next/link";
import {
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaGithub,
  FaMedium,
  FaYoutube,
  FaGraduationCap,
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaChalkboardTeacher,
  FaBriefcase,
  FaDiscord,
  FaSlack,
  FaUserShield,
  FaQuestion,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGooglePlay,
  FaApple,
  FaGlobe,
} from "react-icons/fa";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input, ButtonGroup } from "@nextui-org/react";
import CookieBanner from "./CookieBanner";

// TypeScript Interfaces
interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  label: string;
}

interface FooterSection {
  title: string;
  titleColor: string;
  links: {
    text: string;
    href: string;
    icon?: React.ReactNode;
    badge?: string | number;
  }[];
}

interface NewsletterPreference {
  id: string;
  label: string;
  checked: boolean;
}

// Reusable Components
const FooterLink: React.FC<FooterLinkProps> = ({ 
  href, 
  children, 
  className = "",
  ariaLabel
}) => (
  <Link 
    href={href} 
    className={`text-gray-400 hover:text-white transition-all duration-200 
                flex items-center gap-2 hover:translate-x-1 transform ${className}`}
    aria-label={ariaLabel}
  >
    {children}
  </Link>
);

const SocialLink: React.FC<SocialLinkProps> = ({ 
  href, 
  icon, 
  color, 
  hoverColor, 
  label 
}) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`${color} ${hoverColor} transition-all duration-300 
                transform hover:scale-110 hover:-translate-y-1`}
  >
    {icon}
  </Link>
);

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [region, setRegion] = useState("Global");
  const [showBanner, setShowBanner] = useState(true);
  const [newsletterPreferences, setNewsletterPreferences] = useState<NewsletterPreference[]>([
    { id: "events", label: "Events & Meetups", checked: true },
    { id: "jobs", label: "Job Opportunities", checked: true },
    { id: "news", label: "Industry News", checked: false },
    { id: "alumni", label: "Alumni Stories", checked: true }
  ]);

  const languages = ["English", "German", "French", "Italian"];
  const regions = ["Global", "Europe", "Americas", "Asia Pacific"];

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setShowBanner(false);
    }
  }, []);

  const handleSubscribe = async () => {
    if (email && !isSubscribed) {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('cookieConsent', accepted.toString());
    setShowBanner(false);
  };

  const toggleNewsletterPreference = (id: string) => {
    setNewsletterPreferences(prefs =>
      prefs.map(pref =>
        pref.id === id ? { ...pref, checked: !pref.checked } : pref
      )
    );
  };

  // Footer Sections Data
  const features: FooterSection = {
    title: "Features",
    titleColor: "text-blue-400",
    links: [
      { text: "Expert Mentorship", href: "/features/mentorship", icon: <FaGraduationCap className="w-5 h-5" /> },
      { text: "Global Network", href: "/features/network", icon: <FaUsers className="w-5 h-5" /> },
      { text: "Innovation Hub", href: "/features/innovation", icon: <FaLightbulb className="w-5 h-5" /> },
      { text: "Collaboration", href: "/features/collaboration", icon: <FaHandshake className="w-5 h-5" /> }
    ]
  };

  const community: FooterSection = {
    title: "Community",
    titleColor: "text-green-400",
    links: [
      { text: "Live Workshops", href: "/community/workshops", icon: <FaChalkboardTeacher className="w-5 h-5" />, badge: "New" },
      { text: "Job Board", href: "/community/jobs", icon: <FaBriefcase className="w-5 h-5" />, badge: 12 },
      { text: "Alumni Network", href: "/community/alumni", icon: <FaUsers className="w-5 h-5" /> },
      { text: "Discord Server", href: "/community/discord", icon: <FaDiscord className="w-5 h-5" /> },
      { text: "Slack Channel", href: "/community/slack", icon: <FaSlack className="w-5 h-5" /> }
    ]
  };

  const quickLinks: FooterSection = {
    title: "Quick Links",
    titleColor: "text-purple-400",
    links: [
      { text: "Find Alumni", href: "/search/alumni", icon: <FaSearch className="w-5 h-5" /> },
      { text: "Events Calendar", href: "/events", icon: <FaCalendarAlt className="w-5 h-5" />, badge: 3 },
      { text: "Resources", href: "/resources", icon: <FaLightbulb className="w-5 h-5" /> },
      { text: "Help Center", href: "/help", icon: <FaQuestion className="w-5 h-5" /> }
    ]
  };

  const legal: FooterSection = {
    title: "Legal & Support",
    titleColor: "text-red-400",
    links: [
      { text: "Privacy Policy", href: "/privacy", icon: <FaUserShield className="w-5 h-5" /> },
      { text: "Terms of Service", href: "/terms" },
      { text: "Accessibility", href: "/accessibility" },
      { text: "Contact Support", href: "/support" }
    ]
  };

  const support: FooterSection = {
    title: "Support",
    titleColor: "text-orange-400",
    links: [
      { text: "Help Center", href: "/help" },
      { text: "Documentation", href: "/docs" },
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Terms of Service", href: "/terms" },
      { text: "Contact Us", href: "/contact" }
    ]
  };

  const socialLinks: SocialLinkProps[] = [
    { href: "https://facebook.com", icon: <FaFacebook size={24} />, color: "text-blue-600", hoverColor: "hover:text-blue-400", label: "Facebook" },
    { href: "https://twitter.com", icon: <FaTwitter size={24} />, color: "text-blue-400", hoverColor: "hover:text-blue-300", label: "Twitter" },
    { href: "https://instagram.com", icon: <FaInstagram size={24} />, color: "text-pink-500", hoverColor: "hover:text-pink-400", label: "Instagram" },
    { href: "https://linkedin.com", icon: <FaLinkedin size={24} />, color: "text-blue-700", hoverColor: "hover:text-blue-500", label: "LinkedIn" },
    { href: "https://github.com", icon: <FaGithub size={24} />, color: "text-gray-400", hoverColor: "hover:text-gray-200", label: "GitHub" },
    { href: "https://medium.com", icon: <FaMedium size={24} />, color: "text-gray-400", hoverColor: "hover:text-gray-200", label: "Medium" },
    { href: "https://youtube.com", icon: <FaYoutube size={24} />, color: "text-red-600", hoverColor: "hover:text-red-400", label: "YouTube" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 relative">
      {/* Accessibility Skip Link */}
      <Link
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                   bg-blue-600 text-white p-2 rounded"
      >
        Skip to main content
      </Link>

      {/* Background Pattern */}
      {/* <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div> */}

      <div className="container mx-auto px-6 lg:px-20">
        {/* Language and Region Selection */}
        <div className="flex justify-end gap-4 mb-8">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" className="text-white" aria-label="Select language">
                <FaGlobe className="mr-2" /> {language}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Available languages"
              onSelectionChange={(key) => setLanguage(key.toString())}
              selectionMode="single"
              className="bg-white text-black"
            >
              {languages.map((lang) => (
                <DropdownItem key={lang} className="text-black hover:bg-gray-100">
                  {lang}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" className="text-white" aria-label="Select region">
                <FaMapMarkerAlt className="mr-2" /> {region}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Available regions" 
              onSelectionChange={(key) => setRegion(key.toString())}
              selectionMode="single"
              className="bg-white text-black"
            >
              {regions.map((reg) => (
                <DropdownItem key={reg} className="text-black hover:bg-gray-100">
                  {reg}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-16 mb-12">
          {/* Branding Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center md:items-start">
              <Link href="/" aria-label="Go to homepage">
                <img
                  src="/favicon.ico"
                  alt="Logo"
                  width={150}
                  height={150}
                  className="mb-4 hover:opacity-90 transition-opacity"
                />
              </Link>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-[150px] text-center md:text-left">
                Empowering meaningful connections and fostering innovation through
                collaborative learning and shared experiences.
              </p>
              {/* Mobile App Links */}
              <div className="flex gap-4 mt-4">
                <Link href="/app/ios" className="flex items-center text-gray-400 hover:text-white">
                  <FaApple className="mr-1" /> iOS App
                </Link>
              </div>
              {/* Desktop App Links */}
              <div className="flex gap-4 mt-4">
                <Link href="/app/android" className="flex items-center text-gray-400 hover:text-white">
                  <FaGooglePlay className="mr-1" /> Android App
                </Link>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center md:items-start">
              <h3 className={`text-lg font-bold mb-4 ${features.titleColor}`}>
                {features.title}
              </h3>
              <ul className="space-y-3">
                {features.links.map((link, index) => (
                  <li key={index}>
                    <FooterLink href={link.href} ariaLabel={`Go to ${link.text}`}>
                      {link.icon}
                      <span>{link.text}</span>
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Community Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center md:items-start">
              <h3 className={`text-lg font-bold mb-4 ${community.titleColor}`}>
                {community.title}
              </h3>
              <ul className="space-y-3">
                {community.links.map((link, index) => (
                  <li key={index}>
                    <FooterLink href={link.href} ariaLabel={`Go to ${link.text}`}>
                      {link.icon}
                      <span>{link.text}</span>
                      {link.badge && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-600 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center md:items-start">
              <h3 className={`text-lg font-bold mb-4 ${quickLinks.titleColor}`}>
                {quickLinks.title}
              </h3>
              <ul className="space-y-3">
                {quickLinks.links.map((link, index) => (
                  <li key={index}>
                    <FooterLink href={link.href} ariaLabel={`Go to ${link.text}`}>
                      {link.icon}
                      <span>{link.text}</span>
                      {link.badge && (
                        <span className="ml-2 px-2 py-1 text-xs bg-green-600 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center md:items-start">
              <h3 className={`text-lg font-bold mb-4 ${legal.titleColor}`}>
                {legal.title}
              </h3>
              <ul className="space-y-3">
                {legal.links.map((link, index) => (
                  <li key={index}>
                    <FooterLink href={link.href}>
                      {link.text}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
        </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-bold mb-4 text-orange-400">Stay Connected</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Join our newsletter for exclusive updates and insights.
                </p>
                <div className="space-y-2">
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-gray-700/50 text-white border-gray-600 focus:border-blue-500"
                    size="sm"
                    aria-label="Email subscription input"
                    disabled={isLoading || isSubscribed}
                  />
                  {/* Newsletter Preferences */}
                  <div className="space-y-2">
                    {newsletterPreferences.map(pref => (
                      <label key={pref.id} className="flex items-center space-x-2 text-sm text-gray-400">
                        <input
                          type="checkbox"
                          checked={pref.checked}
                          onChange={() => toggleNewsletterPreference(pref.id)}
                          className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-500 
                                  focus:ring-blue-500 bg-gray-700"
                          aria-label={`Subscribe to ${pref.label}`}
                        />
                        <span>{pref.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Frequency Selection */}
                  <div className="flex flex-wrap gap-2 my-3">
                    <ButtonGroup size="sm" className="bg-gray-700 rounded-lg">
                      <Button
                        className="text-xs px-3"
                        variant="ghost"
                        color="primary"
                        aria-label="Daily updates"
                      >
                        Daily
                      </Button>
                      <Button
                        className="text-xs px-3"
                        variant="ghost"
                        color="primary"
                        aria-label="Weekly updates"
                      >
                        Weekly
                      </Button>
                      <Button
                        className="text-xs px-3"
                        variant="ghost"
                        color="primary"
                        aria-label="Monthly updates"
                      >
                        Monthly
                      </Button>
                    </ButtonGroup>
                  </div>

                  {/* Subscribe Button */}
                  <Button
                    onClick={handleSubscribe}
                    className={`transition-colors w-full ${
                      isSubscribed 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                    size="sm"
                    isLoading={isLoading}
                    disabled={isLoading || isSubscribed}
                  >
                    {isSubscribed ? (
                      <span className="flex items-center justify-center">
                        Thank you! 🎉
                      </span>
                    ) : (
                      <span>Subscribe</span>
                    )}
                  </Button>

                  {/* Subscription Message */}
                  {isSubscribed && (
                    <p className="text-xs text-green-400 mt-2">
                      You have been successfully subscribed to our newsletter!
                    </p>
                  )}

                  {/* Privacy Note */}
                  <p className="text-xs text-gray-500 mt-2">
                    By subscribing, you agree to our{' '}
                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                      Privacy Policy
                    </Link>
                    . You can unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <SocialLink key={index} {...social} />
              ))}
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Let Us Connect. All rights reserved.
            </p>
          </div>
      </div>
      </div>
      <CookieBanner />
    </footer>
  );
};

export default Footer;