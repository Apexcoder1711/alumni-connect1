import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, Users, DollarSign, Lock, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface StartupIdea {
  id: string;
  title: string;
  description: string;
  problem_statement: string;
  solution: string;
  target_market?: string;
  business_model?: string;
  funding_needed?: number;
  equity_offered?: number;
  stage: string;
  industry?: string;
  tags?: string[];
  is_public: boolean;
  requires_nda: boolean;
  view_count: number;
  created_at: string;
  user_id: string;
}

interface Profile {
  full_name: string;
  user_role: string;
}

export const StartupIdeasBrowser = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [selectedIdea, setSelectedIdea] = useState<StartupIdea | null>(null);
  const [connectionType, setConnectionType] = useState<string>("");
  const [connectionMessage, setConnectionMessage] = useState("");
  const [ndaLoading, setNdaLoading] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from("startup_ideas")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const ideas = data || [];
      setIdeas(ideas);

      // Fetch profiles for idea owners
      const userIds = [...new Set(ideas.map(idea => idea.user_id))];
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name, user_role")
          .in("user_id", userIds);

        const profilesMap = {};
        profilesData?.forEach(profile => {
          profilesMap[profile.user_id] = profile;
        });
        setProfiles(profilesMap);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load startup ideas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!user || !selectedIdea || !connectionType) return;

    try {
      const { error } = await supabase
        .from("startup_connections")
        .insert({
          startup_idea_id: selectedIdea.id,
          user_id: user.id,
          connection_type: connectionType,
          message: connectionMessage || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your interest has been sent to the idea owner!",
      });
      setSelectedIdea(null);
      setConnectionType("");
      setConnectionMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request",
        variant: "destructive",
      });
    }
  };

  const requestNdaAccess = async (ideaId: string) => {
    if (!user) return;

    setNdaLoading(true);
    try {
      const idea = ideas.find(i => i.id === ideaId);
      if (!idea) return;

      const { error } = await supabase
        .from("nda_agreements")
        .insert({
          startup_idea_id: ideaId,
          requester_id: user.id,
          owner_id: idea.user_id,
        });

      if (error) throw error;

      toast({
        title: "NDA Request Sent",
        description: "The idea owner will review your NDA request.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to request NDA access",
        variant: "destructive",
      });
    } finally {
      setNdaLoading(false);
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === "all" || idea.stage === stageFilter;
    const matchesIndustry = industryFilter === "all" || idea.industry === industryFilter;
    return matchesSearch && matchesStage && matchesIndustry;
  });

  const uniqueIndustries = [...new Set(ideas.map(idea => idea.industry).filter(Boolean))];

  if (loading) {
    return <div>Loading startup ideas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas, industries, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="prototype">Prototype</SelectItem>
              <SelectItem value="mvp">MVP</SelectItem>
              <SelectItem value="growth">Growth</SelectItem>
            </SelectContent>
          </Select>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {uniqueIndustries.map(industry => (
                <SelectItem key={industry} value={industry!}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => {
          const profile = profiles[idea.user_id];
          const canViewDetails = idea.is_public || idea.user_id === user?.id;
          
          return (
            <Card key={idea.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  {!idea.is_public && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>by {profile?.full_name || "Anonymous"}</span>
                  <Badge variant="outline" className="text-xs">
                    {profile?.user_role || "user"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {idea.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {idea.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {idea.tags && idea.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{idea.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{idea.view_count}</span>
                    </div>
                    <Badge variant="outline">{idea.stage}</Badge>
                  </div>
                  {idea.industry && (
                    <span className="text-muted-foreground">{idea.industry}</span>
                  )}
                </div>

                {canViewDetails ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{idea.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Problem Statement</h4>
                          <p className="text-sm">{idea.problem_statement}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Solution</h4>
                          <p className="text-sm">{idea.solution}</p>
                        </div>
                        {idea.target_market && (
                          <div>
                            <h4 className="font-semibold mb-2">Target Market</h4>
                            <p className="text-sm">{idea.target_market}</p>
                          </div>
                        )}
                        {idea.business_model && (
                          <div>
                            <h4 className="font-semibold mb-2">Business Model</h4>
                            <p className="text-sm">{idea.business_model}</p>
                          </div>
                        )}
                        {(idea.funding_needed || idea.equity_offered) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {idea.funding_needed && (
                              <div>
                                <h4 className="font-semibold mb-2">Funding Needed</h4>
                                <p className="text-sm">${idea.funding_needed.toLocaleString()}</p>
                              </div>
                            )}
                            {idea.equity_offered && (
                              <div>
                                <h4 className="font-semibold mb-2">Equity Offered</h4>
                                <p className="text-sm">{idea.equity_offered}%</p>
                              </div>
                            )}
                          </div>
                        )}
                        {idea.user_id !== user?.id && (
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Connect with this Idea</h4>
                            <div className="space-y-3">
                              <div>
                                <Label>I'm interested as a:</Label>
                                <Select value={connectionType} onValueChange={setConnectionType}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="investor">Investor</SelectItem>
                                    <SelectItem value="partner">Partner</SelectItem>
                                    <SelectItem value="intern">Intern</SelectItem>
                                    <SelectItem value="mentor">Mentor</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Message (optional)</Label>
                                <Textarea
                                  value={connectionMessage}
                                  onChange={(e) => setConnectionMessage(e.target.value)}
                                  placeholder="Tell them why you're interested..."
                                />
                              </div>
                              <Button 
                                onClick={() => {
                                  setSelectedIdea(idea);
                                  handleConnect();
                                }}
                                disabled={!connectionType}
                                className="w-full"
                              >
                                Send Interest
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    onClick={() => requestNdaAccess(idea.id)}
                    disabled={ndaLoading}
                    className="w-full"
                    variant="outline"
                  >
                    Request NDA Access
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No startup ideas found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};