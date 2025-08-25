import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calculator, Key, Lock, Unlock, RefreshCw, Play, Pause, Zap } from "lucide-react";
import { gsap } from "gsap";

interface RSADemoProps {
  className?: string;
}

// Helper functions for RSA mathematics
const gcd = (a: number, b: number): number => {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
};

const modPow = (base: number, exp: number, mod: number): number => {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
};

const findE = (phi: number): number => {
  for (let e = 3; e < phi; e += 2) {
    if (gcd(e, phi) === 1) {
      return e;
    }
  }
  return 3;
};

const findD = (e: number, phi: number): number => {
  for (let d = 1; d < phi; d++) {
    if ((e * d) % phi === 1) {
      return d;
    }
  }
  return 1;
};

const smallPrimes = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

export function RSADemo({ className }: RSADemoProps) {
  const [p, setP] = useState(11);
  const [q, setQ] = useState(13);
  const [message, setMessage] = useState(42);
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMath, setShowMath] = useState(true);
  
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mathRef = useRef<HTMLDivElement>(null);
  
  // Calculate RSA values
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const e = findE(phi);
  const d = findD(e, phi);
  const encrypted = modPow(message, e, n);
  const decrypted = modPow(encrypted, d, n);

  const steps = [
    {
      title: "Step 1: Choose Two Prime Numbers",
      content: `p = ${p}, q = ${q}`,
      formula: "Choose large primes p and q",
      explanation: "In real RSA, these would be hundreds of digits long!"
    },
    {
      title: "Step 2: Calculate Modulus",
      content: `n = p × q = ${p} × ${q} = ${n}`,
      formula: "n = p × q",
      explanation: "This becomes part of both public and private keys"
    },
    {
      title: "Step 3: Calculate Euler's Totient",
      content: `φ(n) = (p-1) × (q-1) = ${p-1} × ${q-1} = ${phi}`,
      formula: "φ(n) = (p-1)(q-1)",
      explanation: "Counts integers less than n that are coprime to n"
    },
    {
      title: "Step 4: Choose Public Exponent",
      content: `e = ${e} (where gcd(e, φ(n)) = 1)`,
      formula: "1 < e < φ(n), gcd(e, φ(n)) = 1",
      explanation: "Common choices: 3, 17, 65537"
    },
    {
      title: "Step 5: Calculate Private Exponent",
      content: `d = ${d} (where e × d ≡ 1 (mod φ(n)))`,
      formula: "ed ≡ 1 (mod φ(n))",
      explanation: "This is the modular multiplicative inverse"
    },
    {
      title: "Step 6: Encryption",
      content: `c = m^e mod n = ${message}^${e} mod ${n} = ${encrypted}`,
      formula: "c = m^e mod n",
      explanation: "Anyone can encrypt with the public key (n, e)"
    },
    {
      title: "Step 7: Decryption",
      content: `m = c^d mod n = ${encrypted}^${d} mod ${n} = ${decrypted}`,
      formula: "m = c^d mod n",
      explanation: "Only the private key holder can decrypt"
    }
  ];

  const animateStep = (stepIndex: number) => {
    if (stepRefs.current[stepIndex]) {
      gsap.fromTo(stepRefs.current[stepIndex], 
        { 
          opacity: 0, 
          x: -50,
          scale: 0.9,
          rotationY: -15
        },
        { 
          opacity: 1, 
          x: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          onComplete: () => {
            // Add a subtle glow effect after animation
            if (stepRefs.current[stepIndex]) {
              gsap.to(stepRefs.current[stepIndex], {
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
                duration: 0.3
              });
            }
          }
        }
      );
    }
  };

  const runAnimation = async () => {
    setIsAnimating(true);
    setStep(0);
    
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      animateStep(i);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setIsAnimating(false);
  };

  const resetDemo = () => {
    setStep(0);
    setIsAnimating(false);
    gsap.set(stepRefs.current, { opacity: 0.3, x: 0, scale: 1 });
  };

  useEffect(() => {
    animateStep(step);
  }, [step]);

  return (
    <Card className={`${className} glow-border cursor-magnetic`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Calculator className="text-primary interactive-icon" size={24} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold holographic">RSA Cryptography Deep Dive</CardTitle>
              <CardDescription>Interactive step-by-step RSA encryption process</CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={runAnimation}
              disabled={isAnimating}
              className="enhanced-button cursor-magnetic"
              size="sm"
            >
              {isAnimating ? <Pause size={16} /> : <Play size={16} />}
              {isAnimating ? "Playing..." : "Run Demo"}
            </Button>
            <Button
              onClick={resetDemo}
              variant="outline"
              className="cursor-magnetic"
              size="sm"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Parameter Controls */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Prime p: {p}</label>
            <Slider
              value={[smallPrimes.indexOf(p)]}
              onValueChange={([value]) => setP(smallPrimes[value])}
              max={smallPrimes.length - 1}
              step={1}
              className="interactive-progress"
              disabled={isAnimating}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Prime q: {q}</label>
            <Slider
              value={[smallPrimes.indexOf(q)]}
              onValueChange={([value]) => setQ(smallPrimes[value])}
              max={smallPrimes.length - 1}
              step={1}
              className="interactive-progress"
              disabled={isAnimating}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Message: {message}</label>
            <Slider
              value={[message]}
              onValueChange={([value]) => setMessage(value)}
              min={2}
              max={Math.min(n - 1, 100)}
              step={1}
              className="interactive-progress"
              disabled={isAnimating}
            />
          </div>
        </div>

        {/* Enhanced Key Display */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/30 morphing-container cursor-magnetic glow-border">
            <div className="flex items-center space-x-2 mb-2">
              <Key className="text-primary interactive-icon floating-element" size={16} />
              <span className="font-semibold text-primary hover-text">Public Key</span>
              <Badge className="interactive-badge bg-primary/20 text-primary text-xs ml-auto">Shareable</Badge>
            </div>
            <div className="font-mono text-sm space-y-1">
              <div className="p-2 bg-background/50 rounded border">
                <span className="text-muted-foreground">n = </span>
                <span className="text-primary font-bold">{n}</span>
              </div>
              <div className="p-2 bg-background/50 rounded border">
                <span className="text-muted-foreground">e = </span>
                <span className="text-primary font-bold">{e}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent rounded-lg border border-destructive/30 morphing-container cursor-magnetic glow-border">
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="text-destructive interactive-icon floating-element" size={16} />
              <span className="font-semibold text-destructive hover-text">Private Key</span>
              <Badge className="interactive-badge bg-destructive/20 text-destructive text-xs ml-auto">Secret</Badge>
            </div>
            <div className="font-mono text-sm space-y-1">
              <div className="p-2 bg-background/50 rounded border">
                <span className="text-muted-foreground">n = </span>
                <span className="text-destructive font-bold">{n}</span>
              </div>
              <div className="p-2 bg-background/50 rounded border">
                <span className="text-muted-foreground">d = </span>
                <span className="text-destructive font-bold">{d}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mathematical Steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold holographic">Mathematical Process</h3>
            <Button
              onClick={() => setShowMath(!showMath)}
              variant="ghost"
              size="sm"
              className="cursor-magnetic"
            >
              {showMath ? "Hide" : "Show"} Math
            </Button>
          </div>
          
          {showMath && (
            <div className="space-y-4" ref={mathRef}>
              {steps.map((stepData, index) => (
                <div
                  key={index}
                  ref={el => { stepRefs.current[index] = el; }}
                  className={`p-4 rounded-lg border transition-all duration-500 morphing-container cursor-magnetic glow-border ${
                    index <= step 
                      ? 'bg-gradient-to-r from-accent/15 via-accent/10 to-accent/5 border-accent/40 shadow-lg' 
                      : 'bg-gradient-to-r from-muted/10 via-muted/5 to-transparent border-muted/30 opacity-50'
                  }`}
                  style={{
                    opacity: index <= step ? 1 : 0.3
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 hover-text">{stepData.title}</h4>
                      <div className="font-mono text-sm bg-gradient-to-r from-background/80 to-background/60 p-3 rounded border-l-4 border-l-accent backdrop-blur-sm">
                        {stepData.content}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <strong>Formula:</strong> {stepData.formula}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {stepData.explanation}
                      </div>
                    </div>
                    <Badge 
                      variant={index <= step ? "default" : "secondary"}
                      className="ml-4 interactive-badge cursor-magnetic"
                    >
                      {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Security Analysis */}
        <div className="p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-lg border border-primary/20 glow-border cursor-magnetic">
          <h4 className="font-semibold mb-4 flex items-center hover-text">
            <Unlock className="mr-2 text-primary interactive-icon floating-element" size={16} />
            Security Analysis & Quantum Threat
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="p-3 bg-background/50 rounded border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-primary">Key Size:</strong>
                  <Badge className="interactive-badge bg-primary/20 text-primary">{Math.floor(Math.log2(n))} bits</Badge>
                </div>
                <div className="text-sm text-muted-foreground">Toy example - real RSA uses 2048+ bits</div>
              </div>
              <div className="p-3 bg-background/50 rounded border-l-4 border-l-accent">
                <strong className="text-accent">Factoring Challenge:</strong>
                <div className="text-sm text-muted-foreground mt-1">
                  Breaking RSA requires factoring n = <span className="font-mono text-accent">{n}</span> into <span className="font-mono">{p} × {q}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-background/50 rounded border-l-4 border-l-blue-500">
                <strong className="text-blue-400">Classical Difficulty:</strong>
                <div className="text-sm text-muted-foreground mt-1">Best known algorithms take exponential time O(e^(∛(log n)))</div>
              </div>
              <div className="p-3 bg-gradient-to-r from-destructive/10 to-red-500/10 rounded border-l-4 border-l-destructive">
                <div className="flex items-center space-x-2 mb-1">
                  <Zap className="text-destructive interactive-icon" size={16} />
                  <strong className="text-destructive">Quantum Threat:</strong>
                </div>
                <div className="text-sm text-muted-foreground">Shor's algorithm can factor this in polynomial time O(log³ n)!</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}