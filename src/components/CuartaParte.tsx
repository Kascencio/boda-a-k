import bd from "../assets/optimized/cuarta-parte.webp";

export default function CuartaParte() {
  return (
    <div className="flex justify-center mt-16">
      <img
        src={bd}
        alt="Boda"
        className="w-screen h-auto scale-107 sm:scale-150 md:scale-80 lg:scale-100 cursor-pointer hover:opacity-90 transition-opacity"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
