import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, BookOpen, Video, FileText, Clock, Star } from 'lucide-react';

interface LearningResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  assessmentResults?: any;
}

const getPersonalizedResources = (careerPath?: string) => {
  const defaultResources = {
    courses: [
      {
        title: "Career Development Fundamentals",
        provider: "Coursera",
        duration: "20 hours",
        rating: 4.5,
        level: "Beginner",
        description: "Essential skills for career growth and professional development.",
        link: "#"
      }
    ],
    articles: [
      {
        title: "10 Career Pivoting Strategies That Actually Work",
        source: "Harvard Business Review",
        readTime: "8 min read",
        category: "Career Development",
        description: "Practical advice for making successful career transitions.",
        link: "#"
      }
    ],
    videos: [
      {
        title: "Building Your Professional Brand",
        channel: "Career Coach",
        duration: "15:30",
        views: "500K views",
        description: "Learn how to build a strong professional presence.",
        link: "#"
      }
    ]
  };

  switch (careerPath) {
    case "Software Developer":
      return {
        courses: [
          {
            title: "Complete Web Development Bootcamp",
            provider: "Udemy",
            duration: "65 hours",
            rating: 4.7,
            level: "Beginner",
            description: "Learn HTML, CSS, JavaScript, React, and more in this comprehensive course.",
            link: "#"
          },
          {
            title: "Data Structures and Algorithms",
            provider: "Coursera",
            duration: "40 hours",
            rating: 4.8,
            level: "Intermediate",
            description: "Master the fundamentals of computer science and coding interviews.",
            link: "#"
          },
          {
            title: "Full Stack JavaScript Development",
            provider: "freeCodeCamp",
            duration: "300 hours",
            rating: 4.9,
            level: "Beginner to Advanced",
            description: "Complete certification program covering front-end and back-end development.",
            link: "#"
          }
        ],
        articles: [
          {
            title: "How to Land Your First Software Developer Job",
            source: "Stack Overflow Blog",
            readTime: "12 min read",
            category: "Career Development",
            description: "Essential tips for breaking into the tech industry.",
            link: "#"
          },
          {
            title: "Best Programming Languages to Learn in 2024",
            source: "GitHub Blog",
            readTime: "10 min read",
            category: "Technology Trends",
            description: "Industry insights on the most in-demand programming skills.",
            link: "#"
          },
          {
            title: "Building a Strong Developer Portfolio",
            source: "Dev.to",
            readTime: "8 min read",
            category: "Professional Development",
            description: "Showcase your coding skills effectively to potential employers.",
            link: "#"
          }
        ],
        videos: [
          {
            title: "Day in the Life: Software Engineer at Google",
            channel: "Tech Career Stories",
            duration: "12:34",
            views: "2.1M views",
            description: "An inside look at what it's really like working at a top tech company.",
            link: "#"
          },
          {
            title: "How to Ace Your Technical Interview",
            channel: "Coding Interview Pro",
            duration: "45:12",
            views: "892K views",
            description: "Comprehensive guide to preparing for technical interviews.",
            link: "#"
          },
          {
            title: "React vs Vue vs Angular: Which to Choose?",
            channel: "Traversy Media",
            duration: "18:45",
            views: "1.2M views",
            description: "Compare popular JavaScript frameworks for your next project.",
            link: "#"
          }
        ]
      };

    case "UX/UI Designer":
      return {
        courses: [
          {
            title: "UX/UI Design Fundamentals",
            provider: "Skillshare",
            duration: "25 hours",
            rating: 4.6,
            level: "Beginner",
            description: "Learn design principles, prototyping, and user research methods.",
            link: "#"
          },
          {
            title: "Advanced Figma Masterclass",
            provider: "Udemy",
            duration: "30 hours",
            rating: 4.8,
            level: "Intermediate",
            description: "Master the industry-standard design tool for creating stunning interfaces.",
            link: "#"
          },
          {
            title: "User Experience Research and Design",
            provider: "Coursera (University of Michigan)",
            duration: "45 hours",
            rating: 4.7,
            level: "Beginner",
            description: "Learn UX research methods and apply design thinking principles.",
            link: "#"
          }
        ],
        articles: [
          {
            title: "The UX Designer's Guide to Building a Portfolio",
            source: "UX Planet",
            readTime: "10 min read",
            category: "Portfolio Development",
            description: "How to showcase your design process and thinking effectively.",
            link: "#"
          },
          {
            title: "Design Systems: A Complete Guide",
            source: "InVision Blog",
            readTime: "15 min read",
            category: "Design Process",
            description: "Building consistent and scalable design systems.",
            link: "#"
          },
          {
            title: "UX Trends That Will Dominate 2024",
            source: "Adobe Blog",
            readTime: "8 min read",
            category: "Design Trends",
            description: "Stay ahead with the latest UX/UI design trends and predictions.",
            link: "#"
          }
        ],
        videos: [
          {
            title: "UX Designer Day in the Life at Airbnb",
            channel: "Design Life",
            duration: "15:20",
            views: "800K views",
            description: "Behind the scenes look at working as a UX designer at a major company.",
            link: "#"
          },
          {
            title: "Figma Tutorial: Complete Beginner Guide",
            channel: "CharliMarieTV",
            duration: "35:45",
            views: "1.5M views",
            description: "Learn Figma from scratch with hands-on projects.",
            link: "#"
          },
          {
            title: "User Research Methods Explained",
            channel: "AJ&Smart",
            duration: "22:10",
            views: "450K views",
            description: "When and how to use different UX research techniques.",
            link: "#"
          }
        ]
      };

    case "Project Manager":
      return {
        courses: [
          {
            title: "Project Management Professional (PMP)",
            provider: "PMI",
            duration: "35 hours",
            rating: 4.7,
            level: "Intermediate",
            description: "Industry-standard certification for project management professionals.",
            link: "#"
          },
          {
            title: "Agile and Scrum Masterclass",
            provider: "Udemy",
            duration: "28 hours",
            rating: 4.6,
            level: "Beginner",
            description: "Master agile methodologies and scrum framework for project success.",
            link: "#"
          },
          {
            title: "Digital Project Management",
            provider: "Coursera",
            duration: "32 hours",
            rating: 4.5,
            level: "Intermediate",
            description: "Learn to manage digital projects and remote teams effectively.",
            link: "#"
          }
        ],
        articles: [
          {
            title: "Essential Project Management Skills for 2024",
            source: "Project Management Institute",
            readTime: "12 min read",
            category: "Skill Development",
            description: "Key competencies every project manager should develop.",
            link: "#"
          },
          {
            title: "Remote Team Management Best Practices",
            source: "Harvard Business Review",
            readTime: "10 min read",
            category: "Leadership",
            description: "How to effectively manage distributed teams and projects.",
            link: "#"
          },
          {
            title: "Agile vs Waterfall: Choosing the Right Approach",
            source: "Atlassian Blog",
            readTime: "8 min read",
            category: "Methodology",
            description: "When to use different project management methodologies.",
            link: "#"
          }
        ],
        videos: [
          {
            title: "Project Manager Day in the Life",
            channel: "PM Career Stories",
            duration: "14:25",
            views: "600K views",
            description: "Real-world look at what project managers actually do daily.",
            link: "#"
          },
          {
            title: "Stakeholder Management Strategies",
            channel: "Project Management Videos",
            duration: "25:30",
            views: "300K views",
            description: "How to effectively communicate and manage project stakeholders.",
            link: "#"
          },
          {
            title: "Scrum Master vs Project Manager",
            channel: "Agile Academy",
            duration: "18:15",
            views: "420K views",
            description: "Understanding the differences and similarities between these roles.",
            link: "#"
          }
        ]
      };

    case "Marketing Specialist":
      return {
        courses: [
          {
            title: "Digital Marketing Specialization",
            provider: "Coursera (University of Illinois)",
            duration: "40 hours",
            rating: 4.6,
            level: "Beginner",
            description: "Comprehensive digital marketing curriculum covering SEO, SEM, and analytics.",
            link: "#"
          },
          {
            title: "Content Marketing Masterclass",
            provider: "HubSpot Academy",
            duration: "20 hours",
            rating: 4.7,
            level: "Intermediate",
            description: "Learn to create engaging content that drives business results.",
            link: "#"
          },
          {
            title: "Social Media Marketing Strategy",
            provider: "Skillshare",
            duration: "15 hours",
            rating: 4.5,
            level: "Beginner",
            description: "Build effective social media campaigns across all major platforms.",
            link: "#"
          }
        ],
        articles: [
          {
            title: "Marketing Analytics: Measuring What Matters",
            source: "Marketing Land",
            readTime: "11 min read",
            category: "Analytics",
            description: "Key metrics and tools for tracking marketing performance.",
            link: "#"
          },
          {
            title: "The Future of Email Marketing",
            source: "Campaign Monitor Blog",
            readTime: "9 min read",
            category: "Email Marketing",
            description: "Trends and best practices for effective email campaigns.",
            link: "#"
          },
          {
            title: "Building a Marketing Career in the Digital Age",
            source: "American Marketing Association",
            readTime: "13 min read",
            category: "Career Development",
            description: "Essential skills and strategies for marketing professionals.",
            link: "#"
          }
        ],
        videos: [
          {
            title: "Digital Marketing Manager: Day in the Life",
            channel: "Marketing Career Hub",
            duration: "16:40",
            views: "750K views",
            description: "See what a typical day looks like for a digital marketing professional.",
            link: "#"
          },
          {
            title: "Google Ads Tutorial for Beginners",
            channel: "WordStream",
            duration: "32:15",
            views: "1.1M views",
            description: "Complete guide to setting up and optimizing Google Ads campaigns.",
            link: "#"
          },
          {
            title: "Content Strategy That Actually Works",
            channel: "Neil Patel",
            duration: "24:50",
            views: "680K views",
            description: "Proven content marketing strategies from industry experts.",
            link: "#"
          }
        ]
      };

    default:
      return defaultResources;
  }
};

