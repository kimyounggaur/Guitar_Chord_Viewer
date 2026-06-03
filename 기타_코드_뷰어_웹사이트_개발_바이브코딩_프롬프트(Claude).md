# 🎸 기타 코드 뷰어 웹사이트 — 바이브 코딩 프롬프트

> **사용법**
> 이 문서는 Cursor · Claude · v0 · Lovable · Bolt 같은 AI 코딩 도구에 그대로 붙여넣어 쓰는 "설계 명세 겸 프롬프트"입니다.
> 한 번에 전체를 주거나, **Phase 단위로 잘라서** 단계적으로 시키면 결과물 품질이 더 좋습니다.
> 처음 시작할 때는 → 아래 **§1 마스터 프롬프트**를 먼저 붙여넣고, 그다음 **§7 Phase 0 → Phase 7** 순서로 진행하세요.

---

## 📋 목차

1. [프로젝트 한 줄 요약 (마스터 프롬프트)](#1-프로젝트-한-줄-요약-마스터-프롬프트)
2. [기술 스택](#2-기술-스택)
3. [화면 구성 & 사용자 흐름](#3-화면-구성--사용자-흐름)
4. [디자인 명세](#4-디자인-명세)
5. [데이터 구조](#5-데이터-구조)
6. [⭐ 기타 코드 이미지 저장 방법 (핵심)](#6--기타-코드-이미지-저장-방법-핵심)
7. [단계별 개발 (Phase 0~7)](#7-단계별-개발-phase-07)
8. [완성 체크리스트](#8-완성-체크리스트)
9. [부록: 표준 코드 운지 데이터](#9-부록-표준-코드-운지-데이터)

---

## 1. 프로젝트 한 줄 요약 (마스터 프롬프트)

> 아래 블록을 그대로 복사해서 AI 코딩 도구의 첫 메시지로 붙여넣으세요.

```text
기타 코드(코드 다이어그램) 뷰어 웹사이트를 만들어줘.

[핵심 컨셉]
- 기타를 배우는 사람이 코드 운지법을 보기 좋게 모아둔 레퍼런스 사이트야.
- 사용 흐름: ① 메인 화면에서 "코드 종류"를 고른다 (Major, 7, minor, minor7, sus4 등)
            ② 고른 종류에 해당하는 코드들의 운지 다이어그램이 갤러리로 펼쳐진다 (C, D, E, G, A …)
            ③ 특정 코드를 누르면 크게 확대된 운지 다이어그램을 본다.
- 코드 운지는 "가로로 누운 프렛보드 다이어그램"으로 보여준다.

[디자인 톤]
- 흰색 배경 + 부드러운 그림자(뉴모피즘) 스타일.
- 코드 종류 버튼은 색깔 있는 동그란 링(circle) 버튼이고 색이 알록달록하다.
- 상단에 검색바와 "Lesson Designer" 로고가 있다.

[중요 요구사항]
- 코드 다이어그램 "이미지"를 사이트 안에 저장하고 불러오는 구조를 반드시 포함해줘.
  (정적 파일 + JSON 매니페스트 방식을 기본으로, 나중에 이미지를 추가/교체하기 쉽게 만들 것)

[기술 스택]
- React + Vite + Tailwind CSS. (또는 순수 HTML/CSS/JS도 가능)
- 백엔드 없이 정적 사이트로도 동작해야 함 (Vercel/Netlify/GitHub Pages 배포 가능).

먼저 폴더 구조와 전체 컴포넌트 설계부터 제안하고, 내가 확인하면 단계적으로 구현해줘.
```

---

## 2. 기술 스택

| 항목 | 권장 | 이유 / 대안 |
|------|------|-------------|
| 프레임워크 | **React 18 + Vite** | 컴포넌트(코드 카드, 프렛보드)로 쪼개기 좋음. 대안: 순수 HTML/CSS/JS (의존성 0) |
| 스타일 | **Tailwind CSS** | 뉴모피즘 그림자·색상 빠르게 적용. 대안: 일반 CSS / CSS Modules |
| 아이콘 | **lucide-react** | 검색 돋보기 아이콘 등 |
| 라우팅 | 화면 전환만 필요 → **useState로 충분** | 규모 커지면 react-router 추가 |
| 이미지 저장 | **정적 파일 + `chords.json` 매니페스트** | §6 참고. (선택) IndexedDB / Supabase Storage |
| 배포 | Vercel / Netlify / GitHub Pages | 정적 사이트라 무료 호스팅 가능 |

> 💡 **AI에게 지시할 때 톤**: "외부 라이브러리는 최소화하고, 백엔드 없이도 동작하도록 만들어줘. 추후 코드 이미지를 추가하기 쉬운 데이터 구조를 우선시해줘."

---

## 3. 화면 구성 & 사용자 흐름

```
[화면 A: 메인]  ──(코드 종류 클릭)──▶  [화면 B: 코드 갤러리]  ──(개별 코드 클릭)──▶  [화면 C: 코드 상세]
      ▲                                          │                                        │
      └──────────────── (뒤로 / 로고 클릭) ◀──────┴────────────────────────────────────────┘
```

### 3.1 화면 A — 메인 (코드 종류 선택)
- 상단 헤더: 왼쪽에 **검색 돋보기 아이콘 + 길쭉한 둥근 검색 입력창**, 오른쪽에 **"Lesson Designer"** 로고 텍스트.
- 본문: **코드 종류 12개**를 **2행 × 6열 그리드**의 동그란 링 버튼으로 배치.
  - 1행: `Major` · `7` · `minor` · `minor7` · `sus4` · `Major 7`
  - 2행: `6` · `7sus4` · `add2` · `m7(b5)` · `diminsh` · `Augment`
- 버튼에 마우스를 올리거나 클릭하면 **부드럽게 살짝 커지는** 애니메이션.

### 3.2 화면 B — 코드 갤러리
- 선택한 종류(예: "Major")에 속한 코드들의 다이어그램을 **카드 그리드**로 표시.
  - 예) `C Major`, `D Major`, `E Major`, `G Major`, `A Major` …
- **현재 선택된(또는 첫 번째) 코드 1개는 크게 강조**(테두리 박스), 나머지는 작게.
- 각 카드 = 코드명 라벨 + 프렛보드 다이어그램(이미지 또는 SVG).
- 카드를 클릭하면 화면 C로 이동(또는 그 카드가 큰 자리로 올라옴).

### 3.3 화면 C — 코드 상세
- 상단 중앙에 **코드명 제목 박스** (예: "C Major" — 색 텍스트 + 색 테두리).
- 그 아래 **크게 확대된 프렛보드 다이어그램** 하나.
- 좌상단에 루트 라벨(예: `|C`).

---

## 4. 디자인 명세

### 4.1 전체 톤
- 배경: 거의 흰색(`#FFFFFF` ~ `#FAFAFA`).
- 스타일: **뉴모피즘** — 밝은 배경에 위쪽 하이라이트 + 아래쪽 부드러운 그림자.
  - 예시 그림자: `box-shadow: 6px 6px 14px rgba(0,0,0,0.08), -6px -6px 14px rgba(255,255,255,0.9);`
- 폰트: 둥글고 친근한 산세리프 (예: `Nunito`, `Poppins`, 한글은 `Pretendard` / `Noto Sans KR`).

### 4.2 헤더
- 왼쪽: 돋보기 아이콘(연한 핑크) + **둥근 모서리(pill) 검색 입력창**, 테두리 연한 핑크.
- 오른쪽: **"Lesson Designer"** — 연한 핑크 색, 글자 간격(letter-spacing) 넉넉하게.

### 4.3 코드 종류 버튼 (색상표)
각 버튼은 **속이 빈 색 링(원 테두리) + 가운데 색 글자 + 뉴모피즘 그림자** 형태입니다.

| # | 라벨 | 링/글자 톤 | 참고 Hex (조정 가능) |
|---|------|-----------|----------------------|
| 1 | `Major` | 주황 | 링 `#F57C00`, 글자 `#C0392B` |
| 2 | `7` | 노랑 | `#FFC400` |
| 3 | `minor` | 연두 | `#AEEA00` |
| 4 | `minor7` | 초록 | `#00C853` |
| 5 | `sus4` | 하늘(시안) | `#00E5FF` |
| 6 | `Major 7` | 파랑 | `#2196F3` |
| 7 | `6` | 남색 | `#0D2C6E` |
| 8 | `7sus4` | 연보라 | `#B39DDB` |
| 9 | `add2` | 연분홍(흐림) | `#F8BBD0` |
| 10 | `m7(b5)` | 분홍 | `#F06292` |
| 11 | `diminsh` | 보라 | `#9C27B0` |
| 12 | `Augment` | 황금 | 링 `#B8860B`, 글자 `#C0392B` |

> 라벨 철자는 영상 그대로(`diminsh`, `Augment`) 표기합니다. 정식 명칭(`diminished`, `augmented`)으로 바꾸고 싶으면 그렇게 지시하세요.

### 4.4 코드 다이어그램 (프렛보드)
**가장 핵심적인 시각 요소.** "가로로 누운" 프렛보드입니다.

- **방향**: 줄(string)이 **수평**으로 놓임.
- **줄(string)**: 6개의 가로선, 위에서부터 `1번줄`(가장 가는 줄) → `6번줄`(가장 굵은 줄). 색은 **빨강/크림슨**. 오른쪽 끝에 `1번줄`~`6번줄` 라벨.
- **프렛(fret)**: 세로 **초록선**. 하단에 `1프렛` · `2프렛` · `3프렛` **초록 알약(pill) 라벨**.
- **너트(nut)**: 맨 왼쪽에 **두꺼운 회색 세로 막대**.
- **루트 라벨**: 좌상단에 코드 루트(예: `|C`), 파란색.
- **운지(finger) 표시**: **흰색 둥근 사각형(손가락 모양)** + 누르는 지점에 **검은 점**, 손가락 위에 사선 빗금 텍스처.
- **제목 박스**(상세 화면): 코드명(예: "C Major")을 **색 텍스트 + 같은 색 테두리 박스**로.

> 이 다이어그램은 ① **미리 만든 이미지(PNG/WebP/SVG)** 를 불러오거나, ② **데이터로부터 SVG를 그려서** 표시할 수 있습니다. → §6 참고.

### 4.5 애니메이션
- 코드 버튼 hover/클릭 시 `transform: scale(1.15)`, `transition: 0.25s ease`.
- 화면 전환 시 fade/slide (`opacity` + `translateY`) 0.3초.
- 갤러리 카드가 "큰 자리"로 올라올 때 부드럽게 확대.

---

## 5. 데이터 구조

모든 코드를 **단일 JSON**으로 관리하면 이미지 추가·수정이 쉽습니다.

`src/data/chords.json` (예시):

```json
{
  "types": [
    { "id": "major",   "label": "Major",   "color": "#F57C00", "textColor": "#C0392B" },
    { "id": "7",       "label": "7",       "color": "#FFC400" },
    { "id": "minor",   "label": "minor",   "color": "#AEEA00" },
    { "id": "minor7",  "label": "minor7",  "color": "#00C853" },
    { "id": "sus4",    "label": "sus4",    "color": "#00E5FF" },
    { "id": "major7",  "label": "Major 7", "color": "#2196F3" },
    { "id": "6",       "label": "6",       "color": "#0D2C6E" },
    { "id": "7sus4",   "label": "7sus4",   "color": "#B39DDB" },
    { "id": "add2",    "label": "add2",    "color": "#F8BBD0" },
    { "id": "m7b5",    "label": "m7(b5)",  "color": "#F06292" },
    { "id": "dim",     "label": "diminsh", "color": "#9C27B0" },
    { "id": "aug",     "label": "Augment", "color": "#B8860B", "textColor": "#C0392B" }
  ],
  "chords": [
    {
      "id": "C_major",
      "type": "major",
      "root": "C",
      "displayName": "C Major",
      "image": "/chords/major/C.png",

      "frets":   [0, 1, 0, 2, 3, -1],
      "fingers": [0, 1, 0, 2, 3, 0],
      "baseFret": 1
    },
    {
      "id": "D_major",
      "type": "major",
      "root": "D",
      "displayName": "D Major",
      "image": "/chords/major/D.png",
      "frets":   [2, 3, 2, 0, -1, -1],
      "fingers": [2, 3, 1, 0, 0, 0],
      "baseFret": 1
    }
  ]
}
```

**필드 규칙 (AI에게 명확히 전달할 것):**
- `image` : 다이어그램 이미지 경로(정적 파일 방식). 이미지가 없으면 `frets`/`fingers`로 SVG 렌더.
- `frets` / `fingers` : 배열의 **인덱스 0 = 1번줄(가는 줄), 인덱스 5 = 6번줄(굵은 줄)** 순서.
  - `0` = 개방현(open), `-1` = 안 침(muted/x), 숫자 N = N번 프렛을 누름.
- `baseFret` : 다이어그램이 시작하는 프렛(보통 1).

> ⚠️ 줄 순서 컨벤션을 **반드시 한 가지로 고정**하라고 AI에게 강조하세요. 안 그러면 운지가 좌우/상하로 뒤집힙니다.

---

## 6. ⭐ 기타 코드 이미지 저장 방법 (핵심)

> 사용자가 가장 중요하게 요청한 부분입니다. 상황에 따라 4가지 방법이 있고, **기본은 6.2(정적 파일 + JSON)** 입니다.

### 6.1 방법 비교표

| 방법 | 이미지를 어디에 두나 | 백엔드 | 이미지 추가 방법 | 적합한 경우 |
|------|----------------------|--------|------------------|-------------|
| **A. 정적 파일 + JSON** ⭐기본 | `public/chords/...` 폴더 | ❌ 불필요 | 파일 넣고 `chords.json` 수정 후 재배포 | 코드 이미지가 **정해져 있고** 내가 직접 관리 |
| **B. SVG 동적 생성** | 저장 안 함(데이터로 그림) | ❌ 불필요 | `chords.json`에 운지 데이터만 추가 | 이미지 파일 관리가 귀찮을 때, 무한 확대·재색칠 필요 |
| **C. 브라우저 저장(IndexedDB)** | 사용자 브라우저 내부 | ❌ 불필요 | 사이트의 업로드 UI로 추가 | **재배포 없이** 브라우저에서 직접 추가/보관 |
| **D. 클라우드 저장(Supabase Storage 등)** | 클라우드 버킷 | ✅ 필요 | 관리자 업로드 → 모든 사용자에게 반영 | 여러 사용자가 공유, 관리자 업로드 기능 |

---

### 6.2 [권장·기본] 정적 파일 + JSON 매니페스트

**폴더 구조**
```
project/
├─ public/
│  └─ chords/
│     ├─ major/   C.png  D.png  E.png  G.png  A.png ...
│     ├─ minor/   C.png  D.png  ...
│     ├─ 7/       C.png  ...
│     └─ ...
├─ src/
│  ├─ data/chords.json      ← 코드 ↔ 이미지 경로 매핑
│  ├─ components/
│  │  ├─ Header.jsx
│  │  ├─ ChordTypeGrid.jsx
│  │  ├─ ChordGallery.jsx
│  │  ├─ ChordCard.jsx
│  │  └─ Fretboard.jsx       ← 이미지 표시 + (대안) SVG 렌더
│  └─ App.jsx
```

**파일명 규칙** (AI에게 고정시킬 것): `/chords/{type}/{root}.png`
예) C Major → `/chords/major/C.png`, F# minor → `/chords/minor/Fsharp.png` (`#`는 URL에서 문제가 되니 `sharp`로 치환).

**이미지 표시 컴포넌트 (React 예시)**
```jsx
function ChordCard({ chord }) {
  return (
    <figure className="chord-card">
      <figcaption>{chord.displayName}</figcaption>
      <img
        src={chord.image}
        alt={`${chord.displayName} 코드 운지`}
        loading="lazy"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    </figure>
  );
}
```

**장점**: 가장 단순, 빠름, Git으로 버전 관리, 무료 정적 호스팅 OK.
**단점**: 이미지를 바꾸려면 파일 교체 + 재배포 필요.

> 📌 이미지 권장 포맷: **WebP**(용량↓) 또는 **SVG**(무한 확대). 크기 통일(예: 480×360). 파일명은 위 규칙으로 일관되게.

---

### 6.3 [대안] SVG 동적 생성 — 이미지 파일이 아예 필요 없음

이미지를 저장하는 대신, **운지 데이터(`frets`/`fingers`)로 프렛보드를 그리는** 방법입니다. 영상 속 다이어그램(가로 프렛보드, 빨강 줄·초록 프렛·검은 점)은 SVG로 깔끔하게 재현됩니다.

`Fretboard.jsx` 의사코드:
```jsx
// props: frets=[0,1,0,2,3,-1], fingers=[...], baseFret=1, root="C"
// 1) 가로선 6개 (빨강) 그리기  → 1번줄(위) ~ 6번줄(아래)
// 2) 세로선(프렛) 그리기 (초록) + 하단 "1프렛/2프렛/3프렛" 라벨
// 3) 왼쪽 끝 너트(회색 두꺼운 막대) 그리기
// 4) frets 배열 순회: 값 N>0 이면 해당 줄·프렛 위치에 흰 손가락 + 검은 점
//    값 -1(x)이면 줄 왼쪽에 'x', 0이면 'o' 표시
// 5) 좌상단에 root 라벨(예 |C)
```

**장점**: 파일 관리 0, 용량 극소, 색·크기 자유, 코드 수백 개도 데이터만 추가하면 끝.
**단점**: 처음 컴포넌트 만드는 데 시간 듦.

> 💡 **하이브리드 추천**: `chord.image`가 있으면 이미지를, 없으면 SVG를 그리도록 `Fretboard`를 만들면 두 방식을 동시에 쓸 수 있습니다.

---

### 6.4 [대안] 브라우저 저장(IndexedDB) — 사용자가 직접 추가/보관

"사이트 안에 저장"을 **재배포 없이 브라우저에 영구 저장**으로 해석한 방식입니다. 이미지는 바이너리(Blob)라 `localStorage`(문자열·용량 작음)보다 **IndexedDB**가 적합합니다.

순수 JS 헬퍼(그대로 붙여넣어 쓰게 지시):
```javascript
// idb-chords.js  — IndexedDB에 코드 이미지(Blob) 저장/불러오기
const DB = "chordDB", STORE = "chordImages";

function openDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE); // key = chordId
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function saveChordImage(chordId, fileOrBlob) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(fileOrBlob, chordId);
    tx.oncomplete = () => res(true);
    tx.onerror = () => rej(tx.error);
  });
}

export async function getChordImageURL(chordId) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, "readonly").objectStore(STORE).get(chordId);
    req.onsuccess = () =>
      res(req.result ? URL.createObjectURL(req.result) : null); // <img src>에 사용
    req.onerror = () => rej(req.error);
  });
}
```
사용:
```javascript
// 업로드 input에서: await saveChordImage("C_major", file);
// 표시할 때:        img.src = await getChordImageURL("C_major");
```

**장점**: 백엔드 0, 용량 넉넉(수십~수백 MB), 새로고침해도 유지.
**단점**: **그 브라우저/기기에서만** 보임(다른 사람·다른 기기와 공유 안 됨), 캐시 지우면 사라짐.

---

### 6.5 [대안] 클라우드 저장(Supabase Storage) — 관리자 업로드·공유

여러 사용자가 공유하거나, 관리자가 업로드한 이미지를 모두가 보게 하려면 클라우드 스토리지를 씁니다. (Supabase / Firebase Storage / AWS S3 등)

Supabase 예시:
```javascript
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(URL, ANON_KEY);

// 업로드
await supabase.storage.from("chords")
  .upload(`major/C.png`, file, { upsert: true });

// 공개 URL 얻기 → <img src>
const { data } = supabase.storage.from("chords").getPublicUrl("major/C.png");
const imageUrl = data.publicUrl;
```
그리고 코드 메타데이터는 DB 테이블(`chords`)에 넣고, 위 `publicUrl`을 `image` 필드에 저장하면 §6.2 구조와 그대로 연결됩니다.

**장점**: 모든 기기·사용자 공유, 관리자 업로드 즉시 반영.
**단점**: 백엔드/계정 설정 필요, 무료 한도·보안 정책(버킷 public 여부) 고려.

> 🎯 **선택 가이드**
> - 코드가 정해져 있고 내가 관리 → **6.2 (정적 파일)**.
> - 파일 관리가 싫다 / 깔끔한 벡터 → **6.3 (SVG 생성)**.
> - 재배포 없이 내 브라우저에서 추가·보관 → **6.4 (IndexedDB)**.
> - 여러 사람이 공유·관리자 업로드 → **6.5 (클라우드)**.

---

## 7. 단계별 개발 (Phase 0~7)

> 각 Phase 블록을 **하나씩** AI에게 주세요. "이전 단계 결과 위에 이어서 작업해줘"라고 덧붙이면 좋습니다.

### Phase 0 — 프로젝트 셋업
```text
React + Vite + Tailwind CSS 프로젝트를 셋업해줘.
폴더 구조는 다음과 같이 만들어줘:
- public/chords/  (코드 이미지 폴더, 하위에 major/ minor/ 등)
- src/data/chords.json
- src/components/  (Header, ChordTypeGrid, ChordCard, ChordGallery, Fretboard)
- src/App.jsx
빈 컴포넌트와 빈 chords.json 골격까지 만들고, npm run dev 로 흰 화면이 뜨게 해줘.
한글 폰트(Pretendard 또는 Noto Sans KR)와 둥근 산세리프(Poppins)도 로드해줘.
```

### Phase 1 — 헤더 + 메인 코드 종류 그리드
```text
메인 화면을 만들어줘.
1) 상단 헤더: 왼쪽에 돋보기 아이콘(lucide-react) + 길쭉한 둥근 검색 입력창(연핑크 테두리),
   오른쪽에 "Lesson Designer" 텍스트(연핑크, 글자 간격 넓게).
2) 본문: 코드 종류 12개를 2행 6열 그리드로, '속이 빈 색 링 + 가운데 색 글자 + 뉴모피즘 그림자'의
   동그란 버튼으로 배치. 라벨/색은 §4.3 색상표대로.
3) 버튼 hover/클릭 시 scale(1.15)로 부드럽게 커지는 애니메이션(0.25s ease).
배경은 흰색, 전체적으로 부드러운 그림자의 뉴모피즘 톤으로.
```

### Phase 2 — 데이터 + 이미지 저장 구조
```text
§5 스키마대로 src/data/chords.json 을 채워줘. (types 12개 + Major 코드 C/D/E/G/A 예시 포함)
각 코드는 image 경로(/chords/major/C.png 형식)와 frets/fingers/baseFret를 가진다.
Fretboard.jsx 컴포넌트를 만들되:
- chord.image 가 있으면 <img>로 표시,
- 없으면 frets/fingers 데이터로 SVG 프렛보드를 그린다(하이브리드).
이미지 파일명 규칙은 /chords/{type}/{root}.png 로 고정하고, '#'는 'sharp'로 치환해줘.
```

### Phase 3 — 코드 갤러리 화면
```text
메인에서 코드 종류(예: Major) 버튼을 클릭하면 화면 B(갤러리)로 전환되게 해줘.
- chords.json에서 해당 type의 코드들을 필터링해 카드 그리드로 표시.
- 각 카드 = 코드명 라벨(예 "C Major") + Fretboard.
- 첫 번째(또는 선택된) 코드 1개는 크게 강조(색 테두리 박스), 나머지는 작게.
- 화면 전환은 fade+slide 애니메이션(0.3s).
- 헤더의 로고를 누르면 메인으로 돌아온다.
```

### Phase 4 — 코드 상세 / 프렛보드 확대
```text
갤러리에서 개별 코드 카드를 클릭하면 화면 C(상세)로 가게 해줘.
- 상단 중앙에 코드명 제목 박스(색 텍스트 + 같은 색 테두리).
- 그 아래 크게 확대된 Fretboard 하나.
- 프렛보드 스펙: 가로 누운 형태, 줄 6개(빨강, 위=1번줄~아래=6번줄, 오른쪽에 'N번줄' 라벨),
  세로 프렛선(초록)과 하단 '1프렛/2프렛/3프렛' 초록 알약 라벨, 왼쪽 회색 너트,
  운지는 흰 둥근 손가락 + 검은 점, 좌상단 루트 라벨(|C).
- '뒤로' 버튼으로 갤러리로 복귀.
```

### Phase 5 — 검색
```text
헤더 검색창을 동작시켜줘.
- 코드명(C, Am, G7 등)이나 종류명(major, minor...)으로 검색하면
  일치하는 코드 카드들을 갤러리에 보여준다.
- 대소문자 무시, 부분 일치 허용.
```

### Phase 6 — (선택) 이미지 업로드/저장 기능
```text
코드 이미지를 사이트에서 직접 추가/교체하는 기능을 붙여줘.
- 방법은 §6.4의 IndexedDB 헬퍼(idb-chords.js)를 사용.
- 상세 화면에 '이미지 업로드' 버튼 → 파일 선택 시 해당 chordId로 IndexedDB에 저장.
- Fretboard는 표시 우선순위를 'IndexedDB 저장 이미지 > chord.image > SVG' 로.
(클라우드 공유가 필요하면 §6.5 Supabase Storage 방식으로 바꿔줘.)
```

### Phase 7 — 반응형 & 마무리
```text
모바일/태블릿 반응형으로 다듬어줘.
- 코드 종류 그리드: 데스크톱 6열 → 태블릿 4열 → 모바일 2열.
- 갤러리 카드도 화면폭에 맞게 자동 배치.
- 터치에서도 hover 대체 효과가 자연스럽게.
- 접근성: 모든 이미지 alt, 버튼 aria-label, 키보드 포커스 스타일.
마지막으로 README에 실행/배포(Vercel) 방법과 '코드 이미지 추가하는 법'을 정리해줘.
```

---

## 8. 완성 체크리스트

- [ ] 헤더에 검색창 + "Lesson Designer" 로고
- [ ] 코드 종류 12개 색 링 버튼 (2×6 그리드), hover 확대 애니메이션
- [ ] 종류 클릭 → 해당 코드 갤러리 표시
- [ ] 갤러리에서 1개 강조 + 나머지 작게
- [ ] 개별 코드 클릭 → 상세(확대 프렛보드)
- [ ] 프렛보드: 빨강 줄(1~6번줄 라벨) · 초록 프렛(1~3프렛 라벨) · 회색 너트 · 흰 손가락+검은 점 · 루트 라벨
- [ ] **코드 이미지 저장 구조** (정적 파일 + chords.json, 또는 SVG/IndexedDB/클라우드)
- [ ] 이미지 없을 때 SVG로 폴백(하이브리드)
- [ ] 검색 동작
- [ ] 반응형 + 접근성(alt/aria)
- [ ] README에 "코드 이미지 추가법" 안내

---

## 9. 부록: 표준 코드 운지 데이터

AI가 `chords.json`을 채울 때 참고할 **오픈 코드 운지표**입니다.
표기는 `6번줄(굵은)→1번줄(가는)` 순서의 흔한 기타 표기(예: x32010)이며,
**JSON에 넣을 때는 §5 규칙(인덱스 0=1번줄)에 맞춰 순서를 뒤집어** 저장하도록 지시하세요.

| 코드 | 운지 (6→1번줄) | 비고 |
|------|----------------|------|
| C Major | x32010 | 5번줄3, 4번줄2, 2번줄1 |
| D Major | xx0232 | |
| E Major | 022100 | |
| G Major | 320003 | |
| A Major | x02220 | |
| A minor | x02210 | |
| E minor | 022000 | |
| D minor | xx0231 | |
| G7 | 320001 | |
| C7 | x32310 | |
| Dm7 | xx0211 | |
| Em7 | 022030 | |

> AI에게: "위 표를 §5 스키마(인덱스 0=1번줄, 0=open, -1=muted) 형식의 `frets`/`fingers` 배열로 변환해서 chords.json에 넣어줘. 나머지 종류(sus4, 6, add2 등)도 표준 오픈 운지로 채워줘."

---

### 🔚 마지막 한마디 (AI에게)
> "전체 코드는 백엔드 없이 정적으로 동작하게 하고, 코드 이미지를 추가·교체하기 쉬운 데이터 구조(§5, §6)를 최우선으로 지켜줘. 영상 속 디자인 톤(흰 배경·뉴모피즘·알록달록 색 링·가로 프렛보드)을 충실히 재현해줘."
