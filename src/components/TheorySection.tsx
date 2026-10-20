import React from 'react';
import { Language } from '../data/translations';

interface TheorySectionProps {
  language: Language;
}

const theoryContent = {
  en: {
    title: 'Music Theory for Guitarists',
    sections: [
      {
        title: '🎵 What is the Circle of Fifths?',
        content: 'The Circle of Fifths is a visual tool that shows the relationship between all 12 notes in music. Moving clockwise, each note is a perfect 5th apart (7 semitones). Moving counter-clockwise, each note is a perfect 4th apart (5 semitones). This circle helps you understand key signatures, chord progressions, and modulation.'
      },
      {
        title: '🎸 Why is it useful for guitar?',
        content: 'On guitar, the Circle of Fifths helps you: find which chords work well together in a key, transpose songs to different keys, understand why certain chord progressions sound good, and quickly find scales for improvisation.'
      },
      {
        title: '🎼 What are Diatonic Chords?',
        content: 'Diatonic chords are the 7 chords that naturally occur in any major or minor scale. In a major key, the pattern is: Major, minor, minor, Major, Major, minor, diminished (I, ii, iii, IV, V, vi, vii°). These chords sound harmonious together because they use only notes from the same scale.'
      },
      {
        title: '📊 Roman Numerals',
        content: 'Roman numerals show the scale degree of each chord. Uppercase (I, IV, V) = major chords. Lowercase (ii, iii, vi) = minor chords. Lowercase with ° (vii°) = diminished chord. This system works in any key!'
      },
      {
        title: '🔄 Major and Minor Relationship',
        content: 'Every major key has a relative minor key that shares the same notes and chords. For example, C major and A minor use the exact same notes. The relative minor is always the 6th degree of the major scale. On the circle, the minor keys are shown in the inner ring, directly inside their relative major.'
      },
      {
        title: '🎯 Common Chord Progressions',
        content: 'I - IV - V (12-bar blues): The foundation of rock, blues, and pop.\nI - V - vi - IV: The most popular pop progression ever.\nii - V - I: The classic jazz progression.\nI - vi - IV - V: The 50s progression, used in countless hits.'
      }
    ]
  },
  ru: {
    title: 'Теория музыки для гитаристов',
    sections: [
      {
        title: '🎵 Что такое круг квинт?',
        content: 'Круг квинт — это визуальный инструмент, показывающий взаимосвязь всех 12 нот в музыке. При движении по часовой стрелке каждая нота находится на расстоянии чистой квинты (7 полутонов). При движении против часовой стрелки — чистой кварты (5 полутонов). Этот круг помогает понять ключевые знаки, аккордовые последовательности и модуляции.'
      },
      {
        title: '🎸 Зачем это гитаристу?',
        content: 'На гитаре круг квинт помогает: находить аккорды, которые хорошо звучат вместе в одной тональности, транспонировать песни в другие тональности, понимать, почему определённые аккордовые последовательности звучат хорошо, и быстро находить гаммы для импровизации.'
      },
      {
        title: '🎼 Что такое диатонические аккорды?',
        content: 'Диатонические аккорды — это 7 аккордов, которые естественно возникают в любой мажорной или минорной гамме. В мажоре паттерн такой: Мажор, минор, минор, Мажор, Мажор, минор, уменьшённый (I, ii, iii, IV, V, vi, vii°). Эти аккорды звучат гармонично вместе, потому что используют только ноты из одной гаммы.'
      },
      {
        title: '📊 Римские цифры',
        content: 'Римские цифры показывают ступень гаммы для каждого аккорда. Заглавные (I, IV, V) = мажорные аккорды. Строчные (ii, iii, vi) = минорные аккорды. Строчные с ° (vii°) = уменьшённый аккорд. Эта система работает в любой тональности!'
      },
      {
        title: '🔄 Связь мажора и минора',
        content: 'Каждая мажорная тональность имеет параллельный минор, который использует те же ноты и аккорды. Например, до мажор и ля минор используют абсолютно одинаковые ноты. Параллельный минор всегда находится на 6-й ступени мажорной гаммы. На круге минорные тональности показаны во внутреннем кольце, прямо внутри своего параллельного мажора.'
      },
      {
        title: '🎯 Популярные аккордовые последовательности',
        content: 'I - IV - V (12-тактовый блюз): Основа рока, блюза и попа.\nI - V - vi - IV: Самая популярная поп-прогрессия.\nii - V - I: Классическая джазовая последовательность.\nI - vi - IV - V: Последовательность 50-х, используется в бесчисленных хитах.'
      }
    ]
  }
};

const TheorySection: React.FC<TheorySectionProps> = ({ language }) => {
  const content = theoryContent[language];

  return (
    <div className="px-3 py-3">
      <h2 className="text-base font-bold text-white mb-3">{content.title}</h2>
      
      <div className="space-y-3">
        {content.sections.map((section, idx) => (
          <div key={idx} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <h3 className="text-sm font-semibold text-yellow-400 mb-1.5">{section.title}</h3>
            <p className="text-[11px] text-gray-300 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheorySection;
