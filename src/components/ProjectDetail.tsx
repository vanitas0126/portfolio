import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

// Chart.js 차트 컴포넌트
function RailwayChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Chart.js 동적 로드
    const loadChart = async () => {
      if (!chartRef.current) return;
      
      // Chart.js가 이미 로드되었는지 확인
      if ((window as any).Chart) {
        createChart();
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
        script.onload = createChart;
        document.head.appendChild(script);
      }
    };

    const createChart = () => {
      if (!chartRef.current || chartInstanceRef.current) return;
      const Chart = (window as any).Chart;
      if (!Chart) return;

      const build = () => {
        const data = {
        labels: [
          '예매',
          '요금정보 및 할인',
          '실시간 운행정보',
          '노선, 역 시설 정보',
          '안전, 보안 정보',
          '계정 관리',
          '고객 지원',
          '모바일 친화',
          '다국어',
          '웹접근성',
          '미사용'
        ],
        datasets: [{
          label: '응답률 (%)',
          data: [66.7, 54.5, 51.5, 27.3, 21.2, 18.2, 18.2, 9.1, 6.1, 6.1, 3.0],
          backgroundColor: [
            '#10b981',
            '#059669',
            '#34d399',
            '#06b6d4',
            '#3b82f6',
            '#6366f1',
            '#8b5cf6',
            '#a78bfa',
            '#6ee7b7',
            '#a7f3d0',
            '#d1fae5'
          ],
          borderColor: 'rgba(16, 185, 129, 0.2)',
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 35
        }]
        };

        const config = {
        type: 'bar',
        data: data,
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { right: 24 } },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: false
            },
            // 퍼센트 레이블을 항상 표시
            datalabels: {
              color: '#fff',
              align: 'right',
              anchor: 'end',
              clamp: true,
              formatter: (val: number) => `${val}%`,
              font: { size: 12, weight: '600' }
            },
            tooltip: {
              backgroundColor: 'rgba(16, 185, 129, 0.95)',
              padding: 12,
              titleFont: {
                size: 13
              },
              bodyFont: {
                size: 13
              },
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#10b981',
              borderWidth: 1,
              callbacks: {
                label: function(context: any) {
                  return ' ' + context.parsed.x + '%';
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 70,
              grid: {
                color: 'rgba(16, 185, 129, 0.1)',
                drawBorder: false
              },
              ticks: {
                callback: function(value: any) {
                  return value + '%';
                },
                font: {
                  size: 11
                },
                color: '#666'
              }
            },
            y: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 12,
                  weight: '500'
                },
                color: '#aaa'
              }
            }
          },
          animation: {
            duration: 1200,
            easing: 'easeInOutQuart' as const
          }
        }
      };

      chartInstanceRef.current = new Chart(chartRef.current, config);
      };

      // datalabels 플러그인 로드 및 등록 후 생성
      if ((window as any).ChartDataLabels) {
        try { (window as any).Chart.register((window as any).ChartDataLabels); } catch {}
        build();
      } else {
        const p = document.createElement('script');
        p.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0';
        p.onload = () => { try { (window as any).Chart.register((window as any).ChartDataLabels); } catch {}; build(); };
        document.head.appendChild(p);
      }
    };

    loadChart();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ 
      marginTop: '50px', 
      marginBottom: '60px',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '16px',
      padding: '30px'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '8px',
        fontFamily: '"Darker Grotesque", sans-serif',
        color: '#fff',
        textAlign: 'center'
      }}>
        철도사이트에서 가장 중요한 기능은?
      </h3>
      <p style={{
        textAlign: 'center',
        color: '#888',
        fontSize: '13px',
        marginBottom: '24px',
        fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
      }}>
        2024.10.06 | 33명 대상 설문조사
      </p>
      <div style={{ position: 'relative', height: '320px' }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}

