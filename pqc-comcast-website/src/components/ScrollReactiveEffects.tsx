import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollReactiveEffectsProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export function ScrollReactiveEffects({ containerRef }: ScrollReactiveEffectsProps) {
  const particleSystemRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current || !particleSystemRef.current) return;

    // Create responsive particle system
    const createScrollReactiveParticles = () => {
      if (!particleSystemRef.current) return;

      // Clear existing particles
      particleSystemRef.current.innerHTML = '';
      particlesRef.current = [];

      const numParticles = 50;
      
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'scroll-particle';
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 4 + 2}px;
          height: ${Math.random() * 4 + 2}px;
          background: var(--color-primary);
          border-radius: 50%;
          opacity: 0.1;
          box-shadow: 0 0 15px currentColor;
          pointer-events: none;
        `;
        
        // Initial random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        particleSystemRef.current.appendChild(particle);
        particlesRef.current.push(particle);
        
        // Create movement pattern based on scroll
        gsap.set(particle, {
          x: 0,
          y: 0,
          rotation: Math.random() * 360
        });
      }
    };

    // Scroll-triggered animations
    const setupScrollTriggers = () => {
      const particles = particlesRef.current;
      
      // Main scroll progress tracker
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          
          // Animate particles based on scroll
          particles.forEach((particle, index) => {
            if (!particle) return;
            
            const speed = (index % 3) + 1; // Different speeds
            const direction = index % 2 === 0 ? 1 : -1; // Alternating directions
            
            gsap.to(particle, {
              x: direction * progress * 200 * speed,
              y: Math.sin(progress * Math.PI * 2 + index) * 100,
              rotation: progress * 360 * direction,
              opacity: 0.3 + (Math.sin(progress * Math.PI * 4 + index) * 0.4),
              scale: 0.5 + (progress * 1.5),
              duration: 0.1,
              ease: "none"
            });
          });
        }
      });

      // Section-specific effects
      const sections = ['#pqc', '#trends', '#demos', '#comcast', '#metrics'];
      
      sections.forEach((selector, sectionIndex) => {
        const element = document.querySelector(selector);
        if (!element) return;
        
        ScrollTrigger.create({
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
          onEnter: () => {
            // Create section-specific particle burst
            createParticleBurst(sectionIndex);
          },
          onUpdate: (self) => {
            const sectionProgress = self.progress;
            const sectionParticles = particles.slice(
              sectionIndex * 10, 
              (sectionIndex + 1) * 10
            );
            
            sectionParticles.forEach((particle, index) => {
              if (!particle) return;
              
              gsap.to(particle, {
                scale: 1 + sectionProgress,
                opacity: 0.8 * sectionProgress,
                backgroundColor: `hsl(${240 + sectionIndex * 30}, 70%, 60%)`,
                duration: 0.2,
                ease: "power2.out"
              });
            });
          }
        });
      });
    };

    // Create particle burst effect
    const createParticleBurst = (sectionIndex: number) => {
      if (!particleSystemRef.current) return;
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const colors = [
        'var(--color-primary)',
        'var(--accent)', 
        'var(--quantum-purple)',
        'var(--quantum-cyan)',
        'var(--quantum-pink)'
      ];
      
      for (let i = 0; i < 20; i++) {
        const burstParticle = document.createElement('div');
        burstParticle.style.cssText = `
          position: fixed;
          width: 6px;
          height: 6px;
          background: ${colors[sectionIndex % colors.length]};
          border-radius: 50%;
          pointer-events: none;
          z-index: 1000;
          left: ${centerX}px;
          top: ${centerY}px;
          box-shadow: 0 0 20px currentColor;
        `;
        
        particleSystemRef.current.appendChild(burstParticle);
        
        // Animate burst
        const angle = (i / 20) * Math.PI * 2;
        const distance = Math.random() * 300 + 100;
        
        gsap.to(burstParticle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0,
          duration: 2,
          ease: "power2.out",
          onComplete: () => {
            burstParticle.remove();
          }
        });
      }
    };

    // Mouse interaction enhancement
    const setupMouseInteraction = () => {
      const handleMouseMove = (e: MouseEvent) => {
        const particles = particlesRef.current;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        particles.forEach((particle, index) => {
          if (!particle) return;
          
          const rect = particle.getBoundingClientRect();
          const particleX = rect.left + rect.width / 2;
          const particleY = rect.top + rect.height / 2;
          
          const distance = Math.sqrt(
            Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2)
          );
          
          if (distance < 150) {
            const force = (150 - distance) / 150;
            const angle = Math.atan2(particleY - mouseY, particleX - mouseX);
            
            gsap.to(particle, {
              x: `+=${Math.cos(angle) * force * 50}`,
              y: `+=${Math.sin(angle) * force * 50}`,
              scale: 1 + force,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    };

    // Initialize everything
    createScrollReactiveParticles();
    setupScrollTriggers();
    const cleanupMouse = setupMouseInteraction();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      cleanupMouse?.();
    };
  }, [containerRef]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div ref={particleSystemRef} className="absolute inset-0" />
      
      {/* Scroll progress indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-quantum-purple z-50 transition-all duration-300"
        style={{ width: `${scrollProgress * 100}%` }}
      />
      
      {/* Floating quantum energy orbs that respond to scroll */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-20 h-20 opacity-10"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i % 3) * 20}%`,
              background: `radial-gradient(circle, var(--quantum-purple), transparent)`,
              borderRadius: '50%',
              filter: 'blur(2px)',
              animation: `float ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>
      
      {/* Section transition effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"
          style={{
            top: `${scrollProgress * 100}%`,
            filter: 'blur(1px)',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  );
}