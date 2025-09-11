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

interface AlumniProfileData {
  full_name: string;
  email: string;
  phone: string;
  graduation_year: number;
  degree: string;
  major: string;
  current_job_title: string;
  current_company: string;
  years_of_experience: number;
  industry: string;
  location: string;
  linkedin_url: string;
  bio: string;
  skills: string[];
  expertise_areas: string[];
  availability_for_mentoring: boolean;
  preferred_communication: string;
}

export function AlumniProfile() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<AlumniProfileData>({
    full_name: '',
    email: '',
    phone: '',
    graduation_year: new Date().getFullYear(),
    degree: '',
    major: '',
    current_job_title: '',
    current_company: '',
    years_of_experience: 0,
    industry: '',
    location: '',
    linkedin_url: '',
    bio: '',
    skills: [],
    expertise_areas: [],
    availability_for_mentoring: false,
    preferred_communication: 'email'
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
      .from('alumni_profiles')
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
      'full_name', 'email', 'phone', 'graduation_year', 'degree', 'major',
      'current_job_title', 'current_company', 'industry', 'location'
    ];
    
    const isComplete = requiredFields.every(field => 
      profileData[field as keyof AlumniProfileData] && 
      String(profileData[field as keyof AlumniProfileData]).trim() !== ''
    );

    const dataToSave = {
      ...profileData,
      user_id: user.id,
      is_profile_complete: isComplete
    };

    const { error } = await supabase
      .from('alumni_profiles')
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

  const addSkill = (value: string) => {
    if (value && !profileData.skills.includes(value)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, value]
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addExpertiseArea = (value: string) => {
    if (value && !profileData.expertise_areas.includes(value)) {
      setProfileData(prev => ({
        ...prev,
        expertise_areas: [...prev.expertise_areas, value]
      }));
    }
  };

  const removeExpertiseArea = (area: string) => {
    setProfileData(prev => ({
      ...prev,
      expertise_areas: prev.expertise_areas.filter(a => a !== area)
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
          <h1 className="text-3xl font-bold">Alumni Profile</h1>
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
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
              placeholder="City, Country"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <CardDescription>Your academic background</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="graduation_year">Graduation Year *</Label>
            <Input
              id="graduation_year"
              type="number"
              value={profileData.graduation_year}
              onChange={(e) => setProfileData(prev => ({...prev, graduation_year: parseInt(e.target.value) || 0}))}
              placeholder="2020"
            />
          </div>
          <div>
            <Label htmlFor="degree">Degree *</Label>
            <Input
              id="degree"
              value={profileData.degree}
              onChange={(e) => setProfileData(prev => ({...prev, degree: e.target.value}))}
              placeholder="Bachelor's, Master's, PhD"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="major">Major *</Label>
            <Input
              id="major"
              value={profileData.major}
              onChange={(e) => setProfileData(prev => ({...prev, major: e.target.value}))}
              placeholder="Computer Science, Engineering, etc."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Your current work and experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_job_title">Current Job Title *</Label>
              <Input
                id="current_job_title"
                value={profileData.current_job_title}
                onChange={(e) => setProfileData(prev => ({...prev, current_job_title: e.target.value}))}
                placeholder="Software Engineer, Manager, etc."
              />
            </div>
            <div>
              <Label htmlFor="current_company">Current Company *</Label>
              <Input
                id="current_company"
                value={profileData.current_company}
                onChange={(e) => setProfileData(prev => ({...prev, current_company: e.target.value}))}
                placeholder="Company name"
              />
            </div>
            <div>
              <Label htmlFor="years_of_experience">Years of Experience</Label>
              <Input
                id="years_of_experience"
                type="number"
                value={profileData.years_of_experience}
                onChange={(e) => setProfileData(prev => ({...prev, years_of_experience: parseInt(e.target.value) || 0}))}
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Input
                id="industry"
                value={profileData.industry}
                onChange={(e) => setProfileData(prev => ({...prev, industry: e.target.value}))}
                placeholder="Technology, Finance, Healthcare, etc."
              />
            </div>
          </div>
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
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
              placeholder="Tell us about yourself, your experience, and what you're passionate about..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills & Expertise</CardTitle>
          <CardDescription>Areas where you can help students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                  {skill} ×
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add a skill and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
          <div>
            <Label>Expertise Areas</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileData.expertise_areas.map((area, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeExpertiseArea(area)}>
                  {area} ×
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add an expertise area and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addExpertiseArea(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mentorship</CardTitle>
          <CardDescription>Help the next generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="mentoring"
              checked={profileData.availability_for_mentoring}
              onCheckedChange={(checked) => setProfileData(prev => ({...prev, availability_for_mentoring: checked}))}
            />
            <Label htmlFor="mentoring">Available for mentoring</Label>
          </div>
          <div>
            <Label htmlFor="preferred_communication">Preferred Communication</Label>
            <Select
              value={profileData.preferred_communication}
              onValueChange={(value) => setProfileData(prev => ({...prev, preferred_communication: value}))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="video">Video Call</SelectItem>
                <SelectItem value="in-person">In Person</SelectItem>
              </SelectContent>
            </Select>
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