// Note names and their semitone values
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTE_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Circle of fifths order (clockwise)
export const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

// Major scales (intervals from root)
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

// Get note index
export function getNoteIndex(note: string): number {
  const idx = NOTES.indexOf(note);
  if (idx !== -1) return idx;
  return NOTE_FLATS.indexOf(note);
}

// Get notes of a scale
export function getScaleNotes(root: string, type: 'major' | 'minor'): string[] {
  const rootIdx = getNoteIndex(root);
  const intervals = type === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
  return intervals.map(i => NOTES[(rootIdx + i) % 12]);
}

// Diatonic chord qualities for major key
const MAJOR_DIATONIC_QUALITIES = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
const MAJOR_DIATONIC_ROMAN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

// Diatonic chord qualities for minor key
const MINOR_DIATONIC_QUALITIES = ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'];
const MINOR_DIATONIC_ROMAN = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

export function getDiatonicChords(root: string, type: 'major' | 'minor'): { roman: string; quality: string; root: string; name: string }[] {
  const scaleNotes = getScaleNotes(root, type);
  const qualities = type === 'major' ? MAJOR_DIATONIC_QUALITIES : MINOR_DIATONIC_QUALITIES;
  const romans = type === 'major' ? MAJOR_DIATONIC_ROMAN : MINOR_DIATONIC_ROMAN;

  return scaleNotes.map((note, i) => {
    const quality = qualities[i];
    const suffix = quality === 'maj' ? '' : quality === 'min' ? 'm' : '°';
    return {
      roman: romans[i],
      quality,
      root: note,
      name: note + suffix
    };
  });
}

/**
 * Chord shape data format:
 * frets: [1st string (e, thin, TOP), 2nd (B), 3rd (G), 4th (D), 5th (A), 6th (E, thick, BOTTOM)]
 *   -1 = muted (X), 0 = open (O), 1+ = fret number
 * fingers: same order, 0=open, 1=index, 2=middle, 3=ring, 4=pinky
 * baseFret: starting fret for display
 * barre: fret number if barre chord
 */
export interface ChordShape {
  name: string;
  frets: number[];   // [e, B, G, D, A, E] — string 1 (top) to string 6 (bottom)
  fingers: number[];  // [e, B, G, D, A, E]
  barre?: number;
  baseFret: number;
}

