import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Shield, Lock, Key, Globe, Zap, Building, Users, CheckCircle, ExternalLink, Brain, Cpu, Network, PlayCircle, Calculator, TrendingUp, Search } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { EncryptionDemo } from "@/components/EncryptionDemo";
import { KeyExchangeDemo } from "@/components/KeyExchangeDemo";
import { QuantumTimeline } from "@/components/QuantumTimeline";
import { EncryptionStrengthMeter } from "@/components/EncryptionStrengthMeter";
import { GlobalPQCMap } from "@/components/GlobalPQCMap";
import { EnhancedEffects } from "@/components/EnhancedEffects";
import { ScrollReactiveEffects } from "@/components/ScrollReactiveEffects";
import { DynamicBackground } from "@/components/DynamicBackground";
import { RSADemo } from "@/components/RSADemo";
import { ECCDemo } from "@/components/ECCDemo";
import { ShorDemo } from "@/components/ShorDemo";
import { GroverDemo } from "@/components/GroverDemo";

gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);

export default function PQCWebsite() {
  const heroRef = useRef<HTMLElement>(null);
  const typewriterRef = useRef<HTMLHeadingElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const certificatesRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const comcastRef = useRef<HTMLElement>(null);
  const countersRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const demosRef = useRef<HTMLElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const morphingBlobRef = useRef<HTMLDivElement>(null);
  const [compliantProgress, setCompliantProgress] = useState(0);
  const [readyProgress, setReadyProgress] = useState(0);
  const [expiringProgress, setExpiringProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorTrails, setCursorTrails] = useState<Array<{id: number, x: number, y: number}>>([]);
  const trailCounter = useRef(0);

  // Advanced text scramble effect
  const scrambleText = useCallback((element: HTMLElement, finalText: string) => {
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let iteration = 0;
    const originalText = finalText;
    
    const interval = setInterval(() => {
      element.innerText = finalText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      
      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 3;
    }, 30);
  }, []);

  // Magnetic hover effect
  const createMagneticEffect = useCallback((element: HTMLElement) => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(element, {
        x: x * 0.3,
        y: y * 0.3,
        rotation: x * 0.05,
        duration: 0.3,
        ease: "power2.out"
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Enhanced cursor tracking with trails and magnetic effects
  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      if (cursorGlowRef.current) {
        gsap.to(cursorGlowRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "none"
        });
      }

      // Create cursor trails
      trailCounter.current += 1;
      const newTrail = { id: trailCounter.current, x: e.clientX, y: e.clientY };
      
      setCursorTrails(prev => {
        const updated = [...prev, newTrail];
        return updated.slice(-8); // Keep only last 8 trails
      });

      // Remove trails after delay
      setTimeout(() => {
        setCursorTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
      }, 300);
    };
    
    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('cursor-magnetic')) {
        gsap.to(target, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('cursor-magnetic')) {
        gsap.to(target, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };
    
    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mouseenter', handleMouseEnter, true);
    window.addEventListener('mouseleave', handleMouseLeave, true);
    
    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mouseenter', handleMouseEnter, true);
      window.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  // Interactive particle effects
  const createParticleBurst = useCallback((x: number, y: number) => {
    const particleContainer = document.body;
    
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--color-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        left: ${x}px;
        top: ${y}px;
      `;
      
      particleContainer.appendChild(particle);
      
      const angle = (i / 6) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      
      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => particle.remove()
      });
    }
  }, []);

  // Enhanced scroll reveal animations
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  // Remove Scout watermark that might be injected by hosting platform
  useEffect(() => {
    const removeScoutWatermark = () => {
      // Remove by ID
      const scoutById = document.getElementById('built-by-scout');
      if (scoutById) scoutById.remove();
      
      // Remove by class or attribute containing 'scout'
      const scoutElements = document.querySelectorAll('[id*="scout"], [class*="scout"], a[href*="scout.new"], a[href*="scout.com"]');
      scoutElements.forEach(el => el.remove());
      
      // Remove elements with 'Built by Scout' text content
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.textContent?.includes('Built by Scout')) {
          el.remove();
        }
      });
      
      // Remove any fixed positioned links in bottom-right
      const fixedElements = document.querySelectorAll('*');
      fixedElements.forEach(el => {
        const element = el as HTMLElement;
        const styles = window.getComputedStyle(element);
        if (styles.position === 'fixed' && 
            element.tagName === 'A' &&
            (styles.bottom !== 'auto' && styles.right !== 'auto')) {
          const href = (element as HTMLAnchorElement).href;
          if (href?.includes('scout') || element.textContent?.includes('Scout')) {
            element.remove();
          }
        }
      });
      
      // Remove parent containers of Scout links
      const scoutLinks = document.querySelectorAll('a[href*="scout"]');
      scoutLinks.forEach(link => {
        let parent = link.parentElement;
        while (parent && parent !== document.body) {
          const styles = window.getComputedStyle(parent);
          if (styles.position === 'fixed') {
            parent.remove();
            break;
          }
          parent = parent.parentElement;
        }
      });
    };
    
    // Run immediately and repeatedly
    removeScoutWatermark();
    const interval = setInterval(removeScoutWatermark, 200);
    
    // Set up mutation observer
    const observer = new MutationObserver(() => {
      removeScoutWatermark();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Also listen for DOMContentLoaded and window load events
    const handleLoad = () => {
      setTimeout(removeScoutWatermark, 100);
      setTimeout(removeScoutWatermark, 500);
      setTimeout(removeScoutWatermark, 1000);
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleLoad);
    } else {
      handleLoad();
    }
    
    window.addEventListener('load', handleLoad);
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
      document.removeEventListener('DOMContentLoaded', handleLoad);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    // Create advanced particle system with interactive behavior
    if (particleRef.current) {
      const colors = ['var(--color-primary)', 'var(--quantum-purple)', 'var(--quantum-cyan)', 'var(--accent)', 'var(--quantum-pink)'];
      
      for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
        particleRef.current.appendChild(particle);
        
        // Complex particle animation with interactive behavior
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(particle, {
          x: (Math.random() - 0.5) * 800,
          y: (Math.random() - 0.5) * 600,
          duration: Math.random() * 15 + 10,
          ease: "none"
        })
        .to(particle, {
          scale: Math.random() + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 3 + 2,
          yoyo: true,
          repeat: -1
        }, 0);
        
        // Make particles responsive to mouse
        particle.addEventListener('mouseenter', () => {
          gsap.to(particle, {
            scale: 2,
            duration: 0.3,
            ease: "back.out(1.7)"
          });
        });
        
        particle.addEventListener('mouseleave', () => {
          gsap.to(particle, {
            scale: Math.random() * 0.5 + 0.5,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }
    }

    // Advanced hero section animations with stagger and complex easing
    const heroTl = gsap.timeline();
    
    // Scramble text effect for main headline
    if (typewriterRef.current) {
      setTimeout(() => {
        scrambleText(typewriterRef.current!, "Securing the Future with Post-Quantum Cryptography");
      }, 500);
      
      gsap.fromTo(typewriterRef.current, 
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 1,
          ease: "elastic.out(1, 0.3)",
          delay: 0.2
        }
      );
    }

    // Advanced floating lock animation with 3D transforms
    if (lockRef.current) {
      const lockTl = gsap.timeline({ repeat: -1 });
      lockTl.to(lockRef.current, {
        rotationY: 360,
        rotationX: 180,
        duration: 30,
        ease: "none"
      })
      .to(lockRef.current, {
        y: -30,
        z: 20,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "power2.inOut"
      }, 0)
      .to(lockRef.current, {
        scale: 1.2,
        duration: 6,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
      }, 0);
      
      // Add magnetic effect to lock
      createMagneticEffect(lockRef.current);
    }

    // Morphing blob animation
    if (morphingBlobRef.current) {
      gsap.to(morphingBlobRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
    }

    // Enhanced flying certificates with complex paths
    ScrollTrigger.create({
      trigger: certificatesRef.current,
      start: "top 80%",
      onEnter: () => {
        const certificates = certificatesRef.current?.querySelectorAll('.certificate');
        certificates?.forEach((cert, index) => {
          const element = cert as HTMLElement;
          
          // Create complex motion path
          gsap.fromTo(element, 
            { 
              x: -300, 
              y: Math.random() * 200 - 100,
              opacity: 0,
              scale: 0.5,
              rotation: -180
            },
            { 
              x: 0, 
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 1.5, 
              delay: index * 0.2,
              ease: "elastic.out(1, 0.5)",
              onComplete: () => {
                // Add quantum border effect
                element.classList.add('quantum-border');
                createMagneticEffect(element);
              }
            }
          );
        });
      }
    });

    // Advanced industry cards with 3D transforms and stagger
    ScrollTrigger.create({
      trigger: cardsRef.current,
      start: "top 80%",
      onEnter: () => {
        const cards = cardsRef.current?.querySelectorAll('.industry-card');
        if (cards && cards.length > 0) {
          gsap.fromTo(Array.from(cards), 
            { 
              y: 150, 
              opacity: 0,
              rotationX: -90,
              scale: 0.8
            },
            { 
              y: 0, 
              opacity: 1,
              rotationX: 0,
              scale: 1,
              duration: 1.2, 
              stagger: {
                amount: 0.8,
                from: "center"
              },
              ease: "back.out(1.7)",
              onComplete: () => {
                // Add magnetic effects to all cards
                cards.forEach(card => {
                  createMagneticEffect(card as HTMLElement);
                });
              }
            }
          );
        }
      }
    });

    // Complex Comcast timeline with alternating animations
    ScrollTrigger.create({
      trigger: comcastRef.current,
      start: "top 80%",
      onEnter: () => {
        const items = comcastRef.current?.querySelectorAll('.timeline-item');
        items?.forEach((item, index) => {
          const isEven = index % 2 === 0;
          gsap.fromTo(item,
            { 
              x: isEven ? -200 : 200, 
              y: 50,
              opacity: 0,
              rotation: isEven ? -15 : 15,
              scale: 0.8
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              rotation: 0,
              scale: 1,
              duration: 1.2,
              delay: index * 0.3,
              ease: "elastic.out(1, 0.6)"
            }
          );
        });
      }
    });

    // Advanced animated counters with morphing numbers
    ScrollTrigger.create({
      trigger: countersRef.current,
      start: "top 80%",
      onEnter: () => {
        // Create pulsing rings for counters
        const counterCards = countersRef.current?.querySelectorAll('.counter-card');
        counterCards?.forEach(card => {
          const ring = document.createElement('div');
          ring.className = 'pulse-ring';
          ring.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            border: 2px solid var(--color-primary);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
          `;
          card.appendChild(ring);
        });
        
        // Animate progress bars with advanced easing
        const progressTl = gsap.timeline();
        progressTl.to({}, {
          duration: 3,
          ease: "elastic.out(1, 0.3)",
          onUpdate: function() {
            const progress = this.progress();
            setCompliantProgress(Math.round(progress * 78));
            setReadyProgress(Math.round(progress * 65));
            setExpiringProgress(Math.round(progress * 12));
          }
        });
      }
    });

    // Advanced CTA section with complex animations
    if (ctaRef.current) {
      const button = ctaRef.current.querySelector('.cta-button');
      if (button) {
        const ctaTl = gsap.timeline({ repeat: -1 });
        ctaTl.to(button, {
          scale: 1.1,
          rotationZ: 2,
          duration: 2,
          ease: "power2.inOut"
        })
        .to(button, {
          scale: 1,
          rotationZ: -2,
          duration: 2,
          ease: "power2.inOut"
        })
        .to(button, {
          scale: 1.05,
          rotationZ: 0,
          duration: 1,
          ease: "power2.inOut"
        });
        
        createMagneticEffect(button as HTMLElement);
      }
    }

    // Interactive Demos Section Animations
    const demoCards = document.querySelectorAll('#demos .space-y-12 > *');
    demoCards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(card, 
            { 
              y: 80, 
              opacity: 0, 
              scale: 0.95,
              rotationX: -10 
            },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1,
              rotationX: 0,
              duration: 1.2, 
              delay: index * 0.1,
              ease: "elastic.out(1, 0.5)"
            }
          );
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrambleText, createMagneticEffect]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Dynamic Background Layer - Disabled for clarity */}
      {/* <DynamicBackground containerRef={heroRef} /> */}
      
      {/* Scroll Reactive Effects Layer - Minimal */}
      <ScrollReactiveEffects containerRef={heroRef} />
      
      {/* Enhanced Effects Layer - Reduced intensity */}
      <EnhancedEffects 
        containerRef={heroRef}
        intensity={25}
        mouseFollowEffects={false}
        showQuantumTunnel={false}
        showDNAHelix={false}
      />
      
      {/* Enhanced cursor effects */}
      <div ref={cursorGlowRef} className="cursor-glow" />
      
      {/* Cursor trails */}
      {cursorTrails.map((trail, index) => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: trail.x,
            top: trail.y,
            opacity: 0.6 - (index * 0.1),
            transform: `translate(-50%, -50%) scale(${1 - (index * 0.1)})`,
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
      
      {/* Morphing background blob */}
      <div 
        ref={morphingBlobRef}
        className="morphing-blob fixed top-20 right-20 w-32 h-32 opacity-10 pointer-events-none z-0"
      />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="font-serif font-bold text-xl holographic">
              Quantum ⚡ Safe
            </div>
            <div className="hidden md:flex space-x-2">
              <button onClick={() => scrollToSection('pqc')} className="nav-item cursor-magnetic hover-text">What is PQC?</button>
              <button onClick={() => scrollToSection('trends')} className="nav-item cursor-magnetic hover-text">Industry</button>
              <button onClick={() => scrollToSection('education')} className="nav-item cursor-magnetic hover-text">Learn Crypto</button>
              <button onClick={() => scrollToSection('demos')} className="nav-item cursor-magnetic hover-text">Interactive Demos</button>
              <button onClick={() => scrollToSection('comcast')} className="nav-item cursor-magnetic hover-text">Org</button>
              <button onClick={() => scrollToSection('metrics')} className="nav-item cursor-magnetic hover-text">Metrics</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div ref={particleRef} className="absolute inset-0 opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/2 to-accent/2"></div>
        
        <div className="container mx-auto px-4 text-center relative z-30">
          <div ref={lockRef} className="mb-8 text-primary ultra-glow">
            <div className="relative quantum-symbol-container">
              <Brain size={80} className="mx-auto quantum-brain" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu size={40} className="text-accent quantum-cpu" />
              </div>
              <div className="absolute top-2 right-2">
                <Network size={20} className="text-[color:var(--quantum-cyan)] quantum-network" />
              </div>
              <div className="absolute bottom-2 left-2">
                <Zap size={16} className="text-[color:var(--quantum-purple)] quantum-zap" />
              </div>
            </div>
          </div>
          
          <h1 
            ref={typewriterRef} 
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground"
            style={{textShadow: '0 0 20px var(--color-primary), 0 0 40px var(--color-primary)', color: 'var(--foreground)'}}
            data-text="Securing the Future with Post-Quantum Cryptography"
          >
            {/* Text will be animated by GSAP */}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{color: 'var(--muted-foreground)', textShadow: '0 0 10px var(--accent)'}}>
             Roadmap towards a quantum-safe world
          </p>
          
          <Button 
            size="lg" 
            className="enhanced-button cursor-magnetic particle-burst text-lg px-8 py-4"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              createParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
              scrollToSection('pqc');
            }}
          >
            Explore the Future
            <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300 interactive-icon" />
          </Button>
        </div>
      </section>

      {/* What is PQC Section */}
      <section id="pqc" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary text-primary ultra-glow interactive-badge cursor-magnetic">
              <Lock className="w-4 h-4 mr-2 interactive-icon" />
              Post-Quantum Cryptography
            </Badge>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 holographic">
              Preparing for the Quantum Era
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Post-Quantum Cryptography (PQC) prepares us for a world where quantum computers could break current encryption like <span className="text-primary font-mono">RSA</span> and <span className="text-accent font-mono">ECC</span>. These quantum-resistant algorithms ensure our data remains secure even against the most advanced quantum threats.
              </p>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                The urgency is real: while large-scale quantum computers don't exist today, the <span className="holographic font-semibold">"harvest now, decrypt later"</span> threat means adversaries are already collecting encrypted data to decrypt once quantum computers become available.
              </p>
              
              <div className="space-y-4">
                <a href="https://csrc.nist.gov/projects/post-quantum-cryptography" target="_blank" rel="noopener noreferrer" className="enhanced-link cursor-magnetic group">
                  <ExternalLink className="w-4 h-4 mr-2 interactive-icon" />
                  NIST PQC Standards
                </a>
                <a href="https://en.wikipedia.org/wiki/RSA_%28cryptosystem%29" target="_blank" rel="noopener noreferrer" className="enhanced-link cursor-magnetic group text-[color:var(--quantum-cyan)]">
                  <ExternalLink className="w-4 h-4 mr-2 interactive-icon" />
                  RSA Cryptosystem Overview
                </a>
                <a href="https://en.wikipedia.org/wiki/Elliptic-curve_cryptography" target="_blank" rel="noopener noreferrer" className="enhanced-link cursor-magnetic group text-[color:var(--quantum-purple)]">
                  <ExternalLink className="w-4 h-4 mr-2 interactive-icon" />
                  Elliptic Curve Cryptography
                </a>
              </div>
            </div>
            
            <div ref={certificatesRef} className="space-y-6">
              <div className="certificate morphing-container cursor-magnetic glow-border flex items-center space-x-4 p-6 bg-card/80 border border-primary/30 rounded-xl hover:border-primary/60 transition-colors">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center ultra-glow floating-element">
                  <Key className="text-primary interactive-icon" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 hover-text cursor-magnetic">Quantum-Resistant Certificates</h4>
                  <p className="text-sm text-muted-foreground">NIST-approved algorithms like CRYSTALS-Kyber</p>
                </div>
              </div>
              <div className="certificate morphing-container cursor-magnetic glow-border flex items-center space-x-4 p-6 bg-card/80 border border-accent/30 rounded-xl hover:border-accent/60 transition-colors">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center ultra-glow floating-element">
                  <Shield className="text-accent interactive-icon" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 hover-text cursor-magnetic">Future-Proof Encryption</h4>
                  <p className="text-sm text-muted-foreground">Lattice-based cryptography for long-term security</p>
                </div>
              </div>
              <div className="certificate morphing-container cursor-magnetic glow-border flex items-center space-x-4 p-6 bg-card/80 border border-[color:var(--quantum-cyan)]/30 rounded-xl hover:border-[color:var(--quantum-cyan)]/60 transition-colors">
                <div className="w-12 h-12 bg-[color:var(--quantum-cyan)]/20 rounded-xl flex items-center justify-center ultra-glow floating-element">
                  <Network className="text-[color:var(--quantum-cyan)] interactive-icon" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 hover-text cursor-magnetic">Secure Communications</h4>
                  <p className="text-sm text-muted-foreground">Hybrid classical-quantum protection layers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Trends Section */}
      <section id="trends" className="py-20 bg-card/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-accent text-accent ultra-glow">
              <Globe className="w-4 h-4 mr-2" />
              Industry Leaders
            </Badge>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 holographic">
              Who's Adopting PQC?
            </h2>
          </div>
          
          <div ref={cardsRef} className="grid md:grid-cols-3 gap-8">
            <div className="flip-card cursor-magnetic">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <Card className="industry-card w-full h-full border-primary/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-quantum-purple/20"></div>
                    <CardHeader className="relative z-10">
                      <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-4 ultra-glow">
                        <Brain className="text-primary interactive-icon" size={32} />
                      </div>
                      <CardTitle className="text-primary text-xl hover-text">Google Chrome</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
                <div className="flip-card-back">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-primary">Google Chrome PQC</h3>
                    <p className="text-sm">Implementing hybrid PQC/classical key exchange with advanced cryptographic protocols</p>
                    <a href="https://security.googleblog.com/2023/08/experimenting-with-post-quantum.html" target="_blank" rel="noopener noreferrer" className="enhanced-link inline-flex items-center">
                      Learn More <ExternalLink className="w-4 h-4 ml-1 interactive-icon" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flip-card cursor-magnetic">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <Card className="industry-card w-full h-full border-accent/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-quantum-cyan/20"></div>
                    <CardHeader className="relative z-10">
                      <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center mb-4 ultra-glow">
                        <Cpu className="text-accent interactive-icon" size={32} />
                      </div>
                      <CardTitle className="text-accent text-xl hover-text">Cloudflare</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
                <div className="flip-card-back">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-accent">Cloudflare PQC</h3>
                    <p className="text-sm">Rolling out PQC in TLS connections globally with zero-downtime migration</p>
                    <a href="https://blog.cloudflare.com/post-quantum-cryptography/" target="_blank" rel="noopener noreferrer" className="enhanced-link inline-flex items-center">
                      Learn More <ExternalLink className="w-4 h-4 ml-1 interactive-icon" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flip-card cursor-magnetic">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <Card className="industry-card w-full h-full border-quantum-cyan/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-quantum-cyan/20 via-transparent to-quantum-pink/20"></div>
                    <CardHeader className="relative z-10">
                      <div className="w-16 h-16 bg-quantum-cyan/20 rounded-xl flex items-center justify-center mb-4 ultra-glow">
                        <Building className="text-[color:var(--quantum-cyan)] interactive-icon" size={32} />
                      </div>
                      <CardTitle className="text-[color:var(--quantum-cyan)] text-xl hover-text">Microsoft</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
                <div className="flip-card-back">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-[color:var(--quantum-cyan)]">Microsoft PQC</h3>
                    <p className="text-sm">Integrating PQC across enterprise solutions and cloud infrastructure</p>
                    <a href="https://www.microsoft.com/en-us/security/business/security-insider/post-quantum-cryptography" target="_blank" rel="noopener noreferrer" className="enhanced-link inline-flex items-center">
                      Learn More <ExternalLink className="w-4 h-4 ml-1 interactive-icon" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cryptography Education Section */}
      <section id="education" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-[color:var(--quantum-orange)] text-[color:var(--quantum-orange)] ultra-glow interactive-badge cursor-magnetic">
              <Brain className="w-4 h-4 mr-2 interactive-icon" />
              Cryptography Fundamentals
            </Badge>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 holographic">
              Understanding Classical & Quantum Cryptography
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Explore the mathematical foundations of RSA and ECC, then discover how Shor's and Grover's algorithms revolutionize cryptanalysis
            </p>
          </div>
          
          <div className="space-y-12">
            {/* RSA Deep Dive */}
            <RSADemo className="reveal-on-scroll" />
            
            {/* Elliptic Curve Cryptography */}
            <ECCDemo className="reveal-on-scroll" />
            
            {/* Shor's Algorithm */}
            <ShorDemo className="reveal-on-scroll" />
            
            {/* Grover's Algorithm */}
            <GroverDemo className="reveal-on-scroll" />
          </div>
          
          <div className="text-center mt-16">
            <div className="p-6 bg-gradient-to-r from-destructive/10 via-primary/10 to-accent/10 rounded-2xl border border-primary/30">
              <h3 className="text-2xl font-semibold mb-4 holographic">Key Takeaways</h3>
              <div className="grid md:grid-cols-4 gap-6 text-sm">
                <div className="space-y-2 cursor-magnetic morphing-container">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto floating-element">
                    <Calculator className="text-primary interactive-icon" size={24} />
                  </div>
                  <h4 className="font-semibold hover-text cursor-magnetic">RSA Mathematics</h4>
                  <p className="text-muted-foreground">Based on difficulty of factoring large numbers into prime components</p>
                </div>
                <div className="space-y-2 cursor-magnetic morphing-container">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto floating-element">
                    <TrendingUp className="text-accent interactive-icon" size={24} />
                  </div>
                  <h4 className="font-semibold hover-text cursor-magnetic">ECC Efficiency</h4>
                  <p className="text-muted-foreground">Provides same security as RSA with much smaller key sizes</p>
                </div>
                <div className="space-y-2 cursor-magnetic morphing-container">
                  <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center mx-auto floating-element">
                    <Zap className="text-destructive interactive-icon" size={24} />
                  </div>
                  <h4 className="font-semibold hover-text cursor-magnetic">Shor's Threat</h4>
                  <p className="text-muted-foreground">Quantum algorithm breaks both RSA and ECC in polynomial time</p>
                </div>
                <div className="space-y-2 cursor-magnetic morphing-container">
                  <div className="w-12 h-12 bg-[color:var(--quantum-cyan)]/20 rounded-xl flex items-center justify-center mx-auto floating-element">
                    <Search className="text-[color:var(--quantum-cyan)] interactive-icon" size={24} />
                  </div>
                  <h4 className="font-semibold hover-text cursor-magnetic">Grover's Impact</h4>
                  <p className="text-muted-foreground">Effectively halves the security of symmetric encryption systems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demos Section */}
      <section id="demos" ref={demosRef} className="py-20 relative overflow-hidden bg-card/30">
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--quantum-purple)]/5 via-transparent to-[color:var(--quantum-cyan)]/5"></div>
        {/* Enhanced effects for demos section - Reduced */}
        <EnhancedEffects 
          containerRef={demosRef}
          intensity={15}
          mouseFollowEffects={false}
          showQuantumTunnel={false}
          showDNAHelix={false}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-[color:var(--quantum-purple)] text-[color:var(--quantum-purple)] ultra-glow interactive-badge cursor-magnetic">
              <PlayCircle className="w-4 h-4 mr-2 interactive-icon" />
              Interactive Learning
            </Badge>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 holographic">
              Experience Quantum vs Classical
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Interactive simulations that demonstrate the differences between classical and post-quantum cryptography
            </p>
          </div>
          
          <div className="space-y-12">
            {/* Encryption Attack Demo */}
            <EncryptionDemo className="mb-12" />
            
            {/* Key Exchange Demo */}
            <KeyExchangeDemo className="mb-12" />
            
            {/* Encryption Strength Meter */}
            <EncryptionStrengthMeter className="mb-12" />
            
            {/* Quantum Timeline */}
            <QuantumTimeline className="mb-12" />
            
            {/* Global PQC Map */}
            <GlobalPQCMap className="mb-12" />
          </div>
          
          <div className="text-center mt-16">
            <div className="p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-[color:var(--quantum-purple)]/10 rounded-2xl border border-primary/30">
              <h3 className="text-2xl font-semibold mb-4 holographic">Key Takeaways</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2 cursor-magnetic morphing-container">
                  <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center mx-auto floating-element">
                    <Zap className="text-destructive interactive-icon" size={24} />
                  </div>
                  <h4 className="font-semibold hover-text cursor-magnetic">Quantum Threat is Real</h4>
                  <p className="text-muted-foreground">Current encryption methods are vulnerable to quantum computers using Shor's algorithm.</p>
                </div>
                <div className="space-y-2 cursor-magnetic morphing-container">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto floating-element">
                    <Shield className="text-primary interactive-icon" size={24} />
                  </div>
                  <h4 className="font-semibold hover-text cursor-magnetic">PQC Provides Defense</h4>
                  <p className="text-muted-foreground">Post-quantum algorithms are designed to resist both classical and quantum attacks.</p>
                </div>
                <div className="space-y-2 cursor-magnetic morphing-container">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto floating-element">
                    <Building className="text-accent interactive-icon" size={24} />
                  </div>
                  <h4 className="font-semibold hover-text cursor-magnetic">Act Now</h4>
                  <p className="text-muted-foreground">Organizations must start transitioning to quantum-safe cryptography today.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comcast Role Section */}
      <section ref={comcastRef} id="comcast" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 ultra-glow floating-element cursor-magnetic quantum-state">
              <Building className="text-primary interactive-icon" size={40} />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 holographic">
              Organization Quantum-Safe Initiative
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Leading the telecommunications industry in quantum-safe transformation through innovative cryptographic solutions and infrastructure modernization
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="space-y-16">
              <div className="timeline-item reveal-on-scroll flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="timeline-point w-16 h-16 bg-primary rounded-full flex items-center justify-center ultra-glow flex-shrink-0 cursor-magnetic">
                  <Users className="text-primary-foreground interactive-icon" size={28} />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-4 holographic hover-text cursor-magnetic holo-reveal" data-text="Protecting Customer Data at Scale">Protecting Customer Data at Scale</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Securing millions of customer interactions across broadband, streaming, and digital services with quantum-resistant encryption. Our comprehensive approach ensures every touchpoint—from cable modems to streaming servers—implements post-quantum cryptographic standards.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge className="interactive-badge cursor-magnetic bg-primary/20 text-primary border-primary/30">50M+ Customers</Badge>
                    <Badge className="interactive-badge cursor-magnetic bg-accent/20 text-accent border-accent/30">Real-time Protection</Badge>
                    <Badge className="interactive-badge cursor-magnetic bg-[color:var(--quantum-cyan)]/20 text-[color:var(--quantum-cyan)] border-[color:var(--quantum-cyan)]/30">Zero Downtime</Badge>
                  </div>
                </div>
              </div>
              
              <div className="timeline-item reveal-on-scroll flex flex-col md:flex-row-reverse items-center space-y-6 md:space-y-0 md:space-x-8 md:space-x-reverse">
                <div className="timeline-point w-16 h-16 bg-accent rounded-full flex items-center justify-center ultra-glow flex-shrink-0 cursor-magnetic">
                  <Network className="text-accent-foreground interactive-icon" size={28} />
                </div>
                <div className="text-center md:text-right">
                  <h3 className="text-2xl font-semibold mb-4 holographic hover-text cursor-magnetic holo-reveal" data-text="Infrastructure Modernization">Infrastructure Modernization</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Upgrading network infrastructure, streaming platforms, and cybersecurity systems to be quantum-ready. This includes replacing legacy TLS certificates, implementing hybrid classical-quantum protocols, and ensuring compatibility across our entire technology stack.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-end">
                    <Badge className="interactive-badge cursor-magnetic bg-accent/20 text-accent border-accent/30">Network-wide Deployment</Badge>
                    <Badge className="interactive-badge cursor-magnetic bg-[color:var(--quantum-purple)]/20 text-[color:var(--quantum-purple)] border-[color:var(--quantum-purple)]/30">Hybrid Protocols</Badge>
                    <Badge className="interactive-badge cursor-magnetic bg-primary/20 text-primary border-primary/30">Future-Ready</Badge>
                  </div>
                </div>
              </div>
              
              <div className="timeline-item reveal-on-scroll flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="timeline-point w-16 h-16 bg-[color:var(--quantum-cyan)] rounded-full flex items-center justify-center ultra-glow flex-shrink-0 cursor-magnetic">
                  <Shield className="text-black interactive-icon" size={28} />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-4 holographic hover-text cursor-magnetic holo-reveal" data-text="Certificate Management">Certificate Management</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Proactively replacing vulnerable certificates and implementing quantum-safe cryptographic standards across our entire digital ecosystem. Our automated certificate lifecycle management ensures continuous protection as we transition to post-quantum algorithms.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge className="interactive-badge cursor-magnetic bg-[color:var(--quantum-cyan)]/20 text-[color:var(--quantum-cyan)] border-[color:var(--quantum-cyan)]/30">Automated Management</Badge>
                    <Badge className="interactive-badge cursor-magnetic bg-[color:var(--quantum-pink)]/20 text-[color:var(--quantum-pink)] border-[color:var(--quantum-pink)]/30">NIST Compliant</Badge>
                    <Badge className="interactive-badge cursor-magnetic bg-accent/20 text-accent border-accent/30">Continuous Monitoring</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="py-20 bg-card/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-[color:var(--quantum-cyan)] text-[color:var(--quantum-cyan)] ultra-glow interactive-badge cursor-magnetic">
              <Zap className="w-4 h-4 mr-2 interactive-icon" />
              Key Performance Indicators
            </Badge>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 holographic">
              Why It Matters
            </h2>
          </div>
          
          <div ref={countersRef} className="grid md:grid-cols-3 gap-8">
            <Card className="counter-card morphing-container cursor-magnetic glow-border text-center bg-card/80 border-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-quantum-purple/10 data-stream"></div>
              <CardHeader className="relative z-10">
                <div className="text-5xl font-bold text-primary mb-2 ultra-glow font-mono hover-text cursor-magnetic">{compliantProgress}%</div>
                <CardTitle className="text-lg holographic hover-text cursor-magnetic">PQC Compliant Certificates</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <Progress value={compliantProgress} className="interactive-progress w-full mb-2 h-3" />
                <p className="text-sm text-muted-foreground">Current deployment status across infrastructure</p>
              </CardContent>
            </Card>
            
            <Card className="counter-card morphing-container cursor-magnetic glow-border text-center bg-card/80 border-accent/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-quantum-cyan/10 data-stream"></div>
              <CardHeader className="relative z-10">
                <div className="text-5xl font-bold text-accent mb-2 ultra-glow font-mono hover-text cursor-magnetic">{readyProgress}%</div>
                <CardTitle className="text-lg holographic hover-text cursor-magnetic">Systems Quantum-Ready</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <Progress value={readyProgress} className="interactive-progress w-full mb-2 h-3" />
                <p className="text-sm text-muted-foreground">Infrastructure modernization progress</p>
              </CardContent>
            </Card>
            
            <Card className="counter-card morphing-container cursor-magnetic glow-border text-center bg-card/80 border-destructive/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-transparent to-quantum-pink/10 data-stream"></div>
              <CardHeader className="relative z-10">
                <div className="text-5xl font-bold text-destructive mb-2 ultra-glow font-mono hover-text cursor-magnetic">{expiringProgress}%</div>
                <CardTitle className="text-lg holographic hover-text cursor-magnetic">Legacy Certificates Expiring</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <Progress value={expiringProgress} className="interactive-progress w-full mb-2 h-3" />
                <p className="text-sm text-muted-foreground">Requiring immediate quantum-safe upgrade</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-32 gradient-shift relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 text-white ultra-glow">
              "Quantum security is not tomorrow's problem. It's today's priority."
            </h2>
            
            <p className="text-xl text-white/80 mb-12 holographic">
              Join in building a quantum-safe future for all
            </p>
            
            <Button 
              size="lg" 
              className="enhanced-button cursor-magnetic particle-burst bg-white text-black hover:bg-white/90 text-lg px-12 py-6 font-semibold"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                createParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
            >
              Learn More About PQC
              <ArrowRight className="ml-2 interactive-icon" />
            </Button>
          </div>
        </div>
        
        {/* Enhanced background particles */}
        <div className="absolute inset-0 opacity-40">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full glow"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 6}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="font-serif font-bold text-2xl holographic mb-4 hover-text cursor-magnetic holo-reveal" data-text="Quantum ⚡ Safe">
            Quantum ⚡ Safe
          </div>
          <p className="text-muted-foreground mb-4">
            Securing the future with Post-Quantum Cryptography
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <span className="enhanced-link cursor-magnetic hover-text">Privacy Policy</span>
            <span className="enhanced-link cursor-magnetic hover-text">Terms of Service</span>
            <span className="enhanced-link cursor-magnetic hover-text text-[color:var(--quantum-cyan)]">Contact Us</span>
          </div>
        </div>
      </footer>


    </div>
  );
}
