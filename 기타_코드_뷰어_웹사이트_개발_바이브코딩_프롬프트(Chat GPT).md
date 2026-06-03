# 기타 코드 뷰어 웹사이트 개발용 바이브코딩 프롬프트

> 목적: 첨부 영상처럼 **상단 검색창 + 원형 코드 종류 버튼 + 코드 카드 그리드 + 선택 코드 확대 뷰**가 있는 기타 코드 뷰어 웹사이트를 만든다.  
> 이 문서는 Cursor, Claude Code, Windsurf, Replit Agent 같은 바이브코딩 도구에 그대로 붙여넣어 단계별로 개발하기 위한 프롬프트다.  
> 특히 기타 코드 이미지를 웹사이트 안에 저장하고 관리하는 방법을 반드시 포함한다.

---

## 0. 영상에서 참고할 핵심 UI/동작

첨부 영상의 화면을 다음과 같이 해석해서 구현한다.

1. 전체 배경은 흰색 또는 아주 밝은 회색이다.
2. 상단에는 왼쪽에 돋보기 아이콘, 가운데에 길고 둥근 검색창, 오른쪽에는 `Lesson Designer` 같은 연한 핑크색 타이틀 텍스트가 있다.
3. 첫 화면에는 기타 코드 종류를 고르는 원형 버튼들이 2줄로 배치된다.
   - 1행: `Major`, `7`, `minor`, `minor7`, `sus4`, `Major 7`
   - 2행: `6`, `7sus4`, `add2`, `m7(b5)`, `diminish`, `Augment`
4. 각 원형 버튼은 흰색 내부, 파스텔 계열 외곽선, 부드러운 그림자, 살짝 떠 있는 느낌을 가진다.
5. `Major` 버튼을 클릭하면 Major 코드 카드 목록으로 전환된다.
6. 코드 카드 목록에는 `C Major`, `D Major`, `E Major`, `F Major`, `G Major`, `A Major`, `B Major` 카드가 보인다.
7. 각 코드 카드는 작은 기타 코드 다이어그램 이미지와 초록색 점선 라벨을 가진다.
8. 특정 코드, 예를 들어 `C Major`를 클릭하면 화면 중앙에 코드명이 크게 표시되고, 아래에 큰 기타 코드 이미지가 나타난다.
9. 선택된 코드 외의 다른 코드들은 오른쪽 사이드에 작은 카드/썸네일처럼 보이거나 보조 목록으로 남는다.
10. 버튼 클릭, 카드 등장, 확대 전환은 갑작스럽지 않고 부드러운 transition/animation이 있어야 한다.

---

## 1. 최종 개발 목표

다음 조건을 만족하는 반응형 기타 코드 뷰어 웹사이트를 구현한다.

- React + TypeScript 기반 SPA로 구현한다.
- Vite를 사용해서 빠르게 개발한다.
- TailwindCSS로 스타일링한다.
- 기타 코드 종류 선택 화면, 코드 목록 화면, 코드 상세 화면을 하나의 페이지에서 상태 전환으로 구현한다.
- 기본 코드 이미지는 프로젝트 내부의 `public/chords` 폴더에 저장한다.
- 코드 이미지 경로와 코드 메타데이터는 TypeScript 데이터 파일 또는 JSON manifest로 관리한다.
- 브라우저에서 새 코드 이미지를 추가하는 관리자/에디터 기능도 선택적으로 구현한다.
- 새로 업로드한 이미지는 MVP에서는 IndexedDB에 저장하고, 운영 배포용으로는 Supabase Storage 같은 외부 스토리지 옵션을 구조에 포함한다.
- 영상과 비슷한 시각적 분위기를 참고하되, 로고/이미지/디자인 자산은 직접 만든 것으로 사용한다.

---

## 2. 추천 기술 스택

MVP 기준:

- Framework: React
- Language: TypeScript
- Build Tool: Vite
- Styling: TailwindCSS
- Animation: CSS transition 우선, 필요하면 Framer Motion 추가
- Client Storage: IndexedDB, `idb` 또는 `idb-keyval`
- Data: `src/data/chords.ts`, `src/data/chordQualities.ts`
- Static Assets: `public/chords/...`

운영 확장 시:

- Storage: Supabase Storage, Cloudflare R2, S3 중 하나
- DB: Supabase Postgres 또는 SQLite/Turso
- Auth: 관리자 이미지 업로드 기능이 필요할 때만 추가

---

## 3. 폴더 구조 설계

아래 구조로 생성한다.

```txt
guitar-chord-viewer/
  public/
    chords/
      manifest.json
      major/
        c.svg
        d.svg
        e.svg
        f.svg
        g.svg
        a.svg
        b.svg
      minor/
        c.svg
      placeholders/
        chord-placeholder.svg
  src/
    assets/
    components/
      AppHeader.tsx
      QualityBubble.tsx
      QualitySelector.tsx
      ChordCard.tsx
      ChordGrid.tsx
      ChordDetail.tsx
      ChordImage.tsx
      ChordImageUploader.tsx
      EmptyState.tsx
    data/
      chordQualities.ts
      chords.ts
      chordTypes.ts
    hooks/
      useChordSearch.ts
      useIndexedChordImages.ts
    lib/
      chordImageStorage.ts
      slug.ts
    styles/
      globals.css
    App.tsx
    main.tsx
  scripts/
    generateChordSvgs.ts
  package.json
  tailwind.config.js
  README.md
```

---

## 4. 코드 이미지 저장 방식 핵심 원칙

### 4.1 기본 방식: 프로젝트 내부 정적 저장

기본 코드 이미지는 웹사이트 프로젝트 안에 직접 저장한다.

```txt
public/chords/major/c.svg
public/chords/major/d.svg
public/chords/major/e.svg
public/chords/major/f.svg
public/chords/major/g.svg
public/chords/major/a.svg
public/chords/major/b.svg
```

React에서는 다음처럼 사용한다.

```tsx
<img src="/chords/major/c.svg" alt="C Major guitar chord diagram" />
```

