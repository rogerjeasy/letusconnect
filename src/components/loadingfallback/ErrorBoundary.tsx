"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="max-w-2xl w-full animate-fade-in">
            <Alert
              variant="destructive"
              className="bg-background border-2 shadow-lg transition-all duration-300 hover:shadow-xl rounded-[var(--radius)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 animate-pulse text-destructive" />
                <AlertTitle className="text-xl font-semibold text-foreground">
                  Oops! Something went wrong
                </AlertTitle>
              </div>
              
              <AlertDescription className="space-y-6">
                <div className="bg-muted p-4 rounded-[var(--radius)] border animate-slide-up">
                  <p className="text-muted-foreground">
                    {this.state.error?.message ||
                      "An unexpected error occurred. Please try again later."}
                  </p>
                </div>

                <div 
                  className="flex flex-col sm:flex-row gap-3 animate-slide-up"
                  style={{ animationDelay: "100ms" }}
                >
                  <Button
                    onClick={this.handleReload}
                    variant="default"
                    className="flex items-center gap-2 group"
                  >
                    <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                    Reload Page
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={this.handleHome}
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Go to Homepage
                  </Button>
                </div>

                <p 
                  className="text-sm text-muted-foreground animate-slide-up"
                  style={{ animationDelay: "200ms" }}
                >
                  If the problem persists, please contact support or try again later.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
