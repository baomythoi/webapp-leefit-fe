import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Camera, TrendingUp, Calendar, Upload, Target } from 'lucide-react';
import { useAPI } from '@/hooks/useAPI';
import { progressAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { type Language } from '@/components/LanguageToggle';
import { translations } from '@/translations';

interface ProgressViewProps {
  language: Language;
}

export function ProgressView({ language }: ProgressViewProps) {
  const { toast } = useToast();
  const t = translations[language];
  
  const { data: progressData, loading, error, refetch } = useAPI(progressAPI.getUserProgress);

  const handleUploadProgress = async () => {
    try {
      const newProgress = {
        date: new Date().toISOString(),
        weight: 72,
        body_fat: 16,
        muscle_mass: 58,
        photos: [], // This would be handled with file upload
        notes: language === 'vi' ? 'Cập nhật tiến trình' : 'Progress update'
      };
      
      const { error } = await progressAPI.uploadProgress(newProgress);
      if (error) throw new Error(error);
      
      toast({
        title: language === 'vi' ? 'Thành công!' : 'Success!',
        description: language === 'vi' ? 'Đã cập nhật tiến trình' : 'Progress updated successfully',
      });
      
      refetch();
    } catch (error) {
      toast({
        title: language === 'vi' ? 'Lỗi' : 'Error',
        description: language === 'vi' ? 'Không thể cập nhật tiến trình' : 'Failed to update progress',
        variant: 'destructive',
      });
    }
  };

  // Sample progress data
  const sampleProgress = {
    currentWeight: 72,
    startWeight: 80,
    targetWeight: 68,
    currentBodyFat: 16,
    startBodyFat: 22,
    targetBodyFat: 12,
    muscleMass: 58,
    weeklyChange: -0.5,
    totalWeeksProgress: 12,
    targetWeeks: 16,
    achievements: [
      { name: language === 'vi' ? '5kg đầu tiên' : 'First 5kg Lost', date: '2024-01-15', completed: true },
      { name: language === 'vi' ? '10% mỡ cơ thể' : '10% Body Fat', date: '2024-02-01', completed: false },
      { name: language === 'vi' ? 'Mục tiêu cuối cùng' : 'Final Goal', date: '2024-03-15', completed: false }
    ],
    recentEntries: [
      { date: '2024-01-20', weight: 72, bodyFat: 16, notes: 'Feeling stronger' },
      { date: '2024-01-13', weight: 72.5, bodyFat: 16.5, notes: 'Good week' },
      { date: '2024-01-06', weight: 73, bodyFat: 17, notes: 'New year progress' }
    ]
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t.progress}</h1>
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
        <h1 className="text-3xl font-bold">{t.progress}</h1>
        <Button onClick={handleUploadProgress} variant="fitness">
          <Upload className="h-4 w-4 mr-2" />
          {language === 'vi' ? 'Cập nhật tiến trình' : 'Update Progress'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{t.currentWeight}</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold">{sampleProgress.currentWeight} kg</div>
            <div className="text-sm text-muted-foreground">
              {language === 'vi' ? 'Bắt đầu' : 'Started'}: {sampleProgress.startWeight} kg
            </div>
            <div className="text-sm text-primary">
              {sampleProgress.weeklyChange > 0 ? '+' : ''}{sampleProgress.weeklyChange} kg {language === 'vi' ? 'tuần này' : 'this week'}
            </div>
            <Progress 
              value={((sampleProgress.startWeight - sampleProgress.currentWeight) / (sampleProgress.startWeight - sampleProgress.targetWeight)) * 100} 
              className="mt-2"
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{t.bodyFat}</h3>
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold">{sampleProgress.currentBodyFat}%</div>
            <div className="text-sm text-muted-foreground">
              {language === 'vi' ? 'Bắt đầu' : 'Started'}: {sampleProgress.startBodyFat}%
            </div>
            <div className="text-sm text-primary">
              -{sampleProgress.startBodyFat - sampleProgress.currentBodyFat}% {language === 'vi' ? 'đã giảm' : 'reduced'}
            </div>
            <Progress 
              value={((sampleProgress.startBodyFat - sampleProgress.currentBodyFat) / (sampleProgress.startBodyFat - sampleProgress.targetBodyFat)) * 100} 
              className="mt-2"
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{language === 'vi' ? 'Khối lượng cơ' : 'Muscle Mass'}</h3>
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold">{sampleProgress.muscleMass} kg</div>
            <div className="text-sm text-muted-foreground">
              {language === 'vi' ? 'Tuần' : 'Week'} {sampleProgress.totalWeeksProgress}/{sampleProgress.targetWeeks}
            </div>
            <div className="text-sm text-primary">
              +{sampleProgress.muscleMass - 55} kg {language === 'vi' ? 'tăng' : 'gained'}
            </div>
            <Progress 
              value={(sampleProgress.totalWeeksProgress / sampleProgress.targetWeeks) * 100} 
              className="mt-2"
            />
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {language === 'vi' ? 'Thành tích' : 'Achievements'}
        </h3>
        <div className="grid gap-4">
          {sampleProgress.achievements.map((achievement, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${achievement.completed ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                <div>
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-sm text-muted-foreground">{achievement.date}</div>
                </div>
              </div>
              <Badge variant={achievement.completed ? 'default' : 'outline'}>
                {achievement.completed ? 
                  (language === 'vi' ? 'Hoàn thành' : 'Completed') : 
                  (language === 'vi' ? 'Đang thực hiện' : 'In Progress')
                }
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Entries */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {language === 'vi' ? 'Ghi chép gần đây' : 'Recent Entries'}
          </h3>
          <Button variant="outline" size="sm">
            <Camera className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Thêm ảnh' : 'Add Photo'}
          </Button>
        </div>
        <div className="space-y-4">
          {sampleProgress.recentEntries.map((entry, index) => (
            <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <div className="font-medium">{new Date(entry.date).toLocaleDateString()}</div>
                <div className="text-sm text-muted-foreground">
                  {entry.weight}kg • {entry.bodyFat}% {language === 'vi' ? 'mỡ cơ thể' : 'body fat'}
                </div>
                {entry.notes && (
                  <div className="text-sm text-muted-foreground italic">{entry.notes}</div>
                )}
              </div>
              <Button variant="outline" size="sm">
                {language === 'vi' ? 'Xem chi tiết' : 'View Details'}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}