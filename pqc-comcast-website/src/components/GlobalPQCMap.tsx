import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Globe, Shield, AlertTriangle, CheckCircle, TrendingUp, Users, Building } from "lucide-react";
import { gsap } from "gsap";

interface CountryData {
  id: string;
  name: string;
  status: 'leading' | 'developing' | 'planning' | 'unknown';
  adoption: number;
  population: string;
  initiatives: string[];
  keyProjects: string[];
  timeline: string;
  description: string;
  position: { x: number; y: number };
  color: string;
}

interface GlobalPQCMapProps {
  className?: string;
}

export function GlobalPQCMap({ className }: GlobalPQCMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const pulseRefs = useRef<(HTMLDivElement | null)[]>([]);

  const countries: CountryData[] = [
    {
      id: 'usa',
      name: 'United States',
      status: 'leading',
      adoption: 85,
      population: '331M',
      initiatives: ['NIST PQC Standards', 'NSA Commercial Solutions', 'Federal Migration Mandate'],
      keyProjects: ['NIST Post-Quantum Cryptography', 'NSA CNSA 2.0', 'DoD Quantum Initiative'],
      timeline: 'Target: 2030 for federal systems',
      description: 'Leading global PQC standardization through NIST, with mandatory federal adoption timelines.',
      position: { x: 25, y: 40 },
      color: 'text-green-400'
    },
    {
      id: 'china',
      name: 'China',
      status: 'leading',
      adoption: 78,
      population: '1.4B',
      initiatives: ['National Cryptography Standards', 'Quantum Communication Networks', 'Military PQC Programs'],
      keyProjects: ['Quantum Communication Satellite', 'National Cryptography Law', 'SM Algorithm Series'],
      timeline: 'Active deployment since 2020',
      description: 'Massive investments in quantum communication infrastructure and indigenous PQC development.',
      position: { x: 75, y: 35 },
      color: 'text-green-400'
    },
    {
      id: 'eu',
      name: 'European Union',
      status: 'developing',
      adoption: 72,
      population: '447M',
      initiatives: ['Digital Decade Strategy', 'Cybersecurity Act', 'Quantum Flagship Program'],
      keyProjects: ['EU Cybersecurity Certification', 'Quantum Internet Alliance', 'ETSI PQC Standards'],
      timeline: 'Gradual adoption 2025-2030',
      description: 'Coordinated EU-wide approach with significant R&D investments and regulatory frameworks.',
      position: { x: 52, y: 30 },
      color: 'text-blue-400'
    },
    {
      id: 'uk',
      name: 'United Kingdom',
      status: 'developing',
      adoption: 68,
      population: '67M',
      initiatives: ['National Quantum Strategy', 'GCHQ Crypto Guidance', 'Quantum Network'],
      keyProjects: ['UK Quantum Network', 'NCSC PQC Guidance', 'Quantum Computing Hubs'],
      timeline: 'Migration planning phase',
      description: 'Strong government backing with national quantum computing and cryptography initiatives.',
      position: { x: 48, y: 25 },
      color: 'text-blue-400'
    },
    {
      id: 'japan',
      name: 'Japan',
      status: 'developing',
      adoption: 65,
      population: '125M',
      initiatives: ['Society 5.0 Initiative', 'Quantum Moonshot Program', 'Cryptographic Modernization'],
      keyProjects: ['CRYPTREC Evaluation', 'Quantum Internet Task Force', 'Industrial IoT Security'],
      timeline: 'Evaluation and pilot phase',
      description: 'Technology-focused approach with strong industry-government collaboration.',
      position: { x: 85, y: 35 },
      color: 'text-blue-400'
    },
    {
      id: 'canada',
      name: 'Canada',
      status: 'developing',
      adoption: 60,
      population: '38M',
      initiatives: ['National Quantum Strategy', 'Quantum-Safe Canada', 'CSE Guidelines'],
      keyProjects: ['Quantum Valley Ideas Lab', 'ISARA Corporation', 'Government PQC Migration'],
      timeline: 'Early adoption phase',
      description: 'Strong quantum research ecosystem with government and private sector coordination.',
      position: { x: 22, y: 25 },
      color: 'text-blue-400'
    },
    {
      id: 'australia',
      name: 'Australia',
      status: 'planning',
      adoption: 45,
      population: '26M',
      initiatives: ['National Quantum Strategy', 'Critical Technology Policy', 'Defence Quantum Program'],
      keyProjects: ['Australian Quantum Network', 'Defence Science Institute', 'Commercial PQC Testing'],
      timeline: 'Strategic planning phase',
      description: 'Growing quantum research capabilities with defence and commercial applications.',
      position: { x: 82, y: 70 },
      color: 'text-yellow-400'
    },
    {
      id: 'singapore',
      name: 'Singapore',
      status: 'developing',
      adoption: 58,
      population: '5.9M',
      initiatives: ['Smart Nation Initiative', 'Quantum Engineering Programme', 'Cybersecurity Strategy'],
      keyProjects: ['Centre for Quantum Technologies', 'Quantum-Safe Network', 'Financial Sector PQC'],
      timeline: 'Active pilot programs',
      description: 'Leading smart city implementation with advanced quantum research and financial sector focus.',
      position: { x: 78, y: 55 },
      color: 'text-blue-400'
    },
    {
      id: 'southkorea',
      name: 'South Korea',
      status: 'developing',
      adoption: 52,
      population: '52M',
      initiatives: ['K-Digital New Deal', 'Quantum Technology Roadmap', 'National Cybersecurity Strategy'],
      keyProjects: ['Korean Quantum Network', 'Samsung Quantum Research', '5G Security Standards'],
      timeline: 'Research and development phase',
      description: 'Technology giant involvement with government support for quantum initiatives.',
      position: { x: 82, y: 38 },
      color: 'text-blue-400'
    },
    {
      id: 'india',
      name: 'India',
      status: 'planning',
      adoption: 38,
      population: '1.4B',
      initiatives: ['National Mission on Quantum Technologies', 'Digital India Program', 'Cyber Security Strategy'],
      keyProjects: ['C-DAC Quantum Research', 'IIT Quantum Programs', 'DRDO Quantum Initiative'],
      timeline: 'Early research phase',
      description: 'Large-scale potential with growing government investment in quantum technologies.',
      position: { x: 72, y: 48 },
      color: 'text-yellow-400'
    },
    {
      id: 'israel',
      name: 'Israel',
      status: 'developing',
      adoption: 55,
      population: '9.5M',
      initiatives: ['National Quantum Initiative', 'Cybersecurity Excellence', 'Defence Innovation'],
      keyProjects: ['Quantum Information Science Center', 'IDF Cyber Defense', 'Academic Partnerships'],
      timeline: 'Security-focused development',
      description: 'Advanced cybersecurity expertise with military and academic quantum research leadership.',
      position: { x: 57, y: 45 },
      color: 'text-blue-400'
    },
    {
      id: 'switzerland',
      name: 'Switzerland',
      status: 'developing',
      adoption: 50,
      population: '8.7M',
      initiatives: ['Swiss Quantum Initiative', 'Financial Sector Security', 'Research Excellence'],
      keyProjects: ['ETH Quantum Center', 'Swiss National Bank Crypto', 'ID Quantique'],
      timeline: 'Financial sector priority',
      description: 'Financial services focus with world-class research institutions and commercial quantum companies.',
      position: { x: 50, y: 32 },
      color: 'text-blue-400'
    },
    {
      id: 'netherlands',
      name: 'Netherlands',
      status: 'developing',
      adoption: 48,
      population: '17M',
      initiatives: ['Dutch Quantum Delta', 'National Quantum Agenda', 'QuTech Research'],
      keyProjects: ['Quantum Network Netherlands', 'TU Delft QuTech', 'Quantum Internet'],
      timeline: 'Research to commercialization',
      description: 'Leading quantum internet research with strong public-private partnerships.',
      position: { x: 50, y: 28 },
      color: 'text-blue-400'
    },
    {
      id: 'taiwan',
      name: 'Taiwan',
      status: 'planning',
      adoption: 42,
      population: '23M',
      initiatives: ['Semiconductor Security', 'National Science Programs', 'Industry 4.0'],
      keyProjects: ['TSMC Security Research', 'Academia Sinica', 'Quantum Computing Center'],
      timeline: 'Semiconductor supply chain focus',
      description: 'Semiconductor industry leadership driving quantum-safe hardware and chip security.',
      position: { x: 80, y: 42 },
      color: 'text-yellow-400'
    },
    {
      id: 'norway',
      name: 'Norway',
      status: 'planning',
      adoption: 40,
      population: '5.4M',
      initiatives: ['Digital Norway', 'National Security Strategy', 'Research Council Funding'],
      keyProjects: ['NTNU Quantum Research', 'Oil & Gas Security', 'Government Digitalization'],
      timeline: 'Nordic cooperation model',
      description: 'Nordic cooperation approach with focus on critical infrastructure and energy sector security.',
      position: { x: 52, y: 20 },
      color: 'text-yellow-400'
    },
    {
      id: 'brazil',
      name: 'Brazil',
      status: 'planning',
      adoption: 28,
      population: '215M',
      initiatives: ['National IoT Strategy', 'Cybersecurity Strategy', 'Digital Transformation'],
      keyProjects: ['USP Quantum Research', 'Government Digital Services', 'Banking Security Standards'],
      timeline: 'Awareness and planning phase',
      description: 'Emerging interest with academic research and financial sector security focus.',
      position: { x: 35, y: 62 },
      color: 'text-orange-400'
    },
    {
      id: 'russia',
      name: 'Russia',
      status: 'developing',
      adoption: 55,
      population: '146M',
      initiatives: ['National Quantum Initiative', 'GOST Cryptographic Standards', 'Strategic Technology Program'],
      keyProjects: ['Russian Quantum Network', 'Quantum Key Distribution', 'Indigenous Cryptography'],
      timeline: 'National security focus',
      description: 'Strong emphasis on national cryptographic independence and quantum communication.',
      position: { x: 65, y: 25 },
      color: 'text-blue-400'
    },
    {
      id: 'mexico',
      name: 'Mexico',
      status: 'planning',
      adoption: 22,
      population: '128M',
      initiatives: ['Digital Mexico Strategy', 'National Cybersecurity Program', 'Government Modernization'],
      keyProjects: ['UNAM Research Programs', 'Financial Sector Upgrades', 'Telecom Infrastructure'],
      timeline: 'Infrastructure modernization',
      description: 'Focus on telecommunications and financial sector security with growing academic research.',
      position: { x: 20, y: 48 },
      color: 'text-orange-400'
    },
    {
      id: 'uae',
      name: 'United Arab Emirates',
      status: 'planning',
      adoption: 35,
      population: '10M',
      initiatives: ['UAE 2071 Vision', 'National AI Strategy', 'Smart City Initiatives'],
      keyProjects: ['Dubai Future Foundation', 'ADNOC Digital Security', 'Financial Free Zones'],
      timeline: 'Smart infrastructure focus',
      description: 'Future-focused smart city and financial hub development with quantum-safe infrastructure.',
      position: { x: 62, y: 47 },
      color: 'text-orange-400'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'leading': return <CheckCircle size={16} />;
      case 'developing': return <TrendingUp size={16} />;
      case 'planning': return <Shield size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'leading': return 'bg-green-400/20 border-green-400/30';
      case 'developing': return 'bg-blue-400/20 border-blue-400/30';
      case 'planning': return 'bg-yellow-400/20 border-yellow-400/30';
      default: return 'bg-gray-400/20 border-gray-400/30';
    }
  };

  const animateCountryPulse = (countryId: string) => {
    const index = countries.findIndex(c => c.id === countryId);
    const pulseElement = pulseRefs.current[index];
    
    if (pulseElement) {
      gsap.fromTo(pulseElement,
        { scale: 1, opacity: 0.8 },
        { 
          scale: 2, 
          opacity: 0, 
          duration: 1.5, 
          ease: "power2.out",
          repeat: 2
        }
      );
    }
  };

  const startGlobalAnimation = () => {
    setIsAnimating(true);
    
    countries.forEach((country, index) => {
      setTimeout(() => {
        animateCountryPulse(country.id);
      }, index * 200);
    });
    
    setTimeout(() => setIsAnimating(false), countries.length * 200 + 2000);
  };

  const handleCountryClick = (country: CountryData) => {
    setSelectedCountry(country);
    animateCountryPulse(country.id);
  };

  const getAdoptionColor = (adoption: number) => {
    if (adoption >= 70) return 'text-green-400';
    if (adoption >= 50) return 'text-blue-400';
    if (adoption >= 30) return 'text-yellow-400';
    return 'text-orange-400';
  };

  useEffect(() => {
    setTimeout(startGlobalAnimation, 1000);
  }, []);

  return (
    <div className={className}>
      <Card className="bg-card/80 border-primary/30 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl holographic">Global PQC Implementation Map</CardTitle>
          <CardDescription>
            Interactive map showing post-quantum cryptography adoption worldwide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* World Map */}
          <div 
            ref={mapRef}
            className="relative w-full h-96 bg-gradient-to-b from-background via-card/50 to-background rounded-xl border border-border overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, var(--quantum-purple) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, var(--quantum-cyan) 0%, transparent 50%),
                radial-gradient(circle at 40% 70%, var(--accent) 0%, transparent 50%),
                radial-gradient(circle at 90% 90%, var(--quantum-pink) 0%, transparent 50%)
              `,
              backgroundSize: '200px 200px, 250px 250px, 180px 180px, 160px 160px'
            }}
          >
            {/* Country Markers */}
            {countries.map((country, index) => (
              <div key={country.id}>
                {/* Pulse Ring */}
                <div
                  ref={el => { pulseRefs.current[index] = el; }}
                  className="absolute w-8 h-8 border-2 border-primary rounded-full pointer-events-none"
                  style={{
                    left: `${country.position.x}%`,
                    top: `${country.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
                
                {/* Country Marker */}
                <div
                  className={`absolute w-6 h-6 rounded-full cursor-pointer transition-all duration-300 ultra-glow border-2 ${
                    getStatusColor(country.status)
                  } ${
                    hoveredCountry === country.id ? 'scale-125 z-20' : 'scale-100 z-10'
                  } ${
                    selectedCountry?.id === country.id ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{
                    left: `${country.position.x}%`,
                    top: `${country.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleCountryClick(country)}
                  onMouseEnter={() => setHoveredCountry(country.id)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${country.color}`}>
                    {getStatusIcon(country.status)}
                  </div>
                </div>
                
                {/* Hover Tooltip */}
                {hoveredCountry === country.id && (
                  <div 
                    className="absolute z-30 bg-card/95 border border-border rounded-lg p-3 min-w-48 pointer-events-none"
                    style={{
                      left: `${country.position.x}%`,
                      top: `${country.position.y - 15}%`,
                      transform: 'translate(-50%, -100%)'
                    }}
                  >
                    <div className="text-sm font-semibold mb-1">{country.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">{country.description}</div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`text-xs ${country.color}`}>
                        {country.status.toUpperCase()}
                      </Badge>
                      <span className={`text-xs font-bold ${getAdoptionColor(country.adoption)}`}>
                        {country.adoption}% Ready
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-card/90 border border-border rounded-lg p-3">
              <div className="text-xs font-semibold mb-2">Implementation Status</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-400/30 border border-green-400/50"></div>
                  <span>Leading (70%+ Ready)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400/30 border border-blue-400/50"></div>
                  <span>Developing (50%+ Ready)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400/30 border border-yellow-400/50"></div>
                  <span>Planning (&lt;50% Ready)</span>
                </div>
              </div>
            </div>

            {/* Animation Controls */}
            <div className="absolute top-4 right-4">
              <Button
                variant="outline"
                size="sm"
                onClick={startGlobalAnimation}
                disabled={isAnimating}
                className="ultra-glow"
              >
                {isAnimating ? 'Animating...' : 'Pulse All'}
              </Button>
            </div>
          </div>

          {/* Country Details Panel */}
          {selectedCountry && (
            <Card className={`${getStatusColor(selectedCountry.status)} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getStatusColor(selectedCountry.status)}`}>
                      <div className={selectedCountry.color}>
                        {getStatusIcon(selectedCountry.status)}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{selectedCountry.name}</CardTitle>
                      <CardDescription>Population: {selectedCountry.population}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getAdoptionColor(selectedCountry.adoption)}`}>
                      {selectedCountry.adoption}%
                    </div>
                    <div className="text-xs text-muted-foreground">PQC Ready</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Implementation Progress</div>
                  <Progress value={selectedCountry.adoption} className="h-3 mb-2" />
                  <div className="text-xs text-muted-foreground">{selectedCountry.timeline}</div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2 flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Key Initiatives
                    </div>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {selectedCountry.initiatives.map((initiative, index) => (
                        <li key={index}>• {initiative}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Major Projects
                    </div>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {selectedCountry.keyProjects.map((project, index) => (
                        <li key={index}>• {project}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">{selectedCountry.description}</p>
                </div>

                <div className="flex space-x-2">
                  <Badge variant="outline" className={selectedCountry.color}>
                    {selectedCountry.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    {selectedCountry.population}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Global Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-400/10 rounded-xl border border-green-400/30">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {countries.filter(c => c.status === 'leading').length}
              </div>
              <div className="text-xs text-muted-foreground">Leading Countries</div>
            </div>
            <div className="text-center p-4 bg-blue-400/10 rounded-xl border border-blue-400/30">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {countries.filter(c => c.status === 'developing').length}
              </div>
              <div className="text-xs text-muted-foreground">Developing Implementation</div>
            </div>
            <div className="text-center p-4 bg-yellow-400/10 rounded-xl border border-yellow-400/30">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {Math.round(countries.reduce((sum, c) => sum + c.adoption, 0) / countries.length)}%
              </div>
              <div className="text-xs text-muted-foreground">Global Average</div>
            </div>
            <div className="text-center p-4 bg-purple-400/10 rounded-xl border border-purple-400/30">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {(countries.reduce((sum, c) => sum + parseFloat(c.population.replace(/[^0-9.]/g, '')), 0) / 1000).toFixed(1)}B
              </div>
              <div className="text-xs text-muted-foreground">Population Covered</div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="text-xs text-muted-foreground p-4 bg-muted/20 rounded-lg">
            <strong>Note:</strong> This map represents current PQC implementation status based on public information about 
            national initiatives, government programs, and industry adoption. Actual deployment levels may vary by sector and organization.
            Click on country markers to explore detailed implementation information.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}