// Shared scroll-lock coordinated between the boot preloader (which needs the
// page frozen while its fixed overlay is up) and the Lenis smooth-scroll
// instance owned by the SmoothScroll provider. Plain `overflow: hidden` does
// not stop Lenis — it drives its own virtual scroll — so we must call
// `lenis.stop()`/`start()`. Module-level state makes this order-independent:
// whichever mounts first sets the intent, the other reconciles on register.

interface ScrollController {
  start(): void;
  stop(): void;
}

let controller: ScrollController | null = null;
let locked = false;

/** Register the active Lenis instance; it immediately adopts the current lock
 *  state. Returns an unregister function for effect cleanup. */
export function registerScrollController(instance: ScrollController): () => void {
  controller = instance;
  if (locked) instance.stop();
  else instance.start();
  return () => {
    if (controller === instance) controller = null;
  };
}

/** Lock or unlock page scrolling. Freezes both native scroll (root overflow)
 *  and the Lenis controller if one is registered. */
export function setScrollLocked(next: boolean): void {
  locked = next;
  if (typeof document !== 'undefined') {
    document.documentElement.style.overflow = next ? 'hidden' : '';
    document.body.style.overflow = next ? 'hidden' : '';
    if (next) window.scrollTo(0, 0);
  }
  if (controller) {
    if (next) controller.stop();
    else controller.start();
  }
}
