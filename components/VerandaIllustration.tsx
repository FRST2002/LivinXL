type Props = {
  className?: string;
  frameHex?: string;
  glassOpacity?: number;
  schuifwanden?: number;
  zijwand?: boolean;
  led?: boolean;
  screens?: number;
};

/**
 * Stylised architectural line illustration of an aluminium veranda,
 * built entirely from vectors (no stock photography). Accepts a few
 * props so it can reflect live configurator selections.
 */
export default function VerandaIllustration({
  className,
  frameHex = "#26292E",
  glassOpacity = 0.28,
  schuifwanden = 0,
  zijwand = false,
  led = false,
  screens = 0,
}: Props) {
  const columnsX = [150, 388, 626, 852];
  const wallStart = 396;
  const wallEnd = 618;
  const wallWidth = wallEnd - wallStart;
  const dividers = Math.max(0, schuifwanden);

  return (
    <svg
      viewBox="0 0 900 560"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustratie van een aluminium LivinXL veranda"
    >
      <defs>
        <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E7E5E1" />
          <stop offset="100%" stopColor="#F2F1EF" />
        </linearGradient>
        <linearGradient id="glassPanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DAA574" stopOpacity={glassOpacity} />
          <stop offset="100%" stopColor="#F2F1EF" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="floorFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26292E" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#26292E" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="900" height="560" fill="url(#skyFade)" />

      {/* House wall */}
      <rect x="0" y="120" width="150" height="360" fill={frameHex} />
      <rect x="30" y="220" width="60" height="90" fill="#F2F1EF" fillOpacity="0.15" stroke="#F2F1EF" strokeOpacity="0.35" strokeWidth="2" />

      {/* Floor shadow */}
      <ellipse cx="520" cy="486" rx="380" ry="26" fill="url(#floorFade)" />

      {/* Optional closed side wall on the far column */}
      {zijwand && <rect x="852" y="204" width="30" height="270" fill={frameHex} fillOpacity="0.9" />}

      {/* Roof slats */}
      <polygon points="150,150 860,150 860,190 150,190" fill="url(#glassPanel)" stroke={frameHex} strokeWidth="3" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={150 + i * 59.5}
          y1="150"
          x2={150 + i * 59.5}
          y2="190"
          stroke={frameHex}
          strokeOpacity="0.35"
          strokeWidth="2"
        />
      ))}

      {/* Screens rolled up at the front beam */}
      {screens > 0 && (
        <g>
          {Array.from({ length: Math.min(screens, 3) }).map((_, i) => {
            const spanStart = 160 + i * ((700 - 160) / 3);
            const spanWidth = (700 - 160) / 3 - 20;
            return (
              <rect
                key={i}
                x={spanStart}
                y="192"
                width={spanWidth}
                height="8"
                fill="#B57544"
                fillOpacity="0.8"
                rx="2"
              />
            );
          })}
        </g>
      )}

      {/* Front beam */}
      <rect x="150" y="200" width="710" height="14" fill={frameHex} />

      {/* Columns */}
      {columnsX.map((x, i) => (
        <rect key={i} x={x - 8} y="214" width="16" height="260" fill={frameHex} />
      ))}
      {/* Copper accent caps on columns */}
      {columnsX.map((x, i) => (
        <rect key={`cap-${i}`} x={x - 10} y="206" width="20" height="10" fill="#B57544" />
      ))}

      {/* Glass sliding wall segment with dynamic divider count */}
      <g opacity="0.9">
        <rect x={wallStart} y="224" width={wallWidth} height="240" fill="#F2F1EF" fillOpacity="0.35" stroke={frameHex} strokeOpacity="0.5" strokeWidth="2" />
        {Array.from({ length: dividers }).map((_, i) => {
          const x = wallStart + ((i + 1) * wallWidth) / (dividers + 1);
          return <line key={i} x1={x} y1="224" x2={x} y2="464" stroke={frameHex} strokeOpacity="0.4" strokeWidth="2" />;
        })}
      </g>

      {/* Led strip under front beam */}
      <line
        x1="160"
        y1="216"
        x2="842"
        y2="216"
        stroke="#B57544"
        strokeWidth={led ? 3 : 1.5}
        strokeOpacity={led ? 0.9 : 0.3}
        strokeDasharray="2 6"
      />

      {/* Floor line */}
      <line x1="60" y1="480" x2="880" y2="480" stroke={frameHex} strokeOpacity="0.5" strokeWidth="2" />
    </svg>
  );
}