Vite 기준으로 `public` 폴더 안 파일은 빌드 후 사이트 루트에 그대로 노출된다. 따라서 `/chords/major/c.svg`처럼 절대 경로로 접근한다.

### 4.2 이미지 파일명 규칙

파일명은 반드시 소문자 kebab-case로 통일한다.

```txt
C Major      -> public/chords/major/c.svg
C# Major     -> public/chords/major/c-sharp.svg
Db Major     -> public/chords/major/d-flat.svg
A minor7     -> public/chords/minor7/a.svg
B m7(b5)     -> public/chords/m7b5/b.svg
F diminish   -> public/chords/diminish/f.svg
G Augment    -> public/chords/augment/g.svg
```

### 4.3 manifest.json 방식

이미지를 수십 개 이상 관리할 때는 `manifest.json`을 둔다.

```json
{
  "version": 1,
  "basePath": "/chords",
  "items": [
    {
      "id": "c_major",
      "root": "C",
      "quality": "major",
      "title": "C Major",
      "imageSrc": "/chords/major/c.svg",
      "thumbSrc": "/chords/major/c.svg",
      "tags": ["open chord", "beginner"]
    },
    {
      "id": "d_major",
      "root": "D",
      "quality": "major",
      "title": "D Major",
      "imageSrc": "/chords/major/d.svg",
      "thumbSrc": "/chords/major/d.svg",
      "tags": ["open chord", "beginner"]
    }
  ]
}
```

### 4.4 TypeScript 데이터 방식

초기 MVP에서는 manifest 대신 TypeScript 배열을 사용해도 된다.

```ts
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

export type ChordItem = {
  id: string;
  root: string;
  quality: ChordQualityId;
  title: string;
  imageSrc: string;
  thumbSrc?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
};

export const chords: ChordItem[] = [
  {
    id: 'c_major',
    root: 'C',
    quality: 'major',
    title: 'C Major',
    imageSrc: '/chords/major/c.svg',
    thumbSrc: '/chords/major/c.svg',
    difficulty: 'beginner',
    tags: ['open chord']
  }
];
```

### 4.5 업로드 이미지 저장의 현실적인 한계

브라우저에서 사용자가 이미지를 업로드한다고 해서 배포된 웹사이트의 `public/chords` 폴더에 직접 파일이 써지는 것은 아니다. 정적 웹사이트는 배포 후 서버 파일 시스템을 브라우저가 직접 수정할 수 없다.

따라서 이미지 저장은 목적에 따라 나눈다.

1. **개발자가 기본 이미지를 넣는 방식**  
   `public/chords` 폴더에 SVG/PNG/WebP 파일을 직접 넣고 Git으로 관리한다.

2. **사용자가 브라우저에서 개인적으로 추가하는 방식**  
   IndexedDB에 이미지 Blob을 저장한다. 이 방식은 해당 브라우저/기기 안에서만 유지된다.

3. **운영 사이트에서 모든 사용자가 공유하는 방식**  
   Supabase Storage, S3, Cloudflare R2 같은 object storage에 업로드하고, DB에는 이미지 URL과 메타데이터를 저장한다.

MVP에서는 1번과 2번을 구현한다. 운영 확장 설계 문서에는 3번을 포함한다.

---

## 5. 코드 이미지 저장 구현 상세

### 5.1 정적 이미지 저장

`public/chords/major/c.svg` 같은 파일을 만들고, 데이터에 경로를 기록한다.

```ts
const cMajor = {
  id: 'c_major',
  root: 'C',
  quality: 'major',
  title: 'C Major',
  imageSrc: '/chords/major/c.svg'
};
```

렌더링 컴포넌트:

```tsx
type ChordImageProps = {
  src: string;
  title: string;
  size?: 'thumb' | 'large';
};

export function ChordImage({ src, title, size = 'thumb' }: ChordImageProps) {
  return (
    <img
      src={src}
      alt={`${title} guitar chord diagram`}
      className={
        size === 'large'
          ? 'h-auto w-full max-w-[520px] rounded-2xl object-contain drop-shadow-xl'
          : 'h-32 w-full rounded-xl object-contain drop-shadow-md'
      }
      loading="lazy"
    />
  );
}
```

### 5.2 SVG 자동 생성 방식

기타 코드 이미지를 직접 PNG로 관리하면 해상도, 용량, 수정 문제가 생긴다. 가능하면 코드 모양 데이터를 JSON으로 저장하고 SVG를 자동 생성한다.

예시 데이터:

```ts
export type ChordShape = {
  id: string;
  title: string;
  root: string;
  quality: string;
  frets: Array<{
    string: 1 | 2 | 3 | 4 | 5 | 6;
    fret: number;
    finger?: 1 | 2 | 3 | 4;
    muted?: boolean;
    open?: boolean;
  }>;
};

export const cMajorShape: ChordShape = {
  id: 'c_major',
  title: 'C Major',
  root: 'C',
  quality: 'major',
  frets: [
    { string: 6, fret: 0, muted: true },
    { string: 5, fret: 3, finger: 3 },
    { string: 4, fret: 2, finger: 2 },
    { string: 3, fret: 0, open: true },
    { string: 2, fret: 1, finger: 1 },
    { string: 1, fret: 0, open: true }
  ]
};
```

생성 스크립트 목표:

```txt
scripts/generateChordSvgs.ts
```

이 스크립트는 chord shape 데이터를 읽어서 다음 파일들을 생성한다.

```txt
public/chords/major/c.svg
public/chords/major/d.svg
...
```

장점:

- 같은 스타일의 코드 이미지를 자동 생성할 수 있다.
- 해상도 걱정 없이 확대해도 선명하다.
- 코드 운지 데이터를 수정하면 이미지도 자동으로 바뀐다.
- 저작권 문제를 줄일 수 있다. 외부 이미지 복사 대신 직접 생성하기 때문이다.

### 5.3 IndexedDB 업로드 저장 방식

사용자가 브라우저에서 코드 이미지를 직접 추가할 수 있도록 MVP 관리자 기능을 만든다.

설치:

