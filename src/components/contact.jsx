import TestAPI from "../services/api";

export default function Contact() {
  return (
    <section
      id="contact"
      className="flex flex-col items-center justify-center text-center my-3.5 space-y-5 py-12 px-4 md:px-0 bg-slate-900"
    >
      <h2 className="text-emerald-300 text-3xl md:text-4xl">İletişime geçin</h2>
      <p className="text-slate-200 text-lg md:text-2xl">
        Özel ders için soru sormak veya randevu almak isterseniz yazın.
      </p>
      <div className="flex gap-4">
        <a
          href="https://wa.me/905551112233"
          className="bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-semibold px-4 py-2 rounded-3xl transition-colors"
        >
          WhatsApp
        </a>
        <a
          href="mailto:ornek@example.com"
          className="border border-emerald-300 hover:border-white text-emerald-200 hover:text-white font-semibold px-4 py-2 rounded-3xl transition-colors"
        >
          E-mail
        </a>
      </div>
      <div className="w-full max-w-3xl bg-slate-800 border border-slate-700 rounded-xl p-4">
        <TestAPI />
      </div>
    </section>
  );
}
