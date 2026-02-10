import bd from "../assets/optimized/carta-p7.webp";


interface SeptimaParteProps {
  onToggleForm?: () => void;
}

export default function SeptimaParte({ onToggleForm }: SeptimaParteProps) {
  return (
    <div className="flex justify-center">
      <button 
        onClick={onToggleForm}
        className="transform transition-transform active:scale-95 focus:outline-none"
        aria-label="Abrir confirmación de asistencia"
      >
        <img
          src={bd}
          alt="Boda"
          loading="lazy"
          decoding="async"
          className="w-[90vw] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto cursor-pointer hover:opacity-90 transition-opacity"
        />
      </button>
    </div>
  );
}
