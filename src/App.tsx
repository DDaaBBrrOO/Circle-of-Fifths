import React, { useState } from 'react';
import CircleOfFifths from './components/CircleOfFifths';
import ChordList from './components/ChordList';
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

        {/* Scale Notes */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${keyType === 'major' ? 'bg-yellow-400' : 'bg-teal-400'}`} />
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {selectedKey}{keyType === 'minor' ? 'm' : ''} Scale
            </h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {scaleNotes.map((note, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all
                  ${keyType === 'major'
                    ? 'bg-yellow-400/10 text-yellow-300 border border-yellow-400/20'
                    : 'bg-teal-400/10 text-teal-300 border border-teal-400/20'
                  }`}
              >
                {note}
              </div>
            ))}
          </div>
        </div>

        {/* Chord List */}
        <div className="px-4 py-3">
          <ChordList
            chords={diatonicChords}
            selectedChord={selectedChord}
            onChordSelect={handleChordSelect}
            keyType={keyType}
          />
        </div>

        {/* Quick info */}
        <div className="px-4 py-2">
          <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/30">
            <p className="text-xs text-gray-400 leading-relaxed">
              💡 <span className="text-gray-300">Tap</span> a segment on the circle to select a key.
              Then <span className="text-gray-300">tap a chord</span> below to see its guitar shape.
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
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
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

export default App;
