import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Shield, Zap, Cpu, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { gsap } from "gsap";

interface EncryptionMethod {
  name: string;
  type: 'classical' | 'quantum';
  keySize: number;
  classicalStrength: number;
  quantumStrength: number;
  description: string;
  color: string;
}

interface EncryptionStrengthMeterProps {
  className?: string;
}

export function EncryptionStrengthMeter({ className }: EncryptionStrengthMeterProps) {
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [attackType, setAttackType] = useState<'classical' | 'quantum'>('classical');
  const [attackPower, setAttackPower] = useState([50]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [breachProgress, setBreachProgress] = useState(0);
  const [isBreached, setIsBreached] = useState(false);
  
  const meterRef = useRef<HTMLDivElement>(null);
  const strengthBarRef = useRef<HTMLDivElement>(null);
  const attackBarRef = useRef<HTMLDivElement>(null);

  const methods: EncryptionMethod[] = [
    {
      name: "RSA-1024",
      type: 'classical',
      keySize: 1024,
      classicalStrength: 60,
      quantumStrength: 5,
      description: "Legacy RSA encryption, vulnerable to quantum attacks",
      color: "text-orange-400"
    },
    {
      name: "RSA-2048",
      type: 'classical', 
      keySize: 2048,
      classicalStrength: 80,
      quantumStrength: 10,
      description: "Current RSA standard, still quantum vulnerable",
      color: "text-yellow-400"
    },
    {
      name: "RSA-4096",
      type: 'classical',
      keySize: 4096,
      classicalStrength: 95,
      quantumStrength: 15,
      description: "High-security RSA, quantum vulnerable",
      color: "text-red-400"
    },
    {
      name: "ECC-256",
      type: 'classical',
      keySize: 256,
      classicalStrength: 85,
      quantumStrength: 8,
      description: "Elliptic Curve Cryptography, quantum vulnerable",
      color: "text-orange-400"
    },
    {
      name: "CRYSTALS-Kyber",
      type: 'quantum',
      keySize: 768,
      classicalStrength: 90,
      quantumStrength: 95,
      description: "NIST post-quantum key encapsulation",
      color: "text-green-400"
    },
    {
      name: "CRYSTALS-Dilithium",
      type: 'quantum',
      keySize: 1312,
      classicalStrength: 88,
      quantumStrength: 98,
      description: "NIST post-quantum digital signatures",
      color: "text-green-400"
    },
    {
      name: "FALCON",
      type: 'quantum',
      keySize: 512,
      classicalStrength: 85,
      quantumStrength: 92,
      description: "Compact post-quantum signatures",
      color: "text-blue-400"
    }
  ];

  const currentMethod = methods[selectedMethod];
  const currentStrength = attackType === 'classical' 
    ? currentMethod.classicalStrength 
    : currentMethod.quantumStrength;

  const startAttack = async () => {
    if (isAttacking) return;
    
    setIsAttacking(true);
    setBreachProgress(0);
    setIsBreached(false);

    const attackStrength = attackPower[0];
    const resistance = currentStrength;
    const timeToBreak = Math.max(1, (resistance / attackStrength) * 3);
    
    // Animate attack progress
    gsap.to({}, {
      duration: timeToBreak,
      ease: attackType === 'quantum' && currentMethod.type === 'classical' 
        ? "power2.in" // Fast quantum break
        : "power1.out", // Gradual classical attack
      onUpdate: function() {
        const progress = this.progress() * 100;
        setBreachProgress(progress);
        
        // Check if encryption is broken
        if (progress > resistance) {
          setIsBreached(true);
        }
      },
      onComplete: () => {
        setIsAttacking(false);
      }
    });

    // Animate attack visualizations
    if (attackBarRef.current) {
      gsap.fromTo(attackBarRef.current,
        { width: '0%' },
        { 
          width: `${attackStrength}%`, 
          duration: 0.5, 
          ease: "power2.out" 
        }
      );
    }
  };

  const resetAttack = () => {
    setIsAttacking(false);
    setBreachProgress(0);
    setIsBreached(false);
    gsap.killTweensOf({});
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 90) return "text-green-400";
    if (strength >= 70) return "text-yellow-400";
    if (strength >= 50) return "text-orange-400";
    return "text-red-400";
  };

  const getAttackTypeIcon = () => {
    return attackType === 'classical' ? <Cpu size={16} /> : <Zap size={16} />;
  };

  useEffect(() => {
    resetAttack();
  }, [selectedMethod, attackType]);

  useEffect(() => {
    // Animate strength bar
    if (strengthBarRef.current) {
      gsap.fromTo(strengthBarRef.current,
        { width: '0%' },
        { 
          width: `${currentStrength}%`, 
          duration: 1, 
          ease: "power2.out" 
        }
      );
    }
  }, [currentStrength]);

  return (
    <div className={className}>
      <Card className="bg-card/80 border-[color:var(--quantum-cyan)]/30 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl holographic">Encryption Strength Analyzer</CardTitle>
          <CardDescription>
            Test different encryption methods against classical and quantum attacks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Method Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Select Encryption Method:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {methods.map((method, index) => (
                <Button
                  key={method.name}
                  variant={selectedMethod === index ? 'default' : 'outline'}
                  onClick={() => setSelectedMethod(index)}
                  className={`text-xs h-auto py-2 ${selectedMethod === index ? 'ultra-glow' : ''}`}
                >
                  <div className="text-center">
                    <div className={method.color}>
                      {method.type === 'quantum' ? <Shield size={16} /> : <AlertTriangle size={16} />}
                    </div>
                    <div className="font-semibold">{method.name}</div>
                    <div className="text-xs opacity-70">{method.keySize} bits</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Current Method Info */}
          <div className="p-4 bg-secondary/50 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{currentMethod.name}</h3>
              <Badge 
                variant={currentMethod.type === 'quantum' ? 'default' : 'destructive'}
                className="ultra-glow"
              >
                {currentMethod.type === 'quantum' ? 'Quantum-Safe' : 'Classical'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{currentMethod.description}</p>
            
            {/* Strength Meters */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center space-x-1">
                    <Cpu size={14} />
                    <span>Classical Strength</span>
                  </span>
                  <span className={getStrengthColor(currentMethod.classicalStrength)}>
                    {currentMethod.classicalStrength}%
                  </span>
                </div>
                <Progress value={currentMethod.classicalStrength} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center space-x-1">
                    <Zap size={14} />
                    <span>Quantum Strength</span>
                  </span>
                  <span className={getStrengthColor(currentMethod.quantumStrength)}>
                    {currentMethod.quantumStrength}%
                  </span>
                </div>
                <Progress value={currentMethod.quantumStrength} className="h-2" />
              </div>
            </div>
          </div>

          {/* Attack Configuration */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Button
                variant={attackType === 'classical' ? 'default' : 'outline'}
                onClick={() => setAttackType('classical')}
                className="flex-1"
              >
                <Cpu className="w-4 h-4 mr-2" />
                Classical Attack
              </Button>
              <Button
                variant={attackType === 'quantum' ? 'default' : 'outline'}
                onClick={() => setAttackType('quantum')}
                className="flex-1"
              >
                <Zap className="w-4 h-4 mr-2" />
                Quantum Attack
              </Button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  {getAttackTypeIcon()}
                  <span>Attack Power: {attackPower[0]}%</span>
                </label>
                <Badge variant="outline">{attackType} Computer</Badge>
              </div>
              <Slider
                value={attackPower}
                onValueChange={setAttackPower}
                max={100}
                min={10}
                step={5}
                className="w-full"
                disabled={isAttacking}
              />
            </div>
          </div>

          {/* Attack Simulation */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Attack Progress</span>
              <div className="flex items-center space-x-2">
                {isBreached ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <Badge variant="destructive">BREACHED</Badge>
                  </>
                ) : breachProgress > 0 ? (
                  <>
                    <Activity className="w-4 h-4 text-yellow-400" />
                    <Badge variant="outline">ATTACKING</Badge>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <Badge className="bg-green-400/20 text-green-400">SECURE</Badge>
                  </>
                )}
              </div>
            </div>
            
            <div className="relative">
              <Progress value={breachProgress} className="h-4" />
              <Progress 
                value={currentStrength} 
                className="h-4 absolute top-0 opacity-50" 
              />
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Attack must exceed {currentStrength}% to breach encryption
            </div>
          </div>

          {/* Controls */}
          <div className="flex space-x-4">
            <Button
              onClick={startAttack}
              disabled={isAttacking}
              className="flex-1"
            >
              {isAttacking ? 'Attack in Progress...' : `Start ${attackType} Attack`}
            </Button>
            <Button variant="outline" onClick={resetAttack}>
              Reset
            </Button>
          </div>

          {/* Results */}
          {breachProgress > 0 && (
            <div className={`p-4 rounded-xl border ${
              isBreached 
                ? 'bg-destructive/10 border-destructive/20' 
                : 'bg-primary/10 border-primary/20'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {isBreached ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <span className="font-semibold text-destructive">Encryption Compromised!</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-primary">Encryption Holding Strong</span>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {isBreached 
                  ? `The ${attackType} attack successfully broke the ${currentMethod.name} encryption.`
                  : `The ${currentMethod.name} encryption is resisting the ${attackType} attack.`
                }
              </p>
            </div>
          )}

          {/* Educational Note */}
          <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-lg">
            <strong>Note:</strong> This is a simplified simulation. Real-world quantum attacks would depend on many factors including 
            qubit count, error rates, and algorithm implementation. Post-quantum cryptography provides the best current defense.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}