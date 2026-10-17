export default function GoldCoin({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0 }}>
      <defs>
        {/* Main face gradient — bright top-left to deep amber bottom-right */}
        <radialGradient id="gc-face" cx="35%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#FFE566" />
          <stop offset="35%"  stopColor="#FFC125" />
          <stop offset="70%"  stopColor="#E8920A" />
          <stop offset="100%" stopColor="#C97000" />
        </radialGradient>
        {/* Rim gradient — darker gold ring */}
        <radialGradient id="gc-rim" cx="35%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#F0B830" />
          <stop offset="50%"  stopColor="#D4850A" />
          <stop offset="100%" stopColor="#A05800" />
        </radialGradient>
        {/* Subtle top-left gloss */}
        <radialGradient id="gc-gloss" cx="30%" cy="25%" r="45%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        {/* Drop shadow filter */}
        <filter id="gc-shadow" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#A05800" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Drop shadow circle */}
      <circle cx="50" cy="52" r="46" fill="#A05800" opacity="0.3" />

      {/* Outer rim */}
      <circle cx="50" cy="50" r="47" fill="url(#gc-rim)" />

      {/* Main face */}
      <circle cx="50" cy="50" r="43" fill="url(#gc-face)" />

      {/* Inner ring groove */}
      <circle cx="50" cy="50" r="36" fill="none" stroke="#C97000" strokeWidth="1.5" opacity="0.7" />

      {/* $ symbol — embossed look using two layers (shadow offset + highlight) */}
      {/* Star shadow */}
      <polygon points="51,18 57.5,37 78,37 62,49 68,68 51,56 34,68 40,49 24,37 44.5,37"
        fill="#7A3F00" opacity="0.5" transform="translate(1,2)" />
      {/* Star main */}
      <polygon points="50,17 56.5,36 77,36 61,48 67,67 50,55 33,67 39,48 23,36 43.5,36"
        fill="#C97000" stroke="#A05800" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Star highlight */}
      <polygon points="50,17 56.5,36 77,36 61,48 67,67 50,55 33,67 39,48 23,36 43.5,36"
        fill="none" stroke="#FFE680" strokeWidth="1.5" opacity="0.5" strokeLinejoin="round" />

      {/* Gloss overlay */}
      <circle cx="50" cy="50" r="43" fill="url(#gc-gloss)" />
    </svg>
  );
}