```bash
npm install idb
```

저장 유틸 예시:

```ts
import { openDB } from 'idb';

export type UploadedChordImage = {
  id: string;
  chordId: string;
  fileName: string;
  mimeType: string;
  blob: Blob;
  createdAt: string;
  updatedAt: string;
};

const DB_NAME = 'guitar-chord-viewer';
const STORE_NAME = 'chord-images';

export async function getChordImageDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    }
  });
}

export async function saveUploadedChordImage(item: UploadedChordImage) {
  const db = await getChordImageDb();
  await db.put(STORE_NAME, item);
}

export async function getUploadedChordImage(id: string) {
  const db = await getChordImageDb();
  return db.get(STORE_NAME, id) as Promise<UploadedChordImage | undefined>;
}

export async function getUploadedChordImageUrl(id: string) {
  const item = await getUploadedChordImage(id);
  if (!item) return null;
  return URL.createObjectURL(item.blob);
}
```

업로드 UI 요구사항:

- 코드 종류 선택: Major, minor 등
- 루트 선택: C, D, E, F, G, A, B, C#, Db 등
- 제목 자동 생성: `C Major`
- 이미지 파일 업로드: SVG, PNG, WebP 허용
- 미리보기 표시
- 저장 버튼 클릭 시 IndexedDB에 Blob 저장
- 저장 후 코드 목록에 즉시 반영
- 내보내기 버튼: 업로드 메타데이터 JSON 다운로드
- 가져오기 버튼: JSON과 이미지 파일을 다시 불러오는 기능은 후순위

주의:

- IndexedDB에 저장한 이미지는 사용자의 현재 브라우저에만 남는다.
- 다른 사용자와 공유하려면 반드시 서버 저장소가 필요하다.

### 5.4 운영용 Supabase Storage 확장 구조

운영 버전에서 관리자 업로드 이미지를 모든 사용자가 보게 하려면 다음 구조를 사용한다.

```txt
Supabase Storage bucket: chord-images
파일 경로 예시: chord-images/major/c.svg
DB table: chord_images
```

DB 테이블 예시:

```sql
create table chord_images (
  id uuid primary key default gen_random_uuid(),
  chord_id text not null,
  root text not null,
  quality text not null,
  title text not null,
  storage_path text not null,
  public_url text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

앱 로딩 흐름:

1. 정적 기본 코드 데이터 로드
2. Supabase에서 추가 코드 이미지 metadata fetch
3. 같은 `chordId`가 있으면 Supabase 이미지가 정적 이미지를 override
4. 없으면 목록에 새 코드로 추가

---

## 6. 데이터 모델

### 6.1 코드 종류 데이터

```ts
export type ChordQuality = {
  id: ChordQualityId;
  label: string;
  shortLabel?: string;
  color: string;
  borderColorClass: string;
  textColorClass: string;
  description: string;
};

