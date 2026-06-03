export type ChordQualityId =
  | 'major'
  | 'dominant7'
  | 'minor'
  | 'minor7'
  | 'sus4'
  | 'major7'
  | 'six'
  | 'sevenSus4'
  | 'add2'
  | 'm7b5'
  | 'diminish'
  | 'augment';

export type StringNumber = 1 | 2 | 3 | 4 | 5 | 6;
export type FingerNumber = 1 | 2 | 3 | 4;

export type FingerPosition = {
  string: StringNumber;
  fret?: number;
  finger?: FingerNumber;
  open?: boolean;
  muted?: boolean;
};

export type ChordShape = {
  id: string;
  root: string;
  quality: ChordQualityId;
  title: string;
  positions: FingerPosition[];
  baseFret?: number;
  image?: string;
  uploadedImageUrl?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
};
