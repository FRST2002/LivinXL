type IconProps = { className?: string };

const base = "stroke-current fill-none";

export function IconRoof({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <path className={base} d="M4 16h40M4 16l6-8h28l6 8M4 16v6M44 16v6" strokeLinecap="round" strokeLinejoin="round" />
      <path className={base} d="M11 16v6M18 16v6M25 16v6M32 16v6M39 16v6" strokeLinecap="round" />
    </svg>
  );
}

export function IconLayers({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <path className={base} d="M8 20h32M8 28h32M8 36h32" strokeLinecap="round" />
      <path className={base} d="M8 12h32v28H8z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconWall({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <path className={base} d="M14 8v32M34 8v32M8 40h32M8 8h32" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBulb({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <path
        className={base}
        d="M24 6c-7 0-12 5.4-12 12 0 5 2.9 8 5.4 10.4.9.9 1.6 2 1.6 3.2V34h10v-2.4c0-1.2.7-2.3 1.6-3.2C33.1 26 36 23 36 18c0-6.6-5-12-12-12Z"
        strokeLinejoin="round"
      />
      <path className={base} d="M19 40h10M20.5 44h7" strokeLinecap="round" />
    </svg>
  );
}

export function IconScreen({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <path className={base} d="M6 10h36" strokeLinecap="round" />
      <path className={base} d="M10 10v6M16 10v10M22 10v14M28 10v18M34 10v22M40 10v26" strokeLinecap="round" />
    </svg>
  );
}

export function IconFlame({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <path
        className={base}
        d="M24 4c2 6-6 8-6 16 0 6 4 10 6 12 2-2 6-6 6-12 0-3-1.5-4.6-2-7 3 1.5 8 6.4 8 13a12 12 0 1 1-24 0c0-9 6-15 12-22Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconRuler({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <path
        className={base}
        d="m6 30 12-12 4 4-3 3 3 3 4-4 3 3-4 4 3 3 3-3 4 4-12 12Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconShield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <path className={base} d="M24 5 8 11v11c0 11 7 18 16 21 9-3 16-10 16-21V11Z" strokeLinejoin="round" />
      <path className={base} d="m17 24 5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTruck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <path className={base} d="M4 14h22v18H4zM26 20h9l7 6v6h-16z" strokeLinejoin="round" />
      <circle className={base} cx="13" cy="36" r="3.4" />
      <circle className={base} cx="35" cy="36" r="3.4" />
    </svg>
  );
}

export function IconWrench({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <path
        className={base}
        d="M31 8a9 9 0 0 0-11.6 11.6L7 32l5 5 12.4-12.4A9 9 0 0 0 36 13l-6 6-5-5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCompass({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <circle className={base} cx="24" cy="24" r="18" />
      <path className={base} d="m29 19-3 10-10 3 3-10 10-3Z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLeaf({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <path
        className={base}
        d="M10 38C10 20 22 8 40 8c0 18-12 30-30 30Z"
        strokeLinejoin="round"
      />
      <path className={base} d="M12 36c8-8 16-14 26-24" strokeLinecap="round" />
    </svg>
  );
}

export function IconCoins({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <ellipse className={base} cx="18" cy="14" rx="12" ry="6" />
      <path className={base} d="M6 14v8c0 3.3 5.4 6 12 6s12-2.7 12-6v-8" strokeLinecap="round" />
      <path className={base} d="M6 22v8c0 3.3 5.4 6 12 6s12-2.7 12-6v-8" strokeLinecap="round" />
      <ellipse className={base} cx="30" cy="26" rx="12" ry="6" />
      <path className={base} d="M18 30v8c0 3.3 5.4 6 12 6s12-2.7 12-6v-8" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2.2}>
      <path className={base} d="m5 13 4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2}>
      <path className={base} d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2}>
      <path className={base} d="M12 4v16M4 12h16" strokeLinecap="round" />
    </svg>
  );
}

export function IconLock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} strokeWidth={1.6}>
      <rect className={base} x="10" y="22" width="28" height="20" rx="3" strokeLinejoin="round" />
      <path className={base} d="M16 22v-6a8 8 0 0 1 16 0v6" strokeLinecap="round" strokeLinejoin="round" />
      <path className={base} d="M24 30v6" strokeLinecap="round" />
    </svg>
  );
}
