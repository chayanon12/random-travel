import { useState, useEffect } from 'react';
import { useVisitedPlaces } from './hooks/useVisitedPlaces';
import attractionsData from './data/attractions.json';

interface Attraction {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const attractions = attractionsData as Attraction[];

function App() {
  const [activeTab, setActiveTab] = useState<'random' | 'history'>('random');
  const [currentPlace, setCurrentPlace] = useState<Attraction | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const { visitedIds, toggleVisit, isVisited } = useVisitedPlaces();

  // Pick a random place initially
  useEffect(() => {
    if (!currentPlace) {
      getRandomPlace();
    }
  }, []);

  const getRandomPlace = () => {
    setIsRandomizing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * attractions.length);
      setCurrentPlace(attractions[randomIndex]);
      setIsRandomizing(false);
    }, 500); // 500ms fake loading for visual effect
  };

  const renderRandomizer = () => (
    <div className="tab-content">
      <button 
        className="btn-random" 
        onClick={getRandomPlace}
        disabled={isRandomizing}
      >
        {isRandomizing ? 'กำลังสุ่ม...' : '🎲 สุ่มสถานที่เที่ยวใหม่'}
      </button>

      {currentPlace && (
        <div className={`card ${isRandomizing ? 'is-randomizing' : ''}`}>
          <img src={currentPlace.imageUrl} alt={currentPlace.name} className="card-image" />
          
          {isVisited(currentPlace.id) && (
            <div className="stamp-mark">ประทับตราแล้ว</div>
          )}

          <div className="card-content">
            <h2 className="card-title">{currentPlace.name}</h2>
            <p className="card-description">{currentPlace.description}</p>
            
            <div className="actions">
              <button 
                className={`btn-stamp ${isVisited(currentPlace.id) ? 'stamped' : ''}`}
                onClick={() => toggleVisit(currentPlace.id)}
              >
                {isVisited(currentPlace.id) ? '✅ ไปมาแล้ว' : '📍 ประทับตราว่าไปแล้ว'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderHistory = () => {
    const visitedPlaces = attractions.filter(place => visitedIds.includes(place.id));

    if (visitedPlaces.length === 0) {
      return (
        <div className="empty-state">
          <h2>ยังไม่มีประวัติการเดินทาง</h2>
          <p>ลองสุ่มสถานที่และกด "ประทับตรา" ดูสิ!</p>
        </div>
      );
    }

    return (
      <div className="history-list">
        {visitedPlaces.map(place => (
          <div key={place.id} className="history-card">
            <img src={place.imageUrl} alt={place.name} />
            <div className="stamp-mark" style={{ fontSize: '1rem', padding: '0.2rem 0.5rem', top: '10px', right: '10px' }}>
              STAMPED
            </div>
            <div className="content">
              <h3>{place.name}</h3>
              <button 
                className="btn-stamp stamped" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                onClick={() => toggleVisit(place.id)}
              >
                ยกเลิกการประทับตรา
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <header>
        <h1>🇹🇭 อยุธยา Random Travel</h1>
        <p>สุ่มที่เที่ยวอยุธยา พร้อมเก็บประวัติการเดินทางของคุณ</p>
      </header>

      <nav>
        <button 
          className={activeTab === 'random' ? 'active' : ''} 
          onClick={() => setActiveTab('random')}
        >
          🎲 สุ่มที่เที่ยว
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''} 
          onClick={() => setActiveTab('history')}
        >
          📖 ประวัติของฉัน ({visitedIds.length})
        </button>
      </nav>

      <main style={{ marginTop: '2rem' }}>
        {activeTab === 'random' ? renderRandomizer() : renderHistory()}
      </main>
    </div>
  );
}

export default App;