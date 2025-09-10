import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Users, Send, MessageSquare, Calendar, GraduationCap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlumniProfile {
  id: string;
  user_id: string;
  full_name: string;
  user_role: string;
  college_ref_id: string;
  created_at: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  recipient_role: string;
  created_at: string;
  is_read: boolean;
}

const AlumniManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    recipient_type: 'alumni' as 'alumni' | 'student' | 'all'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
    fetchNotifications();
  }, []);

  const fetchAlumni = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_role', 'alumni')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load alumni data", variant: "destructive" });
    } else {
      setAlumni(data || []);
    }
    setLoading(false);
  };

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('sender_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load notifications", variant: "destructive" });
    } else {
      setNotifications(data || []);
    }
  };

  const sendNotification = async () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from('notifications')
      .insert({
        sender_id: user?.id,
        title: newNotification.title,
        message: newNotification.message,
        recipient_role: newNotification.recipient_type === 'all' ? null : newNotification.recipient_type
      });

    if (error) {
      toast({ title: "Error", description: "Failed to send notification", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Notification sent successfully!" });
      setNewNotification({ title: '', message: '', recipient_type: 'alumni' });
      setIsDialogOpen(false);
      fetchNotifications();
    }
  };

  const sendPersonalMessage = async (recipientId: string, recipientName: string) => {
    const title = `Message from Admin`;
    const message = `Hello ${recipientName}, this is a personal message from the administration.`;
    
    const { error } = await supabase
      .from('notifications')
      .insert({
        sender_id: user?.id,
        recipient_id: recipientId,
        title,
        message
      });

    if (error) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Message sent to ${recipientName}!` });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading alumni data...</p>
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
              <h1 className="text-4xl font-bold text-gradient-primary mb-2">Alumni Management</h1>
              <p className="text-muted-foreground">Manage alumni database and send notifications</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                  <Send className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Send Notification</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recipients</label>
                    <select
                      className="w-full p-2 border border-input rounded-md bg-background"
                      value={newNotification.recipient_type}
                      onChange={(e) => setNewNotification({ 
                        ...newNotification, 
                        recipient_type: e.target.value as 'alumni' | 'student' | 'all'
                      })}
                    >
                      <option value="alumni">Alumni Only</option>
                      <option value="student">Students Only</option>
                      <option value="all">All Users</option>
                    </select>
                  </div>
                  <Input
                    placeholder="Notification title..."
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Notification message..."
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button onClick={sendNotification}>Send Notification</Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Alumni Database */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Alumni Database ({alumni.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>College ID</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alumni.map((alumnus) => (
                          <TableRow key={alumnus.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{alumnus.full_name}</span>
                                <Badge className="bg-primary/10 text-primary">Alumni</Badge>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {alumnus.college_ref_id}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDistanceToNow(new Date(alumnus.created_at))} ago
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => sendPersonalMessage(alumnus.user_id, alumnus.full_name)}
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Message
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {alumni.length === 0 && (
                    <div className="text-center py-8">
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No alumni registered yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sent Notifications */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="border rounded-lg p-3">
                        <h4 className="font-medium mb-2">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {notification.recipient_role || 'All Users'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at))} ago
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {notifications.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">No notifications sent yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Alumni</p>
                    <p className="text-2xl font-bold">{alumni.length}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notifications Sent</p>
                    <p className="text-2xl font-bold">{notifications.length}</p>
                  </div>
                  <Send className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Recent Registrations</p>
                    <p className="text-2xl font-bold">
                      {alumni.filter(a => 
                        new Date(a.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniManagement;