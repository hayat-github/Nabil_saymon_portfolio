/**
 * Showcase / Showreel Projects Suite
 * Supports category filtering (multiple tags), 3D card tilt physics, hover video preview, and cinematic modal with iframe support.
 */

class ShowcaseSuite {
  constructor() {
    this.filterButtons = document.querySelectorAll('.showcase-filter-btn');
    this.projectCards = document.querySelectorAll('.showcase-card');
    this.modal = document.getElementById('cinema-modal');
    this.modalVideoContainer = document.getElementById('modal-video-container');
    this.modalTitle = document.getElementById('modal-project-title');
    this.modalRole = document.getElementById('modal-project-role');
    this.modalClient = document.getElementById('modal-project-client');
    this.modalDesc = document.getElementById('modal-project-desc');
    this.modalTools = document.getElementById('modal-project-tools');
    this.closeModalBtn = document.getElementById('close-modal-btn');
    
    // Project database
    this.projectsData = {
      'proj-1': {
        title: 'Short-Form Creator Content',
        role: 'Video Editor',
        client: 'Talking Head & Social Media Edit',
        type: 'iframe',
        videoSrc: 'https://www.youtube.com/embed/nmJn-OiU3Tg?autoplay=1&rel=0',
        poster: 'assets/images/proj-1-thumb.jpg',
        description: 'Fast-paced short-form content edit optimized for Reels, TikTok, and YouTube Shorts. Includes dynamic captions, smooth cuts, and hook-driven opening.',
        tools: ['Premiere Pro']
      },
      'proj-2': {
        title: 'Fintech Creator Content',
        role: 'Video Editor',
        client: 'Explainer Talking Head & Info-Edit',
        type: 'iframe',
        videoSrc: 'https://www.youtube.com/embed/9Msqm_GM1hE?autoplay=1&rel=0',
        poster: 'assets/images/proj-2-thumb.jpg',
        description: 'Engaging fintech explainer video with motion graphics, captions, and seamless transitions to maximize viewer retention.',
        tools: ['Premiere Pro']
      },
      'proj-4': {
        title: 'Leadership & Corporate Culture',
        role: 'Video Editor',
        client: 'Corporate Essay & Executive Content Edit',
        type: 'iframe',
        videoSrc: 'https://www.youtube.com/embed/BqUGpvgimVY?autoplay=1&rel=0',
        poster: 'assets/images/proj-4-thumb.jpg',
        description: 'High-end corporate essay edit for executive branding. Features professional motion graphics, clean cuts, and storytelling focus.',
        tools: ['Premiere Pro', 'After Effects', 'Photoshop']
      },
      'proj-5': {
        title: 'Motivational Visual Essay',
        role: 'Video Editor',
        client: 'High-Energy Pacing & Self-Improvement Edit',
        type: 'iframe',
        videoSrc: 'https://www.youtube.com/embed/qZX8Ng7NaDI?autoplay=1&rel=0',
        poster: 'assets/images/proj-5-thumb.jpg',
        description: 'Dynamic motivational content featuring high-energy pacing, impactful sound effects, and compelling storytelling meant to inspire and drive action.',
        tools: ['Premiere Pro', 'After Effects', 'CapCut']
      },
      'proj-6': {
        title: 'Local Business Commercial',
        role: 'Video Editor',
        client: 'Promo Ad & Corporate Video Edit',
        type: 'iframe',
        videoSrc: 'https://www.youtube.com/embed/3Fa8zoCQdIs?autoplay=1&rel=0',
        poster: 'assets/images/proj-6-thumb.jpg',
        description: 'Professional promotional advertisement for a local business, showcasing services through smooth corporate editing and motion graphics.',
        tools: ['Premiere Pro', 'After Effects', 'Photoshop']
      },
      'proj-7': {
        title: 'Premium Workspace Commercial',
        role: 'Video Editor',
        client: 'B2B Promo Ad & Corporate Real Estate Edit',
        type: 'iframe',
        videoSrc: 'https://www.youtube.com/embed/dLuZRWiLVxU?autoplay=1&rel=0',
        poster: 'assets/images/proj-7-thumb.png',
        description: 'B2B promotional commercial for a premium coworking space, featuring dynamic transitions, corporate branding, and professional real estate visuals.',
        tools: ['Premiere Pro', 'After Effects', 'Photoshop']
      },
      'proj-8': {
        title: 'Cinematic Travel & Adventure Ad',
        role: 'Video Editor',
        client: 'Tourism Promo Commercial & Action Video Edit',
        type: 'iframe',
        videoSrc: 'https://www.youtube.com/embed/4sWKcJgQ3eU?autoplay=1&rel=0',
        poster: 'assets/images/proj-8-thumb.jpg',
        description: 'High-energy cinematic travel and adventure commercial with action-packed sequences, dynamic color grading, and immersive sound design.',
        tools: ['Premiere Pro', 'After Effects', 'Photoshop']
      },
      'proj-9': {
        title: 'Luxury Travel Promo',
        role: 'Video Editor',
        client: 'Q&A Tourism Commercial & Premium Lifestyle Edit',
        type: 'iframe',
        videoSrc: 'https://www.youtube.com/embed/sAaf7v4gEvM?autoplay=1&rel=0',
        poster: 'assets/images/proj-9-thumb.jpg',
        description: 'Premium tourism commercial highlighting luxury travel and lifestyle experiences through engaging Q&A formatting and polished editing.',
        tools: ['Premiere Pro', 'After Effects', 'Photoshop']
      }
    };

    this.showMoreBtn = document.getElementById('show-more-btn');
    this.showMoreContainer = document.getElementById('show-more-container');
    this.currentFilter = 'all';
    this.visibleLimit = 6;

    this.init();
  }

