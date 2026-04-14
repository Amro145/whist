import React, { useState } from 'react';

const WhistGame = () => {
  // الحالة الأساسية للعبة
  const [teamNames, setTeamNames] = useState({ t1: 'الفريق 1', t2: 'الفريق 2' });
  const [scores, setScores] = useState({ t1: 0, t2: 0 });
  const [bid, setBid] = useState({ team: 't1', count: 7 });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);

  // دالة تسجيل النقاط ومراقبة النهاية (25 أو -25)
  const handleRoundResult = (actualEaten) => {
    if (winner) return; // وقف الحساب لو في فائز أصلاً

    const isSuccess = actualEaten >= bid.count;
    const opponent = bid.team === 't1' ? 't2' : 't1';

    setScores((prev) => {
      const updatedScores = { ...prev };

      if (isSuccess) {
        updatedScores[bid.team] += actualEaten;
      } else {
        updatedScores[bid.team] -= bid.count;
        updatedScores[opponent] += actualEaten;
      }

      // التحقق من شروط النهاية
      if (updatedScores.t1 >= 25 || updatedScores.t1 <= -25) setWinner(teamNames.t1);
      else if (updatedScores.t2 >= 25 || updatedScores.t2 <= -25) setWinner(teamNames.t2);

      return updatedScores;
    });
  };

  if (!isGameStarted) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', direction: 'rtl' }}>
        <h2>إعداد لعبة الويست 🃏</h2>
        <input 
          placeholder="اسم الفريق الأول" 
          onChange={(e) => setTeamNames({...teamNames, t1: e.target.value})}
          style={{ padding: '10px', margin: '5px' }}
        />
        <input 
          placeholder="اسم الفريق الثاني" 
          onChange={(e) => setTeamNames({...teamNames, t2: e.target.value})}
          style={{ padding: '10px', margin: '5px' }}
        />
        <br />
        <button 
          onClick={() => setIsGameStarted(true)}
          style={{ padding: '10px 30px', marginTop: '20px', cursor: 'pointer' }}
        >
          ابدأ اللعب
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', direction: 'rtl', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>حاسبة الويست</h1>

      {/* لوحة النتائج */}
      <div style={{ display: 'flex', justifyContent: 'space-around', background: '#f0f0f0', padding: '20px', borderRadius: '15px' }}>
        <div>
          <h3>{teamNames.t1}</h3>
          <h2 style={{ color: scores.t1 < 0 ? 'red' : 'green' }}>{scores.t1}</h2>
        </div>
        <div style={{ fontSize: '40px' }}>VS</div>
        <div>
          <h3>{teamNames.t2}</h3>
          <h2 style={{ color: scores.t2 < 0 ? 'red' : 'green' }}>{scores.t2}</h2>
        </div>
      </div>

      {winner ? (
        <div style={{ textAlign: 'center', marginTop: '30px', color: 'blue' }}>
          <h2>🎉 مبروك الفوز لـ {winner}! 🎉</h2>
          <button onClick={() => window.location.reload()}>لعبة جديدة</button>
        </div>
      ) : (
        <div style={{ marginTop: '30px', border: '1px solid #ddd', padding: '20px' }}>
          <h3>تسجيل الجولة:</h3>
          <div>
            الطلب: 
            <select onChange={(e) => setBid({ ...bid, team: e.target.value })}>
              <option value="t1">{teamNames.t1}</option>
              <option value="t2">{teamNames.t2}</option>
            </select>
            <input 
              type="number" min="7" max="13" value={bid.count}
              onChange={(e) => setBid({...bid, count: parseInt(e.target.value)})}
              style={{ width: '50px', marginRight: '10px' }}
            />
          </div>
          <p>اختار عدد الأكلات الفعلي:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
            {[...Array(14).keys()].map(n => (
              <button key={n} onClick={() => handleRoundResult(n)} style={{ padding: '10px' }}>{n}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhistGame;