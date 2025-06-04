'use client';

import { useEffect, useState, useMemo } from 'react';
import { getBikes } from './services/bikeService';
import { getPromotedBikes } from './services/promotedService';
import { Bike } from './models/Bike';
import { getAssetPath } from './utils/pathUtils';
import Link from 'next/link';

export default function HomePage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [promotedModelNumbers, setPromotedModelNumbers] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(true);

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
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center bg-gray-100 overflow-hidden">
        <img
          src={getAssetPath('/images/ebike-mtb-hero.jpg')}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 z-10" style={{ background: 'rgba(0,0,0,0.3)' }} />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">Najděte svůj ideální elektrokolo - nyní v akci!</h1>
          <p className="text-lg md:text-2xl mb-6 text-white drop-shadow">Omezená nabídka: Speciální ceny na prémiové elektrokola</p>
          <Link href="/catalog">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition-colors cursor-pointer select-none">
              Zobrazit kola
            </button>
          </Link>
        </div>
      </section>

      {/* About & Value Proposition Section */}
      <section className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-lg md:text-xl mb-6 text-gray-800">
          Po letech pomoci cyklistům najít ideální kolo a poskytování odborného servisu jsem vytvořil tyto stránky, abych své zkušenosti přiblížil přímo vám. Ať už dojíždíte do práce, objevujete stezky nebo si jen užíváte svobodu jízdy na elektrokole, pomohu vám najít perfektní elektrokolo za bezkonkurenční cenu.
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
                  className="w-full h-48 object-contain mb-4 bg-gray-50 rounded"
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
