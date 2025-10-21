import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, Monitor, GraduationCap, ArrowRight } from "lucide-react";
import consultation1 from "@/assets/consultation1.jpg";
import consultation2 from "@/assets/consultation2.jpg";

const Consultation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-6 sm:py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl">Consultation Services</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-sm sm:text-base">
            Comprehensive support and guidance for your aeroponic farming journey
          </p>
        </div>

        {/* Hero Images */}
        <div className="grid md:grid-cols-2 gap-6">
          <img 
            src={consultation1} 
            alt="Tower Farm Setup" 
            className="w-full h-60 sm:h-80 object-cover rounded-lg shadow-lg"
          />
          <img 
            src={consultation2} 
            alt="Aeroponic Towers" 
            className="w-full h-60 sm:h-80 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Service Cards in New Order */}
        <div className="space-y-6">
          {/* 1. Standard Support Package */}
          <Card className="card-hover border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Standard Support Package</CardTitle>
                  <Badge variant="secondary" className="mt-1">Included with Purchase</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                When you purchase a Tower Farm, we provide comprehensive support at no additional cost for small-scale projects. Our standard package includes:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Step-by-step assembly guidance
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Irrigation system configuration
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Nutrient dosing system setup
                  </li>
                </ul>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Seedling production assistance
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Seed and cultivar selection
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Ongoing technical support
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Bonus:</strong> Access to our complete library of instructional e-books covering all aspects of vertical farming, from seed selection to harvesting techniques and nutrient management.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. On-Site Consultation */}
          <Card className="card-hover border-l-4 border-l-secondary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-xl">On-Site Consultation</CardTitle>
                  <Badge variant="outline" className="mt-1">Premium Service</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                For larger-scale projects requiring physical presence and hands-on assessment, we provide comprehensive on-site consultation services.
              </p>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">On-site services include:</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      Land and infrastructure assessment
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      Custom system design and planning
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      Installation supervision
                    </li>
                  </ul>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      Team training and knowledge transfer
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      Quality assurance and validation
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      Operational optimization
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Off-Site Consultation */}
          <Card className="card-hover border-l-4 border-l-accent">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Monitor className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-xl">Off-Site Consultation</CardTitle>
                  <Badge variant="outline" className="mt-1">Remote Support</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Comprehensive remote consultation services for projects requiring strategic planning, ongoing support, and technical expertise without physical presence.
              </p>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Off-site consultation is ideal when:</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      Strategic planning and preparation
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      Technical consultation and review
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      System validation and optimization
                    </li>
                  </ul>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      Ongoing monitoring and support
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      Custom research and troubleshooting
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      Regular team meetings and calls
                    </li>
                  </ul>
                </div>
                <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> We operate under a retainer-based model to ensure availability and prioritize your project needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Future Plans - Advanced Masterclass and Training */}
          <Card className="card-hover border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Future Plans - Advanced Masterclass & Training</CardTitle>
                  <Badge className="mt-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white">Coming Soon</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We're developing an advanced masterclass program that will deliver comprehensive, hands-on training based on real-world experience from Tower Farm operations across 50+ countries.
              </p>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Planned features include:</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      5+ hours of hands-on video training
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      24 comprehensive training chapters
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      Real-world case studies and examples
                    </li>
                  </ul>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      Professional-level insights and techniques
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      Optimization strategies and best practices
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      Certification and continuing education
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Stay tuned:</strong> This comprehensive training resource will be ideal for anyone looking to optimize their Tower Farm experience from the start and gain professional-level expertise.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
