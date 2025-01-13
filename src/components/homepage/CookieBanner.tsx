import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, Cookie, ExternalLink, ChevronDown, ChevronUp, Lock, X, Check, ChartBar } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

type PreferenceKey = keyof CookiePreferences;

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    marketing: true
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const savedPreferences = localStorage.getItem('cookiePreferences');

    if (!consent) {
      setShowBanner(true);
    }

    if (savedPreferences) {
      try {
        setSelectedPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    }
  }, []);

  const handleConsent = (accepted: boolean): void => {
    localStorage.setItem('cookieConsent', accepted.toString());
    localStorage.setItem('cookiePreferences', JSON.stringify(
      accepted ? selectedPreferences : { essential: true, analytics: false, marketing: false }
    ));
    setShowBanner(false);
  };

  const handlePreferenceChange = (key: PreferenceKey): void => {
    setSelectedPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-10 md:right-10 z-50">
      <Alert className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
        <div className="max-w-7xl mx-auto relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 rounded-full p-2 hover:bg-gray-100"
            onClick={() => handleConsent(false)}
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Lock className="h-5 w-5 text-blue-700" />
                </div>
                <AlertTitle className="text-xl font-semibold text-gray-900">
                  Privacy Preferences
                </AlertTitle>
              </div>

              <AlertDescription className="text-gray-600">
                <p className="text-sm leading-relaxed">
                  We prioritize your privacy while using cookies to enhance your experience, 
                  deliver personalized content, and improve our services.
                </p>
                
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-6 space-y-4"
                    >
                      <Separator className="my-4" />
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Essential Cookies</p>
                              <p className="text-sm text-gray-600">Required for basic site functionality</p>
                            </div>
                          </div>
                          <div className="h-4 w-4 rounded border border-green-600 bg-green-600">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <ChartBar className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Analytics Cookies</p>
                              <p className="text-sm text-gray-600">Help us improve our website</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handlePreferenceChange('analytics')}
                            className={`h-4 w-4 rounded border ${
                              selectedPreferences.analytics ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                            }`}
                          >
                            {selectedPreferences.analytics && <Check className="h-3 w-3 text-white" />}
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Cookie className="h-4 w-4 text-amber-600 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Marketing Cookies</p>
                              <p className="text-sm text-gray-600">Personalize your experience</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handlePreferenceChange('marketing')}
                            className={`h-4 w-4 rounded border ${
                              selectedPreferences.marketing ? 'border-amber-600 bg-amber-600' : 'border-gray-300'
                            }`}
                          >
                            {selectedPreferences.marketing && <Check className="h-3 w-3 text-white" />}
                          </button>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <ExternalLink className="h-4 w-4 text-blue-600" />
                          <Link href="/privacy" className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium">
                            View our detailed Privacy Policy
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </AlertDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 min-w-fit">
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="ghost"
                size="sm"
                className="w-full sm:w-auto text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {showDetails ? (
                  <>Less details <ChevronUp className="ml-1 h-4 w-4" /></>
                ) : (
                  <>More details <ChevronDown className="ml-1 h-4 w-4" /></>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConsent(false)}
                className="w-full sm:w-auto text-gray-700 hover:text-gray-900 border-gray-300 transition-colors"
              >
                Decline optional
              </Button>
              <Button
                size="sm"
                onClick={() => handleConsent(true)}
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Accept all cookies
              </Button>
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default CookieBanner;