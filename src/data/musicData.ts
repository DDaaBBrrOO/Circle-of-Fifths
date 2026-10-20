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

// Chord shapes (fret positions for each string: E, A, D, G, B, e)
// -1 = muted string, 0 = open string
export interface ChordShape {
  name: string;
  frets: number[];
  fingers: number[]; // 0=open, 1=index, 2=middle, 3=ring, 4=pinky
  barre?: number; // fret number if barre chord
  baseFret: number;
}

// Common chord shapes database
export const CHORD_SHAPES: Record<string, ChordShape[]> = {
  'C': [
    { name: 'C (open)', frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1 },
    { name: 'C (barre A-shape)', frets: [-1, -1, 3, 5, 5, 5], fingers: [0, 0, 1, 3, 4, 2], barre: 3, baseFret: 3 },
    { name: 'C (barre E-shape)', frets: [8, 10, 10, 9, 8, 8], fingers: [1, 3, 4, 2, 1, 1], barre: 8, baseFret: 8 },
  ],
  'Cm': [
    { name: 'Cm (barre A-shape)', frets: [-1, -1, 1, 3, 4, 2], fingers: [0, 0, 1, 3, 4, 2], barre: 1, baseFret: 1 },
    { name: 'Cm (barre E-shape)', frets: [8, 10, 10, 8, 8, 8], fingers: [1, 3, 4, 1, 1, 1], barre: 8, baseFret: 8 },
  ],
  'C°': [
    { name: 'C°', frets: [-1, 3, 4, 2, 4, -1], fingers: [0, 2, 3, 1, 4, 0], baseFret: 1 },
  ],
  'D': [
    { name: 'D (open)', frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 },
    { name: 'D (barre)', frets: [-1, -1, 7, 7, 7, 5], fingers: [0, 0, 2, 2, 3, 1], barre: 5, baseFret: 5 },
  ],
  'Dm': [
    { name: 'Dm (open)', frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1 },
    { name: 'Dm (barre)', frets: [-1, -1, 7, 7, 6, 5], fingers: [0, 0, 3, 4, 2, 1], barre: 5, baseFret: 5 },
  ],
  'D°': [
    { name: 'D°', frets: [-1, -1, 0, 1, 3, 1], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 },
  ],
  'E': [
    { name: 'E (open)', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1 },
    { name: 'E (barre A-shape)', frets: [-1, -1, 2, 4, 5, 4], fingers: [0, 0, 1, 2, 4, 3], barre: 2, baseFret: 2 },
  ],
  'Em': [
    { name: 'Em (open)', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1 },
    { name: 'Em (barre)', frets: [-1, -1, 2, 4, 4, 2], fingers: [0, 0, 1, 3, 4, 2], barre: 2, baseFret: 2 },
  ],
  'F': [
    { name: 'F (barre)', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barre: 1, baseFret: 1 },
    { name: 'F (small)', frets: [-1, -1, 3, 2, 1, 1], fingers: [0, 0, 3, 2, 1, 1], baseFret: 1 },
  ],
  'Fm': [
    { name: 'Fm (barre)', frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], barre: 1, baseFret: 1 },
  ],
  'G': [
    { name: 'G (open)', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1 },
    { name: 'G (open alt)', frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, 0, 0, 3, 4], baseFret: 1 },
    { name: 'G (barre E-shape)', frets: [3, 5, 5, 4, 3, 3], fingers: [1, 3, 4, 2, 1, 1], barre: 3, baseFret: 3 },
  ],
  'Gm': [
    { name: 'Gm (barre E-shape)', frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], barre: 3, baseFret: 3 },
    { name: 'Gm (barre A-shape)', frets: [-1, -1, 5, 7, 8, 6], fingers: [0, 0, 1, 2, 4, 3], barre: 5, baseFret: 5 },
  ],
  'A': [
    { name: 'A (open)', frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1 },
    { name: 'A (barre E-shape)', frets: [5, 7, 7, 6, 5, 5], fingers: [1, 3, 4, 2, 1, 1], barre: 5, baseFret: 5 },
  ],
  'Am': [
    { name: 'Am (open)', frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 },
    { name: 'Am (barre)', frets: [5, 7, 7, 5, 5, 5], fingers: [1, 3, 4, 1, 1, 1], barre: 5, baseFret: 5 },
  ],
  'B': [
    { name: 'B (barre E-shape)', frets: [7, 9, 9, 8, 7, 7], fingers: [1, 3, 4, 2, 1, 1], barre: 7, baseFret: 7 },
    { name: 'B (barre A-shape)', frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barre: 2, baseFret: 2 },
  ],
  'Bm': [
    { name: 'Bm (barre)', frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], barre: 2, baseFret: 2 },
    { name: 'Bm (barre E-shape)', frets: [7, 9, 9, 7, 7, 7], fingers: [1, 3, 4, 1, 1, 1], barre: 7, baseFret: 7 },
  ],
  'F#': [
    { name: 'F# (barre)', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], barre: 2, baseFret: 2 },
  ],
  'F#m': [
    { name: 'F#m (barre)', frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], barre: 2, baseFret: 2 },
  ],
  'F#°': [
    { name: 'F#°', frets: [2, 4, 5, 3, -1, -1], fingers: [1, 2, 4, 3, 0, 0], baseFret: 2 },
  ],
  'Db': [
    { name: 'Db (barre)', frets: [-1, -1, 3, 1, 2, 1], fingers: [0, 0, 3, 1, 2, 1], baseFret: 1 },
    { name: 'Db (barre E-shape)', frets: [9, 11, 11, 10, 9, 9], fingers: [1, 3, 4, 2, 1, 1], barre: 9, baseFret: 9 },
  ],
  'Dbm': [
    { name: 'Dbm (barre)', frets: [-1, -1, 3, 1, 2, 0], fingers: [0, 0, 3, 1, 2, 0], baseFret: 1 },
  ],
  'Eb': [
    { name: 'Eb (barre)', frets: [-1, -1, 1, 3, 4, 3], fingers: [0, 0, 1, 2, 4, 3], barre: 1, baseFret: 1 },
    { name: 'Eb (barre E-shape)', frets: [11, 13, 13, 12, 11, 11], fingers: [1, 3, 4, 2, 1, 1], barre: 11, baseFret: 11 },
  ],
  'Ebm': [
    { name: 'Ebm (barre)', frets: [-1, -1, 1, 3, 4, 2], fingers: [0, 0, 1, 3, 4, 2], barre: 1, baseFret: 1 },
  ],
  'Ab': [
    { name: 'Ab (barre)', frets: [-1, -1, 6, 6, 6, 4], fingers: [0, 0, 2, 2, 3, 1], barre: 4, baseFret: 4 },
    { name: 'Ab (barre E-shape)', frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], barre: 4, baseFret: 4 },
  ],
  'Abm': [
    { name: 'Abm (barre)', frets: [-1, -1, 6, 6, 5, 4], fingers: [0, 0, 3, 4, 2, 1], barre: 4, baseFret: 4 },
  ],
  'Bb': [
    { name: 'Bb (barre)', frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], barre: 1, baseFret: 1 },
    { name: 'Bb (barre E-shape)', frets: [6, 8, 8, 7, 6, 6], fingers: [1, 3, 4, 2, 1, 1], barre: 6, baseFret: 6 },
  ],
  'Bbm': [
    { name: 'Bbm (barre)', frets: [-1, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1], barre: 1, baseFret: 1 },
  ],
  'Gb': [
    { name: 'Gb (barre)', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], barre: 2, baseFret: 2 },
  ],
  'Gbm': [
    { name: 'Gbm (barre)', frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], barre: 2, baseFret: 2 },
  ],
  'B°': [
    { name: 'B°', frets: [-1, 2, 3, 4, 3, -1], fingers: [0, 1, 2, 4, 3, 0], baseFret: 2 },
  ],
  'Eb°': [
    { name: 'Eb°', frets: [-1, -1, 1, 2, 0, -1], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 },
  ],
  'Ab°': [
    { name: 'Ab°', frets: [4, 5, 6, 4, -1, -1], fingers: [2, 3, 4, 1, 0, 0], baseFret: 4 },
  ],
  'Bb°': [
    { name: 'Bb°', frets: [-1, 1, 2, 0, 2, -1], fingers: [0, 1, 2, 0, 3, 0], baseFret: 1 },
  ],
  'Db°': [
    { name: 'Db°', frets: [-1, -1, 3, 4, 2, -1], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 },
  ],
  'Gb°': [
    { name: 'Gb°', frets: [2, 3, 4, 2, -1, -1], fingers: [1, 2, 3, 1, 0, 0], baseFret: 2 },
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
