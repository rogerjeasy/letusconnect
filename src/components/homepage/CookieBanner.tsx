import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, Cookie, ExternalLink, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) setShowBanner(false);
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('cookieConsent', accepted.toString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-10 md:right-10 z-50">
      <Alert className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
        <div className="max-w-7xl mx-auto">
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
                
                {showDetails && (
                  <div className="mt-6 space-y-4">
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">
                          Industry-standard encryption to protect your data
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Cookie className="h-4 w-4 text-amber-600" />
                        <span className="text-sm text-gray-600">
                          Essential cookies to ensure site functionality
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ExternalLink className="h-4 w-4 text-blue-600" />
                        <a href="/privacy" className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium">
                          View our detailed Privacy Policy
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </AlertDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 min-w-fit">
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="ghost"
                size="sm"
                className="w-full sm:w-auto text-gray-500 hover:text-gray-900 hover:bg-gray-100"
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
                className="w-full sm:w-auto text-gray-700 hover:text-gray-900 border-gray-300"
              >
                Decline optional
              </Button>
              <Button
                size="sm"
                onClick={() => handleConsent(true)}
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
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