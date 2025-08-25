import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Zap, Clock, Cpu, Play, Pause, RefreshCw, AlertTriangle } from "lucide-react";
import { gsap } from "gsap";

interface ShorDemoProps {
  className?: string;
}

interface QuantumState {
  amplitude: number;
  phase: number;
  value: number;
}

interface FactorResult {
  factors: number[];
  steps: number;
  success: boolean;
}

export function ShorDemo({ className }: ShorDemoProps) {
  const [n, setN] = useState(15); // Number to factor
  const [a, setA] = useState(7);  // Random base
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [classicalTime, setClassicalTime] = useState(0);
  const [quantumTime, setQuantumTime] = useState(0);
  const [showQuantumState, setShowQuantumState] = useState(false);
  const [quantumProgress, setQuantumProgress] = useState(0);
  
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visualRef = useRef<HTMLDivElement>(null);
  
  // Shor's algorithm simulation
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

  // Find period using quantum period finding (simulated)
  const findPeriod = (a: number, n: number): number => {
    // In real Shor's algorithm, this would be done quantumly
    // Here we simulate the quantum part
    for (let r = 1; r < n; r++) {
      if (modPow(a, r, n) === 1) {
        return r;
      }
    }
    return 1;
  };

  // Classical trial division (for comparison)
  const classicalFactor = (n: number): FactorResult => {
    const start = Date.now();
    let steps = 0;
    
    for (let i = 2; i <= Math.sqrt(n); i++) {
      steps++;
      if (n % i === 0) {
        return {
          factors: [i, n / i],
          steps,
          success: true
        };
      }
    }
    
    const time = Date.now() - start;
    return { factors: [n], steps, success: false };
  };

  // Quantum Shor's algorithm (simulated)
  const shorFactor = (n: number, a: number): FactorResult => {
    let steps = 0;
    
    // Step 1: Check if a and n are coprime
    steps++;
    const g = gcd(a, n);
    if (g > 1) {
      return { factors: [g, n / g], steps, success: true };
    }
    
    // Step 2: Find period using quantum period finding
    steps++;
    const r = findPeriod(a, n);
    
    // Step 3: Check if period is even and condition is met
    steps++;
    if (r % 2 !== 0) {
      return { factors: [n], steps, success: false };
    }
    
    const x = modPow(a, r / 2, n);
    if (x === 1 || x === n - 1) {
      return { factors: [n], steps, success: false };
    }
    
    // Step 4: Compute factors
    steps++;
    const factor1 = gcd(x - 1, n);
    const factor2 = gcd(x + 1, n);
    
    if (factor1 > 1 && factor1 < n) {
      return { factors: [factor1, n / factor1], steps, success: true };
    }
    
    if (factor2 > 1 && factor2 < n) {
      return { factors: [factor2, n / factor2], steps, success: true };
    }
    
    return { factors: [n], steps, success: false };
  };

  const classicalResult = classicalFactor(n);
  const quantumResult = shorFactor(n, a);
  
  const steps = [
    {
      title: "Problem Setup",
      content: `Factor N = ${n} using base a = ${a}`,
      explanation: "Choose random a coprime to N",
      quantum: true
    },
    {
      title: "GCD Check",
      content: `gcd(${a}, ${n}) = ${gcd(a, n)}`,
      explanation: gcd(a, n) > 1 ? "Lucky! Found factor immediately" : "No immediate factor, continue",
      quantum: true
    },
    {
      title: "Quantum Period Finding",
      content: `Find period r where ${a}^r ≡ 1 (mod ${n})`,
      explanation: "This is where quantum speedup happens!",
      quantum: true
    },
    {
      title: "Period Analysis",
      content: `Period r = ${findPeriod(a, n)}`,
      explanation: "Check if r is even and satisfies conditions",
      quantum: true
    },
    {
      title: "Factor Extraction",
      content: `Compute gcd(${a}^(r/2) ± 1, ${n})`,
      explanation: "Use period to find factors classically",
      quantum: true
    },
    {
      title: "Result",
      content: quantumResult.success 
        ? `${n} = ${quantumResult.factors[0]} × ${quantumResult.factors[1]}`
        : "Algorithm failed, retry with different a",
      explanation: quantumResult.success ? "Factorization successful!" : "May need to retry",
      quantum: true
    }
  ];

  // Create quantum state visualization with enhanced effects
  const createQuantumVisualization = () => {
    const container = visualRef.current;
    if (!container) return;
    
    // Clear previous visualization
    container.innerHTML = '';
    
    // Create superposition bars with enhanced styling
    for (let i = 0; i < 8; i++) {
      const bar = document.createElement('div');
      const height = Math.random() * 60 + 20;
      
      bar.className = 'quantum-bar';
      bar.style.cssText = `
        width: 20px;
        height: ${height}px;
        background: linear-gradient(45deg, 
          var(--color-primary), 
          var(--quantum-purple), 
          var(--quantum-cyan));
        margin: 2px;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 0 10px var(--color-primary);
        animation: quantumPulse 1s ease-in-out infinite alternate;
        animation-delay: ${i * 0.1}s;
      `;
      
      // Add shimmer effect
      const shimmer = document.createElement('div');
      shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(255, 255, 255, 0.4), 
          transparent);
        animation: shimmer 2s ease-in-out infinite;
        animation-delay: ${i * 0.2}s;
      `;
      
      bar.appendChild(shimmer);
      
      // Add quantum particle effects
      if (Math.random() > 0.5) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: absolute;
          top: -5px;
          left: 50%;
          width: 4px;
          height: 4px;
          background: var(--quantum-cyan);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--quantum-cyan);
          animation: floatingParticle 3s ease-in-out infinite;
        `;
        bar.appendChild(particle);
      }
      
      container.appendChild(bar);
    }
  };

  const animateStep = (stepIndex: number) => {
    if (stepRefs.current[stepIndex]) {
      gsap.fromTo(stepRefs.current[stepIndex], 
        { opacity: 0, x: -30, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    }
  };

  const runComparison = async () => {
    setIsAnimating(true);
    setStep(0);
    setQuantumProgress(0);
    
    // Simulate classical computation time
    const classicalSteps = classicalResult.steps;
    setClassicalTime(classicalSteps * 100); // Simulate exponential time
    
    // Run quantum animation
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      animateStep(i);
      setQuantumProgress((i + 1) / steps.length * 100);
      
      if (i === 2) { // Quantum period finding step
        createQuantumVisualization();
        setShowQuantumState(true);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setQuantumTime(steps.length * 50); // Polynomial time
    setIsAnimating(false);
  };

  const resetDemo = () => {
    setStep(0);
    setQuantumProgress(0);
    setClassicalTime(0);
    setQuantumTime(0);
    setShowQuantumState(false);
    setIsAnimating(false);
    if (visualRef.current) {
      visualRef.current.innerHTML = '';
    }
  };

  const testNumbers = [15, 21, 35, 77, 91, 143];
  const baseNumbers = [2, 3, 5, 7, 11, 13];

  return (
    <Card className={`${className} glow-border cursor-magnetic`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center">
              <Zap className="text-destructive interactive-icon" size={24} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold holographic">Shor's Algorithm</CardTitle>
              <CardDescription>Quantum factoring vs classical methods</CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={runComparison}
              disabled={isAnimating}
              className="enhanced-button cursor-magnetic"
              size="sm"
            >
              {isAnimating ? <Pause size={16} /> : <Play size={16} />}
              {isAnimating ? "Running..." : "Compare"}
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
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Number to factor: {n}</label>
            <div className="flex flex-wrap gap-2">
              {testNumbers.map(num => (
                <Button
                  key={num}
                  onClick={() => setN(num)}
                  variant={n === num ? "default" : "outline"}
                  size="sm"
                  className="cursor-magnetic"
                  disabled={isAnimating}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Base a: {a}</label>
            <div className="flex flex-wrap gap-2">
              {baseNumbers.map(base => (
                <Button
                  key={base}
                  onClick={() => setA(base)}
                  variant={a === base ? "default" : "outline"}
                  size="sm"
                  className="cursor-magnetic"
                  disabled={isAnimating}
                >
                  {base}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Performance Comparison */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="morphing-container cursor-magnetic glow-border bg-gradient-to-br from-muted/30 to-muted/10 border-muted/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/10 via-transparent to-muted/20"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 text-muted-foreground interactive-icon floating-element" size={20} />
                <span className="hover-text">Classical Algorithm</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between text-sm items-center">
                  <span>Trial Division</span>
                  <Badge className="interactive-badge bg-muted/20 text-muted-foreground">O(√n)</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Steps: <span className="font-mono text-muted-foreground">{classicalResult.steps}</span></span>
                    <span>Time: <span className="font-mono text-destructive">{classicalTime}ms</span></span>
                  </div>
                  <div className="relative">
                    <Progress value={classicalTime / 10} className="h-3 interactive-progress" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground p-2 bg-background/50 rounded border-l-4 border-l-muted">
                  {classicalResult.success 
                    ? `✓ Found: ${classicalResult.factors[0]} × ${classicalResult.factors[1]}`
                    : "Brute force approach - exponential scaling"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="morphing-container cursor-magnetic glow-border bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/20"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg flex items-center">
                <Cpu className="mr-2 text-primary interactive-icon floating-element" size={20} />
                <span className="hover-text">Shor's Algorithm</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between text-sm items-center">
                  <span>Quantum Period Finding</span>
                  <Badge className="interactive-badge bg-primary/20 text-primary">O(log³n)</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Quantum Steps: <span className="font-mono text-primary">{quantumResult.steps}</span></span>
                    <span>Time: <span className="font-mono text-accent">{quantumTime}ms</span></span>
                  </div>
                  <div className="relative">
                    <Progress value={quantumProgress} className="h-3 interactive-progress" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground p-2 bg-gradient-to-r from-background/80 to-primary/10 rounded border-l-4 border-l-primary">
                  {quantumResult.success 
                    ? `⚡ Found: ${quantumResult.factors[0]} × ${quantumResult.factors[1]}`
                    : "Exponential quantum speedup over classical methods"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quantum Visualization */}
        {showQuantumState && (
          <div className="p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg border border-primary/20 glow-border cursor-magnetic">
            <h4 className="font-semibold mb-4 flex items-center">
              <Zap className="mr-2 text-primary interactive-icon floating-element" size={16} />
              <span className="hover-text">Quantum Superposition State</span>
              <Badge className="interactive-badge bg-primary/20 text-primary ml-2">Live</Badge>
            </h4>
            <div className="space-y-4">
              <div 
                ref={visualRef}
                className="flex items-end justify-center h-20 bg-gradient-to-b from-background/80 to-background/40 rounded-lg px-4 border border-primary/20 backdrop-blur-sm"
                style={{ minWidth: '300px' }}
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-background/50 rounded border-l-4 border-l-primary">
                  <div className="font-semibold text-primary mb-1">Superposition Property</div>
                  <div className="text-xs text-muted-foreground">
                    Quantum computer explores all possible periods simultaneously in parallel quantum states
                  </div>
                </div>
                <div className="p-3 bg-background/50 rounded border-l-4 border-l-accent">
                  <div className="font-semibold text-accent mb-1">Period Detection</div>
                  <div className="text-xs text-muted-foreground">
                    Quantum Fourier Transform extracts the period from the superposition state
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold holographic">Shor's Algorithm Steps</h3>
          <div className="space-y-3">
            {steps.map((stepData, index) => (
              <div
                key={index}
                ref={el => { stepRefs.current[index] = el; }}
                className={`p-4 rounded-lg border transition-all duration-300 morphing-container cursor-magnetic ${
                  index <= step 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-muted/10 border-muted/30 opacity-40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-sm hover-text">{stepData.title}</h4>
                      {stepData.quantum && (
                        <Badge className="interactive-badge bg-primary/20 text-primary text-xs">
                          Quantum
                        </Badge>
                      )}
                    </div>
                    <div className="font-mono text-xs bg-background/50 p-2 rounded border mb-2">
                      {stepData.content}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stepData.explanation}
                    </p>
                  </div>
                  <Badge 
                    variant={index <= step ? "default" : "secondary"}
                    className="ml-2 interactive-badge cursor-magnetic"
                  >
                    {index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Analysis */}
        <div className="p-4 bg-gradient-to-r from-destructive/10 to-orange/10 rounded-lg border border-destructive/20">
          <h4 className="font-semibold mb-3 flex items-center text-destructive">
            <AlertTriangle className="mr-2 interactive-icon" size={16} />
            Cryptographic Impact
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div><strong>RSA Vulnerability:</strong> All RSA keys can be broken</div>
              <div><strong>Timeline:</strong> Threat becomes real with ~4000 logical qubits</div>
              <div><strong>Current Status:</strong> IBM has 1000+ physical qubits (2023)</div>
            </div>
            <div className="space-y-2">
              <div><strong>Affected Systems:</strong> HTTPS, digital signatures, VPNs</div>
              <div><strong>Migration Need:</strong> Transition to post-quantum cryptography</div>
              <div><strong>Industry Response:</strong> NIST standardization complete</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}