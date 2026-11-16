import { UNSAFE_useScrollRestoration as useScrollRestoration } from "react-router";

/** React Router's <ScrollRestoration>, with its first-paint script made safe when storage is blocked.
 *
 *  The stock component (react-router 7.18.5) does two things: it calls useScrollRestoration(), whose storage
 *  access is already wrapped in try/catch, and it inlines a script that restores the scroll position before
 *  hydration. That script's catch block calls sessionStorage.removeItem(). Where storage access itself throws
 *  (some private modes, blocked site data), the catch throws again and leaves an uncaught error on every page
 *  load. This component keeps the same hook, so scroll restoration behaves exactly as before, and inlines the
 *  same restore logic with every storage call guarded. */
const KEY = "react-router-scroll-positions"; // react-router's SCROLL_RESTORATION_STORAGE_KEY
const restore = `(function(k){try{if(!window.history.state||!window.history.state.key){window.history.replaceState({key:Math.random().toString(32).slice(2)},"")}}catch(e){}
var s=null;try{s=window.sessionStorage}catch(e){return}
try{var p=JSON.parse(s.getItem(k)||"{}");var y=p[window.history.state&&window.history.state.key];if(typeof y==="number")window.scrollTo(0,y)}
catch(e){try{s.removeItem(k)}catch(x){}}})(${JSON.stringify(KEY)})`;

export function SafeScrollRestoration() {
  useScrollRestoration({});
  return <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: restore }} />;
}
