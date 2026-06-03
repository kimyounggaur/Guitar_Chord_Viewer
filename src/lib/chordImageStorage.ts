import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ChordQualityId } from '../data/chordTypes';

export type UploadedChordImage = {
  id: string;
  chordId: string;
  root: string;
  quality: ChordQualityId;
  title: string;
  fileName: string;
  mimeType: string;
  blob: Blob;
  createdAt: string;
  updatedAt: string;
};

interface GuitarChordViewerDb extends DBSchema {
  'chord-images': {
    key: string;
    value: UploadedChordImage;
    indexes: {
      'by-chord': string;
    };
  };
}

const DB_NAME = 'guitar-chord-viewer';
const STORE = 'chord-images';

let dbPromise: Promise<IDBPDatabase<GuitarChordViewerDb>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<GuitarChordViewerDb>(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' });
          store.createIndex('by-chord', 'chordId');
        }
      },
    });
  }

  return dbPromise;
}

export function canUseIndexedDb(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

export async function saveUploadedChordImage(item: UploadedChordImage): Promise<void> {
  if (!canUseIndexedDb()) {
    return;
  }

  const db = await getDb();
  await db.put(STORE, item);
}

export async function listUploadedChordImages(): Promise<UploadedChordImage[]> {
  if (!canUseIndexedDb()) {
    return [];
  }

  const db = await getDb();
  return db.getAll(STORE);
}

export async function deleteUploadedChordImage(id: string): Promise<void> {
  if (!canUseIndexedDb()) {
    return;
  }

  const db = await getDb();
  await db.delete(STORE, id);
}

export function makeUploadedImageUrl(item: UploadedChordImage): string {
  return URL.createObjectURL(item.blob);
}

export const uploadedImageRules = {
  maxBytes: 2 * 1024 * 1024,
  mimeTypes: ['image/svg+xml', 'image/png', 'image/webp'],
};

// Static deployments cannot let a browser write into public/chords directly.
// User-added images must live in IndexedDB or a real server/object storage.
