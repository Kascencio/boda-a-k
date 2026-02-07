import bd from "../assets/carta-p3.png";
import calendario from "../assets/calendario.png";

export default function SegundaParte() {
    return (
        <div>
            <img src={bd} alt="Boda" className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-auto" />
            <img src={calendario} alt="" />
        </div>
    );
}