"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { CgSpinner } from "react-icons/cg";

type FlamesRecord = {
  _id: string;
  name1: string;
  name2: string;
  result: string;
  createdAt: string;
};

function groupByDate(records: FlamesRecord[]): Record<string, FlamesRecord[]> {
  return records.reduce((acc, record) => {
    const date = new Date(record.createdAt);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(record);
    return acc;
  }, {} as Record<string, FlamesRecord[]>);
}

export default function FlamesHistoryPage() {
  const [groupedData, setGroupedData] = useState<Record<string, FlamesRecord[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [key, setKey] = useState("");
  const router = useRouter();

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === process.env.NEXT_PUBLIC_SECRET_KEY) {
      setShowModal(false);
      fetchData();
    } else {
      router.push('/404');
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/api/getData',{
        headers:{
            'authorization':process.env.NEXT_PUBLIC_API_KEY || ''
        }
      });
      const data = await response.json();
      console.log(data)
      setGroupedData(groupByDate(data));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/95 grid place-items-center p-4">
        <div className="bg-black p-6 rounded-lg w-full max-w-sm border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Enter Access Key</h2>
          <form onSubmit={handleKeySubmit} className="space-y-4">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-2 rounded bg-black border border-white/20 text-white focus:outline-none"
              placeholder="Enter key..."
              autoFocus
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-white text-black rounded hover:bg-white/90 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-black">
        <div className="text-white">
            <CgSpinner className="w-10 h-10 animate-spin"/>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">History</h1>
        <div className="space-y-6">
          {Object.entries(groupedData).map(([date, records]) => (
            <div key={date}>
              <h2 className="text-sm font-medium text-white/70 mb-2">
                {date}
              </h2>
              <div className="bg-black border border-white/20 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Name 1</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Name 2</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr 
                        key={record._id} 
                        className="border-t border-white/20 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-white">{record.name1}</td>
                        <td className="px-4 py-3 text-sm text-white">{record.name2}</td>
                        <td className="px-4 py-3 text-sm font-medium text-white">{record.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
