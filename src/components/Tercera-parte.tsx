import bd from "../assets/optimized/carta-p3.webp";
import calendario from "../assets/optimized/calendario.webp";

export default function TerceraParte() {
    return (
        <div className="flex flex-col items-center gap-4">
            <img 
              src={bd} 
              alt="Boda" 
              className="w-[90vw] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto" 
              loading="lazy"
              decoding="async"
            />
            <img 
              src={calendario} 
              alt="Calendario" 
              className="w-[80vw] max-w-xs sm:max-w-sm md:max-w-md h-auto"
              loading="lazy"
              decoding="async"
            />
        </div>
    );
}