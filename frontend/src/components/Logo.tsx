"use client";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Core nova burst */}
      <circle cx="20" cy="20" r="5" fill="#4589FF" />
      <circle cx="20" cy="20" r="3" fill="#78A9FF" />
      <circle cx="20" cy="20" r="1.5" fill="#FFFFFF" />
      {/* Outer glow ring */}
      <circle cx="20" cy="20" r="14" stroke="#0F62FE" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="20" cy="20" r="18" stroke="#0F62FE" strokeWidth="0.5" fill="none" opacity="0.25" />
      {/* 8-point starburst rays */}
      <path d="M20 2 L20 10" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 30 L20 38" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 20 L10 20" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 20 L38 20" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" />
      {/* Diagonal rays */}
      <path d="M7.3 7.3 L12.7 12.7" stroke="#4589FF" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M27.3 27.3 L32.7 32.7" stroke="#4589FF" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7.3 32.7 L12.7 27.3" stroke="#4589FF" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M27.3 12.7 L32.7 7.3" stroke="#4589FF" strokeWidth="1.2" strokeLinecap="round" />
      {/* Short accent rays */}
      <path d="M10 5.5 L13.5 11" stroke="#0F62FE" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M5.5 10 L11 13.5" stroke="#0F62FE" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M30 5.5 L26.5 11" stroke="#0F62FE" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M34.5 10 L29 13.5" stroke="#0F62FE" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M5.5 30 L11 26.5" stroke="#0F62FE" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M10 34.5 L13.5 29" stroke="#0F62FE" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M34.5 30 L29 26.5" stroke="#0F62FE" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M30 34.5 L26.5 29" stroke="#0F62FE" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
