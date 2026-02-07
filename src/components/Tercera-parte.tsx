import bd from "../assets/optimized/tercera-parte.webp";
import calendario from "../assets/optimized/calendario.webp";

export default function TerceraParte() {
    return (
        <div className="relative flex flex-col items-center mt-16">
            <img 
              src={bd} 
              alt="Boda" 
              className="w-screen h-auto scale-[1.75] sm:scale-150 md:scale-130" 
              loading="lazy"
              decoding="async"
            />
            <img 
              src={calendario} 
              alt="Calendario" 
              className="absolute bottom-0 right-4 w-[30vw] max-w-[120px] sm:max-w-[200px] md:max-w-[400px] lg:max-w-[500px] h-auto translate-y-1/4"
              loading="lazy"
              decoding="async"
            />
        </div>
    );
}