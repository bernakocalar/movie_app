import { useLanguage } from "../hooks/Language";

export default function Footer() {
  const { t, toggleLanguage } = useLanguage();
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-300">
      <div className="max-w-5xl mx-auto px-6 md:px-20 py-6 flex items-center justify-between">
        <p className="text-sm">© {new Date().getFullYear()} Beyza Kocalar</p>
        <button
          onClick={toggleLanguage}
          className="text-emerald-300 hover:text-white border border-emerald-300/60 hover:border-white px-3 py-1.5 rounded-md text-sm transition-colors"
        >
          {t.changeLang}
        </button>
      </div>
    </footer>
  );
}
