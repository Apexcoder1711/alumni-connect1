import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  Settings,
  TrendingUp,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  UserCheck
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const pendingVerifications = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@alumni.edu',
      type: 'Alumni',
      company: 'Google',
      graduationYear: '2018',
      status: 'pending',
      submittedDate: '2024-02-10'
    },
    {
      id: 2,
      name: 'Emma Davis',
      email: 'emma.davis@alumni.edu',
      type: 'Alumni',
      company: 'Microsoft',
      graduationYear: '2020',
      status: 'pending',
      submittedDate: '2024-02-12'
    },
    {
      id: 3,
      name: 'Alex Johnson',
      email: 'alex.j@student.edu',
      type: 'Student',
      major: 'Computer Science',
      year: 'Senior',
      status: 'pending',
      submittedDate: '2024-02-13'
    }
  ];

  const platformStats = {
    totalUsers: 2847,
    activeUsers: 1932,
    alumni: 1245,
    students: 1602,
    mentorships: 456,
    jobPostings: 89,
    events: 34,
    successRate: 87
  };

  const recentActivities = [
    {
      id: 1,
      type: 'mentorship',
      description: 'New mentorship established between Sarah Chen and Alex Park',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'job',
      description: 'Job posting approved: Software Engineer Intern at TechCorp',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      type: 'event',
      description: 'Event created: Alumni Networking Mixer on March 15',
      timestamp: '6 hours ago'
    },
    {
      id: 4,
      type: 'verification',
      description: 'Alumni verification completed for Maria Rodriguez',
      timestamp: '1 day ago'
    }
  ];

  const handleApproveUser = (id: number) => {
    toast({
      title: "User Approved",
      description: "User verification completed and access granted.",
    });
  };

  const handleRejectUser = (id: number) => {
    toast({
      title: "User Rejected",
      description: "User verification rejected. Notification sent.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary-light">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-secondary rounded-xl">
                <Settings className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Platform Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
                System Healthy
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="stats-grid">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</p>
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
                      <p className="text-sm text-muted-foreground">Active Mentorships</p>
                      <p className="text-2xl font-bold">{platformStats.mentorships}</p>
                    </div>
                    <div className="p-3 bg-accent-light rounded-full">
                      <UserCheck className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Job Postings</p>
                      <p className="text-2xl font-bold">{platformStats.jobPostings}</p>
                    </div>
                    <div className="p-3 bg-success/10 rounded-full">
                      <Briefcase className="h-6 w-6 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">{platformStats.successRate}%</p>
                    </div>
                    <div className="p-3 bg-warning/10 rounded-full">
                      <TrendingUp className="h-6 w-6 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid xl:grid-cols-3 gap-8">
              {/* Recent Activities */}
              <div className="xl:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Recent Platform Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'mentorship' ? 'bg-primary-light' :
                            activity.type === 'job' ? 'bg-accent-light' :
                            activity.type === 'event' ? 'bg-success/10' :
                            'bg-warning/10'
                          }`}>
                            {activity.type === 'mentorship' && <Users className="h-4 w-4 text-primary" />}
                            {activity.type === 'job' && <Briefcase className="h-4 w-4 text-accent" />}
                            {activity.type === 'event' && <Calendar className="h-4 w-4 text-success" />}
                            {activity.type === 'verification' && <Shield className="h-4 w-4 text-warning" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Platform Health */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Server Uptime</span>
                          <span className="text-sm font-medium">99.9%</span>
                        </div>
                        <Progress value={99.9} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">User Satisfaction</span>
                          <span className="text-sm font-medium">94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Response Time</span>
                          <span className="text-sm font-medium">1.2s</span>
                        </div>
                        <Progress value={88} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Security Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Export Reports
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        System Config
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Pending Verifications
                  <Badge variant="secondary">{pendingVerifications.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVerifications.map((user) => (
                    <div key={user.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{user.name}</h4>
                            <Badge variant={user.type === 'Alumni' ? 'default' : 'secondary'}>
                              {user.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                          <div className="space-y-1 text-sm">
                            {user.type === 'Alumni' ? (
                              <>
                                <p><strong>Company:</strong> {user.company}</p>
                                <p><strong>Graduation:</strong> {user.graduationYear}</p>
                              </>
                            ) : (
                              <>
                                <p><strong>Major:</strong> {user.major}</p>
                                <p><strong>Year:</strong> {user.year}</p>
                              </>
                            )}
                            <p className="text-muted-foreground">Submitted: {user.submittedDate}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveUser(user.id)}
                            className="bg-success hover:bg-success/90"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectUser(user.id)}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" variant="ghost">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    User Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Alumni</span>
                      <span className="font-medium">{platformStats.alumni}</span>
                    </div>
                    <Progress value={(platformStats.alumni / platformStats.totalUsers) * 100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Students</span>
                      <span className="font-medium">{platformStats.students}</span>
                    </div>
                    <Progress value={(platformStats.students / platformStats.totalUsers) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Active Users</span>
                      <span className="font-medium">1,234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Messages Sent</span>
                      <span className="font-medium">5,678</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sessions Today</span>
                      <span className="font-medium">2,345</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Session Duration</span>
                      <span className="font-medium">12m 34s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Content Moderation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pending moderation items</h3>
                  <p className="text-muted-foreground">
                    All content is currently approved and following community guidelines.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;