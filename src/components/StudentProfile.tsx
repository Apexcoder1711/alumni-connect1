import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Save, User } from "lucide-react";

interface StudentProfileData {
  full_name: string;
  email: string;
  phone: string;
  student_id: string;
  current_year: number;
  degree_program: string;
  major: string;
  gpa: number;
  expected_graduation_year: number;
  interests: string[];
  career_goals: string;
  skills: string[];
  projects: string[];
  internship_experience: string;
  extracurricular_activities: string[];
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  seeking_mentorship: boolean;
}

export function StudentProfile() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<StudentProfileData>({
    full_name: '',
    email: '',
    phone: '',
    student_id: '',
    current_year: 1,
    degree_program: '',
    major: '',
    gpa: 0,
    expected_graduation_year: new Date().getFullYear() + 4,
    interests: [],
    career_goals: '',
    skills: [],
    projects: [],
    internship_experience: '',
    extracurricular_activities: [],
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    seeking_mentorship: false
  });
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } else if (data) {
      setProfileData(data);
      setIsProfileComplete(data.is_profile_complete || false);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    
    // Check if all required fields are filled
    const requiredFields = [
      'full_name', 'email', 'phone', 'student_id', 'current_year', 
      'degree_program', 'major', 'expected_graduation_year'
    ];
    
    const isComplete = requiredFields.every(field => 
      profileData[field as keyof StudentProfileData] && 
      String(profileData[field as keyof StudentProfileData]).trim() !== ''
    );

    const dataToSave = {
      ...profileData,
      user_id: user.id,
      is_profile_complete: isComplete
    };

    const { error } = await supabase
      .from('student_profiles')
      .upsert(dataToSave);

    if (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } else {
      setIsProfileComplete(isComplete);
      toast({
        title: "Success",
        description: isComplete ? "Profile completed and saved!" : "Profile saved!",
      });
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const addToArray = (field: keyof Pick<StudentProfileData, 'interests' | 'skills' | 'projects' | 'extracurricular_activities'>, value: string) => {
    if (value && !profileData[field].includes(value)) {
      setProfileData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
  };

  const removeFromArray = (field: keyof Pick<StudentProfileData, 'interests' | 'skills' | 'projects' | 'extracurricular_activities'>, item: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item)
    }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Student Profile</h1>
          {isProfileComplete && (
            <Badge className="bg-green-100 text-green-800">Complete</Badge>
          )}
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Basic details about you</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={profileData.full_name}
              onChange={(e) => setProfileData(prev => ({...prev, full_name: e.target.value}))}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <Label htmlFor="student_id">Student ID *</Label>
            <Input
              id="student_id"
              value={profileData.student_id}
              onChange={(e) => setProfileData(prev => ({...prev, student_id: e.target.value}))}
              placeholder="Your student ID"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
          <CardDescription>Your educational details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="current_year">Current Year *</Label>
            <Select
              value={profileData.current_year.toString()}
              onValueChange={(value) => setProfileData(prev => ({...prev, current_year: parseInt(value)}))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
                <SelectItem value="5">5th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="degree_program">Degree Program *</Label>
            <Input
              id="degree_program"
              value={profileData.degree_program}
              onChange={(e) => setProfileData(prev => ({...prev, degree_program: e.target.value}))}
              placeholder="Bachelor's, Master's, PhD"
            />
          </div>
          <div>
            <Label htmlFor="major">Major *</Label>
            <Input
              id="major"
              value={profileData.major}
              onChange={(e) => setProfileData(prev => ({...prev, major: e.target.value}))}
              placeholder="Computer Science, Engineering, etc."
            />
          </div>
          <div>
            <Label htmlFor="expected_graduation_year">Expected Graduation Year *</Label>
            <Input
              id="expected_graduation_year"
              type="number"
              value={profileData.expected_graduation_year}
              onChange={(e) => setProfileData(prev => ({...prev, expected_graduation_year: parseInt(e.target.value) || 0}))}
              placeholder="2025"
            />
          </div>
          <div>
            <Label htmlFor="gpa">GPA</Label>
            <Input
              id="gpa"
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={profileData.gpa}
              onChange={(e) => setProfileData(prev => ({...prev, gpa: parseFloat(e.target.value) || 0}))}
              placeholder="3.75"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interests & Goals</CardTitle>
          <CardDescription>What drives you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileData.interests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('interests', interest)}>
                  {interest} ×
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add an interest and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('interests', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="career_goals">Career Goals</Label>
            <Textarea
              id="career_goals"
              value={profileData.career_goals}
              onChange={(e) => setProfileData(prev => ({...prev, career_goals: e.target.value}))}
              placeholder="Describe your career aspirations and goals..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills & Experience</CardTitle>
          <CardDescription>Your technical and professional capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('skills', skill)}>
                  {skill} ×
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add a skill and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('skills', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
          <div>
            <Label>Projects</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileData.projects.map((project, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('projects', project)}>
                  {project} ×
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add a project and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('projects', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="internship_experience">Internship Experience</Label>
            <Textarea
              id="internship_experience"
              value={profileData.internship_experience}
              onChange={(e) => setProfileData(prev => ({...prev, internship_experience: e.target.value}))}
              placeholder="Describe your internship experiences..."
              rows={3}
            />
          </div>
          <div>
            <Label>Extracurricular Activities</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileData.extracurricular_activities.map((activity, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('extracurricular_activities', activity)}>
                  {activity} ×
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add an activity and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('extracurricular_activities', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Online Presence</CardTitle>
          <CardDescription>Your professional links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              value={profileData.linkedin_url}
              onChange={(e) => setProfileData(prev => ({...prev, linkedin_url: e.target.value}))}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              value={profileData.github_url}
              onChange={(e) => setProfileData(prev => ({...prev, github_url: e.target.value}))}
              placeholder="https://github.com/yourusername"
            />
          </div>
          <div>
            <Label htmlFor="portfolio_url">Portfolio URL</Label>
            <Input
              id="portfolio_url"
              value={profileData.portfolio_url}
              onChange={(e) => setProfileData(prev => ({...prev, portfolio_url: e.target.value}))}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mentorship</CardTitle>
          <CardDescription>Connect with alumni</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="mentorship"
              checked={profileData.seeking_mentorship}
              onCheckedChange={(checked) => setProfileData(prev => ({...prev, seeking_mentorship: checked}))}
            />
            <Label htmlFor="mentorship">Seeking mentorship</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
}