// Logos as inline SVG components to avoid external dependencies
export const Logos = {
  // Tianjin University placeholder (blue gradient circle with TJU)
  TJU: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="tjuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#tjuGrad)" />
      <text x="50" y="58" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold" fontFamily="Arial">TJU</text>
    </svg>
  ),

  // China University of Mining and Technology placeholder
  CUMT: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="cumtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#006644" />
          <stop offset="100%" stopColor="#00a878" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#cumtGrad)" />
      <text x="50" y="58" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" fontFamily="Arial">CUMT</text>
    </svg>
  ),

  // Momenta placeholder (M logo)
  Momenta: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#0ea5e9" />
      <text x="50" y="58" textAnchor="middle" fill="white" fontSize="36" fontWeight="bold" fontFamily="Arial">M</text>
    </svg>
  ),

  // Sinochem placeholder
  Sinochem: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#dc2626" />
      <text x="50" y="58" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="Arial">中化</text>
    </svg>
  ),

  // Sugon placeholder
  Sugon: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#2563eb" />
      <text x="50" y="58" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="Arial">曙光</text>
    </svg>
  ),

  // CSC Financial placeholder
  CSC: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#059669" />
      <text x="50" y="58" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Arial">东吴</text>
    </svg>
  ),
};
