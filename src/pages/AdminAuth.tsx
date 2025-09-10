import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, ArrowLeft, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AdminAuth = () => {
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
    department: '',
    position: '',
    employeeId: ''
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
      navigate('/admin-dashboard');
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
    
    if (!isValid || userType !== 'admin') {
      toast({
        title: "Invalid Reference ID",
        description: "Please check your administrator reference ID",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary-light">
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
            <div className="p-3 bg-secondary rounded-2xl shadow-glow">
              <Settings className="h-8 w-8 text-secondary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Administrator Portal</h1>
              <p className="text-sm text-muted-foreground">Manage the platform and community</p>
            </div>
          </div>
          
          <div className="w-24" />
        </div>

        {/* Auth Form */}
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-warning/20">
            <CardHeader className="text-center">
              <div className="mx-auto p-2 bg-warning/10 rounded-full mb-2 w-fit">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <CardTitle className="text-2xl">Administrator Access</CardTitle>
              <CardDescription>
                Restricted access for authorized administrators only
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
                      <Label htmlFor="signin-email">Administrator Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="admin@college.edu"
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
                        placeholder="Dr. John Smith"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Official Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="admin@college.edu"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employee-id">Employee ID</Label>
                      <Input
                        id="employee-id"
                        type="text"
                        placeholder="EMP2024001"
                        value={signUpData.employeeId}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, employeeId: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        type="text"
                        placeholder="Student Affairs, IT Department, etc."
                        value={signUpData.department}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, department: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        type="text"
                        placeholder="Dean, Administrator, IT Manager, etc."
                        value={signUpData.position}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, position: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="college-ref">Administrator Reference ID</Label>
                      <Input
                        id="college-ref"
                        type="text"
                        placeholder="Enter admin reference ID"
                        value={signUpData.collegeRefId}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, collegeRefId: e.target.value }))}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        This secured ID is provided by college management
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
                        'Create Administrator Account'
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

export default AdminAuth;