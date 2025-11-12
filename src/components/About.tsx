import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useSpring } from 'motion/react';

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init: () => void;
      [key: string]: any;
    };
    __unicornStudioScriptLoading?: Promise<void>;
  }
}

const UNICORN_STUDIO_SCRIPT_SRC = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js';

async function ensureUnicornStudioScriptLoaded() {
  if (typeof window === 'undefined') return;

  if (window.UnicornStudio?.init) {
    if (!window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }
    return;
  }

  if (!window.__unicornStudioScriptLoading) {
    window.__unicornStudioScriptLoading = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${UNICORN_STUDIO_SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', () => {
          if (window.UnicornStudio?.init && !window.UnicornStudio.isInitialized) {
            window.UnicornStudio.init();
            window.UnicornStudio.isInitialized = true;
          }
          resolve();
        }, { once: true });
        existing.addEventListener('error', (err) => {
          console.error('Failed to load UnicornStudio script', err);
          window.__unicornStudioScriptLoading = undefined;
          reject(err as Event);
        }, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = UNICORN_STUDIO_SCRIPT_SRC;
      script.async = true;
      script.onload = () => {
        if (window.UnicornStudio?.init && !window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
        resolve();
      };
      script.onerror = (err) => {
        console.error('Failed to load UnicornStudio script', err);
        window.__unicornStudioScriptLoading = undefined;
        reject(err as Event);
      };
      (document.head || document.body).appendChild(script);
    });
  }

  try {
    await window.__unicornStudioScriptLoading;
  } catch {
    // handled in promise rejection above
  }
}

interface AboutProps {
  onNavigateHome?: () => void;
  onNavigateToWork?: () => void;
  onNavigateToProject?: (projectId: string) => void;
}

