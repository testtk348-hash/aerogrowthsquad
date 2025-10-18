import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import consultation1 from "@/assets/consultation1.jpg";
import consultation2 from "@/assets/consultation2.jpg";

const Consultation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1>Tower Farm Consultation Services</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Expert guidance for your aeroponic farming journey
          </p>
        </div>

        {/* Hero Images */}
        <div className="grid md:grid-cols-2 gap-6">
          <img 
            src={consultation1} 
            alt="Tower Farm Setup" 
            className="w-full h-80 object-cover rounded-lg shadow-lg"
          />
          <img 
            src={consultation2} 
            alt="Aeroponic Towers" 
            className="w-full h-80 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Basic Support */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Standard Support Package</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              When someone purchases a Tower Farm, we generally offer full support at no additional cost for small-scale projects. This includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Step-by-step guidance to assemble the Tower Farm</li>
              <li>Assistance configuring the irrigation and nutrient dosing system</li>
              <li>Help producing seedlings and selecting seeds and cultivars</li>
              <li>Ongoing basic technical support as needed</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We also publish a complete library of instructional e-books covering all key aspects of vertical farming with aeroponic towers, from seed selection and crop planning to harvesting techniques and nutrient management.
            </p>
          </CardContent>
        </Card>

        {/* Masterclass */}
        <Card className="card-hover border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Advanced Masterclass Training</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              For those who want to take their knowledge further, we strongly recommend enrolling in our <span className="font-semibold text-foreground">Masterclass</span>. This advanced course delivers over five hours of hands-on video training across 24 chapters, based entirely on real-life experience operating Tower Farms in more than 50 countries.
            </p>
            <p className="text-muted-foreground">
              It is the most comprehensive training resource we have ever developed, ideal for anyone looking to optimize their Tower Farm experience from the start and gain practical, professional-level insights.
            </p>
            <p className="text-sm text-muted-foreground italic">
              *These resources are not included with the Tower Farm purchase but are available separately.
            </p>
            <p className="text-muted-foreground mt-4">
              In most cases, this level of support is more than sufficient to get a small or mid-sized Tower Farm running successfully.
            </p>
          </CardContent>
        </Card>

        {/* Extended Services */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Extended Off-Site and On-Site Consultation Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              For larger-scale projects, or when the consultation goes beyond the scope of a basic Tower Farm, we offer tailored services that may include on-site involvement. This applies when off-site consultation is required or when land and infrastructure must be assessed in person.
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Off-Site Consultation</h3>
              <p className="text-muted-foreground">Off-site consultation is required when:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>The project demands significant preparation ahead of the installation</li>
                <li>Strategic planning or infrastructure development is involved (including potential custom system design)</li>
                <li>Ongoing support and monitoring are required after launching the Tower Farm, particularly for larger operations</li>
                <li>Technical consultation, document review, and system validation are required</li>
                <li>Custom research or troubleshooting must be conducted</li>
                <li>Ongoing team meetings, video calls, and operational support are part of the process</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                In such cases, we operate under a <span className="font-semibold text-foreground">retainer-based model</span> to ensure availability and to prioritize the project.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Consultation;
