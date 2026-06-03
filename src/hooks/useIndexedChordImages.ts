import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChordShape } from '../data/chordTypes';
import {
  deleteUploadedChordImage,
  listUploadedChordImages,
  makeUploadedImageUrl,
  saveUploadedChordImage,
  type UploadedChordImage,
  uploadedImageRules,
} from '../lib/chordImageStorage';

export type UploadedChordImageView = UploadedChordImage & {
  url: string;
};

type ImagesByChordId = Record<string, UploadedChordImageView>;

function newestByChord(items: UploadedChordImage[]): UploadedChordImage[] {
  const map = new Map<string, UploadedChordImage>();
  items.forEach((item) => {
    const current = map.get(item.chordId);
    if (!current || item.updatedAt > current.updatedAt) {
      map.set(item.chordId, item);
    }
  });

  return [...map.values()];
}

export function useIndexedChordImages() {
  const [imagesByChordId, setImagesByChordId] = useState<ImagesByChordId>({});
  const [error, setError] = useState<string | null>(null);
  const urlsRef = useRef<string[]>([]);

  const revokeUrls = useCallback(() => {
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current = [];
  }, []);

  const reload = useCallback(async () => {
    const items = newestByChord(await listUploadedChordImages());
    revokeUrls();

    const next = items.reduce<ImagesByChordId>((acc, item) => {
      const url = makeUploadedImageUrl(item);
      urlsRef.current.push(url);
      acc[item.chordId] = { ...item, url };
      return acc;
    }, {});

    setImagesByChordId(next);
  }, [revokeUrls]);

  useEffect(() => {
    void reload();
    return revokeUrls;
  }, [reload, revokeUrls]);

  const saveImageForChord = useCallback(
    async (chord: ChordShape, file: File) => {
      if (!uploadedImageRules.mimeTypes.includes(file.type)) {
        setError('svg, png, webp 형식만 업로드할 수 있습니다.');
        return;
      }

      if (file.size > uploadedImageRules.maxBytes) {
        setError('이미지는 2MB 이하만 업로드할 수 있습니다.');
        return;
      }

      const now = new Date().toISOString();
      await saveUploadedChordImage({
        id: `${chord.id}-${Date.now()}`,
        chordId: chord.id,
        root: chord.root,
        quality: chord.quality,
        title: chord.title,
        fileName: file.name,
        mimeType: file.type,
        blob: file,
        createdAt: now,
        updatedAt: now,
      });
      setError(null);
      await reload();
    },
    [reload],
  );

  const deleteImageForChord = useCallback(
    async (chordId: string) => {
      const item = imagesByChordId[chordId];
      if (!item) {
        return;
      }

      await deleteUploadedChordImage(item.id);
      await reload();
    },
    [imagesByChordId, reload],
  );

  return useMemo(
    () => ({
      imagesByChordId,
      error,
      saveImageForChord,
      deleteImageForChord,
    }),
    [deleteImageForChord, error, imagesByChordId, saveImageForChord],
  );
}
