import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, User, Clock, Eye, Award, Trash2, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  view_count: number;
  created_at: string;
  profiles: {
    full_name: string;
    user_role: string;
  };
  answers: Answer[];
}

interface Answer {
  id: string;
  content: string;
  is_best_answer: boolean;
  created_at: string;
  profiles: {
    full_name: string;
    user_role: string;
  };
}

interface Profile {
  user_role: string;
}

const Forum = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', tags: '' });
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchQuestions();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', user?.id)
      .single();
    setProfile(data);
  };

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load questions", variant: "destructive" });
    } else {
      // Fetch profiles and answers separately to avoid relation issues
      const questionsWithData = await Promise.all(
        (data || []).map(async (question) => {
          // Fetch question author profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, user_role')
            .eq('user_id', question.user_id)
            .single();

          // Fetch answers with their profiles
          const { data: answers } = await supabase
            .from('answers')
            .select('*')
            .eq('question_id', question.id)
            .eq('is_active', true);

          const answersWithProfiles = await Promise.all(
            (answers || []).map(async (answer) => {
              const { data: answerProfile } = await supabase
                .from('profiles')
                .select('full_name, user_role')
                .eq('user_id', answer.user_id)
                .single();
              
              return {
                ...answer,
                profiles: answerProfile || { full_name: 'Unknown', user_role: 'student' }
              };
            })
          );
          
          return {
            ...question,
            profiles: profile || { full_name: 'Unknown', user_role: 'student' },
            answers: answersWithProfiles
          };
        })
      );
      setQuestions(questionsWithData);
    }
    setLoading(false);
  };

  const createQuestion = async () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from('questions')
      .insert({
        user_id: user?.id,
        title: newQuestion.title,
        content: newQuestion.content,
        tags: newQuestion.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });

    if (error) {
      toast({ title: "Error", description: "Failed to create question", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Question created successfully!" });
      setNewQuestion({ title: '', content: '', tags: '' });
      setShowNewQuestion(false);
      fetchQuestions();
    }
  };

  const createAnswer = async () => {
    if (!newAnswer.trim() || !selectedQuestion) return;

    const { error } = await supabase
      .from('answers')
      .insert({
        question_id: selectedQuestion.id,
        user_id: user?.id,
        content: newAnswer
      });

    if (error) {
      toast({ title: "Error", description: "Failed to post answer", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Answer posted successfully!" });
      setNewAnswer('');
      fetchQuestions();
      // Update selected question
      const updatedQuestion = questions.find(q => q.id === selectedQuestion.id);
      if (updatedQuestion) {
        setSelectedQuestion(updatedQuestion);
      }
    }
  };

  const markAsBestAnswer = async (answerId: string) => {
    const { error } = await supabase
      .from('answers')
      .update({ is_best_answer: true })
      .eq('id', answerId);

    if (error) {
      toast({ title: "Error", description: "Failed to mark as best answer", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Marked as best answer!" });
      fetchQuestions();
    }
  };

  const removeContent = async (type: 'question' | 'answer', id: string) => {
    const table = type === 'question' ? 'questions' : 'answers';
    const { error } = await supabase
      .from(table)
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: `Failed to remove ${type}`, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `${type} removed successfully!` });
      fetchQuestions();
      if (type === 'question') {
        setSelectedQuestion(null);
      }
    }
  };

  const incrementViewCount = async (questionId: string) => {
    const { error } = await supabase.rpc('increment_view_count', { question_id: questionId });
    if (error) console.error('Error incrementing view count:', error);
  };

  const selectQuestion = (question: Question) => {
    setSelectedQuestion(question);
    incrementViewCount(question.id);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive text-destructive-foreground';
      case 'alumni': return 'bg-primary text-primary-foreground';
      case 'student': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading forum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-primary-light">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gradient-primary mb-2">Q&A Forum</h1>
              <p className="text-muted-foreground">Ask questions, share knowledge, and learn together</p>
            </div>
            {profile?.user_role === 'student' && (
              <Button 
                onClick={() => setShowNewQuestion(true)}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Questions List */}
            <div className="lg:col-span-2 space-y-4">
              {showNewQuestion && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Ask a New Question</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Question title..."
                      value={newQuestion.title}
                      onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Describe your question in detail..."
                      value={newQuestion.content}
                      onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                      rows={4}
                    />
                    <Input
                      placeholder="Tags (comma-separated)"
                      value={newQuestion.tags}
                      onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button onClick={createQuestion}>Post Question</Button>
                      <Button variant="outline" onClick={() => setShowNewQuestion(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {questions.map((question) => (
                <Card 
                  key={question.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedQuestion?.id === question.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => selectQuestion(question)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold line-clamp-2">{question.title}</h3>
                      {profile?.user_role === 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeContent('question', question.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">{question.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{question.profiles?.full_name}</span>
                          <Badge className={getRoleBadgeColor(question.profiles?.user_role)}>
                            {question.profiles?.user_role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDistanceToNow(new Date(question.created_at))} ago</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{question.view_count}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {question.answers?.length || 0} answers
                        </span>
                        {question.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Question Detail */}
            <div className="lg:col-span-1">
              {selectedQuestion ? (
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-xl">{selectedQuestion.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="mb-4">{selectedQuestion.content}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{selectedQuestion.profiles?.full_name}</span>
                        <Badge className={getRoleBadgeColor(selectedQuestion.profiles?.user_role)}>
                          {selectedQuestion.profiles?.user_role}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-4">
                        Answers ({selectedQuestion.answers?.length || 0})
                      </h4>
                      
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {selectedQuestion.answers?.map((answer) => (
                          <div key={answer.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {answer.is_best_answer && (
                                  <Award className="w-4 h-4 text-warning" />
                                )}
                                <Badge className={getRoleBadgeColor(answer.profiles?.user_role)}>
                                  {answer.profiles?.user_role}
                                </Badge>
                              </div>
                              {profile?.user_role === 'admin' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeContent('answer', answer.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                            <p className="mb-2">{answer.content}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                by {answer.profiles?.full_name} • {formatDistanceToNow(new Date(answer.created_at))} ago
                              </span>
                              {!answer.is_best_answer && 
                               (profile?.user_role === 'admin' || selectedQuestion.profiles?.user_role === profile?.user_role) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => markAsBestAnswer(answer.id)}
                                >
                                  <Award className="w-4 h-4 mr-1" />
                                  Best Answer
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {(profile?.user_role === 'alumni' || profile?.user_role === 'admin') && (
                        <div className="mt-4">
                          <Textarea
                            placeholder="Write your answer..."
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            rows={3}
                          />
                          <Button onClick={createAnswer} className="mt-2" size="sm">
                            Post Answer
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="sticky top-4">
                  <CardContent className="pt-6 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Select a question to view details and answers</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;