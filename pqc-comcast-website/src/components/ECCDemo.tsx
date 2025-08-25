import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Zap, Play, Pause, RefreshCw, Info } from "lucide-react";
import { gsap } from "gsap";

interface ECCDemoProps {
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

// Elliptic curve operations over finite field
class ECC {
  constructor(public a: number, public b: number, public p: number) {}

  // Check if point is on curve: y^2 = x^3 + ax + b (mod p)
  isOnCurve(point: Point): boolean {
    const { x, y } = point;
    const left = (y * y) % this.p;
    const right = (x * x * x + this.a * x + this.b) % this.p;
    return left === right;
  }

  // Modular inverse using extended Euclidean algorithm
  modInverse(a: number, m: number): number {
    if (a < 0) a = (a % m + m) % m;
    
    let [g, x] = this.extgcd(a, m);
    if (g !== 1) throw new Error('Modular inverse does not exist');
    return (x % m + m) % m;
  }

  extgcd(a: number, b: number): [number, number] {
    if (a === 0) return [b, 0];
    let [g, y] = this.extgcd(b % a, a);
    return [g, y - Math.floor(b / a) * (g - y)];
  }

  // Point addition on elliptic curve
  pointAdd(P: Point | null, Q: Point | null): Point | null {
    if (!P) return Q;
    if (!Q) return P;
    
    const { x: x1, y: y1 } = P;
    const { x: x2, y: y2 } = Q;

    if (x1 === x2) {
      if (y1 === y2) {
        // Point doubling
        const s = (3 * x1 * x1 + this.a) * this.modInverse(2 * y1, this.p) % this.p;
        const x3 = (s * s - 2 * x1) % this.p;
        const y3 = (s * (x1 - x3) - y1) % this.p;
        return { x: (x3 + this.p) % this.p, y: (y3 + this.p) % this.p };
      } else {
        // Points are additive inverses
        return null;
      }
    } else {
      // Regular point addition
      const s = (y2 - y1) * this.modInverse(x2 - x1, this.p) % this.p;
      const x3 = (s * s - x1 - x2) % this.p;
      const y3 = (s * (x1 - x3) - y1) % this.p;
      return { x: (x3 + this.p) % this.p, y: (y3 + this.p) % this.p };
    }
  }

  // Scalar multiplication (k * P)
  scalarMult(k: number, P: Point): Point | null {
    if (k === 0) return null;
    if (k === 1) return P;
    
    let result: Point | null = null;
    let addend: Point | null = P;
    
    while (k > 0) {
      if (k & 1) {
        result = this.pointAdd(result, addend);
      }
      addend = this.pointAdd(addend, addend);
      if (!addend) break; // Handle point at infinity
      k >>= 1;
    }
    
    return result;
  }

  // Generate points on the curve
  generatePoints(): Point[] {
    const points: Point[] = [];
    for (let x = 0; x < this.p; x++) {
      for (let y = 0; y < this.p; y++) {
        if (this.isOnCurve({ x, y })) {
          points.push({ x, y });
        }
      }
    }
    return points;
  }
}

export function ECCDemo({ className }: ECCDemoProps) {
  const [a, setA] = useState(-1);
  const [b, setB] = useState(1);
  const [p, setP] = useState(23);
  const [selectedPoint, setSelectedPoint] = useState<Point>({ x: 3, y: 10 });
  const [scalar, setScalar] = useState(2);
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const ecc = new ECC(a, b, p);
  const points = ecc.generatePoints();
  const resultPoint = selectedPoint ? ecc.scalarMult(scalar, selectedPoint) : null;
  
  const drawCurve = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;
    const scale = Math.min(plotWidth, plotHeight) / p;
    
    ctx.clearRect(0, 0, width, height);
    
    // Create gradient background
    const bgGradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    bgGradient.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
    bgGradient.addColorStop(1, 'rgba(139, 92, 246, 0.02)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Set up coordinate system
    ctx.save();
    ctx.translate(padding, height - padding);
    ctx.scale(1, -1);
    
    // Draw grid with gradient lines
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= p; i++) {
      const x = i * scale;
      const gradient = ctx.createLinearGradient(x, 0, x, plotHeight);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      ctx.strokeStyle = gradient;
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, plotHeight);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= p; i++) {
      const y = i * scale;
      const gradient = ctx.createLinearGradient(0, y, plotWidth, y);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      ctx.strokeStyle = gradient;
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(plotWidth, y);
      ctx.stroke();
    }
    
    // Draw coordinate labels
    ctx.save();
    ctx.scale(1, -1);
    ctx.fillStyle = 'rgba(156, 163, 175, 0.8)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    
    // X-axis labels
    for (let i = 0; i <= p; i += Math.max(1, Math.floor(p / 8))) {
      const x = i * scale;
      ctx.fillText(i.toString(), x, 15);
    }
    
    // Y-axis labels  
    ctx.textAlign = 'right';
    for (let i = 0; i <= p; i += Math.max(1, Math.floor(p / 8))) {
      const y = i * scale;
      ctx.fillText(i.toString(), -5, -y + 4);
    }
    
    ctx.restore();
    
    // Draw all curve points with enhanced styling
    points.forEach((point, index) => {
      const x = point.x * scale;
      const y = point.y * scale;
      
      // Create radial gradient for each point
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(0.7, '#1d4ed8');
      gradient.addColorStop(1, 'rgba(29, 78, 216, 0.3)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add subtle glow effect
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.shadowBlur = 0;
    });
    
    // Highlight selected point with enhanced animation
    if (selectedPoint) {
      const x = selectedPoint.x * scale;
      const y = selectedPoint.y * scale;
      
      // Animated pulsing ring
      const time = Date.now() * 0.005;
      const pulseScale = 1 + Math.sin(time) * 0.3;
      
      // Outer glow ring
      const outerGradient = ctx.createRadialGradient(x, y, 0, x, y, 15 * pulseScale);
      outerGradient.addColorStop(0, 'rgba(16, 185, 129, 0.6)');
      outerGradient.addColorStop(0.7, 'rgba(16, 185, 129, 0.3)');
      outerGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      
      ctx.fillStyle = outerGradient;
      ctx.beginPath();
      ctx.arc(x, y, 15 * pulseScale, 0, 2 * Math.PI);
      ctx.fill();
      
      // Main point
      const mainGradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
      mainGradient.addColorStop(0, '#10b981');
      mainGradient.addColorStop(0.6, '#059669');
      mainGradient.addColorStop(1, '#047857');
      
      ctx.fillStyle = mainGradient;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#065f46';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Point coordinates label
      ctx.save();
      ctx.scale(1, -1);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`P(${selectedPoint.x},${selectedPoint.y})`, x, -y - 20);
      ctx.restore();
    }
    
    // Highlight result point with different styling
    if (resultPoint) {
      const x = resultPoint.x * scale;
      const y = resultPoint.y * scale;
      
      // Animated rotation effect
      const time = Date.now() * 0.003;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(time);
      
      // Star-like outer ring
      const starGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
      starGradient.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
      starGradient.addColorStop(0.7, 'rgba(245, 158, 11, 0.4)');
      starGradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
      
      ctx.fillStyle = starGradient;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const radius = i % 2 === 0 ? 12 : 6;
        const pointX = Math.cos(angle) * radius;
        const pointY = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(pointX, pointY);
        else ctx.lineTo(pointX, pointY);
      }
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
      
      // Main result point
      const resultGradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
      resultGradient.addColorStop(0, '#f59e0b');
      resultGradient.addColorStop(0.6, '#d97706');
      resultGradient.addColorStop(1, '#b45309');
      
