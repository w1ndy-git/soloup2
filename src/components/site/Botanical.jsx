import React from "react";

// Decorative botanical illustrations — purely ornamental, aria-hidden by caller
export function LeafVein({ className = "" }) {
  return (
    <svg viewBox="0 0 120 200" className={className} fill="none" aria-hidden="true" focusable="false">
      <path d="M60 198 C60 150 60 110 60 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M60 40 C40 36 24 44 14 60 C26 70 46 64 60 50" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M60 70 C82 66 98 74 108 90 C94 100 74 94 60 80" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M60 104 C40 100 24 108 14 124 C26 134 46 128 60 114" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M60 138 C82 134 98 142 108 158 C94 168 74 162 60 148" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Sprout({ className = "" }) {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="none" aria-hidden="true" focusable="false">
      <path d="M50 118 L50 64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 70 C30 64 16 48 18 28 C38 30 52 46 50 66" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2" />
      <path d="M50 78 C68 72 84 56 82 36 C62 38 48 54 50 74" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function Seed({ className = "" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true" focusable="false">
      <path d="M50 8 C72 8 86 30 86 52 C86 74 70 92 50 92 C30 92 14 74 14 52 C14 30 28 8 50 8Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
      <path d="M50 20 C50 50 50 70 50 80" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M50 44 C40 40 32 44 28 52 C36 58 44 56 50 50" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function SunArc({ className = "" }) {
  return (
    <svg viewBox="0 0 200 60" className={className} fill="none" aria-hidden="true" focusable="false">
      <path d="M4 56 C60 8 140 8 196 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 8" />
      <circle cx="100" cy="14" r="5" fill="currentColor" />
    </svg>
  );
}