import boda from "../assets/Carta-primeraparte.svg";
import { useEffect, useState } from "react";

export default function PrimeraParte() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center mt-8 w-full px-2 sm:px-4">
      <style>{`
        @keyframes fadeSlideDown {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animacion-entrada {
          animation: fadeSlideDown 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }
        .imagen-primera-parte {
          width: 95vw;
          max-width: 1200px;
          height: auto;
        }
        @media (min-width: 768px) {
          .imagen-primera-parte {
            width: 85vw;
            max-width: 1400px;
          }
        }
        @media (min-width: 1024px) {
          .imagen-primera-parte {
            width: 80vw;
            max-width: 1600px;
          }
        }
      `}</style>
      
      <img
        src={boda}
        alt="Boda"
        className={`imagen-primera-parte ${isAnimated ? 'animacion-entrada' : ''}`}
        style={{ 
          opacity: isAnimated ? undefined : 0,
          transform: isAnimated ? undefined : 'translateY(-50px)'
        }}
      />
    </div>
  );
}
