import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useSpring } from 'motion/react';

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init: () => void;
      [key: string]: any;
    };
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
  const footerSectionRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState<number | null>(null);

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
          padding: isCompact ? '12px 60px' : '20px 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={onNavigateHome}
            style={{ 
              fontSize: isCompact ? '17px' : '21px', 
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
          <div style={{ display: 'flex', gap: isCompact ? '36px' : '47px' }}>
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
                  fontSize: isCompact ? '14px' : '17px', 
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
                fontSize: isCompact ? '14px' : '17px', 
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
          padding: '180px 60px 100px',
          maxWidth: '1180px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', marginBottom: '24px' }}>
            <pre style={{
              margin: 0,
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#000',
              color: '#fff',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '16px',
              lineHeight: 1.2,
              textAlign: 'left',
              overflowX: 'auto',
              textShadow: 'none'
            }}>
{`         _._         `}
{'\n'}
{`        (\\!/)        `}
{'\n'}
{`      .(|||||).      `}
{'\n'}
{`     ((/.'~'.\\))     `}
{'\n'}
{`     (! ^   ^ !)     `}
{'\n'}
{`     (~.=.-.=.~)     `}
{'\n'}
{`      |   <   |      `}
{'\n'}
{`      !  '-'  !      `}
{'\n'}
{`       !.___.!       `}
{'\n'}
{`      /'-. .-'\\      `}
{'\n'}
{` _.-~'\\_/\\ /\\_/'~-._ `}
{'\n'}
{`'         V         '`}
            </pre>
          </div>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{
              fontSize: '42px',
              fontWeight: 600,
              marginBottom: '0',
              color: '#fff'
            }}>
              About Me
            </h2>
          </div>

          <div>
            <p style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '22px',
              fontWeight: 400,
              fontFamily: 'SD Greta Sans'
            }}>
              저에게 디자인은 겉을 예쁘게 만드는 일이 아니라, 생각을 눈에 보이게 정리하는 과정입니다.<br />
              완성된 형태는 그 생각이 차근차근 펼쳐진 결과이고, 그 과정이 남긴 흔적입니다.
            </p>

            <p style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '22px',
              fontWeight: 400,
              fontFamily: 'SD Greta Sans'
            }}>
              그래서 작업을 시작할 때 항상 <strong style={{ fontWeight: 600 }}>&quot;왜 이 형태가 가장 좋은가?&quot;</strong>라는 질문부터 던집니다.
            </p>

            <p style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '22px',
              fontWeight: 400,
              fontFamily: 'SD Greta Sans'
            }}>
              아름다움을 보는 방식도 비슷합니다. 뭔가 아름답다는 건 단순히 보기 좋다는 게 아니라, 거기에 이유가 있다는 뜻입니다.<br />
              그 안에 담긴 가치, 질서, 존재 이유가 아름다움을 만듭니다.
            </p>

            <p style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '22px',
              fontWeight: 400,
              fontFamily: 'SD Greta Sans'
            }}>
              제가 만드는 디자인은 겉모습만 그럴듯한 게 아니라, 윤리와 균형 같은 깊은 가치가 함께 작동하길 바랍니다.
            </p>

            <p style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '22px',
              fontWeight: 400,
              fontFamily: 'SD Greta Sans'
            }}>
              겉은 명료하고 간결하게<br />
              속에는 정교한 논리와 정돈된 감정이 흐르도록
            </p>

            <p style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '22px',
              fontWeight: 400,
              fontFamily: 'SD Greta Sans'
            }}>
              제가 가장 중요하게 여기는 건 &#39;단순해 보이지만 깊이 있는 것&#39;입니다.
            </p>

            <p style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '0',
              fontWeight: 400,
              fontFamily: 'SD Greta Sans'
            }}>
              결국 제가 추구하는 디자인은 머리(논리)와 감각이 따로 놀지 않고 자연스럽게 만나는 지점입니다.<br />
              생각이 구체적인 감각을 만들고, 그 감각이 다시 생각을 더 선명하게 만드는 순환. 이 둘 사이의 건강한 긴장 속에서 진짜 의미 있는 디자인이 나온다고 믿습니다.
            </p>
          </div>
        </section>
      </SectionWithAnimation>

      {/* Education Section */}
      <SectionWithAnimation>
        <section style={{
          padding: '100px 60px 180px',
          maxWidth: '1180px',
          margin: '0 auto'
        }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{
              fontSize: '42px',
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
              textAlign: 'right',
              padding: '0 60px 0',
              maxWidth: '1180px',
              margin: '0 auto',
              width: '100%'
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 
              style={{
                fontSize: '64px',
                fontWeight: 600,
                lineHeight: 1,
                marginBottom: '38px'
              }}
            >
              Let's create<br />
              something<br />
              meaningful.
            </h2>
            
            <a href="mailto:allisvanitas@gmail.com" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <button 
                style={{
                  padding: '10px 28px',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#fff',
                  background: 'transparent',
                  border: '2.5px solid rgba(255, 255, 255, 0.8)',
                  borderRadius: '9999px',
                  cursor: 'pointer'
                }}
              >
                Get in touch →
              </button>
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
            <div style={{
              maxWidth: '1180px',
              width: '100%',
              padding: '0 clamp(40px, 8vw, 120px)',
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
