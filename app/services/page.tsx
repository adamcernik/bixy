"use client";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-blue-800">Profesionální cyklistické služby</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          <span className="font-semibold">Více než 10 let zkušeností</span><br />
          Již více než deset let pomáhám cyklistům orientovat se ve světě elektrokol. Desítky spokojených zákazníků se na mě obracejí při výběru i servisu. Moje vášeň pro kola Bulls a závazek ke špičkovým službám mi vynesly pověst spolehlivosti a odbornosti v komunitě elektrokol.
        </p>
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Naše služby</h2>
        <div className="space-y-8">
          <section className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Bike Consultation & Selection</h3>
            <p className="text-gray-700 mb-2 font-semibold">Find Your Perfect Match</p>
            <p className="text-gray-700">Choosing the right bike can be overwhelming with so many options available. While I specialize in ebikes and have extensive knowledge of the Bulls lineup, I also help customers with traditional bicycles when needed. I work personally with each customer to understand your riding style, needs, and budget, helping you find the ideal bike and secure it at a reasonable price that fits your budget.</p>
          </section>
          <section className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Professional Setup & Configuration</h3>
            <p className="text-gray-700 mb-2 font-semibold">Ready to Ride Right Away</p>
            <p className="text-gray-700">Getting your new ebike properly set up is crucial for comfort, safety, and performance. I handle complete bike assembly, adjustment, and fine-tuning to ensure everything is perfectly calibrated for your body and riding preferences.</p>
          </section>
          <section className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Accessories & Equipment Consultation</h3>
            <p className="text-gray-700 mb-2 font-semibold">Complete Your Setup</p>
            <p className="text-gray-700">The right accessories make all the difference in your ebike experience. From helmets and locks to bags and lighting systems, I'll help you choose accessories that enhance your riding while staying within your budget.</p>
          </section>
          <section className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Servis a opravy v domácí dílně</h3>
            <p className="text-gray-700 mb-2 font-semibold">Pohodlný a osobní přístup</p>
            <p className="text-gray-700">Provozuji osobní servis a opravy elektrokol i klasických kol ve své domácí dílně v příjemném prostředí. Specializuji se na elektrokola, ale rád opravím i běžná kola. Díky tomuto zázemí se mohu každému kolu věnovat individuálně a nabídnout výhodnější ceny.</p>
          </section>
          <section className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Pokročilá diagnostika elektrokol</h3>
            <p className="text-gray-700 mb-2 font-semibold">Moderní řešení problémů</p>
            <p className="text-gray-700">Moderní elektrokola jsou sofistikované stroje, které vyžadují speciální diagnostické vybavení. Moje dílna je vybavena profesionálními nástroji pro rychlou diagnostiku elektrických závad, problémů s motorem, baterií i systémových chyb, které běžné servisy často neodhalí.</p>
          </section>
          <section className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Reklamace a záruky</h3>
            <p className="text-gray-700 mb-2 font-semibold">Bezstarostná podpora v záruce</p>
            <p className="text-gray-700">Pokud nastane problém v záruce, vyřídím vše za vás. Ať už jde o opravu v mé dílně nebo komunikaci s výrobcem, postarám se o vše potřebné, abyste měli kolo co nejdříve zpět v perfektním stavu a bez zbytečných starostí.</p>
          </section>
        </div>
        <div className="mt-10 text-center">
          <p className="text-lg text-gray-800 font-semibold">Potřebujete poradit?</p>
          <p className="text-gray-700">Stejně jako desítky zákazníků přede vámi, neváhejte zavolat, když potřebujete odbornou radu nebo profesionální servis. Jsem tu, abych vám pomohl jezdit s jistotou.</p>
        </div>
        {/* Persona Cards Section */}
        <div className="my-12">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row items-center gap-6 border border-gray-200">
            {/* Left side: Persona name, emoji, bike image, and model name */}
            <div className="flex-shrink-0 flex flex-col items-center w-full md:w-1/3">
              <span className="text-5xl mb-2">🏢</span>
              <h3 className="text-xl font-bold text-blue-900 text-center mb-2">Petr "Korporát" Novák (42 let)</h3>
              {/* Bike image */}
              <img
                src="/jpeg/667082.jpeg"
                alt="Bike 667082"
                className="w-40 h-40 object-contain rounded shadow mb-2 border"
                style={{ background: '#f9f9f9' }}
              />
              {/* Bike model name */}
              <span className="text-base font-semibold text-gray-800 text-center">Bulls E-Stream EVO AM 2 27.5+ (767-22951)</span>
            </div>
            {/* Right side: Persona info */}
            <div className="flex-1">
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Profil:</span>
                <p className="text-gray-700 mt-1">
                  IT manažer z Prahy, který právě koupil nový dům v Říčanech. Každý den dojíždí 25 km do práce přes kopce, ale zároveň nechce přijít do kanceláře jako zmoklý had. Rád by šetřil na benzínu a parkování, ale nechce vypadat jako cyklista v tretračkách.
                </p>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Požadavky:</span>
                <ul className="list-disc list-inside text-gray-700 mt-1">
                  <li>Dojezd minimálně 60 km</li>
                  <li>Úložný prostor na notebook a svačinu</li>
                  <li>Možnost jezdit v obleku bez pocení</li>
                  <li>„Něco, co nevypadá jako elektrokolo mého tchána“</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Rozpočet:</span>
                <span className="ml-2 text-gray-900 font-bold">80–120 tisíc</span>
                <span className="ml-2 text-gray-500 text-sm">(manželka schválila po zdůraznění úspor za benzín)</span>
              </div>
            </div>
          </div>
          {/* Here you can add the selected bike for this persona */}
        </div>
      </div>
    </main>
  );
} 