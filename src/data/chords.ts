import type { ChordQualityId, ChordShape, FingerNumber, StringNumber } from './chordTypes';
import { chordImagePath } from '../lib/slug';
import { createChordShape, type ChordDefinition, type FingerMap } from '../lib/chordShapes';

type Row = {
  root: string;
  quality: ChordQualityId;
  label: string;
  title?: string;
  pattern: string;
  fingers?: FingerMap;
  tags?: string[];
  hasSourceImage?: boolean;
};

const sourceImageQualities = new Set<ChordQualityId>([
  'major',
  'dominant7',
  'minor',
  'minor7',
  'sus4',
  'major7',
  'six',
  'sevenSus4',
]);

const commonTags = ['guitar chord', 'reference'];

function f(entries: Partial<Record<StringNumber, FingerNumber>>): FingerMap {
  return entries;
}

function rowToDefinition(row: Row): ChordDefinition {
  const hasImage = row.hasSourceImage ?? sourceImageQualities.has(row.quality);

  return {
    root: row.root,
    quality: row.quality,
    label: row.label,
    title: row.title,
    pattern: row.pattern,
    fingers: row.fingers,
    image: hasImage ? chordImagePath(row.quality, row.root) : undefined,
    difficulty: row.pattern.includes('x') ? 'beginner' : 'intermediate',
    tags: [...commonTags, ...(row.tags ?? [])],
  };
}

