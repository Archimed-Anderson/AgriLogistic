/**
 * Farmer Dashboard Layout
 * Shared layout for all farmer pages
 */
import React from 'react';

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
