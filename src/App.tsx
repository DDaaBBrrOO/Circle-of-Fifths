import React, { useState } from 'react';
import CircleOfFifths from './components/CircleOfFifths';
import GuitarNeck from './components/GuitarNeck';
import { getDiatonicChords, getScaleNotes, getChordShapes, ChordShape } from './data/musicData';

function App() {
  const [selectedKey, setSelectedKey] = useState('C');
  const [keyType, setKeyType] = useState<'major' | 'minor'>('major');
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [shapeIndex, setShapeIndex] = useState(0);
  const [showSheet, setShowSheet] = useState(false);

  const diatonicChords = getDiatonicChords(selectedKey, keyType);
  const scaleNotes = getScaleNotes(selectedKey, keyType);
  const chordShapes = selectedChord ? getChordShapes(selectedChord) : [];

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

  const currentShape: ChordShape | undefined = chordShapes[shapeIndex];

  // Roman numerals for scale degrees
  const majorDegrees = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const minorDegrees = ['i', 'ii', 'III', 'iv', 'v', 'VI', 'VII'];
  const degrees = keyType === 'major' ? majorDegrees : minorDegrees;

  return (
    <div className="min-h-screen bg-[#0f0f1e] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" />
              <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" />
              <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" />
              <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Circle of Fifths</h1>
            <p className="text-[10px] text-gray-500 leading-tight">Guitar Theory Tool</p>
          </div>
        </div>
        <div className="flex gap-1 bg-gray-800/50 rounded-full p-0.5">
          <button
            onClick={() => { setKeyType('major'); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              keyType === 'major'
                ? 'bg-yellow-400/20 text-yellow-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Maj
          </button>
          <button
            onClick={() => { setKeyType('minor'); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              keyType === 'minor'
                ? 'bg-teal-400/20 text-teal-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Min
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Circle Section */}
        <div className="px-2 pt-3 pb-1">
          <CircleOfFifths
            selectedKey={selectedKey}
            keyType={keyType}
            onKeySelect={handleKeySelect}
            highlightedNotes={scaleNotes}
          />
        </div>

        {/* Scale Notes with degrees */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${keyType === 'major' ? 'bg-yellow-400' : 'bg-teal-400'}`} />
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {selectedKey}{keyType === 'minor' ? 'm' : ''} Scale — Notes & Degrees
            </h3>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {scaleNotes.map((note, i) => (
              <div
                key={i}
                className={`flex flex-col items-center rounded-xl py-1.5 px-2 min-w-[42px] transition-all
                  ${keyType === 'major'
                    ? 'bg-yellow-400/10 border border-yellow-400/20'
                    : 'bg-teal-400/10 border border-teal-400/20'
                  }`}
              >
                <span className={`text-[9px] font-mono ${
                  keyType === 'major' ? 'text-yellow-400/60' : 'text-teal-400/60'
                }`}>
                  {degrees[i]}
                </span>
                <span className={`text-sm font-bold ${
                  keyType === 'major' ? 'text-yellow-300' : 'text-teal-300'
                }`}>
                  {note}
                </span>
                <span className={`text-[8px] ${
                  keyType === 'major' ? 'text-yellow-400/40' : 'text-teal-400/40'
                }`}>
                  {i + 1}{getOrdinalSuffix(i + 1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Diatonic Chords - with guitar icon */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${keyType === 'major' ? 'bg-yellow-400' : 'bg-teal-400'}`} />
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex-1">
              Diatonic Chords
            </h3>
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/>
              </svg>
              tap to see shape
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {diatonicChords.map((chord, idx) => {
              const chordShapes = getChordShapes(chord.name);
              const hasShape = chordShapes.length > 0;
              const isSelected = selectedChord === chord.name;

              const getQualityColor = (quality: string): string => {
                switch (quality) {
                  case 'maj': return 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300';
                  case 'min': return 'bg-teal-500/15 border-teal-500/30 text-teal-300';
                  case 'dim': return 'bg-red-500/15 border-red-500/30 text-red-300';
                  default: return 'bg-gray-500/15 border-gray-500/30 text-gray-300';
                }
              };

              return (
                <button
                  key={chord.name}
                  onClick={() => handleChordSelect(chord.name)}
                  className={`
                    relative flex flex-col items-center p-2 rounded-xl border transition-all duration-200
                    ${isSelected
                      ? 'border-yellow-400 bg-yellow-400/20 scale-105 shadow-lg shadow-yellow-400/20'
                      : `${getQualityColor(chord.quality)} hover:scale-105 active:scale-95`
                    }
                  `}
                >
                  <span className="text-[9px] text-gray-500 font-mono">{chord.roman}</span>
                  <span className="text-sm font-bold mt-0.5">{chord.name}</span>
                  {hasShape && (
                    <span className="mt-0.5">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 text-gray-500" fill="currentColor">
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
        <div className="px-4 py-2">
          <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/30">
            <p className="text-xs text-gray-400 leading-relaxed">
              🎯 <span className="text-gray-300">Tap a segment</span> on the circle to change key (it rotates to top).
              Then <span className="text-gray-300">tap any chord</span> to see its guitar fingering.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sheet - Chord Shape */}
      {showSheet && selectedChord && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSheet(false)}
          />
          {/* Sheet */}
          <div className="relative w-full max-w-lg bg-[#1a1a2e] rounded-t-3xl border-t border-gray-700/50 p-5 pb-8 animate-slide-up shadow-2xl">
            {/* Handle */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-600 rounded-full" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4 mt-2">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedChord}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {chordShapes.length} voicing{chordShapes.length !== 1 ? 's' : ''} available
                </p>
              </div>
              <button
                onClick={() => setShowSheet(false)}
                className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Voicing selector */}
            {chordShapes.length > 1 && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {chordShapes.map((shape, idx) => (
                  <button
                    key={idx}
                    onClick={() => setShapeIndex(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
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

            {/* Guitar Neck */}
            {currentShape && (
              <div className="flex justify-center py-2">
                <GuitarNeck shape={currentShape} />
              </div>
            )}

            {chordShapes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-3">🎸</p>
                <p className="text-sm">No chord diagram available for "{selectedChord}"</p>
                <p className="text-xs mt-1 text-gray-600">Try another chord from the diatonic list</p>
              </div>
            )}

            {/* Fingering legend */}
            <div className="flex items-center justify-center gap-3 mt-4 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-[8px] text-yellow-300">1</span>
                Index
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-[8px] text-yellow-300">2</span>
                Middle
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-[8px] text-yellow-300">3</span>
                Ring
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-[8px] text-yellow-300">4</span>
                Pinky
              </span>
            </div>

            {/* Symbols legend */}
            <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-teal-400">○</span> Open string
              </span>
              <span className="flex items-center gap-1">
                <span className="text-red-400">✕</span> Don't play
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default App;
