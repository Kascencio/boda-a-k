import bd from "../assets/optimized/cuarta-parte.webp";

export default function CuartaParte() {
  return (
    <div className="flex justify-center mt-16">
      <img
        src={bd}
        alt="Boda"
        className="w-screen h-auto scale-125 md:scale-100 md:max-w-2xl lg:max-w-3xl"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
