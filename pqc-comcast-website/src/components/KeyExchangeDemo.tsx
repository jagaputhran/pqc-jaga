import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Wifi, Shield, Zap, Users } from "lucide-react";
import { gsap } from "gsap";

interface KeyExchangeDemoProps {
  className?: string;
}

export function KeyExchangeDemo({ className }: KeyExchangeDemoProps) {
  const [selectedProtocol, setSelectedProtocol] = useState<'dh' | 'kyber'>('dh');
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [keySize, setKeySize] = useState(0);
  const [isSecure, setIsSecure] = useState(true);

  const aliceRef = useRef<HTMLDivElement>(null);
  const bobRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef<HTMLDivElement>(null);
  const attackerRef = useRef<HTMLDivElement>(null);

  const dhPhases = [
    { name: "Initial Setup", alice: "Choose private key a", bob: "Choose private key b" },
    { name: "Public Key Generation", alice: "Calculate g^a mod p", bob: "Calculate g^b mod p" },
    { name: "Public Key Exchange", alice: "Send g^a →", bob: "← Send g^b" },
    { name: "Shared Secret", alice: "Calculate (g^b)^a", bob: "Calculate (g^a)^b" },
    { name: "Quantum Attack", alice: "⚠️ Key Compromised", bob: "⚠️ Key Compromised" }
  ];

  const kyberPhases = [
    { name: "Initial Setup", alice: "Generate lattice keys", bob: "Prepare to receive" },
    { name: "Encapsulation", alice: "Create key + ciphertext", bob: "Wait for encrypted key" },
    { name: "Key Transmission", alice: "Send ciphertext →", bob: "Receive ciphertext" },
    { name: "Decapsulation", alice: "Key ready", bob: "Extract shared key" },
    { name: "Quantum Attack", alice: "🔒 Key Secure", bob: "🔒 Key Secure" }
  ];

  const phases = selectedProtocol === 'dh' ? dhPhases : kyberPhases;

  const startDemo = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentPhase(0);
    setKeySize(0);
    setIsSecure(true);

    for (let i = 0; i < phases.length; i++) {
      setCurrentPhase(i);
      
      // Animate participants
      if (aliceRef.current && bobRef.current) {
        gsap.fromTo([aliceRef.current, bobRef.current],
          { scale: 0.95, opacity: 0.7 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }

      // Key exchange animation
      if (i === 2) {
        await animateKeyExchange();
      }

      // Quantum attack simulation
      if (i === 4) {
        await simulateQuantumAttack();
      }

      // Update key size gradually
      gsap.to({}, {
        duration: 1.5,
        onUpdate: function() {
          const targetSize = selectedProtocol === 'dh' ? 256 : 768;
          setKeySize(Math.round(this.progress() * targetSize));
        }
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsRunning(false);
  };

  const animateKeyExchange = () => {
    return new Promise<void>(resolve => {
      if (aliceRef.current && bobRef.current) {
        const keyElement = document.createElement('div');
        keyElement.className = 'absolute w-4 h-4 bg-primary rounded-full glow';
        keyElement.style.top = '50%';
        keyElement.style.left = '20%';
        document.body.appendChild(keyElement);

        gsap.to(keyElement, {
          x: 400,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            keyElement.remove();
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  };

  const simulateQuantumAttack = () => {
    return new Promise<void>(resolve => {
      if (attackerRef.current) {
        gsap.fromTo(attackerRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 }
        );

        // Simulate attack outcome
        setTimeout(() => {
          if (selectedProtocol === 'dh') {
            setIsSecure(false);
          }
          resolve();
        }, 1500);
      } else {
        resolve();
      }
    });
  };

  const resetDemo = () => {
    setCurrentPhase(0);
    setIsRunning(false);
    setKeySize(0);
    setIsSecure(true);
  };

  const getSecurityBadge = () => {
    if (currentPhase < 4) {
      return <Badge className="bg-primary/20 text-primary">Establishing Connection</Badge>;
    }
    
    if (selectedProtocol === 'dh') {
      return <Badge variant="destructive">Quantum Vulnerable</Badge>;
    } else {
      return <Badge className="bg-accent/20 text-accent">Quantum Safe</Badge>;
    }
  };

  return (
    <div className={className}>
      <Card className="bg-card/80 border-accent/30 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl holographic">Key Exchange Protocols</CardTitle>
          <CardDescription>
            Compare classical and post-quantum key exchange methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Protocol Selection */}
          <div className="flex space-x-4">
            <Button
              variant={selectedProtocol === 'dh' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedProtocol('dh');
                resetDemo();
              }}
              className="flex-1"
            >
              <Wifi className="w-4 h-4 mr-2" />
              Diffie-Hellman
            </Button>
            <Button
              variant={selectedProtocol === 'kyber' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedProtocol('kyber');
                resetDemo();
              }}
              className="flex-1"
            >
              <Shield className="w-4 h-4 mr-2" />
              CRYSTALS-Kyber
            </Button>
          </div>

          {/* Current Phase Display */}
          <div className="text-center p-4 bg-secondary/50 rounded-xl border border-border">
            <div className="font-semibold mb-2">{phases[currentPhase]?.name}</div>
            <div className="flex justify-between items-center">
              {getSecurityBadge()}
              <Badge variant="outline">
                Key Size: {keySize} bits
              </Badge>
            </div>
          </div>

          {/* Participants Visualization */}
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Alice */}
            <div ref={aliceRef} className="text-center p-4 bg-primary/10 rounded-xl border border-primary/30">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 ultra-glow">
                <Users className="text-primary" size={24} />
              </div>
              <div className="font-semibold mb-1">Alice</div>
              <div className="text-xs text-muted-foreground min-h-[3rem] flex items-center justify-center">
                {phases[currentPhase]?.alice}
              </div>
            </div>

            {/* Key Exchange Arrow */}
            <div className="flex flex-col items-center space-y-2">
              <ArrowRight className={`text-accent transition-all duration-500 ${currentPhase === 2 ? 'scale-125 glow' : ''}`} />
              <div ref={keyRef} className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                <Zap className="text-accent" size={16} />
              </div>
              <ArrowLeft className={`text-accent transition-all duration-500 ${currentPhase === 2 ? 'scale-125 glow' : ''}`} />
            </div>

            {/* Bob */}
            <div ref={bobRef} className="text-center p-4 bg-accent/10 rounded-xl border border-accent/30">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2 ultra-glow">
                <Users className="text-accent" size={24} />
              </div>
              <div className="font-semibold mb-1">Bob</div>
              <div className="text-xs text-muted-foreground min-h-[3rem] flex items-center justify-center">
                {phases[currentPhase]?.bob}
              </div>
            </div>
          </div>

          {/* Quantum Attacker */}
          {currentPhase >= 4 && (
            <div ref={attackerRef} className="text-center p-4 bg-destructive/10 rounded-xl border border-destructive/30">
              <div className="font-semibold mb-2 flex items-center justify-center">
                <Zap className="w-4 h-4 mr-2 text-destructive" />
                Quantum Computer Attack
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedProtocol === 'dh' 
                  ? '⚠️ Successfully breaks discrete logarithm problem'
                  : '🔒 Cannot solve lattice-based hard problems'
                }
              </div>
            </div>
          )}

          {/* Protocol Comparison */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-semibold text-primary">Diffie-Hellman</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Based on discrete logarithm</li>
                <li>• Key size: 256-384 bits</li>
                <li>• Fast and efficient</li>
                <li>• ⚠️ Quantum vulnerable</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-accent">CRYSTALS-Kyber</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Based on lattice problems</li>
                <li>• Key size: 768-1536 bits</li>
                <li>• NIST standardized</li>
                <li>• 🔒 Quantum resistant</li>
              </ul>
            </div>
          </div>

          {/* Controls */}
          <div className="flex space-x-4">
            <Button
              onClick={startDemo}
              className="flex-1"
              disabled={isRunning}
            >
              {isRunning ? 'Running Demo...' : 'Start Key Exchange'}
            </Button>
            <Button variant="outline" onClick={resetDemo} disabled={isRunning}>
              Reset
            </Button>
          </div>

          {/* Final Result */}
          {currentPhase >= 4 && !isRunning && (
            <div className={`p-4 rounded-xl border ${
              selectedProtocol === 'dh'
                ? 'bg-destructive/10 border-destructive/20'
                : 'bg-accent/10 border-accent/20'
            }`}>
              <div className="font-semibold mb-2">
                {selectedProtocol === 'dh' ? '💀 Key Exchange Compromised' : '🔒 Key Exchange Secure'}
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedProtocol === 'dh'
                  ? 'The quantum computer successfully broke the discrete logarithm problem, exposing the shared secret key.'
                  : 'The lattice-based encryption remained secure against quantum attacks, protecting the shared secret key.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}