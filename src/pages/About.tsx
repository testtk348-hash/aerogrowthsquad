import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden">
          <img
            src={heroFarm}
            alt="Vertical aeroponics farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20" />
          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-white mb-2 drop-shadow-lg">About Aeroponics</h1>
            <p className="text-white/90 text-lg">
              Next-generation vertical farming monitoring system
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Overview */}
          <div className="space-y-6">
            <Card className="card-hover">
              <CardContent className="p-6">
                <h2 className="mb-4">Project Overview</h2>
                <div className="space-y-4 text-sm">
                  <p>
                    The Aeroponics Dashboard is a comprehensive monitoring and management 
                    platform designed for vertical farming operations using aeroponic growing techniques.
                  </p>
                  <p>
                    Our system provides real-time insights into critical growing parameters, 
                    enabling farmers to optimize crop yields while minimizing resource consumption.
                  </p>
                  <p>
                    With integrated AI-powered pest detection and automated alerts, 
                    the platform helps prevent crop losses and maintain optimal growing conditions 24/7.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column - How It Works */}
          <div className="space-y-6">
            <Card className="card-hover">
              <CardContent className="p-6">
                <h2 className="mb-4">How It Works</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Vertical Rack System</h4>
                      <p className="text-sm text-muted-foreground">
                        Plants grow in vertical racks with misting nozzles delivering nutrient-rich aerosol directly to exposed roots.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Real-Time Sensors</h4>
                      <p className="text-sm text-muted-foreground">
                        Multiple sensors continuously measure pH, TDS, air & water temperature, humidity, and dissolved oxygen levels.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Edge Computing</h4>
                      <p className="text-sm text-muted-foreground">
                        On-device microcontrollers process sensor data and stream it to the cloud via MQTT/WebSocket protocols.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Dashboard Analytics</h4>
                      <p className="text-sm text-muted-foreground">
                        The web dashboard interprets data, generates alerts, and stores historical metrics for trend analysis.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">AI Pest Detection</h4>
                      <p className="text-sm text-muted-foreground">
                        Image classification models analyze uploaded photos to identify pests and diseases, flagging issues before they spread.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* CTA Section */}
        <Card className="gradient-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-white mb-4">Get Started with Aeroponics</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Ready to transform your farming operation? Request a demo or reach out to our team for more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Request Demo
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Mail className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Github className="h-4 w-4 mr-2" />
                View on GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
