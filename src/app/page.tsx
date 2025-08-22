/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Info } from 'lucide-react';
import { FaHeart } from "react-icons/fa";
type FlamesResult = {
  letter: string;
  meaning: string;
};

const flamesMap: Record<string, string> = {
  F: "Friends",
  L: "Love",
  A: "Affection / Attraction",
  M: "Marriage",
  E: "Enemies",
  S: "Siblings",
  "-": "Please enter two valid, non-empty names.",
};

function computeRemainingCount(a: string, b: string): number {
  a = a.toLowerCase().replace(/\s+/g, "").replace(/[^a-z]/g, "");
  b = b.toLowerCase().replace(/\s+/g, "").replace(/[^a-z]/g, "");

  if (!a || !b) return 0;

  const arrA = a.split("");
  const arrB = b.split("");

  for (let i = 0; i < arrA.length; i++) {
    const ch = arrA[i];
    const j = arrB.indexOf(ch);
    if (j !== -1) {
      arrB.splice(j, 1);
      arrA[i] = "";
    }
  }
  return arrA.filter(Boolean).length + arrB.length;
}

function flamesResult(count: number): FlamesResult {
  const letters = ["F", "L", "A", "M", "E", "S"];
  if (count <= 0) return { letter: "-", meaning: flamesMap["-"] };

  let idx = 0;
  while (letters.length > 1) {
    idx = (idx + count - 1) % letters.length;
    letters.splice(idx, 1);
  }
  const letter = letters[0];
  return { letter, meaning: flamesMap[letter] };
}

export default function FlamesPage() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState<FlamesResult | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = computeRemainingCount(name1, name2);
    const newResult = flamesResult(count);
    setResult(newResult);
    setIsPopupOpen(true);
    try {
      const response = await fetch('/api/submitData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name1: name1,
          name2: name2,
          result: newResult.meaning
        })
      });
      if (!response.ok) {
        console.error('Failed to submit data:', response.statusText);
      } else {
        console.log('Data submitted successfully');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleReset = () => {
    setName1("");
    setName2("");
    setResult(null);
  };

  const sanitizeInput = (val: string) => val.replace(/[^a-zA-Z\s]/g, "");

  return (
    <main className="min-h-[calc(100vh-60px)] md:min-h-screen overflow-hidden grid place-items-center bg-[radial-gradient(1200px_800px_at_20%_10%,#ffe4ec,transparent),radial-gradient(1000px_700px_at_90%_80%,#ffd7e0,transparent),linear-gradient(180deg,#fff0f5,#fff)] p-4 md:p-6 font-main">
      <div className="w-full max-w-2xl bg-gradient-to-b from-white to-[#fffafc] rounded-2xl shadow-[0_15px_35px_rgba(255,111,145,0.25),0_5px_15px_rgba(0,0,0,0.05)] border border-[#ffe1ea] px-5 md:px-7 pb-6 mb-3 md:mb-0">
        <div className="flex items-center mt-1">
          <h1 className="font-cursive font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#ff6f91] to-[#ff8fab] text-3xl md:text-4xl mb-1">
            Flames
          </h1>
          <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMG1uMjFsZmF3NTFiaG5kaXJla3hvb3E2YXJsYTVtaGp6MnV6cXg1OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3oKIPqM8BJ0ofNQOzK/giphy.gif" alt="" className="h-20 w-20 inline-flex -mt-2" />
        </div>
        <p className="text-xs text-[#6b5f5f] mb-6 text-wrap -mt-4 md:-mt-3">
          A playful compatibility game. Enter two names, and
          we&apos;ll compute the FLAMES result.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
            <div>
              <label htmlFor="name1" className="block text-xs text-[#6b5f5f] mb-1">
                Your Name
              </label>
              <input
                id="name1"
                type="text"
                value={name1}
                onChange={(e) => setName1(sanitizeInput(e.target.value))}
                maxLength={40}
                required
                className="w-full rounded-xl border text-[#6b5f5f] border-[#ffd6e2] px-4 py-3 text-base outline-none transition focus:border-[#ff6f91] focus:border-1"
              />

            </div>
            <div className="hidden md:block">
              <FaHeart className="text-[#ff6f91] w-5 h-5 mt-5" />
            </div>
            <div>
              <label htmlFor="name2" className="block text-xs text-[#6b5f5f] mb-1 mt-5 md:mt-0">
                Partner&apos;s Name
              </label>
              <input
                id="name2"
                type="text"
                value={name2}
                onChange={(e) => setName2(sanitizeInput(e.target.value))}
                maxLength={40}
                required
                className="w-full rounded-xl border text-[#6b5f5f] border-[#ffd6e2] px-4 py-3 text-base outline-none transition focus:border-[#ff6f91]"
              />

            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <Info className="text-[#6b5f5f] w-3 h-3 mt-[2px]" />
            <div className="text-xs text-[#6b5f5f]">
              Only A–Z characters. Others are removed automatically.
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-[#ff6f91] to-[#ff8fab] text-white font-semibold px-5 py-2 shadow-[0_10px_18px_rgba(255,111,145,0.25)] active:translate-y-px transition"
            >
              Calculate
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-[#ffd6e2] text-[#ff6f91] bg-white font-semibold px-5 py-2 active:translate-y-px transition"
            >
              Reset
            </button>
          </div>

          {isPopupOpen && result && (
            <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 px-4">
              <div className="relative w-full max-w-md bg-white rounded-2xl p-6 md:p-8 m-4 animate-in slide-in-from-bottom-4 duration-300 shadow-lg border border-gray-100">
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition"
                >
                  ✕
                </button>

                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-700 flex items-center justify-center">
                    <span className="mr-2">{name1}</span>
                    <span className="text-xl text-[#ff6f91]">
                      <FaHeart />
                    </span>
                    <span className="ml-2">{name2}</span>
                  </div>

                  <div className="text-[8rem] font-extrabold text-[#ff6f91] leading-none py-7">
                    {result.letter === "-" ? "FLAMES" : result.letter}
                  </div>

                  <div className="text-lg text-gray-600 border-t border-gray-200 pt-4">
                    <span className="font-semibold text-[#ff6f91] mr-1">Meaning :</span>
                    {result.meaning}
                  </div>

                  <div className="text-xs text-gray-500 italic mt-2">
                    Compatibility results are for entertainment purposes only.
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
