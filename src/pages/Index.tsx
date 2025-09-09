import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, Settings, Sparkles, Target, MessageCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    // Simulate navigation after role selection
    setTimeout(() => {
      if (role === 'student') {
        navigate('/student-dashboard');
      } else if (role === 'alumni') {
        navigate('/alumni-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-primary-light">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold text-gradient-primary">AlumniConnect</h1>
            </div>
            <div className="flex-1 flex justify-end">
              {user ? (
                <Button onClick={() => signOut()} variant="outline">
                  Sign Out
                </Button>
              ) : (
                <Button onClick={() => navigate('/auth')} className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Smart alumni management and mentorship platform powered by AI. 
            Connect students with alumni, foster meaningful relationships, and accelerate career growth.
          </p>
        </header>

        {/* Role Selection */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient-primary">
            Choose Your Role
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Student Role */}
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                selectedRole === 'student' 
                  ? 'ring-2 ring-primary shadow-glow bg-primary-light' 
                  : 'hover:shadow-lg hover:-translate-y-2'
              }`}
              onClick={() => handleRoleSelect('student')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-4 bg-gradient-primary rounded-2xl mb-4 w-fit">
                  <GraduationCap className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Student</CardTitle>
                <Badge variant="secondary" className="mx-auto w-fit">
                  Seek Guidance
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Find mentors in your field</li>
                  <li>• Get AI career coaching</li>
                  <li>• Access job opportunities</li>
                  <li>• Join networking events</li>
                </ul>
              </CardContent>
            </Card>

            {/* Alumni Role */}
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                selectedRole === 'alumni' 
                  ? 'ring-2 ring-accent shadow-accent bg-accent-light' 
                  : 'hover:shadow-lg hover:-translate-y-2'
              }`}
              onClick={() => handleRoleSelect('alumni')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-4 bg-gradient-accent rounded-2xl mb-4 w-fit">
                  <Users className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">Alumni</CardTitle>
                <Badge variant="secondary" className="mx-auto w-fit">
                  Share Experience
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Mentor students</li>
                  <li>• Post job opportunities</li>
                  <li>• Host events & webinars</li>
                  <li>• Build your network</li>
                </ul>
              </CardContent>
            </Card>

            {/* Admin Role */}
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                selectedRole === 'admin' 
                  ? 'ring-2 ring-secondary shadow-lg bg-secondary-light' 
                  : 'hover:shadow-lg hover:-translate-y-2'
              }`}
              onClick={() => handleRoleSelect('admin')}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-4 bg-secondary rounded-2xl mb-4 w-fit">
                  <Settings className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Administrator</CardTitle>
                <Badge variant="secondary" className="mx-auto w-fit">
                  Manage Platform
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Oversee community</li>
                  <li>• Verify new members</li>
                  <li>• Analytics & insights</li>
                  <li>• Platform management</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {selectedRole && (
            <div className="text-center animate-bounce-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
                <span className="text-success font-medium">
                  Redirecting to {selectedRole} dashboard...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="card-hover animate-slide-in">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-accent-light rounded-xl mb-4 w-fit">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-lg">AI-Powered Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Advanced algorithms match students with perfect mentors based on goals, interests, and career paths.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-success/10 rounded-xl mb-4 w-fit">
                <Target className="h-6 w-6 text-success" />
              </div>
              <CardTitle className="text-lg">Career Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Personalized career coaching, job opportunities, and skill development recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-warning/10 rounded-xl mb-4 w-fit">
                <MessageCircle className="h-6 w-6 text-warning" />
              </div>
              <CardTitle className="text-lg">Community Building</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Foster connections through events, forums, and collaborative projects within your network.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;