const LearningResourcesModal = ({ isOpen, onClose, userName, assessmentResults }: LearningResourcesModalProps) => {
  const [selectedTab, setSelectedTab] = useState("courses");

  const getGreeting = () => {
    const name = userName ? userName.split('@')[0] : 'there';
    if (assessmentResults?.careerPath) {
      return `Hey ${name}! 👋 Here are resources tailored for ${assessmentResults.careerPath}`;
    }
    return `Hey ${name}! 👋 Here are some curated resources to boost your career.`;
  };

  const resources = getPersonalizedResources(assessmentResults?.careerPath);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Learning Resources</DialogTitle>
          <p className="text-gray-600">{getGreeting()}</p>
          {assessmentResults?.careerPath && (
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-800">
                Recommended for: {assessmentResults.careerPath}
              </Badge>
            </div>
          )}
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Articles</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>Videos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            {resources.courses.map((course, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{course.provider}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={course.level === 'Beginner' ? 'secondary' : 'default'}>
                      {course.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <Button className="w-full" onClick={() => window.open(course.link, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="articles" className="space-y-4">
            {resources.articles.map((article, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{article.source}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  <Button variant="outline" className="w-full" onClick={() => window.open(article.link, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            {resources.videos.map((video, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span>{video.channel}</span>
                    <span>{video.duration}</span>
                    <span>{video.views}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{video.description}</p>
                  <Button variant="outline" className="w-full" onClick={() => window.open(video.link, '_blank')}>
                    <Video className="w-4 h-4 mr-2" />
                    Watch Video
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {!assessmentResults && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              💡 Take our Career Assessment to get personalized resource recommendations based on your interests and career goals!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LearningResourcesModal;
