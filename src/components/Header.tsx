import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n';

export function Header() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = supportedLanguages.find(l => l.code === i18n.language) 
    || supportedLanguages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-content">
        <h1 className="header-title">✦ {t('appTitle')} ✦</h1>
        
        <div className="header-controls">
          <div className="language-selector" ref={dropdownRef}>
            <button 
              className="language-btn"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
            >
              🌐 {currentLanguage.name}
              <span style={{ marginLeft: '0.25rem' }}>{isOpen ? '▲' : '▼'}</span>
            </button>
            
            {isOpen && (
              <div className="language-dropdown">
                {supportedLanguages.map(lang => (
                  <button
                    key={lang.code}
                    className={`language-option ${lang.code === i18n.language ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
