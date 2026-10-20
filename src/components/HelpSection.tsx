import React from 'react';
import { Language } from '../data/translations';

interface HelpSectionProps {
  language: Language;
}

const helpContent = {
  en: {
    title: 'How to Use the App',
    sections: [
      {
        title: '🎯 Circle of Fifths',
        items: [
          'Tap any segment on the outer ring to select a major key',
          'Tap any segment on the inner ring to select a minor key',
          'The circle rotates to put your selected key at the top (12 o\'clock)',
          'Highlighted segments show the notes of the current scale'
        ]
      },
      {
        title: '🎨 Color Guide',
        items: [
          '🟡 Yellow/Gold = Major chords and keys',
          '🟢 Teal/Cyan = Minor chords and keys',
          '🔴 Red = Diminished chords',
          'Bright color = Selected key/chord',
          'Dimmed color = Highlighted (part of current scale)'
        ]
      },
      {
        title: '🎸 Chord Diagrams',
        items: [
          'Tap any chord in the Diatonic Chords section to see its guitar fingering',
          'The bottom sheet shows the fretboard with finger positions',
          'Numbers in circles = finger to use (1=index, 2=middle, 3=ring, 4=pinky)',
          '○ = Open string (play without fretting)',
          '✕ = Don\'t play this string',
          'If multiple voicings exist, swipe to switch between them'
        ]
      },
      {
        title: '📊 Scale Notes',
        items: [
          'Below the circle, you see all 7 notes of the selected scale',
          'Roman numerals (I, II, III...) show the scale degree',
          'These are the notes you can use for melodies and solos in this key'
        ]
      },
      {
        title: '🔄 Major/Minor Toggle',
        items: [
          'Use the Maj/Min buttons in the header to switch between major and minor',
          'This changes which chords are shown as diatonic',
          'The relative minor/major always shares the same notes'
        ]
      },
      {
        title: '🌐 Language',
        items: [
          'Tap the EN/RU button to switch between English and Russian',
          'The button shows the current active language'
        ]
      }
    ]
  },
  ru: {
    title: 'Как пользоваться приложением',
    sections: [
      {
        title: '🎯 Круг квинт',
        items: [
          'Нажмите на любой сегмент внешнего кольца для выбора мажорной тональности',
          'Нажмите на любой сегмент внутреннего кольца для выбора минорной тональности',
          'Круг поворачивается, помещая выбранную тональность наверх (на 12 часов)',
          'Подсвеченные сегменты показывают ноты текущей гаммы'
        ]
      },
      {
        title: '🎨 Обозначение цветов',
        items: [
          '🟡 Жёлтый/Золотой = Мажорные аккорды и тональности',
          '🟢 Бирюзовый/Циан = Минорные аккорды и тональности',
          '🔴 Красный = Уменьшённые аккорды',
          'Яркий цвет = Выбранный аккорд/тональность',
          'Приглушённый цвет = Подсвечен (входит в текущую гамму)'
        ]
      },
      {
        title: '🎸 Диаграммы аккордов',
        items: [
          'Нажмите на любой аккорд в разделе Диатонические аккорды, чтобы увидеть аппликатуру на грифе',
          'В нижней панели показан гриф с позициями пальцев',
          'Цифры в кружках = какой палец использовать (1=указательный, 2=средний, 3=безымянный, 4=мизинец)',
          '○ = Открытая струна (играть без зажатия)',
          '✕ = Не играть эту струну',
          'Если есть несколько вариантов, свайпайте для переключения между ними'
        ]
      },
      {
        title: '📊 Ноты гаммы',
        items: [
          'Под кругом вы видите все 7 нот выбранной гаммы',
          'Римские цифры (I, II, III...) показывают ступень гаммы',
          'Это ноты, которые можно использовать для мелодий и соло в этой тональности'
        ]
      },
      {
        title: '🔄 Переключение Мажор/Минор',
        items: [
          'Используйте кнопки Маж/Мин в заголовке для переключения между мажором и минором',
          'Это меняет набор диатонических аккордов',
          'Параллельный минор/мажор всегда использует те же ноты'
        ]
      },
      {
        title: '🌐 Язык',
        items: [
          'Нажмите кнопку EN/RU для переключения между английским и русским',
          'На кнопке показан текущий активный язык'
        ]
      }
    ]
  }
};

const HelpSection: React.FC<HelpSectionProps> = ({ language }) => {
  const content = helpContent[language];

  return (
    <div className="px-3 py-3">
      <h2 className="text-base font-bold text-white mb-3">{content.title}</h2>
      
      <div className="space-y-3">
        {content.sections.map((section, idx) => (
          <div key={idx} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <h3 className="text-sm font-semibold text-yellow-400 mb-1.5">{section.title}</h3>
            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-[11px] text-gray-300 leading-relaxed flex gap-1.5">
                  <span className="text-yellow-400/60 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* App Info */}
      <div className="mt-4 bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
        <h3 className="text-sm font-semibold text-yellow-400 mb-1.5">ℹ️ App Info</h3>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Circle of Fifths v1.0<br />
          Guitar Theory Tool<br />
          Made with ❤️ for guitarists
        </p>
      </div>
    </div>
  );
};

export default HelpSection;
