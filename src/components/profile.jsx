import { useLanguage } from "../hooks/Language";

export default function Profile() {
  const { t } = useLanguage();

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 p-6 md:p-12 bg-slate-800">
      <div className="md:col-span-2 text-base md:text-lg text-slate-100 font-medium mt-4 md:mt-0 text-center md:text-left">
        <p>{t.profile.desc}</p>
      </div>
    </section>
  );
}