export const chordQualities: ChordQuality[] = [
  {
    id: 'major',
    label: 'Major',
    color: '#f97316',
    borderColorClass: 'border-orange-500',
    textColorClass: 'text-rose-800',
    description: '밝고 안정적인 기본 메이저 코드'
  },
  {
    id: 'dominant7',
    label: '7',
    color: '#facc15',
    borderColorClass: 'border-yellow-300',
    textColorClass: 'text-yellow-600',
    description: '블루스와 팝에서 자주 쓰이는 도미넌트 세븐 코드'
  },
  {
    id: 'minor',
    label: 'minor',
    color: '#bef264',
    borderColorClass: 'border-lime-300',
    textColorClass: 'text-lime-600',
    description: '어둡고 감성적인 마이너 코드'
  },
  {
    id: 'minor7',
    label: 'minor7',
    color: '#10b981',
    borderColorClass: 'border-emerald-400',
    textColorClass: 'text-emerald-600',
    description: '부드러운 재즈/팝 느낌의 마이너 세븐 코드'
  },
  {
    id: 'sus4',
    label: 'sus4',
    color: '#22d3ee',
    borderColorClass: 'border-cyan-400',
    textColorClass: 'text-cyan-600',
    description: '긴장감 있게 매달리는 suspended 코드'
  },
  {
    id: 'major7',
    label: 'Major 7',
    color: '#0ea5e9',
    borderColorClass: 'border-sky-500',
    textColorClass: 'text-sky-700',
    description: '몽환적이고 세련된 메이저 세븐 코드'
  },
  {
    id: 'six',
    label: '6',
    color: '#1e3a8a',
    borderColorClass: 'border-blue-900',
    textColorClass: 'text-blue-900',
    description: '빈티지하고 따뜻한 식스 코드'
  },
  {
    id: 'sevenSus4',
    label: '7sus4',
    color: '#8b5cf6',
    borderColorClass: 'border-violet-300',
    textColorClass: 'text-violet-700',
    description: '도미넌트와 sus4의 긴장감을 함께 가진 코드'
  },
  {
    id: 'add2',
    label: 'add2',
    color: '#fda4af',
    borderColorClass: 'border-rose-200',
    textColorClass: 'text-rose-300',
    description: '2음을 더해 맑은 느낌을 주는 코드'
  },
  {
    id: 'm7b5',
    label: 'm7(b5)',
    color: '#f0abfc',
    borderColorClass: 'border-fuchsia-300',
    textColorClass: 'text-fuchsia-600',
    description: '하프 디미니시드 코드'
  },
  {
    id: 'diminish',
    label: 'diminish',
    color: '#a855f7',
    borderColorClass: 'border-purple-600',
    textColorClass: 'text-purple-800',
    description: '긴장감이 강한 디미니시드 코드'
  },
  {
    id: 'augment',
    label: 'Augment',
    color: '#a16207',
    borderColorClass: 'border-yellow-700',
    textColorClass: 'text-rose-800',
    description: '증5도를 가진 증화음 코드'
  }
];
```

### 6.2 기본 코드 데이터

초기에는 Major 코드 7개만 완성해도 된다. 이후 같은 구조로 minor, minor7 등을 확장한다.

```ts
export const chords: ChordItem[] = [
  {
    id: 'c_major',
    root: 'C',
    quality: 'major',
    title: 'C Major',
    imageSrc: '/chords/major/c.svg',
    thumbSrc: '/chords/major/c.svg',
    difficulty: 'beginner',
    tags: ['open chord']
  },
  {
    id: 'd_major',
    root: 'D',
    quality: 'major',
    title: 'D Major',
    imageSrc: '/chords/major/d.svg',
    thumbSrc: '/chords/major/d.svg',
    difficulty: 'beginner',
    tags: ['open chord']
  },
  {
    id: 'e_major',
    root: 'E',
    quality: 'major',
    title: 'E Major',
    imageSrc: '/chords/major/e.svg',
    thumbSrc: '/chords/major/e.svg',
    difficulty: 'beginner',
    tags: ['open chord']
  },
  {
    id: 'f_major',
    root: 'F',
    quality: 'major',
    title: 'F Major',
    imageSrc: '/chords/major/f.svg',
    thumbSrc: '/chords/major/f.svg',
    difficulty: 'intermediate',
    tags: ['barre chord']
  },
  {
    id: 'g_major',
    root: 'G',
    quality: 'major',
    title: 'G Major',
    imageSrc: '/chords/major/g.svg',
    thumbSrc: '/chords/major/g.svg',
    difficulty: 'beginner',
    tags: ['open chord']
  },
  {
    id: 'a_major',
    root: 'A',
    quality: 'major',
    title: 'A Major',
    imageSrc: '/chords/major/a.svg',
    thumbSrc: '/chords/major/a.svg',
    difficulty: 'beginner',
    tags: ['open chord']
  },
  {
    id: 'b_major',
    root: 'B',
    quality: 'major',
    title: 'B Major',
    imageSrc: '/chords/major/b.svg',
    thumbSrc: '/chords/major/b.svg',
    difficulty: 'intermediate',
    tags: ['barre chord']
  }
];
```

---

## 7. UI 컴포넌트 요구사항

### 7.1 AppHeader

역할:

- 상단 검색창과 브랜드 텍스트 표시
- 검색어 입력 상태를 부모로 전달

구현 조건:

- 전체 너비 상단에 배치
- 왼쪽 돋보기 아이콘
- 검색창은 pill shape, 연한 분홍색 border
- 오른쪽에 `Lesson Designer` 텍스트
- 모바일에서는 브랜드 텍스트가 작아지거나 검색창 아래로 내려가도 된다.

### 7.2 QualitySelector

역할:

- 코드 종류 원형 버튼 목록 표시
- 선택한 코드 종류를 부모 상태로 전달

구현 조건:

- desktop: 6개씩 2줄 grid
- mobile: 2~3개씩 wrap
- 버튼은 원형, 흰색 배경, 색상 border, 내부 그림자
- hover 시 살짝 확대
- active 상태는 scale이 커지고 외곽선이 더 진해진다.

### 7.3 QualityBubble

props:

```ts
type QualityBubbleProps = {
  label: string;
  color: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
};
```

스타일:

- 크기: desktop 128px, mobile 96px
- border: 4px solid quality color
- border-radius: 9999px
- box-shadow: inset shadow + drop shadow
- transition: transform 200ms ease, box-shadow 200ms ease

### 7.4 ChordGrid

역할:

- 선택된 코드 종류에 해당하는 코드 카드 목록 표시

구현 조건:

- `selectedQuality`가 없으면 표시하지 않는다.
- `selectedQuality`가 있으면 해당 quality의 코드만 필터링한다.
- 검색어가 있으면 title, root, quality, tags에서 검색한다.
- desktop: 4열 또는 5열
- tablet: 3열
- mobile: 2열
- 카드가 없으면 EmptyState 표시

### 7.5 ChordCard

역할:

- 코드 썸네일과 제목 라벨 표시

구현 조건:

- 라벨은 영상처럼 연두색/초록색 점선 border 느낌
- 썸네일 이미지는 흰색 카드 위에 표시
- 카드 hover 시 scale 1.04
- 클릭하면 `selectedChord` 상태 설정
- keyboard focus 가능해야 한다.

### 7.6 ChordDetail

역할:

- 선택된 코드의 큰 상세 뷰 표시

구현 조건:

- 중앙에 큰 코드 제목 표시
- 제목은 초록색 텍스트 + 주황색 border box 느낌
- 아래에 큰 코드 이미지 표시
- 오른쪽에는 같은 quality의 다른 코드 썸네일 목록 표시
- 뒤로가기 또는 닫기 버튼 제공
- mobile에서는 오른쪽 목록이 아래쪽 horizontal scroll로 내려간다.

### 7.7 ChordImageUploader

역할:

- 브라우저에서 새 코드 이미지를 추가하고 IndexedDB에 저장

구현 조건:

- `/admin` 라우트를 따로 만들지 않는다면, 우측 상단 작은 `Manage Images` 버튼으로 drawer/modal을 연다.
- 폼 필드:
  - Root note
  - Quality
  - Title
  - Image file
  - Tags
- 업로드 가능 파일:
  - `.svg`
  - `.png`
  - `.webp`
- 파일 크기 제한:
  - MVP: 2MB 이하
- 저장 후 해당 chord item을 앱 상태에 추가한다.
- IndexedDB에서 다시 로드되도록 한다.

---

## 8. 상태 관리 설계

MVP에서는 전역 상태 라이브러리를 쓰지 말고 React state와 custom hook으로 충분히 구현한다.

```ts
type AppView = 'qualities' | 'grid' | 'detail';

const [searchTerm, setSearchTerm] = useState('');
const [selectedQuality, setSelectedQuality] = useState<ChordQualityId | null>(null);
const [selectedChordId, setSelectedChordId] = useState<string | null>(null);
const [uploadedChords, setUploadedChords] = useState<ChordItem[]>([]);
```

파생 데이터:

```ts
const allChords = [...staticChords, ...uploadedChords];

