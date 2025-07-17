import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Video, Plus, Edit, Trash2 } from 'lucide-react';
import { useAPI } from '@/hooks/useAPI';
import { sessionsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { type Language } from '@/components/LanguageToggle';
import { translations } from '@/translations';

interface ScheduleViewProps {
  language: Language;
}

export function ScheduleView({ language }: ScheduleViewProps) {
  const { toast } = useToast();
  const t = translations[language];
  
  const { data: sessions, loading, error, refetch } = useAPI(sessionsAPI.getTrainingSessions);
  
  const handleCreateSession = async () => {
    try {
      const newSession = {
        name: language === 'vi' ? 'Buổi tập mới' : 'New Session',
        date: new Date().toISOString(),
        duration: 60,
        trainer_id: '1',
        status: 'scheduled'
      };
      
      const { error } = await sessionsAPI.createSession(newSession);
      if (error) throw new Error(error);
      
      toast({
        title: language === 'vi' ? 'Thành công!' : 'Success!',
        description: language === 'vi' ? 'Đã tạo buổi tập mới' : 'New session created',
      });
      
      refetch();
    } catch (error) {
      toast({
        title: language === 'vi' ? 'Lỗi' : 'Error',
        description: language === 'vi' ? 'Không thể tạo buổi tập' : 'Failed to create session',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const { error } = await sessionsAPI.deleteSession(sessionId);
      if (error) throw new Error(error);
      
      toast({
        title: language === 'vi' ? 'Đã xóa' : 'Deleted',
        description: language === 'vi' ? 'Buổi tập đã được hủy' : 'Session has been cancelled',
      });
      
      refetch();
    } catch (error) {
      toast({
        title: language === 'vi' ? 'Lỗi' : 'Error',
        description: language === 'vi' ? 'Không thể hủy buổi tập' : 'Failed to cancel session',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t.schedule}</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t.schedule}</h1>
        <Button onClick={handleCreateSession} variant="fitness">
          <Plus className="h-4 w-4 mr-2" />
          {language === 'vi' ? 'Đặt lịch mới' : 'New Session'}
        </Button>
      </div>

      <div className="grid gap-4">
        {sessions && Array.isArray(sessions) && sessions.map((session: any) => (
          <Card key={session.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="font-semibold text-lg">{session.name}</h3>
                  <Badge variant={session.status === 'completed' ? 'default' : 'outline'}>
                    {session.status === 'completed' ? t.completed : 
                     session.status === 'scheduled' ? 
                     (language === 'vi' ? 'Đã lên lịch' : 'Scheduled') : 
                     (language === 'vi' ? 'Đang diễn ra' : 'In Progress')}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{session.duration} {language === 'vi' ? 'phút' : 'minutes'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{session.trainer_name || 'John Doe'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  {language === 'vi' ? 'Tham gia' : 'Join'}
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteSession(session.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {(!sessions || !Array.isArray(sessions) || sessions.length === 0) && (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              {language === 'vi' ? 'Chưa có lịch tập' : 'No sessions scheduled'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === 'vi' ? 'Hãy đặt lịch buổi tập đầu tiên của bạn' : 'Schedule your first training session'}
            </p>
            <Button onClick={handleCreateSession} variant="fitness">
              <Plus className="h-4 w-4 mr-2" />
              {language === 'vi' ? 'Đặt lịch ngay' : 'Schedule Now'}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}