import type { ChordQualityId, ChordShape, FingerNumber, FingerPosition, StringNumber } from '../data/chordTypes';
import { slugRoot } from './slug';

export type FingerMap = Partial<Record<StringNumber, FingerNumber>>;

const stringOrder: StringNumber[] = [6, 5, 4, 3, 2, 1];

export function parseChordPattern(pattern: string, fingers: FingerMap = {}): FingerPosition[] {
  if (pattern.length !== 6) {
    throw new Error(`Chord pattern must contain 6 characters, received "${pattern}".`);
  }

  return stringOrder.map((stringNumber, index) => {
    const value = pattern[index];

    if (value === 'x' || value === 'X') {
      return { string: stringNumber, muted: true };
    }

    if (value === '0') {
      return { string: stringNumber, fret: 0, open: true };
    }

    const fret = Number.parseInt(value, 10);
    if (Number.isNaN(fret)) {
      throw new Error(`Unsupported fret value "${value}" in chord pattern "${pattern}".`);
    }

    const position: FingerPosition = { string: stringNumber, fret };
    const finger = fingers[stringNumber];
    if (finger) {
      position.finger = finger;
    }

    return position;
  });
}

export type ChordDefinition = {
  root: string;
  quality: ChordQualityId;
  label: string;
  title?: string;
  pattern: string;
  fingers?: FingerMap;
  image?: string;
  difficulty?: ChordShape['difficulty'];
  tags?: string[];
};

export function createChordShape(definition: ChordDefinition): ChordShape {
  const id = `${slugRoot(definition.root)}_${definition.quality}`;

  return {
    id,
    root: definition.root,
    quality: definition.quality,
    title: definition.title ?? `${definition.root} ${definition.label}`,
    positions: parseChordPattern(definition.pattern, definition.fingers),
    image: definition.image,
    difficulty: definition.difficulty,
    tags: definition.tags,
    baseFret: 1,
  };
}
