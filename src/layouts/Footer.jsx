import { APP } from '../constants/app';

/**
 * Application footer shown inside the dashboard content area.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-hairline px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
        <p>
          © {year} {APP.name}. Government of India initiative.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
          <span className="text-slate-300">v{APP.version}</span>
        </div>
      </div>
    </footer>
  );
}
