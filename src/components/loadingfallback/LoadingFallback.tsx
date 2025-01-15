"use client";

const LoadingFallback = () => {
    return (
      <div className="fixed bottom-4 right-4 p-4 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading assistant...</span>
        </div>
      </div>
    );
  };
  
  export default LoadingFallback;