const filteredChords = allChords.filter((chord) => {
  const matchesQuality = selectedQuality ? chord.quality === selectedQuality : true;
  const query = searchTerm.trim().toLowerCase();
  const matchesSearch =
    !query ||
    chord.title.toLowerCase().includes(query) ||
    chord.root.toLowerCase().includes(query) ||
    chord.quality.toLowerCase().includes(query) ||
    chord.tags?.some((tag) => tag.toLowerCase().includes(query));

  return matchesQuality && matchesSearch;
});
```

전환 규칙:

- 앱 처음 진입: `selectedQuality = null`, `selectedChordId = null`
- 코드 종류 클릭: `selectedQuality` 설정, `selectedChordId = null`
- 코드 카드 클릭: `selectedChordId` 설정
- 뒤로가기 클릭:
  - detail이면 grid로 돌아가기
  - grid이면 quality selector만 보이게 초기화

---

## 9. 애니메이션 요구사항

영상 느낌을 살리기 위해 다음 애니메이션을 구현한다.

1. 원형 버튼 hover
   - scale: 1 -> 1.06
   - shadow 강화
2. 원형 버튼 active
   - scale: 1.1
   - border thickness 증가 또는 glow 효과
3. quality 선택 후 grid 등장
   - opacity 0 -> 1
   - translateY 12px -> 0
4. chord card hover
   - scale: 1 -> 1.04
   - shadow 강화
5. detail 진입
   - 큰 이미지 opacity 0 -> 1
   - scale 0.96 -> 1
6. 오른쪽 썸네일 목록
   - 각 카드에 staggered animation 느낌

Tailwind class 중심으로 구현하되, 필요한 경우 CSS keyframes를 추가한다.

---

## 10. 접근성 요구사항

- 모든 클릭 가능한 카드/버튼은 `button` 또는 keyboard handler가 있는 요소로 구현한다.
- 이미지에는 `alt`를 제공한다.
- 검색창에는 `aria-label="Search guitar chords"`를 제공한다.
- 현재 선택된 quality에는 `aria-pressed`를 제공한다.
- 색상만으로 상태를 구분하지 말고 active ring, scale, 텍스트도 함께 바꾼다.
- ESC 키로 detail view를 닫을 수 있게 한다.

---

## 11. 반응형 디자인 요구사항

### Desktop

- 최대 컨테이너 너비: 1180px
- quality bubble: 120~132px
- grid: 4~5열
- detail: 중앙 큰 이미지 + 오른쪽 썸네일 rail

### Tablet

- quality bubble: 104~116px
- grid: 3열
- detail: 큰 이미지 위주, 썸네일은 오른쪽 또는 아래

### Mobile

- 상단 header는 세로로 조금 줄인다.
- quality bubble: 86~96px
- grid: 2열
- detail: 큰 이미지 + 아래 horizontal scroll thumbnails
- 검색창은 전체 너비에 가깝게 둔다.

---

## 12. 개발 시작용 통합 프롬프트

아래 프롬프트를 바이브코딩 도구에 그대로 붙여넣고 시작한다.

```md
너는 React, TypeScript, Vite, TailwindCSS에 능숙한 시니어 프론트엔드 개발자다.

내 목표는 기타 코드 뷰어 웹사이트를 만드는 것이다. 첨부 영상처럼 흰색 배경, 상단 검색창, 원형 기타 코드 종류 버튼, 코드 카드 그리드, 선택 코드 확대 뷰가 있는 웹앱을 구현해라.

기술 스택은 다음으로 고정한다.
- React
- TypeScript
- Vite
- TailwindCSS
- 필요 시 idb 패키지로 IndexedDB 저장
- 기본 이미지 파일은 public/chords 폴더에 저장

핵심 화면은 3단계다.
1. 코드 종류 선택 화면
   - Major, 7, minor, minor7, sus4, Major 7, 6, 7sus4, add2, m7(b5), diminish, Augment 원형 버튼을 보여준다.
   - 버튼은 흰색 내부, 파스텔 색상 외곽선, 둥근 그림자, hover 확대 효과가 있어야 한다.
2. 코드 목록 화면
   - Major를 클릭하면 C Major, D Major, E Major, F Major, G Major, A Major, B Major 카드가 보인다.
   - 각 카드는 작은 기타 코드 다이어그램 이미지와 초록색 점선 라벨을 가진다.
   - 지금은 Major 7개를 MVP로 완성하고, 다른 quality는 데이터 구조만 준비해라.
3. 코드 상세 화면
   - C Major 같은 카드를 클릭하면 중앙에 큰 제목과 큰 코드 이미지가 나타난다.
   - 오른쪽에는 같은 quality의 다른 코드 썸네일 목록이 보이게 해라.
   - 뒤로가기/닫기 버튼이 있어야 한다.

반드시 구현할 파일 구조는 다음과 같다.
- src/components/AppHeader.tsx
- src/components/QualityBubble.tsx
- src/components/QualitySelector.tsx
- src/components/ChordCard.tsx
- src/components/ChordGrid.tsx
- src/components/ChordDetail.tsx
- src/components/ChordImage.tsx
- src/components/ChordImageUploader.tsx
- src/data/chordTypes.ts
- src/data/chordQualities.ts
- src/data/chords.ts
- src/hooks/useChordSearch.ts
- src/hooks/useIndexedChordImages.ts
- src/lib/chordImageStorage.ts
- src/lib/slug.ts
- src/App.tsx

기타 코드 이미지 저장 방식은 다음처럼 구현해라.
1. 기본 코드 이미지는 public/chords/{quality}/{root}.svg에 저장한다.
   예: public/chords/major/c.svg
2. src/data/chords.ts에서는 imageSrc를 /chords/major/c.svg처럼 참조한다.
3. public/chords/manifest.json도 생성해서 코드 이미지 목록을 JSON으로 관리할 수 있게 해라.
4. 업로드 기능은 IndexedDB를 사용해서 브라우저 안에 이미지 Blob을 저장해라.
5. 브라우저가 배포된 public 폴더에 직접 파일을 쓸 수 없다는 점을 코드 주석과 README에 설명해라.
6. 운영 확장 시 Supabase Storage 같은 object storage로 바꿀 수 있게 저장 로직을 lib/chordImageStorage.ts에 격리해라.

