import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle, type Language } from "@/components/LanguageToggle";
import { translations } from "@/translations";
import { useAuth } from "@/contexts/AuthContext";
import { useAPI } from "@/hooks/useAPI";
import { 
  sessionsAPI, 
  nutritionAPI, 
  progressAPI, 
  notificationsAPI,
  accountAPI 
} from "@/services/api";
import { ScheduleView } from "./schedule/ScheduleView";
import { NutritionView } from "./nutrition/NutritionView";
import { ProgressView } from "./progress/ProgressView";
import { UserProfile } from "./UserProfile";
import { 
  Calendar, 
  MessageCircle, 
  Camera, 
  Play, 
  User, 
  Bell, 
  Menu,
  ChartBar,
  Apple,
  Dumbbell,
  Video,
  TrendingUp,
  Utensils
} from "lucide-react";

interface DashboardProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function Dashboard({ language, onLanguageChange }: DashboardProps) {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const { user, logout, email } = useAuth();
  const navigate = useNavigate();
  const t = translations[language];

  // API hooks for real-time data - fetch current user
  const { data: userProfile, loading: profileLoading, error: profileError } = useAPI(() => 
    accountAPI.getUserMe()
  );
  const { data: trainingSessions, loading: sessionsLoading, refetch: refetchSessions } = useAPI(sessionsAPI.getTrainingSessions);
  const { data: todayMenus, loading: menusLoading } = useAPI(nutritionAPI.getMenus);
  const { data: userProgress, loading: progressLoading } = useAPI(() => 
    progressAPI.getUserProgress('current-user-id') // Replace with actual user ID
  );
  const { data: notifications, loading: notificationsLoading } = useAPI(() => 
    notificationsAPI.getUserNotifications('current-user-id') // Replace with actual user ID
  );

