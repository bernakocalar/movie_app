import { useLanguage } from "../hooks/Language";

export default function Projects() {
  const { t } = useLanguage();
  return (
    <section
      id="services"
      className="flex flex-col bg-slate-50 dark:bg-slate-950 gap-6 items-center p-6 md:p-12"
    >
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">
          Hizmetler
        </h1>
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl text-emerald-500 mb-2">
          {t.projects.pizzaProjectTitle}
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          {t.projects.pizzaProjectDesc}
        </p>
        <div className="flex flex-wrap gap-2 my-4">
          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-400/30 py-1.5 px-3 rounded-3xl">
            TYT
          </span>
          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-400/30 py-1.5 px-3 rounded-3xl">
            AYT
          </span>
          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-400/30 py-1.5 px-3 rounded-3xl">
            Deneme Analizi
          </span>
        </div>
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl text-emerald-500 mb-2">
          {t.projects.nestForYouTitle}
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          {t.projects.nestForYouDesc}
        </p>
        <div className="flex flex-wrap gap-2 my-4">
          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-400/30 py-1.5 px-3 rounded-3xl">
            LGS
          </span>
          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-400/30 py-1.5 px-3 rounded-3xl">
            Konu Tekrarı
          </span>
          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-400/30 py-1.5 px-3 rounded-3xl">
            Soru Çözümü
          </span>
        </div>
      </div>
    </section>
  );
}
