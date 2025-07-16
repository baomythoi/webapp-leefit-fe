import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle, type Language } from "@/components/LanguageToggle";
import { translations } from "@/translations";
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
  Dumbbell
} from "lucide-react";

interface DashboardProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function Dashboard({ language, onLanguageChange }: DashboardProps) {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const t = translations[language];

  const user = {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/8dba926f-60c5-47d1-86a7-e0a32a5839ad.png" 
              alt="LEEFIT" 
              className="h-8"
            />
            <span className="font-medium text-muted-foreground">
              {t.gymCoachingOnline}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className="font-medium">{user.name}</span>
            </div>
            <LanguageToggle 
              currentLanguage={language} 
              onLanguageChange={onLanguageChange} 
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    selectedSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {selectedSection === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{t.dashboard}</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t.currentWeight}</p>
                      <p className="text-2xl font-bold">{user.weight} kg</p>
                      <p className="text-sm text-success">-5 kg</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t.bodyFat}</p>
                      <p className="text-2xl font-bold">{user.bodyFat}%</p>
                      <p className="text-sm text-success">-4%</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <ChartBar className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t.todaySteps}</p>
                      <p className="text-2xl font-bold">{user.todaySteps.toLocaleString()}</p>
                      <Progress value={(user.todaySteps / user.targetSteps) * 100} className="mt-2" />
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t.monthlyGoal}</p>
                      <p className="text-2xl font-bold">{user.monthlyGoal}%</p>
                      <p className="text-sm text-muted-foreground">+2 {language === 'vi' ? 'buổi tập so với tuần trước' : 'sessions vs last week'}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Today's Workout and Menu */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Workout */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    {t.todaySchedule}
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{todayWorkout.name}</h4>
                      <Badge variant={todayWorkout.completed ? "default" : "outline"}>
                        {todayWorkout.completed ? t.completed : language === 'vi' ? 'Sắp diễn ra' : 'Upcoming'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{todayWorkout.duration} {language === 'vi' ? 'phút' : 'minutes'}, {todayWorkout.time}</p>
                  </div>
                  <Button variant="fitness" className="w-full">
                    {t.startWorkout}
                  </Button>
                </Card>

                {/* Today's Nutrition */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Apple className="h-5 w-5 mr-2 text-primary" />
                    {t.todayMenu}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>{t.totalCalories}: {totalCalories} kcal</span>
                      <span>{t.targetCalories}: 1,800 kcal</span>
                    </div>
                    <Progress value={(totalCalories / 1800) * 100} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">{t.protein}</p>
                      <p className="font-medium text-primary">{macros.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">{t.carbs}</p>
                      <p className="font-medium text-primary">{macros.carbs}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">{t.fat}</p>
                      <p className="font-medium text-primary">{macros.fat}g</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {actionButtons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant}
                    onClick={button.onClick}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    {button.icon}
                    <span className="text-sm text-center">{button.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Add other sections here when selected */}
          {selectedSection !== 'dashboard' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">
                {navigation.find(n => n.id === selectedSection)?.label}
              </h2>
              <p className="text-muted-foreground">
                {language === 'vi' ? 'Tính năng đang được phát triển...' : 'Feature coming soon...'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}