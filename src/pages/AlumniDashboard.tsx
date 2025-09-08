import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  MessageSquare, 
  TrendingUp,
  Star,
  Bell,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Building
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AlumniDashboard = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-background to-accent-light">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-accent rounded-xl">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Alumni Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, Maria!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleCreateJob}>
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
              <Button variant="outline" size="sm" onClick={handleCreateEvent}>
                <Calendar className="h-4 w-4 mr-2" />
                Create Event
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
                  <p className="text-sm text-muted-foreground">Active Mentees</p>
                  <p className="text-2xl font-bold">8</p>
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
                  <p className="text-sm text-muted-foreground">Job Posts</p>
                  <p className="text-2xl font-bold">5</p>
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
                  <p className="text-sm text-muted-foreground">Events Hosted</p>
                  <p className="text-2xl font-bold">12</p>
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
                  <p className="text-sm text-muted-foreground">Impact Score</p>
                  <p className="text-2xl font-bold">92</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-full">
                  <Star className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Job Posting Form */}
            {showJobForm && (
              <Card className="animate-bounce-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Post New Job Opportunity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Job Title</label>
                        <Input placeholder="e.g. Software Engineer Intern" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Company</label>
                        <Input placeholder="e.g. TechCorp Inc." />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input placeholder="e.g. San Francisco, CA" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Job Type</label>
                        <Input placeholder="e.g. Full-time, Internship" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea placeholder="Describe the role, requirements, and benefits..." />
                    </div>
                    <div className="flex gap-2">
                      <Button>Post Job</Button>
                      <Button variant="outline" onClick={() => setShowJobForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Event Creation Form */}
            {showEventForm && (
              <Card className="animate-bounce-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Create New Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Event Title</label>
                      <Input placeholder="e.g. Career Networking Mixer" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Date</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Time</label>
                        <Input type="time" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea placeholder="Event details, agenda, and what attendees can expect..." />
                    </div>
                    <div className="flex gap-2">
                      <Button>Create Event</Button>
                      <Button variant="outline" onClick={() => setShowEventForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mentorship Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Mentorship Requests
                  <Badge variant="secondary">{mentorshipRequests.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentorshipRequests.map((request) => (
                    <div key={request.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.image} />
                          <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{request.name}</h4>
                            <Badge variant="outline" className="text-xs">{request.year}</Badge>
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
                            className="bg-success hover:bg-success/90"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeclineRequest(request.id)}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Decline
                          </Button>
                        </div>
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
                  <Briefcase className="h-5 w-5 text-primary" />
                  My Job Postings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myJobPostings.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{job.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            <span className="text-sm text-muted-foreground">{job.company}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{job.applications} applications</span>
                          <span className="text-sm text-muted-foreground">{job.posted}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Applications
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
                  <TrendingUp className="h-5 w-5 text-primary" />
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
                      <Star className="h-3 w-3 fill-warning text-warning" />
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
                  <Calendar className="h-5 w-5 text-primary" />
                  My Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">{event.type}</Badge>
                        <span className="text-xs text-muted-foreground">{event.registrations} registered</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Manage All Events
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;