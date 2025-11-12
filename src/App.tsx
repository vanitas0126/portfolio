import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { TiltCard } from './components/TiltCard';
import { AnimatedDots } from './components/AnimatedDots';
import About from './components/About';
import { ProjectDetail } from './components/ProjectDetail';
import { VideoWaterEffect } from './components/VideoWaterEffect';
import { motion, useInView, useScroll, useTransform, useSpring } from 'motion/react';

// Unicorn Studio 타입 정의
declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init: () => void;
      [key: string]: any;
    };
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const pathnameRef = useRef<string | null>(null);
  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const withBase = useCallback((path: string) => `${basePath}${path === '/' ? '' : path}`, [basePath]);
  
  // Simple path-based routing to enable real-ish URLs (/project/:id, /about)
  useEffect(() => {
    const stripBase = (pathname: string) => {
      if (basePath && basePath !== '/' && pathname.startsWith(basePath)) {
        const stripped = pathname.slice(basePath.length);
        return stripped || '/';
      }
      return pathname || '/';
    };

    const parsePath = (rawPath: string) => {
      const pathname = stripBase(rawPath);
      if (!pathname) return null;
      // Support: /project/hourtaste  and /about
      if (pathname.startsWith('/project/')) {
        const id = pathname.replace('/project/', '').replace(/\/+$/, '').toLowerCase();
        return id || null;
      }
      if (pathname === '/about' || pathname === '/about/') return 'about';
      return null;
    };

    const applyPath = () => {
      try {
        const p = parsePath(window.location.pathname || '/');
        if (p === 'about') {
          setSelectedProject(null);
          setCurrentPage('about');
        } else if (p) {
          setSelectedProject(p);
          setCurrentPage('home');
        } else {
          // default
          setSelectedProject(null);
          setCurrentPage('home');
        }
      } catch (error) {
        console.error('Error in applyPath:', error);
        setSelectedProject(null);
        setCurrentPage('home');
      }
    };

    // On mount, apply current path immediately
    applyPath();

    // Keep in sync when user navigates back/forward
    const onPopState = () => {
      applyPath();
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [basePath]);

  // Update the browser URL (history) when selectedProject or currentPage changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Prevent infinite loop by checking if we're already on the correct path
    const currentPath = window.location.pathname;
    
    try {
      if (selectedProject) {
        const desired = `/project/${selectedProject}`;
        const fullPath = withBase(desired === '/' ? '/' : desired);
        if (pathnameRef.current !== fullPath && currentPath !== fullPath) {
          window.history.pushState(null, '', fullPath);
          pathnameRef.current = fullPath;
        }
      } else if (currentPage === 'about') {
        const fullAbout = withBase('/about');
        if (pathnameRef.current !== fullAbout && currentPath !== fullAbout) {
          window.history.pushState(null, '', fullAbout);
          pathnameRef.current = fullAbout;
        }
      } else {
        const fullHome = withBase('/');
        if (pathnameRef.current !== fullHome && currentPath !== fullHome && currentPath !== basePath) {
          window.history.pushState(null, '', fullHome);
          pathnameRef.current = fullHome;
        }
      }
    } catch (error) {
      console.error('Error updating URL:', error);
    }
  }, [selectedProject, currentPage, withBase, basePath]);

  useEffect(() => {
    if (!selectedProject) {
      document.title = currentPage === 'about' ? 'About - SONGHEE PORTFOLIO' : 'SONGHEE PORTFOLIO';
    }
  }, [currentPage, selectedProject]);

  if (selectedProject) {
    return (
      <ProjectDetail
        projectId={selectedProject}
        onBack={() => {
          setSelectedProject(null);
          setCurrentPage('home');
        }}
        onNavigateToProject={(projectId: string) => {
          setSelectedProject(projectId);
          window.scrollTo(0, 0);
        }}
        onNavigateToAbout={() => {
          setSelectedProject(null);
          setCurrentPage('about');
          window.scrollTo({ top: 0, left: 0 });
        }}
        onNavigateToWork={() => {
          setSelectedProject(null);
          setCurrentPage('home');
          setTimeout(() => {
            const workSection = document.getElementById('work');
            if (workSection) {
              workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }}
      />
    );
  }
 
  if (currentPage === 'about') {
    return (
      <About
        onNavigateHome={() => {
          setCurrentPage('home');
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }}
        onNavigateToWork={() => {
          setCurrentPage('home');
          setTimeout(() => {
            const workSection = document.getElementById('work');
            if (workSection) {
              workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }}
        onNavigateToProject={(projectId: string) => {
          setSelectedProject(projectId);
          setCurrentPage('home');
        }}
      />
    );
  }
 
  return (
    <HomePage 
      onNavigateToAbout={() => {
        setCurrentPage('about');
        window.scrollTo({ top: 0, left: 0 });
      }}
      onNavigateToProject={(projectId: string) => {
        setSelectedProject(projectId);
        window.scrollTo(0, 0);
      }}
      withBase={withBase}
    />
  );
}

// 푸터 비디오 렌더링 컴포넌트 (UnicornStudio 임베드)
function FooterVideoComponent({ onHeightChange, active }: { onHeightChange?: (height: number) => void; active?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);

  // UnicornStudio 스크립트 로드 및 CSS 주입
  useEffect(() => {
    if (!active) return; // 활성화될 때만 초기화
    // CSS 스타일 주입으로 크기 강제 고정
    const styleId = 'unicorn-studio-footer-size-fix';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        [data-us-project="sq65ZowVOAEmIm6aEr1X"] {
          width: 1818px !important;
          height: 1080px !important;
          display: block !important;
          box-sizing: border-box !important;
        }
        [data-us-project="sq65ZowVOAEmIm6aEr1X"] > * {
          max-width: 100% !important;
          max-height: 100% !important;
          box-sizing: border-box !important;
        }
      `;
      document.head.appendChild(style);
    }

    // 원본 임베드 코드와 동일한 방식으로 스크립트 로드
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js';
      script.onload = function() {
        if (!window.UnicornStudio?.isInitialized) {
          if (window.UnicornStudio?.init) {
            window.UnicornStudio.init();
          }
          window.UnicornStudio.isInitialized = true;
        }
        setTimeout(() => {
          if (embedRef.current && window.UnicornStudio?.init) {
            window.UnicornStudio.init();
          }
        }, 100);
      };
      (document.head || document.body).appendChild(script);
    } else if (!window.UnicornStudio.isInitialized && window.UnicornStudio.init) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }
    
    const initCheck = () => {
      if (embedRef.current) {
        if (window.UnicornStudio && window.UnicornStudio.init) {
          window.UnicornStudio.init();
        }
      }
    };
    
    setTimeout(initCheck, 100);
    setTimeout(initCheck, 300);
    setTimeout(initCheck, 500);
    setTimeout(initCheck, 1000);
    setTimeout(initCheck, 2000);
  }, [active]);

  // 기존 비디오와 동일한 스타일 적용
  useEffect(() => {
    if (onHeightChange) {
      // 푸터 비디오는 aspect ratio 기반으로 높이 계산
      const aspectRatio = 1818 / 1080;
      const containerWidth = Math.min(window.innerWidth, 1180);
      const videoWidth = containerWidth * 0.8;
      const videoHeight = videoWidth / aspectRatio;
      onHeightChange(videoHeight + 80);
    }
  }, [onHeightChange]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    >
      <div
        ref={embedRef}
        data-us-project="sq65ZowVOAEmIm6aEr1X"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translateZ(0)',
          width: '1180px',
          height: '737.338px',
          maxWidth: '1180px',
          maxHeight: '100%',
          pointerEvents: 'none',
          display: 'block',
          opacity: 1,
          zIndex: 2,
          borderRadius: '100px 100px 0 0',
          overflow: 'hidden',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
}

// 비디오 렌더링 컴포넌트 (UnicornStudio 임베드)
function VideoComponent({ onHeightChange }: { onHeightChange?: (height: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);

  // UnicornStudio 스크립트 로드 및 CSS 주입
  useEffect(() => {
    // CSS 스타일 주입으로 크기 강제 고정
    const styleId = 'unicorn-studio-size-fix';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        [data-us-project="BfeBloN4OUPUvtFmV74y"] {
          width: 1818px !important;
          height: 1080px !important;
          display: block !important;
          box-sizing: border-box !important;
        }
        [data-us-project="BfeBloN4OUPUvtFmV74y"] > * {
          max-width: 100% !important;
          max-height: 100% !important;
          box-sizing: border-box !important;
        }
      `;
      document.head.appendChild(style);
    }

    // 원본 임베드 코드와 동일한 방식으로 스크립트 로드
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js';
      script.onload = function() {
        if (!window.UnicornStudio?.isInitialized) {
          if (window.UnicornStudio?.init) {
            window.UnicornStudio.init();
          }
          window.UnicornStudio.isInitialized = true;
        }
        // 스크립트 로드 후 임베드 요소가 있으면 다시 초기화 시도
        setTimeout(() => {
          if (embedRef.current && window.UnicornStudio?.init) {
            window.UnicornStudio.init();
          }
        }, 100);
      };
      (document.head || document.body).appendChild(script);
    } else if (!window.UnicornStudio.isInitialized && window.UnicornStudio.init) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }
    
    // 컴포넌트가 마운트된 후 DOM에 임베드가 추가되었을 때 초기화 재시도
    const initCheck = () => {
      if (embedRef.current) {
        if (window.UnicornStudio && window.UnicornStudio.init) {
          window.UnicornStudio.init();
        }
      }
    };
    
    setTimeout(initCheck, 100);
    setTimeout(initCheck, 300);
    setTimeout(initCheck, 500);
    setTimeout(initCheck, 1000);
    setTimeout(initCheck, 2000);
  }, []);

  // 기존 비디오와 동일한 스타일 적용
  useEffect(() => {
    if (!onHeightChange) return;

    const updateHeight = () => {
      const aspectRatio = 1080 / 1818;
      const width = containerRef.current
        ? containerRef.current.offsetWidth
        : typeof window !== 'undefined'
          ? window.innerWidth
          : 1180;
      const clampedWidth = Math.min(width, 1180);
      onHeightChange(clampedWidth * aspectRatio);
    };

    updateHeight();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [onHeightChange]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    >
      <div
        ref={embedRef}
        data-us-project="BfeBloN4OUPUvtFmV74y"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translateZ(0)',
          width: '100%',
          height: '100%',
          maxWidth: '1180px',
          maxHeight: '100%',
          pointerEvents: 'none',
          display: 'block',
          opacity: 1,
          zIndex: 2,
          borderRadius: '0 0 100px 100px',
          overflow: 'hidden',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
}

// 전문 분야 아이템 컴포넌트 (비디오 포함)
function ExpertiseItem({ skill, videoNumber, variants }: { skill: string; videoNumber: number; variants: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const retroRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [retroReady, setRetroReady] = useState(false);
  

  // 뷰포트 감지
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // 뷰포트에 들어왔을 때 기본 비디오 1회 재생
            if (videoRef.current && !hasPlayedOnce && !isHovered) {
              const video = videoRef.current;
              video.loop = false;
              if (video.readyState >= 2) {
                video.play().catch((err) => {
                  console.error('Video play error:', err);
                });
              }
            }
            // 마지막 3개(6,7,8)는 추가 예열: 200ms 정도 백그라운드 재생 후 일시정지
            if (retroRef.current && (videoNumber >= 6)) {
              try {
                const rv = retroRef.current;
                if (rv.paused) {
                  rv.muted = true;
                  rv.playsInline = true;
                  if (rv.readyState < 2) rv.load();
                  rv.currentTime = Math.max(0.001, rv.currentTime);
                  rv.play().then(() => {
                    setTimeout(() => { try { rv.pause(); } catch {} }, 220);
                  }).catch(() => {});
                }
              } catch {}
            }
          } else {
            // 뷰포트에서 벗어나면 리소스 절약을 위해 일시정지
            if (videoRef.current) {
              try { videoRef.current.pause(); } catch {}
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '50px'
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [hasPlayedOnce, isHovered]);

  // 레트로 영상 사전 로드 및 예열(지연 제거)
  useEffect(() => {
    const r = retroRef.current;
    if (!r) return;
    // 강제로 로드
    try { r.preload = 'auto'; r.muted = true; r.playsInline = true; } catch {}
    try { r.load(); } catch {}
    const onLoaded = () => {
      setRetroReady(true);
      // 한 번 재생 후 즉시 일시정지하여 디코더/첫 프레임 예열
      try { r.currentTime = 0.001; } catch {}
      r.play().then(() => {
        try { r.pause(); } catch {}
      }).catch(() => {
        // 자동재생이 차단되어도 muted라 대개 허용됨. 실패해도 이후 호버 시 재생됨
      });
    };
    r.addEventListener('loadeddata', onLoaded, { once: true });
    return () => r.removeEventListener('loadeddata', onLoaded);
  }, []);

  return (
    <motion.div 
      style={{ 
        textAlign: 'center',
        cursor: 'pointer'
      }}
      variants={variants}
      whileTap={{ scale: 0.99 }}
      onMouseEnter={() => {
        setIsHovered(true);
        // 레트로 영상 재생
        if (retroRef.current) {
          retroRef.current.loop = true;
          try { retroRef.current.currentTime = 0.001; } catch {}
          try { retroRef.current.playbackRate = 1.0; } catch {}
          retroRef.current.play().catch((err) => {
            console.error('Retro video play error:', err);
          });
        }
        // 기본 영상 즉시 멈춰 잔상 방지
        if (videoRef.current) {
          try { videoRef.current.pause(); } catch {}
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (retroRef.current) {
          retroRef.current.loop = false;
          retroRef.current.pause();
        }
        // 기본 영상은 1회만 재생하고 멈춤. 아직 재생 전이라면 재개
        if (videoRef.current && !hasPlayedOnce) {
          try { videoRef.current.play(); } catch {}
        }
      }}
    >
      <div 
        ref={containerRef}
        style={{
          position: 'relative',
          width: '69%',
          paddingBottom: '69%',
          margin: '0 auto',
          background: 'transparent',
          borderRadius: '20px',
          marginBottom: 'clamp(24px, 5vw, 48px)',
          overflow: 'hidden',
          transition: 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)'
        }}
      >
        {/* 기본 영상 - 뷰포트 진입 시 1회 재생 */}
        <video
          ref={videoRef}
          src={`${import.meta.env.BASE_URL}icon${videoNumber}.mp4`}
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isHovered ? 0 : 1,
            visibility: isHovered ? 'hidden' : 'visible',
            pointerEvents: 'none',
            transition: 'opacity 0.12s linear',
            transform: 'translateZ(0)',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden'
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.loop = false;
              // 뷰포트에 이미 들어와 있고 아직 재생 안 했으면 재생
              if (isInView && !hasPlayedOnce && !isHovered && videoRef.current.paused) {
                setTimeout(() => {
                  if (videoRef.current && isInView && !hasPlayedOnce && !isHovered) {
                    videoRef.current.play().catch((err) => {
                      console.error('Video play error:', err);
                    });
                  }
                }, 200);
              }
            }
          }}
          onCanPlay={() => {
            if (videoRef.current) {
              videoRef.current.loop = false;
              // 뷰포트에 들어와 있고 아직 재생 안 했으면 재생
              if (isInView && !hasPlayedOnce && !isHovered && videoRef.current.paused) {
                videoRef.current.play().catch((err) => {
                  console.error('Video play error:', err);
                });
              }
            }
          }}
          onEnded={() => {
            if (!isHovered) {
              setHasPlayedOnce(true);
              if (videoRef.current) {
                videoRef.current.pause();
              }
            }
          }}
          onError={(e) => {
            console.error(`Failed to load icon${videoNumber}.mp4`, e);
          }}
        />

        {/* 레트로 영상 - 호버 시만 표시/재생 */}
        <video
          ref={retroRef}
          src={`${import.meta.env.BASE_URL}icon${videoNumber}_retro.mp4`}
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isHovered ? 1 : 0,
            visibility: isHovered ? 'visible' : 'hidden',
            pointerEvents: 'none',
            transition: 'opacity 0.12s linear',
            transform: 'translateZ(0) scale(1.2)',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden'
          }}
          onError={(e) => {
            console.error(`Failed to load icon${videoNumber}_retro.mp4`, e);
          }}
        />
        
      </div>
      
      <p className="expertise-text" style={{
        fontSize: '20px',
        fontWeight: 600,
        lineHeight: 1.35,
        margin: 0,
        color: 'rgba(255, 255, 255, 0.85)'
      }}>
        {skill}
      </p>
    </motion.div>
  );
}

