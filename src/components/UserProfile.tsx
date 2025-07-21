import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Minus, Upload, Check, Save, Edit3 } from 'lucide-react';
import { accountAPI } from '@/services/api';
import moment from 'moment-timezone';

type Language = 'vi' | 'en';

interface UserProfileProps {
  language: Language;
}

interface UserData {
  full_name: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  timezone: string;
  phone?: string;
  avatar_url: string;
  milestones: { id: string; month: string; goal: string; }[];
  package: {
    name: string;
    start_date: string;
    end_date: string;
    progress: number;
    status: string;
    benefits: string[];
  };
}

interface FormData {
  full_name: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  timezone: string;
  phone: string;
}

// Fallback data when API is not available
const fallbackUserData: UserData = {
  full_name: "Nguyễn Văn A",
  age: 28,
  height_cm: 175,
  weight_kg: 68,
  timezone: "Asia/Ho_Chi_Minh",
  phone: "+84 123 456 789",
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

// Get all world timezones
const getTimezones = () => {
  const zones = moment.tz.names();
  return zones.map(zone => ({
    value: zone,
    label: `(GMT${moment.tz(zone).format('Z')}) ${zone.replace(/_/g, ' ')}`
  }));
};

export function UserProfile({ language }: UserProfileProps) {
  const [userData, setUserData] = useState(fallbackUserData);
  const [formData, setFormData] = useState<FormData>({
    full_name: fallbackUserData.full_name,
    age: fallbackUserData.age,
    height_cm: fallbackUserData.height_cm,
    weight_kg: fallbackUserData.weight_kg,
    timezone: fallbackUserData.timezone,
    phone: fallbackUserData.phone || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, email } = useAuth();
  const timezones = getTimezones();

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) return;
      
      try {
        setLoading(true);
        const { data, error } = await accountAPI.getUserProfile(email);
        
        if (data && !error) {
          const apiUserData = data as Partial<UserData>;
          const userData: UserData = {
            ...fallbackUserData,
            ...apiUserData,
            milestones: apiUserData.milestones || fallbackUserData.milestones,
            package: apiUserData.package || fallbackUserData.package
          };
          setUserData(userData);
          setFormData({
            full_name: userData.full_name,
            age: userData.age,
            height_cm: userData.height_cm,
            weight_kg: userData.weight_kg,
            timezone: userData.timezone,
            phone: userData.phone || ''
          });
        }
      } catch (error) {
        console.log('Using fallback data - API not available');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [email]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await accountAPI.updateUserProfile(formData);

      if (data && !error) {
        setUserData(prev => ({ ...prev, ...formData }));
        setIsEditing(false);
        toast({ 
          title: language === 'vi' ? "Cập nhật thông tin thành công" : "Profile updated successfully" 
        });
      } else {
        toast({ 
          title: language === 'vi' ? "Cập nhật thất bại" : "Update failed", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: language === 'vi' ? "Cập nhật thất bại" : "Update failed", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      full_name: userData.full_name,
      age: userData.age,
      height_cm: userData.height_cm,
      weight_kg: userData.weight_kg,
      timezone: userData.timezone,
      phone: userData.phone || ''
    });
    setIsEditing(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile || !user) return;

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const { data, error } = await accountAPI.uploadAvatar(user.id || '123', formData);

      if (data && !error) {
        const result = data as { avatar_url: string };
        setUserData(prev => ({ ...prev, avatar_url: result.avatar_url }));
        setAvatarDialogOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        toast({ 
          title: language === 'vi' ? "Cập nhật ảnh đại diện thành công" : "Avatar updated successfully" 
        });
      } else {
        toast({ 
          title: language === 'vi' ? "Cập nhật ảnh đại diện thất bại" : "Avatar update failed", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: language === 'vi' ? "Cập nhật ảnh đại diện thất bại" : "Avatar update failed", 
        variant: "destructive" 
      });
    }
  };

  const t = {
    vi: {
      personalInfo: "Thông Tin Cá Nhân",
      fullName: "Họ tên",
      age: "Tuổi",
      height: "Chiều cao",
      weight: "Cân nặng",
      phone: "Số điện thoại",
      timezone: "Múi giờ",
      edit: "Chỉnh sửa",
      save: "Lưu",
      cancel: "Hủy",
      uploadAvatar: "Cập nhật ảnh đại diện",
      milestones: "Cột Mốc Tập Luyện",
      package: "Gói Tập"
    },
    en: {
      personalInfo: "Personal Information",
      fullName: "Full Name",
      age: "Age", 
      height: "Height",
      weight: "Weight",
      phone: "Phone",
      timezone: "Timezone",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      uploadAvatar: "Upload Avatar",
      milestones: "Training Milestones",
      package: "Training Package"
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t[language].personalInfo}</h1>
          <div className="w-12 h-1 bg-primary rounded-full"></div>
        </div>
        <Button 
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          disabled={loading}
          variant={isEditing ? "default" : "outline"}
          className="flex items-center space-x-2"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>{isEditing ? t[language].save : t[language].edit}</span>
        </Button>
        {isEditing && (
          <Button onClick={handleCancelEdit} variant="outline" className="ml-2">
            {t[language].cancel}
          </Button>
        )}
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
                  <DialogTitle>{t[language].uploadAvatar}</DialogTitle>
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
                      {t[language].save}
                    </Button>
                    <Button variant="outline" onClick={() => setAvatarDialogOpen(false)} className="flex-1">
                      {t[language].cancel}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* User Basic Info Form */}
            <div className="w-full space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="fullName">{t[language].fullName}</Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-foreground mt-1">{userData.full_name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">{t[language].age}</Label>
                    {isEditing ? (
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', Number(e.target.value) || 0)}
                        className="mt-1"
                        min="1"
                        max="120"
                      />
                    ) : (
                      <p className="text-muted-foreground mt-1">{userData.age} {language === 'vi' ? 'tuổi' : 'years old'}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="height">{t[language].height}</Label>
                    {isEditing ? (
                      <Input
                        id="height"
                        type="number"
                        value={formData.height_cm}
                        onChange={(e) => handleInputChange('height_cm', Number(e.target.value) || 0)}
                        className="mt-1"
                        min="1"
                        max="300"
                      />
                    ) : (
                      <p className="text-muted-foreground mt-1">{userData.height_cm} cm</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="weight">{t[language].weight}</Label>
                  {isEditing ? (
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight_kg}
                      onChange={(e) => handleInputChange('weight_kg', Number(e.target.value) || 0)}
                      className="mt-1"
                      min="1"
                      max="500"
                    />
                  ) : (
                    <p className="text-lg font-bold text-foreground mt-1">{userData.weight_kg} kg</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">{t[language].phone}</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-muted-foreground mt-1">{userData.phone || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="timezone">{t[language].timezone}</Label>
                  {isEditing ? (
                    <Select 
                      value={formData.timezone} 
                      onValueChange={(value) => handleInputChange('timezone', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {timezones.slice(0, 20).map(tz => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-muted-foreground mt-1">
                      {timezones.find(tz => tz.value === userData.timezone)?.label || userData.timezone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Training Milestones */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">{t[language].milestones}</h3>
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
          <h3 className="text-lg font-semibold text-foreground mb-4">{t[language].package}</h3>
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