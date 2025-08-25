import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { gsap } from "gsap";

interface EncryptionDemoProps {
  className?: string;
}

export function EncryptionDemo({ className }: EncryptionDemoProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState<'classical' | 'quantum'>('classical');
  const [attackProgress, setAttackProgress] = useState(0);
  const [isAttacked, setIsAttacked] = useState(false);
  
  const messageRef = useRef<HTMLDivElement>(null);
  const encryptionRef = useRef<HTMLDivElement>(null);
  const attackRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const classicalSteps = [
    "Original Message",
    "RSA Key Generation",
    "RSA Encryption",
    "Encrypted Data",
    "Classical Computer Attack",
    "Decryption Failed"
  ];

  const quantumSteps = [
    "Original Message", 
    "PQC Key Generation",
    "Lattice Encryption",
    "Encrypted Data",
    "Quantum Computer Attack",
    "Encryption Holds Strong"
  ];

  const steps = selectedType === 'classical' ? classicalSteps : quantumSteps;

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setAttackProgress(0);
    setIsAttacked(false);
    timelineRef.current?.kill();
  };

  const startDemo = () => {
    if (isRunning) {
      setIsRunning(false);
      timelineRef.current?.pause();
      return;
    }

    setIsRunning(true);
    setIsAttacked(false);
    
    const tl = gsap.timeline({
      onComplete: () => setIsRunning(false)
    });
    
    timelineRef.current = tl;

    // Step through each phase
    steps.forEach((step, index) => {
      tl.call(() => setCurrentStep(index))
        .to({}, { duration: 1.5 })
        .call(() => {
          if (index === 4) {
            // Attack simulation
            gsap.to({}, {
              duration: selectedType === 'classical' ? 3 : 5,
              ease: selectedType === 'classical' ? "power2.inOut" : "none",
              onUpdate: function() {
                const progress = this.progress() * 100;
                setAttackProgress(progress);
                
                if (selectedType === 'classical' && progress > 90) {
                  setIsAttacked(true);
                } else if (selectedType === 'quantum' && progress > 95) {
                  // PQC resists attack
                  setAttackProgress(100);
                }
              }
            });
          }
        });
    });
  };

  const getMessageText = () => {
    switch (currentStep) {
      case 0: return "Hello, Quantum World! 🌍";
      case 1: return selectedType === 'classical' ? "Generating RSA-2048 keys..." : "Generating CRYSTALS-Kyber keys...";
      case 2: return selectedType === 'classical' ? "7f8a9b2c3d4e5f6a..." : "a9f4d7c2b8e1f5a6...";
      case 3: return "*** ENCRYPTED DATA ***";
      case 4: return selectedType === 'classical' ? "Quantum attack in progress..." : "Quantum attack detected...";
      case 5: return selectedType === 'classical' ? "💀 DECRYPTED!" : "🔒 STILL ENCRYPTED";
      default: return "Hello, Quantum World! 🌍";
    }
  };

  const getStepColor = () => {
    if (currentStep >= 4) {
      return selectedType === 'classical' ? 'text-destructive' : 'text-accent';
    }
    return 'text-primary';
  };

  useEffect(() => {
    if (messageRef.current) {
      gsap.fromTo(messageRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [currentStep, getMessageText()]);

  return (
    <div className={className}>
      <Card className="bg-card/80 border-primary/30 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl holographic">Encryption Attack Simulation</CardTitle>
          <CardDescription>
            See how quantum computers affect different encryption methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Type Selection */}
          <div className="flex space-x-4">
            <Button
              variant={selectedType === 'classical' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedType('classical');
                resetDemo();
              }}
              className="flex-1"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Classical (RSA)
            </Button>
            <Button
              variant={selectedType === 'quantum' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedType('quantum');
                resetDemo();
              }}
              className="flex-1"
            >
              <Shield className="w-4 h-4 mr-2" />
              Post-Quantum (PQC)
            </Button>
          </div>

          {/* Message Display */}
          <div className="text-center p-6 bg-secondary/50 rounded-xl border border-border">
            <div ref={messageRef} className={`font-mono text-lg ${getStepColor()}`}>
              {getMessageText()}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Step {currentStep + 1}: {steps[currentStep]}
            </div>
          </div>

          {/* Progress Visualization */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Encryption Process</span>
              <span>{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
            </div>
            <Progress 
              value={(currentStep / (steps.length - 1)) * 100} 
              className="h-3"
            />
          </div>

          {/* Attack Progress */}
          {currentStep >= 4 && (
            <div className="space-y-4 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedType === 'classical' ? 'Quantum Attack Progress' : 'Attack Resistance'}
                </span>
                <Badge variant={selectedType === 'classical' ? 'destructive' : 'default'}>
                  {selectedType === 'classical' ? 'VULNERABLE' : 'SECURE'}
                </Badge>
              </div>
              <Progress 
                value={attackProgress} 
                className={`h-3 ${selectedType === 'classical' ? 'text-destructive' : 'text-accent'}`}
              />
              <div className="text-xs text-muted-foreground">
                {selectedType === 'classical' 
                  ? 'Shor\'s algorithm breaks RSA encryption in polynomial time'
                  : 'Lattice-based cryptography resists quantum attacks'
                }
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex space-x-4">
            <Button
              onClick={startDemo}
              className="flex-1"
              disabled={currentStep === steps.length - 1 && !isRunning}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {currentStep === 0 ? 'Start Demo' : 'Resume'}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetDemo}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Results */}
          {currentStep === steps.length - 1 && (
            <div className={`p-4 rounded-xl border ${
              selectedType === 'classical' 
                ? 'bg-destructive/10 border-destructive/20' 
                : 'bg-accent/10 border-accent/20'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {selectedType === 'classical' ? (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-accent" />
                )}
                <span className="font-semibold">
                  {selectedType === 'classical' ? 'Encryption Broken!' : 'Encryption Secure!'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedType === 'classical' 
                  ? 'RSA encryption was broken by a quantum computer using Shor\'s algorithm in just a few seconds.'
                  : 'Post-quantum cryptography successfully resisted the quantum attack, keeping data secure.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}