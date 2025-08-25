import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface DynamicBackgroundProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export function DynamicBackground({ containerRef }: DynamicBackgroundProps) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const layersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!backgroundRef.current) return;

    // Create animated background layers
    const createBackgroundLayers = () => {
      if (!backgroundRef.current) return;

      // Clear existing layers
      backgroundRef.current.innerHTML = '';
      layersRef.current = [];

      const layerConfigs = [
        {
          // Hero section - Electric grid
          className: 'hero-layer',
          style: `
            background: radial-gradient(circle at 20% 50%, var(--color-primary) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, var(--quantum-cyan) 0%, transparent 50%),
                        linear-gradient(45deg, transparent 49%, var(--color-primary) 49.5%, var(--color-primary) 50.5%, transparent 51%);
            background-size: 300px 300px, 250px 250px, 100px 100px;
            opacity: 0.1;
          `
        },
        {
          // PQC section - Quantum waves
          className: 'pqc-layer',
          style: `
            background: linear-gradient(45deg, var(--quantum-purple) 0%, transparent 30%),
                        linear-gradient(-45deg, var(--accent) 0%, transparent 30%),
                        radial-gradient(circle, var(--quantum-cyan) 0%, transparent 70%);
            background-size: 200px 200px, 180px 180px, 150px 150px;
            opacity: 0.08;
          `
        },
        {
          // Industry section - Tech matrix
          className: 'industry-layer',
          style: `
            background: repeating-linear-gradient(90deg, transparent, transparent 48px, var(--color-primary) 50px),
                        repeating-linear-gradient(0deg, transparent, transparent 48px, var(--accent) 50px),
                        radial-gradient(ellipse at center, var(--quantum-purple) 0%, transparent 60%);
            background-size: 50px 50px, 50px 50px, 400px 300px;
            opacity: 0.05;
          `
        },
        {
          // Demos section - Interactive particles
          className: 'demos-layer',
          style: `
            background: radial-gradient(circle at 10% 20%, var(--quantum-pink) 0%, transparent 40%),
                        radial-gradient(circle at 90% 80%, var(--quantum-orange) 0%, transparent 40%),
                        radial-gradient(circle at 50% 50%, var(--color-primary) 0%, transparent 60%);
            background-size: 600px 600px, 500px 500px, 800px 800px;
            opacity: 0.12;
          `
        },
        {
          // Comcast section - Corporate energy
          className: 'comcast-layer',
          style: `
            background: linear-gradient(120deg, var(--color-primary) 0%, transparent 50%),
                        linear-gradient(240deg, var(--accent) 0%, transparent 50%),
                        conic-gradient(from 0deg at 50% 50%, var(--quantum-cyan), var(--quantum-purple), var(--quantum-cyan));
            background-size: 400px 400px, 350px 350px, 200px 200px;
            opacity: 0.06;
          `
        },
        {
          // Metrics section - Data visualization
          className: 'metrics-layer',
          style: `
            background: repeating-conic-gradient(from 0deg at 20% 50%, var(--accent) 0deg, transparent 90deg),
                        repeating-conic-gradient(from 0deg at 80% 50%, var(--quantum-purple) 0deg, transparent 90deg),
                        linear-gradient(90deg, transparent 0%, var(--color-primary) 50%, transparent 100%);
            background-size: 100px 100px, 120px 120px, 100% 2px;
            opacity: 0.04;
          `
        }
      ];

      layerConfigs.forEach((config, index) => {
        const layer = document.createElement('div');
        layer.className = config.className;
        layer.style.cssText = `
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 1s ease-in-out;
          ${config.style}
        `;
        
        backgroundRef.current!.appendChild(layer);
        layersRef.current.push(layer);

        // Animate layer
        gsap.to(layer, {
          backgroundPositionX: index % 2 === 0 ? '200px' : '-200px',
          backgroundPositionY: index % 2 === 0 ? '100px' : '-100px',
          duration: 20 + index * 5,
          repeat: -1,
          yoyo: true,
          ease: "none"
        });
      });
    };

    // Setup section detection
    const setupSectionTriggers = () => {
      const sections = [
        { selector: '#hero', index: 0, name: 'hero' },
        { selector: '#pqc', index: 1, name: 'pqc' },
        { selector: '#trends', index: 2, name: 'industry' },
        { selector: '#demos', index: 3, name: 'demos' },
        { selector: '#comcast', index: 4, name: 'comcast' },
        { selector: '#metrics', index: 5, name: 'metrics' }
      ];

      sections.forEach((section) => {
        const element = document.querySelector(section.selector);
        if (!element) return;

        ScrollTrigger.create({
          trigger: element,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => switchBackgroundLayer(section.index),
          onEnterBack: () => switchBackgroundLayer(section.index),
        });
      });
    };

    // Switch active background layer
    const switchBackgroundLayer = (index: number) => {
      if (index === activeSection) return;
      
      setActiveSection(index);
      
      layersRef.current.forEach((layer, i) => {
        if (!layer) return;
        
        gsap.to(layer, {
          opacity: i === index ? 1 : 0,
          duration: 1.2,
          ease: "power2.inOut"
        });
      });

      // Add section-specific particle burst
      createSectionTransitionEffect(index);
    };

    // Create transition effect between sections
    const createSectionTransitionEffect = (sectionIndex: number) => {
      if (!backgroundRef.current) return;

      const colors = [
        'var(--color-primary)',      // Hero
        'var(--quantum-purple)',     // PQC
        'var(--accent)',             // Industry
        'var(--quantum-pink)',       // Demos
        'var(--quantum-cyan)',       // Comcast
        'var(--quantum-orange)'      // Metrics
      ];

      // Create ripple effect
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, ${colors[sectionIndex]} 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        transform: translate(-50%, -50%);
        opacity: 0.3;
      `;

      backgroundRef.current.appendChild(ripple);

      gsap.to(ripple, {
        width: '200vh',
        height: '200vh',
        opacity: 0,
        duration: 2,
        ease: "power2.out",
        onComplete: () => ripple.remove()
      });
    };

    // Floating quantum elements that respond to sections
    const createFloatingElements = () => {
      if (!backgroundRef.current) return;

      for (let i = 0; i < 12; i++) {
        const element = document.createElement('div');
        element.className = `floating-quantum-${i}`;
        element.style.cssText = `
          position: absolute;
          width: ${Math.random() * 30 + 10}px;
          height: ${Math.random() * 30 + 10}px;
          background: radial-gradient(circle, var(--quantum-cyan), transparent);
          border-radius: ${Math.random() > 0.5 ? '50%' : '20%'};
          opacity: 0.1;
          filter: blur(${Math.random() * 3 + 1}px);
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
        `;

        backgroundRef.current.appendChild(element);

        // Floating animation
        gsap.to(element, {
          x: Math.random() * 400 - 200,
          y: Math.random() * 400 - 200,
          rotation: 360,
          duration: Math.random() * 20 + 10,
          repeat: -1,
          yoyo: true,
          ease: "none"
        });

        // Opacity animation
        gsap.to(element, {
          opacity: Math.random() * 0.3 + 0.05,
          duration: Math.random() * 4 + 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    };

    // Initialize everything
    createBackgroundLayers();
    createFloatingElements();
    setupSectionTriggers();

    // Activate first layer
    setTimeout(() => switchBackgroundLayer(0), 500);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [containerRef, activeSection]);

  return (
    <div 
      ref={backgroundRef} 
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at top, var(--background) 0%, oklch(0.04 0.02 270) 100%)`,
      }}
    >
      {/* Base quantum field */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, var(--color-primary) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, var(--quantum-purple) 0%, transparent 50%),
            linear-gradient(45deg, transparent 49%, var(--accent) 49.5%, var(--accent) 50.5%, transparent 51%)
          `,
          backgroundSize: '800px 800px, 600px 600px, 200px 200px',
          animation: 'quantumShift 30s ease-in-out infinite'
        }}
      />
    </div>
  );
}