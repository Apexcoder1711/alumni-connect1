import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Send,
  Eye,
  Edit,
  Trash2,
  UserCheck
} from "lucide-react";

export default function AlumniManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    recipient: ''
  });

  const [alumni, setAlumni] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    
    // Fetch alumni profiles
    const { data: alumniData, error: alumniError } = await supabase
      .from('alumni_profiles')
      .select('*')
      .eq('is_profile_complete', true);

    // Fetch student profiles
    const { data: studentData, error: studentError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('is_profile_complete', true);

    if (alumniError) {
      console.error('Error fetching alumni:', alumniError);
      toast({
        title: "Error",
        description: "Failed to load alumni profiles",
        variant: "destructive",
      });
    } else {
      setAlumni(alumniData || []);
    }

    if (studentError) {
      console.error('Error fetching students:', studentError);
      toast({
        title: "Error",
        description: "Failed to load student profiles",
        variant: "destructive",
      });
    } else {
      setStudents(studentData || []);
    }

    setLoading(false);
  };

  const handleSendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message || !notificationForm.recipient) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would implement the notification sending logic
    toast({
      title: "Success",
      description: `Notification sent to ${notificationForm.recipient}`,
    });

    setNotificationForm({ title: '', message: '', recipient: '' });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage alumni and student profiles and send communications.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
                <DialogDescription>
                  Send a notification to selected users.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm(prev => ({...prev, title: e.target.value}))}
                    placeholder="Notification title"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm(prev => ({...prev, message: e.target.value}))}
                    placeholder="Enter your message"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="recipient">Recipient</Label>
                  <Select
                    value={notificationForm.recipient}
                    onValueChange={(value) => setNotificationForm(prev => ({...prev, recipient: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alumni">All Alumni</SelectItem>
                      <SelectItem value="student">All Students</SelectItem>
                      <SelectItem value="all">All Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSendNotification} className="w-full">
                  Send Notification
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="alumni" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alumni" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Alumni ({alumni.length})
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Students ({students.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alumni" className="space-y-6">
            {/* Alumni Filter and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Alumni Directory
                </CardTitle>
                <CardDescription>
                  View and manage registered alumni profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search alumni..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="space-y-4">
                  {alumni.filter(alumnus => 
                    alumnus.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    alumnus.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    alumnus.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    alumnus.current_company?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((alumnus) => (
                    <Card key={alumnus.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{alumnus.full_name}</h3>
                              <Badge 
                                variant={alumnus.availability_for_mentoring ? 'default' : 'secondary'}
                                className={alumnus.availability_for_mentoring ? 'bg-green-100 text-green-800' : ''}
                              >
                                {alumnus.availability_for_mentoring ? 'Available for Mentoring' : 'Not Available'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{alumnus.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                <span>{alumnus.major} ({alumnus.graduation_year})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                <span>{alumnus.current_job_title} at {alumnus.current_company}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{alumnus.location}</span>
                              </div>
                              {alumnus.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{alumnus.phone}</span>
                                </div>
                              )}
                              {alumnus.industry && (
                                <div className="flex items-center gap-2">
                                  <Briefcase className="h-4 w-4" />
                                  <span>{alumnus.industry}</span>
                                </div>
                              )}
                            </div>
                            {alumnus.skills && alumnus.skills.length > 0 && (
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-1">
                                  {alumnus.skills.slice(0, 3).map((skill, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {alumnus.skills.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{alumnus.skills.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {alumni.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No alumni profiles found. Alumni need to complete their profiles to appear here.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            {/* Students Filter and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Students Directory
                </CardTitle>
                <CardDescription>
                  View and manage registered student profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="space-y-4">
                  {students.filter(student => 
                    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((student) => (
                    <Card key={student.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{student.full_name}</h3>
                              <Badge variant="outline">
                                Year {student.current_year}
                              </Badge>
                              {student.seeking_mentorship && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  Seeking Mentorship
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{student.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                <span>{student.major} - {student.degree_program}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4" />
                                <span>ID: {student.student_id}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Graduating: {student.expected_graduation_year}</span>
                              </div>
                              {student.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{student.phone}</span>
                                </div>
                              )}
                              {student.gpa && (
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4" />
                                  <span>GPA: {student.gpa}</span>
                                </div>
                              )}
                            </div>
                            {student.interests && student.interests.length > 0 && (
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-1">
                                  {student.interests.slice(0, 3).map((interest, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {interest}
                                    </Badge>
                                  ))}
                                  {student.interests.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{student.interests.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {students.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No student profiles found. Students need to complete their profiles to appear here.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}