import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface StartupIdeaFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const StartupIdeaForm = ({ onSuccess, onCancel }: StartupIdeaFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problemStatement: "",
    solution: "",
    targetMarket: "",
    businessModel: "",
    fundingNeeded: "",
    equityOffered: "",
    stage: "idea",
    industry: "",
    isPublic: false,
    requiresNda: true,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("startup_ideas")
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          problem_statement: formData.problemStatement,
          solution: formData.solution,
          target_market: formData.targetMarket || null,
          business_model: formData.businessModel || null,
          funding_needed: formData.fundingNeeded ? parseFloat(formData.fundingNeeded) : null,
          equity_offered: formData.equityOffered ? parseFloat(formData.equityOffered) : null,
          stage: formData.stage,
          industry: formData.industry || null,
          tags: tags.length > 0 ? tags : null,
          is_public: formData.isPublic,
          requires_nda: formData.requiresNda,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your startup idea has been shared successfully!",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to share startup idea",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Share Your Startup Idea</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Idea Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter your startup idea title"
                required
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., FinTech, HealthTech, EdTech"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Briefly describe your startup idea"
              required
            />
          </div>

          <div>
            <Label htmlFor="problemStatement">Problem Statement *</Label>
            <Textarea
              id="problemStatement"
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              placeholder="What problem does your startup solve?"
              required
            />
          </div>

          <div>
            <Label htmlFor="solution">Solution *</Label>
            <Textarea
              id="solution"
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              placeholder="How does your startup solve this problem?"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetMarket">Target Market</Label>
              <Textarea
                id="targetMarket"
                value={formData.targetMarket}
                onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                placeholder="Who is your target audience?"
                className="h-20"
              />
            </div>
            <div>
              <Label htmlFor="businessModel">Business Model</Label>
              <Textarea
                id="businessModel"
                value={formData.businessModel}
                onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                placeholder="How will you make money?"
                className="h-20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fundingNeeded">Funding Needed ($)</Label>
              <Input
                id="fundingNeeded"
                type="number"
                value={formData.fundingNeeded}
                onChange={(e) => setFormData({ ...formData, fundingNeeded: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="equityOffered">Equity Offered (%)</Label>
              <Input
                id="equityOffered"
                type="number"
                value={formData.equityOffered}
                onChange={(e) => setFormData({ ...formData, equityOffered: e.target.value })}
                placeholder="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="stage">Current Stage</Label>
              <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="prototype">Prototype</SelectItem>
                  <SelectItem value="mvp">MVP</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <X className="ml-1 h-3 w-3" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isPublic">Make Publicly Visible</Label>
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="requiresNda">Require NDA for Private Access</Label>
              <Switch
                id="requiresNda"
                checked={formData.requiresNda}
                onCheckedChange={(checked) => setFormData({ ...formData, requiresNda: checked })}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Share Idea
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};