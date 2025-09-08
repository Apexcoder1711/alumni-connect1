import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Briefcase, 
  MessageCircle, 
  Target, 
  Star,
  Search,
  Bell,
  TrendingUp,
  Award,
  MapPin,
  Clock,
  Send
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const StudentDashboard = () => {
  const [aiMessage, setAiMessage] = useState('');
  const [showAICoach, setShowAICoach] = useState(false);

  const handleAICoach = () => {
    setShowAICoach(true);
    toast({
      title: "AI Career Coach Activated",
      description: "I'm here to help you with career guidance and mentor matching!",
    });
  };

  const handleSendMessage = () => {
    if (!aiMessage.trim()) return;
    
    toast({
      title: "Message Sent to AI Coach",
      description: "I'll analyze your goals and suggest the best mentors for you.",
    });
    setAiMessage('');
  };

  const suggestedMentors = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      title: 'Senior Software Engineer',
      company: 'Google',
      expertise: 'Machine Learning',
      rating: 4.9,
      sessions: 127,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      title: 'Product Manager',
      company: 'Microsoft',
      expertise: 'Product Strategy',
      rating: 4.8,
      sessions: 89,
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Lisa Thompson',
      title: 'UX Design Lead',
      company: 'Apple',
      expertise: 'Design Systems',
      rating: 4.9,
      sessions: 156,
      image: '/placeholder.svg'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Career Fair 2024',
      date: '2024-02-15',
      time: '10:00 AM',
      attendees: 450,
      type: 'Career Fair'
    },
    {
      id: 2,
      title: 'Alumni Networking Mixer',
      date: '2024-02-18',
      time: '6:00 PM',
      attendees: 89,
      type: 'Networking'
    },
    {
      id: 3,
      title: 'Resume Workshop',
      date: '2024-02-20',
      time: '2:00 PM',
      attendees: 34,
      type: 'Workshop'
    }
  ];

  const jobOpportunities = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Internship',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Product Management Associate',
      company: 'StartupX',
      location: 'Remote',
      type: 'Full-time',
      posted: '1 week ago'
    },
    {
      id: 3,
      title: 'UX Research Assistant',
      company: 'Design Studio',
      location: 'New York, NY',
      type: 'Part-time',
      posted: '3 days ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-primary rounded-xl">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Student Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, Alex!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleAICoach}>
                <Target className="h-4 w-4 mr-2" />
                AI Coach
              </Button>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="stats-grid mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Mentorships</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="p-3 bg-primary-light rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applications Sent</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="p-3 bg-accent-light rounded-full">
                  <Briefcase className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Events Attended</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="p-3 bg-success/10 rounded-full">
                  <Calendar className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profile Score</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* AI Career Coach */}
            {showAICoach && (
              <Card className="animate-bounce-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    AI Career Coach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-light rounded-lg">
                      <p className="text-sm">
                        Hi Alex! I've analyzed your profile and goals. Based on your interest in software engineering 
                        and machine learning, I've found some perfect mentors for you. Would you like me to send 
                        connection requests?
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Ask me anything about your career..."
                        value={aiMessage}
                        onChange={(e) => setAiMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggested Mentors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  AI-Recommended Mentors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedMentors.map((mentor) => (
                    <div key={mentor.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={mentor.image} />
                        <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{mentor.name}</h4>
                        <p className="text-sm text-muted-foreground">{mentor.title} at {mentor.company}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant="outline" className="text-xs">{mentor.expertise}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-warning text-warning" />
                            <span className="text-xs">{mentor.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{mentor.sessions} sessions</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button size="sm">
                          Connect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Job Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Job Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobOpportunities.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">{job.location}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">{job.posted}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm">Apply</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Profile Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Overall Progress</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Basic Information</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Education Details</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span>Skills & Interests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-border rounded-full"></div>
                      <span>Portfolio Projects</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">{event.type}</Badge>
                        <span className="text-xs text-muted-foreground">{event.attendees} attending</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Events
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;