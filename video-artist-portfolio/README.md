# 🎬 Hyper-Modern Video Editor & Visual Artist Portfolio

A visually stunning, cinematic, and futuristic personal portfolio website engineered specifically for **Professional Video Editors, Colorists, and Visual Artists**. Inspired by modern non-linear editing suites (DaVinci Resolve, Adobe Premiere Pro, After Effects) fused with cyber-neon gradients and micro-interactions.

---

## ✨ Key Features & Architectural Highlights

### 1. 🎞️ NLE Interface Aesthetics & Cyber Gradients
- **DaVinci / Premiere Inspired Dark Theme**: Obsidian void palette (`#06080d`), slate panels, and glowing cyber accents (Neon Cyan `#00f5d4`, Electric Blue `#00b4d8`, Deep Violet `#7209b7`, and Vivid Magenta `#f72585`).
- **Live SMPTE Timecode HUD**: Real-time 24.00fps timecode ticker (`01:00:00:00`), live broadcast status beacons, and film grain overlay.
- **Synthesized Audio Engine (Web Audio API)**: Zero-dependency sound effects providing tactile futuristic clicks, whooshes, and mode transitions with an instant mute/unmute toggle in the header.

### 2. 🎚️ Interactive NLE Sequence Timeline (Experience & Career Journey)
- **Multi-Track Editing Sequence**: Styled with `V2 (VFX/3D)`, `V1 (Master Edit)`, `A1 (Dialogue/Foley)`, and `A2 (Score)`.
- **Scrubbable Playhead**: Drag the red playhead or click anywhere along the timeline to sync timecodes and inspect milestones in real-time.
- **Dynamic Clip Inspector**: Detailed breakdown of client campaigns (Sony, Nike, Red Bull, Warner Bros), festival awards, tools used, and production metrics.
- **Timeline Play/Pause Simulation**: Real-time automated playhead progression.

### 3. 🌓 Dynamic "Before / After" Split Slider & Color Grade Lab
- **Drag-to-Compare Viewport**: Smooth touch and mouse dragging with neon glowing split line.
- **Multi-LUT Switcher**: S-Log3 RAW vs. Teal & Orange Master (Rec.709), Arri Log-C vs. Neo-Tokyo Cyberpunk, and RED IPP2 vs. Moody Gold Film Noir.
- **Photo Manipulation Mode**: Compare original camera RAW photos against multi-layer surreal cyberpunk composite art.
- **Real-Time Color Scopes**: Live rendered Waveform, RGB Parade, and Vectorscope monitors.

### 4. 🎥 3D Tilt Showcase & Cinematic Video Player
- **Filterable Showcase Grid**: Filter by Commercials, Music Videos, VFX & 3D, and Photo Manipulation.
- **3D Card Physics**: Realistic perspective tilt responding to mouse cursor with specular sheen glare.
- **Video Preview on Hover**: Seamless HTML5 hover-play previews.
- **Cinematic Modal Video Player**: Fullscreen player with custom project briefing, toolchain badges, and responsive controls.

### 5. 🎛️ Skills & Broadcast VU Audio/Video Meters
- **Animated Level Meters**: Dynamic VU audio/video broadcast safe level visualizers for Premiere Pro, DaVinci Resolve Studio, After Effects, Cinema 4D / Blender, Photoshop, and Pro Tools.
- **Keyframe Bezier Curve Visualizer**: Real-time cubic bezier speed ramp curve graph.

### 6. 💼 Scope & Rate Estimator / Booking Console
- **Interactive Project Budget Calculator**: Select project type, turnaround speed (Standard, Priority Sprint, Emergency Rush), and add-on deliverables (8K Master, Multi-Aspect Cutdowns, Dolby Atmos).
- **Glassmorphic Contact Transceiver**: Form validation, transmission animation, and toast alerts.

---

## 🚀 How to Run and Preview

### Option 1: Live Server (Recommended)
From this directory, run:
```bash
npx serve .
```
or
```bash
npx live-server
```
Then open `http://localhost:3000` in your web browser.

### Option 2: Direct File Open
Simply double-click `index.html` or drag it into Chrome, Firefox, Edge, Safari, or Brave.

---

## 📁 File Structure

```
video-artist-portfolio/
├── index.html              # Master semantic HTML5 structure & sections
├── css/
│   ├── style.css           # Base styles, cyber gradients, film grain, glassmorphism
│   └── nle-theme.css       # NLE timeline tracks, playhead, clip inspector, before/after slider
├── js/
│   ├── main.js             # Controller, Web Audio synthesizer, typewriter, timecode HUD
│   ├── canvas-waves.js     # Background render waves & interactive particle constellation
│   ├── before-after.js     # Drag-to-compare Before/After slider & color grade suite
│   ├── nle-timeline.js     # Interactive video sequence timeline & clip inspector
│   ├── showcase.js         # Showcase filtering, 3D tilt physics & modal video player
│   ├── skills.js           # Skills VU meters & keyframe bezier graph
│   └── booking-contact.js  # Project budget calculator, form transceiver & toasts
└── README.md               # Documentation & setup guide
```

---

## 🎨 How to Customize

- **Name & Branding**: Change `KAIEN VANCE` in `index.html` and update the logo monogram.
- **Typewriter Roles**: Modify the `this.roles` array in `js/main.js`.
- **Portfolio Projects & Videos**: Update `this.projectsData` in `js/showcase.js` and the HTML markup in `<section id="showcase">`.
- **Career Timeline Milestones**: Modify the `this.clips` array in `js/nle-timeline.js` to showcase your own past clients, films, and awards.
- **Pricing & Rates**: Update base prices and turnaround days in `this.pricingModel` in `js/booking-contact.js`.
