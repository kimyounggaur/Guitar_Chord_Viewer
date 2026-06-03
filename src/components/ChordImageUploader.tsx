import { Trash2, Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { ChordShape } from '../data/chordTypes';
import type { UploadedChordImageView } from '../hooks/useIndexedChordImages';

type Props = {
  chord: ChordShape;
  uploadedImage?: UploadedChordImageView;
  error: string | null;
  canManageImages: boolean;
  onSave: (chord: ChordShape, file: File) => Promise<void>;
  onDelete: (chordId: string) => Promise<void>;
};

export default function ChordImageUploader({ chord, uploadedImage, error, canManageImages, onSave, onDelete }: Props) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (file && canManageImages) {
      void onSave(chord, file);
    }
  };

  if (!canManageImages) {
    return null;
  }

  return (
    <div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-3 rounded-[8px] border border-rose-100 bg-white px-4 py-3 shadow-neumorphic">
      <label className="inline-flex h-10 items-center gap-2 rounded-full border border-rose-100 bg-white px-4 text-sm font-bold text-rose-400 shadow-neumorphic transition hover:scale-105 focus-within:ring-4 focus-within:ring-rose-100">
        <Upload size={16} aria-hidden="true" />
        업로드
        <input className="sr-only" type="file" accept="image/svg+xml,image/png,image/webp" onChange={handleChange} />
      </label>
      {uploadedImage ? (
        <button
          type="button"
          onClick={() => void onDelete(chord.id)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-stone-100 bg-white px-4 text-sm font-bold text-stone-500 shadow-neumorphic transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-stone-100"
        >
          <Trash2 size={16} aria-hidden="true" />
          삭제
        </button>
      ) : null}
      <span className="text-sm font-semibold text-stone-400">{uploadedImage?.fileName ?? 'svg/png/webp, 2MB 이하'}</span>
      {error ? <span className="w-full text-center text-sm font-bold text-rose-500">{error}</span> : null}
    </div>
  );
}
