import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { signUp, signIn, verifyCollegeRefId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verifyingRefId, setVerifyingRefId] = useState(false);
  const [refIdStatus, setRefIdStatus] = useState<{ isValid: boolean; userType: string | null } | null>(null);

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    collegeRefId: ''
  });

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const handleVerifyRefId = async () => {
    if (!signUpData.collegeRefId.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a college reference ID"
      });
      return;
    }

    setVerifyingRefId(true);
    try {
      const result = await verifyCollegeRefId(signUpData.collegeRefId);
      setRefIdStatus(result);
      
      if (!result.isValid) {
        toast({
          variant: "destructive",
          title: "Invalid Reference ID",
          description: "The college reference ID is invalid or already used"
        });
      } else {
        toast({
          title: "Valid Reference ID",
          description: `Reference ID verified for ${result.userType}`
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify reference ID"
      });
    } finally {
      setVerifyingRefId(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!refIdStatus?.isValid) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please verify your college reference ID first"
      });
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(
        signUpData.email,
        signUpData.password,
        signUpData.fullName,
        signUpData.collegeRefId
      );

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: error.message
        });
      } else {
        toast({
          title: "Sign Up Successful",
          description: "Please check your email to verify your account"
        });
        
        // Redirect based on user type
        const dashboardPath = `/${refIdStatus.userType}-dashboard`;
        navigate(dashboardPath);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(signInData.email, signInData.password);

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: error.message
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in"
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AlumniConnect</h1>
          <p className="text-muted-foreground">Connect with your alma mater</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@college.edu"
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
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create your account with college reference ID verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="college-ref-id">College Reference ID</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="college-ref-id"
                        placeholder="Enter your reference ID (e.g., STU001, ALM001, ADM001)"
                        value={signUpData.collegeRefId}
                        onChange={(e) => {
                          setSignUpData(prev => ({ ...prev, collegeRefId: e.target.value }));
                          setRefIdStatus(null);
                        }}
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleVerifyRefId}
                        disabled={verifyingRefId}
                      >
                        {verifyingRefId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Verify'
                        )}
                      </Button>
                    </div>
                    {refIdStatus && (
                      <div className={`flex items-center space-x-2 text-sm ${refIdStatus.isValid ? 'text-green-600' : 'text-red-600'}`}>
                        {refIdStatus.isValid ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Valid {refIdStatus.userType} reference ID</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span>Invalid reference ID</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      placeholder="Your full name"
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
                      placeholder="your.email@college.edu"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
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

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || !refIdStatus?.isValid}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}