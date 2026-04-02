import { useState, useEffect } from 'react';

export function useVisitedPlaces() {
  const [visitedIds, setVisitedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ayutthaya_visited_places');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('ayutthaya_visited_places', JSON.stringify(visitedIds));
  }, [visitedIds]);

  const toggleVisit = (id: string) => {
    setVisitedIds((prev) =>
      prev.includes(id) ? prev.filter((visitedId) => visitedId !== id) : [...prev, id]
    );
  };

  const isVisited = (id: string) => visitedIds.includes(id);

  return { visitedIds, toggleVisit, isVisited };
}
