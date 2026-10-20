import React, { useState } from 'react';
import CircleOfFifths from './components/CircleOfFifths';
import GuitarNeck from './components/GuitarNeck';
import TheorySection from './components/TheorySection';
import HelpSection from './components/HelpSection';
import { getDiatonicChords, getScaleNotes, getChordShapes, ChordShape } from './data/musicData';
import { Language, translations } from './data/translations';

type TabType = 'main' | 'theory' | 'help';

function App() {
  const [selectedKey, setSelectedKey] = useState('C');
  const [keyType, setKeyType] = useState<'major' | 'minor'>('major');
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [shapeIndex, setShapeIndex] = useState(0);
  const [showSheet, setShowSheet] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<TabType>('main');

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key];
  };

  const diatonicChords = getDiatonicChords(selectedKey, keyType);
  const scaleNotes = getScaleNotes(selectedKey, keyType);

  const handleKeySelect = (key: string, type: 'major' | 'minor') => {
    setSelectedKey(key);
    setKeyType(type);
    setSelectedChord(null);
    setShapeIndex(0);
    setShowSheet(false);
  };

  const handleChordSelect = (chordName: string) => {
    setSelectedChord(chordName);
    setShapeIndex(0);
    setShowSheet(true);
  };

  const chordShapes = selectedChord ? getChordShapes(selectedChord) : [];
  const currentShape: ChordShape | undefined = chordShapes[shapeIndex];

  const majorDegrees = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const minorDegrees = ['i', 'ii', 'III', 'iv', 'v', 'VI', 'VII'];
  const degrees = keyType === 'major' ? majorDegrees : minorDegrees;

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ru' : 'en');
  };

  return (
    <div className="min-h-screen bg-[#0f0f1e] text-white flex flex-col overflow-hidden safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="px-3 pt-2 pb-1 flex items-center justify-between border-b border-gray-800/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-black" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" />
              <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-xs font-bold text-white leading-tight">{t('appTitle')}</h1>
            <p className="text-[9px] text-gray-500 leading-tight">{t('appSubtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5 bg-gray-800/50 rounded-full p-0.5">
            <button
              onClick={() => { setKeyType('major'); }}
              className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
                keyType === 'major'
                  ? 'bg-yellow-400/20 text-yellow-300 shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t('maj')}
            </button>
            <button
              onClick={() => { setKeyType('minor'); }}
              className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
                keyType === 'minor'
                  ? 'bg-teal-400/20 text-teal-300 shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t('min')}
            </button>
          </div>
          <button
            onClick={toggleLanguage}
            className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
              language === 'ru'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            {language === 'en' ? 'EN' : 'RU'}
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="flex border-b border-gray-800/50 flex-shrink-0">
        <button
          onClick={() => setActiveTab('main')}
          className={`flex-1 py-2 text-[11px] font-medium transition-all ${
            activeTab === 'main'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          🎵 {t('tabMain')}
        </button>
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex-1 py-2 text-[11px] font-medium transition-all ${
            activeTab === 'theory'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          📚 {t('tabTheory')}
        </button>
        <button
          onClick={() => setActiveTab('help')}
          className={`flex-1 py-2 text-[11px] font-medium transition-all ${
            activeTab === 'help'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          ❓ {t('tabHelp')}
        </button>
      </nav>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {activeTab === 'main' && (
          <>
            {/* Circle Section */}
            <div className="px-2 pt-2 pb-1">
              <CircleOfFifths
                selectedKey={selectedKey}
                keyType={keyType}
                onKeySelect={handleKeySelect}
                highlightedNotes={scaleNotes}
              />
            </div>

            {/* Scale Notes with degrees */}
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-1.5 h-1.5 rounded-full ${keyType === 'major' ? 'bg-yellow-400' : 'bg-teal-400'}`} />
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {selectedKey}{keyType === 'minor' ? 'm' : ''} {t('scaleNotes')}
                </h3>
              </div>
              <div className="flex gap-1 flex-wrap">
                {scaleNotes.map((note, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center rounded-lg py-1 px-1.5 min-w-[36px]
                      ${keyType === 'major'
                        ? 'bg-yellow-400/10 border border-yellow-400/20'
                        : 'bg-teal-400/10 border border-teal-400/20'
                      }`}
                  >
                    <span className={`text-[8px] font-mono ${
                      keyType === 'major' ? 'text-yellow-400/60' : 'text-teal-400/60'
                    }`}>
                      {degrees[i]}
                    </span>
                    <span className={`text-xs font-bold ${
                      keyType === 'major' ? 'text-yellow-300' : 'text-teal-300'
                    }`}>
                      {note}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diatonic Chords */}
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-1.5 h-1.5 rounded-full ${keyType === 'major' ? 'bg-yellow-400' : 'bg-teal-400'}`} />
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex-1">
                  {t('diatonicChords')}
                </h3>
                <span className="text-[9px] text-gray-500 flex items-center gap-0.5">
                  {t('tapToSeeShape')}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {diatonicChords.map((chord) => {
                  const chordShapes = getChordShapes(chord.name);
                  const hasShape = chordShapes.length > 0;
                  const isSelected = selectedChord === chord.name;

                  const getQualityStyle = (quality: string): string => {
                    switch (quality) {
                      case 'maj': return 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300';
                      case 'min': return 'bg-teal-500/15 border-teal-500/40 text-teal-300';
                      case 'dim': return 'bg-red-500/15 border-red-500/40 text-red-300';
                      default: return 'bg-gray-500/15 border-gray-500/40 text-gray-300';
                    }
                  };

                  return (
                    <button
                      key={chord.name}
                      onClick={() => handleChordSelect(chord.name)}
                      className={`
                        relative flex flex-col items-center p-1.5 rounded-lg border-2 transition-all duration-200
                        ${isSelected
                          ? 'border-yellow-400 bg-yellow-400/20 scale-105 shadow-lg shadow-yellow-400/20'
                          : `${getQualityStyle(chord.quality)} hover:scale-105 active:scale-95`
                        }
                      `}
                    >
                      <span className="text-[8px] text-gray-500 font-mono">{chord.roman}</span>
                      <span className="text-xs font-bold mt-0.5">{chord.name}</span>
                      {hasShape && (
                        <span className="mt-0.5">
                          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-gray-500" fill="currentColor">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hint */}
            <div className="px-3 py-2">
              <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/30">
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  🎯 {t('hint')}
                </p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'theory' && <TheorySection language={language} />}
        {activeTab === 'help' && <HelpSection language={language} />}
      </div>

      {/* Bottom Sheet - Chord Shape */}
      {showSheet && selectedChord && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSheet(false)}
          />
          <div className="relative w-full max-w-lg bg-[#1a1a2e] rounded-t-3xl border-t border-gray-700/50 p-4 pb-6 animate-slide-up shadow-2xl safe-area-bottom">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-600 rounded-full" />
            
            <div className="flex items-center justify-between mb-3 mt-1">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedChord}</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {chordShapes.length} {chordShapes.length !== 1 ? t('voicingsAvailable') : t('voicingAvailable')}
                </p>
              </div>
              <button
                onClick={() => setShowSheet(false)}
                className="w-7 h-7 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {chordShapes.length > 1 && (
              <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                {chordShapes.map((shape, idx) => (
                  <button
                    key={idx}
                    onClick={() => setShapeIndex(idx)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
                      idx === shapeIndex
                        ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {shape.name}
                  </button>
                ))}
              </div>
            )}

            {currentShape && (
              <div className="flex justify-center py-1">
                <GuitarNeck shape={currentShape} />
              </div>
            )}

            {chordShapes.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p className="text-3xl mb-2">🎸</p>
                <p className="text-xs">{t('noDiagram')} "{selectedChord}"</p>
                <p className="text-[10px] mt-1 text-gray-600">{t('tryAnother')}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mt-3 text-[9px] text-gray-500">
              <span className="flex items-center gap-0.5">
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-[7px] text-yellow-300">1</span>
                {t('index')}
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-[7px] text-yellow-300">2</span>
                {t('middle')}
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-[7px] text-yellow-300">3</span>
                {t('ring')}
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-[7px] text-yellow-300">4</span>
                {t('pinky')}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 mt-1.5 text-[9px] text-gray-500">
              <span className="flex items-center gap-0.5">
                <span className="text-teal-400">○</span> {t('openString')}
              </span>
              <span className="flex items-center gap-0.5">
                <span className="text-red-400">✕</span> {t('dontPlay')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
