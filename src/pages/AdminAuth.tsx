import React, { useState } from 'react';
// Make sure to uncomment the necessary imports:
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, ArrowLeft, Loader2, Shield } from 'lucide-react';

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Directly navigate to the dashboard on button click
  const handleDirectVerification = () => {
    setIsLoading(true);
    // Simulate a quick verification check
    setTimeout(() => {
      navigate('/admin-dashboard');
      // No need to set isLoading to false if we are navigating away
    }, 1000); // 1-second delay to show loading state
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

        {/* Auth Form - Simplified */}
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
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Click the button below to verify your administrative privileges and proceed to the dashboard.
                </p>
                <Button
                  onClick={handleDirectVerification}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Proceed'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;