import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipForward, Calendar, Shield, AlertTriangle, Zap } from "lucide-react";
import { gsap } from "gsap";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  type: 'past' | 'present' | 'future' | 'threat';
  icon: 'shield' | 'alert' | 'zap' | 'calendar';
  color: string;
}

interface QuantumTimelineProps {
  className?: string;
}

export function QuantumTimeline({ className }: QuantumTimelineProps) {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  const events: TimelineEvent[] = [
    {
      year: 1976,
      title: "Diffie-Hellman Key Exchange",
      description: "First public key cryptography protocol introduced, revolutionizing secure communication.",
      type: 'past',
      icon: 'shield',
      color: 'text-blue-400'
    },
    {
      year: 1977,
      title: "RSA Algorithm",
      description: "RSA encryption becomes the foundation of internet security, still widely used today.",
      type: 'past', 
      icon: 'shield',
      color: 'text-blue-400'
    },
    {
      year: 1994,
      title: "Shor's Algorithm",
      description: "Peter Shor proves quantum computers can break RSA and ECC in polynomial time.",
      type: 'threat',
      icon: 'alert',
      color: 'text-orange-400'
    },
    {
      year: 2016,
      title: "NIST PQC Competition",
      description: "NIST launches competition to standardize post-quantum cryptographic algorithms.",
      type: 'present',
      icon: 'shield',
      color: 'text-green-400'
    },
    {
      year: 2019,
      title: "Google's Quantum Supremacy",
      description: "Google claims quantum supremacy with 53-qubit Sycamore processor.",
      type: 'threat',
      icon: 'zap',
      color: 'text-red-400'
    },
    {
      year: 2022,
      title: "NIST PQC Standards",
      description: "NIST finalizes first post-quantum cryptographic standards including CRYSTALS-Kyber.",
      type: 'present',
      icon: 'shield',
      color: 'text-green-400'
    },
    {
      year: 2024,
      title: "Industry Adoption",
      description: "Major tech companies begin implementing PQC in production systems.",
      type: 'present',
      icon: 'shield',
      color: 'text-green-400'
    },
    {
      year: 2030,
      title: "Cryptographically Relevant QC",
      description: "Projected timeline for quantum computers capable of breaking current encryption.",
      type: 'threat',
      icon: 'alert',
      color: 'text-red-400'
    },
    {
      year: 2035,
      title: "Full PQC Adoption",
      description: "Complete transition to post-quantum cryptography across all industries.",
      type: 'future',
      icon: 'shield',
      color: 'text-purple-400'
    }
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'shield': return <Shield size={20} />;
      case 'alert': return <AlertTriangle size={20} />;
      case 'zap': return <Zap size={20} />;
      default: return <Calendar size={20} />;
    }
  };

  const playTimeline = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    let eventIndex = 0;

    const interval = setInterval(() => {
      if (eventIndex >= events.length) {
        setIsPlaying(false);
        clearInterval(interval);
        return;
      }

      setCurrentEventIndex(eventIndex);
      setProgress(((eventIndex + 1) / events.length) * 100);

      // Animate current event
      const eventElement = eventRefs.current[eventIndex];
      if (eventElement) {
        gsap.fromTo(eventElement,
          { scale: 0.8, opacity: 0.5 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );

        // Add pulse effect for threats
        if (events[eventIndex].type === 'threat') {
          gsap.to(eventElement, {
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
            duration: 0.5,
            yoyo: true,
            repeat: 3
          });
        }
      }

      eventIndex++;
    }, 2000);
  };

  const jumpToEvent = (index: number) => {
    setCurrentEventIndex(index);
    setProgress(((index + 1) / events.length) * 100);
    
    const eventElement = eventRefs.current[index];
    if (eventElement) {
      gsap.fromTo(eventElement,
        { scale: 0.9, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      
      eventElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentEventIndex(0);
    setProgress(0);
  };

  const getThreatLevel = () => {
    const threatEvents = events.slice(0, currentEventIndex + 1)
      .filter(e => e.type === 'threat').length;
    const defenseEvents = events.slice(0, currentEventIndex + 1)
      .filter(e => e.type === 'present' || e.type === 'future').length;
    
    return Math.max(0, threatEvents - defenseEvents);
  };

  useEffect(() => {
    // Initial animation
    if (eventRefs.current[0]) {
      gsap.fromTo(eventRefs.current[0],
        { scale: 0.8, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, []);

  return (
    <div className={className}>
      <Card className="bg-card/80 border-[color:var(--quantum-purple)]/30 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl holographic">Quantum Cryptography Timeline</CardTitle>
          <CardDescription>
            The evolution from classical to post-quantum cryptography
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress and Controls */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Timeline Progress</span>
              <Badge 
                variant={getThreatLevel() > 0 ? 'destructive' : 'default'}
                className="ultra-glow"
              >
                {getThreatLevel() > 0 ? `Threat Level: ${getThreatLevel()}` : 'Secure'}
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
            
            <div className="flex space-x-2">
              <Button
                onClick={playTimeline}
                className="flex-1"
                disabled={currentEventIndex >= events.length - 1 && !isPlaying}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Play Timeline
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => jumpToEvent(currentEventIndex + 1)} disabled={currentEventIndex >= events.length - 1}>
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={reset}>
                Reset
              </Button>
            </div>
          </div>

          {/* Current Event Display */}
          <div className="p-6 bg-secondary/50 rounded-xl border border-border">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`${events[currentEventIndex]?.color} ultra-glow`}>
                {getIcon(events[currentEventIndex]?.icon)}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold holographic">
                  {events[currentEventIndex]?.year}
                </span>
                <Badge 
                  variant="outline"
                  className={
                    events[currentEventIndex]?.type === 'threat' ? 'border-destructive text-destructive' :
                    events[currentEventIndex]?.type === 'future' ? 'border-purple-400 text-purple-400' :
                    'border-accent text-accent'
                  }
                >
                  {events[currentEventIndex]?.type.toUpperCase()}
                </Badge>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{events[currentEventIndex]?.title}</h3>
            <p className="text-muted-foreground">{events[currentEventIndex]?.description}</p>
          </div>

          {/* Timeline Visualization */}
          <div ref={timelineRef} className="space-y-4 max-h-96 overflow-y-auto">
            {events.map((event, index) => (
              <div
                key={event.year}
                ref={el => { eventRefs.current[index] = el; }}
                onClick={() => jumpToEvent(index)}
                className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  index === currentEventIndex 
                    ? 'bg-primary/10 border-primary/50 scale-105' 
                    : index < currentEventIndex
                    ? 'bg-secondary/30 border-border/50'
                    : 'bg-secondary/10 border-border/20 opacity-50'
                } ${
                  event.type === 'threat' && index <= currentEventIndex
                    ? 'shadow-lg shadow-destructive/20'
                    : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  event.type === 'threat' ? 'bg-destructive/20' :
                  event.type === 'future' ? 'bg-purple-400/20' :
                  'bg-accent/20'
                } ultra-glow`}>
                  <div className={event.color}>
                    {getIcon(event.icon)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-lg">{event.year}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        event.type === 'threat' ? 'border-destructive/50 text-destructive' :
                        event.type === 'future' ? 'border-purple-400/50 text-purple-400' :
                        'border-accent/50 text-accent'
                      }`}
                    >
                      {event.type}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-1">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>

                {index < currentEventIndex && (
                  <div className="text-green-400">
                    <Shield size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-400/10 rounded-xl">
              <div className="text-lg font-bold text-blue-400">
                {events.filter(e => e.type === 'past').length}
              </div>
              <div className="text-xs text-muted-foreground">Historical Events</div>
            </div>
            <div className="p-3 bg-red-400/10 rounded-xl">
              <div className="text-lg font-bold text-red-400">
                {events.filter(e => e.type === 'threat').length}
              </div>
              <div className="text-xs text-muted-foreground">Quantum Threats</div>
            </div>
            <div className="p-3 bg-green-400/10 rounded-xl">
              <div className="text-lg font-bold text-green-400">
                {events.filter(e => e.type === 'present' || e.type === 'future').length}
              </div>
              <div className="text-xs text-muted-foreground">PQC Milestones</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}