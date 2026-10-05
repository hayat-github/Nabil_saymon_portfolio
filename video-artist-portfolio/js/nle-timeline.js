/**
 * Realistic NLE Video Sequence Timeline (Experience & Career Journey)
 * Supports playhead scrubbing, SMPTE timecode sync, multi-track layout, and dynamic clip inspection.
 */

class NLETimeline {
  constructor() {
    this.wrapper = document.querySelector('.nle-timeline-wrapper');
    if (!this.wrapper) return;

    this.playhead = this.wrapper.querySelector('.nle-playhead');
    this.tracksBody = this.wrapper.querySelector('.nle-tracks-body');
    this.rulerContainer = this.wrapper.querySelector('.nle-ruler-container');
    this.playheadHandle = this.wrapper.querySelector('.nle-playhead-handle');
    this.timecodeDisplay = document.getElementById('timeline-timecode-readout');
    this.playBtn = document.getElementById('nle-play-btn');
    this.inspectorContent = document.getElementById('nle-clip-inspector-data');

    this.isPlaying = false;
    this.playheadPercent = 35; // default position %
    this.isDraggingPlayhead = false;
    this.animationFrameId = null;

    // Timeline clips database
    this.clips = [
      {
        id: 'clip-1',
        track: 'V1',
        title: 'Launch & Local Projects',
        role: 'Video Editor',
        client: 'Local Clients',
        timeframe: '2022 - 2023',
        startPct: 0,
        widthPct: 23,
        type: 'clip-edit',
        metrics: 'Content Creation • Skill Building • Local Promos',
        description: 'Started my video editing journey by creating content, mastering software, and editing promotional videos for local clients to build my skills.',
        tools: ['CapCut', 'Photoshop']
      },
      {
        id: 'clip-2',
        track: 'V1',
        title: 'Independent Freelancing',
        role: 'Video Editor',
        client: 'Direct Inquiries',
        timeframe: '2023 - 2024',
        startPct: 25,
        widthPct: 23,
        type: 'clip-edit',
        metrics: 'High-Quality Editing • Clean Aesthetics',
        description: 'Began receiving direct project inquiries through my professional email from clients looking for high-quality, clean video editing.',
        tools: ['Premiere Pro', 'Photoshop']
      },
      {
        id: 'clip-3',
        track: 'V1',
        title: 'Launching SAYMON Edits',
        role: 'Video Editor',
        client: 'Social Media',
        timeframe: '2024 - 2025',
        startPct: 50,
        widthPct: 23,
        type: 'clip-edit',
        metrics: 'Fast-Paced Cuts • Engaging Text • Sound Effects',
        description: 'Focused on editing modern, fast-paced Instagram Reels, TikToks, and Shorts with engaging text, smooth cuts, and sound effects.',
        tools: ['Premiere Pro', 'CapCut']
      },
      {
        id: 'clip-4',
        track: 'V1',
        title: 'Ongoing International Collaboration',
        role: 'Lead Video Editor & Colorist',
        client: 'Client in France',
        timeframe: '2025 - Present',
        startPct: 75,
        widthPct: 25,
        type: 'clip-edit',
        metrics: 'Full Post-Production • Color Grading • Long-Term',
        description: 'Successfully collaborating with a long-term client in France, handling their entire video editing, color grading, and visual post-production.',
        tools: ['Premiere Pro', 'Photoshop']
      }
    ];

    this.init();
  }

  init() {
    this.renderClips();
    this.bindEvents();
    this.updatePlayhead(this.playheadPercent);
    this.selectClip(this.clips[0]);
  }