디자인 요구사항:
- 전체 배경은 white 또는 #fbfbfb
- 상단 검색창 border는 연한 pink
- Lesson Designer 텍스트는 letter-spacing이 넓고 연한 pink
- Major 버튼은 orange border, 7은 yellow, minor는 lime, minor7은 emerald, sus4는 cyan, Major7은 sky, 6은 navy, 7sus4는 violet, add2는 rose, m7(b5)는 fuchsia, diminish는 purple, Augment는 amber/brown
- 그림자와 inset shadow를 사용해서 영상처럼 버튼이 살짝 떠 있는 느낌을 만든다.
- 모든 전환에 부드러운 transition을 넣는다.

기능 요구사항:
- 검색창에서 C, Major, open chord 같은 검색어로 필터링한다.
- quality 선택 상태와 selected chord 상태를 React state로 관리한다.
- ESC 키로 상세 화면을 닫는다.
- 모바일 반응형 레이아웃을 구현한다.
- 이미지가 없을 때는 placeholder SVG를 보여준다.
- 업로드 파일은 SVG, PNG, WebP만 허용하고 2MB 이하로 제한한다.

개발 방식:
- 먼저 프로젝트를 생성하고 Tailwind를 설정해라.
- 그 다음 타입과 데이터 파일을 만든다.
- 그 다음 UI 컴포넌트를 하나씩 만든다.
- 그 다음 App.tsx에서 상태와 화면 전환을 연결한다.
- 그 다음 정적 SVG placeholder 코드 이미지들을 만들어 public/chords/major에 넣어라.
- 그 다음 IndexedDB 기반 업로드 기능을 만든다.
- 마지막으로 README에 실행 방법, 이미지 저장 방식, 운영 확장 방법을 문서화해라.

완성 기준:
- npm install 후 npm run dev로 실행된다.
- 첫 화면에서 원형 quality 버튼 12개가 보인다.
- Major 클릭 시 7개 Major chord 카드가 보인다.
- C Major 클릭 시 큰 상세 이미지가 보인다.
- 검색 필터가 동작한다.
- public/chords에 기본 SVG 이미지가 들어 있다.
- IndexedDB 업로드 코드가 있고 UI에서 테스트 가능하다.
- TypeScript 에러가 없어야 한다.
```

---

## 13. 단계별 바이브코딩 프롬프트

아래는 한 번에 전부 시키지 않고 단계별로 진행할 때 쓰는 프롬프트다.

### Step 1. 프로젝트 스캐폴딩

```md
React + TypeScript + Vite + TailwindCSS 프로젝트를 생성해라.
프로젝트 이름은 guitar-chord-viewer로 한다.
불필요한 기본 예제 코드를 제거하고 다음 구조를 만들어라.

src/components
src/data
src/hooks
src/lib
src/styles
public/chords
public/chords/major
public/chords/placeholders

TailwindCSS가 App.tsx에서 정상 동작하도록 설정하고, 기본 배경은 #fbfbfb로 해라.
README에는 실행 방법을 간단히 적어라.
```

### Step 2. 타입과 기본 데이터 만들기

```md
src/data/chordTypes.ts, src/data/chordQualities.ts, src/data/chords.ts를 만들어라.

요구사항:
- ChordQualityId union type을 정의한다.
- ChordItem type을 정의한다.
- quality 12개를 영상에 보이는 순서로 정의한다.
- Major 코드 7개 C, D, E, F, G, A, B를 ChordItem 배열로 정의한다.
- imageSrc는 /chords/major/c.svg 형식으로 지정한다.
- difficulty와 tags도 넣는다.
- 다른 quality는 아직 chord item이 없어도 된다.

타입 안정성을 우선하고 any는 사용하지 마라.
```

### Step 3. 기본 SVG 코드 이미지 만들기

```md
public/chords/major 폴더에 c.svg, d.svg, e.svg, f.svg, g.svg, a.svg, b.svg를 만들어라.

요구사항:
- 실제 고급 코드 다이어그램이 아니어도 MVP에서는 직접 만든 간단한 SVG placeholder로 충분하다.
- 각 SVG에는 기타 줄 6개, 프렛 5개, 검은색 운지 점, 손가락 번호 라벨, 코드명 텍스트가 들어가야 한다.
- C Major, D Major 등 파일마다 제목 텍스트가 다르게 표시되어야 한다.
- public/chords/placeholders/chord-placeholder.svg도 만들어라.
- public/chords/manifest.json에 7개 Major 코드의 id, title, imageSrc를 기록해라.

외부 이미지나 영상 속 이미지를 복사하지 말고 직접 그린 SVG를 생성해라.
```

### Step 4. Header와 검색창 만들기

```md
AppHeader 컴포넌트를 만들어라.

props:
- searchTerm: string
- onSearchChange: (value: string) => void

UI:
- 왼쪽에 돋보기 아이콘을 텍스트 또는 inline SVG로 표시한다.
- 가운데에 rounded-full 검색 input을 표시한다.
- 오른쪽에 Lesson Designer 텍스트를 표시한다.
- 검색창 border는 연한 핑크색, focus ring도 연한 핑크색으로 한다.
- 모바일에서도 깨지지 않게 flex-wrap 또는 responsive class를 넣어라.

접근성:
- input에 aria-label을 넣어라.
```

### Step 5. 원형 코드 종류 버튼 만들기

```md
QualityBubble과 QualitySelector 컴포넌트를 만들어라.

QualityBubble props:
- quality: ChordQuality
- active: boolean
- onClick: () => void

디자인:
- 완전한 원형 버튼
- 흰색 배경
- quality별 색상 border
- 내부 inset shadow와 외부 drop shadow
- hover 시 scale up
- active 시 더 큰 scale과 ring 효과
- label은 가운데 정렬

