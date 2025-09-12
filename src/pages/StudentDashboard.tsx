import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { StudentProfile } from "@/components/StudentProfile";
import AITimetableGenerator from "@/components/AITimetableGenerator";
import {
  Search,
  MessageSquare,
  Calendar,
  Briefcase,
  Users,
  Star,
  MapPin,
  Clock,
  Building,
  GraduationCap,
  Send,
  BookOpen,
  Trophy,
  Target,
  Zap,
  User
} from "lucide-react";

export default function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [connectionMessage, setConnectionMessage] = useState('');

  const handleSendConnection = () => {
    if (!connectionMessage.trim()) {
      toast({
        title: "Error",
        description: "Please write a message before sending connection request",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Connection Request Sent",
      description: "Your mentor will be notified and can accept your request",
    });
    
    setConnectionMessage('');
    setSelectedMentor(null);
  };

  const mentors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      title: 'Senior Software Engineer',
      company: 'Google',
      expertise: ['Machine Learning', 'Python', 'Data Science'],
      rating: 4.9,
      students: 23,
      image: '/placeholder.svg',
      location: 'San Francisco, CA',
      experience: '8 years'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Product Manager',
      company: 'Microsoft',
      expertise: ['Product Strategy', 'Analytics', 'Leadership'],
      rating: 4.8,
      students: 15,
      image: '/placeholder.svg',
      location: 'Seattle, WA',
      experience: '6 years'
    },
    {
      id: 3,
      name: 'Lisa Rodriguez',
      title: 'UX Design Lead',
      company: 'Apple',
      expertise: ['Design Systems', 'User Research', 'Figma'],
      rating: 4.9,
      students: 31,
      image: '/placeholder.svg',
      location: 'Cupertino, CA',
      experience: '7 years'
    }
  ];

  const jobOpportunities = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'TechStart Inc.',
      location: 'San Francisco, CA',
      type: 'Internship',
      salary: '$25/hour',
      posted: '2 days ago',
      tags: ['JavaScript', 'React', 'Node.js']
    },
    {
      id: 2,
      title: 'Data Science Co-op',
      company: 'DataCorp',
      location: 'Remote',
      type: 'Co-op',
      salary: '$30/hour',
      posted: '1 week ago',
      tags: ['Python', 'SQL', 'Machine Learning']
    },
    {
      id: 3,
      title: 'UX Research Assistant',
      company: 'Design Studio',
      location: 'New York, NY',
      type: 'Part-time',
      salary: '$22/hour',
      posted: '3 days ago',
      tags: ['User Research', 'Figma', 'Analytics']
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Career Fair 2024',
      date: 'Feb 15, 2024',
      time: '10:00 AM - 4:00 PM',
      location: 'Student Center',
      attendees: 450,
      type: 'Career Fair'
    },
    {
      id: 2,
      title: 'Alumni Networking Night',
      date: 'Feb 18, 2024',
      time: '6:00 PM - 9:00 PM',
      location: 'Alumni Hall',
      attendees: 89,
      type: 'Networking'
    },
    {
      id: 3,
      title: 'Resume Building Workshop',
      date: 'Feb 20, 2024',
      time: '2:00 PM - 4:00 PM',
      location: 'Career Services',
      attendees: 34,
      type: 'Workshop'
    }
  ];

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 mt-1">Explore opportunities, connect with alumni, and accelerate your career.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask Question
            </Button>
            <Button className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Find Mentors
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="ai-timetable" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI Timetable
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Mentorships</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Applications Sent</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Events Attended</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Profile Score</p>
                      <p className="text-2xl font-bold">85%</p>
                    </div>
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Mentor Search */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Find Mentors
                    </CardTitle>
                    <CardDescription>
                      Connect with alumni who can guide your career journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name, company, or expertise..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        {filteredMentors.map((mentor) => (
                          <div key={mentor.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={mentor.image} />
                              <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{mentor.name}</h4>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{mentor.rating}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{mentor.title} at {mentor.company}</p>
                              <div className="flex items-center gap-4 mb-2">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="text-xs">{mentor.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  <span className="text-xs">{mentor.experience}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span className="text-xs">{mentor.students} students</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {mentor.expertise.slice(0, 3).map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {mentor.expertise.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{mentor.expertise.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Message
                              </Button>
                              <Button size="sm" onClick={() => setSelectedMentor(mentor)}>
                                Connect
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Opportunities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Job Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {jobOpportunities.map((job) => (
                        <div key={job.id} className="flex items-start justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex-1">
                            <h4 className="font-medium">{job.title}</h4>
                            <div className="flex items-center gap-4 mt-1 mb-2">
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                <span className="text-sm text-muted-foreground">{job.company}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="text-sm text-muted-foreground">{job.location}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">{job.type}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mb-2">
                              <span className="text-sm font-medium text-green-600">{job.salary}</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className="text-xs text-muted-foreground">{job.posted}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {job.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{event.date} • {event.time}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">{event.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
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

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ask Question
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Event Calendar
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Career Resources
                    </Button>
                  </CardContent>
                </Card>

                {/* Profile Completion */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Profile Completion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Basic Information</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Education Details</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Skills & Interests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span>Portfolio Projects</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Complete Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Connection Request Modal */}
            {selectedMentor && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md mx-4">
                  <CardHeader>
                    <CardTitle>Connect with {selectedMentor.name}</CardTitle>
                    <CardDescription>
                      Send a message with your connection request
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedMentor.image} />
                        <AvatarFallback>{selectedMentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{selectedMentor.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedMentor.title} at {selectedMentor.company}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Hi! I'm a student interested in [specific area]. I'd love to connect and learn from your experience..."
                        value={connectionMessage}
                        onChange={(e) => setConnectionMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSendConnection} className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Request
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedMentor(null)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <StudentProfile />
          </TabsContent>

          <TabsContent value="ai-timetable" className="space-y-6">
            <AITimetableGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}