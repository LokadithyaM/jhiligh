import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ExternalLink, BookOpen, Code, Users } from 'lucide-react';

interface CareerResultsProps {
  responses: Record<string, any>;
  onRestart: () => void;
}

const CareerResults = ({ responses, onRestart }: CareerResultsProps) => {
  // Simple career matching logic based on responses
  const getCareerRecommendations = () => {
    const interests = responses.interests || [];
    const strengths = responses.strengths || [];
    
    const careers = [];
    
    if (interests.includes('Technology & Programming') || strengths.includes('Technical Skills')) {
      careers.push({
        title: 'Software Developer',
        match: '95%',
        description: 'Build applications and solve problems through code',
        skills: ['JavaScript', 'React', 'Node.js', 'Git', 'Problem Solving'],
        projects: ['Build a personal portfolio website', 'Create a todo app with React'],
        resources: [
          { name: 'freeCodeCamp', url: 'https://freecodecamp.org' },
          { name: 'JavaScript30', url: 'https://javascript30.com' }
        ],
        icon: Code,
        color: 'from-blue-500 to-cyan-500'
      });
    }
    
    if (interests.includes('Creative Arts & Design') || strengths.includes('Creativity')) {
      careers.push({
        title: 'UX/UI Designer',
        match: '90%',
        description: 'Design user-friendly digital experiences',
        skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing'],
        projects: ['Redesign a mobile app interface', 'Create a design system for a startup'],
        resources: [
          { name: 'Google UX Design Certificate', url: '#' },
          { name: 'Figma Academy', url: '#' }
        ],
        icon: Users,
        color: 'from-purple-500 to-pink-500'
      });
    }
    
    if (interests.includes('Business & Entrepreneurship') || strengths.includes('Leadership')) {
      careers.push({
        title: 'Product Manager',
        match: '88%',
        description: 'Guide product development from idea to launch',
        skills: ['Product Strategy', 'Data Analysis', 'Agile/Scrum', 'Stakeholder Management', 'Market Research'],
        projects: ['Launch a small digital product', 'Conduct user interviews for an app idea'],
        resources: [
          { name: 'Product School', url: '#' },
          { name: 'Coursera Product Management', url: '#' }
        ],
        icon: BookOpen,
        color: 'from-green-500 to-emerald-500'
      });
    }
    
    // Default careers if no specific matches
    if (careers.length === 0) {
      careers.push({
        title: 'Digital Marketing Specialist',
        match: '85%',
        description: 'Promote brands and products through digital channels',
        skills: ['Social Media Marketing', 'Content Creation', 'Analytics', 'SEO', 'Email Marketing'],
        projects: ['Run a social media campaign', 'Create content for a brand'],
        resources: [
          { name: 'Google Digital Marketing Courses', url: '#' },
          { name: 'HubSpot Academy', url: '#' }
        ],
        icon: Users,
        color: 'from-orange-500 to-red-500'
      });
    }
    
    return careers.slice(0, 3);
  };

  const recommendations = getCareerRecommendations();

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Your Career Recommendations
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Based on your responses, here are the best career paths for you
          </p>
          <Button onClick={onRestart} variant="outline" className="mb-8">
            <RefreshCw className="w-4 h-4 mr-2" />
            Take Assessment Again
          </Button>
        </div>

        <div className="space-y-8">
          {recommendations.map((career, index) => {
            const Icon = career.icon;
            return (
              <Card key={index} className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${career.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-800">{career.title}</h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        {career.match} Match
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-lg">{career.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Key Skills to Learn:</h4>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Practice Projects:</h4>
                      <ul className="space-y-2">
                        {career.projects.map((project, projectIndex) => (
                          <li key={projectIndex} className="flex items-center text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Recommended Resources:</h4>
                      <div className="space-y-2">
                        {career.resources.map((resource, resourceIndex) => (
                          <a
                            key={resourceIndex}
                            href={resource.url}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {resource.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h3 className="text-xl font-semibold mb-3">Ready to Start Your Journey?</h3>
            <p className="text-gray-600 mb-4">
              Remember, career growth is a marathon, not a sprint. Start with one skill and build consistently.
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Download Career Roadmap
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareerResults;
