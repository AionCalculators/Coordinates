import { useTranslation } from 'react-i18next';
import { Skill } from '../types';

interface SkillSelectionProps {
  selectedSkill: Skill | null;
  onSelectSkill: (skill: Skill) => void;
}

export function SkillSelection({ selectedSkill, onSelectSkill }: SkillSelectionProps) {
  const { t } = useTranslation();

  return (
    <div className="control-group">
      <h3>{t('selectSkill')}</h3>
      <div className="toggle-buttons">
        <button 
          className={`toggle-btn skill ${selectedSkill === 'aethertapping' ? 'selected' : ''}`}
          onClick={() => onSelectSkill('aethertapping')}
        >
          <span className="toggle-icon">💫</span>
          <span className="toggle-label">{t('aethertapping')}</span>
        </button>
        
        <button 
          className={`toggle-btn skill ${selectedSkill === 'essencetapping' ? 'selected' : ''}`}
          onClick={() => onSelectSkill('essencetapping')}
        >
          <span className="toggle-icon">💎</span>
          <span className="toggle-label">{t('essencetapping')}</span>
        </button>
      </div>
    </div>
  );
}