// About 페이지 푸터 비디오 렌더링 컴포넌트 (UnicornStudio 임베드)
function AboutFooterVideoComponent({ onHeightChange }: { onHeightChange?: (height: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);

  // UnicornStudio 스크립트 로드 및 CSS 주입
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // CSS 스타일 주입으로 크기 강제 고정
    const styleId = 'unicorn-studio-about-footer-size-fix';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        [data-us-project="Lqr5PAiDQQZDRYgwJ0hC"] {
          width: 1818px !important;
          height: 1080px !important;
          display: block !important;
          box-sizing: border-box !important;
        }
        [data-us-project="Lqr5PAiDQQZDRYgwJ0hC"] > * {
          max-width: 100% !important;
          max-height: 100% !important;
          box-sizing: border-box !important;
        }
      `;
      document.head.appendChild(style);
    }

    let isCancelled = false;
    const timeoutIds: number[] = [];

    const scheduleInit = (delay: number) => {
      const id = window.setTimeout(() => {
        if (isCancelled) return;
        if (embedRef.current && window.UnicornStudio?.init) {
          window.UnicornStudio.init();
        }
      }, delay);
      timeoutIds.push(id);
    };

    ensureUnicornStudioScriptLoaded().then(() => {
      if (isCancelled) return;
      if (embedRef.current && window.UnicornStudio?.init) {
        window.UnicornStudio.init();
      }
      [100, 300, 500, 1000, 2000].forEach(scheduleInit);
    });

    return () => {
      isCancelled = true;
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, []);

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
        data-us-project="Lqr5PAiDQQZDRYgwJ0hC"
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

export default function About({ onNavigateHome, onNavigateToWork, onNavigateToProject }: AboutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  );
  const footerSectionRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState<number | null>(null);
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth <= 1024;

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 문서 제목 설정
  useEffect(() => {
    document.title = 'About - SONGHEE PORTFOLIO';
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // UnicornStudio 비디오를 페이지 진입 시 바로 로드
  useEffect(() => {
    ensureUnicornStudioScriptLoaded();
  }, []);

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

  const SectionWithAnimation = ({ children, id }: { children: React.ReactNode, id?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.05 });
    return <div ref={ref} id={id}>{children}</div>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ 
        backgroundColor: '#000', 
        width: '100%', 
        minHeight: '100vh',
        color: '#fff',
        fontFamily: '"Darker Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
      }}>
      
      {/* Font Imports */}
      <link rel="preconnect" href="https://4pl67mv56j.execute-api.ap-northeast-2.amazonaws.com" />
      <link rel="stylesheet" href="https://4pl67mv56j.execute-api.ap-northeast-2.amazonaws.com/v1/api/css/drop_fontstream_css/?sid=gAAAAABpAXw9Z1kK-P7e81ieW4WGtlt32HI2K7gJbY-WvazpQXj_FEsqywrroKMfMEd2GMEqQP-Ktipnz-Q4m5QT24jkFo_sljMLl_qzvsmgd6fK0MP5OANSpQOYrGxj4H9VCaUc9XiSmdyIdbi3fDZAgUGbU-qC8nnGQJV77uN4aiBrGhTcGMQlWg7J5Pt5DPCp_qz8NMWwXjx4OoydnNjqca5j0CZRDoOLgiUVtVJZ9kKlViajxR84ESogA1YHiKrfrghliwxN" charSet="utf-8" referrerPolicy="origin" />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@100;200;300;400;500;600;700&display=swap');
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        /* Get in touch button responsive styles */
        .get-in-touch-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-family: "Darker Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }

        /* Medium / tablet */
        @media (max-width: 768px) {
          .get-in-touch-btn {
            padding: 2.5vw 5vw !important;
            font-size: 3vw !important;
            border-width: 1px !important;
          }
        }

        /* Mobile */
        @media (max-width: 420px) {
          .get-in-touch-btn {
            font-size: 18px !important;
          }
        }
      `}</style>
      {/* Scroll Progress */}
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
      
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
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
          boxShadow: isScrolled ? '0 0 1vw rgba(255, 217, 0, 0.1)' : 'none',
          overflow: 'visible'
        }}
      >
        <div style={{
          maxWidth: '1180px',
          margin: '0 auto',
          width: '100%',
          padding: isMobile ? '14px 20px' : isCompact ? '12px 60px' : '20px 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={onNavigateHome}
            style={{ 
              fontSize: isMobile ? '18px' : isCompact ? '17px' : '21px', 
              fontWeight: 800,
              color: '#ffd900',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            SONGHEE ⓒ
          </button>
          <div style={{ display: 'flex', gap: isMobile ? '24px' : isCompact ? '36px' : '47px' }}>
            <div 
              style={{ 
                position: 'relative',
                padding: '10px 15px',
                margin: '-10px -15px'
              }}
            >
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateHome?.();
                  // 홈으로 이동한 후 Selected Work 섹션으로 스크롤
                  setTimeout(() => {
                    const workSection = document.getElementById('work');
                    if (workSection) {
                      workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                style={{ 
                  color: 'rgba(255, 217, 0, 0.6)', 
                  textDecoration: 'none', 
                fontSize: isMobile ? '15px' : isCompact ? '14px' : '17px', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0
                }}
              >
                WORK
              </button>
            </div>
            <div 
              style={{ 
                color: '#ffd900', 
                fontSize: isMobile ? '15px' : isCompact ? '14px' : '17px', 
                fontWeight: 600,
                position: 'relative',
                paddingBottom: '4px'
              }}
            >
              ABOUT
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#ffd900',
                  boxShadow: '0 0 8px rgba(255, 217, 0, 0.6)'
                }}
              />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* About Me Section */}
      <SectionWithAnimation>
        <section style={{
          padding: isMobile ? '140px 24px 80px' : isTablet ? '160px 40px 100px' : '180px 60px 100px',
          maxWidth: '1180px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(0, 1.5fr)',
            gap: isMobile ? '32px' : '48px',
            alignItems: 'start'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '18px' }}>
              <p style={{
                fontSize: isMobile ? '20px' : '22px',
                lineHeight: 1.6,
                color: '#fff',
                margin: 0,
                fontWeight: 600,
                fontFamily: 'SD Greta Sans',
                whiteSpace: 'pre-line'
              }}>
                안녕하세요,<br />UX/UI 디자이너 박송희입니다.
              </p>

              <p style={{
                fontSize: isMobile ? '15px' : '16px',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0,
                fontWeight: 400,
                fontFamily: 'SD Greta Sans',
                whiteSpace: 'pre-line'
              }}>
                생각과 감각이 만나는 지점을 설계하며,<br />이유 있는 아름다움을 탐구하고 있습니다.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginTop: isMobile ? '-8px' : 0 }}>
              <p style={{
                fontSize: isMobile ? '15px' : '16px',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
                fontWeight: 400,
                fontFamily: 'SD Greta Sans'
              }}>
                저는 복잡한 생각과 전략을 가장 명료한 시각 언어로 구조화하는 일을 합니다. 제게 완성된 디자인이란, 그 치열한 논리가 빚어낸 가장 명확한 해답입니다.
              </p>

              <p style={{
                fontSize: isMobile ? '15px' : '16px',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
                fontWeight: 400,
                fontFamily: 'SD Greta Sans'
              }}>
                그래서 제 디자인은 '왜'라는 질문에 답할 수 없는 장식을 허용하지 않습니다. 모든 시각적 결정은 순간의 감각이 아닌, 명확한 목적과 근거를 기반으로 합니다.
              </p>

              <p style={{
                fontSize: isMobile ? '15px' : '16px',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
                fontWeight: 400,
                fontFamily: 'SD Greta Sans'
              }}>
                겉으로 드러나는 단순함은 텅 비어있다는 뜻이 아닙니다. 오히려 그 이면에 치열하게 정돈된 논리적 질서와 세심한 감성이 받치고 있다는 증거입니다.
              </p>

              <p style={{
                fontSize: isMobile ? '15px' : '16px',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
                fontWeight: 400,
                fontFamily: 'SD Greta Sans'
              }}>
                저의 모든 작업은 "이것이 최선인가?", "이것이 꼭 필요한가?"라는 근본적인 질문에서 시작합니다. 이 과정을 통해 불필요한 것을 걷어내고, 오직 문제 해결이라는 핵심에만 집중합니다.
              </p>

              <p style={{
                fontSize: isMobile ? '15px' : '16px',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
                fontWeight: 400,
                fontFamily: 'SD Greta Sans'
              }}>
                결국 제가 추구하는 것은 차가운 이성(논리)과 따뜻한 감성(심미성)이 분리되지 않고 완벽하게 조화되는 지점입니다. 깊이 있으면서, 동시에 직관적인 디자인을 만듭니다.
              </p>
            </div>
          </div>
        </section>
      </SectionWithAnimation>

      {/* Education Section */}
      <SectionWithAnimation>
        <section style={{
          padding: isMobile ? '80px 24px 140px' : isTablet ? '90px 40px 160px' : '100px 60px 180px',
          maxWidth: '1180px',
          margin: '0 auto'
        }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{
              fontSize: isMobile ? '32px' : '42px',
              fontWeight: 600,
              marginBottom: '0',
              color: '#fff'
            }}>
              Education
            </h2>
          </div>

          <div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#fff',
              marginBottom: '10px'
            }}>
              Visual Design - Digital Media Major
            </h3>
            <p style={{
              fontSize: '17px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.65)',
              margin: 0
            }}>
              Korea Polytechnics · 2024-2026
            </p>
          </div>
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
            paddingTop: isMobile ? '60px' : '80px',
            borderRadius: isMobile ? '48px 48px 0 0' : '100px 100px 0 0'
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
                <AboutFooterVideoComponent onHeightChange={(height) => {
                  setFooterHeight(height);
                  if (footerSectionRef.current) {
                    footerSectionRef.current.style.height = `${height}px`;
                  }
                }} />
              </div>
            </div>
          </motion.div>

          {/* CTA Content */}
          <motion.div
            style={{
              position: 'relative',
              zIndex: 3,
              textAlign: isMobile ? 'left' : 'right',
              padding: isMobile ? '0 24px' : '0 60px 0',
              maxWidth: '1180px',
              margin: '0 auto',
              width: '100%'
            }}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="cta-title"
              style={{
                fontSize: '64px',
                fontWeight: 600,
                lineHeight: 1,
                marginBottom: '38px'
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
                ease: 'easeOut'
              }}
            >
              Let's create<br />
              something<br />
              meaningful.
            </motion.h2>
            
            <a
              href="mailto:allisvanitas@gmail.com"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
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
                    type: 'spring',
                    stiffness: 300,
                    damping: 15
                  }
                }}
                whileTap={{
                  scale: 0.97,
                  transition: {
                    type: 'spring',
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
            maxWidth: '1180px',
              width: '100%',
              padding: `0 ${isMobile ? '24px' : (windowWidth < 1400 ? 'clamp(20px, 4vw, 50px)' : 'clamp(40px, 8vw, 120px)')}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '9px'
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
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: 'normal',
                margin: 0,
                textShadow: '0 3px 13px rgba(0, 0, 0, 0.8)',
                color: '#fff'
              }}>
                SONGHEE ⓒ
              </p>
              <a href="mailto:allisvanitas@gmail.com" className="footer-email" style={{
                fontSize: '14px',
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

    </motion.div>
  );
}