// HourTaste 데이터 차트 컴포넌트
function HourTasteDataChart() {
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const doughnut1Ref = useRef<HTMLCanvasElement>(null);
  const doughnut2Ref = useRef<HTMLCanvasElement>(null);
  const barChartInstanceRef = useRef<any>(null);
  const doughnut1InstanceRef = useRef<any>(null);
  const doughnut2InstanceRef = useRef<any>(null);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth <= 1024;

  useEffect(() => {
    const loadCharts = async () => {
      if ((window as any).Chart) {
        createCharts();
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = createCharts;
        document.head.appendChild(script);
      }
    };

    const createCharts = () => {
      if (!(window as any).Chart) return;

      const Chart = (window as any).Chart;
      Chart.defaults.color = '#555555';
      Chart.defaults.font.family = "'SD Greta Sans', 'IBM Plex Sans KR', sans-serif";

      // Bar Chart
      if (barChartRef.current && !barChartInstanceRef.current) {
        const ctx = barChartRef.current.getContext('2d');
        if (ctx) {
          barChartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['2023년', '2024년'],
              datasets: [{
                data: [36, 72],
                backgroundColor: ['#2a2a2a', '#FF6B3D'],
                borderRadius: 6,
                barPercentage: 0.5,
                categoryPercentage: 0.6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              layout: { padding: { top: 15, bottom: 3, left: 3, right: 3 } },
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 80,
                  grid: { color: '#1a1a1a', drawBorder: false },
                  ticks: { display: false }
                },
                x: {
                  grid: { display: false, drawBorder: false },
                  ticks: {
                    font: { size: 11, weight: '600' },
                    color: '#888888',
                    padding: 3
                  }
                }
              },
              animation: { duration: 0 }
            },
            plugins: [{
              afterDatasetDraw: (chart: any) => {
                const ctx = chart.ctx;
                const meta = chart.getDatasetMeta(0);
                meta.data.forEach((bar: any, index: number) => {
                  const value = chart.data.datasets[0].data[index];
                  ctx.fillStyle = '#ffffff';
                  ctx.font = 'bold 12px "SD Greta Sans", "IBM Plex Sans KR", sans-serif';
                  ctx.textAlign = 'center';
                  ctx.fillText(value + '억', bar.x, bar.y - 4);
                  
                  if (index === 1) {
                    ctx.fillStyle = '#FF6B3D';
                    ctx.font = '700 11px "SD Greta Sans", "IBM Plex Sans KR", sans-serif';
                    ctx.fillText('+100%', bar.x, bar.y - 18);
                  }
                });
              }
            }]
          });
        }
      }

      // Doughnut Chart 1
      if (doughnut1Ref.current && !doughnut1InstanceRef.current) {
        const ctx = doughnut1Ref.current.getContext('2d');
        if (ctx) {
          doughnut1InstanceRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
              datasets: [{
                data: [69, 100 - 69],
                backgroundColor: ['#5B9EFF', '#1a1a1a'],
                borderWidth: 0
              }]
            },
            options: {
              cutout: '78%',
              responsive: true,
              maintainAspectRatio: true,
              plugins: { tooltip: { enabled: false } },
              animation: { duration: 0 }
            }
          });
        }
      }

      // Doughnut Chart 2
      if (doughnut2Ref.current && !doughnut2InstanceRef.current) {
        const ctx = doughnut2Ref.current.getContext('2d');
        if (ctx) {
          doughnut2InstanceRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
              datasets: [{
                data: [70, 100 - 70],
                backgroundColor: ['#1DD1A1', '#1a1a1a'],
                borderWidth: 0
              }]
            },
            options: {
              cutout: '78%',
              responsive: true,
              maintainAspectRatio: true,
              plugins: { tooltip: { enabled: false } },
              animation: { duration: 0 }
            }
          });
        }
      }
    };

    loadCharts();

    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
        barChartInstanceRef.current = null;
      }
      if (doughnut1InstanceRef.current) {
        doughnut1InstanceRef.current.destroy();
        doughnut1InstanceRef.current = null;
      }
      if (doughnut2InstanceRef.current) {
        doughnut2InstanceRef.current.destroy();
        doughnut2InstanceRef.current = null;
      }
    };
  }, []);

  const containerGap = windowWidth <= 768 ? '18px' : '24px';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={{
        marginTop: '30px',
        marginBottom: '0px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gridTemplateRows: isMobile ? 'auto' : 'repeat(2, 1fr)',
        gap: containerGap,
        width: '100%',
        aspectRatio: isMobile ? undefined : '1 / 1'
      }}
    >
      {/* Section 1: Market */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '12px',
        padding: isMobile ? '28px 24px' : '40px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        minHeight: isMobile ? '320px' : undefined
      }}>
        <div style={{
          fontSize: '12px',
          color: '#555555',
          fontWeight: 600,
          letterSpacing: '0.15em',
          marginBottom: '16px',
          textTransform: 'uppercase',
          flexShrink: 0,
          fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
        }}>Market Growth</div>
        <div style={{
          fontSize: '22px',
          fontWeight: 700,
          lineHeight: 1.4,
          marginBottom: '24px',
          wordBreak: 'keep-all',
          flexShrink: 0,
          fontFamily: '"Darker Grotesque", sans-serif',
          color: '#fff'
        }}>마감할인 시장<br />1년만에 5.3배 성장</div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: isMobile ? '220px' : 0
        }}>
          <div style={{
            fontSize: 'clamp(50px, 10vw, 120px)',
            fontWeight: 800,
            color: '#FF6B3D',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            fontFamily: '"Darker Grotesque", sans-serif'
          }}>5.3<span style={{ fontSize: '0.5em' }}>배</span></div>
          <div style={{
            fontSize: '13px',
            color: '#999999',
            marginTop: '20px',
            textAlign: 'center',
            fontWeight: 500,
            fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
          }}>MZ세대 가치소비 확산</div>
        </div>
        <div style={{
          fontSize: '11px',
          color: '#555555',
          marginTop: 'auto',
          paddingTop: '28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          flexShrink: 0,
          fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
        }}>출처: 우리동네GS (2024)</div>
      </div>

      {/* Section 2: Business Model */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '12px',
        padding: isMobile ? '28px 24px' : '40px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        minHeight: isMobile ? '320px' : undefined
      }}>
        <div style={{
          fontSize: '12px',
          color: '#555555',
          fontWeight: 600,
          letterSpacing: '0.15em',
          marginBottom: '16px',
          textTransform: 'uppercase',
          flexShrink: 0,
          fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
        }}>Business Model</div>
        <div style={{
          fontSize: '22px',
          fontWeight: 700,
          lineHeight: 1.4,
          marginBottom: '24px',
          wordBreak: 'keep-all',
          flexShrink: 0,
          fontFamily: '"Darker Grotesque", sans-serif',
          color: '#fff'
        }}>랜덤박스는 수익성 높지만<br />소비자 선택권 낮음</div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: isMobile ? '220px' : 0,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '24px',
          width: '100%',
          marginBottom: '28px'
        }}>
          <div style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              paddingLeft: '25%',
              marginBottom: '10px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#fff',
                flex: 1,
                textAlign: 'center',
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
              }}>랜덤박스</div>
              <div style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#fff',
                flex: 1,
                textAlign: 'center',
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
              }}>재고공개</div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#999999',
                  fontWeight: 500,
                  flex: '0 0 23%',
                  fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
                }}>수익성</div>
                <div style={{
                  flex: 1,
                  display: 'flex',
                  gap: '16px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '8px 20px',
                    borderRadius: '5px',
                    flex: 1,
                    textAlign: 'center',
                    background: 'rgba(255, 107, 61, 0.15)',
                    color: '#FF6B3D',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
                  }}>높음</div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '8px 20px',
                    borderRadius: '5px',
                    flex: 1,
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#999999',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
                  }}>중간</div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#999999',
                  fontWeight: 500,
                  flex: '0 0 23%',
                  fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
                }}>운영효율</div>
                <div style={{
                  flex: 1,
                  display: 'flex',
                  gap: '16px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '8px 20px',
                    borderRadius: '5px',
                    flex: 1,
                    textAlign: 'center',
                    background: 'rgba(255, 107, 61, 0.15)',
                    color: '#FF6B3D',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
                  }}>높음</div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '8px 20px',
                    borderRadius: '5px',
                    flex: 1,
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#999999',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
                  }}>중간</div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#999999',
                  fontWeight: 500,
                  flex: '0 0 23%',
                  fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
                }}>선택권</div>
                <div style={{
                  flex: 1,
                  display: 'flex',
                  gap: '16px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '8px 20px',
                    borderRadius: '5px',
                    flex: 1,
                    textAlign: 'center',
                    background: 'rgba(255, 71, 87, 0.15)',
                    color: '#FF4757',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
                  }}>낮음</div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '8px 20px',
                    borderRadius: '5px',
                    flex: 1,
                    textAlign: 'center',
                    background: 'rgba(91, 158, 255, 0.15)',
                    color: '#5B9EFF',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
                  }}>높음</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '11px',
          color: '#555555',
          marginTop: 'auto',
          paddingTop: '28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          flexShrink: 0,
          fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
        }}>출처: Yang & Yu, INFORMS (2025)</div>
      </div>

      {/* Section 3: Problem */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '12px',
        padding: isMobile ? '28px 24px' : '40px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#555555',
          fontWeight: 600,
          letterSpacing: '0.15em',
          marginBottom: '16px',
          textTransform: 'uppercase',
          flexShrink: 0,
          fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
        }}>Problem</div>
        <div style={{
          fontSize: '22px',
          fontWeight: 700,
          lineHeight: 1.4,
          marginBottom: '24px',
          wordBreak: 'keep-all',
          flexShrink: 0,
          fontFamily: '"Darker Grotesque", sans-serif',
          color: '#fff'
        }}>비건·알러지 시장 급성장<br />랜덤박스는 소외</div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 0
        }}>
          <div style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            gap: '18px',
            alignItems: 'stretch'
          }}>
            <div style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              marginBottom: '28px'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
              }}>
                <div style={{
                  fontSize: 'clamp(40px, 6vw, 80px)',
                  fontWeight: 800,
                  color: '#FF4757',
                  lineHeight: 1,
                  fontFamily: '"Darker Grotesque", sans-serif'
                }}>22<span style={{ fontSize: '0.7em' }}>%</span></div>
                <div style={{
                  fontSize: '12px',
                  color: '#999999',
                  marginTop: '12px',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  textAlign: 'center',
                  fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
                }}>알러지 보유자<br />신뢰 비율</div>
              </div>
            </div>
            <div style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              marginBottom: '28px'
            }}>
              <div style={{
                height: '100%',
                width: '100%',
                position: 'relative'
              }}>
                <canvas ref={barChartRef} />
              </div>
              <div style={{
                fontSize: '12px',
                color: '#999999',
                fontWeight: 500,
                textAlign: 'center',
                marginTop: '15px',
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
              }}>비건 베이커리 시장 (2023→2024)</div>
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '11px',
          color: '#555555',
          marginTop: 'auto',
          paddingTop: '28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          flexShrink: 0,
          fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
        }}>출처: 식품표준청, 마크로밀엠브레인 (2024)</div>
      </div>

      {/* Section 4: Solution */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '12px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#555555',
          fontWeight: 600,
          letterSpacing: '0.15em',
          marginBottom: '16px',
          textTransform: 'uppercase',
          flexShrink: 0,
          fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
        }}>Solution</div>
        <div style={{
          fontSize: '22px',
          fontWeight: 700,
          lineHeight: 1.4,
          marginBottom: '24px',
          wordBreak: 'keep-all',
          flexShrink: 0,
          fontFamily: '"Darker Grotesque", sans-serif',
          color: '#fff'
        }}>재고공개로<br />투명성 확보</div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 0
        }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '14px' : '18px',
            width: '100%',
            height: '100%',
            alignItems: 'stretch'
          }}>
            <div style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: isMobile ? '20px' : '24px',
              width: '100%',
              marginBottom: isMobile ? '12px' : '28px'
            }}>
              <div style={{
                position: 'relative',
                width: isMobile ? '120px' : '140px',
                height: isMobile ? '120px' : '140px',
                marginBottom: isMobile ? '16px' : '20px'
              }}>
                <canvas ref={doughnut1Ref} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: isTablet ? '36px' : '40px',
                  fontWeight: 800,
                  color: '#5B9EFF',
                  fontFamily: '"Darker Grotesque", sans-serif'
                }}>69%</div>
              </div>
              <div style={{
                fontSize: isTablet ? '11px' : '12px',
                lineHeight: 1.5,
                textAlign: 'center',
                color: '#999999',
                fontWeight: 500,
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
              }}>상세정보 구매영향도</div>
            </div>
            <div style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: isMobile ? '20px' : '24px',
              width: '100%',
              marginBottom: isMobile ? '12px' : '28px'
            }}>
              <div style={{
                position: 'relative',
                width: isMobile ? '120px' : '140px',
                height: isMobile ? '120px' : '140px',
                marginBottom: isMobile ? '16px' : '20px'
              }}>
                <canvas ref={doughnut2Ref} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: isTablet ? '36px' : '40px',
                  fontWeight: 800,
                  color: '#1DD1A1',
                  fontFamily: '"Darker Grotesque", sans-serif'
                }}>70%</div>
              </div>
              <div style={{
                fontSize: isTablet ? '11px' : '12px',
                lineHeight: 1.5,
                textAlign: 'center',
                color: '#999999',
                fontWeight: 500,
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
              }}>건강영향 체감도</div>
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '11px',
          color: '#555555',
          marginTop: 'auto',
          paddingTop: '28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          flexShrink: 0,
          fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
        }}>출처: Food and Life, Flashfood (2024)</div>
      </div>
    </motion.div>
  );
}

