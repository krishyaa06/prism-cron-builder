<!-- ═════════════ HEADER ═════════════ -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:07060f,50:F5C561,100:FF6B8A&height=200&section=header&text=Prism%20Cron%20Builder&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=Build%20%C2%B7%20Explain%20%C2%B7%20Preview%20next%20runs&descAlignY=58&descSize=16" width="100%" alt="Prism Cron Builder" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=19&duration=2600&pause=800&color=F5C561&center=true&vCenter=true&width=680&lines=%2A%2F15+9-17+%2A+%2A+1-5+%E2%86%92+work+hours;See+the+next+6+runs+instantly;GitHub+Actions+schedule+snippets;No+more+cron+guesswork" alt="Typing SVG" />
</p>

<p align="center">
  <a href="https://github.com/krishyaa06/prism-cron-builder/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/krishyaa06/prism-cron-builder/ci.yml?branch=main&style=for-the-badge&label=CI&logo=githubactions&logoColor=white" alt="CI" /></a>
  <a href="https://krishyaa06.github.io/prism-cron-builder/"><img src="https://img.shields.io/badge/Live_Demo-Open-F5C561?style=for-the-badge&logo=githubpages&logoColor=black" alt="Live demo" /></a>
  <img src="https://img.shields.io/badge/Vanilla-HTML%20%7C%20CSS%20%7C%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla JS" />
  <img src="https://img.shields.io/badge/dependencies-0-F5C561?style=for-the-badge" alt="Zero dependencies" />
  <a href="LICENSE"><img src="https://img.shields.io/github/license/krishyaa06/prism-cron-builder?style=for-the-badge&color=FF6B8A" alt="License" /></a>
</p>

<p align="center">
  <img src="assets/screenshots/desktop.png" width="90%" alt="Prism Cron Builder screenshot" />
</p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%" />

## ⚡ Overview

**Prism Cron Builder** turns cryptic five-field cron expressions into something you can actually read. Type an expression or build it field by field, and it is validated, described in plain English, and previewed with the next six run times in your local timezone. Copy snippets for crontab, GitHub Actions or node-cron.

## ✨ Features

- **Plain-English descriptions** like *At 18:30 on Monday through Friday*
- **Visual builder** for each field: every, specific, step or range
- **Next 6 runs** computed in your timezone with relative times
- Supports ranges, lists, steps, `JAN`/`MON` names and `@daily`/`@hourly` macros
- Follows the standard day-of-month **OR** day-of-week rule
- **Snippets** for crontab, GitHub Actions and node-cron
- Friendly validation errors and one-click presets

## 📸 Screenshots

<table>
  <tr>
    <td width="68%"><img src="assets/screenshots/desktop.png" width="100%" alt="Prism Cron Builder on desktop" /></td>
    <td width="32%"><img src="assets/screenshots/mobile.png" width="100%" alt="Prism Cron Builder on mobile" /></td>
  </tr>
</table>

## 🚀 Quick Start

**Use it online:** [https://krishyaa06.github.io/prism-cron-builder/](https://krishyaa06.github.io/prism-cron-builder/)

**Run locally:**

```bash
git clone https://github.com/krishyaa06/prism-cron-builder.git
cd prism-cron-builder
# open index.html in your browser, or serve it:
npx serve .
```

## 🛠️ Usage

| Expression | Meaning |
| --- | --- |
| `*/5 * * * *` | Every 5 minutes |
| `0 9 * * *` | Every day at 09:00 |
| `30 18 * * 1-5` | Weekdays at 18:30 |
| `0 0 1 * *` | First day of every month |
| `@weekly` | Every Sunday at midnight |

## 📁 Project Structure

```
prism-cron-builder/
├── assets/
│   ├── logo.png
│   └── logo.svg
├── css/
│   ├── app.css
│   └── prism.css
├── js/
│   ├── app.js   # UI wiring
│   ├── core.js   # parser, describer and next-run engine — tested in Node
│   └── prism.js
├── test/
│   └── core.test.js
├── .gitignore
├── LICENSE
├── README.md
├── index.html
└── package.json
```

## 🧪 Tests

```bash
npm test
```

Tests use the built-in `node:test` runner, so there is nothing to install. CI runs them on Node 20 and 22.

## 🤝 Contributing

1. Fork the repo and create a branch: `git checkout -b feature/my-idea`
2. Make your change and add a test in `test/`
3. Run `npm test` and open a Pull Request

## 🔷 Part of Prism Protocol

Prism Cron Builder is one of the open-source tools built by [Prism Protocol](https://dc.gg/prismprotocol), a tech community where young builders learn, ship and compete together.

## 👤 Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/krishyaa06"><img src="https://github.com/krishyaa06.png" width="90" style="border-radius:50%" /><br><b>Soumya Bhandare</b></a><br>
      <sub>Founder @ Prism Protocol</sub>
    </td>
    <td>
      <a href="https://dc.gg/prismprotocol"><img src="https://img.shields.io/badge/Discord-Prism%20Protocol-5865F2?style=for-the-badge&logo=discord&logoColor=white" /></a><br>
      <a href="https://instagram.com/prism_protocol_"><img src="https://img.shields.io/badge/Instagram-@prism__protocol__-E4405F?style=for-the-badge&logo=instagram&logoColor=white" /></a><br>
      <a href="https://x.com/krishyaa06"><img src="https://img.shields.io/badge/X-@krishyaa06-000000?style=for-the-badge&logo=x&logoColor=white" /></a>
    </td>
  </tr>
</table>

## 📄 License

Released under the [MIT License](LICENSE).

<p align="center">
  <b>If you like this project, consider giving it a ⭐</b><br>
  <sub>"Build. Create. Compete." · Made with ⚡ by Prism Protocol</sub>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF6B8A,50:F5C561,100:07060f&height=110&section=footer" width="100%" />
