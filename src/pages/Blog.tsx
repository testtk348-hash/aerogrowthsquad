import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import harvest1 from "@/assets/blog-harvest1.jpg";
import team1 from "@/assets/blog-team1.jpg";
import team2 from "@/assets/blog-team2.jpg";
import consultation from "@/assets/blog-consultation.jpg";
import tower1 from "@/assets/blog-tower1.jpg";
import tower2 from "@/assets/blog-tower2.jpg";

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "First Successful Harvest: A Milestone Achievement",
      date: "September 4, 2025",
      category: "Harvest",
      images: [harvest1, tower1, tower2],
      content: `We are thrilled to announce our first successful harvest from our aeroponic tower farm! This milestone represents months of careful planning, precise environmental control, and dedicated monitoring.

Our leafy greens, particularly the Palak (spinach) varieties, have exceeded all expectations in terms of both yield and quality. The nutrient density and vibrant green color demonstrate the superior growing conditions provided by our aeroponic system.

The harvest process was smooth and efficient, showcasing the advantages of vertical farming - easy access to all plants, minimal physical strain, and reduced harvest time compared to traditional farming methods.`,
    },
    {
      id: 2,
      title: "Team Excellence: Our Dedicated Aero Growth Squad",
      date: "September 4, 2025",
      category: "Team",
      images: [team1, team2],
      content: `Behind every successful harvest is a dedicated team. Meet the Aero Growth Squad - our passionate group of agricultural innovators and technology enthusiasts who make vertical farming a reality.

Our team brings together expertise in horticulture, engineering, data science, and sustainable agriculture. From monitoring pH levels at 3 AM to celebrating each new sprout, their commitment drives our success.

The collaborative spirit and continuous learning mindset of our team members ensure that we're always pushing the boundaries of what's possible in aeroponic farming.`,
    },
    {
      id: 3,
      title: "Expert Consultation: Learning from the Best",
      date: "September 4, 2025",
      category: "Knowledge",
      images: [consultation],
      content: `We recently had the privilege of hosting expert consultations that transformed our understanding of aeroponic systems. Industry veterans shared invaluable insights on optimizing nutrient delivery, managing environmental parameters, and scaling operations.

The consultation covered critical topics including:
- Advanced nutrient management techniques
- Pest prevention in controlled environments
- Maximizing yield through precise environmental control
- Best practices for crop rotation in vertical systems

These knowledge-sharing sessions are instrumental in our journey toward becoming a leading aeroponic farming operation.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1>Our Aeroponic Journey</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Stories, updates, and insights from our vertical farming experience
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <Card key={post.id} className="card-hover overflow-hidden">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Images Grid */}
                <div className={`grid gap-4 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                  {post.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`${post.title} - Image ${idx + 1}`}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="prose prose-sm max-w-none">
                  {post.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-muted-foreground mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