function HomePage({ onNavigateToAbout, onNavigateToProject, withBase }: { onNavigateToAbout: () => void; onNavigateToProject: (projectId: string) => void; withBase: (path: string) => string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);
  const heroSectionRef = useRef<HTMLElement>(null);
  const blurBgRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [videoHeight, setVideoHeight] = useState<number | null>(null);
  const [heroHeight, setHeroHeight] = useState<number | null>(null);
  const footerSectionRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState<number | null>(null);
  const [isFooterInView, setIsFooterInView] = useState(false);
  const [activateFooterEmbed, setActivateFooterEmbed] = useState(false);
  const heroEffectContainerRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState('');
  const [showMainText, setShowMainText] = useState(false);
  const typingIndexRef = useRef(0);
  const typingText = "I'm Songhee,\na UX/UI Designer";
  
  // 타이핑 애니메이션
  useEffect(() => {
    typingIndexRef.current = 0;
    setTypedText('');
    setShowMainText(false);
    
    const typingInterval = setInterval(() => {
      if (typingIndexRef.current < typingText.length) {
        setTypedText(typingText.slice(0, typingIndexRef.current + 1));
        typingIndexRef.current++;
      } else {
        clearInterval(typingInterval);
        // 타이핑 완료 후 잠시 대기하고 메인 텍스트 표시
        setTimeout(() => {
          setShowMainText(true);
        }, 800);
      }
    }, 80); // 타이핑 속도

    return () => clearInterval(typingInterval);
  }, [typingText]);
  
  // 화면 너비 감지
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 실행
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth scroll progress tracking
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      
      setIsScrolled(scrollY > 50);
      setIsCompact(scrollY > heroHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Unicorn Studio 효과 초기화
  useEffect(() => {
    const container = heroEffectContainerRef.current;
    if (!container || typeof window === 'undefined') return;

    const initEffect = () => {
      if (window.UnicornStudio && window.UnicornStudio.isInitialized && container) {
        try {
          const effectId = "c6k24zO7a5YYpZ33cvZM";
          
          // 방법 1: data-unicorn-id 사용 시도
          container.setAttribute('data-unicorn-id', effectId);
          
          // 방법 2: 직접 API 호출 시도
          const US = window.UnicornStudio as any;
          
          // 여러 가능한 API 메서드 시도
          if (US.render) {
            US.render(container, effectId);
          } else if (US.create) {
            US.create(container, effectId);
          } else if (US.load) {
            US.load(effectId, container);
          }
          
          // MutationObserver로 DOM 변화 감지하여 Unicorn Studio가 초기화하도록 유도
          const observer = new MutationObserver(() => {
            // Unicorn Studio가 자동으로 처리할 수 있도록 대기
          });
          
          observer.observe(container, {
            attributes: true,
            childList: true,
            subtree: true
          });
          
          setTimeout(() => {
            observer.disconnect();
          }, 2000);
          
        } catch (err) {
          console.error('Failed to initialize Unicorn Studio effect:', err);
        }
      }
    };

    // Unicorn Studio 로드 대기
    const checkUnicornStudio = () => {
      if (window.UnicornStudio && window.UnicornStudio.isInitialized) {
        setTimeout(initEffect, 300);
      } else if (window.UnicornStudio) {
        // 아직 초기화되지 않았으면 다시 시도
        setTimeout(checkUnicornStudio, 100);
      } else {
        // Unicorn Studio가 아직 로드되지 않았으면 대기
        setTimeout(checkUnicornStudio, 100);
      }
    };

    // 처음 시도
    setTimeout(checkUnicornStudio, 500);

    return () => {
      if (container) {
        container.removeAttribute('data-unicorn-id');
      }
    };
  }, []);

  // Footer in-view observer with 2s delay to activate embed
  useEffect(() => {
    const footerEl = footerSectionRef.current;
    if (!footerEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsFooterInView(true);
            setTimeout(() => setActivateFooterEmbed(true), 2000);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  // Animation variants - Spring-based physics
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.8
      }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.8
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: (custom: number) => ({ 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 1,
        delay: custom * 0.12
      }
    })
  };

  return (
    <div style={{ 
      backgroundColor: '#000', 
      width: '100%', 
      minHeight: '100vh',
      color: '#fff',
      fontFamily: '"Darker Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
    }}>
 
      {/* Google Fonts Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@100;200;300;400;500;600;700&display=swap');
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* 네온 펄스 효과 */
        @keyframes neonPulse {
          0%, 100% { 
            text-shadow: 
              0 0 0.5vw rgba(255, 217, 0, 0.8),
              0 0 1vw rgba(255, 217, 0, 0.6),
              0 0 1.5vw rgba(255, 217, 0, 0.4);
          }
          50% { 
            text-shadow: 
              0 0 0.7vw rgba(255, 217, 0, 1),
              0 0 1.4vw rgba(255, 217, 0, 0.8),
              0 0 2vw rgba(255, 217, 0, 0.6);
          }
        }
        
        /* 타이핑 커서 깜빡임 효과 */
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        /* 아주 작은 모바일 - 히어로 텍스트 제거 */
        @media (max-width: 480px) {
          .hero-content {
            display: none !important;
          }
        }
        
        /* 모바일 반응형 */
        @media (max-width: 768px) {
          /* 히어로 섹션 - 超集中 숨기기 */
          .hero-chinese {
            display: none !important;
          }
          
          /* 히어로 텍스트 가운데 정렬 */
          .hero-content {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-end !important;
            text-align: center !important;
            gap: 4vw !important;
          }
          
          .hero-main-text {
            max-width: 100% !important;
            text-align: center !important;
          }
          
          .hero-main-text h1 {
            font-size: clamp(28px, 8vw, 70px) !important;
            letter-spacing: -0.5vw !important;
          }
          
          /* 네비게이션 */
          nav {
            padding: 4vw 6vw !important;
          }
          
          nav > div:first-child {
            font-size: 4.5vw !important;
          }
          
          nav a {
            font-size: 3.5vw !important;
          }
          
          /* 섹션 패딩 */
          section {
            padding-left: 6vw !important;
            padding-right: 6vw !important;
          }
          
          /* 히어로 비디오 가운데 정렬 */
          .hero-video-container {
            justify-content: center !important;
            align-items: center !important;
          }
          
          .hero-video-container > div {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
          
          .hero-video-container > div > div {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Selected Work 그리드 */
          .work-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 5vw !important;
            row-gap: 7vw !important;
          }
          
          .work-grid > div {
            width: 100% !important;
          }
          
          .work-grid > div > div {
            width: 100% !important;
          }
          
          .work-grid > div > div > div {
            width: 100% !important;
            padding-bottom: 125% !important;
          }
          
          /* 작은 모바일 - 2x2 그리드 */
          @media (max-width: 480px) {
            .work-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 4vw !important;
              row-gap: 6vw !important;
            }
            
            .work-grid > div > div > div {
              padding-bottom: 125% !important;
            }
          }
          
          /* Expertise 그리드 */
          .expertise-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 5vw !important;
            row-gap: 6vw !important;
          }
          
          /* 제목 크기 */
          .section-title {
            font-size: 9vw !important;
            letter-spacing: -0.4vw !important;
            margin-bottom: 2.5vw !important;
          }
          
          .section-subtitle {
            font-size: 3.5vw !important;
          }
          
          /* 프로젝트 카드 텍스트 */
          .project-category {
            font-size: 4.5vw !important;
          }
          
          .project-tags {
            font-size: 3.2vw !important;
          }
          
          .project-card-title {
            font-size: 8vw !important;
          }
          
          .project-card-desc {
            font-size: 3.5vw !important;
          }
          
          /* Expertise 텍스트 */
          .expertise-text {
            font-size: 3.2vw !important;
          }
          
          /* CTA */
          .cta-title {
            font-size: 8vw !important;
            letter-spacing: -0.3vw !important;
            margin-bottom: 5vw !important;
          }
          
          .cta-button {
            padding: 2.5vw 5vw !important;
            font-size: 3vw !important;
            border-width: 1px !important;
          }
          
          /* 푸터 */
          footer {
            padding: 8vw 6vw 6vw !important;
          }
          
          /* 푸터 CTA 컨텐츠 우측 정렬 */
          .footer-cta-content {
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            text-align: right !important;
            flex-direction: column !important;
            align-items: flex-end !important;
          }
          
          /* 푸터 하단 컨텐츠 좌측 정렬 */
          .footer-bottom-content {
            left: 20px !important;
            right: auto !important;
            flex-direction: column !important;
            gap: 2vw !important;
          }
          
          .footer-logo {
            font-size: 3.5vw !important;
          }
          
          .footer-email {
            font-size: 3vw !important;
          }
        }
        
        /* 1400px 이하 - 컨텐츠 최대 너비 조정 */
        @media (max-width: 1400px) {
          nav > div {
            max-width: 1000px !important;
            padding-left: 50px !important;
            padding-right: 50px !important;
            padding-top: 12px !important;
            padding-bottom: 12px !important;
          }
          
          /* 히어로 섹션 컨텐츠 중앙 정렬 */
          .hero-content-wrapper {
            padding-left: clamp(20px, 4vw, 50px) !important;
            padding-right: clamp(20px, 4vw, 50px) !important;
          }
          
          /* 푸터 CTA 컨텐츠 우측 정렬 */
          .footer-cta-content {
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            text-align: right !important;
            flex-direction: column !important;
            align-items: flex-end !important;
          }
          
          /* 푸터 하단 컨텐츠 좌측 정렬 */
          .footer-bottom-content {
            left: 50px !important;
            right: auto !important;
          }
        }
        
        /* 1200px 이하 - 더 작게 */
        @media (max-width: 1200px) {
          nav > div {
            max-width: 900px !important;
            padding-left: 40px !important;
            padding-right: 40px !important;
            padding-top: 12px !important;
            padding-bottom: 12px !important;
          }
        }
        
        /* 992px 이하 */
        @media (max-width: 992px) {
          nav > div {
            padding-left: 30px !important;
            padding-right: 30px !important;
            padding-top: 12px !important;
            padding-bottom: 12px !important;
          }
          
          .work-grid {
            gap: 20px !important;
            row-gap: 35px !important;
          }
          
          .expertise-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
      
      {/* Smooth Scroll Progress Indicator */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #ffd900, #ff6b00, #ffd900)',
          transformOrigin: '0%',
          scaleX: smoothProgress,
          zIndex: 9999,
          boxShadow: '0 0 10px rgba(255, 217, 0, 0.8), 0 0 20px rgba(255, 217, 0, 0.4)'
        }}
      />
      
      {/* Glassmorphism Fixed Navigation with CRT effect */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: 0.2
        }}
        style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isScrolled ? 'rgba(0, 0, 0, 0.75)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(30px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(30px) saturate(180%)' : 'none',
        borderBottom: isScrolled ? '2px solid rgba(255, 217, 0, 0.15)' : '2px solid transparent',
        boxShadow: isScrolled ? '0 0 1vw rgba(255, 217, 0, 0.1), inset 0 0 2vw rgba(0, 0, 0, 0.5)' : 'none',
        overflow: 'visible'
      }}>
        {/* Nav Content Container */}
        <div style={{
          maxWidth: windowWidth <= 1400 ? (windowWidth <= 1200 ? '900px' : '1000px') : '1180px',
          margin: '0 auto',
          width: '100%',
          padding: windowWidth <= 768 ? '14px 20px' : (windowWidth <= 992 ? '12px 30px' : (windowWidth <= 1200 ? '12px 40px' : (windowWidth <= 1400 ? '12px 50px' : (isCompact ? '12px 60px' : '20px 60px')))),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ 
            fontSize: windowWidth <= 768 ? '18px' : (isCompact ? '17px' : '21px'), 
            fontWeight: 800,
            color: '#ffd900',
            transition: 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)'
          }}>
            SONGHEE ⓒ
          </div>
        <div style={{ display: 'flex', gap: windowWidth <= 768 ? '24px' : (isCompact ? '36px' : '47px') }}>
          <div 
          style={{ 
            position: 'relative',
            padding: '10px 15px',
            margin: '-10px -15px'
          }}
        >
            <motion.button 
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('work');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
              style={{ 
                color: '#ffd900', 
                textDecoration: 'none', 
                fontSize: windowWidth <= 768 ? '15px' : (isCompact ? '14px' : '17px'), 
                fontWeight: 600,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                willChange: 'transform'
              }}
              whileHover={{ 
                scale: 1.08,
                color: 'rgba(255, 217, 0, 0.7)',
                transition: { duration: 0.12, ease: 'easeOut' }
              }}
              whileTap={{ scale: 0.96, transition: { duration: 0.08 } }}
            >
              WORK
            </motion.button>
          </div>
          <motion.button 
            onClick={onNavigateToAbout}
            style={{ 
              color: '#ffd900', 
              textDecoration: 'none', 
              fontSize: windowWidth <= 768 ? '15px' : (isCompact ? '14px' : '17px'), 
              fontWeight: 600,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              willChange: 'transform'
            }}
            whileHover={{ 
              scale: 1.08,
              color: 'rgba(255, 217, 0, 0.7)',
              transition: { duration: 0.12, ease: 'easeOut' }
            }}
            whileTap={{ scale: 0.96, transition: { duration: 0.08 } }}
          >
            ABOUT
          </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        ref={heroSectionRef}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: heroHeight ? `${heroHeight}px` : '737.338px',
          height: heroHeight ? `${heroHeight}px` : '737.338px',
          overflow: 'hidden',
          borderRadius: '0 0 100px 100px'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* 배경 비디오 - 블러 제거 */}

        {/* Unicorn Studio 효과 - 비디오 위에 */}
        <div
          ref={heroEffectContainerRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'hidden',
            borderRadius: '0 0 100px 100px'
          }}
        />

        {/* 배경 임베드 제거 - 원래 상태로 복원 */}

        {/* 메인 영상 */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          className="hero-video-container"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: 1, 
            scale: 1
          }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0
          }}>
            {/* 비디오 - 꽉 차게 */}
            <div 
              ref={videoContainerRef}
            style={{
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <VideoComponent onHeightChange={(height) => {
                if (blurBgRef.current) {
                  blurBgRef.current.style.height = `${height}px`;
                }
                setHeroHeight(height);
                if (heroSectionRef.current) {
                  heroSectionRef.current.style.height = `${height}px`;
                }
              }} />
            </div>
          </div>
        </motion.div>


        <div style={{
              position: 'absolute',
              inset: 0,
          zIndex: 3,
              width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: 'clamp(60px, 12vh, 150px)',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <div className="hero-content-wrapper" style={{
            width: '100%',
            maxWidth: windowWidth <= 1400 ? (windowWidth <= 1200 ? '900px' : '1000px') : '1180px',
            position: 'relative',
            margin: '0 auto',
            padding: windowWidth <= 768 ? '14px 20px' : (windowWidth <= 992 ? '12px 30px' : (windowWidth <= 1200 ? '12px 40px' : (windowWidth <= 1400 ? '12px 50px' : '12px 60px'))),
            boxSizing: 'border-box'
        }}>
          <motion.div 
            className="hero-content" 
            style={{
                position: 'relative',
              width: '100%',
                height: '100%'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* 타이핑 텍스트 */}
            {!showMainText && (
              <motion.div 
                className="hero-typing-text" 
                style={{ 
                  position: 'absolute',
                  left: 0,
                  bottom: '-20px',
                  y: useTransform(smoothProgress, [0, 0.3], [0, -30])
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 style={{
                  fontSize: 'clamp(32px, 4.5vw, 70px)',
                  fontWeight: 600,
                  lineHeight: 0.95,
                  margin: 0,
                  textShadow: `
                    0 8px 50px rgba(0, 0, 0, 0.9),
                    0 4px 25px rgba(0, 0, 0, 0.8),
                    0 2px 12px rgba(0, 0, 0, 0.6)
                  `,
                  color: '#fff',
                  whiteSpace: 'pre-line'
                }}>
                  {typedText}
                  {!showMainText && (
                    <span style={{ 
                      animation: 'blink 1s infinite'
                    }}>|</span>
                  )}
                </h1>
              </motion.div>
            )}
            
            {/* 메인 텍스트 */}
            {showMainText && (
              <motion.div 
                className="hero-main-text" 
                style={{ 
                  position: 'absolute',
                  left: 0,
                  bottom: '-20px',
                  y: useTransform(smoothProgress, [0, 0.3], [0, -30])
                }}
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 25
                }}
              >
                <h1 style={{
                  fontSize: 'clamp(32px, 4.5vw, 70px)',
                  fontWeight: 600,
                  lineHeight: 0.95,
                  margin: 0,
                  textShadow: `
                    0 8px 50px rgba(0, 0, 0, 0.9),
                    0 4px 25px rgba(0, 0, 0, 0.8),
                    0 2px 12px rgba(0, 0, 0, 0.6)
                  `,
                  color: '#fff'
                }}>
                  Turning challenges
                  <br />
                  into opportunities!
                </h1>
              </motion.div>
            )}
            
            <motion.div 
              className="hero-chinese" 
              style={{ 
                  position: 'absolute',
                  right: 0,
                  bottom: '-20px',
                textAlign: 'right',
                y: useTransform(smoothProgress, [0, 0.3], [0, -20])
              }}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                type: "spring",
                  stiffness: 100,
                  damping: 25,
                  delay: 0.3
              }}
            >
              <AnimatedDots 
                baseText="超集中"
                style={{
                  fontSize: '45px',
                  fontWeight: 800,
                  color: '#ffd900',
                  margin: 0,
                  lineHeight: 0.9,
                  textShadow: `
                    0 6px 30px rgba(0, 0, 0, 0.9),
                    0 3px 15px rgba(0, 0, 0, 0.8),
                    0 0 20px rgba(255, 217, 0, 0.3)
                  `,
                  whiteSpace: 'nowrap',
                  fontFamily: '"Noto Serif HK", serif'
                }}
              />
            </motion.div>
          </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Selected Work Section */}
      <SectionWithAnimation id="work">
        <section id="work" style={{
          paddingTop: windowWidth < 768 ? '120px' : '180px',
          paddingBottom: windowWidth < 768 ? '80px' : '120px',
          paddingLeft: windowWidth <= 768 ? '20px' : (windowWidth <= 992 ? '30px' : (windowWidth <= 1200 ? '40px' : (windowWidth <= 1400 ? '50px' : '60px'))),
          paddingRight: windowWidth <= 768 ? '20px' : (windowWidth <= 992 ? '30px' : (windowWidth <= 1200 ? '40px' : (windowWidth <= 1400 ? '50px' : '60px'))),
          width: '100%',
          maxWidth: windowWidth <= 1400 ? (windowWidth <= 1200 ? '900px' : '1000px') : '1180px',
          margin: '0 auto'
        }}>
          <motion.div 
            style={{
              marginBottom: '45px',
              textAlign: 'left'
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInUp}
          >
            <h2 className="section-title" style={{
              fontSize: windowWidth < 768 ? '36px' : '45px',
              fontWeight: 600,
              marginBottom: '12px',
              color: '#fff'
            }}>
              Selected Work
            </h2>
            <p className="section-subtitle" style={{
              fontSize: windowWidth < 768 ? '14px' : '16px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.5)',
              margin: 0
            }}>
              Projects that shaped my creative journey
            </p>
          </motion.div>

          <div 
            className="work-grid" 
            style={{
              display: 'grid',
              gridTemplateColumns: windowWidth < 768 ? 'repeat(2, minmax(0, 1fr))' : 'repeat(2, 1fr)',
              gap: windowWidth < 768 ? '16px' : windowWidth < 1400 ? '20px' : '30px',
              rowGap: windowWidth < 768 ? '28px' : windowWidth < 1400 ? '40px' : '50px',
              width: '100%'
            }}
          >
            
            {/* Project Cards */}
            {[
              { 
                name: 'HourTaste',
                desc: '',
                category: 'HourTaste',
                tags: 'App Design / UX/UI',
                gradient: 'linear-gradient(135deg, rgba(234, 88, 12, 0.8) 0%, rgba(220, 38, 38, 0.75) 50%, rgba(185, 28, 28, 0.82) 100%)',
                neonColor: '#ea580c',
                projectId: 'hourtaste'
              },
              { 
                name: 'NOOK',
                desc: '',
                category: 'NOOK',
                tags: 'App Design / AR / UX/UI',
                gradient: 'linear-gradient(135deg, rgba(52, 115, 92, 0.82) 0%, rgba(16, 92, 70, 0.85) 50%, rgba(1, 51, 33, 0.88) 100%)',
                neonColor: '#10b981',
                projectId: 'nook'
              },
              { 
                name: 'Railway',
                desc: '',
                category: 'Railway Redesign',
                tags: 'Web Design / UX/UI',
                gradient: 'rgba(255, 255, 255, 0.06)',
                neonColor: '#3b82f6',
                projectId: 'railway-redesign'
              },
              { 
                name: "Cats' Peaceful Day",
                desc: '',
                category: "Cats' Peaceful Day",
                tags: 'Figure / Exhibition',
                gradient: 'rgba(255, 255, 255, 0.04)',
                neonColor: '#a855f7',
                projectId: 'cat-peaceful-day'
              }
            ].map((project, idx) => (
              <motion.div 
                key={idx} 
                style={{ width: '100%' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={scaleIn}
                custom={idx}
              >
                <a
                  href={withBase(`/project/${project.projectId}`)}
                  onClick={(e) => {
                    // Allow open-in-new-tab (meta/ctrl/middle click).
                    const mouseEvent = e as React.MouseEvent<HTMLAnchorElement>;
                    if (mouseEvent.button === 1 || mouseEvent.metaKey || mouseEvent.ctrlKey || mouseEvent.shiftKey) {
                      return; // let the browser handle it
                    }
                    e.preventDefault();
                    onNavigateToProject(project.projectId);
                  }}
                  style={{ cursor: 'pointer', display: 'block', textDecoration: 'none' }}
                >
                <TiltCard
                  maxTilt={3}
                  neonColor={project.neonColor}
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '125%',
                    borderRadius: '33px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 26px 65px rgba(0, 0, 0, 0.6), 0 13px 33px rgba(0, 0, 0, 0.4), inset 0 0 0 0.6px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    background: '#2a2a2a'
                  }} />
                  {/* Project-specific thumbnail image */}
                  {project.projectId === 'hourtaste' && (
                    <img
                      src={`${import.meta.env.BASE_URL}project1/projects1_thumb.png`}
                      alt={project.name}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  {project.projectId === 'nook' && (
                    <img
                      src={`${import.meta.env.BASE_URL}project2.png`}
                      alt={project.name}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  {project.projectId === 'cat-peaceful-day' && (
                    <img
                      src={`${import.meta.env.BASE_URL}project4.png`}
                      alt={project.name}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  {project.projectId === 'railway-redesign' && (
                    <img
                      src={`${import.meta.env.BASE_URL}project3.png`}
                      alt={project.name}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  {project.projectId !== 'hourtaste' && project.projectId !== 'nook' && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: project.gradient,
                      mixBlendMode: 'multiply',
                      opacity: 0.95
                    }} />
                  )}
                  
                  {project.desc && (
                    <div style={{
                      position: 'absolute',
                      top: '40px',
                      left: '40px',
                      right: '40px',
                      zIndex: 1
                    }}>
                      <h3 className="project-card-title" style={{
                        fontSize: '40px',
                        fontWeight: 700,
                        marginBottom: '13px',
                        lineHeight: 0.9,
                        textShadow: '0 6px 26px rgba(0, 0, 0, 0.8), 0 3px 13px rgba(0, 0, 0, 0.6)'
                      }}>
                        {project.name}
                      </h3>
                      <p className="project-card-desc" style={{
                        fontSize: '14px',
                        lineHeight: 1.5,
                        margin: 0,
                        textShadow: '0 3px 13px rgba(0, 0, 0, 0.75)',
                        opacity: 0.95,
                        fontWeight: 400
                      }}>
                        {project.desc}
                      </p>
                    </div>
                  )}
                </TiltCard>
                </a>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: windowWidth < 768 ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: windowWidth < 768 ? 'flex-start' : 'baseline',
                    gap: windowWidth < 768 ? '8px' : '0',
                    marginTop: '20px',
                    padding: windowWidth < 768 ? '0 8px' : windowWidth < 1400 ? '0 12px' : '0 16px'
                  }}
                >
                  <p
                    className="project-category"
                    style={{
                      fontSize: windowWidth < 768 ? '20px' : '24px',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      margin: 0,
                      color: '#fff'
                    }}
                  >
                    {project.category}
                  </p>
                  <p
                    className="project-tags"
                    style={{
                      fontSize: windowWidth < 768 ? '13px' : '15px',
                      fontWeight: 500,
                      lineHeight: 'normal',
                      margin: 0,
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    {project.tags}
                  </p>
                </div>
              </motion.div>
            ))}

          </div>
        </section>
      </SectionWithAnimation>

      {/* Expertise Section */}
      <SectionWithAnimation>
        <section style={{
          paddingTop: windowWidth < 768 ? '60px' : '60px',
          paddingBottom: windowWidth < 768 ? '180px' : '240px',
          paddingLeft: windowWidth <= 768 ? '20px' : (windowWidth <= 992 ? '30px' : (windowWidth <= 1200 ? '40px' : (windowWidth <= 1400 ? '50px' : '60px'))),
          paddingRight: windowWidth <= 768 ? '20px' : (windowWidth <= 992 ? '30px' : (windowWidth <= 1200 ? '40px' : (windowWidth <= 1400 ? '50px' : '60px'))),
          width: '100%',
          maxWidth: windowWidth <= 1400 ? (windowWidth <= 1200 ? '900px' : '1000px') : '1180px',
          margin: '0 auto',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(10,10,10,0.5) 100%)'
        }}>
          <motion.div 
            style={{
              marginBottom: '45px'
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInUp}
          >
            <h2 className="section-title" style={{
              fontSize: windowWidth < 768 ? '36px' : '45px',
              fontWeight: 600,
              marginBottom: '12px',
              color: '#fff'
            }}>
              Expertise I bring
            </h2>
            <p className="section-subtitle" style={{
              fontSize: windowWidth < 768 ? '14px' : '16px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.5)',
              margin: 0
            }}>
              Skills that drive meaningful experiences
            </p>
          </motion.div>

          <motion.div 
            className="expertise-grid" 
            style={{
              display: 'grid',
              gridTemplateColumns: windowWidth < 768 ? 'repeat(2, 1fr)' : windowWidth < 1024 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
              gap: windowWidth < 1400 ? '16px' : '19px',
              rowGap: 'clamp(50px, 8vw, 80px)',
              width: '100%',
              justifyContent: 'space-between'
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {[
              'UX Flow & Wireframing',
              'Interaction & Motion',
              'Product Thinking',
              'Branding & Visual Direction',
              'Design System Building'
            ].map((skill, i) => (
              <ExpertiseItem key={`base-${i+1}`} skill={skill} videoNumber={i + 1} variants={scaleIn} />
            ))}

            {/* Recreated items (to reset previous issues) */}
            <ExpertiseItem key={`fresh-6`} skill={'Information Architecture'} videoNumber={6} variants={scaleIn} />
            <ExpertiseItem key={`fresh-7`} skill={'Research & User Insight'} videoNumber={7} variants={scaleIn} />
            <ExpertiseItem key={`fresh-8`} skill={'Storytelling & Narrative UX'} videoNumber={8} variants={scaleIn} />
          </motion.div>
        </section>
      </SectionWithAnimation>

      {/* CTA Section with Footer Video Background */}
      <SectionWithAnimation>
        <section 
          ref={footerSectionRef}
          style={{
          position: 'relative',
            height: footerHeight ? `${footerHeight}px` : '80vh',
            minHeight: footerHeight ? `${footerHeight}px` : '80vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          paddingTop: '80px',
          borderRadius: '100px 100px 0 0'
          }}
        >
          {/* 배경 비디오 - 블러 제거 */}

          {/* 메인 영상 */}
          <motion.div
            style={{
            position: 'absolute',
            inset: 0,
              zIndex: 1,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              pointerEvents: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            borderRadius: '100px 100px 0 0'
            }}
            className="footer-video-container"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ 
              opacity: 1, 
              scale: 1
            }}
            transition={{ 
              duration: 0.8, 
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <FooterVideoComponent onHeightChange={(height) => {
                  setFooterHeight(height);
                  if (footerSectionRef.current) {
                    footerSectionRef.current.style.height = `${height}px`;
                  }
                }} active={activateFooterEmbed} />
              </div>
            </div>
          </motion.div>

          {/* CTA Content */}
          <motion.div 
            className="footer-cta-content"
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              maxWidth: windowWidth <= 1400 ? (windowWidth <= 1200 ? '900px' : '1000px') : '1180px',
              width: '100%',
              padding: `0 ${windowWidth <= 768 ? '20px' : (windowWidth <= 992 ? '30px' : (windowWidth <= 1200 ? '40px' : (windowWidth <= 1400 ? '50px' : '60px')))}`,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: windowWidth < 768 ? 'flex-start' : 'flex-end',
              gap: '38px'
            }}
            initial={{ opacity: 0.5 }}
            whileInView={{ 
              opacity: [0.5, 0.7, 0.6, 0.9, 1],
              filter: [
                'brightness(0.7)',
                'brightness(0.85)',
                'brightness(0.8)',
                'brightness(0.95)',
                'brightness(1)'
              ]
            }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 1.2,
              times: [0, 0.25, 0.4, 0.7, 1],
              ease: "easeOut"
            }}
          >
            <motion.h2 
              className="cta-title" 
              style={{
                fontSize: '64px',
                fontWeight: 600,
                lineHeight: 1,
                marginBottom: 0,
                textAlign: windowWidth < 768 ? 'left' : 'right'
              }}
              initial={{ 
                textShadow: '0 0 0px rgba(255, 217, 0, 0)'
              }}
              whileInView={{
                textShadow: [
                  '0 0 0px rgba(255, 217, 0, 0)',
                  '0 0 8px rgba(255, 217, 0, 0.15)',
                  '0 0 5px rgba(255, 217, 0, 0.1)',
                  '0 0 12px rgba(255, 217, 0, 0.2), 0 0 25px rgba(255, 217, 0, 0.1)',
                  '0 0 15px rgba(255, 217, 0, 0.25), 0 0 30px rgba(255, 217, 0, 0.15)'
                ]
              }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 1.2,
                times: [0, 0.25, 0.4, 0.7, 1],
                ease: "easeOut"
              }}
            >
              Let's create<br />
              something<br />
              meaningful.
            </motion.h2>
            
            <a href="mailto:allisvanitas@gmail.com" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <motion.button 
                className="cta-button" 
                style={{
                  padding: '10px 28px',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#fff',
                  background: 'transparent',
                  border: '2.5px solid rgba(255, 255, 255, 0.8)',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontFamily: '"Darker Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
                }}
                whileHover={{ 
                  y: -6,
                  scale: 1.03,
                  background: 'rgba(255, 255, 255, 1)',
                  color: '#000',
                  borderColor: 'rgba(255, 255, 255, 1)',
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }
                }}
                whileTap={{ 
                  scale: 0.97,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }
                }}
              >
                Get in touch →
              </motion.button>
            </a>
          </motion.div>

          {/* Footer Content */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            paddingBottom: 'clamp(40px, 8vh, 80px)',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <div className="footer-bottom-content" style={{
            maxWidth: windowWidth <= 1400 ? (windowWidth <= 1200 ? '900px' : '1000px') : '1180px',
              width: '100%',
              padding: `0 ${windowWidth <= 768 ? '20px' : (windowWidth <= 992 ? '30px' : (windowWidth <= 1200 ? '40px' : (windowWidth <= 1400 ? '50px' : '60px')))}`,
              display: 'flex',
              flexDirection: 'column',
              gap: windowWidth < 768 ? '6px' : '9px'
          }}>
            <div className="footer-content" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              paddingBottom: '0',
              borderBottom: 'none',
              pointerEvents: 'auto'
            }}>
              <p className="footer-logo" style={{
                fontSize: windowWidth < 768 ? '12px' : '14px',
                fontWeight: 600,
                lineHeight: 'normal',
                margin: 0,
                textShadow: '0 3px 13px rgba(0, 0, 0, 0.8)',
                color: '#fff'
              }}>
                SONGHEE ⓒ
              </p>
              <a href="mailto:allisvanitas@gmail.com" className="footer-email" style={{
                fontSize: windowWidth < 768 ? '12px' : '14px',
                fontWeight: 500,
                lineHeight: 'normal',
                margin: 0,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
              >
                allisvanitas@gmail.com
              </a>
            </div>
            </div>
          </div>
        </section>
      </SectionWithAnimation>

    </div>
  );
}

// Helper component for scroll animations
function SectionWithAnimation({ children, id }: { children: React.ReactNode; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <div ref={ref} id={id}>
      {children}
    </div>
  );
}

// Hero background embed removed to restore previous state
