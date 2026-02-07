import Lenis from "lenis";

export function iniciarLenis(){
const lenis = new Lenis({
    duration: .9,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
});

function raf(time: number){
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

return lenis;

}