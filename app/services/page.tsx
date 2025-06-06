"use client";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-8">
          <span className="text-8xl mb-4 block">🚧</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-800">Služby</h1>
          <h2 className="text-2xl font-bold mb-4 text-gray-600">Momentálně ve výstavbě</h2>
          <p className="text-lg text-gray-700">
            Pracujeme na kompletním přehledu našich služeb.<br />
            Brzy zde najdete detailní informace o všech našich službách.
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <p className="text-gray-700">
            <strong>Pro aktuální informace o službách nás prosím kontaktujte přímo.</strong>
          </p>
        </div>
      </div>
    </main>
  );
} 