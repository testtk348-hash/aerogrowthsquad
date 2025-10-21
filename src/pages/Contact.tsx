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
import { Mail, Phone, MapPin, Linkedin, Youtube, Instagram, Send, CheckCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-6 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Get in Touch</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-sm sm:text-base">
            Ready to transform your farming with aeroponic technology? Contact our expert team for personalized consultation and support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a 
                        href="mailto:aerogrowthsquad@gmail.com" 
                        className="text-sm text-primary hover:underline"
                      >
                        aerogrowthsquad@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Phone & WhatsApp</p>
                      <p className="text-sm text-muted-foreground">Available via contact form</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">Poonthandalam, India</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a
                    href="https://www.linkedin.com/in/aerogrowthsquad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">LinkedIn</p>
                      <p className="text-xs text-muted-foreground">Professional Updates</p>
                    </div>
                  </a>

                  <a
                    href="https://www.youtube.com/channel/UCQHPN7LR0lDppS0Vn5PJBhQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Youtube className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium">YouTube</p>
                      <p className="text-xs text-muted-foreground">Educational Content</p>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/aerogrowthsquad?igsh=MWJoanBrbjl1dm92Zw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Instagram className="h-5 w-5 text-pink-600" />
                    <div>
                      <p className="text-sm font-medium">Instagram</p>
                      <p className="text-xs text-muted-foreground">Behind the Scenes</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Enter your company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                        placeholder="Enter your job title"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber">Mobile Number *</Label>
                      <Input
                        id="mobileNumber"
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                        placeholder="Enter your mobile number"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Is this a WhatsApp number? *</Label>
                      <RadioGroup
                        value={formData.isWhatsApp}
                        onValueChange={(value) => handleInputChange("isWhatsApp", value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="whatsapp-yes" />
                          <Label htmlFor="whatsapp-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="whatsapp-no" />
                          <Label htmlFor="whatsapp-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Enter your address"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Enter your city"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => handleInputChange("country", e.target.value)}
                          placeholder="Enter your country"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Areas of Interest */}
                  <div className="space-y-3">
                    <Label>Areas of Interest *</Label>
                    <div className="space-y-3">
                      {interestOptions.map((option) => (
                        <div key={option} className="flex items-start space-x-2">
                          <Checkbox
                            id={option}
                            checked={formData.areasOfInterest.includes(option)}
                            onCheckedChange={(checked) => 
                              handleInterestChange(option, checked as boolean)
                            }
                          />
                          <Label htmlFor={option} className="text-sm leading-relaxed">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {formData.areasOfInterest.includes("Other (please specify)") && (
                      <div className="space-y-2 mt-3">
                        <Label htmlFor="otherInterest">Please specify</Label>
                        <Input
                          id="otherInterest"
                          value={formData.otherInterest}
                          onChange={(e) => handleInputChange("otherInterest", e.target.value)}
                          placeholder="Please specify your other interest"
                        />
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us more about your project or requirements..."
                      rows={5}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full gap-2" 
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
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