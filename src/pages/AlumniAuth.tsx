import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AlumniAuth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, verifyCollegeRefId } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Sign In State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  
  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeRefId: '',
    graduationYear: '',
    currentCompany: '',
    jobTitle: '',
    industry: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (error) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive"
      });
    } else {
      navigate('/alumni-dashboard');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // First verify college reference ID
    setIsVerifying(true);
    const { isValid, userType } = await verifyCollegeRefId(signUpData.collegeRefId);
    setIsVerifying(false);
    
    if (!isValid || userType !== 'alumni') {
      toast({
        title: "Invalid Reference ID",
        description: "Please check your alumni reference ID",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(
      signUpData.email, 
      signUpData.password, 
      signUpData.fullName, 
      signUpData.collegeRefId
    );
    
    if (error) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-accent-light">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-accent rounded-2xl shadow-glow">
              <Users className="h-8 w-8 text-accent-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gradient-accent">Alumni Portal</h1>
              <p className="text-sm text-muted-foreground">Share your experience and mentor others</p>
            </div>
          </div>
          
          <div className="w-24" />
        </div>

        {/* Auth Form */}
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Alumni Access</CardTitle>
              <CardDescription>
                Sign in to your account or create a new alumni account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                {/* Sign In Tab */}
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="alumni@company.com"
                        value={signInData.email}
                        onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={signInData.password}
                        onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Sign Up Tab */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Jane Smith"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="alumni@company.com"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduation-year">Graduation Year</Label>
                      <Input
                        id="graduation-year"
                        type="number"
                        placeholder="2020"
                        min="1950"
                        max="2024"
                        value={signUpData.graduationYear}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, graduationYear: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current-company">Current Company</Label>
                      <Input
                        id="current-company"
                        type="text"
                        placeholder="Google, Microsoft, etc."
                        value={signUpData.currentCompany}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, currentCompany: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input
                        id="job-title"
                        type="text"
                        placeholder="Software Engineer, Product Manager, etc."
                        value={signUpData.jobTitle}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        type="text"
                        placeholder="Technology, Finance, Healthcare, etc."
                        value={signUpData.industry}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, industry: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="college-ref">College Reference ID</Label>
                      <Input
                        id="college-ref"
                        type="text"
                        placeholder="Enter your alumni reference ID"
                        value={signUpData.collegeRefId}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, collegeRefId: e.target.value }))}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        This ID is provided by your college administration
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading || isVerifying}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isVerifying ? 'Verifying Reference ID...' : 'Creating Account...'}
                        </>
                      ) : (
                        'Create Alumni Account'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlumniAuth;