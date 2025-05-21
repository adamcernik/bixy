"use client";

import { useEffect, useState } from "react";
import { getBikes } from "../services/bikeService";
import { Bike } from "../models/Bike";

export default function MarginPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const bikesData = await getBikes();
        setBikes(bikesData);
      } catch (error) {
        setBikes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Bike Margin Table</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Model Name</th>
              <th className="px-4 py-2 text-right">Action Price</th>
              <th className="px-4 py-2 text-right">+30%</th>
              <th className="px-4 py-2 text-right">+25%</th>
            </tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr key={bike.id} className="border-t">
                <td className="px-4 py-2">{bike.modelName}</td>
                <td className="px-4 py-2 text-right">{bike.priceAction?.toLocaleString()} CZK</td>
                <td className="px-4 py-2 text-right text-green-700 font-semibold">
                  {bike.priceAction ? Math.round(bike.priceAction * 1.3).toLocaleString() : "-"} CZK
                </td>
                <td className="px-4 py-2 text-right text-blue-700 font-semibold">
                  {bike.priceAction ? Math.round(bike.priceAction * 1.25).toLocaleString() : "-"} CZK
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 