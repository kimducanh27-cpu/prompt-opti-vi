import fs from 'node:fs'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: true, linkify: true, typographer: false })
const source = fs.readFileSync('BAO-CAO-KY-THUAT.md', 'utf8')
const body = md.render(source)

const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Báo cáo kỹ thuật — Prompt Optimizer Mobile-First &amp; vi-VN</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 32px 20px 64px;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif;
    font-size: 16px; line-height: 1.7; color: #1f2933; background: #f5f6f8;
  }
  main { max-width: 920px; margin: 0 auto; background: #fff; padding: 40px 44px 56px; border-radius: 14px; box-shadow: 0 1px 2px rgba(15,23,42,.06), 0 12px 40px rgba(15,23,42,.08); }
  h1 { font-size: 30px; line-height: 1.3; margin: 0 0 18px; letter-spacing: -.01em; }
  h2 { font-size: 22px; margin: 42px 0 14px; padding-top: 18px; border-top: 1px solid #eef1f4; }
  h3 { font-size: 18px; margin: 28px 0 10px; }
  p, li { color: #334155; }
  strong { color: #0f172a; }
  a { color: #2563eb; }
  table { border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 14.5px; display: block; overflow-x: auto; }
  th, td { border: 1px solid #e5e7eb; padding: 9px 12px; text-align: left; vertical-align: top; }
  th { background: #f8fafc; font-weight: 600; color: #0f172a; }
  tr:nth-child(even) td { background: #fbfcfe; }
  code { background: #f1f5f9; padding: 2px 6px; border-radius: 6px; font-size: 14px; font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace; }
  pre { background: #0f172a; color: #e2e8f0; padding: 16px 18px; border-radius: 10px; overflow-x: auto; }
  pre code { background: transparent; color: inherit; padding: 0; }
  blockquote { margin: 16px 0; padding: 10px 16px; border-left: 3px solid #94a3b8; background: #f8fafc; color: #475569; }
  hr { border: 0; border-top: 1px solid #eef1f4; margin: 32px 0; }
  ul, ol { padding-left: 24px; }
  li { margin: 4px 0; }
  @media (max-width: 640px) {
    body { padding: 12px 10px 40px; font-size: 15.5px; }
    main { padding: 22px 18px 34px; border-radius: 10px; }
    h1 { font-size: 24px; }
    h2 { font-size: 19px; }
    table { font-size: 13.5px; }
  }
  @media print {
    body { background: #fff; padding: 0; }
    main { box-shadow: none; border-radius: 0; padding: 0; max-width: none; }
    h2 { break-after: avoid; }
    table, pre { break-inside: avoid; }
  }
</style>
</head>
<body>
<main>
${body}
</main>
</body>
</html>
`

fs.writeFileSync('BAO-CAO-KY-THUAT.html', html)
console.log('wrote BAO-CAO-KY-THUAT.html', html.length, 'bytes')
