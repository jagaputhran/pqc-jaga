import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Search, Target, Zap, Play, Pause, RefreshCw, CheckCircle } from "lucide-react";
import { gsap } from "gsap";

interface GroverDemoProps {
  className?: string;
}

interface SearchItem {
  id: number;
  value: string;
  isTarget: boolean;
  amplitude: number;
  phase: number;
}

export function GroverDemo({ className }: GroverDemoProps) {
  const [databaseSize, setDatabaseSize] = useState(8);
  const [targetItem, setTargetItem] = useState(3);
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [classicalSteps, setClassicalSteps] = useState(0);
  const [quantumSteps, setQuantumSteps] = useState(0);
  const [showQuantumState, setShowQuantumState] = useState(false);
  const [currentAmplitudes, setCurrentAmplitudes] = useState<number[]>([]);
  
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visualRef = useRef<HTMLDivElement>(null);
  
  // Create database items
  const createDatabase = (): SearchItem[] => {
    return Array.from({ length: databaseSize }, (_, i) => ({
      id: i,
      value: `Item ${i}`,
      isTarget: i === targetItem,
      amplitude: 1 / Math.sqrt(databaseSize), // Initial equal superposition
      phase: 0
    }));
  };

  const [database] = useState(createDatabase());
  
  // Classical search simulation
  const classicalSearch = (target: number): number => {
    // Worst case: have to check every item
    for (let i = 0; i < databaseSize; i++) {
      if (i === target) {
        return i + 1; // Return number of steps
      }
    }
    return databaseSize;
  };

  // Grover's algorithm optimal iterations
  const groverIterations = Math.floor(Math.PI / 4 * Math.sqrt(databaseSize));
  
  // Simulate one Grover iteration
  const groverIteration = (amplitudes: number[], target: number): number[] => {
    const newAmplitudes = [...amplitudes];
    
    // Step 1: Oracle - flip phase of target item
    newAmplitudes[target] *= -1;
    
    // Step 2: Diffusion operator - reflect around average
    const average = newAmplitudes.reduce((sum, amp) => sum + amp, 0) / newAmplitudes.length;
    for (let i = 0; i < newAmplitudes.length; i++) {
      newAmplitudes[i] = 2 * average - newAmplitudes[i];
    }
    
    return newAmplitudes;
  };

  const steps = [
    {
      title: "Initialize Superposition",
      content: `Create equal superposition of all ${databaseSize} items`,
      explanation: "Quantum computer starts in superposition of all possible states",
      type: "quantum"
    },
    {
      title: "Oracle Query",
      content: `Mark target item (${targetItem}) by flipping its phase`,
      explanation: "Oracle recognizes the target and marks it with negative phase",
      type: "quantum"
    },
    {
      title: "Diffusion Operator",
      content: "Reflect all amplitudes around their average",
      explanation: "Amplifies marked item while suppressing others",
      type: "quantum"
    },
    {
      title: "Iterate Process",
      content: `Repeat ${groverIterations} times for optimal result`,
      explanation: "Each iteration increases target amplitude",
      type: "quantum"
    },
    {
      title: "Measurement",
      content: "Measure quantum state to find target",
      explanation: "High probability of measuring the target item",
      type: "quantum"
    }
  ];

  const updateVisualization = (amplitudes: number[]) => {
    const container = visualRef.current;
    if (!container) return;
    
    container.innerHTML = '';
    
    const maxAmplitude = Math.max(...amplitudes.map(Math.abs));
    
    amplitudes.forEach((amplitude, index) => {
      const item = document.createElement('div');
      const height = Math.abs(amplitude) / maxAmplitude * 120; // Increased height
      const isTarget = index === targetItem;
      const isNegative = amplitude < 0;
      
      item.className = 'amplitude-bar';
      item.style.cssText = `
        width: ${Math.max(300 / databaseSize - 8, 20)}px;
        height: ${height}px;
        margin: 4px;
        border-radius: 8px;
        background: ${isTarget 
          ? 'linear-gradient(135deg, var(--accent), var(--quantum-cyan), var(--accent))' 
          : isNegative 
            ? 'linear-gradient(135deg, var(--destructive), var(--quantum-pink), var(--destructive))'
            : 'linear-gradient(135deg, var(--color-primary), var(--quantum-purple), var(--color-primary))'
        };
        background-size: 200% 200%;
        animation: ${isTarget ? 'quantum-shimmer 2s ease-in-out infinite, quantum-glow 1.5s ease-in-out infinite alternate' : 'gradient-shift 3s ease-in-out infinite'};
        display: flex;
        align-items: end;
        justify-content: center;
        color: white;
        font-size: 11px;
        font-weight: bold;
        position: relative;
        box-shadow: ${isTarget 
          ? '0 0 20px rgba(var(--accent-rgb), 0.4), 0 4px 8px rgba(0,0,0,0.2)'
          : isNegative 
            ? '0 0 15px rgba(var(--destructive-rgb), 0.3), 0 4px 8px rgba(0,0,0,0.2)'
            : '0 0 10px rgba(var(--primary-rgb), 0.2), 0 4px 8px rgba(0,0,0,0.2)'
        };
        border: ${isNegative ? '2px dashed rgba(var(--destructive-rgb), 0.6)' : '1px solid rgba(255,255,255,0.2)'};
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(1px);
        transform: translateY(0);
      `;
      
      // Add hover effects
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.1,
          y: -5,
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      // Add amplitude value display
      const amplitudeLabel = document.createElement('div');
      amplitudeLabel.style.cssText = `
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 9px;
        color: rgba(255,255,255,0.8);
        background: rgba(0,0,0,0.6);
        padding: 2px 6px;
        border-radius: 4px;
        backdrop-filter: blur(4px);
      `;
      amplitudeLabel.textContent = amplitude.toFixed(3);
      item.appendChild(amplitudeLabel);
      
      // Add index label
      const indexLabel = document.createElement('div');
      indexLabel.style.cssText = `
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.8);
      `;
      indexLabel.textContent = index.toString();
      item.appendChild(indexLabel);
      
      // Enhanced target indicator
      if (isTarget) {
        const target = document.createElement('div');
        target.innerHTML = '🎯';
        target.style.cssText = `
          position: absolute;
          top: -45px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 18px;
          animation: bounce 2s ease-in-out infinite;
          filter: drop-shadow(0 0 8px rgba(var(--accent-rgb), 0.6));
        `;
        item.appendChild(target);
        
        // Add target glow effect
        const glow = document.createElement('div');
        glow.style.cssText = `
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent, var(--accent), transparent);
          border-radius: 10px;
          opacity: 0.3;
          animation: rotate-glow 3s linear infinite;
          z-index: -1;
        `;
        item.appendChild(glow);
      }
      
      // Add particles for high amplitude items
      if (Math.abs(amplitude) > 0.3) {
        for (let i = 0; i < 3; i++) {
          const particle = document.createElement('div');
          particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: ${isTarget ? 'var(--accent)' : 'var(--quantum-purple)'};
            border-radius: 50%;
            top: ${Math.random() * height}px;
            left: ${Math.random() * (Math.max(300 / databaseSize - 8, 20))}px;
            animation: float-particle 3s ease-in-out infinite ${i * 0.5}s;
            opacity: 0.7;
          `;
          item.appendChild(particle);
        }
      }
      
      container.appendChild(item);
      
      // Animate bar entrance
      gsap.fromTo(item, 
        { scaleY: 0, opacity: 0 },
        { 
          scaleY: 1, 
          opacity: 1, 
          duration: 0.6, 
          delay: index * 0.05,
          ease: "power3.out",
          transformOrigin: "bottom"
        }
      );
    });
  };

  const animateStep = (stepIndex: number) => {
    if (stepRefs.current[stepIndex]) {
      gsap.fromTo(stepRefs.current[stepIndex], 
        { opacity: 0, x: -50, scale: 0.9, rotationY: -15 },
        { 
          opacity: 1, 
          x: 0, 
          scale: 1, 
          rotationY: 0,
          duration: 0.8, 
          ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to(stepRefs.current[stepIndex], {
              boxShadow: "0 0 20px rgba(var(--accent-rgb), 0.3)",
              duration: 0.3
            });
            
            // Add quantum particle effect
            const stepElement = stepRefs.current[stepIndex];
            if (stepElement) {
              for (let i = 0; i < 5; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                  position: absolute;
                  width: 4px;
                  height: 4px;
                  background: var(--accent);
                  border-radius: 50%;
                  top: ${Math.random() * 100}%;
                  left: ${Math.random() * 100}%;
                  opacity: 0.8;
                  z-index: 1;
                  box-shadow: 0 0 8px var(--accent);
                `;
                stepElement.appendChild(particle);
                
                gsap.to(particle, {
                  scale: 0,
                  opacity: 0,
                  duration: 1.5,
                  delay: 0.3,
                  ease: "power2.out",
                  onComplete: () => particle.remove()
                });
              }
            }
          }
        }
      );
    }
  };

  const runComparison = async () => {
    setIsAnimating(true);
    setStep(0);
    setShowQuantumState(true);
    
    // Classical search
    const classicalResult = classicalSearch(targetItem);
    setClassicalSteps(classicalResult);
    
    // Initialize quantum state
    let amplitudes = Array(databaseSize).fill(1 / Math.sqrt(databaseSize));
    setCurrentAmplitudes(amplitudes);
    updateVisualization(amplitudes);
    
    // Run Grover iterations
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      animateStep(i);
      
      if (i === 1 || i === 2) { // Oracle and Diffusion steps
        amplitudes = groverIteration(amplitudes, targetItem);
        setCurrentAmplitudes(amplitudes);
        updateVisualization(amplitudes);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setQuantumSteps(groverIterations);
    setIsAnimating(false);
  };

  const resetDemo = () => {
    setStep(0);
    setClassicalSteps(0);
    setQuantumSteps(0);
    setShowQuantumState(false);
    setCurrentAmplitudes([]);
    setIsAnimating(false);
    if (visualRef.current) {
      visualRef.current.innerHTML = '';
    }
  };

  // Calculate probability of success
  const successProbability = currentAmplitudes.length > 0 
    ? Math.pow(Math.abs(currentAmplitudes[targetItem]), 2) * 100 
    : 0;

  return (
    <Card className={`${className} glow-border cursor-magnetic`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <Search className="text-accent interactive-icon" size={24} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold holographic">Grover's Search Algorithm</CardTitle>
              <CardDescription>Quantum database search with quadratic speedup</CardDescription>
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
              {isAnimating ? "Searching..." : "Run Search"}
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
            <label className="text-sm font-medium">Database Size: {databaseSize} items</label>
            <Slider
              value={[databaseSize]}
              onValueChange={([value]) => setDatabaseSize(value)}
              min={4}
              max={16}
              step={4}
              className="interactive-progress"
              disabled={isAnimating}
            />
            <div className="text-xs text-muted-foreground">
              Larger databases show greater quantum advantage
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Item: {targetItem}</label>
            <Slider
              value={[targetItem]}
              onValueChange={([value]) => setTargetItem(value)}
              min={0}
              max={databaseSize - 1}
              step={1}
              className="interactive-progress"
              disabled={isAnimating}
            />
            <div className="text-xs text-muted-foreground">
              Item we're searching for in the database
            </div>
          </div>
        </div>

        {/* Enhanced Performance Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="morphing-container cursor-magnetic bg-gradient-to-br from-muted/40 to-muted/20 border-muted/40 glow-border hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-muted/30 rounded-xl flex items-center justify-center mr-3">
                    <Search className="text-muted-foreground interactive-icon" size={20} />
                  </div>
                  <span className="holographic">Classical Search</span>
                </div>
                <Badge className="interactive-badge bg-muted/30 text-muted-foreground">Linear</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-background/40 rounded-lg border border-muted/20">
                  <span className="text-sm font-medium">Complexity:</span>
                  <Badge className="interactive-badge bg-muted/40 text-foreground font-mono">O(N)</Badge>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 bg-background/20 rounded border border-muted/20">
                      <div className="text-muted-foreground">Average Steps</div>
                      <div className="font-bold text-foreground">{Math.ceil(databaseSize / 2)}</div>
                    </div>
                    <div className="p-2 bg-background/20 rounded border border-muted/20">
                      <div className="text-muted-foreground">Worst Case</div>
                      <div className="font-bold text-foreground">{databaseSize}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Current Search:</span>
                      <span className="font-bold">{classicalSteps} steps ({classicalSteps > 0 ? Math.round(classicalSteps / databaseSize * 100) : 0}%)</span>
                    </div>
                    <div className="relative">
                      <Progress value={classicalSteps / databaseSize * 100} className="h-3 interactive-progress" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="morphing-container cursor-magnetic bg-gradient-to-br from-accent/30 to-primary/30 border-accent/40 glow-border hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center mr-3">
                    <Zap className="text-accent interactive-icon" size={20} />
                  </div>
                  <span className="holographic">Grover's Algorithm</span>
                </div>
                <Badge className="interactive-badge bg-accent/30 text-accent">Quantum</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <span className="text-sm font-medium">Complexity:</span>
                  <Badge className="interactive-badge bg-accent/30 text-accent font-mono">O(√N)</Badge>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 bg-accent/10 rounded border border-accent/20">
                      <div className="text-accent/80">Optimal Steps</div>
                      <div className="font-bold text-accent">{groverIterations}</div>
                    </div>
                    <div className="p-2 bg-primary/10 rounded border border-primary/20">
                      <div className="text-primary/80">Speedup</div>
                      <div className="font-bold text-primary">{Math.round(databaseSize / groverIterations)}x</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-accent/80">Success Rate:</span>
                      <span className="font-bold text-accent">{Math.round(successProbability)}% (Amplitude: {currentAmplitudes[targetItem]?.toFixed(3) || '0.000'})</span>
                    </div>
                    <div className="relative">
                      <Progress value={successProbability} className="h-3 interactive-progress" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent rounded-full animate-pulse"></div>
                      {successProbability > 80 && (
                        <div className="absolute right-1 top-0 bottom-0 flex items-center">
                          <CheckCircle className="text-accent" size={12} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quantum State Visualization */}
        {showQuantumState && (
          <div className="p-6 bg-gradient-to-r from-accent/10 via-primary/10 to-quantum-purple/10 rounded-xl border border-accent/30 morphing-container glow-border cursor-magnetic backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold flex items-center holographic">
                <Target className="mr-2 text-accent interactive-icon" size={18} />
                Quantum Amplitude Visualization
              </h4>
              <div className="flex items-center space-x-2">
                <Badge className="interactive-badge bg-accent/20 text-accent">
                  Live State
                </Badge>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <div 
                  ref={visualRef}
                  className="flex items-end justify-center h-32 bg-gradient-to-b from-background/30 to-background/80 rounded-lg px-4 border border-primary/20 backdrop-blur-sm"
                  style={{ minHeight: '140px' }}
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-accent/5 to-transparent animate-pulse rounded-lg"></div>
                </div>
              </div>
              
              {/* Enhanced Legend with Interactive Elements */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="flex items-center justify-center space-x-2 p-2 rounded-lg bg-primary/10 border border-primary/20 cursor-magnetic transition-all duration-300 hover:bg-primary/20">
                  <div className="w-4 h-4 rounded-sm">
                    <div className="w-full h-full bg-gradient-to-br from-primary to-quantum-purple rounded-sm animate-pulse"></div>
                  </div>
                  <span className="font-medium">Regular Items</span>
                </div>
                <div className="flex items-center justify-center space-x-2 p-2 rounded-lg bg-accent/10 border border-accent/20 cursor-magnetic transition-all duration-300 hover:bg-accent/20">
                  <div className="w-4 h-4 rounded-sm relative">
                    <div className="w-full h-full bg-gradient-to-br from-accent to-quantum-cyan rounded-sm animate-pulse"></div>
                    <div className="absolute -top-1 -right-1 text-xs">🎯</div>
                  </div>
                  <span className="font-medium">Target Item</span>
                </div>
                <div className="flex items-center justify-center space-x-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20 cursor-magnetic transition-all duration-300 hover:bg-destructive/20">
                  <div className="w-4 h-4 rounded-sm border-2 border-dashed border-destructive/60 relative">
                    <div className="w-full h-full bg-gradient-to-br from-destructive to-quantum-pink rounded-sm opacity-60"></div>
                  </div>
                  <span className="font-medium">Negative Phase</span>
                </div>
              </div>
              
              {/* Quantum State Information */}
              <div className="flex items-center justify-between text-xs text-muted-foreground bg-background/40 rounded-lg p-3 border border-muted/20">
                <div className="flex items-center space-x-2">
                  <span>Superposition States:</span>
                  <Badge className="text-xs bg-primary/20 text-primary">{databaseSize}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Success Probability:</span>
                  <Badge className="text-xs bg-accent/20 text-accent">{Math.round(successProbability)}%</Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold holographic">Grover's Algorithm Steps</h3>
          <div className="space-y-3">
            {steps.map((stepData, index) => (
              <div
                key={index}
                ref={el => { stepRefs.current[index] = el; }}
                className={`p-4 rounded-lg border transition-all duration-300 morphing-container cursor-magnetic ${
                  index <= step 
                    ? 'bg-accent/10 border-accent/30' 
                    : 'bg-muted/10 border-muted/30 opacity-40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-sm hover-text">{stepData.title}</h4>
                      <Badge className="interactive-badge bg-accent/20 text-accent text-xs">
                        {stepData.type}
                      </Badge>
                    </div>
                    <div className="text-sm mb-2">{stepData.content}</div>
                    <p className="text-xs text-muted-foreground">
                      {stepData.explanation}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {index <= step && (
                      <CheckCircle className="text-accent interactive-icon" size={16} />
                    )}
                    <Badge 
                      variant={index <= step ? "default" : "secondary"}
                      className="interactive-badge cursor-magnetic"
                    >
                      {index + 1}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications & Impact */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <h4 className="font-semibold mb-3 flex items-center">
            <Zap className="mr-2 text-primary interactive-icon" size={16} />
            Real-World Applications
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div><strong>Database Search:</strong> Unsorted database queries</div>
              <div><strong>Optimization:</strong> Finding optimal solutions</div>
              <div><strong>Cryptanalysis:</strong> Breaking symmetric encryption</div>
            </div>
            <div className="space-y-2">
              <div><strong>Speedup:</strong> Quadratic improvement over classical</div>
              <div><strong>Limitation:</strong> Requires known number of solutions</div>
              <div><strong>Crypto Impact:</strong> Effectively halves key lengths</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}