// HourTaste 사용자 분석 차트 컴포넌트
function HourTasteUserChart() {
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartInstanceRef = useRef<any>(null);
  const windowWidth = useWindowWidth();
  const isTablet = windowWidth <= 1024;
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const loadCharts = async () => {
      if ((window as any).Chart) {
        createPieChart();
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = createPieChart;
        document.head.appendChild(script);
      }
    };

    const createPieChart = () => {
      if (!(window as any).Chart) return;

      const Chart = (window as any).Chart;
      Chart.defaults.color = '#555555';
      Chart.defaults.font.family = "'SD Greta Sans', 'IBM Plex Sans KR', sans-serif";

      // Pie Chart
      if (pieChartRef.current && !pieChartInstanceRef.current) {
        const ctx = pieChartRef.current.getContext('2d');
        if (ctx) {
          pieChartInstanceRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['사용 (18%)', '비활성 (50%)', '삭제 (32%)'],
              datasets: [{
                data: [18, 50, 32],
                backgroundColor: ['#FF6B3D', '#666666', '#2a2a2a'],
                borderWidth: 0,
                spacing: 2
              }]
            },
            options: {
              cutout: '45%',
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  enabled: true,
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  titleColor: '#fff',
                  bodyColor: '#fff',
                  padding: 10,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: 1
                }
              },
              animation: { duration: 0 }
            }
          });
        }
      }
    };

    loadCharts();

    return () => {
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
        pieChartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={{
        marginTop: '30px',
        marginBottom: '0px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '18px' : '24px',
        width: '100%'
      }}
    >
      {/* Section 1: User Status */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '12px',
        padding: isMobile ? '28px 24px' : '40px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: isMobile ? undefined : '1 / 1',
        minHeight: isMobile ? '300px' : undefined
      }}>
        <div style={{
          fontSize: '12px',
          color: '#555555',
          fontWeight: 600,
          letterSpacing: '0.15em',
          marginBottom: '16px',
          textTransform: 'uppercase',
          flexShrink: 0,
          fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
        }}>User Status</div>
        <div style={{
          fontSize: '22px',
          fontWeight: 700,
          lineHeight: 1.4,
          marginBottom: '24px',
          wordBreak: 'keep-all',
          flexShrink: 0,
          fontFamily: '"Darker Grotesque", sans-serif',
          color: '#fff'
        }}>82%가 비활성 또는<br />앱 삭제 상태</div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'flex-start' : 'space-between',
          alignItems: isMobile ? 'center' : 'flex-start',
          minHeight: 0,
          paddingTop: '0px',
          gap: isMobile ? '24px' : '30px',
          width: '100%'
        }}>
          {/* 차트 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flex: isMobile ? 'unset' : 1,
            width: isMobile ? '100%' : 'auto',
            padding: isMobile ? '0' : '10px 20px'
          }}>
              <div style={{
                width: isMobile ? '140px' : isTablet ? '160px' : '180px',
                height: isMobile ? '140px' : isTablet ? '160px' : '180px',
                position: 'relative',
                margin: isMobile ? '0 auto' : undefined
              }}>
                <canvas ref={pieChartRef} />
              </div>
          </div>
          {/* 범례 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flexShrink: 0,
            width: isMobile ? '100%' : 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#FF6B3D',
                flexShrink: 0
              }} />
              <span style={{
                fontSize: '15px',
                color: '#999999',
                fontWeight: 500,
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
              }}>사용 (18%)</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#666666',
                flexShrink: 0
              }} />
              <span style={{
                fontSize: '15px',
                color: '#999999',
                fontWeight: 500,
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
              }}>비활성 (50%)</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#2a2a2a',
                flexShrink: 0
              }} />
              <span style={{
                fontSize: '15px',
                color: '#999999',
                fontWeight: 500,
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
              }}>삭제 (32%)</span>
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '11px',
          color: '#555555',
          marginTop: 'auto',
          paddingTop: '28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          flexShrink: 0,
          fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
        }}>출처: Uppsala University (2021, N=22)</div>
      </div>

      {/* Section 2: Delete Reason */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '12px',
        padding: isMobile ? '28px 24px' : '40px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: isMobile ? undefined : '1 / 1',
        minHeight: isMobile ? '300px' : undefined
      }}>
        <div style={{
          fontSize: '12px',
          color: '#555555',
          fontWeight: 600,
          letterSpacing: '0.15em',
          marginBottom: '16px',
          textTransform: 'uppercase',
          flexShrink: 0,
          fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
        }}>Churn Analysis</div>
        <div style={{
          fontSize: '22px',
          fontWeight: 700,
          lineHeight: 1.4,
          marginBottom: '24px',
          wordBreak: 'keep-all',
          flexShrink: 0,
          fontFamily: '"Darker Grotesque", sans-serif',
          color: '#fff'
        }}>71%가 시간·위치·음식<br />불일치로 삭제</div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 0
        }}>
          <div style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            gap: isMobile ? '20px' : '30px',
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: isMobile ? 'flex-start' : 'center',
              width: '100%'
            }}>
              <div style={{
                fontSize: 'clamp(60px, 8vw, 100px)',
                fontWeight: 800,
                color: '#FF4757',
                lineHeight: 1,
                fontFamily: '"Darker Grotesque", sans-serif'
              }}>71<span style={{ fontSize: '0.7em' }}>%</span></div>
              <div style={{
                fontSize: '13px',
                color: '#999999',
                marginTop: '15px',
                fontWeight: 500,
                lineHeight: 1.4,
                textAlign: 'center',
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
              }}>앱 삭제 원인</div>
            </div>
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderLeft: '3px solid #FFC107',
                padding: '16px',
                borderRadius: '6px',
                fontSize: '15px',
                lineHeight: 1.5,
                color: '#999999',
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
              }}>
                픽업 시간에 생활 맞춰야 해서 불편
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderLeft: '3px solid #FF6B3D',
                padding: '16px',
                borderRadius: '6px',
                fontSize: '15px',
                lineHeight: 1.5,
                color: '#999999',
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
              }}>
                시간 맞추기 어렵고 매장 탐색 20-30분 소요
              </div>
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '11px',
          color: '#555555',
          marginTop: 'auto',
          paddingTop: '28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          flexShrink: 0,
          fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
        }}>출처: Uppsala University (2021, N=7, N=2)</div>
      </div>
    </motion.div>
  );
}

// HourTaste Solution Visualization Component
function HourTasteSolutionViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const linesRef = useRef<Array<{ line: SVGLineElement; problemCard: HTMLDivElement; solutionCard: HTMLDivElement }>>([]);

  useEffect(() => {
    const drawLines = () => {
      if (!containerRef.current || !svgRef.current) return;
      
      svgRef.current.innerHTML = '';
      linesRef.current = [];
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();

      for (let i = 1; i <= 3; i++) {
        const problemCard = container.querySelector(`#problem-${i}`) as HTMLDivElement;
        const solutionCard = container.querySelector(`#solution-${i}`) as HTMLDivElement;

        if (problemCard && solutionCard && svgRef.current) {
          const problemRect = problemCard.getBoundingClientRect();
          const solutionRect = solutionCard.getBoundingClientRect();

          const x1 = (problemRect.left + problemRect.width / 2) - containerRect.left;
          const y1 = problemRect.bottom - containerRect.top;
          
          const x2 = (solutionRect.left + solutionRect.width / 2) - containerRect.left;
          const y2 = solutionRect.top - containerRect.top;

          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', String(x1));
          line.setAttribute('y1', String(y1));
          line.setAttribute('x2', String(x2));
          line.setAttribute('y2', String(y2));
          line.style.stroke = '#262626';
          line.style.strokeWidth = '2';
          line.style.strokeDasharray = '4 4';
          line.style.transition = 'all 0.3s ease';
          svgRef.current.appendChild(line);
          linesRef.current.push({ line, problemCard, solutionCard });
        }
      }
      addHoverListeners();
    };

    const addHoverListeners = () => {
      linesRef.current.forEach(({ line, problemCard, solutionCard }) => {
        problemCard.addEventListener('mouseenter', () => {
          line.style.stroke = '#FF4757';
          line.style.strokeWidth = '3';
          line.style.strokeDasharray = 'none';
        });
        problemCard.addEventListener('mouseleave', () => {
          line.style.stroke = '#262626';
          line.style.strokeWidth = '2';
          line.style.strokeDasharray = '4 4';
        });
        
        solutionCard.addEventListener('mouseenter', () => {
          line.style.stroke = '#1DD1A1';
          line.style.strokeWidth = '3';
          line.style.strokeDasharray = 'none';
        });
        solutionCard.addEventListener('mouseleave', () => {
          line.style.stroke = '#262626';
          line.style.strokeWidth = '2';
          line.style.strokeDasharray = '4 4';
        });
      });
    };

    drawLines();
    const resizeObserver = new ResizeObserver(drawLines);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={{
        marginTop: '0px',
        marginBottom: '40px',
        width: '100%',
        position: 'relative'
      }}
    >
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 0,
          position: 'relative',
          justifyContent: 'center',
          padding: '20px 0'
        }}
      >
        <style>{`
          .solution-viz-header {
            font-size: clamp(13px, 1.6vmin, 17px);
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            opacity: 0.92;
            text-align: left;
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            margin-bottom: 1.8vmin;
          }
          .solution-viz-header.problem { color: #FF4757; }
          .solution-viz-header.solution { color: #1DD1A1; }
          .solution-viz-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2.6vmin;
            width: 100%;
          }
          .solution-viz-card {
            background: #141414;
            border: none;
            border-radius: 2.4vmin;
            padding: 3.2vmin;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            position: relative;
            transition: all 0.3s ease;
            z-index: 1;
            width: 100%;
          }
          .solution-viz-card-number {
            position: absolute;
            top: 2.2vmin;
            right: 2.8vmin;
            font-size: 6vmin;
            font-weight: 800;
            color: rgba(255, 255, 255, 0.05);
            line-height: 1;
            font-family: 'Pretendard', sans-serif;
          }
          .solution-viz-card-icon {
            font-size: 6vmin;
            margin-bottom: 2.4vmin;
            filter: grayscale(30%);
          }
          .solution-viz-card.problem .solution-viz-card-icon {
            filter: grayscale(100%);
            opacity: 0.6;
          }
          .solution-viz-card-title {
            font-size: clamp(16px, 2.2vmin, 22px);
            font-weight: 700;
            margin-bottom: 1.3vmin;
            line-height: 1.3;
            word-break: keep-all;
            color: #ffffff;
            font-family: 'Pretendard', sans-serif;
          }
          .solution-viz-card-desc {
            font-size: clamp(13px, 1.7vmin, 16px);
            color: rgba(215, 215, 215, 0.85);
            font-weight: 500;
            line-height: 1.45;
            word-break: keep-all;
            font-family: 'Pretendard', sans-serif;
          }
          .solution-viz-card.problem:hover {
            background: rgba(255, 71, 87, 0.1);
            transform: translateY(-0.5vmin);
          }
          .solution-viz-card.solution {
            background: linear-gradient(145deg, rgba(29, 209, 161, 0.12) 0%, rgba(20, 20, 20, 0.85) 100%);
            border: 1px solid rgba(29, 209, 161, 0.3);
          }
          .solution-viz-card.solution:hover {
            border-color: #1DD1A1;
            transform: translateY(-0.5vmin);
          }
          .solution-viz-badge {
            display: inline-block;
            background: rgba(29, 209, 161, 0.25);
            color: #1DD1A1;
            font-size: clamp(11px, 1.3vmin, 13px);
            font-weight: 700;
            padding: 0.6vmin 1.4vmin;
            border-radius: 100px;
            margin-bottom: 1.8vmin;
            letter-spacing: 0.06em;
            font-family: 'Pretendard', sans-serif;
          }
          .solution-viz-card.solution .solution-viz-card-number {
            color: rgba(29, 209, 161, 0.05);
          }
          @media (max-width: 768px) {
            .solution-viz-grid {
              grid-template-columns: 1fr;
              gap: 3.4vmin;
            }
            .solution-viz-card {
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              gap: 3.2vmin;
              padding: 3.4vmin;
            }
            .solution-viz-card-icon, .solution-viz-badge {
              margin-bottom: 0;
            }
            .solution-viz-card-number {
              position: static;
              font-size: 4.8vmin;
              order: 3;
              margin-left: auto;
            }
          }
        `}</style>
        
        {/* Problem Area */}
        <div className="solution-viz-header problem">Current Problems</div>
        <div className="solution-viz-grid" style={{ marginBottom: '6vmin' }}>
          <div className="solution-viz-card problem" id="problem-1">
            <div className="solution-viz-card-number">1</div>
            <div className="solution-viz-card-icon">📦</div>
            <div>
              <div className="solution-viz-card-title">특수 식단 배제</div>
              <div className="solution-viz-card-desc">비건, 알러지 등<br />랜덤박스의 한계</div>
            </div>
          </div>
          <div className="solution-viz-card problem" id="problem-2">
            <div className="solution-viz-card-number">2</div>
            <div className="solution-viz-card-icon">🔍</div>
            <div>
              <div className="solution-viz-card-title">탐색의 비효율성</div>
              <div className="solution-viz-card-desc">원하는 시간과 위치<br />찾기의 어려움</div>
            </div>
          </div>
          <div className="solution-viz-card problem" id="problem-3">
            <div className="solution-viz-card-number">3</div>
            <div className="solution-viz-card-icon">😟</div>
            <div>
              <div className="solution-viz-card-title">구매 실패 리스크</div>
              <div className="solution-viz-card-desc">원하는 제품이 없을<br />불확실성</div>
            </div>
          </div>
        </div>

        {/* Solution Area */}
        <div className="solution-viz-header solution">Our Solution</div>
        <div className="solution-viz-grid">
          <div className="solution-viz-card solution" id="solution-1">
            <div className="solution-viz-card-number">1</div>
            <div className="solution-viz-badge">선택권</div>
            <div>
              <div className="solution-viz-card-icon">📋</div>
              <div className="solution-viz-card-title">재고 공개 옵션</div>
              <div className="solution-viz-card-desc">랜덤박스 외<br />확정 구매 기능 제공</div>
            </div>
          </div>
          <div className="solution-viz-card solution" id="solution-2">
            <div className="solution-viz-card-number">2</div>
            <div className="solution-viz-badge">효율성</div>
            <div>
              <div className="solution-viz-card-icon">🔔</div>
              <div className="solution-viz-card-title">맞춤 알림 서비스</div>
              <div className="solution-viz-card-desc">선호 시간·위치·식단<br />자동 매칭 알림</div>
            </div>
          </div>
          <div className="solution-viz-card solution" id="solution-3">
            <div className="solution-viz-card-number">3</div>
            <div className="solution-viz-badge">지속성</div>
            <div>
              <div className="solution-viz-card-icon">✅</div>
              <div className="solution-viz-card-title">지도 스탬프 & 보상</div>
              <div className="solution-viz-card-desc">직관적 탐색 및<br />재방문 유도 리워드</div>
            </div>
          </div>
        </div>

        {/* SVG for drawing connector lines */}
        <svg
          ref={svgRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      </div>
    </motion.div>
  );
}

function NookServiceBackgroundViz() {
  const chart1Ref = useRef<HTMLCanvasElement>(null);
  const chart1InstanceRef = useRef<any>(null);
  const windowWidth = useWindowWidth();
  const isTablet = windowWidth <= 1024;
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const createCharts = () => {
      const Chart = (window as any).Chart;
      if (!Chart) return;

      if (chart1Ref.current && !chart1InstanceRef.current) {
        chart1InstanceRef.current = new Chart(chart1Ref.current, {
          type: 'bar',
          data: {
            labels: ['2022', '2023', '2024'],
            datasets: [{
              data: [83, 337, 540],
              backgroundColor: [
                'rgba(90, 90, 90, 0.9)',
                'rgba(16, 185, 129, 0.9)',
                '#10B981'
              ],
              borderRadius: 6,
              barPercentage: 0.45,
              categoryPercentage: 0.65
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 16, bottom: 8, left: 6, right: 6 } },
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 600,
                grid: { color: '#1a1a1a', drawBorder: false },
                ticks: { display: false }
              },
              x: {
                grid: { display: false, drawBorder: false },
                ticks: {
                  color: '#888888',
                  font: { size: 10, weight: '600' },
                  padding: 6
                }
              }
            },
            animation: { duration: 0 }
          },
          plugins: [{
            afterDatasetsDraw: (ctx: any) => {
              const chart = ctx.chart;
              const meta = chart.getDatasetMeta(0);
              meta.data.forEach((bar: any, index: number) => {
                const value = chart.data.datasets[0].data[index];
                const canvas = chart.ctx;
                canvas.save();
                canvas.font = '700 11px "SD Greta Sans", "IBM Plex Sans KR", sans-serif';
                canvas.fillStyle = index === 0 ? '#A0A0A0' : '#10B981';
                canvas.textAlign = 'center';
                canvas.fillText(String(value), bar.x, bar.y - 6);
                canvas.restore();
              });
            }
          }]
        });
      }

    };

    if ((window as any).Chart) {
      createCharts();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = createCharts;
      document.head.appendChild(script);
    }

    return () => {
      if (chart1InstanceRef.current) {
        chart1InstanceRef.current.destroy();
        chart1InstanceRef.current = null;
      }
    };
  }, []);

  const containerStyle = {
    width: '100%',
    maxWidth: '1180px',
    margin: isMobile ? '0 auto 48px' : '0 auto 72px',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
    gap: isMobile ? '20px' : '28px'
  } as const;

  const cardWrapperStyle = {
    position: 'relative',
    width: '100%',
    aspectRatio: isMobile ? undefined : '1 / 1',
    minHeight: isMobile ? '400px' : undefined,
    borderRadius: '22px',
    overflow: 'hidden',
    background: 'rgba(255, 255, 255, 0.12)'
  } as const;

  const sectionStyle = {
    position: isMobile ? 'relative' : 'absolute',
    inset: isMobile ? undefined : 0,
    padding: isMobile ? '28px 24px' : '38px',
    display: 'flex',
    flexDirection: 'column',
    gap: '26px',
    borderRadius: 'inherit',
    minHeight: isMobile ? '400px' : undefined
  } as const;

  const headerStyle = {
    fontSize: '13px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.58)',
    fontWeight: 600,
    fontFamily: '"Darker Grotesque", sans-serif'
  } as const;

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 1.35,
    color: '#ffffff',
    marginBottom: '22px',
    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
  } as const;

  const gridStyle = {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '14px' : '18px',
    alignItems: 'stretch',
    height: isMobile ? 'auto' : '100%',
    minHeight: isMobile ? '300px' : undefined
  } as const;

  const sourceStyle = {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.38)',
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
    letterSpacing: '0.02em'
  } as const;

  const problemReasons = ['제품 및 품질 신뢰', '치수 측정 어려움', '제품 신뢰도 낮음'];
  const rentalReasons = [
    { label: '저렴한 관리', value: '66%' },
    { label: '저렴한 초기비용', value: '55%' },
    { label: '소유권 이전', value: '39%' }
  ];
  const returnDrops = [
    { label: '사이즈', value: '71%' },
    { label: '색상·패턴', value: '58%' }
  ];

  const innerCardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '18px',
    padding: isMobile ? '20px' : '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
    minHeight: 0
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      style={containerStyle}
    >
      <div style={cardWrapperStyle}>
        <div style={sectionStyle}>
          <div style={headerStyle}>Market Opportunity</div>
          <h3 style={titleStyle}>'감도' 소비 증가로<br />디자이너 가구 848% 폭증</h3>
          <div style={gridStyle}>
            <div style={{ ...innerCardStyle }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#9DA0A6', textAlign: 'center' }}>'감도' 키워드 검색량 추이</div>
              <div style={{ position: 'relative', flex: 1, minHeight: isMobile ? '200px' : 0, width: '100%' }}>
                <canvas ref={chart1Ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              </div>
              <div style={{ fontSize: '11px', color: '#9DA0A6', textAlign: 'center' }}>2년간 6.5배 증가</div>
            </div>
            <div style={{ ...innerCardStyle, alignItems: 'center', justifyContent: 'center', gap: '18px' }}>
              <div style={{ fontSize: isMobile ? '42px' : '52px', fontWeight: 800, color: '#10B981', lineHeight: 1 }}>848%</div>
              <p style={{ margin: 0, fontSize: isMobile ? '14px' : '15px', color: 'rgba(255, 255, 255, 0.82)', textAlign: 'center', lineHeight: 1.55 }}>
                오늘의집 디자이너 가구<br />거래액 증가
              </p>
            </div>
          </div>
          <div style={sourceStyle}>출처: 네이버 트렌드, 오늘의 집(2025)</div>
        </div>
      </div>

      <div style={cardWrapperStyle}>
        <div style={sectionStyle}>
          <div style={headerStyle}>Problem</div>
          <h3 style={titleStyle}>높은 가격과 온라인 불확실성이 구매 장벽</h3>
          <div style={gridStyle}>
            <div style={{ ...innerCardStyle, justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: isMobile ? '120px' : '150px',
                    height: isMobile ? '120px' : '150px',
                    position: 'relative',
                    borderRadius: '50%',
                    background: 'conic-gradient(#F59E0B 0deg 180deg, rgba(34,34,34,0.85) 180deg 360deg)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                    margin: isMobile ? '0 auto' : undefined
                  }}>
                  <div style={{
                    position: 'absolute',
                    inset: '18px',
                    borderRadius: '50%',
                    background: 'rgba(5,5,5,0.92)',
                    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6)'
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: 800,
                    color: '#F59E0B'
                  }}>50%</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#9DA0A6', textAlign: 'center' }}>가격 때문에 구매 연기</div>
            </div>
            <div style={{ ...innerCardStyle, padding: '24px 28px', gap: '22px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#9DA0A6', textAlign: 'center' }}>온라인 구매 불편 요인</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
                {problemReasons.map((reason, index) => (
                  <div key={reason} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '999px', background: '#F59E0B', color: '#0B0B0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 800 }}>{index + 1}</div>
                    <span style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.88)', whiteSpace: isMobile ? 'normal' : 'nowrap', wordBreak: isMobile ? 'break-word' : 'normal' }}>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={sourceStyle}>출처: Why Some Consumers Are Putting Furniture Purchases on Hold (CIN, 2024, N=1,835) / 어반베이스 (2019, n=500)</div>
        </div>
      </div>

      <div style={cardWrapperStyle}>
        <div style={sectionStyle}>
          <div style={headerStyle}>Solution 1</div>
          <h3 style={titleStyle}>렌탈로 가격 장벽 해소, 5년간 2.5배 성장</h3>
          <div style={gridStyle}>
            <div style={{ ...innerCardStyle, alignItems: 'center', gap: '24px', minHeight: isMobile ? '240px' : undefined }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#9DA0A6', textAlign: 'center', letterSpacing: '0.08em' }}>국내 렌탈 시장 규모</div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
                gap: isMobile ? '14px' : '26px',
                width: '100%',
                height: '100%',
                padding: isMobile ? '0' : '0 8%'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '10px' }}>
                  <div style={{ width: '100%', height: '62%', background: 'rgba(90, 90, 90, 0.95)', borderRadius: '12px 12px 6px 6px', position: 'relative', boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.25)' }}>
                    <span style={{ position: 'absolute', top: '-26px', left: '50%', transform: 'translateX(-50%)', fontSize: '16px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.78)', whiteSpace: 'nowrap' }}>40조</span>
                  </div>
                  <span style={{ display: 'none' }}>일반 제품</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.5)' }}>2020</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '10px' }}>
                  <div style={{ width: '100%', height: '100%', background: '#10B981', borderRadius: '12px 12px 6px 6px', position: 'relative', boxShadow: '0 -6px 22px rgba(16, 185, 129, 0.4)' }}>
                    <span style={{ position: 'absolute', top: '-26px', left: '50%', transform: 'translateX(-50%)', fontSize: '16px', fontWeight: 700, color: '#12CC8C', whiteSpace: 'nowrap' }}>100조</span>
                    <span style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', padding: '4px 10px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.92)', color: '#0b0b0b', fontSize: '12px', fontWeight: 700 }}>×2.5</span>
                  </div>
                  <span style={{ display: 'none' }}>AR 제품</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.5)' }}>2025</span>
                </div>
              </div>
            </div>
            <div style={{ ...innerCardStyle, gap: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#9DA0A6', textAlign: 'center', letterSpacing: '0.08em' }}>렌탈 선택 이유</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
                {rentalReasons.map((item) => (
                  <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255, 255, 255, 0.78)', fontWeight: 600 }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.74)' }}>{item.label}</span>
                      <span style={{ color: '#ffffff' }}>{item.value}</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.12)', overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        width: item.value,
                        height: '100%',
                        borderRadius: '999px',
                        background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.85) 0%, rgba(16, 185, 129, 1) 100%)',
                        boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={sourceStyle}>출처: 마크로밀 엠브레인 트렌드모니터 (2024) / 엠브레인트렌드모니터 (2012, n=1000)</div>
        </div>
      </div>

      <div style={cardWrapperStyle}>
        <div style={sectionStyle}>
          <div style={headerStyle}>Solution 2</div>
          <h3 style={titleStyle}>AR로 제품 불확실성 해소, 전환율 업</h3>
          <div style={gridStyle}>
            <div style={{ ...innerCardStyle, alignItems: 'center', gap: '24px', minHeight: isMobile ? '240px' : undefined }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#9DA0A6', textAlign: 'center' }}>구매 전환율 비교</div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
                gap: isMobile ? '14px' : '26px',
                width: '100%',
                height: '100%',
                padding: isMobile ? '0' : '0 8%'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '10px' }}>
                  <div style={{ width: '100%', height: '62%', background: 'rgba(80, 80, 80, 0.95)', borderRadius: '12px 12px 6px 6px', position: 'relative', boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.25)' }}>
                    <span style={{ position: 'absolute', top: '-28px', left: '50%', transform: 'translateX(-50%)', fontSize: '16px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.75)' }}>100</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.65)' }}>일반 제품</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '10px' }}>
                  <div style={{ width: '100%', height: '100%', background: '#3B82F6', borderRadius: '12px 12px 6px 6px', position: 'relative', boxShadow: '0 -6px 22px rgba(59, 130, 246, 0.28)' }}>
                    <span style={{ position: 'absolute', top: '-26px', left: '50%', transform: 'translateX(-50%)', fontSize: '16px', fontWeight: 700, color: '#3B82F6' }}>194</span>
                    <span style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', padding: '4px 10px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.92)', color: '#0b0b0b', fontSize: '12px', fontWeight: 700 }}>+94%</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.65)' }}>AR 제품</span>
                </div>
              </div>
            </div>
            <div style={{ ...innerCardStyle, gap: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#9DA0A6', textAlign: 'center' }}>반품 감소율</div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                flex: 1,
                width: '100%',
                padding: '0 6%'
              }}>
                {returnDrops.map((item) => (
                  <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: '10px', width: '100%' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.76)', fontWeight: 600, textAlign: 'left' }}>{item.label}</span>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#EF4444', textAlign: 'center' }}>↓</span>
                    <span style={{ fontSize: '26px', fontWeight: 800, color: '#EF4444', textAlign: 'right' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={sourceStyle}>출처: Shopify (2022) / Macy's, West Elm (2019~2023, Research)</div>
        </div>
      </div>
    </motion.div>
  );
}

function InlineVideoOnce({ src, alt }: { src: string; alt?: string }) {
  const hasReachedOneSecond = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      preload="metadata"
      controls
      loop={false}
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: '12px',
        border: '1px solid rgba(255, 217, 0, 0.08)',
        background: 'rgba(255,255,255,0.02)'
      }}
      onCanPlay={(e) => {
        const v = e.currentTarget;
        videoRef.current = v;
        // play when in view using IntersectionObserver
        const obs = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // 한 번 1초에 도달했으면 재생하지 않고 고정
              if (v.paused && !hasReachedOneSecond.current) {
                v.currentTime = 0;
                v.play().catch(() => {});
              } else if (hasReachedOneSecond.current) {
                // 이미 1초에 도달했으면 1초 위치로 고정
                try { v.currentTime = 1; v.pause(); } catch {}
              }
            } else {
              try { v.pause(); } catch {}
            }
          });
        }, { threshold: 0.6 });
        obs.observe(v);
        v.onended = () => {
          try { v.pause(); } catch {}
        };
      }}
      onTimeUpdate={(e) => {
        const v = e.currentTarget;
        if (v.currentTime >= 1 && !hasReachedOneSecond.current) {
          hasReachedOneSecond.current = true;
          try { v.pause(); } catch {}
          // 정확히 1초 프레임에서 멈추도록 보정
          try { v.currentTime = 1; } catch {}
        }
      }}
    >
      {alt && <track kind="captions" label={alt} />}
    </video>
  );
}

interface ProjectData {
  id: string;
  title: string;
  heroImage: string;
  heroVideo?: string; // 동영상 경로 또는 YouTube URL
  isYouTube?: boolean; // YouTube 여부
  myRole: string[];
  team: string[];
  duration: string;
  industry: string;
  summary: string;
  sections: {
    title: string;
    content: string;
    image?: string;
  }[];
}

// 실제 프로젝트 데이터
const projectsData: { [key: string]: ProjectData } = {
  'railway-redesign': {
    id: 'railway-redesign',
    title: 'Railway Redesign',
    heroImage: `${import.meta.env.BASE_URL}project3/projects3_thumb.png`,
    myRole: ['Lead UX/UI Designer', 'Web Designer', 'User Research'],
    team: ['3명 (기획 공동, 디자인 1명)'],
    duration: '3 months',
    industry: 'Transportation / Public Service',
    summary: '나이지리아 철도공사(NRC) 웹사이트에서 기업/투자자 정보(B2B)와 승객 이용 정보(B2C)가 한 화면에 섞여 있던 문제를 해결하기 위해, 철도 산업의 기본 원칙인 상하 분리를 사이트 구조에 반영한 프로젝트입니다.\n승객 포털과 기업 사이트를 분리하여 각 사용자 그룹의 목적에 맞는 접근 경로를 제공했습니다.',
    sections: [
      {
        title: '문제 (WHY)',
        content: '나이지리아 철도공사(NRC) 웹사이트는 기업/투자자 정보(B2B)와 승객 이용 정보(B2C)가 한 화면에 섞여 있었습니다.\n철도 산업의 기본 원칙인 상하 분리(인프라/운영 분리)가 사이트 구조에 반영되지 않은 상태였습니다.',
      },
      {
        title: '근거 (EVIDENCE)',
        content: '승객은 실행 기능을 가장 먼저 찾습니다 (예매 66.7% / 요금 54.5% / 운행정보 51.5%).\n독일/한국 등 국철 사이트 사례에서도 승객 포털과 기업 사이트가 명확히 분리되어 있습니다.',
        image: 'user research data global comparison'
      },
      {
        title: '전략 (HOW)',
        content: '승객 실행 기능(예매/요금) → 승객 전용 포털로 분리, 포털 진입은 헤더에 고정 CTA 버튼으로 제공.\n기업 정보(회사소개/정책/프로젝트) → 메인 사이트 중심 재편.',
        image: 'domain-driven ia reconstruction'
      }
    ]
  },
  'hourtaste': {
    id: 'hourtaste',
    title: 'HourTaste',
    heroImage: `${import.meta.env.BASE_URL}project1/projects1_thumb.png`,
    heroVideo: undefined,
    myRole: ['Product Designer', 'UX/UI Designer', 'Service Planner'],
    team: ['박송희 (1명)'],
    duration: '15 weeks',
    industry: 'Food Tech / E-commerce',
    summary: 'HourTaste는 단순한 마감 할인을 넘어, 개인 맞춤 알림과 "지도 스탬프"라는 재미 요소를 더해, 사용자가 계속 방문하며 "나만의 맛집 지도"를 완성해나가는 서비스입니다.',
    sections: [
      {
        title: '시장배경',
        content: '',
      },
      {
        title: 'Solution',
        content: '시간대별 동적 할인율이 핵심입니다. 마감 2시간 전 20% 할인으로 시작하여, 마감 30분 전에는 최대 60%까지 할인율이 올라갑니다. 사용자는 실시간으로 변하는 할인율을 보며 최적의 타이밍에 구매할 수 있습니다. 게이미피케이션 요소를 더해 "할인 헌터" 배지 시스템도 도입했습니다.',
        image: 'mobile app timer discount'
      },
      {
        title: 'Onboarding',
        content: '사용자가 자주 방문하는 \'주요 위치\'와 알림을 받고 싶은 \'알림 시간\'을 미리 설정합니다. 이는 불필요한 탐색 없이 원하는 상품 정보를 적시에 제공받기 위한 핵심 장치입니다.\n\n\'랜덤박스\'의 한계를 극복하기 위해 \'선호 식단\' 및 \'알레르기/기피 재료\'를 사전에 필터링합니다. 이를 통해 사용자는 구매 실패 리스크 없이 자신에게 맞는 상품만 추천받을 수 있습니다.',
        image: `${import.meta.env.BASE_URL}project1/온보딩.png`
      },
      {
        title: 'Home to Payment',
        content: '홈 화면과 상세 페이지에서 \'오늘의 메뉴\', \'내일의 메뉴\' 등 재고를 투명하게 공개합니다. 사용자는 더 이상 내용물을 모르는 랜덤 상품이 아닌, \'골든 서프라이즈 백\'처럼 원하는 메뉴를 직접 눈으로 확인하고 \'확정 구매\'할 수 있습니다.',
        image: `${import.meta.env.BASE_URL}project1/홈-결제.png`
      },
      {
        title: 'After Payment',
        content: '픽업 완료 즉시(4번), 사용자는 절약한 금액(3,900원)과 탄소 절감량(2.5kg CO₂e)이라는 2가지 핵심 가치를 확인합니다. 이어서 \'새로운 도장\'이 바로 발급되며(5번), 쿠폰까지 남은 횟수(9/10)를 시각적으로 보여줍니다.\n\n이 즉각적인 가치 확인과 보상은 사용자에게 강한 성취감과 재방문 동기를 부여합니다.',
        image: `${import.meta.env.BASE_URL}project1/결제 이후.png`
      }
    ]
  },
  'nook': {
    id: 'nook',
    title: 'NOOK',
    heroImage: `${import.meta.env.BASE_URL}project2/Indoor 1.1.png`,
    myRole: ['Lead Product Designer', 'AR UX Designer', 'Service Planner'],
    team: ['3 Product Strategy (공동)'],
    duration: '15 weeks',
    industry: 'Furniture / AR Tech / Rental Service',
    summary: 'NOOK은 명품 가구를 구매 전 AR로 내 공간에 미리 배치해보고, 합리적인 가격에 렌탈할 수 있는 서비스입니다. AR 기술과 가구 렌탈을 결합하여 새로운 인테리어 경험을 제공하는 앱을 기획하고 디자인했습니다.',
    sections: [
      {
        title: '서비스 기획',
        content: '명품 가구는 가격이 비싸 구매 결정이 어렵고, 실제 공간에 놓았을 때의 느낌을 사전에 확인하기 어렵습니다. 또한 이사나 라이프스타일 변화로 가구를 자주 바꾸고 싶어하는 니즈가 증가하고 있습니다. NOOK은 AR 기술로 가구 배치를 시뮬레이션하고, 렌탈 서비스로 부담을 낮춘 새로운 형태의 인테리어 플랫폼입니다.',
      },
      {
        title: 'Home to Detail Page',
        content: '사용자가 \'일시불 구매(Sales)\'를 할지, 아니면 가격 장벽을 낮추는 \'렌탈(Rental)\'을 할지 선택하는 가장 중요한 분기점입니다.\n\n이 단계에서 사용자는 두 가지 옵션의 가격과 조건을 비교하고 자신의 상황에 맞는 모델을 선택하게 됩니다.',
        image: `${import.meta.env.BASE_URL}project2/홈-상세페이지.png`
      },
      {
        title: '3D/AR',
        content: 'AR을 통해 3D 모델을 실제 공간에 배치해 봄으로써, 사용자는 값비싼 가구를 구매(혹은 렌탈)하기 전 실패 리스크를 최소화할 수 있습니다\n\n단순히 가구를 배치하는 것을 넘어, 가로/세로/높이(60cm, 57.5cm 등)의 실측 치수를 AR 화면에 바로 표시해줍니다. 이는 특히 까다로운 설치가 필요하거나 공간에 딱 맞아야 하는 \'렌탈\' 서비스를 결정할 때, 사용자에게 결정적인 확신을 줍니다',
        image: `${import.meta.env.BASE_URL}project2/3D.png`
      }
    ]
  },
  'cat-peaceful-day': {
    id: 'cat-peaceful-day',
    title: "Cats' Peaceful Day",
    heroImage: `${import.meta.env.BASE_URL}project4/project4_thumbnail.png`,
    heroVideo: undefined,
    myRole: ['Art Director'],
    team: ['3 Photography & Strategy', '1 Art Director & Strategy (본인)'],
    duration: '1 month',
    industry: 'Art / Figure Design',
    summary: '낚시하는 고양이 피규어 두 마리를 중심으로, 작고 평화로운 하루를 "미니어처 세계"로 표현한 촬영 프로젝트입니다. 거울을 연못처럼 사용해 반사를 적극 활용하고, 샷마다 물/하늘 톤을 조절해 두 고양이의 시선 흐름이 자연스럽게 먼저 읽히도록 구성했습니다.',
    sections: [
      {
        title: '의도 (Why)',
        content: '거울을 물 표면처럼 사용하는 레퍼런스를 보고, 작은 세계가 실제 공간처럼 보이게 연출하고자 했습니다. 그래서 "낚시하는 고양이" 장면을 여유로운 하루의 미니어처 풍경으로 구현했습니다.',
      },
      {
        title: '방법 (How)',
        content: '거울을 연못/강처럼 보이게 활용했습니다. 인조 잔디·나무 피규어로 자연 풍경을 구성했습니다. 샷마다 물/하늘 색을 조정해 고양이 피규어가 가장 먼저 눈에 들어오도록 시선 흐름을 정리했습니다.',
        image: 'miniature diorama scene'
      }
    ]
  }
};

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
  onNavigateToProject?: (projectId: string) => void;
  onNavigateToAbout?: () => void;
  onNavigateToWork?: () => void;
}

export function ProjectDetail({ projectId, onBack, onNavigateToProject, onNavigateToAbout, onNavigateToWork }: ProjectDetailProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Normalize projectId: remove trailing slashes and convert to lowercase
  const normalizedProjectId = projectId?.replace(/\/+$/, '').toLowerCase() || '';
  const project = projectsData[normalizedProjectId];
  const heroHasVideo = !!project?.heroVideo;
  const heroAspectRatio = heroHasVideo ? '16 / 9' : '875 / 583';
  const heroMaxHeight = heroHasVideo ? '600px' : '620px';

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
      setIsCompact(currentScrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 프로젝트 제목으로 문서 제목 설정
  useEffect(() => {
    if (project) {
      document.title = `${project.title} - SONGHEE PORTFOLIO`;
    }
  }, [project]);

  if (!project) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#000', 
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Darker Grotesque", sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '20px' }}>프로젝트를 찾을 수 없습니다</p>
          <button 
            onClick={onBack} 
            style={{ 
              color: '#ffd900', 
              cursor: 'pointer',
              background: 'none',
              border: '1px solid #ffd900',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 600
            }}
          >
            ← 홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000',
      color: '#fff',
      fontFamily: '"Darker Grotesque", sans-serif'
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://4pl67mv56j.execute-api.ap-northeast-2.amazonaws.com/v1/api/css/drop_fontstream_css/?sid=gAAAAABpAXw9Z1kK-P7e81ieW4WGtlt32HI2K7gJbY-WvazpQXj_FEsqywrroKMfMEd2GMEqQP-Ktipnz-Q4m5QT24jkFo_sljMLl_qzvsmgd6fK0MP5OANSpQOYrGxj4H9VCaUc9XiSmdyIdbi3fDZAgUGbU-qC8nnGQJV77uN4aiBrGhTcGMQlWg7J5Pt5DPCp_qz8NMWwXjx4OoydnNjqca5j0CZRDoOLgiUVtVJZ9kKlViajxR84ESogA1YHiKrfrghliwxN');
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      {/* Scroll Progress Indicator */}
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

      {/* Fixed Header - 홈과 100% 동일한 스타일 */}
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
          <div 
            onClick={onBack}
            style={{ 
              fontSize: isCompact ? '17px' : '21px', 
              fontWeight: 800,
              color: '#ffd900',
              transition: 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
              cursor: 'pointer'
            }}
          >
            SONGHEE ⓒ
          </div>
          
          <div style={{ display: 'flex', gap: isCompact ? '36px' : '47px' }}>
            <motion.button 
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateToWork) {
                  onNavigateToWork();
                }
              }}
                style={{ 
                  color: '#ffd900', 
                  textDecoration: 'none', 
                  fontSize: isCompact ? '14px' : '17px', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0
                }}
                whileHover={{ 
                  scale: 1.08,
                  color: 'rgba(255, 217, 0, 0.7)',
                  transition: { type: "spring", stiffness: 300, damping: 15 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                WORK
              </motion.button>

            {/* ABOUT Button */}
            {onNavigateToAbout && (
              <motion.button
                onClick={onNavigateToAbout}
                style={{ 
                  color: '#ffd900', 
                  textDecoration: 'none', 
                  fontSize: isCompact ? '14px' : '17px', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0
                }}
                whileHover={{ 
                  scale: 1.08,
                  color: 'rgba(255, 217, 0, 0.7)',
                  transition: { type: "spring", stiffness: 300, damping: 15 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                ABOUT
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main Content - 디자인 시스템에 맞춘 레이아웃 */}
      <section style={{
        paddingTop: '140px',
        paddingBottom: '0'
      }}>
        <div style={{ 
          maxWidth: '1180px', 
          margin: '0 auto',
          padding: '0 60px'
        }}>
          
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            style={{ marginBottom: project.summary ? '36px' : '50px' }}
          >
            <h1 style={{
              fontSize: '56px',
              fontWeight: 700,
              marginBottom: '0',
              fontFamily: '"Darker Grotesque", sans-serif',
              lineHeight: 0.95,
              color: '#fff',
              letterSpacing: '-0.04em'
            }}>
              {project.title}
            </h1>
            {project.summary && (
              <p style={{
                fontSize: '18px',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.82)',
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                fontWeight: 300,
                marginTop: '28px',
                marginBottom: 0,
                whiteSpace: 'pre-line'
              }}>
                {project.summary}
              </p>
            )}
          </motion.div>

          {/* Hero Video or Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            style={{
              width: '100%',
              aspectRatio: heroAspectRatio,
              maxHeight: heroMaxHeight,
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '70px',
              border: '1px solid rgba(255, 217, 0, 0.08)'
            }}
          >
            {project.heroVideo ? (
              project.isYouTube ? (
                <iframe
                  src={project.heroVideo}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                />
              ) : (
                <video
                  src={project.heroVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              )
            ) : (
              <ImageWithFallback
                src={project.heroImage && (project.heroImage.startsWith('http') || project.heroImage.includes('/')) 
                  ? project.heroImage 
                  : `https://source.unsplash.com/1200x600/?${project.heroImage}`}
                alt={project.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
          </motion.div>

          {/* Project Info Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: windowWidth < 768 ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
              gap: windowWidth < 768 ? '28px' : '50px',
              rowGap: windowWidth < 768 ? '36px' : '50px',
              marginBottom: windowWidth < 768 ? '60px' : '80px',
              paddingBottom: windowWidth < 768 ? '50px' : '70px',
              borderBottom: '1px solid rgba(255, 217, 0, 0.1)'
            }}
          >
            <div>
              <h3 style={{
                fontSize: '14px',
                color: '#ffd900',
                marginBottom: '18px',
                fontFamily: '"Darker Grotesque", sans-serif',
                fontWeight: 600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>MY ROLE</h3>
              {project.myRole.map((role, i) => (
                <p key={i} style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: '8px',
                  fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                  lineHeight: 1.6,
                  fontWeight: 400
                }}>{role}</p>
              ))}
            </div>

            <div>
              <h3 style={{
                fontSize: '14px',
                color: '#ffd900',
                marginBottom: '18px',
                fontFamily: '"Darker Grotesque", sans-serif',
                fontWeight: 600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>TEAM</h3>
              {project.team.map((member, i) => (
                <p key={i} style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: '8px',
                  fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                  lineHeight: 1.6,
                  fontWeight: 400,
                  whiteSpace: 'pre-line'
                }}>{member}</p>
              ))}
            </div>

            <div>
              <h3 style={{
                fontSize: '14px',
                color: '#ffd900',
                marginBottom: '18px',
                fontFamily: '"Darker Grotesque", sans-serif',
                fontWeight: 600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>DURATION</h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.85)',
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                lineHeight: 1.6,
                fontWeight: 400
              }}>{project.duration}</p>
            </div>

            <div>
              <h3 style={{
                fontSize: '14px',
                color: '#ffd900',
                marginBottom: '18px',
                fontFamily: '"Darker Grotesque", sans-serif',
                fontWeight: 600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>INDUSTRY</h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.85)',
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                lineHeight: 1.6,
                fontWeight: 400
              }}>{project.industry}</p>
            </div>
          </motion.div>

          {/* Detail Sections */}
          {project.sections.map((section, index) => {
            const isHourtasteSolution = project.id === 'hourtaste' && section.title === 'Solution';
            const isHourtasteMarket = project.id === 'hourtaste' && section.title === '시장배경';
            
            return (
          <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            style={{
                marginBottom: '100px'
            }}
          >
            <h2 style={{
                fontSize: '32px',
              fontWeight: 600,
                marginBottom: '24px',
              fontFamily: '"Darker Grotesque", sans-serif',
                color: '#fff',
              letterSpacing: '-0.02em'
              }}>{section.title}</h2>
              
              {/* 시장배경 섹션은 특별 처리: 텍스트와 이미지를 분리하여 배치 */}
              {project.id === 'hourtaste' && section.title === '시장배경' ? (
                <>
                  {section.content && (
            <p style={{
                fontSize: '17px',
                lineHeight: 1.9,
                color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                      marginBottom: '50px',
                      whiteSpace: 'pre-line',
                      fontWeight: 300
                    }}>
                      {section.content}
                    </p>
                  )}
                  <p style={{
                    fontSize: '17px',
                    lineHeight: 1.9,
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                    marginBottom: '30px',
                    whiteSpace: 'pre-line',
                    fontWeight: 300
                  }}>
                    수익성 높은 '랜덤박스'는 정보 불투명성으로 특정 고객(알레르기, 비건 등)을 배제하고, 투명한 '재고공개'는 수익성이 낮습니다.<br />
                    <span style={{ color: '#ffffff', fontWeight: 700 }}>'랜덤박스'를 기본으로 '재고공개' 옵션을 제공해 수익성과 투명성을 동시에 확보하고, 목적성 구매를 하는 새로운 고객층까지 포용하여 차별화 했습니다.</span>
                  </p>
                  <HourTasteDataChart />
                  <p style={{
                    fontSize: '17px',
                    lineHeight: 1.9,
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                    marginTop: '100px',
                    marginBottom: '30px',
                    whiteSpace: 'pre-line',
                    fontWeight: 300
                  }}>
                    마감할인 앱 삭제의 핵심 원인은 '탐색 피로'입니다. 사용자의 1/3이 시간·위치·취향 불일치로 인한 탐색 실패로 앱을 삭제합니다.<br />
                    이는 마감 할인 앱의 성공 본질이 가격 할인이 아닌, <span style={{ color: '#ffffff', fontWeight: 700 }}>'실패 없는 편리한 탐색 경험' 제공</span>에 있음을 의미합니다.
                  </p>
                  <HourTasteUserChart />
                </>
              ) : project.id === 'hourtaste' && section.title === 'Solution' ? (
                <>
                  <p style={{
                    fontSize: '17px',
                    lineHeight: 1.9,
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                    marginBottom: '40px',
                    whiteSpace: 'pre-line',
                    fontWeight: 300
                  }}>
                    '탐색 피로'를 줄이고 '모든 고객층'을 포용하기 위해 3가지 전략을 사용했습니다.
                  </p>
                  <HourTasteSolutionViz />
                </>
              ) : project.id === 'nook' && section.title === '서비스 기획' ? (
                <>
                  {section.content && (
                    <p style={{
                      fontSize: '17px',
                      lineHeight: 1.9,
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                      marginBottom: '40px',
                      whiteSpace: 'pre-line',
                      fontWeight: 300
                    }}>
                      {section.content}
                    </p>
                  )}
                  <NookServiceBackgroundViz />
                </>
              ) : project.id === 'railway-redesign' && section.title === '문제 (WHY)' ? (
                <>
                  <p style={{
                    fontSize: '17px',
                    lineHeight: 1.9,
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                    marginBottom: '20px',
                    whiteSpace: 'pre-line',
                    fontWeight: 300
                  }}>
                    철도 산업은 인프라와 운영이 분리되는 구조가 기본입니다.
                  </p>
                  <img 
                    src={`${import.meta.env.BASE_URL}project3/상하분리1.png`}
                    alt="상하분리 근거"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 217, 0, 0.08)',
                      background: 'rgba(255,255,255,0.02)',
                      marginBottom: '50px'
                    }}
                  />
                  <p style={{
                    fontSize: '17px',
                    lineHeight: 1.9,
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                    marginBottom: '50px',
                    whiteSpace: 'pre-line',
                    fontWeight: 300
                  }}>
                    하지만 NRC 웹사이트는 B2B 정보와 B2C 서비스가 명확히 분리되지 않아, 공공기관의 대표 사이트임에도 불구하고 "예매 포털처럼 보일 수 있는 여지"를 만듭니다.
                  </p>
                  {/* 문제 스크린샷 2종 - 1단 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <img 
                      src={`${import.meta.env.BASE_URL}project3/problem1.png`}
                      alt="문제 이미지 1"
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 217, 0, 0.08)',
                        background: 'rgba(255,255,255,0.02)'
                      }}
                    />
                    <img 
                      src={`${import.meta.env.BASE_URL}project3/problem2.png`}
                      alt="문제 이미지 2"
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 217, 0, 0.08)',
                        background: 'rgba(255,255,255,0.02)'
                      }}
                    />
                  </div>
                </>
              ) : project.id === 'railway-redesign' && section.title === '근거 (EVIDENCE)' ? (
                <>
                  <p style={{
                    fontSize: '17px',
                    lineHeight: 1.9,
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                    marginBottom: '50px',
                    whiteSpace: 'pre-line',
                    fontWeight: 300
                  }}>
                    독일/한국의 국철 사이트들도 공공기관 정보 페이지와 승객용 예매 페이지를 서로 다른 경로로 분리해 제공합니다.
                  </p>
                  {/* 국철 사례 비교 이미지 그리드 */}
            <motion.div
                    initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '20px'
                    }}
                  >
                    {[
                      {
                        country: '독일',
                        items: [
                          { type: '예매', file: '독일_예매.png' },
                          { type: '기업', file: '독일_철도.png' }
                        ]
                      },
                      {
                        country: '영국',
                        items: [
                          { type: '예매', file: '영국_예매.png' },
                          { type: '기업', file: '영국_철도.png' }
                        ]
                      },
                      {
                        country: '이탈리아',
                        items: [
                          { type: '예매', file: '이탈리아_예매.png' },
                          { type: '기업', file: '이탈리아_철도.png' }
                        ]
                      },
                      {
                        country: '한국',
                        items: [
                          { type: '예매', file: '한국_예매.png' },
                          { type: '기업', file: '한국_철도.png' }
                        ]
                      }
                    ].map((group, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                          padding: '20px'
                        }}
                      >
                        <div style={{
                          marginBottom: '16px',
                          fontSize: '16px',
                fontWeight: 600,
                          color: '#fff',
                fontFamily: '"Darker Grotesque", sans-serif',
                          textAlign: 'center'
                        }}>
                          {group.country}
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr',
                          gap: '16px'
                        }}>
                          {group.items.map((item, j) => (
                            <div key={j}>
                              <div style={{
                                marginBottom: '8px',
                                fontSize: '13px',
                                fontWeight: 500,
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif'
                              }}>
                                {item.type}
                              </div>
                              <img
                                src={`${import.meta.env.BASE_URL}project3/${item.file}`}
                                alt={`${group.country} ${item.type}`}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(255, 217, 0, 0.08)',
                                  background: 'rgba(0,0,0,0.3)'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </>
              ) : project.id === 'railway-redesign' && section.title === '전략 (HOW)' ? (
                <>
                  <p style={{
                    fontSize: '17px',
                    lineHeight: 1.9,
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                    marginBottom: '50px',
                whiteSpace: 'pre-line',
                fontWeight: 300
              }}>
                {section.content}
              </p>

                  {/* 홈페이지 단순화 */}
                  <p style={{
                    fontSize: '17px',
                    lineHeight: 1.9,
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                    marginBottom: '20px',
                    whiteSpace: 'pre-line',
                    fontWeight: 300
                  }}>
                    홈은 "기업 정체성 명확화 + 정보 우선순위 재배치" 중심으로 단순화하고, 승객 실행 기능(예매/노선/요금)은 별도 승객 포털로 분리했습니다.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '20px', marginBottom: '80px' }}>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        background: 'rgba(0,0,0,0.65)',
                color: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        zIndex: 1,
                        border: '1px solid rgba(255,255,255,0.18)'
                      }}>Before</span>
                      <img 
                        src={`${import.meta.env.BASE_URL}project3/철도공사.JPG`}
                        alt="철도공사"
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 217, 0, 0.08)',
                          background: 'rgba(255,255,255,0.02)',
                          filter: 'grayscale(100%)'
                        }}
                      />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        background: 'rgba(255, 217, 0, 0.16)',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        zIndex: 1,
                        border: '1px solid rgba(255, 217, 0, 0.35)'
                      }}>After</span>
                      <img 
                        src={`${import.meta.env.BASE_URL}project3/homepage.png`}
                        alt="홈페이지"
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 217, 0, 0.08)',
                          background: 'rgba(255,255,255,0.02)'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* HISTORY */}
              <p style={{
                fontSize: '17px',
                lineHeight: 1.9,
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                    marginBottom: '20px',
                    whiteSpace: 'pre-line',
                    fontWeight: 300
                  }}>
                    OUR HISTORY는 "연대기+인프라 발전"을 역순으로 정리해 현재까지의 변화 흐름을 보여주고, 인디케이터로 현재 위치를 확인할 수 있도록 하여 기업의 신뢰성을 강화했습니다
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '20px', marginBottom: '80px' }}>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        background: 'rgba(0,0,0,0.65)',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        zIndex: 1,
                        border: '1px solid rgba(255,255,255,0.18)'
                      }}>Before</span>
                      <img 
                        src={`${import.meta.env.BASE_URL}project3/철도공사2.JPG`}
                        alt="철도공사 2"
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 217, 0, 0.08)',
                          background: 'rgba(255,255,255,0.02)',
                          filter: 'grayscale(100%)'
                        }}
                      />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        background: 'rgba(255, 217, 0, 0.16)',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        zIndex: 1,
                        border: '1px solid rgba(255, 217, 0, 0.35)'
                      }}>After</span>
                      <img 
                        src={`${import.meta.env.BASE_URL}project3/history.png`}
                        alt="히스토리"
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 217, 0, 0.08)',
                          background: 'rgba(255,255,255,0.02)'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* 프로젝트/노선 */}
                  <p style={{
                    fontSize: '17px',
                    lineHeight: 1.9,
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                    marginBottom: '20px',
                    whiteSpace: 'pre-line',
                    fontWeight: 300
                  }}>
                    기존에 없던 '프로젝트/노선' UI를 추가하고 시각화를 적용해 각 프로젝트의 목적·상태를 직관적으로 제시했습니다.
최근 나이지리아 철도 인프라 개발 사업이 활발하게 진행되고 있기 때문에, 철도 인프라 투자 확대 상황을 공공적으로 투명하게 전달하기 위한 방향입니다.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={`${import.meta.env.BASE_URL}project3/프로젝트웹.png`}
                          alt="프로젝트 웹"
                          style={{
                            width: '100%', height: 'auto', borderRadius: '12px', border: '1px solid rgba(255, 217, 0, 0.08)', background: 'rgba(255,255,255,0.02)'
                          }}
                        />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span style={{
                          position: 'absolute', top: '10px', left: '10px', padding: '6px 10px', borderRadius: '999px',
                          background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.02em', zIndex: 1,
                          border: '1px solid rgba(255,255,255,0.18)'
                        }}>Before</span>
                        <img 
                          src={`${import.meta.env.BASE_URL}project3/철도공사2.3.JPG`}
                          alt="철도공사 2.3"
                          style={{
                            width: '100%', height: 'auto', borderRadius: '12px', border: '1px solid rgba(255, 217, 0, 0.08)', background: 'rgba(255,255,255,0.02)',
                            filter: 'grayscale(100%)'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute', top: '10px', left: '10px', padding: '6px 10px', borderRadius: '999px',
                        background: 'rgba(255, 217, 0, 0.16)', color: '#fff', fontSize: '12px', fontWeight: 700, letterSpacing: '0.02em', zIndex: 1,
                        border: '1px solid rgba(255, 217, 0, 0.35)'
                      }}>After</span>
                      <img 
                        src={`${import.meta.env.BASE_URL}project3/projects.png`}
                        alt="프로젝트"
                        style={{
                          width: '100%', height: 'auto', borderRadius: '12px', border: '1px solid rgba(255, 217, 0, 0.08)', background: 'rgba(255,255,255,0.02)'
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
              <p style={{
                fontSize: '17px',
                lineHeight: 1.9,
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: '"SD Greta Sans", "IBM Plex Sans KR", sans-serif',
                marginBottom: section.image ? '24px' : '0',
                whiteSpace: 'pre-line',
                fontWeight: 300
              }}>
                {section.content}
              </p>
              )}


              {section.image && !(project.id === 'cat-peaceful-day' && section.title === '방법 (How)') && !(project.id === 'railway-redesign' && section.title === '근거 (EVIDENCE)') && !(project.id === 'railway-redesign' && section.title === '문제 (WHY)') && !(project.id === 'railway-redesign' && section.title === '전략 (HOW)') && !(project.id === 'hourtaste' && section.title === 'Solution') && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 217, 0, 0.08)',
                    cursor: 'pointer',
                    marginTop: 0
                  }}
                  onClick={() => {
                    const imageSrc = section.image.startsWith('http') || section.image.startsWith('/') || section.image.includes('project') ? section.image : `https://source.unsplash.com/1200x500/?${section.image}`;
                    setSelectedImage(imageSrc);
                  }}
                >
                  <ImageWithFallback
                    src={section.image.startsWith('http') || section.image.startsWith('/') || section.image.includes('project') ? section.image : `https://source.unsplash.com/1200x500/?${section.image}`}
                    alt={section.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: '16px'
                    }}
                  />
                </motion.div>
              )}


              {/* Cat project: show 3 reference images under WHY section */}
              {project.id === 'cat-peaceful-day' && section.title === '의도 (Why)' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  style={{
                    marginTop: '60px',
                    marginBottom: '64px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '18px'
                  }}
                >
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{
                      margin: '0 0 2px',
                      fontSize: '13px',
                      letterSpacing: '0.02em',
                      color: 'rgba(255,255,255,0.6)'
                    }}>나무-물 표현</p>
                  </div>
                  {['ref1.png','ref2.png','ref3.png'].map((file, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 217, 0, 0.08)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        width: '100%',
                        aspectRatio: '1 / 1'
                      }}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}project4/${file}`}
                        alt={`reference ${i+1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                    </div>
                  ))}
                </motion.div>
              )}

              {project.id === 'cat-peaceful-day' && section.title === '의도 (Why)' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  style={{
                    marginTop: '18px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '18px'
                  }}
                >
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{
                      margin: '0 0 2px',
                      fontSize: '13px',
                      letterSpacing: '0.02em',
                      color: 'rgba(255,255,255,0.6)'
                    }}>고양이 피규어</p>
                  </div>
                  {['ref4.png','ref5.png','ref6.png'].map((file, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 217, 0, 0.08)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        width: '100%',
                        aspectRatio: '1 / 1'
                      }}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}project4/${file}`}
                        alt={`reference ${i+4}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ))}
            </motion.div>
              )}

              {project.id === 'cat-peaceful-day' && section.title === '방법 (How)' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{
                    marginTop: '60px',
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '28px'
                  }}
                >
                  {/* Top thumbnail image */}
                  <div
                    key="thumb"
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '875 / 583',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255, 217, 0, 0.08)'
                    }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}project4/project4_thumbnail.png`}
                      alt={`thumbnail`}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {[2,3,4,5,6].map((i) => (
                    <div key={i}
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '875 / 583',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255, 217, 0, 0.08)'
                      }}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}project4/after${i}.png`}
                        alt={`after ${i}`}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
            );
          })}

        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 2,
        padding: '60px 60px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '9px',
        maxWidth: '1180px',
        margin: '0 auto',
        width: '100%',
        borderTop: '1px solid rgba(255, 217, 0, 0.1)'
      }}>
        <div className="footer-content" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '0',
          borderBottom: 'none'
        }}>
          <p className="footer-logo" style={{
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 'normal',
            margin: 0,
            color: '#fff',
            fontFamily: '"Darker Grotesque", sans-serif'
          }}>
            SONGHEE ⓒ
          </p>
          <a href="mailto:allisvanitas@gmail.com" className="footer-email" style={{
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: 'normal',
            margin: 0,
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            fontFamily: '"Darker Grotesque", sans-serif'
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
      </footer>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged view"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: 0,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Arial, sans-serif',
                lineHeight: 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