// All chord shapes — frets ordered [e, B, G, D, A, E] (1st string at top)
export const CHORD_SHAPES: Record<string, ChordShape[]> = {
  // ===== C =====
  'C': [
    { name: 'C (open)', frets: [0, 1, 0, 2, 3, -1], fingers: [0, 1, 0, 2, 3, 0], baseFret: 1 },
    { name: 'C (barre A-shape)', frets: [3, 5, 5, 5, 3, -1], fingers: [1, 3, 4, 2, 1, 0], barre: 3, baseFret: 3 },
    { name: 'C (barre E-shape)', frets: [8, 8, 9, 10, 10, 8], fingers: [1, 1, 2, 4, 3, 1], barre: 8, baseFret: 8 },
  ],
  'Cm': [
    { name: 'Cm (barre A-shape)', frets: [3, 4, 5, 5, 3, -1], fingers: [1, 2, 4, 3, 1, 0], barre: 3, baseFret: 3 },
    { name: 'Cm (barre E-shape)', frets: [8, 8, 8, 10, 10, 8], fingers: [1, 1, 1, 3, 4, 1], barre: 8, baseFret: 8 },
  ],
  'C°': [
    { name: 'C°', frets: [2, 4, 5, 4, -1, -1], fingers: [1, 2, 4, 3, 0, 0], baseFret: 1 },
  ],

  // ===== D =====
  'D': [
    { name: 'D (open)', frets: [2, 3, 2, 0, -1, -1], fingers: [1, 3, 2, 0, 0, 0], baseFret: 1 },
    { name: 'D (barre)', frets: [5, 5, 4, 5, -1, -1], fingers: [1, 1, 1, 1, 0, 0], barre: 5, baseFret: 5 },
  ],
  'Dm': [
    { name: 'Dm (open)', frets: [1, 3, 2, 0, -1, -1], fingers: [1, 3, 2, 0, 0, 0], baseFret: 1 },
    { name: 'Dm (barre)', frets: [5, 5, 5, 5, -1, -1], fingers: [1, 1, 1, 1, 0, 0], barre: 5, baseFret: 5 },
  ],
  'D°': [
    { name: 'D°', frets: [1, 3, 1, 0, -1, -1], fingers: [1, 3, 2, 0, 0, 0], baseFret: 1 },
  ],

  // ===== E =====
  'E': [
    { name: 'E (open)', frets: [0, 0, 1, 2, 2, 0], fingers: [0, 0, 1, 3, 2, 0], baseFret: 1 },
    { name: 'E (barre A-shape)', frets: [7, 9, 9, 7, -1, -1], fingers: [1, 3, 4, 2, 0, 0], barre: 7, baseFret: 7 },
  ],
  'Em': [
    { name: 'Em (open)', frets: [0, 0, 0, 2, 2, 0], fingers: [0, 0, 0, 2, 3, 0], baseFret: 1 },
    { name: 'Em (barre)', frets: [7, 7, 7, 9, -1, -1], fingers: [1, 1, 1, 3, 0, 0], barre: 7, baseFret: 7 },
  ],
  'E°': [
    { name: 'E°', frets: [6, 8, 9, 8, -1, -1], fingers: [1, 2, 4, 3, 0, 0], baseFret: 1 },
  ],

  // ===== F =====
  'F': [
    { name: 'F (barre)', frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barre: 1, baseFret: 1 },
  ],
  'Fm': [
    { name: 'Fm (barre)', frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1], barre: 1, baseFret: 1 },
  ],
  'F°': [
    { name: 'F°', frets: [1, 0, 1, 3, 2, 1], fingers: [2, 0, 1, 4, 3, 1], baseFret: 1 },
  ],

  // ===== G =====
  'G': [
    { name: 'G (open)', frets: [3, 0, 0, 0, 2, 3], fingers: [3, 0, 0, 0, 1, 4], baseFret: 1 },
    { name: 'G (barre E-shape)', frets: [3, 3, 4, 5, 5, 3], fingers: [1, 1, 2, 3, 4, 1], barre: 3, baseFret: 3 },
  ],
  'Gm': [
    { name: 'Gm (barre E-shape)', frets: [3, 3, 3, 5, 5, 3], fingers: [1, 1, 1, 3, 4, 1], barre: 3, baseFret: 3 },
    { name: 'Gm (barre A-shape)', frets: [8, 10, 10, 8, -1, -1], fingers: [1, 3, 4, 2, 0, 0], barre: 8, baseFret: 8 },
  ],
  'G°': [
    { name: 'G°', frets: [3, 2, 3, 5, -1, -1], fingers: [2, 1, 3, 4, 0, 0], baseFret: 1 },
  ],

  // ===== A =====
  'A': [
    { name: 'A (open)', frets: [0, 2, 2, 2, 0, -1], fingers: [0, 1, 2, 3, 0, 0], baseFret: 1 },
    { name: 'A (barre E-shape)', frets: [5, 5, 6, 7, 7, 5], fingers: [1, 1, 2, 3, 4, 1], barre: 5, baseFret: 5 },
  ],
  'Am': [
    { name: 'Am (open)', frets: [0, 1, 2, 2, 0, -1], fingers: [0, 1, 2, 3, 0, 0], baseFret: 1 },
    { name: 'Am (barre)', frets: [5, 5, 5, 7, 7, 5], fingers: [1, 1, 1, 3, 4, 1], barre: 5, baseFret: 5 },
  ],
  'A°': [
    { name: 'A°', frets: [-1, 1, 2, 1, 0, -1], fingers: [0, 1, 3, 2, 0, 0], baseFret: 1 },
  ],

  // ===== B =====
  'B': [
    { name: 'B (barre E-shape)', frets: [7, 7, 8, 9, 9, 7], fingers: [1, 1, 2, 4, 3, 1], barre: 7, baseFret: 7 },
    { name: 'B (barre A-shape)', frets: [2, 4, 4, 4, 2, -1], fingers: [1, 2, 3, 4, 1, 0], barre: 2, baseFret: 2 },
  ],
  'Bm': [
    { name: 'Bm (barre A-shape)', frets: [2, 3, 4, 4, 2, -1], fingers: [1, 2, 4, 3, 1, 0], barre: 2, baseFret: 2 },
    { name: 'Bm (barre E-shape)', frets: [7, 7, 7, 9, 9, 7], fingers: [1, 1, 1, 3, 4, 1], barre: 7, baseFret: 7 },
  ],
  'B°': [
    { name: 'B°', frets: [-1, 3, 4, 3, 2, -1], fingers: [0, 2, 4, 3, 1, 0], baseFret: 1 },
  ],

  // ===== F# / Gb =====
  'F#': [
    { name: 'F# (barre E-shape)', frets: [2, 2, 3, 4, 4, 2], fingers: [1, 1, 2, 4, 3, 1], barre: 2, baseFret: 2 },
  ],
  'F#m': [
    { name: 'F#m (barre)', frets: [2, 2, 2, 4, 4, 2], fingers: [1, 1, 1, 3, 4, 1], barre: 2, baseFret: 2 },
  ],
  'F#°': [
    { name: 'F#°', frets: [2, 1, 2, 4, -1, -1], fingers: [1, 1, 2, 3, 0, 0], baseFret: 1 },
  ],
  'Gb': [
    { name: 'Gb (barre E-shape)', frets: [2, 2, 3, 4, 4, 2], fingers: [1, 1, 2, 4, 3, 1], barre: 2, baseFret: 2 },
  ],
  'Gbm': [
    { name: 'Gbm (barre)', frets: [2, 2, 2, 4, 4, 2], fingers: [1, 1, 1, 3, 4, 1], barre: 2, baseFret: 2 },
  ],

  // ===== Db =====
  'Db': [
    { name: 'Db (barre E-shape)', frets: [9, 9, 10, 11, 11, 9], fingers: [1, 1, 2, 4, 3, 1], barre: 9, baseFret: 9 },
    { name: 'Db (barre A-shape)', frets: [4, 6, 6, 6, 4, -1], fingers: [1, 2, 3, 4, 1, 0], barre: 4, baseFret: 4 },
  ],
  'Dbm': [
    { name: 'Dbm (barre E-shape)', frets: [9, 9, 9, 11, 11, 9], fingers: [1, 1, 1, 3, 4, 1], barre: 9, baseFret: 9 },
    { name: 'Dbm (barre A-shape)', frets: [4, 5, 6, 6, 4, -1], fingers: [1, 2, 4, 3, 1, 0], barre: 4, baseFret: 4 },
  ],
  'Db°': [
    { name: 'Db°', frets: [-1, 1, 2, 0, 2, -1], fingers: [0, 2, 3, 0, 4, 0], baseFret: 1 },
  ],

  // ===== Eb =====
  'Eb': [
    { name: 'Eb (barre A-shape)', frets: [6, 8, 8, 8, 6, -1], fingers: [1, 3, 4, 2, 1, 0], barre: 6, baseFret: 6 },
    { name: 'Eb (barre E-shape)', frets: [11, 11, 12, 13, 13, 11], fingers: [1, 1, 2, 4, 3, 1], barre: 11, baseFret: 11 },
  ],
  'Ebm': [
    { name: 'Ebm (barre A-shape)', frets: [6, 7, 8, 8, 6, -1], fingers: [1, 2, 4, 3, 1, 0], barre: 6, baseFret: 6 },
    { name: 'Ebm (barre E-shape)', frets: [11, 11, 11, 13, 13, 11], fingers: [1, 1, 1, 3, 4, 1], barre: 11, baseFret: 11 },
  ],
  'Eb°': [
    { name: 'Eb°', frets: [-1, 1, 2, 1, 0, -1], fingers: [0, 1, 3, 2, 0, 0], baseFret: 1 },
  ],

  // ===== Ab =====
  'Ab': [
    { name: 'Ab (barre E-shape)', frets: [4, 4, 5, 6, 6, 4], fingers: [1, 1, 2, 4, 3, 1], barre: 4, baseFret: 4 },
    { name: 'Ab (barre A-shape)', frets: [9, 11, 11, 11, 9, -1], fingers: [1, 2, 3, 4, 1, 0], barre: 9, baseFret: 9 },
  ],
  'Abm': [
    { name: 'Abm (barre E-shape)', frets: [4, 4, 4, 6, 6, 4], fingers: [1, 1, 1, 3, 4, 1], barre: 4, baseFret: 4 },
    { name: 'Abm (barre A-shape)', frets: [9, 10, 11, 11, 9, -1], fingers: [1, 2, 4, 3, 1, 0], barre: 9, baseFret: 9 },
  ],
  'Ab°': [
    { name: 'Ab°', frets: [4, 0, 1, 0, 2, 4], fingers: [4, 0, 1, 0, 2, 3], baseFret: 1 },
  ],

  // ===== Bb =====
  'Bb': [
    { name: 'Bb (barre E-shape)', frets: [6, 6, 7, 8, 8, 6], fingers: [1, 1, 2, 4, 3, 1], barre: 6, baseFret: 6 },
    { name: 'Bb (barre A-shape)', frets: [1, 3, 3, 3, 1, -1], fingers: [1, 2, 3, 4, 1, 0], barre: 1, baseFret: 1 },
  ],
  'Bbm': [
    { name: 'Bbm (barre E-shape)', frets: [6, 6, 6, 8, 8, 6], fingers: [1, 1, 1, 3, 4, 1], barre: 6, baseFret: 6 },
    { name: 'Bbm (barre A-shape)', frets: [1, 2, 3, 3, 1, -1], fingers: [1, 2, 4, 3, 1, 0], barre: 1, baseFret: 1 },
  ],
  'Bb°': [
    { name: 'Bb°', frets: [0, 2, 3, 2, 1, 0], fingers: [0, 1, 3, 2, 1, 0], baseFret: 1 },
  ],

  // ===== C# / Db minor =====
  'C#m': [
    { name: 'C#m (barre)', frets: [4, 4, 4, 6, 6, 4], fingers: [1, 1, 1, 3, 4, 1], barre: 4, baseFret: 4 },
  ],
  
  // ===== D# / Eb minor =====
  'D#m': [
    { name: 'D#m (barre)', frets: [6, 6, 6, 8, 8, 6], fingers: [1, 1, 1, 3, 4, 1], barre: 6, baseFret: 6 },
  ],
  
  // ===== G# / Ab minor =====
  'G#m': [
    { name: 'G#m (barre)', frets: [4, 4, 4, 6, 6, 4], fingers: [1, 1, 1, 3, 4, 1], barre: 4, baseFret: 4 },
  ],
  
  // ===== A# / Bb minor =====
  'A#m': [
    { name: 'A#m (barre)', frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1], barre: 1, baseFret: 1 },
  ],

  // ===== Additional diminished chords =====
  'C#°': [
    { name: 'C#°', frets: [0, 1, 0, 2, 4, -1], fingers: [0, 1, 0, 2, 3, 0], baseFret: 1 },
  ],
  'D#°': [
    { name: 'D#°', frets: [2, 3, 2, 4, 6, -1], fingers: [1, 2, 1, 3, 4, 0], baseFret: 1 },
  ],
  'G#°': [
    { name: 'G#°', frets: [4, 0, 1, 0, 2, 4], fingers: [4, 0, 1, 0, 2, 3], baseFret: 1 },
  ],
  'A#°': [
    { name: 'A#°', frets: [0, 2, 3, 2, 1, 0], fingers: [0, 1, 3, 2, 1, 0], baseFret: 1 },
  ],
};

// Get chord shapes for a chord name
export function getChordShapes(chordName: string): ChordShape[] {
  return CHORD_SHAPES[chordName] || [];
}

// Key colors for visualization
export const KEY_COLORS = {
  major: {
    primary: '#FFD700',
    secondary: '#FFA500',
    bg: 'rgba(255, 215, 0, 0.15)',
  },
  minor: {
    primary: '#4ECDC4',
    secondary: '#2ECC71',
    bg: 'rgba(78, 205, 196, 0.15)',
  },
  dim: {
    primary: '#E74C3C',
    secondary: '#C0392B',
    bg: 'rgba(231, 76, 60, 0.15)',
  }
};
