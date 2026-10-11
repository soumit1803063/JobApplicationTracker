import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { marked } from 'marked';

const bookDir = resolve(import.meta.dirname);
const chaptersDir = join(bookDir, 'chapters');
const htmlPath = join(bookDir, 'book.html');
const pdfPath = join(bookDir, 'react-book-bangla.pdf');

const BROWSER_CANDIDATES = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];

const STYLES = `
@page {
    size: A4;
    margin: 18mm 16mm 20mm 16mm;
    @bottom-center {
        content: counter(page);
        font-family: 'Nirmala UI', sans-serif;
        font-size: 9pt;
        color: #64748b;
    }
}
@page :first {
    @bottom-center { content: none; }
}
body {
    font-family: 'Nirmala UI', 'Noto Sans Bengali', 'Vrinda', sans-serif;
    font-size: 11pt;
    line-height: 1.75;
    color: #1e293b;
}
.cover {
    height: 250mm;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    page-break-after: always;
}
.cover h1 { font-size: 30pt; color: #4338ca; margin: 0 0 12pt; border: none; }
.cover p { font-size: 13pt; color: #475569; margin: 4pt 0; }
.cover .tag { margin-top: 30pt; font-size: 11pt; color: #94a3b8; }
.toc { page-break-after: always; }
.toc h2 { font-size: 20pt; color: #4338ca; border: none; }
.toc ul { font-size: 12pt; line-height: 2.1; list-style: none; padding-left: 0; }
.toc a { color: #1e293b; text-decoration: none; }
.chapter { page-break-before: always; }
h1 { font-size: 21pt; color: #4338ca; border-bottom: 2px solid #c7d2fe; padding-bottom: 6pt; margin-top: 0; }
h2 { font-size: 15pt; color: #1e3a8a; margin-top: 22pt; page-break-after: avoid; }
h3 { font-size: 12.5pt; color: #1e40af; margin-top: 16pt; page-break-after: avoid; }
p, li { orphans: 3; widows: 3; }
code {
    font-family: 'Cascadia Mono', Consolas, monospace;
    font-size: 9.5pt;
    background: #f1f5f9;
    padding: 1px 4px;
    border-radius: 3px;
    color: #be123c;
}
pre {
    background: #0f172a;
    color: #e2e8f0;
    padding: 10pt 12pt;
    border-radius: 6px;
    white-space: pre-wrap;
    word-break: break-word;
    page-break-inside: avoid;
    line-height: 1.5;
}
pre code { background: none; color: inherit; padding: 0; font-size: 9pt; }
table { border-collapse: collapse; width: 100%; margin: 10pt 0; font-size: 10pt; }
tr { page-break-inside: avoid; }
th, td { border: 1px solid #cbd5e1; padding: 5pt 7pt; text-align: left; vertical-align: top; }
th { background: #eef2ff; color: #1e3a8a; }
blockquote { border-left: 4px solid #818cf8; background: #eef2ff; margin: 10pt 0; padding: 6pt 12pt; color: #312e81; }
hr { border: none; border-top: 1px dashed #cbd5e1; margin: 18pt 0; }
strong { color: #0f172a; }
`;

function findBrowser() {
    const browser = BROWSER_CANDIDATES.find((candidate) => existsSync(candidate));
    if (!browser) {
        throw new Error('Chrome or Edge not found. Install one of them to build the PDF.');
    }
    return browser;
}

function readChapters() {
    return readdirSync(chaptersDir)
        .filter((name) => name.endsWith('.md'))
        .sort()
        .map((name, index) => {
            const markdown = readFileSync(join(chaptersDir, name), 'utf8');
            const title = (markdown.match(/^#\s+(.+)$/m)?.[1] ?? name).replaceAll('`', '');
            return { id: `chapter-${index}`, title, html: marked.parse(markdown, { breaks: true }) };
        });
}

function buildHtml(chapters) {
    const toc = chapters
        .map((chapter) => `<li><a href="#${chapter.id}">${chapter.title}</a></li>`)
        .join('\n');
    const body = chapters
        .map((chapter) => `<section class="chapter" id="${chapter.id}">${chapter.html}</section>`)
        .join('\n');

    return `<!doctype html>
<html lang="bn">
<head>
<meta charset="utf-8" />
<title>শূন্য থেকে React</title>
<style>${STYLES}</style>
</head>
<body>
<div class="cover">
    <h1>শূন্য থেকে React</h1>
    <p>Job Application Tracker প্রজেক্ট দিয়ে শেখা</p>
    <p>React · TypeScript · React Router · Redux Toolkit · Tailwind CSS</p>
    <p class="tag">ইন্টারভিউ প্রস্তুতির জন্য সম্পূর্ণ গাইড</p>
</div>
<div class="toc">
    <h2>সূচিপত্র</h2>
    <ul>${toc}</ul>
</div>
${body}
</body>
</html>`;
}

const chapters = readChapters();
writeFileSync(htmlPath, buildHtml(chapters), 'utf8');

execFileSync(findBrowser(), [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`,
    pathToFileURL(htmlPath).href,
], { stdio: 'ignore' });

console.log(`Built ${pdfPath} from ${chapters.length} chapters`);
