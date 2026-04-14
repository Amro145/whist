"use client";

import React, { useState, useEffect } from 'react';

const WhistGame = () => {
  const [teamNames, setTeamNames] = useState<{ t1: string; t2: string }>({ t1: 'الفريق الأول', t2: 'الفريق الثاني' });
  const [scores, setScores] = useState<{ t1: number; t2: number }>({ t1: 0, t2: 0 });
  const [bid, setBid] = useState<{ team: 't1' | 't2'; count: number }>({ team: 't1', count: 7 });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showSik, setShowSik] = useState(false);

  // 1. تحميل البيانات عند أول تشغيل للمتصفح فقط
  useEffect(() => {
    const savedScores = localStorage.getItem('whist_scores');
    const savedNames = localStorage.getItem('whist_names');
    const savedRounds = localStorage.getItem('whist_rounds');
    const savedStarted = localStorage.getItem('whist_started');

    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedNames) setTeamNames(JSON.parse(savedNames));
    if (savedRounds) setRounds(parseInt(savedRounds));
    if (savedStarted) setIsGameStarted(JSON.parse(savedStarted));
  }, []);

  // 2. حفظ البيانات تلقائياً عند أي تغيير في الـ State
  useEffect(() => {
    if (isGameStarted) {
      localStorage.setItem('whist_scores', JSON.stringify(scores));
      localStorage.setItem('whist_names', JSON.stringify(teamNames));
      localStorage.setItem('whist_rounds', rounds.toString());
      localStorage.setItem('whist_started', JSON.stringify(isGameStarted));
    }
  }, [scores, teamNames, rounds, isGameStarted]);

  const handleRoundResult = (actualEaten: number) => {
    if (winner) return;

    const isSuccess = actualEaten >= bid.count;
    const opponent: 't1' | 't2' = bid.team === 't1' ? 't2' : 't1';

    setScores((prev) => {
      const updated = { ...prev };
      if (isSuccess) {
        updated[bid.team] += actualEaten;
      } else {
        updated[bid.team] -= bid.count;
        updated[opponent] += actualEaten;
      }

      if (updated.t1 >= 25 || updated.t1 <= -25) setWinner(teamNames.t1);
      else if (updated.t2 >= 25 || updated.t2 <= -25) setWinner(teamNames.t2);
      
      setRounds(r => r + 1);
      
      // احتفال لو جاب 13 أو 0
      if (actualEaten === 13 || actualEaten === 0) {
        setShowSik(true);
        setTimeout(() => {
          setShowSik(false);
          // العودة لبداية اللعبة تلقائياً بعد السيك
          localStorage.clear();
          setScores({ t1: 0, t2: 0 });
          setRounds(0);
          setWinner(null);
          setBid({ team: 't1', count: 7 });
          setIsGameStarted(false);
        }, 5000);
      }
      
      return updated;
    });
  };

  const resetGame = () => {
    if (confirm('هل أنت متأكد من العودة وتصفير النقاط؟')) {
      // مسح الـ LocalStorage تماماً
      localStorage.clear();
      setScores({ t1: 0, t2: 0 });
      setRounds(0);
      setWinner(null);
      setBid({ team: 't1', count: 7 });
      setIsGameStarted(false); // نرجعه لشاشة إدخال الأسماء
    }
  };

  // شاشة البداية
  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 antialiased text-white" dir="rtl">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
          <h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">إعداد اللعبة</h2>
          <div className="space-y-4">
            <input 
              type="text" placeholder="اسم الفريق الأول"
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setTeamNames({...teamNames, t1: e.target.value})}
            />
            <input 
              type="text" placeholder="اسم الفريق الثاني"
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              onChange={(e) => setTeamNames({...teamNames, t2: e.target.value})}
            />
            <button 
              onClick={() => setIsGameStarted(true)}
              className="w-full py-4 bg-linear-to-r from-blue-600 to-emerald-600 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
            >
              ابدأ الملحمة 🃏
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center" dir="rtl">
      <div className="max-w-2xl w-full mx-auto">
        {/* شريط التحكم العلوي */}
        <div className="flex items-center justify-between mb-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-4">
            <span className="bg-slate-800 px-4 py-1.5 rounded-full text-sm font-bold border border-slate-700">
              الجولة: {rounds}
            </span>
          </div>
          <button 
            onClick={resetGame}
            className="text-xs font-bold px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all"
          >
            تصفير اللعبة ↺
          </button>
        </div>
        {/* لوحة النتائج */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`p-6 rounded-2xl border-2 transition-all ${scores.t1 < 0 ? 'border-red-500/50 bg-red-500/5' : 'border-blue-500/50 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]'}`}>
            <p className="text-sm text-slate-400 mb-1">{teamNames.t1}</p>
            <h2 className="text-5xl font-black">{scores.t1}</h2>
          </div>
          <div className={`p-6 rounded-2xl border-2 transition-all ${scores.t2 < 0 ? 'border-red-500/50 bg-red-500/5' : 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]'}`}>
            <p className="text-sm text-slate-400 mb-1">{teamNames.t2}</p>
            <h2 className="text-5xl font-black">{scores.t2}</h2>
          </div>
        </div>

        {winner ? (
          <div className="text-center p-12 bg-slate-900 rounded-3xl border border-yellow-500/50">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4 animate-bounce">🏆 الفائز: {winner}</h2>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors">لعبة جديدة</button>
          </div>
        ) : (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">الفريق المسمي:</span>
                <select 
                  className="bg-slate-800 p-2 rounded-lg border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setBid({ ...bid, team: e.target.value as 't1' | 't2' })}
                >
                  <option value="t1">{teamNames.t1}</option>
                  <option value="t2">{teamNames.t2}</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">التسميه:</span>
                <input 
                  type="number" min="7" max="13" value={bid.count}
                  className="w-16 bg-slate-800 p-2 rounded-lg border border-slate-700 text-center text-xl font-bold"
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 7 && val <= 13) setBid({...bid, count: val});
                    else if (isNaN(val)) setBid({...bid, count: 7});
                  }}
                />
              </div>
            </div>

            <p className="text-center text-slate-500 mb-4 text-sm font-medium tracking-widest uppercase">الأكلات الفعلية</p>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(14).keys()].map(n => (
                <button 
                  key={n} 
                  onClick={() => handleRoundResult(n)}
                  className="h-12 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-blue-600 hover:scale-110 active:scale-90 transition-all font-bold border border-slate-700"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* شاشة احتفال السيك */}
      {showSik && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <h1 className="text-8xl md:text-9xl font-black text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)] animate-bounce mb-8">
            سييييييييييك
          </h1>
          <div className="text-9xl animate-spin duration-1000">
            😂
          </div>
          <div className="flex gap-4 mt-8">
            <span className="text-6xl animate-bounce delay-75">🤣</span>
            <span className="text-6xl animate-bounce delay-150">🔥</span>
            <span className="text-6xl animate-bounce delay-300">🃏</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhistGame;