import { useRef, useState, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
  // width:height = 875:583 (fixed ratio)
  beforeFlip?: 'none' | 'horizontal';
}

export function BeforeAfterSlider({ beforeSrc, afterSrc, alt = 'before after', beforeFlip = 'none' }: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // position represents the split line from the left (0..1).
  // Default: AFTER(오른쪽) 약 60% 보이도록 => position ≈ 0.4
  const [position, setPosition] = useState(0.4);
  const isPointerDown = useRef(false);

  useEffect(() => {
    const onMove = (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      setPosition(x / rect.width);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown.current) return;
      onMove(e.clientX);
    };
    const onPointerUp = () => { isPointerDown.current = false; };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '875 / 583',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255, 217, 0, 0.08)'
      }}
      onPointerDown={(e) => {
        isPointerDown.current = true;
        setTimeout(() => {
          const el = containerRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
          setPosition(x / rect.width);
        }, 0);
      }}
    >
      {/* Before (bottom) */}
      <img
        src={beforeSrc}
        alt={alt}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          userSelect: 'none',
          pointerEvents: 'none',
          transform: beforeFlip === 'horizontal' ? 'scaleX(-1)' : 'none'
        }}
      />

      {/* After (top) with clip */}
      <img
        src={afterSrc}
        alt={alt}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          userSelect: 'none',
          pointerEvents: 'none',
          // Show AFTER on the right side (left = BEFORE)
          clipPath: `polygon(${Math.max(0, Math.min(1, position)) * 100}% 0, 100% 0, 100% 100%, ${Math.max(0, Math.min(1, position)) * 100}% 100%)`
        }}
      />

      {/* Handle */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${Math.max(0, Math.min(1, position)) * 100}%`,
          transform: 'translateX(-50%)',
          width: '2px',
          background: 'rgba(255,255,255,0.9)',
          boxShadow: '0 0 12px rgba(255,255,255,0.6)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${Math.max(0, Math.min(1, position)) * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#fff',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 700,
          boxShadow: '0 6px 24px rgba(0,0,0,0.45)',
          pointerEvents: 'none'
        }}
      >
        ⇆
      </div>
    </div>
  );
}


