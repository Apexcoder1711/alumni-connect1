import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Calendar,
  Clock,
  Target,
  Bot,
  Edit3,
  Save,
  Trash2,
  Plus,
  BookOpen,
  Award,
  Star,
  Zap
} from "lucide-react";

interface TimetableSchedule {
  [day: string]: {
    time: string;
    subject: string;
    task: string;
    resources: string[];
  }[];
}

interface Timetable {
  id?: string;
  title: string;
  description: string;
  goals: string[];
  schedule: TimetableSchedule;
  is_ai_generated: boolean;
}

interface Project {
  id?: string;
  title: string;
  description: string;
  skills_used: string[];
  project_url?: string;
  github_url?: string;
  validation_status: string;
  credit_points_earned: number;
  timetable_id?: string;
}

export default function AITimetableGenerator() {
  const { user } = useAuth();
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [creditPoints, setCreditPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [manualTimetable, setManualTimetable] = useState<Timetable>({
    title: '',
    description: '',
    goals: [],
    schedule: {},
    is_ai_generated: false
  });
  const [newProject, setNewProject] = useState<Project>({
    title: '',
    description: '',
    skills_used: [],
    project_url: '',
    github_url: '',
    validation_status: 'pending',
    credit_points_earned: 0
  });
  const [editingTimetable, setEditingTimetable] = useState<string | null>(null);
  const [selectedTimetable, setSelectedTimetable] = useState<string>('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (user) {
      fetchTimetables();
      fetchProjects();
      fetchCreditPoints();
    }
  }, [user]);

  const fetchTimetables = async () => {
    const { data, error } = await supabase
      .from('timetables')
      .select('*')
      .eq('user_id', user?.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch timetables",
        variant: "destructive",
      });
    } else {
      setTimetables((data || []).map(item => ({
        ...item,
        schedule: item.schedule as TimetableSchedule
      })));
    }
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('student_projects')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } else {
      setProjects(data || []);
    }
  };

  const fetchCreditPoints = async () => {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('credit_points')
      .eq('user_id', user?.id)
      .single();

    if (error) {
      console.error('Error fetching credit points:', error);
    } else {
      setCreditPoints(data?.credit_points || 0);
    }
  };

  const generateAITimetable = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for AI generation",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-timetable', {
        body: {
          prompt: aiPrompt,
          goals: aiPrompt.toLowerCase().includes('web development') ? ['Web Development', 'JavaScript', 'React'] : 
                 aiPrompt.toLowerCase().includes('data science') ? ['Data Science', 'Python', 'Machine Learning'] :
                 ['General Study'],
          duration: '4 weeks'
        },
      });

      if (error) throw error;

      const timetableData = data.timetable;
      
      // Save to database
      const { error: saveError } = await supabase
        .from('timetables')
        .insert({
          user_id: user?.id,
          title: timetableData.title,
          description: timetableData.description,
          goals: timetableData.goals,
          schedule: timetableData.schedule,
          is_ai_generated: true
        });

      if (saveError) throw saveError;

      toast({
        title: "Success",
        description: "AI timetable generated and saved!",
      });

      setAiPrompt('');
      fetchTimetables();
    } catch (error) {
      console.error('Error generating AI timetable:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI timetable",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveManualTimetable = async () => {
    if (!manualTimetable.title || !manualTimetable.description) {
      toast({
        title: "Error",
        description: "Please fill in title and description",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('timetables')
        .insert({
          user_id: user?.id,
          title: manualTimetable.title,
          description: manualTimetable.description,
          goals: manualTimetable.goals,
          schedule: manualTimetable.schedule,
          is_ai_generated: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Manual timetable saved!",
      });

      setManualTimetable({
        title: '',
        description: '',
        goals: [],
        schedule: {},
        is_ai_generated: false
      });
      fetchTimetables();
    } catch (error) {
      console.error('Error saving manual timetable:', error);
      toast({
        title: "Error",
        description: "Failed to save timetable",
        variant: "destructive",
      });
    }
  };

  const submitProject = async () => {
    if (!newProject.title || !newProject.description) {
      toast({
        title: "Error",
        description: "Please fill in project title and description",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('student_projects')
        .insert({
          user_id: user?.id,
          title: newProject.title,
          description: newProject.description,
          skills_used: newProject.skills_used,
          project_url: newProject.project_url,
          github_url: newProject.github_url,
          timetable_id: selectedTimetable || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project submitted for validation!",
      });

      setNewProject({
        title: '',
        description: '',
        skills_used: [],
        project_url: '',
        github_url: '',
        validation_status: 'pending',
        credit_points_earned: 0
      });
      fetchProjects();
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: "Error",
        description: "Failed to submit project",
        variant: "destructive",
      });
    }
  };

  const deleteTimetable = async (id: string) => {
    try {
      const { error } = await supabase
        .from('timetables')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timetable deleted!",
      });

      fetchTimetables();
    } catch (error) {
      console.error('Error deleting timetable:', error);
      toast({
        title: "Error",
        description: "Failed to delete timetable",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Credit Points Display */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Credit Points</p>
              <p className="text-3xl font-bold text-primary">{creditPoints}</p>
            </div>
            <Award className="h-12 w-12 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ai-generator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-generator">AI Generator</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="my-timetables">My Timetables</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Timetable Generator
              </CardTitle>
              <CardDescription>
                Describe your learning goals and let AI create a personalized study timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ai-prompt">Learning Goals & Preferences</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="e.g., I want to learn web development with React and JavaScript. I prefer studying in the morning and have 2-3 hours daily..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={generateAITimetable} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-2" />
                    Generate AI Timetable
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Create Manual Timetable
              </CardTitle>
              <CardDescription>
                Create your own custom study timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manual-title">Title</Label>
                  <Input
                    id="manual-title"
                    placeholder="My Study Timetable"
                    value={manualTimetable.title}
                    onChange={(e) => setManualTimetable({...manualTimetable, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="manual-description">Description</Label>
                  <Input
                    id="manual-description"
                    placeholder="Description of your study plan"
                    value={manualTimetable.description}
                    onChange={(e) => setManualTimetable({...manualTimetable, description: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={saveManualTimetable} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Manual Timetable
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-timetables" className="space-y-4">
          <div className="grid gap-4">
            {timetables.map((timetable) => (
              <Card key={timetable.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {timetable.is_ai_generated ? <Bot className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                        {timetable.title}
                      </CardTitle>
                      <CardDescription>{timetable.description}</CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTimetable(timetable.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {timetable.goals.map((goal, index) => (
                        <Badge key={index} variant="secondary">{goal}</Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                      {days.map((day) => (
                        <div key={day} className="border rounded p-2">
                          <div className="font-medium">{day}</div>
                          {timetable.schedule[day]?.map((session, index) => (
                            <div key={index} className="text-xs text-muted-foreground">
                              {session.time}: {session.subject}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Submit New Project
              </CardTitle>
              <CardDescription>
                Submit projects to earn credit points based on validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-title">Project Title</Label>
                  <Input
                    id="project-title"
                    placeholder="My Web App"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="timetable-select">Related Timetable (Optional)</Label>
                  <Select value={selectedTimetable} onValueChange={setSelectedTimetable}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a timetable" />
                    </SelectTrigger>
                    <SelectContent>
                      {timetables.map((timetable) => (
                        <SelectItem key={timetable.id} value={timetable.id!}>
                          {timetable.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="Describe your project, what you built, and what you learned..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-url">Project URL (Optional)</Label>
                  <Input
                    id="project-url"
                    placeholder="https://myproject.com"
                    value={newProject.project_url}
                    onChange={(e) => setNewProject({...newProject, project_url: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="github-url">GitHub URL (Optional)</Label>
                  <Input
                    id="github-url"
                    placeholder="https://github.com/username/repo"
                    value={newProject.github_url}
                    onChange={(e) => setNewProject({...newProject, github_url: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={submitProject} className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Submit Project for Validation
              </Button>
            </CardContent>
          </Card>

          {/* My Projects */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">My Projects</h3>
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge 
                          variant={
                            project.validation_status === 'approved' ? 'default' :
                            project.validation_status === 'rejected' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {project.validation_status}
                        </Badge>
                        {project.credit_points_earned > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{project.credit_points_earned} points</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}