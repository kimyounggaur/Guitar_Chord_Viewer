# Lesson Designer Guitar Chord Viewer

React, TypeScript, Vite, TailwindCSS로 만든 정적 기타 코드 뷰어 SPA입니다. 첫 화면에서 코드 종류를 고르고, 갤러리에서 루트음을 선택한 뒤, 상세 화면에서 큰 프렛보드 다이어그램을 확인합니다.

## 실행

```bash
npm install
npm run dev
npm run build
npm test
```

## 주요 구조

```txt
src/
  components/          UI 컴포넌트
  data/                코드 종류, 코드 운지 데이터
  hooks/               검색, IndexedDB 이미지 훅
  lib/                 슬러그, 운지 변환, 이미지 저장 로직
public/chords/         코드 Source에서 가져온 정적 이미지 폴백
scripts/               자산 가져오기와 정적 서버 유틸리티
```

## 코드 이미지 방식

기본 표시는 하이브리드입니다.

1. IndexedDB에 업로드한 사용자 이미지
2. `shape.image`가 가리키는 정적 이미지
3. 운지 데이터 기반 동적 SVG

`코드 Source` 폴더의 PNG는 `scripts/importChordAssets.mjs`로 `public/chords/{quality}/{root}.png`에 복사했습니다. 예시는 다음과 같습니다.

```txt
public/chords/major/c.png
public/chords/minor/a.png
public/chords/dominant7/g.png
public/chords/seven-sus4/d.png
```

이미지를 다시 가져오려면:

```bash
node scripts/importChordAssets.mjs
```

## 업로드와 한계

상세 화면의 업로드 버튼은 `svg`, `png`, `webp` 파일을 2MB 이하로 IndexedDB에 저장합니다. 저장된 이미지는 같은 브라우저와 기기에서만 유지됩니다.

정적 배포된 웹사이트의 public 폴더는 브라우저에서 직접 수정할 수 없다. 기본 이미지는 개발자가 프로젝트에 포함해 배포하고, 사용자 업로드 이미지는 IndexedDB 또는 서버 스토리지에 저장해야 한다.

여러 사용자에게 공유되는 이미지 업로드가 필요하면 Supabase Storage, S3, R2 같은 object storage와 DB 메타데이터를 붙이면 됩니다. 저장 로직은 `src/lib/chordImageStorage.ts`에 격리되어 있어 교체 지점을 한 곳으로 모았습니다.

## 확인된 항목

- 원형 코드 종류 버튼 12개
- 코드 갤러리와 상세 화면 전환
- 검색 필터
- ESC 상세 닫기
- 동적 SVG 프렛보드와 정적 이미지 폴백
- IndexedDB 업로드/삭제 UI
- `npm test`, `npm run build` 통과
