import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import type { ChordShape } from '../data/chordTypes';
import type { ChordQuality } from '../data/chordQualities';
import type { UploadedChordImageView } from '../hooks/useIndexedChordImages';
import ChordImageUploader from './ChordImageUploader';
import Fretboard from './Fretboard';

type Props = {
  chord: ChordShape;
  quality: ChordQuality;
  relatedChords: ChordShape[];
  uploadedImage?: UploadedChordImageView;
  uploadError: string | null;
  onSelectChord: (shape: ChordShape) => void;
  onBack: () => void;
  onSaveImage: (chord: ChordShape, file: File) => Promise<void>;
  onDeleteImage: (chordId: string) => Promise<void>;
};

export default function ChordDetail({
  chord,
  quality,
  relatedChords,
  uploadedImage,
  uploadError,
  onSelectChord,
  onBack,
  onSaveImage,
  onDeleteImage,
}: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onBack();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onBack]);

  return (
    <section className="mx-auto max-w-[1180px] px-5 pb-12 sm:px-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex h-11 items-center gap-2 rounded-full border border-rose-100 bg-white px-4 font-bold text-stone-500 shadow-neumorphic transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        뒤로
      </button>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_230px]">
        <div className="min-w-0">
          <h1
            className="mx-auto mb-5 w-fit rounded-[8px] border-4 bg-white px-8 py-3 text-center font-display text-4xl font-extrabold shadow-neumorphic sm:text-5xl"
            style={{ borderColor: '#f97316', color: quality.color }}
          >
            {chord.title}
          </h1>
          <div className="animate-[detailIn_.28s_ease_both]">
            <Fretboard shape={chord} size="large" />
          </div>
          <ChordImageUploader
            chord={chord}
            uploadedImage={uploadedImage}
            error={uploadError}
            onSave={onSaveImage}
            onDelete={onDeleteImage}
          />
        </div>
        <aside className="min-w-0">
          <div className="flex gap-3 overflow-x-auto pb-2 lg:max-h-[680px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1">
            {relatedChords.map((item) => {
              const selected = item.id === chord.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onSelectChord(item)}
                  className="w-[180px] shrink-0 rounded-[8px] border bg-white p-2 shadow-neumorphic transition hover:scale-[1.03] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 lg:w-full"
                  style={{ borderColor: selected ? quality.color : '#f3f4f6' }}
                  aria-pressed={selected}
                >
                  <span className="mb-2 block rounded-[6px] border border-dashed border-emerald-300 py-1 text-center text-sm font-extrabold text-emerald-600">
                    {item.title}
                  </span>
                  <Fretboard shape={item} size="thumb" />
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
