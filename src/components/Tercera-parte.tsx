import bd from "../assets/optimized/tercera-parte.webp";
import calendario from "../assets/optimized/calendario.webp";

export default function TerceraParte() {
    return (
        <div className="relative flex flex-col items-center mt-16">
          <a href="https://maps.app.goo.gl/Ko2ZmHgUi7ASdH699" target="_blank" rel="noopener noreferrer">
            <img 
              src={bd} 
              alt="Boda" 
              className="w-screen h-auto sm:scale-150 md:scale-50 lg:scale-70" 
              loading="lazy"
              decoding="async"
            />
          </a>
          <a href="https://calendar.app.google/EoXqDBPKnmkb5mWa9" target="_blank" rel="noopener noreferrer">
            <img 
              src={calendario} 
              alt="Calendario" 
              className="absolute bottom-0 right-4 w-[35vw] max-w-[120px] sm:max-w-[250px] md:max-w-[400px] lg:max-w-[400px] h-auto translate-y-1/4"
              loading="lazy"
              decoding="async"
            />
          </a>

        </div>
    );
}