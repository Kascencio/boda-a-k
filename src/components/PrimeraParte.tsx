import { useEffect, useState, useRef } from "react";

import cartaContenidoSvg from "../assets/Carta-contenido.svg";
import selloWebp from "../assets/optimized/carta-sello.webp";
import { getLenis } from "../lib/lenis";

export default function PrimeraParte({ startAnimation = true }: { startAnimation?: boolean }) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (startAnimation) {
      const t1 = setTimeout(() => setPlay(true), 100); // Short delay after loading screen fades
      return () => clearTimeout(t1);
    }
  }, [startAnimation]);

  useEffect(() => {
    if (!play) return; // Only run auto-scroll logic if playing

    // Load Google Font
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    // Auto-scroll to center after animation completes (300ms delay + 2000ms animation + 1500ms delay = ~3.8s)
    const t2 = setTimeout(() => {
      // Retry getting lenis a few times in case of race condition
      let attempts = 0;
      const interval = setInterval(() => {
        const lenis = getLenis();
        attempts++;
        
        if (lenis && containerRef.current) {
           clearInterval(interval);
           const vh = window.innerHeight;
           // If offsetHeight is 0 or null, fallback to vh (element might not be fully rendered?)
           // But containerRef is the wrapper div.
           const eh = containerRef.current.offsetHeight || vh;
           const offset = - (vh - eh) / 2;

           lenis.scrollTo(containerRef.current, {
             offset: offset, 
             duration: 2.5, 
             easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
           });
        } else if (attempts > 10) {
           clearInterval(interval);
           // Fallback to native if Lenis is truly missing after 1s
           containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }, 4000);

    return () => {
      clearTimeout(t2);
      document.head.removeChild(fontLink);
    };
  }, [play]);

  /* ── Coordenadas del sobre (viewBox 0 0 1024.5 576) ── */
  const ENV = {
    left:   120,
    right:  904,
    top:    -107,
    flapY:  105,      // base del flap / borde superior del cuerpo
    bottom: 425,
    cx:     512,      // centro horizontal
    mouthY: 370,      // vértice del flap (punta que baja al centro)
  };

  // Colores del sobre
  const C = {
    interior:   "#2f3c2d",
  };

  // Posición del texto y sello en el flap
  const textX = ENV.cx;
  const sealCx = ENV.cx;
  const sealCy = ENV.flapY + 60;

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full h-full overflow-visible">
      <div style={{ height: "30vh" }} />

      <style>{`
        .scene{
          width: min(92vw, 800px);
          perspective: 1500px;
          overflow: visible;
        }

        .artboard{
          position: relative;
          width: 100%;
          aspect-ratio: 816 / 750;
          overflow: visible;
        }

        .artboard::after{
          content:"";
          position:absolute;
          left: 12%;
          right: 12%;
          bottom: 14%;
          height: 18%;
          background: radial-gradient(60% 90% at 50% 50%, rgba(0,0,0,.35), transparent 70%);
          filter: blur(6px);
          transform: translateZ(-80px);
          opacity: .8;
          pointer-events:none;
        }

        svg.master-svg{
          width: 100%;
          height: 100%;
          display:block;
          overflow: visible;
          transform-style: preserve-3d;
          perspective: 1500px;
        }

        /* === Flap 3D === */
        #flap, #flap_overlay {
          transform-origin: 50% 0%;
          transform: rotateX(0deg);
          transition: transform 2.5s cubic-bezier(.4,0,.2,1);
          transform-style: preserve-3d;
          will-change: transform;
        }

        .play #flap, .play #flap_overlay {
          /* Opens to -168deg (almost flat up) */
          transform: rotateX(-168deg);
          transition-delay: 0s;
        }

        /* Flap front — visible in closed state, hidden when flipped open */
        #flap .flap-front{
          opacity: 1;
          transition: opacity 0.01s ease;
        }
        .play #flap .flap-front{
          animation: hideFront 1.75s cubic-bezier(.2,.9,.2,1) .65s forwards;
        }
        @keyframes hideFront{
          0%    { opacity: 1; }
          34%   { opacity: 1; }
          35%   { opacity: 0; }
          100%  { opacity: 0; }
        }

        /* Flap back — hidden initially, shown when flipped past 90° */
        #flap .flap-back{
          opacity: 0;
          transition: opacity 0.01s ease;
        }
        .play #flap .flap-back{
          animation: showBack 1.75s cubic-bezier(.2,.9,.2,1) .65s forwards;
        }
        @keyframes showBack{
          0%    { opacity: 0; }
          34%   { opacity: 0; }
          35%   { opacity: 1; }
          100%  { opacity: 1; }
        }

        /* Carta */
        #letter_mover, .letter_mover_anim, #flap {
          transform-style: preserve-3d;
        }

        #letter_mover, #letter_mover_overlay, .letter_mover_anim {
          opacity: 0;
          transform: translateY(-34px);
          will-change: transform, opacity;
        }

        .play .letter_mover_anim {
          animation: letterDrop 2.5s cubic-bezier(.18,1,.22,1) 1.35s forwards;
        }

        .play #letter_mover, .play #letter_mover_overlay {
          animation: letterDrop 2.0s cubic-bezier(.25,1,.5,1) 1.5s forwards;
        }

        @keyframes letterDrop{
          0%   { opacity:0; transform: translateY(0); }
          20%  { opacity:1; }
          100% { opacity:1; transform: translateY(-280px); }
        }

        /* Split SVG Layering */
        .svg-layer-base {
          position: relative;
          z-index: 5;
        }
        .svg-layer-base .revealed-content {
          display: none;
        }

        .svg-layer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 50;
          pointer-events: none;
        }
        .svg-layer-overlay .base-content {
          display: none;
        }

        /* overlays */
        #base_flap_cover{
          opacity: 0;
          transition: opacity .25s ease;
          pointer-events:none;
        }
        .play #base_flap_cover{
          opacity: 0;
        }

        #mouth_shadow{
          opacity: 0;
          transition: opacity .4s ease;
          transform: translateZ(20px);
          pointer-events:none;
        }
        .play #mouth_shadow{
          opacity: .9;
          transition-delay: .9s;
        }
        
        @media (prefers-reduced-motion: reduce){
          .play #flap, .play #letter_mover { animation:none !important; }
          .play #flap .flap-front, .play #flap .flap-back { animation:none !important; }
          #letter_mover { opacity: 1; transform: none; }
          #flap { transform: rotateX(-168deg); }
          #flap .flap-front { opacity: 0; }
          #flap .flap-back { opacity: 1; }
          #base_flap_cover { opacity: 1; }
          #mouth_shadow { opacity: .9; }
          .play #closed_flap_shadow { opacity: 0 !important; transition-delay: 0s; }
        }
      `}</style>

      <div className={`scene ${play ? "play" : ""}`}>
        <div className="artboard">
          {/* ═══════════ SVG 1: BASE LAYER ═══════════ */}
<svg
            className="master-svg svg-layer-base"
            viewBox="245 -300 824 850"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs>
              {/* ── Flap polygon shape ── */}
              <path
                id="flap_polygon"
                d={`M${ENV.left},${ENV.top} L${ENV.right},${ENV.top} L${ENV.right},${ENV.flapY} L${ENV.cx},${ENV.mouthY} L${ENV.left},${ENV.flapY} Z`}
              />

              <clipPath id="clip_flap" clipPathUnits="userSpaceOnUse">
                <use href="#flap_polygon" />
              </clipPath>

              <mask id="mask_no_flap" maskUnits="userSpaceOnUse">
                <rect x="0" y="0" width="1024.5" height="576" fill="white" />
                <use href="#flap_polygon" fill="black" />
              </mask>

              <clipPath id="clip_letter_inside" clipPathUnits="userSpaceOnUse">
                <rect x={ENV.left} y={-2} width={ENV.right - ENV.left} height={655} />
              </clipPath>

              <clipPath id="clip_letter_outside" clipPathUnits="userSpaceOnUse">
                <rect x={ENV.left} y={ENV.flapY + 0.2} width={ENV.right - ENV.left} height={ENV.bottom - ENV.flapY} />
              </clipPath>

              <clipPath id="clip_mouth_shadow" clipPathUnits="userSpaceOnUse">
                <rect x={ENV.left} y={-2} width={ENV.right - ENV.left} height={768} />
              </clipPath>

              {/* Clip para el sello de cera */}
              <clipPath id="clip_seal">
                <circle cx="35" cy="35" r="34" />
              </clipPath>

              {/* ── Gradientes ── */}
              <linearGradient id="shadowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,0,0,0.65)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>

              <linearGradient id="flapShadowGrad" x1="0" y1="0.5" x2="0" y2="1">
                 <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
                 <stop offset="20%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>

              <radialGradient id="flapInner" cx="50%" cy="20%" r="90%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="55%" stopColor="rgba(0,0,0,0.05)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
              </radialGradient>

              <linearGradient id="leftFlapGrad" x1="0" y1="0.3" x2="1" y2="0.5">
                <stop offset="0%"   stopColor="#3d4f33" />
                <stop offset="60%"  stopColor="#465839" />
                <stop offset="100%" stopColor="#4a5c3f" />
              </linearGradient>
              <linearGradient id="rightFlapGrad" x1="1" y1="0.3" x2="0" y2="0.5">
                <stop offset="0%"   stopColor="#3d4f33" />
                <stop offset="60%"  stopColor="#465839" />
                <stop offset="100%" stopColor="#4a5c3f" />
              </linearGradient>

              <linearGradient id="bottomFlapGrad" x1="0.5" y1="1" x2="0.5" y2="0">
                <stop offset="0%"   stopColor="#4a5c3f" />
                <stop offset="50%"  stopColor="#465839" />
                <stop offset="100%" stopColor="#3f5035" />
              </linearGradient>

              <linearGradient id="flapFrontGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%"   stopColor="#536845" />
                <stop offset="40%"  stopColor="#4a5c3f" />
                <stop offset="100%" stopColor="#3d4f33" />
              </linearGradient>

              <filter id="paperTex" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="n" seed="2" />
                <feDiffuseLighting in="n" lightingColor="white" surfaceScale="0.5" result="lit">
                  <feDistantLight azimuth="225" elevation="60" />
                </feDiffuseLighting>
                <feComposite in="SourceGraphic" in2="lit" operator="arithmetic" k1="0.4" k2="0.6" k3="0" k4="0" />
              </filter>

              <filter id="dropShadow" height="150%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                <feOffset dx="0" dy="2" result="offsetblur"/>
                <feFlood floodColor="rgba(0,0,0,0.4)"/>
                <feComposite in2="offsetblur" operator="in"/>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* ═══════════ CONTENT GROUP: BASE (Envelope + Flap) ═══════════ */}
            <g className="base-content">
              {/* ═══════════ 1) CUERPO DEL SOBRE ═══════════ */}

              {/* ═══════════ 1a) ENVELOPE BACK (Interior) ═══════════ */}
              <g id="env_back">
                <rect
                  x={ENV.left} y={ENV.flapY}
                  width={ENV.right - ENV.left} height={ENV.bottom - ENV.flapY}
                  fill={C.interior}
                />
              </g>

              {/* ═══════════ 2) Carta INSIDE pocket (Behind front flaps) ═══════════ */}
              <g className="letter_mover_anim">
                <g id="letter_outside" clipPath="url(#clip_letter_outside)">
                  <image href={cartaContenidoSvg} x="0" y="0" width="1305" height="976" />
                </g>
              </g>

              {/* ═══════════ 1b) ENVELOPE FRONT (Flaps) ═══════════ */}
              <g id="env_front">
                 {/* Solapa inferior */}
                <polygon
                  points={`${ENV.left},${ENV.bottom} ${ENV.right},${ENV.bottom} ${ENV.cx},${ENV.flapY + 30}`}
                  fill="#3d4f33"
                />
                <polygon
                  points={`${ENV.left},${ENV.bottom} ${ENV.right},${ENV.bottom} ${ENV.cx},${ENV.flapY + 80}`}
                  fill="url(#bottomFlapGrad)"
                  filter="url(#paperTex)"
                />
                {/* Solapa lateral izquierda */}
                <polygon
                  points={`${ENV.left},${ENV.flapY} ${ENV.left},${ENV.bottom} ${ENV.cx},${ENV.flapY + 40}`}
                  fill="#3d4f33"
                />
                <polygon
                  points={`${ENV.left},${ENV.flapY} ${ENV.left},${ENV.bottom} ${ENV.cx},${ENV.flapY + 40}`}
                  fill="url(#leftFlapGrad)"
                  filter="url(#paperTex)"
                />
                {/* Solapa lateral derecha */}
                <polygon
                  points={`${ENV.right},${ENV.flapY} ${ENV.right},${ENV.bottom} ${ENV.cx},${ENV.flapY + 40}`}
                  fill="#3d4f33"
                />
                <polygon
                  points={`${ENV.right},${ENV.flapY} ${ENV.right},${ENV.bottom} ${ENV.cx},${ENV.flapY + 40}`}
                  fill="url(#rightFlapGrad)"
                  filter="url(#paperTex)"
                />
                {/* Líneas de pliegue */}
                <line x1={ENV.left} y1={ENV.flapY} x2={ENV.cx} y2={ENV.flapY + 40}
                  stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                <line x1={ENV.left} y1={ENV.bottom} x2={ENV.cx} y2={ENV.flapY + 40}
                  stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
                <line x1={ENV.right} y1={ENV.flapY} x2={ENV.cx} y2={ENV.flapY + 40}
                  stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                <line x1={ENV.right} y1={ENV.bottom} x2={ENV.cx} y2={ENV.flapY + 40}
                  stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
                <line x1={ENV.left} y1={ENV.bottom} x2={ENV.cx} y2={ENV.flapY + 80}
                  stroke="rgba(0,0,0,0.10)" strokeWidth="0.8" />
                <line x1={ENV.right} y1={ENV.bottom} x2={ENV.cx} y2={ENV.flapY + 80}
                  stroke="rgba(0,0,0,0.10)" strokeWidth="0.8" />
              </g>

              {/* ═══════════ 2) Mouth shadow ═══════════ */}
              <g id="mouth_shadow" clipPath="url(#clip_mouth_shadow)">
                <rect x="0" y={ENV.flapY} width="1024.5" height="340" fill="url(#shadowGradient)" />
              </g>

              {/* Shadow cast by flap onto body (visible when closed) */}
              <g id="closed_flap_shadow" style={{ opacity: 1, transition: 'opacity 0.4s' }}>
                <use href="#flap_polygon" fill="black" filter="url(#dropShadow)" opacity="0.3" transform="translate(0, 2)" />
              </g>

              {/* ═══════════ 3) Cover interior ═══════════ */}
              <g id="base_flap_cover">
                <use href="#flap_polygon" fill={C.interior} opacity="0.85" />
              </g>

              {/* ═══════════ 5) Flap 3D ═══════════ */}
              <g id="flap" clipPath="url(#clip_flap)">
                {/* Front face — visible when closed */}
                <g className="flap-front">
                  {/* Base green */}
                  <use href="#flap_polygon" fill="url(#flapFrontGrad)" />
                  {/* Subtle paper texture */}
                  <use href="#flap_polygon" fill="url(#flapFrontGrad)" filter="url(#paperTex)" opacity="0.55" />

                  {/* Shadow at flap base */}
                  <line
                    x1={ENV.left} y1={ENV.flapY}
                    x2={ENV.right} y2={ENV.flapY}
                    stroke="rgba(0,0,0,0.15)" strokeWidth="1.5"
                  />

                  {/* Texto "Azucena y Kevin" */}
                  <text
                    x={textX} y={ENV.top + 58}
                    textAnchor="middle"
                    fontFamily="'Great Vibes', cursive"
                    fontSize="24"
                    fill="white"
                    fillOpacity="0.92"
                    letterSpacing="0.5"
                  >
                    Azucena
                  </text>
                  <text
                    x={textX - 5} y={ENV.top + 80}
                    textAnchor="middle"
                    fontFamily="'Great Vibes', cursive"
                    fontSize="16"
                    fill="white"
                    fillOpacity="0.92"
                    letterSpacing="0.5"
                  >
                    y
                  </text>
                  <text
                    x={textX} y={ENV.top + 104}
                    textAnchor="middle"
                    fontFamily="'Great Vibes', cursive"
                    fontSize="24"
                    fill="white"
                    fillOpacity="0.92"
                    letterSpacing="0.5"
                  >
                    Kevin
                  </text>

                  {/* Sello de cera */}
                  <g transform={`translate(${sealCx - 35}, ${sealCy - 35})`} filter="url(#dropShadow)">
                    <ellipse cx="35" cy="39" rx="36" ry="34" fill="rgba(0,0,0,0.25)" />
                    <g clipPath="url(#clip_seal)">
                      <image href={selloWebp} x="0" y="0" width="70" height="70" preserveAspectRatio="xMidYMid slice" />
                    </g>
                  </g>
                </g>


                {/* Back face — shown after flap opens past 90° */}
                <g className="flap-back">
                  <use href="#flap_polygon" fill={C.interior} />
                  <use href="#flap_polygon" fill="url(#flapInner)" />
                </g>
              </g>
            </g>

            {/* ═══════════ CONTENT GROUP: REVEALED CARD (Overlay) ═══════════ */}
            <g className="revealed-content">
              {/* ═══════════ 6) Carta ABOVE envelope (revealed) ═══════════ */}
              <g id="letter_mover">
                <g id="letter_inside" clipPath="url(#clip_letter_inside)">
                  <image href={cartaContenidoSvg} x="0" y="0" width="1024.5" height="576" />
                </g>
              </g>
            </g>
          </svg>

{/* ═══════════ SVG 2: OVERLAY LAYER ═══════════ */}
<svg
            className="master-svg svg-layer-overlay"
            viewBox="50 -300 824 850"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs>
              {/* ── Flap polygon shape ── */}
              <path
                id="flap_polygon"
                d={`M${ENV.left},${ENV.top} L${ENV.right},${ENV.top} L${ENV.right},${ENV.flapY} L${ENV.cx},${ENV.mouthY} L${ENV.left},${ENV.flapY} Z`}
              />

              <clipPath id="clip_flap_overlay" clipPathUnits="userSpaceOnUse">
                <use href="#flap_polygon" />
              </clipPath>

              <mask id="mask_no_flap" maskUnits="userSpaceOnUse">
                <rect x="0" y="0" width="1305" height="850" fill="white" />
                <use href="#flap_polygon" fill="black" />
              </mask>

              <clipPath id="clip_letter_inside_overlay" clipPathUnits="userSpaceOnUse">
                <rect x={ENV.left} y={-500} width={ENV.right - ENV.left} height={2000} />
              </clipPath>

              <clipPath id="clip_letter_outside_overlay" clipPathUnits="userSpaceOnUse">
                <rect x={ENV.left} y={ENV.flapY + 0.2} width={ENV.right - ENV.left} height={ENV.bottom - ENV.flapY} />
              </clipPath>

              <clipPath id="clip_mouth_shadow_overlay" clipPathUnits="userSpaceOnUse">
                <rect x={ENV.left} y={-500} width={ENV.right - ENV.left} height={768} />
              </clipPath>

              {/* Clip para el sello de cera */}
              <clipPath id="clip_seal_overlay">
                <circle cx="35" cy="35" r="34" />
              </clipPath>

              {/* ── Gradientes ── */}
              <linearGradient id="shadowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,0,0,0.65)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>

              <linearGradient id="flapShadowGrad" x1="0" y1="0.5" x2="0" y2="1">
                 <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
                 <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>

              <radialGradient id="flapInner" cx="50%" cy="20%" r="90%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="55%" stopColor="rgba(0,0,0,0.05)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
              </radialGradient>

              <linearGradient id="leftFlapGrad" x1="0" y1="0.3" x2="1" y2="0.5">
                <stop offset="0%"   stopColor="#3d4f33" />
                <stop offset="60%"  stopColor="#465839" />
                <stop offset="100%" stopColor="#4a5c3f" />
              </linearGradient>
              <linearGradient id="rightFlapGrad" x1="1" y1="0.3" x2="0" y2="0.5">
                <stop offset="0%"   stopColor="#3d4f33" />
                <stop offset="60%"  stopColor="#465839" />
                <stop offset="100%" stopColor="#4a5c3f" />
              </linearGradient>

              <linearGradient id="bottomFlapGrad" x1="0.5" y1="1" x2="0.5" y2="0">
                <stop offset="0%"   stopColor="#4a5c3f" />
                <stop offset="50%"  stopColor="#465839" />
                <stop offset="100%" stopColor="#3f5035" />
              </linearGradient>

              <linearGradient id="flapFrontGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%"   stopColor="#536845" />
                <stop offset="40%"  stopColor="#4a5c3f" />
                <stop offset="100%" stopColor="#3d4f33" />
              </linearGradient>

              <filter id="paperTex" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="n" seed="2" />
                <feDiffuseLighting in="n" lightingColor="white" surfaceScale="0.5" result="lit">
                  <feDistantLight azimuth="225" elevation="60" />
                </feDiffuseLighting>
                <feComposite in="SourceGraphic" in2="lit" operator="arithmetic" k1="0.4" k2="0.6" k3="0" k4="0" />
              </filter>

              <filter id="dropShadow" height="130%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                <feOffset dx="0" dy="2" result="offsetblur"/>
                <feFlood floodColor="rgba(0,0,0,0.4)"/>
                <feComposite in2="offsetblur" operator="in"/>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* ═══════════ CONTENT GROUP: BASE (Envelope + Flap) ═══════════ */}
            <g className="base-content">
              {/* ═══════════ 1) CUERPO DEL SOBRE ═══════════ */}

              {/* ═══════════ 1a) ENVELOPE BACK (Interior) ═══════════ */}
              <g id="env_back">
                <rect
                  x={ENV.left} y={ENV.flapY}
                  width={ENV.right - ENV.left} height={ENV.bottom - ENV.flapY}
                  fill={C.interior}
                />
              </g>

              {/* ═══════════ 2) Carta INSIDE pocket (Behind front flaps) ═══════════ */}
              <g className="letter_mover_anim">
                <g id="letter_outside_overlay" clipPath="url(#clip_letter_outside_overlay)">
                  <image href={cartaContenidoSvg} x="0" y="0" width="1324.5" height="576" />
                </g>
              </g>

              {/* ═══════════ 1b) ENVELOPE FRONT (Flaps) ═══════════ */}
              <g id="env_front">
                 {/* Solapa inferior */}
                <polygon
                  points={`${ENV.left},${ENV.bottom} ${ENV.right},${ENV.bottom} ${ENV.cx},${ENV.flapY + 80}`}
                  fill="#3d4f33"
                />
                <polygon
                  points={`${ENV.left},${ENV.bottom} ${ENV.right},${ENV.bottom} ${ENV.cx},${ENV.flapY + 80}`}
                  fill="url(#bottomFlapGrad)"
                  filter="url(#paperTex)"
                />
                {/* Solapa lateral izquierda */}
                <polygon
                  points={`${ENV.left},${ENV.flapY} ${ENV.left},${ENV.bottom} ${ENV.cx},${ENV.flapY + 40}`}
                  fill="#3d4f33"
                />
                <polygon
                  points={`${ENV.left},${ENV.flapY} ${ENV.left},${ENV.bottom} ${ENV.cx},${ENV.flapY + 40}`}
                  fill="url(#leftFlapGrad)"
                  filter="url(#paperTex)"
                />
                {/* Solapa lateral derecha */}
                <polygon
                  points={`${ENV.right},${ENV.flapY} ${ENV.right},${ENV.bottom} ${ENV.cx},${ENV.flapY + 40}`}
                  fill="#3d4f33"
                />
                <polygon
                  points={`${ENV.right},${ENV.flapY} ${ENV.right},${ENV.bottom} ${ENV.cx},${ENV.flapY + 40}`}
                  fill="url(#rightFlapGrad)"
                  filter="url(#paperTex)"
                />
                {/* Líneas de pliegue */}
                <line x1={ENV.left} y1={ENV.flapY} x2={ENV.cx} y2={ENV.flapY + 40}
                  stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                <line x1={ENV.left} y1={ENV.bottom} x2={ENV.cx} y2={ENV.flapY + 40}
                  stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
                <line x1={ENV.right} y1={ENV.flapY} x2={ENV.cx} y2={ENV.flapY + 40}
                  stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                <line x1={ENV.right} y1={ENV.bottom} x2={ENV.cx} y2={ENV.flapY + 40}
                  stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
                <line x1={ENV.left} y1={ENV.bottom} x2={ENV.cx} y2={ENV.flapY + 80}
                  stroke="rgba(0,0,0,0.10)" strokeWidth="0.8" />
                <line x1={ENV.right} y1={ENV.bottom} x2={ENV.cx} y2={ENV.flapY + 80}
                  stroke="rgba(0,0,0,0.10)" strokeWidth="0.8" />
              </g>

              {/* ═══════════ 2) Mouth shadow ═══════════ */}
              <g id="mouth_shadow_overlay" clipPath="url(#clip_mouth_shadow_overlay)">
                <rect x="0" y={ENV.flapY} width="1024.5" height="240" fill="url(#shadowGradient)" />
              </g>

              {/* Shadow cast by flap onto body (visible when closed) */}
              <g id="closed_flap_shadow" style={{ opacity: 1, transition: 'opacity 0.4s' }}>
                <use href="#flap_polygon" fill="black" filter="url(#dropShadow)" opacity="0.3" transform="translate(0, 2)" />
              </g>

              {/* ═══════════ 3) Cover interior ═══════════ */}
              <g id="base_flap_cover_overlay">
                <use href="#flap_polygon" fill={C.interior} opacity="0.85" />
              </g>

              {/* ═══════════ 5) Flap 3D ═══════════ */}
              <g id="flap_overlay" clipPath="url(#clip_flap_overlay)">
                {/* Front face — visible when closed */}
                <g className="flap-front">
                  {/* Base green */}
                  <use href="#flap_polygon" fill="url(#flapFrontGrad)" />
                  {/* Subtle paper texture */}
                  <use href="#flap_polygon" fill="url(#flapFrontGrad)" filter="url(#paperTex)" opacity="0.55" />

                  {/* Shadow at flap base */}
                  <line
                    x1={ENV.left} y1={ENV.flapY}
                    x2={ENV.right} y2={ENV.flapY}
                    stroke="rgba(0,0,0,0.15)" strokeWidth="1.5"
                  />

                  {/* Texto "Azucena y Kevin" */}
                  <text
                    x={textX} y={ENV.top + 58}
                    textAnchor="middle"
                    fontFamily="'Great Vibes', cursive"
                    fontSize="24"
                    fill="white"
                    fillOpacity="0.92"
                    letterSpacing="0.5"
                  >
                    Azucena
                  </text>
                  <text
                    x={textX - 5} y={ENV.top + 80}
                    textAnchor="middle"
                    fontFamily="'Great Vibes', cursive"
                    fontSize="16"
                    fill="white"
                    fillOpacity="0.92"
                    letterSpacing="0.5"
                  >
                    y
                  </text>
                  <text
                    x={textX} y={ENV.top + 104}
                    textAnchor="middle"
                    fontFamily="'Great Vibes', cursive"
                    fontSize="24"
                    fill="white"
                    fillOpacity="0.92"
                    letterSpacing="0.5"
                  >
                    Kevin
                  </text>

                  {/* Sello de cera */}
                  <g transform={`translate(${sealCx - 35}, ${sealCy - 35})`} filter="url(#dropShadow)">
                    <ellipse cx="35" cy="39" rx="36" ry="34" fill="rgba(0,0,0,0.25)" />
                    <g clipPath="url(#clip_seal_overlay)">
                      <image href={selloWebp} x="0" y="0" width="70" height="70" preserveAspectRatio="xMidYMid slice" />
                    </g>
                  </g>
                </g>


                {/* Back face — shown after flap opens past 90° */}
                <g className="flap-back">
                  <use href="#flap_polygon" fill={C.interior} />
                  <use href="#flap_polygon" fill="url(#flapInner)" />
                </g>
              </g>
            </g>

            {/* ═══════════ CONTENT GROUP: REVEALED CARD (Overlay) ═══════════ */}
            <g className="revealed-content">
              {/* ═══════════ 6) Carta ABOVE envelope (revealed) ═══════════ */}
              <g id="letter_mover_overlay">
                <g id="letter_inside" clipPath="url(#clip_letter_inside_overlay)">
                  <image href={cartaContenidoSvg} x="-400" y="0" width="1705" height="976" />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <div style={{ height: "1rem" }} />
    </div>
  );
}