QualitySelector:
- chordQualities 배열을 받아 12개 버튼을 표시한다.
- desktop에서는 6개씩 2줄 느낌으로 배치한다.
- mobile에서는 wrap되게 한다.
- 선택된 quality는 active 상태로 표시한다.
```

### Step 6. 코드 카드 그리드 만들기

```md
ChordImage, ChordCard, ChordGrid 컴포넌트를 만들어라.

ChordImage:
- src와 title을 받아 img를 표시한다.
- 로딩 실패 시 placeholder 이미지로 대체한다.

ChordCard:
- chord item을 받아 라벨과 썸네일 이미지를 표시한다.
- 라벨은 초록색 점선 border와 흰색 배경으로 만든다.
- hover 시 살짝 확대한다.
- button으로 구현하거나 keyboard 접근성을 보장한다.

ChordGrid:
- chords 배열, selectedQuality, searchTerm을 받아 필터링된 카드 목록을 표시한다.
- 카드가 없으면 EmptyState를 표시한다.
- grid는 desktop 4열, tablet 3열, mobile 2열로 한다.
```

### Step 7. 상세 화면 만들기

```md
ChordDetail 컴포넌트를 만들어라.

props:
- chord: ChordItem
- relatedChords: ChordItem[]
- onSelectChord: (id: string) => void
- onBack: () => void

UI:
- 중앙 상단에 큰 제목 박스: 예: C Major
- 제목 텍스트는 초록색, border는 주황색 느낌
- 중앙에 큰 chord image
- 오른쪽에 relatedChords 썸네일 목록
- 각 썸네일 클릭 시 selected chord 변경
- 뒤로가기 버튼 제공

반응형:
- desktop에서는 오른쪽 rail
- mobile에서는 아래쪽 horizontal scroll

동작:
- ESC 키를 누르면 onBack 실행
```

### Step 8. App.tsx에서 전체 화면 연결

```md
App.tsx에서 전체 상태를 연결해라.

상태:
- searchTerm
- selectedQuality
- selectedChordId
- uploadedChords

동작:
- 처음에는 QualitySelector만 강조해서 보이게 한다.
- quality 버튼 클릭 시 selectedQuality를 설정하고 ChordGrid를 보여준다.
- chord card 클릭 시 selectedChordId를 설정하고 ChordDetail을 보여준다.
- Header 검색은 항상 보인다.
- 검색어가 있으면 selectedQuality가 없어도 모든 chord에서 검색 결과를 보여줘도 된다.
- Back 버튼으로 detail -> grid, grid -> qualities 흐름을 만든다.

레이아웃:
- max-width 1180px container
- 상단 header 아래 충분한 여백
- 부드러운 fade/slide transition class 적용
```

### Step 9. IndexedDB 이미지 업로드 기능 만들기

```md
idb 패키지를 사용해서 브라우저 내부에 chord image를 저장하는 기능을 만들어라.

파일:
- src/lib/chordImageStorage.ts
- src/hooks/useIndexedChordImages.ts
- src/components/ChordImageUploader.tsx

요구사항:
- IndexedDB database 이름: guitar-chord-viewer
- object store 이름: chord-images
- 업로드 항목에는 id, chordId, root, quality, title, fileName, mimeType, blob, createdAt, updatedAt을 저장한다.
- 파일 형식은 image/svg+xml, image/png, image/webp만 허용한다.
- 파일 크기는 2MB 이하만 허용한다.
- 저장된 Blob은 URL.createObjectURL로 미리보기한다.
- 업로드 후 앱 chord 목록에 추가한다.
- 새로고침 후에도 IndexedDB에서 업로드된 이미지를 다시 로드한다.
- 삭제 기능도 구현한다.

중요:
브라우저는 배포된 public/chords 폴더에 직접 파일을 저장할 수 없다는 설명을 README와 코드 주석에 포함해라.
```

### Step 10. 디자인 polish와 애니메이션

```md
영상과 비슷한 느낌이 나도록 디자인을 다듬어라.

수정할 것:
- 원형 버튼의 크기, 그림자, 색상을 영상처럼 부드럽게 조정한다.
- 카드 라벨에 초록색 dotted border를 넣는다.
- 큰 상세 제목은 초록색 텍스트 + 주황색 테두리 박스로 만든다.
- 카드와 버튼에 hover, focus, active 상태를 명확히 넣는다.
- 화면 전환 시 opacity와 translateY transition을 넣는다.
- 전체적으로 여백을 넓게 사용하고 밝은 느낌을 유지한다.

접근성:
- focus-visible ring을 모든 버튼에 넣는다.
- 이미지 alt를 점검한다.
- aria-pressed, aria-label을 점검한다.
```

### Step 11. README 문서화

```md
README.md를 자세히 작성해라.

포함할 내용:
- 프로젝트 소개
- 실행 방법
- 폴더 구조
- 기본 chord image 추가 방법
- public/chords/{quality}/{root}.svg 파일명 규칙
- manifest.json 수정 방법
- IndexedDB 업로드 기능 설명
- IndexedDB 저장 한계
- 운영 배포에서 Supabase Storage 등으로 확장하는 방법
- 향후 할 일

README의 이미지 저장 섹션에는 다음 문장을 반드시 포함해라.
"정적 배포된 웹사이트의 public 폴더는 브라우저에서 직접 수정할 수 없다. 기본 이미지는 개발자가 프로젝트에 포함해서 배포하고, 사용자 업로드 이미지는 IndexedDB 또는 서버 스토리지에 저장해야 한다."
```

---

## 14. 코드 이미지 자체를 만드는 SVG 프롬프트

코드 이미지 파일을 별도로 AI에게 만들게 할 때는 아래 프롬프트를 사용한다.

```md
public/chords/major/c.svg 파일을 직접 작성해라.