  init() {
    this.bindFilters();
    this.bindShowMore();
    this.bindTiltCards();
    this.bindHoverVideos();
    this.bindModal();
    this.updateVisibility();
  }

  bindShowMore() {
    if (this.showMoreBtn) {
      this.showMoreBtn.addEventListener('click', () => {
        this.visibleLimit += 3;
        this.updateVisibility();
        if (window.soundFX) window.soundFX.playClick();
      });
    }
  }

  updateVisibility() {
    const matchingCards = Array.from(this.projectCards).filter(card => {
      const categories = card.dataset.categories ? card.dataset.categories.split(' ') : [];
      return this.currentFilter === 'all' || categories.includes(this.currentFilter);
    });

    this.projectCards.forEach(card => {
      const categories = card.dataset.categories ? card.dataset.categories.split(' ') : [];
      const matchesFilter = this.currentFilter === 'all' || categories.includes(this.currentFilter);

      if (matchesFilter) {
        const indexInMatching = matchingCards.indexOf(card);
        if (indexInMatching < this.visibleLimit) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 250);
      }
    });

    if (this.showMoreContainer) {
      if (matchingCards.length > this.visibleLimit) {
        this.showMoreContainer.style.display = 'flex';
        this.showMoreContainer.style.justifyContent = 'center';
        this.showMoreContainer.style.alignItems = 'center';
        this.showMoreContainer.style.width = '100%';
      } else {
        this.showMoreContainer.style.display = 'none';
      }
    }
  }

  bindFilters() {
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        this.filterButtons.forEach(b => {
          b.classList.remove('active', 'border-neon-cyan', 'text-neon-cyan', 'bg-cyan-500/10', 'shadow-[0_0_15px_rgba(0,245,212,0.25)]');
          b.classList.add('border-slate-800', 'text-slate-400');
        });

        btn.classList.add('active', 'border-neon-cyan', 'text-neon-cyan', 'bg-cyan-500/10', 'shadow-[0_0_15px_rgba(0,245,212,0.25)]');
        btn.classList.remove('border-slate-800', 'text-slate-400');

        if (window.soundFX) window.soundFX.playClick();

        this.currentFilter = filter;
        this.visibleLimit = 6;
        this.updateVisibility();
      });
    });
  }

  bindTiltCards() {
    this.projectCards.forEach(card => {
      let bounds;

      const mouseMove = (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const xPct = (mouseX / bounds.width - 0.5) * 2;
        const yPct = (mouseY / bounds.height - 0.5) * 2;

        const rotateX = -yPct * 8;
        const rotateY = xPct * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

        const glare = card.querySelector('.tilt-glare');
        if (glare) {
          glare.style.opacity = '1';
          glare.style.background = `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.15), transparent 60%)`;
        }
      };

      const mouseLeave = () => {
        bounds = null;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        const glare = card.querySelector('.tilt-glare');
        if (glare) glare.style.opacity = '0';
      };

      card.addEventListener('mousemove', mouseMove);
      card.addEventListener('mouseleave', mouseLeave);
    });
  }

  bindHoverVideos() {
    this.projectCards.forEach(card => {
      const video = card.querySelector('.hover-preview-video');
      const poster = card.querySelector('.card-poster-img');

      if (!video) return;

      card.addEventListener('mouseenter', () => {
        video.play().catch(() => {});
        video.style.opacity = '1';
        if (poster) poster.style.opacity = '0';
      });

      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
        video.style.opacity = '0';
        if (poster) poster.style.opacity = '1';
      });
    });
  }

  bindModal() {
    this.projectCards.forEach(card => {
      const projectId = card.dataset.id;

      if (projectId) {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          this.openProjectModal(projectId);
        });
      }
    });

    const showreelBtn = document.getElementById('hero-showreel-btn');
    if (showreelBtn) {
      showreelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openProjectModal('proj-1');
      });
    }

    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  openProjectModal(projectId) {
    const data = this.projectsData[projectId];
    if (!data || !this.modal) return;

    if (this.modalTitle) this.modalTitle.textContent = data.title;
    if (this.modalRole) this.modalRole.textContent = data.role;
    if (this.modalClient) this.modalClient.textContent = data.client;
    if (this.modalDesc) this.modalDesc.textContent = data.description;

    if (this.modalTools) {
      this.modalTools.innerHTML = data.tools.map(tool => `
        <span class="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300">
          ${tool}
        </span>
      `).join('');
    }

    if (this.modalVideoContainer) {
      // Clear previous
      this.modalVideoContainer.innerHTML = '';
      
      if (data.type === 'raw-html') {
        this.modalVideoContainer.innerHTML = data.htmlContent;
      } else if (data.type === 'iframe') {
        const iframe = document.createElement('iframe');
        iframe.src = data.videoSrc;
        iframe.className = 'w-full h-full';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframe.setAttribute('allowfullscreen', 'true');
        this.modalVideoContainer.appendChild(iframe);
      } else {
        const video = document.createElement('video');
        video.src = data.videoSrc;
        video.poster = data.poster;
        video.className = 'w-full h-full object-contain';
        video.controls = true;
        video.playsInline = true;
        video.autoplay = true;
        this.modalVideoContainer.appendChild(video);
      }
    }

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.soundFX) window.soundFX.playModalOpen();
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    if (this.modalVideoContainer) {
      this.modalVideoContainer.innerHTML = ''; // Stops playback and removes iframe/video
    }

    if (window.soundFX) window.soundFX.playClick();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.showcaseSuite = new ShowcaseSuite();
});
