import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, Video, Plus, Edit, Trash2 } from 'lucide-react';
import { useAPI } from '@/hooks/useAPI';
import { sessionsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { type Language } from '@/components/LanguageToggle';
import { translations } from '@/translations';
import { cn } from '@/lib/utils';

interface ScheduleViewProps {
  language: Language;
}

export function ScheduleView({ language }: ScheduleViewProps) {
  const { toast } = useToast();
  const t = translations[language];
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { data: sessions, loading, error, refetch } = useAPI(sessionsAPI.getTrainingSessions);

  // Mock weekly schedule data
  const weekSchedule = [
    { day: 'T2', name: 'Ngực + Vai', duration: 60, status: 'completed' },
    { day: 'T3', name: 'Chân + Mông', duration: 45, status: 'completed' },
    { day: 'T4', name: 'Nghỉ ngơi', duration: null, status: 'rest' },
    { day: 'T5', name: 'Lưng + Tay sau', duration: 50, status: 'active' },
    { day: 'T6', name: 'Tay trước + Bụng', duration: 40, status: 'scheduled' },
    { day: 'T7', name: 'Cardio', duration: 30, status: 'scheduled' },
    { day: 'CN', name: 'Nghỉ ngơi', duration: null, status: 'rest' }
  ];

  const todayWorkout = weekSchedule.find(w => w.status === 'active');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const toggleDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const newSelected = new Set(selectedDates);
    
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr);
    } else {
      newSelected.add(dateStr);
    }
    setSelectedDates(newSelected);
  };

  const monthNames = language === 'vi' 
    ? ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Edit className="h-4 w-4 mr-2" />
              {t.editSchedule}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {language === 'vi' ? 'Chỉnh sửa lịch tập' : 'Edit Schedule'}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentDate(newDate);
                  }}
                >
                  ‹
                </Button>
                <h3 className="text-lg font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentDate(newDate);
                  }}
                >
                  ›
                </Button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {(language === 'vi' ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const dateStr = date.toISOString().split('T')[0];
                  const isSelected = selectedDates.has(dateStr);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => isCurrentMonth && toggleDate(date)}
                      disabled={!isCurrentMonth}
                      className={cn(
                        "p-2 text-sm rounded hover:bg-muted transition-colors",
                        !isCurrentMonth && "text-muted-foreground opacity-30",
                        isCurrentMonth && "cursor-pointer",
                        isSelected && isCurrentMonth && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          {language === 'vi' ? 'Lịch tập tuần này' : 'This week\'s schedule'}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {weekSchedule.map((workout, index) => (
            <Card key={index} className={cn(
              "p-4 text-center transition-all",
              workout.status === 'active' && "bg-primary text-primary-foreground",
              workout.status === 'completed' && "bg-muted",
              workout.status === 'rest' && "bg-muted"
            )}>
              <div className="font-semibold mb-2">{workout.day}</div>
              <div className="text-sm font-medium mb-1">{workout.name}</div>
              {workout.duration && (
                <div className="text-xs opacity-80">{workout.duration} phút</div>
              )}
              {workout.status === 'completed' && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  {t.completed}
                </Badge>
              )}
              {workout.status === 'rest' && (
                <div className="text-xs opacity-60 mt-2">
                  {language === 'vi' ? 'Hồi phục' : 'Recovery'}
                </div>
              )}
              {workout.status === 'active' && (
                <Button variant="secondary" size="sm" className="mt-2 text-xs bg-white/20 hover:bg-white/30 text-white">
                  {language === 'vi' ? 'Bắt đầu tập' : 'Start Workout'}
                </Button>
              )}
            </Card>
          ))}
        </div>

        {todayWorkout && (
          <Card className="p-6 bg-muted">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                {language === 'vi' ? `Buổi tập hôm nay: ${todayWorkout.name}` : `Today's workout: ${todayWorkout.name}`}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === 'vi' 
                  ? 'Buổi tập sẽ diễn ra qua video call với HLV cá nhân của bạn'
                  : 'The session will be conducted via video call with your personal trainer'
                }
              </p>
              <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Video className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Tham gia buổi tập' : 'Join the session'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}