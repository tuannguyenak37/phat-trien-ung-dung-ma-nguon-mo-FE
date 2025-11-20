// components/LoadingDots.tsx
import React from 'react';

export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
    </div>
  );
}