const rows: Row[] = [
  { root: 'C', quality: 'major', label: 'Major', pattern: 'x32010', fingers: f({ 5: 3, 4: 2, 2: 1 }), tags: ['open chord'] },
  { root: 'D', quality: 'major', label: 'Major', pattern: 'xx0232', fingers: f({ 3: 1, 2: 3, 1: 2 }), tags: ['open chord'] },
  { root: 'E', quality: 'major', label: 'Major', pattern: '022100', fingers: f({ 5: 2, 4: 3, 3: 1 }), tags: ['open chord'] },
  { root: 'F', quality: 'major', label: 'Major', pattern: '133211', fingers: f({ 6: 1, 5: 3, 4: 4, 3: 2, 2: 1, 1: 1 }), tags: ['barre chord'] },
  { root: 'G', quality: 'major', label: 'Major', pattern: '320003', fingers: f({ 6: 2, 5: 1, 1: 3 }), tags: ['open chord'] },
  { root: 'A', quality: 'major', label: 'Major', pattern: 'x02220', fingers: f({ 4: 1, 3: 2, 2: 3 }), tags: ['open chord'] },
  { root: 'B', quality: 'major', label: 'Major', pattern: 'x24442', fingers: f({ 5: 1, 4: 3, 3: 3, 2: 3, 1: 1 }), tags: ['barre chord'] },

  { root: 'C', quality: 'dominant7', label: '7', title: 'C7', pattern: 'x32310', fingers: f({ 5: 3, 4: 2, 3: 4, 2: 1 }), tags: ['seventh'] },
  { root: 'D', quality: 'dominant7', label: '7', title: 'D7', pattern: 'xx0212', fingers: f({ 3: 2, 2: 1, 1: 3 }), tags: ['seventh'] },
  { root: 'E', quality: 'dominant7', label: '7', title: 'E7', pattern: '020100', fingers: f({ 5: 2, 3: 1 }), tags: ['seventh', 'open chord'] },
  { root: 'F', quality: 'dominant7', label: '7', title: 'F7', pattern: '131211', fingers: f({ 6: 1, 5: 3, 4: 1, 3: 2, 2: 1, 1: 1 }), tags: ['seventh', 'barre chord'] },
  { root: 'G', quality: 'dominant7', label: '7', title: 'G7', pattern: '320001', fingers: f({ 6: 3, 5: 2, 1: 1 }), tags: ['seventh', 'open chord'] },
  { root: 'A', quality: 'dominant7', label: '7', title: 'A7', pattern: 'x02020', fingers: f({ 4: 1, 2: 2 }), tags: ['seventh', 'open chord'] },
  { root: 'B', quality: 'dominant7', label: '7', title: 'B7', pattern: 'x21202', fingers: f({ 5: 2, 4: 1, 3: 3, 1: 4 }), tags: ['seventh'] },

  { root: 'C', quality: 'minor', label: 'minor', pattern: 'x35543', fingers: f({ 5: 1, 4: 3, 3: 4, 2: 2, 1: 1 }), tags: ['minor', 'barre chord'] },
  { root: 'D', quality: 'minor', label: 'minor', pattern: 'xx0231', fingers: f({ 3: 2, 2: 3, 1: 1 }), tags: ['minor', 'open chord'] },
  { root: 'E', quality: 'minor', label: 'minor', pattern: '022000', fingers: f({ 5: 2, 4: 3 }), tags: ['minor', 'open chord'] },
  { root: 'F', quality: 'minor', label: 'minor', pattern: '133111', fingers: f({ 6: 1, 5: 3, 4: 4, 3: 1, 2: 1, 1: 1 }), tags: ['minor', 'barre chord'] },
  { root: 'G', quality: 'minor', label: 'minor', pattern: '355333', fingers: f({ 6: 1, 5: 3, 4: 4, 3: 1, 2: 1, 1: 1 }), tags: ['minor', 'barre chord'] },
  { root: 'A', quality: 'minor', label: 'minor', pattern: 'x02210', fingers: f({ 4: 2, 3: 3, 2: 1 }), tags: ['minor', 'open chord'] },
  { root: 'B', quality: 'minor', label: 'minor', pattern: 'x24432', fingers: f({ 5: 1, 4: 3, 3: 4, 2: 2, 1: 1 }), tags: ['minor', 'barre chord'] },
  { root: 'C#', quality: 'minor', label: 'minor', pattern: 'x46654', fingers: f({ 5: 1, 4: 3, 3: 4, 2: 2, 1: 1 }), tags: ['minor', 'source extra'] },
  { root: 'F#', quality: 'minor', label: 'minor', pattern: '244222', fingers: f({ 6: 1, 5: 3, 4: 4, 3: 1, 2: 1, 1: 1 }), tags: ['minor', 'source extra'] },

  { root: 'C', quality: 'minor7', label: 'minor7', pattern: 'x35343', fingers: f({ 5: 1, 4: 3, 3: 1, 2: 2, 1: 1 }), tags: ['minor seventh'] },
  { root: 'D', quality: 'minor7', label: 'minor7', pattern: 'xx0211', fingers: f({ 3: 2, 2: 1, 1: 1 }), tags: ['minor seventh'] },
  { root: 'E', quality: 'minor7', label: 'minor7', pattern: '022030', fingers: f({ 5: 2, 4: 3, 2: 4 }), tags: ['minor seventh', 'open chord'] },
  { root: 'F', quality: 'minor7', label: 'minor7', pattern: '131111', fingers: f({ 6: 1, 5: 3, 4: 1, 3: 1, 2: 1, 1: 1 }), tags: ['minor seventh'] },
  { root: 'G', quality: 'minor7', label: 'minor7', pattern: '353333', fingers: f({ 6: 1, 5: 3, 4: 1, 3: 1, 2: 1, 1: 1 }), tags: ['minor seventh'] },
  { root: 'A', quality: 'minor7', label: 'minor7', pattern: 'x02010', fingers: f({ 4: 2, 2: 1 }), tags: ['minor seventh', 'open chord'] },
  { root: 'B', quality: 'minor7', label: 'minor7', pattern: 'x24232', fingers: f({ 5: 1, 4: 3, 3: 1, 2: 2, 1: 1 }), tags: ['minor seventh'] },
  { root: 'C#', quality: 'minor7', label: 'minor7', pattern: 'x46454', fingers: f({ 5: 1, 4: 3, 3: 1, 2: 2, 1: 1 }), tags: ['minor seventh', 'source extra'] },
  { root: 'F#', quality: 'minor7', label: 'minor7', pattern: '242222', fingers: f({ 6: 1, 5: 3, 4: 1, 3: 1, 2: 1, 1: 1 }), tags: ['minor seventh', 'source extra'] },

  { root: 'C', quality: 'sus4', label: 'sus4', pattern: 'x33011', fingers: f({ 5: 3, 4: 4, 2: 1, 1: 1 }), tags: ['suspended'] },
  { root: 'D', quality: 'sus4', label: 'sus4', pattern: 'xx0233', fingers: f({ 3: 1, 2: 3, 1: 4 }), tags: ['suspended'] },
  { root: 'E', quality: 'sus4', label: 'sus4', pattern: '022200', fingers: f({ 5: 1, 4: 2, 3: 3 }), tags: ['suspended'] },
  { root: 'F', quality: 'sus4', label: 'sus4', pattern: '133311', fingers: f({ 6: 1, 5: 2, 4: 3, 3: 4, 2: 1, 1: 1 }), tags: ['suspended'] },
  { root: 'G', quality: 'sus4', label: 'sus4', pattern: '330013', fingers: f({ 6: 2, 5: 3, 2: 1, 1: 4 }), tags: ['suspended'] },
  { root: 'A', quality: 'sus4', label: 'sus4', pattern: 'x02230', fingers: f({ 4: 1, 3: 2, 2: 4 }), tags: ['suspended'] },
  { root: 'B', quality: 'sus4', label: 'sus4', pattern: 'x24452', fingers: f({ 5: 1, 4: 2, 3: 3, 2: 4, 1: 1 }), tags: ['suspended'] },

  { root: 'C', quality: 'major7', label: 'Major 7', pattern: 'x32000', fingers: f({ 5: 3, 4: 2 }), tags: ['major seventh'] },
  { root: 'D', quality: 'major7', label: 'Major 7', pattern: 'xx0222', fingers: f({ 3: 1, 2: 1, 1: 1 }), tags: ['major seventh'] },
  { root: 'E', quality: 'major7', label: 'Major 7', pattern: '021100', fingers: f({ 5: 2, 4: 1, 3: 1 }), tags: ['major seventh'] },
  { root: 'F', quality: 'major7', label: 'Major 7', pattern: '132211', fingers: f({ 6: 1, 5: 3, 4: 2, 3: 2, 2: 1, 1: 1 }), tags: ['major seventh'] },
  { root: 'G', quality: 'major7', label: 'Major 7', pattern: '320002', fingers: f({ 6: 3, 5: 2, 1: 1 }), tags: ['major seventh'] },
  { root: 'A', quality: 'major7', label: 'Major 7', pattern: 'x02120', fingers: f({ 4: 2, 3: 1, 2: 3 }), tags: ['major seventh'] },
  { root: 'B', quality: 'major7', label: 'Major 7', pattern: 'x24342', fingers: f({ 5: 1, 4: 2, 3: 4, 2: 3, 1: 1 }), tags: ['major seventh'] },

  { root: 'C', quality: 'six', label: '6', title: 'C6', pattern: 'x32210', fingers: f({ 5: 3, 4: 2, 3: 4, 2: 1 }), tags: ['sixth'] },
  { root: 'D', quality: 'six', label: '6', title: 'D6', pattern: 'xx0202', fingers: f({ 3: 1, 1: 2 }), tags: ['sixth'] },
  { root: 'E', quality: 'six', label: '6', title: 'E6', pattern: '022120', fingers: f({ 5: 2, 4: 3, 3: 1, 2: 4 }), tags: ['sixth'] },
  { root: 'F', quality: 'six', label: '6', title: 'F6', pattern: '100211', fingers: f({ 6: 1, 3: 2, 2: 1, 1: 1 }), tags: ['sixth'] },
  { root: 'G', quality: 'six', label: '6', title: 'G6', pattern: '320000', fingers: f({ 6: 3, 5: 2 }), tags: ['sixth'] },
  { root: 'A', quality: 'six', label: '6', title: 'A6', pattern: 'x02222', fingers: f({ 4: 1, 3: 1, 2: 1, 1: 1 }), tags: ['sixth'] },
  { root: 'B', quality: 'six', label: '6', title: 'B6', pattern: 'x24444', fingers: f({ 5: 1, 4: 3, 3: 3, 2: 3, 1: 3 }), tags: ['sixth'] },

  { root: 'C', quality: 'sevenSus4', label: '7sus4', pattern: 'x33311', fingers: f({ 5: 3, 4: 4, 3: 4, 2: 1, 1: 1 }), tags: ['suspended seventh'] },
  { root: 'D', quality: 'sevenSus4', label: '7sus4', pattern: 'xx0213', fingers: f({ 3: 2, 2: 1, 1: 3 }), tags: ['suspended seventh'] },
  { root: 'E', quality: 'sevenSus4', label: '7sus4', pattern: '020200', fingers: f({ 5: 2, 3: 3 }), tags: ['suspended seventh'] },
  { root: 'F', quality: 'sevenSus4', label: '7sus4', pattern: '131311', fingers: f({ 6: 1, 5: 3, 4: 1, 3: 4, 2: 1, 1: 1 }), tags: ['suspended seventh'] },
  { root: 'G', quality: 'sevenSus4', label: '7sus4', pattern: '330011', fingers: f({ 6: 3, 5: 4, 2: 1, 1: 1 }), tags: ['suspended seventh'] },
  { root: 'A', quality: 'sevenSus4', label: '7sus4', pattern: 'x02030', fingers: f({ 4: 1, 2: 3 }), tags: ['suspended seventh'] },
  { root: 'B', quality: 'sevenSus4', label: '7sus4', pattern: 'x24252', fingers: f({ 5: 1, 4: 3, 3: 1, 2: 4, 1: 1 }), tags: ['suspended seventh'] },

  { root: 'C', quality: 'add2', label: 'add2', pattern: 'x32030', fingers: f({ 5: 3, 4: 2, 2: 4 }), tags: ['add tone'], hasSourceImage: false },
  { root: 'D', quality: 'add2', label: 'add2', pattern: 'xx0230', fingers: f({ 3: 1, 2: 3 }), tags: ['add tone'], hasSourceImage: false },
  { root: 'E', quality: 'add2', label: 'add2', pattern: '024100', fingers: f({ 5: 2, 4: 4, 3: 1 }), tags: ['add tone'], hasSourceImage: false },
  { root: 'F', quality: 'add2', label: 'add2', pattern: '133011', fingers: f({ 6: 1, 5: 3, 4: 4, 2: 1, 1: 1 }), tags: ['add tone'], hasSourceImage: false },
  { root: 'G', quality: 'add2', label: 'add2', pattern: '300203', fingers: f({ 6: 3, 3: 2, 1: 4 }), tags: ['add tone'], hasSourceImage: false },
  { root: 'A', quality: 'add2', label: 'add2', pattern: 'x02420', fingers: f({ 4: 1, 3: 3, 2: 2 }), tags: ['add tone'], hasSourceImage: false },
  { root: 'B', quality: 'add2', label: 'add2', pattern: 'x24422', fingers: f({ 5: 1, 4: 3, 3: 4, 2: 1, 1: 1 }), tags: ['add tone'], hasSourceImage: false },

  { root: 'C', quality: 'm7b5', label: 'm7(b5)', pattern: 'x3434x', fingers: f({ 5: 1, 4: 2, 3: 1, 2: 3 }), tags: ['half diminished'], hasSourceImage: false },
  { root: 'D', quality: 'm7b5', label: 'm7(b5)', pattern: 'xx0111', fingers: f({ 3: 1, 2: 1, 1: 1 }), tags: ['half diminished'], hasSourceImage: false },
  { root: 'E', quality: 'm7b5', label: 'm7(b5)', pattern: '012030', fingers: f({ 5: 1, 4: 2, 2: 3 }), tags: ['half diminished'], hasSourceImage: false },
  { root: 'F', quality: 'm7b5', label: 'm7(b5)', pattern: '123131', fingers: f({ 6: 1, 5: 2, 4: 4, 3: 1, 2: 3, 1: 1 }), tags: ['half diminished'], hasSourceImage: false },
  { root: 'G', quality: 'm7b5', label: 'm7(b5)', pattern: '3x332x', fingers: f({ 6: 2, 4: 3, 3: 4, 2: 1 }), tags: ['half diminished'], hasSourceImage: false },
  { root: 'A', quality: 'm7b5', label: 'm7(b5)', pattern: 'x01013', fingers: f({ 4: 1, 2: 2, 1: 4 }), tags: ['half diminished'], hasSourceImage: false },
  { root: 'B', quality: 'm7b5', label: 'm7(b5)', pattern: 'x2323x', fingers: f({ 5: 1, 4: 2, 3: 1, 2: 3 }), tags: ['half diminished'], hasSourceImage: false },

  { root: 'C', quality: 'diminish', label: 'diminish', pattern: 'x3424x', fingers: f({ 5: 2, 4: 3, 3: 1, 2: 4 }), tags: ['diminished'], hasSourceImage: false },
  { root: 'D', quality: 'diminish', label: 'diminish', pattern: 'xx0101', fingers: f({ 3: 1, 1: 2 }), tags: ['diminished'], hasSourceImage: false },
  { root: 'E', quality: 'diminish', label: 'diminish', pattern: 'xx2323', fingers: f({ 4: 1, 3: 2, 2: 3, 1: 4 }), tags: ['diminished'], hasSourceImage: false },
  { root: 'F', quality: 'diminish', label: 'diminish', pattern: 'xx3434', fingers: f({ 4: 1, 3: 2, 2: 3, 1: 4 }), tags: ['diminished'], hasSourceImage: false },
  { root: 'G', quality: 'diminish', label: 'diminish', pattern: '3x232x', fingers: f({ 6: 2, 4: 1, 3: 3, 2: 4 }), tags: ['diminished'], hasSourceImage: false },
  { root: 'A', quality: 'diminish', label: 'diminish', pattern: 'x0121x', fingers: f({ 4: 1, 3: 2, 2: 3 }), tags: ['diminished'], hasSourceImage: false },
  { root: 'B', quality: 'diminish', label: 'diminish', pattern: 'x2313x', fingers: f({ 5: 1, 4: 2, 3: 1, 2: 3 }), tags: ['diminished'], hasSourceImage: false },

  { root: 'C', quality: 'augment', label: 'Augment', pattern: 'x3211x', fingers: f({ 5: 3, 4: 2, 3: 1, 2: 1 }), tags: ['augmented'], hasSourceImage: false },
  { root: 'D', quality: 'augment', label: 'Augment', pattern: 'xx0332', fingers: f({ 3: 3, 2: 4, 1: 2 }), tags: ['augmented'], hasSourceImage: false },
  { root: 'E', quality: 'augment', label: 'Augment', pattern: '032110', fingers: f({ 5: 3, 4: 2, 3: 1, 2: 1 }), tags: ['augmented'], hasSourceImage: false },
  { root: 'F', quality: 'augment', label: 'Augment', pattern: 'xx3221', fingers: f({ 4: 3, 3: 2, 2: 2, 1: 1 }), tags: ['augmented'], hasSourceImage: false },
  { root: 'G', quality: 'augment', label: 'Augment', pattern: '321003', fingers: f({ 6: 3, 5: 2, 4: 1, 1: 4 }), tags: ['augmented'], hasSourceImage: false },
  { root: 'A', quality: 'augment', label: 'Augment', pattern: 'x03221', fingers: f({ 4: 3, 3: 2, 2: 2, 1: 1 }), tags: ['augmented'], hasSourceImage: false },
  { root: 'B', quality: 'augment', label: 'Augment', pattern: 'x21003', fingers: f({ 5: 2, 4: 1, 1: 4 }), tags: ['augmented'], hasSourceImage: false },
];

export const chords: ChordShape[] = rows.map((row) => createChordShape(rowToDefinition(row)));

export function getChordsByQuality(quality: ChordQualityId): ChordShape[] {
  return chords.filter((chord) => chord.quality === quality);
}

export function getChordById(id: string): ChordShape | undefined {
  return chords.find((chord) => chord.id === id);
}
