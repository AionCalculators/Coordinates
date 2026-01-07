import { useTranslation } from 'react-i18next';
import { Race } from '../types';

interface RaceSelectionProps {
  selectedRace: Race | null;
  onSelect: (race: Race) => void;
}

export function RaceSelection({ selectedRace, onSelect }: RaceSelectionProps) {
  const { t } = useTranslation();

  return (
    <div className="control-group">
      <h3>{t('selectRace')}</h3>
      <div className="toggle-buttons">
        <button 
          className={`toggle-btn asmodian ${selectedRace === 'asmodian' ? 'selected' : ''}`}
          onClick={() => onSelect('asmodian')}
        >
          <span className="toggle-icon">🌑</span>
          <span className="toggle-label">{t('asmodian')}</span>
        </button>
        
        <button 
          className={`toggle-btn elyos ${selectedRace === 'elyos' ? 'selected' : ''}`}
          onClick={() => onSelect('elyos')}
        >
          <span className="toggle-icon">☀️</span>
          <span className="toggle-label">{t('elyos')}</span>
        </button>
      </div>
    </div>
  );
}
