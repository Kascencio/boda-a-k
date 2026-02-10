import bg from "./assets/fondo.webp";
import Pt1 from "./components/PrimeraParte";
import Pt2 from "./components/SegundaParte";
import Pt3 from "./components/Tercera-parte";
import Pt4 from "./components/CuartaParte";
import Pt5 from "./components/QuintaParte";
import Pt6 from "./components/SextaParte";
import Pt7 from "./components/SeptimaParte";
import Pt8 from "./components/OctavaParte";
import FadeInOnScroll from "./components/FadeInOnScroll";
import { useEffect, useState, useRef } from "react";
import { iniciarLenis } from "./lib/lenis";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = iniciarLenis();
    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (showForm && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [showForm]);

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="min-h-screen bg-black/5">
          <div className="min-h-screen grid grid-cols-1 gap-6 p-4 place-items-center md:grid-cols-5">
            {/* Primera parte - animación de entrada desde arriba */}
            <div className="w-full flex justify-center md:col-span-5">
              <Pt1 />
            </div>

            {/* Las demás partes aparecen con fade-in al hacer scroll */}
            <div className="w-full flex justify-center md:col-span-3 md:col-start-2">
              <FadeInOnScroll>
                <Pt2 />
              </FadeInOnScroll>
            </div>

            <div className="w-full flex justify-center md:col-span-3 md:col-start-2">
              <FadeInOnScroll delay={100}>
                <Pt3 />
              </FadeInOnScroll>
            </div>

            <div className="w-full flex justify-center md:col-span-3 md:col-start-2">
              <FadeInOnScroll delay={100}>
                <Pt4 />
              </FadeInOnScroll>
            </div>

            <div className="w-full flex justify-center md:col-span-3 md:col-start-2">
              <FadeInOnScroll delay={100}>
                <Pt5 />
              </FadeInOnScroll>
            </div>

            <div className="w-full flex justify-center md:col-span-3 md:col-start-2">
              <FadeInOnScroll delay={100}>
                <Pt6 />
              </FadeInOnScroll>
            </div>

            <div className="w-full flex justify-center md:col-span-3 md:col-start-2">
              <FadeInOnScroll delay={100}>
                <Pt7 onToggleForm={() => setShowForm(!showForm)} />
              </FadeInOnScroll>
            </div>

            {showForm && (
              <div 
                ref={formRef}
                className="w-full flex justify-center md:col-span-5 scroll-mt-20 py-10"
              >
                <FadeInOnScroll>
                  <Pt8 />
                </FadeInOnScroll>
              </div>
            )}
            </div>
          </div>
        </div>

    </>
  );
}

export default App;

