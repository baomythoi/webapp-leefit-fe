import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Upload, Check } from 'lucide-react';
type Language = 'vi' | 'en';

interface UserProfileProps {
  language: Language;
}

// Fallback data when API is not available
const fallbackUserData = {
  full_name: "Nguyễn Văn A",
  age: 28,
  height_cm: 175,
  weight_kg: 75,
  timezone: "Asia/Ho_Chi_Minh",
  avatar_url: "/placeholder/avatar.jpg",
  milestones: [
    { id: "T1", month: "Tháng 1/2023", goal: "Giảm 2kg, tăng sức bền" },
    { id: "T2", month: "Tháng 2/2023", goal: "Tăng cơ ngực, vai" },
    { id: "T3", month: "Tháng 3/2023", goal: "Giảm mỡ bụng 3%" },
    { id: "T4", month: "Tháng 4/2023", goal: "Đang tiến hành..." }
  ],
  package: {
    name: "Gói Premium 6 tháng",
    start_date: "01/01/2023",
    end_date: "30/06/2023",
    progress: 67,
    status: "Đang hoạt động",
    benefits: [
      "Tư vấn dinh dưỡng cá nhân",
      "Giáo án tập luyện riêng", 
      "Hỗ trợ 24/7 qua chat",
      "Theo dõi tiến độ chi tiết"
    ]
  }
};

const timezones = [
  { value: "Asia/Ho_Chi_Minh", label: "(GMT+7) Hà Nội, Bangkok" },
  { value: "America/New_York", label: "(GMT-5) New York" },
  { value: "Europe/London", label: "(GMT+0) London" },
  { value: "Asia/Tokyo", label: "(GMT+9) Tokyo" },
  { value: "Australia/Sydney", label: "(GMT+10) Sydney" },
  { value: "America/Los_Angeles", label: "(GMT-8) Los Angeles" },
];

export function UserProfile({ language }: UserProfileProps) {
  const [userData, setUserData] = useState(fallbackUserData);
  const [currentWeight, setCurrentWeight] = useState(userData.weight_kg);
  const [selectedTimezone, setSelectedTimezone] = useState(userData.timezone);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleWeightChange = (increment: boolean) => {
    setCurrentWeight(prev => increment ? prev + 1 : Math.max(1, prev - 1));
  };

  const handleWeightUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5678/webhook-weight-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: "123",
          new_weight: currentWeight
        })
      });

      if (response.ok) {
        setUserData(prev => ({ ...prev, weight_kg: currentWeight }));
        toast({ title: "Cập nhật cân nặng thành công" });
      } else {
        toast({ title: "Cập nhật thất bại", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Cập nhật thất bại", variant: "destructive" });
    }
  };

  const handleTimezoneUpdate = async (timezone: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/123`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timezone })
      });

      if (response.ok) {
        setSelectedTimezone(timezone);
        setUserData(prev => ({ ...prev, timezone }));
        toast({ title: "Cập nhật múi giờ thành công" });
      }
    } catch (error) {
      toast({ title: "Cập nhật múi giờ thất bại", variant: "destructive" });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/users/123/avatar', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setUserData(prev => ({ ...prev, avatar_url: result.avatar_url }));
        setAvatarDialogOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        toast({ title: "Cập nhật ảnh đại diện thành công" });
      }
    } catch (error) {
      toast({ title: "Cập nhật ảnh đại diện thất bại", variant: "destructive" });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Thông Tin Cá Nhân</h1>
        <div className="w-12 h-1 bg-primary rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Overview */}
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
              <DialogTrigger asChild>
                <div className="relative cursor-pointer group">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userData.avatar_url} alt="Avatar" />
                    <AvatarFallback className="text-lg">
                      {userData.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={previewUrl || userData.avatar_url} alt="Preview" />
                      <AvatarFallback>Preview</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleFileSelect}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAvatarUpload} disabled={!selectedFile} className="flex-1">
                      Lưu ảnh
                    </Button>
                    <Button variant="outline" onClick={() => setAvatarDialogOpen(false)} className="flex-1">
                      Hủy
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">{userData.full_name}</h2>
              <p className="text-muted-foreground">{userData.age} tuổi</p>
              <p className="text-muted-foreground">{userData.height_cm} cm</p>
            </div>

            <div className="w-full space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Cân nặng hiện tại</p>
                <div className="flex items-center justify-center space-x-2">
                  <Input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(Number(e.target.value) || 0)}
                    className="w-20 text-center text-lg font-bold"
                    min="1"
                    max="300"
                  />
                  <span className="text-lg font-medium text-muted-foreground">kg</span>
                </div>
                <Button 
                  onClick={handleWeightUpdate}
                  className="mt-3 w-full"
                  size="sm"
                >
                  Cập nhật
                </Button>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Múi giờ</label>
                <Select value={selectedTimezone} onValueChange={handleTimezoneUpdate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map(tz => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Training Milestones */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Cột Mốc Tập Luyện</h3>
          <div className="space-y-4">
            {userData.milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">{milestone.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{milestone.month}</p>
                  <p className="text-sm text-muted-foreground">{milestone.goal}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Training Package */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Gói Tập</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">{userData.package.name}</h4>
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {userData.package.status}
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Ngày bắt đầu: {userData.package.start_date}</p>
              <p>Ngày kết thúc: {userData.package.end_date}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Tiến độ</span>
                <span className="text-sm font-medium text-foreground">{userData.package.progress}%</span>
              </div>
              <Progress value={userData.package.progress} className="h-2" />
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-3">Quyền lợi gói tập:</p>
              <div className="space-y-2">
                {userData.package.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}