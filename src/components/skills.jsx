export default function Skills() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-6 md:mx-12 lg:mx-60 p-6">
      <div className="flex flex-col gap-8 text-center sm:text-left">
        <h2 className="text-4xl sm:text-6xl font-bold mt-4 text-[#4731D3]">
          Konu Başlıkları
        </h2>
      </div>

      <div className="flex flex-col gap-6 items-start">
        <p className="text-xl sm:text-2xl font-bold text-gray-800">
          Temel Kavramlar
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800">
          Eşitsizlikler
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800">
          Fonksiyonlar
        </p>
      </div>
      <div className="flex flex-col gap-6 items-start">
        <p className="text-xl sm:text-2xl font-bold text-gray-800">
          Problemler
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800">
          Geometri (Temel)
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800">
          Limit-Türev-İntegral
        </p>
      </div>
    </section>
  );
}
