import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Linkedin, Youtube, Instagram, Send, CheckCircle, MessageSquare, Users, Zap, Globe, Clock, Star } from "lucide-react";

interface ContactForm {
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
  mobileNumber: string;
  isWhatsApp: string;
  address: string;
  city: string;
  country: string;
  areasOfInterest: string[];
  otherInterest: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    fullName: "",
    email: "",
    company: "",
    jobTitle: "",
    mobileNumber: "",
    isWhatsApp: "",
    address: "",
    city: "",
    country: "",
    areasOfInterest: [],
    otherInterest: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = [
    "Standard support package",
    "Advanced masterclass training",
    "Extended off site and on site consultation services",
    "Other (please specify)"
  ];

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      areasOfInterest: checked
        ? [...prev.areasOfInterest, interest]
        : prev.areasOfInterest.filter(item => item !== interest)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.mobileNumber) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (formData.areasOfInterest.length === 0) {
      toast.error("Please select at least one area of interest");
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log("Form submitted:", formData);
      
      toast.success("Thank you for your inquiry! We'll get back to you soon.");
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        company: "",
        jobTitle: "",
        mobileNumber: "",
        isWhatsApp: "",
        address: "",
        city: "",
        country: "",
        areasOfInterest: [],
        otherInterest: "",
        message: "",
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/30 to-blue-50/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container py-6 sm:py-8 max-w-7xl relative z-10">
        {/* Enhanced Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <MessageSquare className="h-4 w-4" />
            Let's Connect
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            Ready to transform your farming with aeroponic technology? Contact our expert team for personalized consultation and support.
          </p>
          
          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24h</div>
              <div className="text-xs text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">50+</div>
              <div className="text-xs text-muted-foreground">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">100%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Enhanced Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-4">
                  <div className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/60 transition-all duration-300">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Email</p>
                      <a 
                        href="mailto:aerogrowthsquad@gmail.com" 
                        className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        aerogrowthsquad@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/60 transition-all duration-300">
                    <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                      <Phone className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Phone & WhatsApp</p>
                      <p className="text-sm text-muted-foreground">Available via contact form</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/60 transition-all duration-300">
                    <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                      <MapPin className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Location</p>
                      <p className="text-sm text-muted-foreground">Poonthandalam, India</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/60 transition-all duration-300">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Response Time</p>
                      <p className="text-sm text-muted-foreground">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Social Media Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  Follow Our Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a
                    href="https://www.linkedin.com/in/aerogrowthsquad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/60 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">LinkedIn</p>
                      <p className="text-xs text-muted-foreground">Professional Updates & Insights</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </a>

                  <a
                    href="https://www.youtube.com/channel/UCQHPN7LR0lDppS0Vn5PJBhQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/60 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                      <Youtube className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">YouTube</p>
                      <p className="text-xs text-muted-foreground">Educational Content & Tutorials</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/aerogrowthsquad?igsh=MWJoanBrbjl1dm92Zw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/60 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="p-2 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                      <Instagram className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Instagram</p>
                      <p className="text-xs text-muted-foreground">Behind the Scenes & Updates</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose Us Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  Why Choose Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <p className="text-sm text-gray-700">Expert consultation & support</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <p className="text-sm text-gray-700">Proven track record globally</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <p className="text-sm text-gray-700">24/7 technical assistance</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-gray-700">Sustainable farming solutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-white to-green-50/30 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-xl">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Send us a Message
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex-1 h-1 bg-primary/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full w-0 transition-all duration-500" 
                         style={{width: `${(Object.values(formData).filter(v => v !== "" && (Array.isArray(v) ? v.length > 0 : true)).length / 12) * 100}%`}}>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((Object.values(formData).filter(v => v !== "" && (Array.isArray(v) ? v.length > 0 : true)).length / 12) * 100)}% Complete
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-primary/20">
                      <div className="p-1.5 bg-primary/10 rounded-lg">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2 group">
                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          placeholder="Enter your full name"
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary group-hover:border-primary/50"
                          required
                        />
                      </div>
                      <div className="space-y-2 group">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter your email"
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary group-hover:border-primary/50"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-secondary/20">
                      <div className="p-1.5 bg-secondary/10 rounded-lg">
                        <Zap className="h-4 w-4 text-secondary" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2 group">
                        <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          placeholder="Enter your company name"
                          className="transition-all duration-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary group-hover:border-secondary/50"
                        />
                      </div>
                      <div className="space-y-2 group">
                        <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title</Label>
                        <Input
                          id="jobTitle"
                          value={formData.jobTitle}
                          onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                          placeholder="Enter your job title"
                          className="transition-all duration-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary group-hover:border-secondary/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-accent/20">
                      <div className="p-1.5 bg-accent/10 rounded-lg">
                        <Phone className="h-4 w-4 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2 group">
                        <Label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700">Mobile Number *</Label>
                        <Input
                          id="mobileNumber"
                          type="tel"
                          value={formData.mobileNumber}
                          onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                          placeholder="Enter your mobile number"
                          className="transition-all duration-200 focus:ring-2 focus:ring-accent/20 focus:border-accent group-hover:border-accent/50"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">Is this a WhatsApp number? *</Label>
                        <RadioGroup
                          value={formData.isWhatsApp}
                          onValueChange={(value) => handleInputChange("isWhatsApp", value)}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-green-50 transition-colors">
                            <RadioGroupItem value="yes" id="whatsapp-yes" className="text-green-600" />
                            <Label htmlFor="whatsapp-yes" className="text-sm font-medium cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-red-50 transition-colors">
                            <RadioGroupItem value="no" id="whatsapp-no" className="text-red-600" />
                            <Label htmlFor="whatsapp-no" className="text-sm font-medium cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  {/* Address Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2 group">
                        <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Enter your address"
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 group-hover:border-blue-400"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2 group">
                          <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            placeholder="Enter your city"
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 group-hover:border-blue-400"
                          />
                        </div>
                        <div className="space-y-2 group">
                          <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) => handleInputChange("country", e.target.value)}
                            placeholder="Enter your country"
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 group-hover:border-blue-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Areas of Interest Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-purple-200">
                      <div className="p-1.5 bg-purple-100 rounded-lg">
                        <Star className="h-4 w-4 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Areas of Interest *</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {interestOptions.map((option) => (
                        <div key={option} className="group">
                          <div className="flex items-start space-x-3 p-4 rounded-xl border-2 border-transparent hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-200">
                            <Checkbox
                              id={option}
                              checked={formData.areasOfInterest.includes(option)}
                              onCheckedChange={(checked) => 
                                handleInterestChange(option, checked as boolean)
                              }
                              className="mt-0.5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                            />
                            <Label htmlFor={option} className="text-sm leading-relaxed cursor-pointer font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
                              {option}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>

                    {formData.areasOfInterest.includes("Other (please specify)") && (
                      <div className="space-y-2 mt-4 p-4 bg-purple-50/50 rounded-xl border border-purple-200">
                        <Label htmlFor="otherInterest" className="text-sm font-medium text-gray-700">Please specify your interest</Label>
                        <Input
                          id="otherInterest"
                          value={formData.otherInterest}
                          onChange={(e) => handleInputChange("otherInterest", e.target.value)}
                          placeholder="Please specify your other interest"
                          className="transition-all duration-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Message Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-green-200">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Your Message</h3>
                    </div>
                    
                    <div className="space-y-2 group">
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700">Tell us about your project</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us more about your project, requirements, timeline, or any specific questions you have..."
                        rows={6}
                        className="transition-all duration-200 focus:ring-2 focus:ring-green-200 focus:border-green-500 group-hover:border-green-400 resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.message.length}/500 characters
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full gap-3 h-14 text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          Sending your message...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Send Message
                          <div className="ml-2 opacity-70">
                            →
                          </div>
                        </>
                      )}
                    </Button>
                    
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      We'll respond within 24 hours • Your information is secure and confidential
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;