import { useLanguage } from "../hooks/Language";
import DarkModeToggle from "../hooks/darkModeToggle";

export default function FirstLook({ darkMode, setDarkMode }) {
  const { t, toggleLanguage } = useLanguage();
  return (
    <section className="w-full h-auto min-h-[420px] flex flex-col items-center bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-600 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-700 text-white p-6 md:p-16">
      <div className="w-full max-w-4xl text-center mt-10 md:mt-16 space-y-6">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-emerald-200">
          {t.frontendDeveloper.title}
        </h2>
        <p className="text-lg md:text-2xl text-slate-100/90">
          {t.frontendDeveloper.description}
        </p>
        <div className="flex justify-center gap-3 mt-2">
          <a
            href="#services"
            className="bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-semibold py-2.5 px-5 rounded-lg transition-colors"
          >
            Hizmetler
          </a>
          <a
            href="#contact"
            className="border border-emerald-300 hover:border-white text-emerald-200 hover:text-white font-semibold py-2.5 px-5 rounded-lg transition-colors"
          >
            {t.projects.gotosite}
          </a>
        </div>
      </div>
    </section>
  );
}
