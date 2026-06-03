import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, '코드 Source');
const publicDir = path.join(rootDir, 'public', 'chords');

const qualityFolders = {
  major: 'major',
  dominant7: 'dominant7',
  minor: 'minor',
  minor7: 'minor7',
  sus4: 'sus4',
  major7: 'major7',
  six: 'six',
  sevenSus4: 'seven-sus4',
};

const mappings = [
  { source: 'Major', quality: 'major', suffix: '' },
  { source: '7th', quality: 'dominant7', suffix: '7' },
  { source: 'minor', quality: 'minor', suffix: 'm' },
  { source: 'minor7th', quality: 'minor7', suffix: 'm7' },
  { source: 'sus4', quality: 'sus4', suffix: 'sus4' },
  { source: 'Major7th', quality: 'major7', suffix: 'M7' },
  { source: '6th', quality: 'six', suffix: '6' },
  { source: '7sus4', quality: 'sevenSus4', suffix: '7sus4' },
];

function slugRoot(root) {
  return root
    .trim()
    .replace(/#/g, '-sharp-')
    .replace(/([A-Ga-g])b/g, '$1-flat-')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function stripDecorations(fileName) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/\(.*$/, '')
    .replace(/Easy$/i, '')
    .replace(/정석$/i, '');
}

function rootFromName(fileName, suffix) {
  const base = stripDecorations(fileName);
  if (!suffix) {
    return base;
  }

  return base.endsWith(suffix) ? base.slice(0, -suffix.length) : base;
}

function titleFor(root, quality) {
  if (quality === 'dominant7') return `${root}7`;
  if (quality === 'six') return `${root}6`;
  if (quality === 'minor') return `${root} minor`;
  if (quality === 'minor7') return `${root} minor7`;
  if (quality === 'major7') return `${root} Major 7`;
  if (quality === 'sevenSus4') return `${root} 7sus4`;
  return `${root} ${quality}`;
}

async function copyMappedAssets() {
  const manifestItems = new Map();

  for (const mapping of mappings) {
    const folder = path.join(sourceDir, mapping.source);
    const entries = await readdir(folder, { withFileTypes: true });
    const targetFolder = qualityFolders[mapping.quality];
    await mkdir(path.join(publicDir, targetFolder), { recursive: true });

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.png')) {
        continue;
      }

      if (entry.name.includes('Easy') || entry.name.includes('정석')) {
        const duplicateRoot = rootFromName(entry.name, mapping.suffix);
        const duplicateId = `${slugRoot(duplicateRoot)}_${mapping.quality}`;
        if (manifestItems.has(duplicateId)) {
          continue;
        }
      }

      const root = rootFromName(entry.name, mapping.suffix);
      const slug = slugRoot(root);
      const imageSrc = `/chords/${targetFolder}/${slug}.png`;
      const id = `${slug}_${mapping.quality}`;
      await copyFile(path.join(folder, entry.name), path.join(publicDir, targetFolder, `${slug}.png`));
      manifestItems.set(id, {
        id,
        root,
        quality: mapping.quality,
        title: titleFor(root, mapping.quality),
        imageSrc,
        sourceFile: `코드 Source/${mapping.source}/${entry.name}`,
      });
    }
  }

  await copyEtcAssets(manifestItems);
  await writePlaceholder();

  const manifest = {
    version: 1,
    basePath: '/chords',
    items: [...manifestItems.values()].sort((a, b) => a.id.localeCompare(b.id)),
  };
  await writeFile(path.join(publicDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  return manifest.items.length;
}

async function copyEtcAssets(manifestItems) {
  const folder = path.join(sourceDir, 'ETC');
  const entries = await readdir(folder, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.png')) {
      continue;
    }

    if (entry.name.includes('Easy')) {
      continue;
    }

    const base = stripDecorations(entry.name);
    const isMinor7 = base.endsWith('m7');
    const isMinor = base.endsWith('m') && !isMinor7;
    if (!isMinor && !isMinor7) {
      continue;
    }

    const quality = isMinor7 ? 'minor7' : 'minor';
    const suffix = isMinor7 ? 'm7' : 'm';
    const root = base.slice(0, -suffix.length);
    const slug = slugRoot(root);
    const targetFolder = qualityFolders[quality];
    await mkdir(path.join(publicDir, targetFolder), { recursive: true });
    const imageSrc = `/chords/${targetFolder}/${slug}.png`;
    const id = `${slug}_${quality}`;
    await copyFile(path.join(folder, entry.name), path.join(publicDir, targetFolder, `${slug}.png`));
    manifestItems.set(id, {
      id,
      root,
      quality,
      title: titleFor(root, quality),
      imageSrc,
      sourceFile: `코드 Source/ETC/${entry.name}`,
    });
  }
}

async function writePlaceholder() {
  const folder = path.join(publicDir, 'placeholders');
  await mkdir(folder, { recursive: true });
  await writeFile(
    path.join(folder, 'chord-placeholder.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 320" role="img" aria-label="Chord placeholder">
  <rect width="560" height="320" rx="18" fill="#fffefe"/>
  <text x="280" y="150" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="24" font-weight="700">Chord image unavailable</text>
  <text x="280" y="188" text-anchor="middle" fill="#10b981" font-family="Arial, sans-serif" font-size="18" font-weight="700">dynamic SVG fallback is active</text>
</svg>
`,
    'utf8',
  );
}

copyMappedAssets()
  .then((count) => {
    console.log(`Imported ${count} chord image assets.`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