  renderClips() {
    // Populate clips into respective tracks
    this.clips.forEach(clip => {
      const trackRow = this.wrapper.querySelector(`.nle-track-row[data-track="${clip.track}"] .nle-track-lane`);
      if (!trackRow) return;

      const clipEl = document.createElement('div');
      clipEl.className = `nle-clip ${clip.type}`;
      clipEl.id = clip.id;
      clipEl.style.left = `${clip.startPct}%`;
      clipEl.style.width = `${clip.widthPct}%`;

      clipEl.innerHTML = `
        <div class="clip-title flex items-center justify-between">
          <span>${clip.title}</span>
          <span class="text-[9px] opacity-75 font-normal">${clip.timeframe}</span>
        </div>
        <div class="clip-meta">
          <span class="truncate mr-2 font-mono">${clip.role}</span>
          <i class="fa-solid fa-film text-[10px] opacity-70"></i>
        </div>
      `;

      clipEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectClip(clip);
        if (window.soundFX) window.soundFX.playClick();
      });

      trackRow.appendChild(clipEl);
    });
  }

  bindEvents() {
    // Playhead dragging
    const onStart = (e) => {
      this.isDraggingPlayhead = true;
      this.handleTimelineScrub(e);
      if (this.isPlaying) this.togglePlay(false);
    };

    const onMove = (e) => {
      if (!this.isDraggingPlayhead) return;
      this.handleTimelineScrub(e);
    };

    const onEnd = () => {
      this.isDraggingPlayhead = false;
    };

    if (this.rulerContainer) {
      this.rulerContainer.addEventListener('mousedown', onStart);
      this.rulerContainer.addEventListener('touchstart', onStart, { passive: true });
    }

    if (this.tracksBody) {
      this.tracksBody.addEventListener('mousedown', onStart);
      this.tracksBody.addEventListener('touchstart', onStart, { passive: true });
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);

    // Play/Pause button
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        this.togglePlay();
        if (window.soundFX) window.soundFX.playClick();
      });
    }

    // Step forward / Step backward
    const prevBtn = document.getElementById('nle-prev-keyframe-btn');
    const nextBtn = document.getElementById('nle-next-keyframe-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.updatePlayhead(Math.max(0, this.playheadPercent - 10));
        if (window.soundFX) window.soundFX.playClick();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.updatePlayhead(Math.min(100, this.playheadPercent + 10));
        if (window.soundFX) window.soundFX.playClick();
      });
    }

    // Track Solo / Mute pills
    this.wrapper.querySelectorAll('.track-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        pill.classList.toggle('active');
        if (window.soundFX) window.soundFX.playClick();
      });
    });
  }

  handleTimelineScrub(e) {
    const lane = this.wrapper.querySelector('.nle-track-lane');
    if (!lane) return;
    const rect = lane.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;

    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    this.updatePlayhead(percentage);
    this.checkActiveClipAtPlayhead(percentage);
  }

  updatePlayhead(percentage) {
    this.playheadPercent = percentage;
    if (this.playhead) {
      this.playhead.style.left = `calc(90px + (100% - 90px) * ${percentage / 100})`;
    }

    // Calculate SMPTE timecode (base 01:00:00:00 to 01:04:15:20)
    const totalFrames = Math.floor((percentage / 100) * (4 * 60 * 24 + 15 * 24));
    const mins = String(Math.floor(totalFrames / (60 * 24))).padStart(2, '0');
    const secs = String(Math.floor((totalFrames % (60 * 24)) / 24)).padStart(2, '0');
    const frames = String(totalFrames % 24).padStart(2, '0');

    if (this.timecodeDisplay) {
      this.timecodeDisplay.textContent = `01:${mins}:${secs}:${frames}`;
    }
  }

  checkActiveClipAtPlayhead(percentage) {
    const matchingClip = this.clips.find(c => 
      percentage >= c.startPct && percentage <= (c.startPct + c.widthPct)
    );
    if (matchingClip) {
      this.selectClip(matchingClip, false);
    }
  }

  selectClip(clip, movePlayhead = true) {
    // Highlight clip in DOM
    this.wrapper.querySelectorAll('.nle-clip').forEach(c => c.classList.remove('selected'));
    const el = document.getElementById(clip.id);
    if (el) el.classList.add('selected');

    if (movePlayhead) {
      this.updatePlayhead(clip.startPct + 5);
    }

    // Update Clip Inspector
    if (this.inspectorContent) {
      this.inspectorContent.innerHTML = `
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="cyber-tag">${clip.timeframe}</span>
            <span class="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">${clip.client}</span>
          </div>
          <h4 class="text-xl font-bold font-display text-white tracking-wide">${clip.title}</h4>
          <p class="text-xs text-slate-400 font-mono flex items-center gap-2">
            <i class="fa-solid fa-user-gear text-cyan-400"></i> ${clip.role}
          </p>
          <p class="text-sm text-slate-300 leading-relaxed mt-2">${clip.description}</p>
        </div>

        <div class="border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 space-y-3">
          <div>
            <div class="text-[11px] font-mono uppercase text-slate-500 font-semibold mb-1">Production Highlights & Metrics</div>
            <div class="text-sm font-tech text-cyan-300 bg-cyan-950/30 p-2.5 rounded-md border border-cyan-500/20">
              <i class="fa-solid fa-bolt mr-2 text-cyan-400"></i>${clip.metrics}
            </div>
          </div>

          <div>
            <div class="text-[11px] font-mono uppercase text-slate-500 font-semibold mb-1.5">Suite & Toolchain</div>
            <div class="flex flex-wrap gap-1.5">
              ${clip.tools.map(tool => `
                <span class="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-200">
                  ${tool}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }
  }

  togglePlay(forceState) {
    this.isPlaying = forceState !== undefined ? forceState : !this.isPlaying;

    if (this.playBtn) {
      this.playBtn.innerHTML = this.isPlaying 
        ? '<i class="fa-solid fa-pause text-cyan-400"></i>' 
        : '<i class="fa-solid fa-play"></i>';
      this.playBtn.classList.toggle('active', this.isPlaying);
    }

    if (this.isPlaying) {
      this.playbackLoop();
    } else {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  playbackLoop() {
    if (!this.isPlaying) return;

    let nextPct = this.playheadPercent + 0.15;
    if (nextPct > 100) nextPct = 0;

    this.updatePlayhead(nextPct);
    this.checkActiveClipAtPlayhead(nextPct);

    this.animationFrameId = requestAnimationFrame(() => this.playbackLoop());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.nleTimeline = new NLETimeline();
});
