import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { AlumniProfile } from "@/components/AlumniProfile";
import { StartupHub } from "@/pages/StartupHub";
import {
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  MapPin,
  GraduationCap,
  Plus,
  Check,
  X,
  Eye,
  Star,
  User,
  Lightbulb
} from "lucide-react";

export default function AlumniDashboard() {
  const [showJobForm, setShowJobForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);

  const handleCreateJob = () => {
    setShowJobForm(true);
    toast({
      title: "Job Posting Form Opened",
      description: "Fill out the details to post a new opportunity",
    });
  };

  const handleCreateEvent = () => {
    setShowEventForm(true);
    toast({
      title: "Event Creation Form Opened", 
      description: "Create a new networking event or webinar",
    });
  };

  const mentorshipRequests = [
    {
      id: 1,
      name: 'Emily Johnson',
      major: 'Computer Science',
      year: 'Senior',
      interests: ['Machine Learning', 'Web Development'],
      message: 'Hi! I\'m interested in transitioning into product management after graduation.',
      image: '/placeholder.svg',
      requestDate: '2 days ago'
    },
    {
      id: 2,
      name: 'David Park',
      major: 'Business Administration', 
      year: 'Junior',
      interests: ['Startup', 'Entrepreneurship'],
      message: 'Would love to learn about your experience in the startup ecosystem.',
      image: '/placeholder.svg',
      requestDate: '1 week ago'
    },
    {
      id: 3,
      name: 'Sarah Miller',
      major: 'Design',
      year: 'Sophomore',
      interests: ['UX Design', 'Product Design'],
      message: 'Looking for guidance on building a strong design portfolio.',
      image: '/placeholder.svg',
      requestDate: '3 days ago'
    }
  ];

  const myEvents = [
    {
      id: 1,
      title: 'Product Management Fundamentals',
      date: '2024-02-25',
      time: '2:00 PM',
      type: 'Webinar',
      registrations: 45,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Tech Leadership Panel',
      date: '2024-03-05',
      time: '6:00 PM', 
      type: 'Panel Discussion',
      registrations: 67,
      status: 'upcoming'
    }
  ];

  const myJobPostings = [
    {
      id: 1,
      title: 'Product Manager Intern',
      company: 'TechStart Inc.',
      applications: 23,
      posted: '1 week ago',
      status: 'active'
    },
    {
      id: 2,
      title: 'Software Engineering Co-op',
      company: 'InnovateCorp',
      applications: 45,
      posted: '2 weeks ago',
      status: 'active'
    }
  ];

  const handleAcceptRequest = (id: number) => {
    toast({
      title: "Mentorship Request Accepted",
      description: "Student has been notified and can now schedule sessions with you.",
    });
  };

  const handleDeclineRequest = (id: number) => {
    toast({
      title: "Mentorship Request Declined",
      description: "Student has been notified with a polite message.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alumni Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your mentorship activities.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateJob} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Post Job
            </Button>
            <Button onClick={handleCreateEvent} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="startup-hub" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Startup Hub
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
                      <p className="text-sm text-muted-foreground">Active Mentees</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Job Posts</p>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Events Hosted</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Impact Score</p>
                      <p className="text-2xl font-bold">92</p>
                    </div>
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Mentorship Requests */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Mentorship Requests
                      <Badge variant="secondary">{mentorshipRequests.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mentorshipRequests.map((request) => (
                        <div key={request.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.image} />
                            <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{request.name}</h4>
                              <Badge variant="outline">{request.year}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{request.major}</p>
                            <p className="text-sm mb-3">{request.message}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {request.interests.map((interest) => (
                                <Badge key={interest} variant="secondary" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{request.requestDate}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAcceptRequest(request.id)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeclineRequest(request.id)}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* My Job Postings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      My Job Postings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {myJobPostings.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{job.title}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-muted-foreground">{job.company}</span>
                              <span className="text-sm text-muted-foreground">{job.applications} applications</span>
                              <span className="text-sm text-muted-foreground">{job.posted}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                              {job.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
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
                {/* Impact Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Impact Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Students Helped</span>
                        <span className="font-medium">47</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Session Hours</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">4.8</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Job Placements</span>
                        <span className="font-medium">12</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* My Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      My Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {myEvents.map((event) => (
                        <div key={event.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">{event.type}</Badge>
                            <span className="text-xs text-muted-foreground">{event.registrations} registered</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Browse Students
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Alumni Forum
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Event Calendar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="startup-hub">
            <StartupHub />
          </TabsContent>

          <TabsContent value="profile">
            <AlumniProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}