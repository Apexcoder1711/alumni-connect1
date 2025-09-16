import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, Settings, Sparkles, Target, MessageCircle, BookOpen, ArrowRight, Zap, Network, TrendingUp } from 'lucide-react';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setTimeout(() => {
      if (role === 'student') {
        navigate('/student-auth');
      } else if (role === 'alumni') {
        navigate('/alumni-auth');
      } else if (role === 'admin') {
        navigate('/admin-auth');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">AlumniConnect</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">About</Button>
              <Button variant="ghost" size="sm">Features</Button>
              <Button variant="outline" size="sm">Sign In</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Connect. Learn. 
              <span className="text-primary"> Grow.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              The smart way to connect students with alumni. Get mentorship, career guidance, 
              and real opportunities through our AI-powered matching system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Role Selection */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Journey
            </h2>
            <p className="text-muted-foreground text-lg">
              Select your role to access personalized features and content
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Student */}
            <div 
              className={`group cursor-pointer transition-all duration-300 ${
                selectedRole === 'student' 
                  ? 'scale-105' 
                  : 'hover:scale-105'
              }`}
              onClick={() => handleRoleSelect('student')}
            >
              <Card className="relative overflow-hidden border-2 border-transparent group-hover:border-primary/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="text-center pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <GraduationCap className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Student</CardTitle>
                  <Badge variant="secondary" className="mx-auto">Seeker</Badge>
                </CardHeader>
                <CardContent className="pb-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Get personalized mentorship</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Access career opportunities</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Join discussion forums</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>AI-powered guidance</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alumni */}
            <div 
              className={`group cursor-pointer transition-all duration-300 ${
                selectedRole === 'alumni' 
                  ? 'scale-105' 
                  : 'hover:scale-105'
              }`}
              onClick={() => handleRoleSelect('alumni')}
            >
              <Card className="relative overflow-hidden border-2 border-transparent group-hover:border-accent/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="text-center pt-8 pb-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                    <Users className="h-8 w-8 text-accent group-hover:text-accent-foreground" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Alumni</CardTitle>
                  <Badge variant="secondary" className="mx-auto">Mentor</Badge>
                </CardHeader>
                <CardContent className="pb-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>Share your expertise</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>Post job opportunities</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>Host events & webinars</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>Build your network</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin */}
            <div 
              className={`group cursor-pointer transition-all duration-300 ${
                selectedRole === 'admin' 
                  ? 'scale-105' 
                  : 'hover:scale-105'
              }`}
              onClick={() => handleRoleSelect('admin')}
            >
              <Card className="relative overflow-hidden border-2 border-transparent group-hover:border-secondary/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="text-center pt-8 pb-6">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                    <Settings className="h-8 w-8 text-secondary group-hover:text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Admin</CardTitle>
                  <Badge variant="secondary" className="mx-auto">Manager</Badge>
                </CardHeader>
                <CardContent className="pb-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      <span>Manage platform users</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      <span>Moderate content</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      <span>Analytics & insights</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      <span>System configuration</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {selectedRole && (
            <div className="text-center mt-8 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-success/10 rounded-full border border-success/20">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <span className="text-success font-medium text-lg">
                  Redirecting to {selectedRole} portal...
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build meaningful connections and accelerate growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Sparkles className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI algorithms match students with the perfect mentors based on goals, 
                  skills, and career aspirations.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <Network className="h-6 w-6 text-accent group-hover:text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">Global Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with alumni worldwide and build a professional network 
                  that spans across industries and geographies.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                  <TrendingUp className="h-6 w-6 text-secondary group-hover:text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Career Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access exclusive job opportunities, skill development resources, 
                  and personalized career guidance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students and alumni already growing their careers through AlumniConnect.
            </p>
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border/50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">AlumniConnect</span>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-4">
            © 2024 AlumniConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;