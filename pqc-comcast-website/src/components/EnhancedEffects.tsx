import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface EnhancedEffectsProps {
  containerRef: React.RefObject<HTMLElement | null>;
  intensity?: number; // 0-100, controls effect density
  mouseFollowEffects?: boolean;
  showQuantumTunnel?: boolean;
  showDNAHelix?: boolean;
}

export function EnhancedEffects({ 
  containerRef, 
  intensity = 50, 
  mouseFollowEffects = true,
  showQuantumTunnel = false,
  showDNAHelix = false 
}: EnhancedEffectsProps) {
  const matrixRef = useRef<HTMLDivElement>(null);
  const circuitRef = useRef<HTMLDivElement>(null);
  const energyRef = useRef<HTMLDivElement>(null);
  const particleFieldRef = useRef<HTMLDivElement>(null);
  const quantumTunnelRef = useRef<HTMLDivElement>(null);
  const dnaHelixRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Advanced Matrix Rain with GSAP
    const createAdvancedMatrixRain = () => {
      if (!matrixRef.current) return;
      
      const chars = "01ABCDEFabcdef!@#$%^&*()_+-=[]{}|;:,.<>?";
      const columns = Math.floor(window.innerWidth / 25);
      
      for (let i = 0; i < Math.min(columns, Math.floor(intensity / 5)); i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.position = 'absolute';
        column.style.left = (i * 25) + 'px';
        column.style.top = '0';
        column.style.height = '100%';
        column.style.pointerEvents = 'none';
        
        // Create falling characters - reduced quantity
        for (let j = 0; j < 8; j++) {
          const char = document.createElement('div');
          char.className = 'matrix-char';
          char.textContent = chars[Math.floor(Math.random() * chars.length)];
          char.style.position = 'absolute';
          char.style.top = (j * 20 - 300) + 'px';
          char.style.fontSize = (Math.random() * 8 + 12) + 'px';
          char.style.opacity = '0.1';
          
          column.appendChild(char);
          
          // GSAP animation for each character
          gsap.to(char, {
            y: window.innerHeight + 300,
            opacity: Math.random() * 0.3 + 0.1,
            duration: Math.random() * 5 + 3,
            delay: Math.random() * 2,
            repeat: -1,
            ease: "none",
            onRepeat: () => {
              char.textContent = chars[Math.floor(Math.random() * chars.length)];
            }
          });
        }
        
        matrixRef.current.appendChild(column);
      }
    };

    // Advanced Circuit Network with GSAP
    const createQuantumCircuit = () => {
      if (!circuitRef.current) return;
      
      const numNodes = Math.floor(intensity / 10) + 3;
      const nodes: { x: number, y: number, element: HTMLDivElement }[] = [];
      
      // Create nodes
      for (let i = 0; i < numNodes; i++) {
        const node = document.createElement('div');
        node.className = 'circuit-node';
        node.style.cssText = `
          position: absolute;
          width: 8px;
          height: 8px;
          background: var(--quantum-cyan);
          border-radius: 50%;
          box-shadow: 0 0 15px var(--quantum-cyan);
        `;
        
        const x = Math.random() * 90 + 5; // 5-95%
        const y = Math.random() * 90 + 5;
        node.style.left = x + '%';
        node.style.top = y + '%';
        
        nodes.push({ x, y, element: node });
        circuitRef.current.appendChild(node);
        
        // Pulsing animation
        gsap.to(node, {
          scale: 1.5,
          opacity: 0.3,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: Math.random() * 2
        });
      }
      
      // Create connections between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (Math.random() > 0.6) continue; // Don't connect all nodes
          
          const line = document.createElement('div');
          line.className = 'entanglement-line';
          
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          
          line.style.cssText = `
            position: absolute;
            left: ${nodes[i].x}%;
            top: ${nodes[i].y}%;
            width: ${length}%;
            height: 1px;
            transform-origin: 0 0;
            transform: rotate(${angle}deg);
            opacity: 0;
          `;
          
          circuitRef.current.appendChild(line);
          
          // Animate connection
          gsap.to(line, {
            opacity: 0.6,
            duration: 1,
            delay: Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
          });
        }
      }
    };

    // Quantum Particle Field with GSAP
    const createParticleField = () => {
      if (!particleFieldRef.current) return;
      
      const numParticles = Math.floor(intensity / 2) + 20;
      
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-stream';
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 3 + 1}px;
          height: ${Math.random() * 3 + 1}px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 10px currentColor;
        `;
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const endX = startX + (Math.random() * 400 - 200);
        const endY = startY + (Math.random() * 300 - 150);
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        particleFieldRef.current.appendChild(particle);
        
        // GSAP curved motion animation
        gsap.to(particle, {
          x: endX - startX,
          y: endY - startY,
          scale: Math.random() * 2 + 0.5,
          opacity: 0,
          duration: Math.random() * 4 + 2,
          delay: Math.random() * 3,
          repeat: -1,
          ease: "power2.out",
          onComplete: () => {
            particle.remove();
          }
        });
      }
    };

    // Advanced Energy Waves
    const createEnergyWaves = () => {
      if (!energyRef.current) return;
      
      for (let i = 0; i < 5; i++) {
        const wave = document.createElement('div');
        wave.className = 'encryption-wave';
        wave.style.cssText = `
          position: absolute;
          top: ${Math.random() * 100}%;
          left: -100px;
          width: 200px;
          height: 2px;
          opacity: 0;
        `;
        
        energyRef.current.appendChild(wave);
        
        gsap.to(wave, {
          x: window.innerWidth + 100,
          opacity: 0.8,
          duration: 3,
          delay: i * 0.5,
          repeat: -1,
          ease: "power2.inOut",
          onComplete: () => {
            wave.style.opacity = '0';
          }
        });
      }
    };

    // Floating Quantum Orbs - Reduced quantity
    const createQuantumOrbs = () => {
      if (!particleFieldRef.current) return;
      
      for (let i = 0; i < 3; i++) {
        const orb = document.createElement('div');
        orb.style.cssText = `
          position: absolute;
          width: ${Math.random() * 20 + 10}px;
          height: ${Math.random() * 20 + 10}px;
          background: radial-gradient(circle, var(--quantum-purple), transparent);
          border-radius: 50%;
          opacity: 0.1;
          filter: blur(2px);
        `;
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        orb.style.left = x + '%';
        orb.style.top = y + '%';
        
        particleFieldRef.current.appendChild(orb);
        
        // Floating animation
        gsap.to(orb, {
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
          duration: Math.random() * 8 + 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        
        gsap.to(orb, {
          opacity: Math.random() * 0.2 + 0.05,
          duration: Math.random() * 3 + 1,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        });
      }
    };

    // Mouse-following cursor glow
    const setupCursorGlow = () => {
      if (!mouseFollowEffects || !cursorGlowRef.current) return;
      
      const updateCursorGlow = (e: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect || !cursorGlowRef.current) return;
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        gsap.to(cursorGlowRef.current, {
          x: x - 50,
          y: y - 50,
          duration: 0.1,
          ease: "power2.out"
        });
        
        setMousePos({ x, y });
      };
      
      containerRef.current?.addEventListener('mousemove', updateCursorGlow);
      return () => containerRef.current?.removeEventListener('mousemove', updateCursorGlow);
    };

    // Initialize all effects
    createAdvancedMatrixRain();
    createQuantumCircuit();
    createParticleField();
    createEnergyWaves();
    createQuantumOrbs();
    const cleanupCursor = setupCursorGlow();

    // Periodic recreation of dynamic effects
    const particleInterval = setInterval(() => {
      createParticleField();
      createQuantumOrbs();
    }, 10000);
    
    return () => {
      clearInterval(particleInterval);
      cleanupCursor?.();
    };
  }, [containerRef, intensity, mouseFollowEffects]);

  // Quantum Tunnel Effect
  useEffect(() => {
    if (!showQuantumTunnel || !quantumTunnelRef.current) return;
    
    gsap.to(quantumTunnelRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });
  }, [showQuantumTunnel]);

  // DNA Helix Animation
  useEffect(() => {
    if (!showDNAHelix || !dnaHelixRef.current) return;
    
    gsap.to(dnaHelixRef.current, {
      rotationY: 360,
      duration: 8,
      repeat: -1,
      ease: "none"
    });
  }, [showDNAHelix]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Mouse-following cursor glow */}
      {mouseFollowEffects && (
        <div
          ref={cursorGlowRef}
          className="cursor-glow"
          style={{
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle, var(--color-primary) 0%, transparent 70%)`,
            opacity: 0.2,
            borderRadius: '50%',
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        />
      )}
      
      {/* Matrix Rain */}
      <div ref={matrixRef} className="matrix-rain" />
      
      {/* Quantum Circuit Network */}
      <div ref={circuitRef} className="circuit-lines" />
      
      {/* Particle Field */}
      <div ref={particleFieldRef} className="absolute inset-0" />
      
      {/* Energy Waves */}
      <div ref={energyRef} className="absolute inset-0" />
      
      {/* Quantum Tunnel (optional) */}
      {showQuantumTunnel && (
        <div 
          ref={quantumTunnelRef} 
          className="quantum-tunnel absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 opacity-20"
        />
      )}
      
      {/* DNA Helix (optional) */}
      {showDNAHelix && (
        <div 
          ref={dnaHelixRef}
          className="dna-helix absolute top-1/4 right-10 opacity-30"
        />
      )}
      
      {/* Background quantum field */}
      <div className="quantum-field absolute inset-0 opacity-10" />
      
      {/* Cyber grid overlay */}
      <div className="cyber-grid absolute inset-0 opacity-5" />
    </div>
  );
}