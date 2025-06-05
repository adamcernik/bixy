'use client';

import { useEffect, useState, useMemo } from 'react';
import { getBikes } from './services/bike/bikeService';
import { getPromotedBikes } from './services/promoted/promotedService';
import { Bike } from './models/Bike';
import { getAssetPath } from './utils/pathUtils';
import Link from 'next/link';

export default function HomePage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [promotedModelNumbers, setPromotedModelNumbers] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(true);
  const [activeHero, setActiveHero] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [allBikes, promoted] = await Promise.all([
        getBikes(),
        getPromotedBikes()
      ]);
      setBikes(allBikes);
      setPromotedModelNumbers(promoted);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHero((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Get promoted bikes by model number, fallback to latest bikes
  const promotedBikes = useMemo(() => {
    const found = promotedModelNumbers
      .map((modelNumber) => bikes.find((b) => b.modelNumber === modelNumber))
      .filter(Boolean) as Bike[];
    if (found.length < 3) {
      // Fill with latest bikes (not already in found)
      const latest = bikes
        .filter((b) => !found.some((f) => f.modelNumber === b.modelNumber))
        .slice(0, 3 - found.length);
      return [...found, ...latest];
    }
    return found;
  }, [bikes, promotedModelNumbers]);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section Carousel */}
      <section className="relative w-full min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-center bg-gray-100 overflow-hidden pb-8 md:pb-12">
        {/* Hero Slides */}
        {/* Slide 1 */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${activeHero === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img
            src={getAssetPath('/images/hero-background.jpeg')}
            alt="Hero pozadí"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="relative z-20 flex flex-col items-center w-full h-full justify-center">
            <img
              src={getAssetPath('/images/hero-bike.png')}
              alt="Hero kolo"
              className="w-[60vw] max-w-[500px] drop-shadow-xl pointer-events-none select-none mx-auto"
              style={{ maxHeight: '80%', objectFit: 'contain', marginBottom: '-15px' }}
            />
            <div className="mt-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">Najděte své ideální elektrokolo</h1>
              <p className="text-lg md:text-2xl mb-6 text-white drop-shadow">Dělám to dlouho, dělám to rád a jsem v tom dobrý.</p>
              <Link href="/catalog">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition-colors cursor-pointer select-none">
                  Zobrazit kola
                </button>
              </Link>
            </div>
          </div>
        </div>
        {/* Slide 2 */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${activeHero === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img
            src={getAssetPath('/images/hero-background-city.jpg')}
            alt="Hero pozadí město"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="relative z-20 flex flex-col items-center w-full h-full justify-center">
            <img
              src={getAssetPath('/images/846-18641.png')}
              alt="Hero kolo město"
              className="w-[60vw] max-w-[500px] drop-shadow-xl pointer-events-none select-none mx-auto"
              style={{ maxHeight: '80%', objectFit: 'contain', marginBottom: '-15px' }}
            />
            <div className="mt-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">Objevte městskou mobilitu</h1>
              <p className="text-lg md:text-2xl mb-6 text-white drop-shadow">Styl, výkon a pohodlí pro každodenní jízdu.</p>
              <Link href="/catalog">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition-colors cursor-pointer select-none">
                  Zobrazit kola
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About & Value Proposition Section */}
      <section className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-lg md:text-xl mb-6 text-gray-800">
        Po letech pomoci cyklistům najít ideální kolo a poskytování odborného servisu jsem vytvořil tyto stránky, abych své zkušenosti přiblížil přímo vám. Specializuji se výhradně na elektrokola značky Bulls, kterou velmi dobře a dlouho znám. Úzce spolupracuji s oficiálními dodavateli kol, motorů, baterií a dalších komponentů, což mi umožňuje nabídnout nejen kvalitní produkty, ale i spolehlivý servis a podporu. Ať už dojíždíte do práce, objevujete nové stezky nebo si jen užíváte svobodu elektrické jízdy, jsem tu, abych vám pomohl najít perfektní elektrokolo za skvělou cenu.
        </p>
      </section>

      {/* Promoted Bikes Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Doporučená kola</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promotedBikes.map((bike, idx) => (
              <div key={bike.id || idx} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <img
                  src={getAssetPath(`/jpeg/${bike.imageUrl}.jpeg`)}
                  alt={bike.modelName}
                  className="w-full h-48 object-contain mb-4 bg-white rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getAssetPath('/jpeg/placeholder.jpeg');
                  }}
                />
                <h3 className="text-xl font-semibold mb-2 text-center">{bike.modelName}</h3>
                <p className="text-gray-600 mb-2 text-center">{bike.manufacturer}</p>
                <p className="text-gray-800 font-bold mb-4 text-center">{
                  typeof bike.priceAction === 'number' && bike.priceAction > 0
                    ? `${bike.priceAction} Kč`
                    : (typeof bike.priceRetail === 'number' && bike.priceRetail > 0
                        ? `${bike.priceRetail} Kč`
                        : 'Cena na dotaz')
                }</p>
                <Link href={`/catalog/${bike.id}`} className="text-blue-600 hover:underline font-semibold">
                  Detail kola
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
