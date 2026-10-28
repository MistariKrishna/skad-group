/** Settings shared by the preloader component and the tiny script in <head>. */
export const PRELOADER_KEY = "skad-intro-seen";

/**
 * false = play on every page load (current setting)
 * true  = play once per browser tab; refreshes in the same tab skip it
 * Either way, adding ?intro to the URL always plays it (handy for testing).
 */
export const PRELOADER_ONCE_PER_SESSION = false;

/**
 * Runs in <head> before the page paints:
 * - records when the preloader first appeared (for the minimum display time)
 * - repeat visit (if once-per-session) → hide instantly, no flash
 * - otherwise → lock scrolling while it plays (with a 7s safety release)
 */
export const PRELOADER_SCRIPT = `(function(){try{var d=document.documentElement;window.__plStart=performance.now();var force=/[?&]intro\\b/.test(location.search);${
  PRELOADER_ONCE_PER_SESSION ? `if(!force&&sessionStorage.getItem("${PRELOADER_KEY}")){d.classList.add("pl-skip");return;}` : ""
}d.classList.add("pl-active");setTimeout(function(){d.classList.remove("pl-active")},7000);}catch(e){}})();`;