스타일:
- 흰색 배경 또는 투명 배경
- 가로형 기타 코드 다이어그램
- 6개 줄은 연한 붉은색 horizontal line으로 그린다.
- 5개 프렛은 연한 초록색 vertical line으로 그린다.
- 왼쪽에는 nut 또는 시작 프렛 선을 진하게 표시한다.
- 운지점은 검은색 원으로 표시한다.
- 손가락은 흰색 둥근 캡슐 형태로 표시하고, 내부에 finger number를 작게 넣는다.
- 아래에는 1프렛, 2프렛, 3프렛 같은 작은 초록색 라벨을 넣는다.
- 왼쪽 상단에는 C 텍스트를 넣는다.
- 전체 이미지는 520x320 viewBox 안에 들어오게 해라.
- 외부 이미지나 base64를 사용하지 말고 순수 SVG element만 사용해라.

동일한 스타일로 d.svg, e.svg, f.svg, g.svg, a.svg, b.svg도 만들어라.
각 파일의 코드명과 운지점은 해당 코드에 맞게 다르게 해라.
```

---

## 15. 향후 확장 아이디어

MVP 이후 다음 기능을 추가할 수 있다.

1. 코드 루트 전체 확장
   - C, C#, Db, D, D#, Eb, E, F, F#, Gb, G, G#, Ab, A, A#, Bb, B
2. 코드 종류 전체 확장
   - Major, minor, 7, major7, minor7, sus2, sus4, add9, dim, aug 등
3. 난이도 필터
   - beginner, intermediate, advanced
4. 즐겨찾기
   - localStorage에 favorite chord id 저장
5. 코드 진행 만들기
   - 사용자가 C - G - Am - F 같은 progression을 만들고 저장
6. 이미지 대신 SVG 컴포넌트 렌더링
   - chord shape data만 저장하고 React SVG로 실시간 렌더링
7. 인쇄용 코드 차트 PDF 출력
8. 다크모드
9. 한글/영문 전환
10. 관리자 페이지와 서버 저장소 연동

---

## 16. 완료 체크리스트

개발이 끝나면 아래 항목을 확인한다.

### 기능

- [ ] 첫 화면에 quality bubble 12개가 보인다.
- [ ] Major 클릭 시 Major 코드 7개가 보인다.
- [ ] C Major 클릭 시 상세 화면이 열린다.
- [ ] 상세 화면에서 다른 코드 썸네일을 클릭하면 코드가 바뀐다.
- [ ] 뒤로가기 버튼이 동작한다.
- [ ] ESC 키로 상세 화면을 닫을 수 있다.
- [ ] 검색어로 코드가 필터링된다.
- [ ] 이미지 로딩 실패 시 placeholder가 표시된다.
- [ ] 업로드 기능이 IndexedDB에 이미지를 저장한다.
- [ ] 새로고침 후 업로드 이미지가 유지된다.
- [ ] 업로드 이미지 삭제가 가능하다.

### 디자인

- [ ] 원형 버튼이 영상처럼 둥글고 부드러운 그림자를 가진다.
- [ ] 코드 카드 라벨이 초록색 점선 border 느낌이다.
- [ ] 상세 제목이 초록색 텍스트 + 주황색 border 느낌이다.
- [ ] 전체 배경과 여백이 밝고 넓게 느껴진다.
- [ ] 모바일에서도 레이아웃이 깨지지 않는다.

### 코드 품질

- [ ] TypeScript `any` 사용이 없다.
- [ ] 컴포넌트가 역할별로 분리되어 있다.
- [ ] 이미지 저장 로직이 `src/lib/chordImageStorage.ts`에 격리되어 있다.
- [ ] 데이터 타입이 `src/data/chordTypes.ts`에 정리되어 있다.
- [ ] README에 이미지 저장 방식과 한계가 설명되어 있다.
- [ ] `npm run build`가 성공한다.

---

## 17. 운영 배포 전 주의사항

- 영상 속 UI는 참고용으로만 사용하고, 이미지나 로고는 직접 제작한다.
- 무료 이미지나 외부 chord diagram을 그대로 복사하지 말고 직접 SVG를 만들거나 라이선스가 명확한 자산만 사용한다.
- 정적 배포만 할 경우 업로드 이미지는 모든 사용자에게 공유되지 않는다.
- 사용자 업로드를 공유하려면 반드시 서버/API/object storage가 필요하다.
- 코드 이미지가 많아질수록 PNG보다 SVG 또는 WebP를 우선한다.
- 검색 성능은 코드 수가 수백 개 수준이면 클라이언트 필터링으로 충분하다.
- 수천 개 이상으로 늘어나면 인덱싱 또는 서버 검색을 고려한다.

---

## 18. 최종 요청 프롬프트 요약본

빠르게 시작하고 싶을 때는 아래 짧은 버전을 사용한다.

```md
첨부 영상과 비슷한 기타 코드 뷰어 웹사이트를 React + TypeScript + Vite + TailwindCSS로 만들어줘.

구현해야 할 화면:
1. 상단 검색창 + Lesson Designer 텍스트
2. Major, 7, minor, minor7, sus4, Major 7, 6, 7sus4, add2, m7(b5), diminish, Augment 원형 버튼 선택 화면
3. Major 클릭 시 C Major, D Major, E Major, F Major, G Major, A Major, B Major 카드 그리드
4. 코드 카드 클릭 시 중앙 큰 코드 이미지와 오른쪽 관련 코드 썸네일을 보여주는 상세 화면

기타 코드 이미지는 public/chords/{quality}/{root}.svg에 저장하고, src/data/chords.ts에서 imageSrc로 참조해.
예: public/chords/major/c.svg -> imageSrc: /chords/major/c.svg
public/chords/manifest.json도 만들어줘.

업로드 기능은 IndexedDB에 이미지 Blob을 저장하는 방식으로 구현해.
브라우저는 배포된 public 폴더에 직접 파일을 쓸 수 없으므로, 기본 이미지는 프로젝트에 포함하고, 사용자 업로드 이미지는 IndexedDB 또는 Supabase Storage 같은 서버 저장소를 써야 한다는 설명을 README에 넣어줘.

영상 느낌을 살려서 흰색 배경, 파스텔 원형 버튼, 부드러운 그림자, 초록색 점선 라벨, 상세 화면 확대 애니메이션을 구현해.
반응형, 접근성, TypeScript 타입 안정성, npm run build 성공까지 완료해.
```
