import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Eye, ArrowLeft, Clock } from "lucide-react";
import harvest1 from "@/assets/blog-harvest1.jpg";
import team1 from "@/assets/blog-team1.jpg";
import team2 from "@/assets/blog-team2.jpg";
import consultation from "@/assets/blog-consultation.jpg";
import tower1 from "@/assets/blog-tower1.jpg";
import tower2 from "@/assets/blog-tower2.jpg";
import bhoomipoojaTeam from "@/assets/blog-bhoomi-pooja-team.jpg";
import bhoomipooja1 from "@/assets/blog-bhoomi-pooja-1.jpg";
import bhoomipooja2 from "@/assets/blog-bhoomi-pooja-2.jpg";
import bhoomipooja3 from "@/assets/blog-bhoomi-pooja-3.jpg";
import bhoomipooja4 from "@/assets/blog-bhoomi-pooja-4.jpg";
import bhoomipooja5 from "@/assets/blog-bhoomi-pooja-5.jpg";

interface BlogPost {
  id: number;
  title: string;
  date: string;
  category: string;
  coverImage: string;
  images: string[];
  excerpt: string;
  content: string;
  readTime: string;
}

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const posts: BlogPost[] = [
    {
      id: 1,
      title: "First Successful Harvest: A Milestone Achievement",
      date: "September 4, 2025",
      category: "Harvest",
      coverImage: harvest1,
      images: [harvest1, tower1, tower2],
      readTime: "3 min read",
      excerpt: "We are thrilled to announce our first successful harvest from our aeroponic tower farm! This milestone represents months of careful planning, precise environmental control, and dedicated monitoring.",
      content: `We are thrilled to announce our first successful harvest from our aeroponic tower farm! This milestone represents months of careful planning, precise environmental control, and dedicated monitoring.

Our leafy greens, particularly the Palak (spinach) varieties, have exceeded all expectations in terms of both yield and quality. The nutrient density and vibrant green color demonstrate the superior growing conditions provided by our aeroponic system.

The harvest process was smooth and efficient, showcasing the advantages of vertical farming - easy access to all plants, minimal physical strain, and reduced harvest time compared to traditional farming methods.

Key achievements from this harvest:
• 40% higher yield compared to traditional soil farming
• 95% water efficiency improvement
• Zero pesticide usage while maintaining plant health
• Consistent quality across all harvested produce

This success validates our approach to sustainable agriculture and sets the foundation for scaling our operations. The data collected during this harvest cycle will inform our next planting strategy and help optimize our growing parameters even further.

Looking ahead, we're excited to expand our crop varieties and continue pushing the boundaries of what's possible with aeroponic farming technology.`,
    },
    {
      id: 2,
      title: "Team Excellence: Our Dedicated Aero Growth Squad",
      date: "September 4, 2025",
      category: "Team",
      coverImage: team1,
      images: [team1, team2],
      readTime: "2 min read",
      excerpt: "Behind every successful harvest is a dedicated team. Meet the Aero Growth Squad - our passionate group of agricultural innovators and technology enthusiasts who make vertical farming a reality.",
      content: `Behind every successful harvest is a dedicated team. Meet the Aero Growth Squad - our passionate group of agricultural innovators and technology enthusiasts who make vertical farming a reality.

Our team brings together expertise in horticulture, engineering, data science, and sustainable agriculture. From monitoring pH levels at 3 AM to celebrating each new sprout, their commitment drives our success.

The collaborative spirit and continuous learning mindset of our team members ensure that we're always pushing the boundaries of what's possible in aeroponic farming.

Team Highlights:
• 24/7 monitoring and care for optimal plant health
• Continuous research and development initiatives
• Cross-functional collaboration between tech and agriculture experts
• Commitment to sustainable farming practices

Our diverse backgrounds create a unique synergy - combining traditional agricultural wisdom with cutting-edge technology. This blend of expertise allows us to innovate while respecting the fundamental principles of plant biology and growth.

The team's dedication extends beyond just growing plants; we're cultivating the future of sustainable agriculture, one harvest at a time.`,
    },
    {
      id: 3,
      title: "Expert Consultation: Learning from the Best",
      date: "September 4, 2025",
      category: "Knowledge",
      coverImage: consultation,
      images: [consultation],
      readTime: "4 min read",
      excerpt: "We recently had the privilege of hosting expert consultations that transformed our understanding of aeroponic systems. Industry veterans shared invaluable insights on optimizing nutrient delivery and environmental control.",
      content: `We recently had the privilege of hosting expert consultations that transformed our understanding of aeroponic systems. Industry veterans shared invaluable insights on optimizing nutrient delivery, managing environmental parameters, and scaling operations.

The consultation covered critical topics including:
• Advanced nutrient management techniques
• Pest prevention in controlled environments
• Maximizing yield through precise environmental control
• Best practices for crop rotation in vertical systems

Key Insights Gained:

Nutrient Management:
Our experts emphasized the importance of dynamic nutrient adjustment based on plant growth stages. We learned about micro-nutrient timing and the critical role of electrical conductivity monitoring.

Environmental Control:
Temperature and humidity fluctuations can significantly impact plant health. The consultation provided us with advanced strategies for maintaining optimal growing conditions throughout different seasons.

Scaling Strategies:
As we prepare to expand our operations, the experts shared valuable lessons about maintaining quality while increasing production capacity. This includes automation strategies and quality control protocols.

These knowledge-sharing sessions are instrumental in our journey toward becoming a leading aeroponic farming operation. The insights gained will be implemented in our next growing cycle, and we're excited to measure the improvements in both yield and quality.`,
    },
    {
      id: 4,
      title: "Bhoomi Pooja: A Sacred Beginning to Our Vertical Farming Journey",
      date: "September 1, 2025",
      category: "Milestone",
      coverImage: bhoomipoojaTeam,
      images: [bhoomipoojaTeam, bhoomipooja1, bhoomipooja2, bhoomipooja3, bhoomipooja4, bhoomipooja5],
      readTime: "5 min read",
      excerpt: "With immense joy, we share a special milestone in our journey – the successful Bhoomi Pooja for our Vertical Tower Farming - Aeroponics Project. This initiative is about empowering the Self-Help Group (SHG) in Poonthandalam and promoting sustainable farming practices.",
      content: `With immense joy, we share a special milestone in our journey – the successful Bhoomi Pooja for our Vertical Tower Farming - Aeroponics Project. This initiative is not just about technology but about empowering the Self-Help Group (SHG) in Poonthandalam, increasing crop yield, and promoting sustainable farming practices through real-time monitoring.

This project began in September and has been a journey of learning, innovation, and teamwork. Today, as we take this significant step, we do so with hope and determination for its successful completion.

Project Vision:
Our Vertical Tower Farming project represents a revolutionary approach to agriculture, combining traditional farming wisdom with cutting-edge aeroponic technology. The goal is to create a sustainable, high-yield farming system that can be replicated and scaled across rural communities.

Community Impact:
The project is designed to directly benefit the Self-Help Group (SHG) in Poonthandalam by:
• Providing training in modern farming techniques
• Increasing crop yield through optimized growing conditions
• Creating sustainable income opportunities
• Promoting water-efficient farming practices
• Establishing a model for community-driven agricultural innovation

Acknowledgments:

We extend our deepest gratitude to IEEE, SEC IEEE Student Branch - Sairam Institutions for providing this incredible opportunity, fostering student innovation, and supporting impactful projects like ours.

A heartfelt thanks to our CEO Sai Prakash LeoMuthu for his unwavering encouragement and our Principal Raja J for providing the necessary resources and constant support to make this possible.

A special thanks to UmaMaheswaran SK sir for his exceptional mentorship, guiding us at every step of this journey. We also sincerely thank Thanuja Balasundaram and Prabhu V for their invaluable guidance and motivation, which have played a crucial role in shaping our progress.

We are also grateful to Dr. Thamilselvi Ravi and Dr. Brindha Saminathan for their support and to our guide, and S Sumathi mam for her guidance throughout this project.

Looking Forward:
This Bhoomi Pooja marks not just the beginning of construction, but the start of a transformative journey that will impact lives, promote sustainability, and demonstrate the power of technology in service of community development.

The sacred ceremony reminds us that while we embrace modern technology, we remain rooted in our cultural values and commitment to the land and its people. This project will serve as a beacon of hope and innovation for sustainable agriculture in rural India.`,
    },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleViewMore = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl">Our Aeroponic Journey</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-sm sm:text-base">
            Stories, updates, and insights from our vertical farming experience
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="card-hover overflow-hidden group">
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge 
                  variant="secondary" 
                  className="absolute top-3 left-3 bg-white/90 text-black"
                >
                  {post.category}
                </Badge>
              </div>

              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      {post.readTime}
                    </div>
                  </div>

                  {/* Title */}
                  <CardTitle className="text-lg sm:text-xl line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>

                  {/* Excerpt */}
                  <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* View More Button */}
                  <Button 
                    onClick={() => handleViewMore(post)}
                    className="w-full mt-4 gap-2"
                    variant="outline"
                  >
                    <Eye className="h-4 w-4" />
                    View More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Post Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedPost && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCloseModal}
                      className="flex-shrink-0"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="space-y-2 flex-1">
                      <DialogTitle className="text-xl sm:text-2xl text-left">
                        {selectedPost.title}
                      </DialogTitle>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <Badge variant="secondary">{selectedPost.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {selectedPost.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {selectedPost.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Images Gallery */}
                  <div className={`grid gap-4 ${
                    selectedPost.images.length === 1 
                      ? 'grid-cols-1' 
                      : selectedPost.images.length === 2 
                      ? 'grid-cols-1 sm:grid-cols-2' 
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {selectedPost.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`${selectedPost.title} - Image ${idx + 1}`}
                        className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>

                  {/* Full Content */}
                  <div className="prose prose-sm sm:prose-base max-w-none">
                    {selectedPost.content.split('\n\n').map((paragraph, idx) => {
                      // Handle bullet points
                      if (paragraph.startsWith('•')) {
                        const items = paragraph.split('\n').filter(item => item.trim());
                        return (
                          <ul key={idx} className="list-disc list-inside space-y-1 mb-4">
                            {items.map((item, itemIdx) => (
                              <li key={itemIdx} className="text-muted-foreground">
                                {item.replace('•', '').trim()}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      
                      // Handle section headers (lines ending with :)
                      if (paragraph.endsWith(':')) {
                        return (
                          <h3 key={idx} className="text-lg font-semibold mt-6 mb-3 text-foreground">
                            {paragraph.replace(':', '')}
                          </h3>
                        );
                      }
                      
                      // Regular paragraphs
                      return (
                        <p key={idx} className="text-muted-foreground mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Blog;
