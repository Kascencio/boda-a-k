import { useEffect, useState } from "react";

import cartaContenidoSvg from "../assets/Carta-contenido.svg";
import selloWebp from "../assets/optimized/carta-sello.webp";

export default function PrimeraParte() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    // Load Google Font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const t1 = setTimeout(() => setPlay(true), 300);
    return () => {
      clearTimeout(t1);
      document.head.removeChild(link);
    };
  }, []);

  /* ── Coordenadas del sobre (viewBox 0 0 1024.5 576) ── */
  const ENV = {
    left:   174,
    right:  850,
    top:    40,
    flapY:  155,      // base del flap / borde superior del cuerpo
    bottom: 415,
    cx:     512,      // centro horizontal
    mouthY: 270,      // vértice del flap (punta que baja al centro)
  };

  // Colores del sobre
  const C = {
    interior:   "#2f3c2d",
  };

  // Posición del texto y sello en el flap
  const textX = ENV.cx + 35;
  const sealCx = ENV.cx;
  const sealCy = ENV.flapY + 60;

  return (
    <div className="flex flex-col items-center w-full h-full overflow-visible">
      <div style={{ height: "20vh" }} />

      <style>{`
        .scene{
          width: min(92vw, 600px);
          perspective: 1500px;
          overflow: visible;
        }

        .artboard{
          position: relative;
          width: 100%;
          aspect-ratio: 2000 / 1125;
          transform-style: preserve-3d;
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
        }

        /* === Flap 3D === */
        #flap{
          transform-box: fill-box;
          transform-origin: 50% 0%;
          transform-style: preserve-3d;
          will-change: transform;
          transform: translateZ(110px) rotateX(0deg);
        }

        .play #flap{
          animation: flapOpen 1.75s cubic-bezier(.2,.9,.2,1) .65s forwards;
        }

        @keyframes flapOpen{
          0%   { transform: translateZ(110px) rotateX(0deg); }
          20%  { transform: translateZ(110px) rotateX(-10deg); }
          55%  { transform: translateZ(110px) rotateX(-120deg); }
          78%  { transform: translateZ(110px) rotateX(-155deg); }
          100% { transform: translateZ(110px) rotateX(-168deg); }
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
        #letter_mover{
          opacity: 0;
          transform: translateY(-34px) translateZ(60px);
          will-change: transform, opacity;
        }

        .play #letter_mover{
          animation: letterDrop 1.65s cubic-bezier(.18,1,.22,1) 1.35s forwards;
        }

        @keyframes letterDrop{
          0%   { opacity:0; transform: translateY(-34px) translateZ(60px); }
          12%  { opacity:1; }
          65%  { transform: translateY(6px) translateZ(60px); }
          82%  { transform: translateY(-2px) translateZ(60px); }
          100% { opacity:1; transform: translateY(0px) translateZ(60px); }
        }

        /* overlays */
        #base_flap_cover{
          opacity: 0;
          transition: opacity .25s ease;
          pointer-events:none;
        }
        .play #base_flap_cover{
          opacity: 1;
          transition-delay: .75s;
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
          #flap { transform: translateZ(110px) rotateX(-168deg); }
          #flap .flap-front { opacity: 0; }
          #flap .flap-back { opacity: 1; }
          #base_flap_cover { opacity: 1; }
          #mouth_shadow { opacity: .9; }
        }
      `}</style>

      <div className={`scene ${play ? "play" : ""}`}>
        <div className="artboard">
          <svg
            className="master-svg"
            viewBox="0 0 1024.5 576"
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
                <polygon points={`${ENV.left},${ENV.flapY} ${ENV.right},${ENV.flapY} ${ENV.right},268.718 ${ENV.left},268.718`} />
              </clipPath>

              <clipPath id="clip_letter_outside" clipPathUnits="userSpaceOnUse">
                <rect x="0" y={ENV.flapY + 0.2} width="1024.5" height={576 - ENV.flapY} />
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

              {/* Paper texture — subtle only */}
              <filter id="paperTex" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="n" seed="2" />
                <feDiffuseLighting in="n" lightingColor="white" surfaceScale="0.5" result="lit">
                  <feDistantLight azimuth="225" elevation="60" />
                </feDiffuseLighting>
                <feComposite in="SourceGraphic" in2="lit" operator="arithmetic" k1="0.4" k2="0.6" k3="0" k4="0" />
              </filter>
            </defs>

            {/* ═══════════ 1) CUERPO DEL SOBRE ═══════════ */}
            <g id="env_body" mask="url(#mask_no_flap)">
              {/* Interior oscuro */}
              <rect
                x={ENV.left} y={ENV.flapY}
                width={ENV.right - ENV.left} height={ENV.bottom - ENV.flapY}
                fill={C.interior}
              />

              {/* Solapa inferior */}
              <polygon
                points={`${ENV.left},${ENV.bottom} ${ENV.right},${ENV.bottom} ${ENV.cx},${ENV.flapY + 80}`}
                fill="url(#bottomFlapGrad)"
                filter="url(#paperTex)"
              />

              {/* Solapa lateral izquierda */}
              <polygon
                points={`${ENV.left},${ENV.flapY} ${ENV.left},${ENV.bottom} ${ENV.cx - 20},${(ENV.flapY + ENV.bottom) / 2}`}
                fill="url(#leftFlapGrad)"
                filter="url(#paperTex)"
              />

              {/* Solapa lateral derecha */}
              <polygon
                points={`${ENV.right},${ENV.flapY} ${ENV.right},${ENV.bottom} ${ENV.cx + 20},${(ENV.flapY + ENV.bottom) / 2}`}
                fill="url(#rightFlapGrad)"
                filter="url(#paperTex)"
              />

              {/* Líneas de pliegue */}
              <line x1={ENV.left} y1={ENV.flapY} x2={ENV.cx - 20} y2={(ENV.flapY + ENV.bottom) / 2}
                stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
              <line x1={ENV.left} y1={ENV.bottom} x2={ENV.cx - 20} y2={(ENV.flapY + ENV.bottom) / 2}
                stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
              <line x1={ENV.right} y1={ENV.flapY} x2={ENV.cx + 20} y2={(ENV.flapY + ENV.bottom) / 2}
                stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
              <line x1={ENV.right} y1={ENV.bottom} x2={ENV.cx + 20} y2={(ENV.flapY + ENV.bottom) / 2}
                stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
              <line x1={ENV.left} y1={ENV.bottom} x2={ENV.cx} y2={ENV.flapY + 80}
                stroke="rgba(0,0,0,0.10)" strokeWidth="0.8" />
              <line x1={ENV.right} y1={ENV.bottom} x2={ENV.cx} y2={ENV.flapY + 80}
                stroke="rgba(0,0,0,0.10)" strokeWidth="0.8" />
            </g>

            {/* ═══════════ 2) Mouth shadow ═══════════ */}
            <g id="mouth_shadow" clipPath="url(#clip_letter_inside)">
              <rect x="0" y={ENV.flapY} width="1024.5" height="240" fill="url(#shadowGradient)" />
            </g>

            {/* ═══════════ 3) Cover interior ═══════════ */}
            <g id="base_flap_cover">
              <use href="#flap_polygon" fill={C.interior} opacity="0.85" />
            </g>

            {/* ═══════════ 4) Carta ═══════════ */}
            <g id="letter_mover">
              <g id="letter_inside" clipPath="url(#clip_letter_inside)">
                <image href={cartaContenidoSvg} x="0" y="0" width="1024.5" height="576" />
              </g>
              <g id="letter_outside" clipPath="url(#clip_letter_outside)">
                <image href={cartaContenidoSvg} x="0" y="0" width="1024.5" height="576" />
              </g>
            </g>

            {/* ═══════════ 5) Flap 3D ═══════════ */}
            <g id="flap" clipPath="url(#clip_flap)">
              {/* Front face — visible when closed */}
              <g className="flap-front">
                {/* Base green */}
                <use href="#flap_polygon" fill="url(#flapFrontGrad)" />
                {/* Subtle paper texture */}
                <use href="#flap_polygon" fill="url(#flapFrontGrad)" filter="url(#paperTex)" opacity="0.35" />

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
                <g transform={`translate(${sealCx - 35}, ${sealCy - 35})`}>
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
          </svg>
        </div>
      </div>

      <div style={{ height: "1rem" }} />
    </div>
  );
}