  const currentUser = user || {
    name: language === 'vi' ? "Nguyễn Văn A" : "John Doe",
    age: 28,
    weight: 75,
    bodyFat: 18,
    height: 175,
    targetWeight: 70,
    todaySteps: 6500,
    targetSteps: 10000,
    monthlyGoal: 75
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const todayWorkout = {
    name: language === 'vi' ? "Lưng + Tay sau" : "Back + Triceps",
    duration: 50,
    time: "14:00 - 14:50",
    completed: false
  };

  const todayMeals = [
    {
      type: t.breakfast,
      time: "7:00 AM",
      items: [
        { name: language === 'vi' ? "Yến mạch + sữa" : "Oatmeal + Milk", calories: 300 },
        { name: language === 'vi' ? "2 quả trứng luộc" : "2 Boiled Eggs", calories: 140 },
        { name: language === 'vi' ? "1 quả táo" : "1 Apple", calories: 80 }
      ]
    },
    {
      type: t.lunch,
      time: "12:00 PM",
      items: [
        { name: language === 'vi' ? "Ức gà nướng" : "Grilled Chicken", calories: 200 },
        { name: language === 'vi' ? "Cơm gạo lứt" : "Brown Rice", calories: 150 },
        { name: language === 'vi' ? "Salad rau củ" : "Vegetable Salad", calories: 70 }
      ]
    },
    {
      type: t.dinner,
      time: "4:00 PM",
      items: [
        { name: "Protein shake", calories: 150 },
        { name: language === 'vi' ? "1 quả chuối" : "1 Banana", calories: 105 }
      ]
    },
    {
      type: t.snack,
      time: "7:00 PM",
      items: [
        { name: language === 'vi' ? "Cá hồi nướng" : "Grilled Salmon", calories: 220 },
        { name: language === 'vi' ? "Khoai lang nướng" : "Sweet Potato", calories: 130 },
        { name: language === 'vi' ? "Rau bông cải xanh" : "Broccoli", calories: 55 }
      ]
    }
  ];

  const totalCalories = todayMeals.reduce((total, meal) => 
    total + meal.items.reduce((mealTotal, item) => mealTotal + item.calories, 0), 0
  );

  const macros = {
    protein: 140,
    carbs: 180,
    fat: 45
  };

  const navigation = [
    { id: 'dashboard', label: t.dashboard, icon: <ChartBar className="h-5 w-5" /> },
    { id: 'schedule', label: t.schedule, icon: <Calendar className="h-5 w-5" /> },
    { id: 'nutrition', label: t.nutrition, icon: <Apple className="h-5 w-5" /> },
    { id: 'progress', label: t.progress, icon: <Dumbbell className="h-5 w-5" /> },
    { id: 'profile', label: t.profile, icon: <User className="h-5 w-5" /> },
  ];

  const actionButtons = [
    {
      label: t.joinSession,
      icon: <Play className="h-5 w-5" />,
      variant: "fitness" as const,
      onClick: () => {
        // Integrate with Google Meet
        window.open('https://meet.google.com/new', '_blank');
      }
    },
    {
      label: t.chatWithTrainer,
      icon: <MessageCircle className="h-5 w-5" />,
      variant: "outline" as const,
      onClick: () => {}
    },
    {
      label: t.updateProgress,
      icon: <Camera className="h-5 w-5" />,
      variant: "outline" as const,
      onClick: () => {}
    },
    {
      label: t.watchTutorials,
      icon: <Play className="h-5 w-5" />,
      variant: "outline" as const,
      onClick: () => {}
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6" />
            <span className="text-xl font-bold">GYM COACHING ONLINE</span>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
            <Bell className="h-6 w-6" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(user?.full_name || currentUser.name).charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium">{user?.full_name || currentUser.name}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {language === 'vi' ? 'Đăng xuất' : 'Logout'}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200">
          <nav className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setSelectedSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      selectedSection === item.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {selectedSection === 'dashboard' && (
            <>
              <h1 className="text-2xl font-bold mb-6 text-primary border-b-2 border-primary pb-2 inline-block">
                Dashboard
              </h1>
              
              {/* Main Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Personal Information Card */}
                <Card className="p-6 bg-orange-50 border-orange-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">
                        {language === 'vi' ? 'Thông tin cá nhân' : 'Personal Information'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {user?.full_name || currentUser.name}, {user?.age || currentUser.age} {language === 'vi' ? 'tuổi' : 'years old'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'vi' ? 'Cân nặng:' : 'Weight:'}</span>
                      <span className="font-medium">{user?.weight_kg || currentUser.weight} kg (-5 kg)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'vi' ? 'Tỷ lệ mỡ:' : 'Body Fat:'}</span>
                      <span className="font-medium">{currentUser.bodyFat}% (-4%)</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedSection('profile')}
                    className="text-primary text-sm hover:underline flex items-center"
                  >
                    {language === 'vi' ? 'Chi tiết' : 'Details'} <ChartBar className="h-4 w-4 ml-1" />
                  </button>
                </Card>

                {/* Today's Schedule Card */}
                <Card className="p-6 bg-green-50 border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">
                        {language === 'vi' ? 'Lịch tập hôm nay' : 'Today\'s Schedule'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === 'vi' ? 'Thứ 5, 20/04/2023' : 'Thu, 20/04/2023'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 mb-4">
                    <h4 className="font-medium mb-1">{todayWorkout.name}</h4>
                    <p className="text-sm text-gray-600">{todayWorkout.duration} {language === 'vi' ? 'phút' : 'minutes'}, {todayWorkout.time}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedSection('schedule')}
                    className="text-primary text-sm hover:underline flex items-center"
                  >
                    {language === 'vi' ? 'Xem lịch tập' : 'View Schedule'} <Calendar className="h-4 w-4 ml-1" />
                  </button>
                </Card>

                {/* Today's Menu Card */}
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <Utensils className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">
                        {language === 'vi' ? 'Thực đơn hôm nay' : 'Today\'s Menu'}
                      </h3>
                      <p className="text-sm text-gray-600">1,600 / 1,800 kcal</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Protein:</span>
                      <span className="font-medium">140g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Carbs:</span>
                      <span className="font-medium">180g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'vi' ? 'Chất béo:' : 'Fat:'}</span>
                      <span className="font-medium">45g</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedSection('nutrition')}
                    className="text-primary text-sm hover:underline flex items-center"
                  >
                    {language === 'vi' ? 'Xem thực đơn' : 'View Menu'} <Utensils className="h-4 w-4 ml-1" />
                  </button>
                </Card>

                {/* Progress Card */}
                <Card className="p-6 bg-purple-50 border-purple-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">
                        {language === 'vi' ? 'Tiến trình' : 'Progress'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === 'vi' ? 'Tháng 4/2023' : 'April 2023'}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">{language === 'vi' ? 'Mục tiêu tháng:' : 'Monthly Goal:'}</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="mb-2" />
                    <p className="text-xs text-gray-600">
                      +2 {language === 'vi' ? 'buổi tập so với tuần trước' : 'sessions vs last week'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedSection('progress')}
                    className="text-primary text-sm hover:underline flex items-center"
                  >
                    {language === 'vi' ? 'Xem tiến trình' : 'View Progress'} <TrendingUp className="h-4 w-4 ml-1" />
                  </button>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  className="h-16 bg-primary text-white flex items-center justify-center space-x-2"
                  onClick={() => window.open('https://meet.google.com/new', '_blank')}
                >
                  <Video className="h-5 w-5" />
                  <span>{language === 'vi' ? 'Tham gia buổi tập' : 'Join Session'}</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-16 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{language === 'vi' ? 'Chat với HLV' : 'Chat with Trainer'}</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-16 flex items-center justify-center space-x-2"
                  onClick={() => setSelectedSection('progress')}
                >
                  <Camera className="h-5 w-5" />
                  <span>{language === 'vi' ? 'Cập nhật ảnh tiến trình' : 'Update Progress Photos'}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-16 flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>{language === 'vi' ? 'Xem video hướng dẫn' : 'Watch Tutorial Videos'}</span>
                </Button>
              </div>
            </>
          )}

          {/* Tab Content */}
          {selectedSection === 'schedule' && (
            <div>
              <ScheduleView language={language} />
            </div>
          )}
          
          {selectedSection === 'nutrition' && (
            <div>
              <NutritionView language={language} />
            </div>
          )}
          
          {selectedSection === 'progress' && (
            <div>
              <ProgressView language={language} />
            </div>
          )}
          
          {selectedSection === 'profile' && (
            <div>
              <UserProfile language={language} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}