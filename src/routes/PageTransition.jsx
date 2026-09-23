/**
 * PageTransition wrapper providing clean, instant page rendering.
 */
export default function PageTransition({ children }) {
  return <div className="w-full animate-fadeIn">{children}</div>;
}
