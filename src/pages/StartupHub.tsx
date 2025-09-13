import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StartupIdeaForm } from "@/components/StartupIdeaForm";
import { StartupIdeasBrowser } from "@/components/StartupIdeasBrowser";
import { Lightbulb, Users, Shield, TrendingUp, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const StartupHub = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="max-w-6xl mx-auto">
          <StartupIdeaForm
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lightbulb className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Startup Innovation Hub
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Share your innovative ideas with investors, find partners, and connect with interns. 
            Our NDA protection system ensures your intellectual property stays secure.
          </p>
          <Button onClick={() => setShowForm(true)} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Share Your Idea
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>IP Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced NDA system and private sharing options protect your intellectual property from theft.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Find Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with investors, co-founders, interns, and mentors who share your vision.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Scale Your Idea</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get the funding, talent, and guidance you need to turn your idea into a successful business.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Ideas</TabsTrigger>
            <TabsTrigger value="my-ideas">My Ideas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-6">
            <StartupIdeasBrowser />
          </TabsContent>
          
          <TabsContent value="my-ideas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Startup Ideas</CardTitle>
                <CardDescription>
                  Manage your shared ideas and track connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* TODO: Add component to show user's own ideas */}
                <p className="text-muted-foreground">Coming soon: View and manage your shared ideas</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};