      ctx.fillStyle = resultGradient;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Result coordinates label
      ctx.save();
      ctx.scale(1, -1);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${scalar}P(${resultPoint.x},${resultPoint.y})`, x, -y - 20);
      ctx.restore();
    }
    
    // Draw connection line with enhanced styling
    if (selectedPoint && resultPoint && scalar === 2) {
      const x1 = selectedPoint.x * scale;
      const y1 = selectedPoint.y * scale;
      const x2 = resultPoint.x * scale;
      const y2 = resultPoint.y * scale;
      
      // Animated dashed line
      const time = Date.now() * 0.01;
      
      const lineGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      lineGradient.addColorStop(0, '#10b981');
      lineGradient.addColorStop(0.5, '#ef4444');
      lineGradient.addColorStop(1, '#f59e0b');
      
      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      ctx.lineDashOffset = time;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
      
      // Add arrow at the end
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowLength = 12;
      
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - arrowLength * Math.cos(angle - Math.PI / 6),
        y2 - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - arrowLength * Math.cos(angle + Math.PI / 6),
        y2 - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }
    
    ctx.restore();
    
    // Add curve equation overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 200, 30);
    
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`y² = x³ + ${a}x + ${b} (mod ${p})`, 15, 30);
  };

  const steps = [
    {
      title: "Elliptic Curve Definition",
      content: `y² = x³ + ${a}x + ${b} (mod ${p})`,
      explanation: "This defines our elliptic curve over finite field F_p"
    },
    {
      title: "Point Selection",
      content: `Base Point P = (${selectedPoint.x}, ${selectedPoint.y})`,
      explanation: "Choose a generator point on the curve"
    },
    {
      title: "Scalar Multiplication",
      content: `${scalar} × P = ${resultPoint ? `(${resultPoint.x}, ${resultPoint.y})` : 'Point at infinity'}`,
      explanation: "Compute k·P by repeated point addition"
    },
    {
      title: "Key Generation",
      content: `Private key: k = ${scalar}, Public key: Q = k×P`,
      explanation: "Private key is scalar, public key is curve point"
    },
    {
      title: "Security Foundation",
      content: "Discrete Logarithm Problem",
      explanation: "Given P and Q = k×P, finding k is computationally hard"
    }
  ];

  useEffect(() => {
    drawCurve();
  }, [a, b, p, selectedPoint, scalar, resultPoint]);

  const animateStep = (stepIndex: number) => {
    if (stepRefs.current[stepIndex]) {
      gsap.fromTo(stepRefs.current[stepIndex], 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  };

  const runAnimation = async () => {
    setIsAnimating(true);
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      animateStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    setIsAnimating(false);
  };

  const resetDemo = () => {
    setStep(0);
    setIsAnimating(false);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isAnimating) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const padding = 40;
    const plotWidth = canvas.width - 2 * padding;
    const plotHeight = canvas.height - 2 * padding;
    const scale = Math.min(plotWidth, plotHeight) / p;
    
    // Get click coordinates relative to canvas
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    
    // Convert to curve coordinates
    const curveX = Math.round((canvasX - padding) / scale);
    const curveY = Math.round((canvas.height - canvasY - padding) / scale);
    
    // Check if clicked point is valid and on curve
    if (curveX >= 0 && curveX < p && curveY >= 0 && curveY < p) {
      const clickedPoint = { x: curveX, y: curveY };
      if (ecc.isOnCurve(clickedPoint)) {
        setSelectedPoint(clickedPoint);
        
        // Add visual feedback
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.style.cursor = 'pointer';
          setTimeout(() => {
            if (canvas) canvas.style.cursor = 'crosshair';
          }, 200);
        }
      }
    }
  };

  // Add hover effect
  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isAnimating) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const padding = 40;
    const plotWidth = canvas.width - 2 * padding;
    const plotHeight = canvas.height - 2 * padding;
    const scale = Math.min(plotWidth, plotHeight) / p;
    
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    
    const curveX = Math.round((canvasX - padding) / scale);
    const curveY = Math.round((canvas.height - canvasY - padding) / scale);
    
    // Check if hovering over a valid point
    if (curveX >= 0 && curveX < p && curveY >= 0 && curveY < p) {
      const hoverPoint = { x: curveX, y: curveY };
      if (ecc.isOnCurve(hoverPoint)) {
        canvas.style.cursor = 'pointer';
        canvas.title = `Point (${curveX}, ${curveY}) - Click to select`;
        return;
      }
    }
    
    canvas.style.cursor = 'crosshair';
    canvas.title = 'Click on curve points to select them';
  };

  return (
    <Card className={`${className} glow-border cursor-magnetic`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-accent interactive-icon" size={24} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold holographic">Elliptic Curve Cryptography</CardTitle>
              <CardDescription>Interactive visualization of ECC mathematics</CardDescription>
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
              {isAnimating ? "Playing..." : "Animate"}
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
        <div className="grid md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Coefficient a: {a}</label>
            <Slider
              value={[a + 5]}
              onValueChange={([value]) => setA(value - 5)}
              min={0}
              max={10}
              step={1}
              className="interactive-progress"
              disabled={isAnimating}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Coefficient b: {b}</label>
            <Slider
              value={[b]}
              onValueChange={([value]) => setB(value)}
              min={1}
              max={10}
              step={1}
              className="interactive-progress"
              disabled={isAnimating}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Field size p: {p}</label>
            <Slider
              value={[p]}
              onValueChange={([value]) => setP(value)}
              min={17}
              max={31}
              step={2}
              className="interactive-progress"
              disabled={isAnimating}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Scalar k: {scalar}</label>
            <Slider
              value={[scalar]}
              onValueChange={([value]) => setScalar(value)}
              min={1}
              max={10}
              step={1}
              className="interactive-progress"
              disabled={isAnimating}
            />
          </div>
        </div>

        {/* Curve Visualization */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold holographic">Curve Visualization</h3>
              <Badge className="interactive-badge cursor-magnetic">
                {points.length} points
              </Badge>
            </div>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="border border-border rounded-lg cursor-crosshair bg-gradient-to-br from-background to-muted/20 shadow-lg"
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                title="Click on curve points to select them"
              />
              <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 p-2 rounded">
                Click points to select
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Curve points</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Selected P</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span>Result k×P</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Connection</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold holographic">Mathematical Steps</h3>
              <Button
                onClick={() => setShowSteps(!showSteps)}
                variant="ghost"
                size="sm"
                className="cursor-magnetic"
              >
                {showSteps ? "Hide" : "Show"} Steps
              </Button>
            </div>
            
            {showSteps && (
              <div className="space-y-3">
                {steps.map((stepData, index) => (
                  <div
                    key={index}
                    ref={el => { stepRefs.current[index] = el; }}
                    className={`p-3 rounded-lg border transition-all duration-300 morphing-container cursor-magnetic ${
                      index <= step 
                        ? 'bg-accent/10 border-accent/30' 
                        : 'bg-muted/10 border-muted/30 opacity-40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm hover-text">{stepData.title}</h4>
                        <div className="font-mono text-xs bg-background/50 p-2 rounded border mt-2">
                          {stepData.content}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
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
            )}
          </div>
        </div>

        {/* Security Analysis */}
        <div className="p-4 bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg border border-accent/20">
          <h4 className="font-semibold mb-2 flex items-center hover-text">
            <Info className="mr-2 text-accent interactive-icon" size={16} />
            ECC Security & Advantages
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div><strong>Key Size:</strong> Much smaller than RSA for same security</div>
              <div><strong>Performance:</strong> Faster operations on mobile devices</div>
              <div><strong>Math Foundation:</strong> Elliptic Curve Discrete Logarithm Problem (ECDLP)</div>
            </div>
            <div className="space-y-2">
              <div><strong>Current Status:</strong> Widely used in TLS, Bitcoin, etc.</div>
              <div className="text-destructive"><strong>Quantum Vulnerability:</strong> Also broken by Shor's algorithm</div>
              <div><strong>Timeline:</strong> Need quantum-resistant alternatives by 2030</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}