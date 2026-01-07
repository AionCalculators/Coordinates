import { useState, useMemo, useCallback } from 'react';
import { Race, Skill, CoordinateFormat } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getCoordinates, filterByLevel, groupByMap, getUniqueMaps } from './data';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RaceSelection } from './components/RaceSelection';
import { SkillSelection } from './components/SkillSelection';
import { LevelInput } from './components/LevelInput';
import { MapFilter } from './components/MapFilter';
import { ResourceList } from './components/ResourceList';
import { FormatSelection } from './components/FormatSelection';

type SkillLevels = {
  [K in `${Race}-${Skill}`]?: number | null;
};

function App() {
  const [race, setRace] = useLocalStorage<Race | null>('aion-coords-race', null);
  const [skill, setSkill] = useLocalStorage<Skill | null>('aion-coords-skill', null);
  const [skillLevels, setSkillLevels] = useLocalStorage<SkillLevels>('aion-coords-skill-levels', {});
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [coordinateFormat, setCoordinateFormat] = useLocalStorage<CoordinateFormat>('aion-coords-format', 'newer');

  // Get current skill level based on race and skill
  const skillLevel = useMemo(() => {
    if (!race || !skill) return null;
    const key = `${race}-${skill}` as const;
    return skillLevels[key] ?? null;
  }, [race, skill, skillLevels]);

  // Set skill level for current race and skill
  const setSkillLevel = useCallback((level: number | null) => {
    if (!race || !skill) return;
    const key = `${race}-${skill}` as const;
    setSkillLevels(prev => ({ ...prev, [key]: level }));
  }, [race, skill, setSkillLevels]);

  // Clear skill level for current race and skill
  const clearSkillLevel = useCallback(() => {
    if (!race || !skill) return;
    const key = `${race}-${skill}` as const;
    setSkillLevels(prev => {
      const newLevels = { ...prev };
      delete newLevels[key];
      return newLevels;
    });
  }, [race, skill, setSkillLevels]);

  // Get and filter resources
  const allResources = useMemo(() => {
    if (!race || !skill) return [];
    return getCoordinates(race, skill);
  }, [race, skill]);

  const filteredResources = useMemo(() => {
    return filterByLevel(allResources, skillLevel);
  }, [allResources, skillLevel]);

  const groupedResources = useMemo(() => {
    return groupByMap(filteredResources);
  }, [filteredResources]);

  const availableMaps = useMemo(() => {
    return getUniqueMaps(filteredResources);
  }, [filteredResources]);

  const handleRaceSelect = (selectedRace: Race) => {
    setRace(selectedRace);
    setSelectedMap(null);
  };

  const handleSkillSelect = (selectedSkill: Skill) => {
    setSkill(selectedSkill);
    setSelectedMap(null);
  };

  const handleClearLevel = () => {
    clearSkillLevel();
    setSelectedMap(null);
  };

  return (
    <>
      <Header />
      
      <main className="main">
        <div className="container">
          <div className="controls-panel">
            <RaceSelection 
              selectedRace={race} 
              onSelect={handleRaceSelect} 
            />
            
            <SkillSelection
              selectedSkill={skill}
              onSelectSkill={handleSkillSelect}
            />
            
            {race && skill && (
              <LevelInput
                level={skillLevel}
                onLevelChange={setSkillLevel}
                onClear={handleClearLevel}
              />
            )}
          </div>
          
          {race && skill && (
            <>
              {availableMaps.length > 0 && (
                <MapFilter
                  maps={availableMaps}
                  selectedMap={selectedMap}
                  onSelectMap={setSelectedMap}
                />
              )}
              
              <FormatSelection
                selectedFormat={coordinateFormat}
                onSelectFormat={setCoordinateFormat}
                race={race}
              />
              
              <ResourceList
                groupedResources={groupedResources}
                selectedMap={selectedMap}
                coordinateFormat={coordinateFormat}
                race={race}
              />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}

export default App;
