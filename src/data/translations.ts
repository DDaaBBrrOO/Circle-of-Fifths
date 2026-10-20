export type Language = 'en' | 'ru';

export const translations = {
  en: {
    // Header
    appTitle: 'Circle of Fifths',
    appSubtitle: 'Guitar Theory Tool',
    
    // Tabs
    tabMain: 'Circle',
    tabTheory: 'Theory',
    tabHelp: 'Help',
    
    // Key type
    major: 'Major',
    minor: 'Minor',
    maj: 'Maj',
    min: 'Min',
    
    // Scale section
    scaleNotes: 'Scale',
    notesAndDegrees: 'Notes & Degrees',
    
    // Chords section
    diatonicChords: 'Diatonic Chords',
    tapToSeeShape: 'tap to see shape',
    
    // Hint
    hint: 'Tap a segment on the circle to change key (it rotates to top). Then tap any chord to see its guitar fingering.',
    
    // Bottom sheet
    voicingsAvailable: 'voicings available',
    voicingAvailable: 'voicing available',
    noDiagram: 'No chord diagram available',
    tryAnother: 'Try another chord from the diatonic list',
    
    // Fingering
    index: 'Index',
    middle: 'Middle',
    ring: 'Ring',
    pinky: 'Pinky',
    openString: 'Open string',
    dontPlay: "Don't play",
    
    // Language
    language: 'Language',
  },
  ru: {
    // Header
    appTitle: 'Круг Квинт',
    appSubtitle: 'Теория для гитары',
    
    // Tabs
    tabMain: 'Круг',
    tabTheory: 'Теория',
    tabHelp: 'Помощь',
    
    // Key type
    major: 'Мажор',
    minor: 'Минор',
    maj: 'Маж',
    min: 'Мин',
    
    // Scale section
    scaleNotes: 'Гамма',
    notesAndDegrees: 'Ноты и ступени',
    
    // Chords section
    diatonicChords: 'Диатонические аккорды',
    tapToSeeShape: 'нажми для аппликатуры',
    
    // Hint
    hint: 'Нажми на сегмент круга для смены тональности (она повернётся наверх). Затем нажми на аккорд, чтобы увидеть аппликатуру на грифе.',
    
    // Bottom sheet
    voicingsAvailable: 'вариантов доступно',
    voicingAvailable: 'вариант доступен',
    noDiagram: 'Нет аппликатуры для аккорда',
    tryAnother: 'Попробуй другой аккорд из списка',
    
    // Fingering
    index: 'Указ.',
    middle: 'Средн.',
    ring: 'Безым.',
    pinky: 'Мизин.',
    openString: 'Открытая',
    dontPlay: 'Не играть',
    
    // Language
    language: 'Язык',
  },
};

export function t(key: keyof typeof translations.en, lang: Language): string {
  return translations[lang][key] || translations.en[key];
}
