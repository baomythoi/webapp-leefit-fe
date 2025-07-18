import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { type Language } from '@/components/LanguageToggle';
import { MealCustomizationModal } from './MealCustomizationModal';

interface NutritionViewProps {
  language: Language;
}

export function NutritionView({ language }: NutritionViewProps) {
  const [showMealCustomModal, setShowMealCustomModal] = useState(false);

  // Sample data matching the image exactly
  const todayMeals = [
    {
      name: language === 'vi' ? 'Bữa sáng' : 'Breakfast',
      time: '7:00 AM',
      items: [
        { name: language === 'vi' ? 'Yến mạch + sữa' : 'Oatmeal + Milk', calories: 300, icon: '🥣' },
        { name: language === 'vi' ? '2 quả trứng luộc' : '2 Boiled Eggs', calories: 140, icon: '🥚' },
        { name: language === 'vi' ? '1 quả táo' : '1 Apple', calories: 80, icon: '🍎' }
      ]
    },
    {
      name: language === 'vi' ? 'Bữa trưa' : 'Lunch', 
      time: '12:00 PM',
      items: [
        { name: language === 'vi' ? 'Ức gà nướng' : 'Grilled Chicken', calories: 200, icon: '🍗' },
        { name: language === 'vi' ? 'Cơm gạo lứt' : 'Brown Rice', calories: 150, icon: '🍚' },
        { name: language === 'vi' ? 'Salad rau củ' : 'Vegetable Salad', calories: 70, icon: '🥗' }
      ]
    },
    {
      name: language === 'vi' ? 'Bữa chiều' : 'Snack',
      time: '4:00 PM', 
      items: [
        { name: 'Protein shake', calories: 150, icon: '🥤' },
        { name: language === 'vi' ? '1 quả chuối' : '1 Banana', calories: 105, icon: '🍌' }
      ]
    },
    {
      name: language === 'vi' ? 'Bữa tối' : 'Dinner',
      time: '7:00 PM',
      items: [
        { name: language === 'vi' ? 'Cá hồi nướng' : 'Grilled Salmon', calories: 220, icon: '🐟' },
        { name: language === 'vi' ? 'Khoai lang nướng' : 'Sweet Potato', calories: 130, icon: '🍠' },
        { name: language === 'vi' ? 'Rau bông cải xanh' : 'Broccoli', calories: 55, icon: '🥦' }
      ]
    }
  ];

  const totalCalories = 1600;
  const targetCalories = 1800;
  const protein = 140;
  const carbs = 180;
  const fat = 45;

  return (
    <Card className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {language === 'vi' ? 'Thực Đơn Hôm Nay' : "Today's Meal Plan"}
        </h1>
        <Button 
          onClick={() => setShowMealCustomModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
        >
          <Settings className="h-4 w-4 mr-2" />
          {language === 'vi' ? 'Tùy chỉnh thực đơn' : 'Customize Meal Plan'}
        </Button>
      </div>

      {/* Meal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {todayMeals.map((meal, index) => (
          <Card key={index} className="p-4 bg-muted/30">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-foreground">{meal.name}</h3>
              <span className="text-sm text-muted-foreground">{meal.time}</span>
            </div>
            <div className="space-y-3">
              {meal.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.calories} kcal</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Section */}
      <Card className="p-4 bg-muted/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <p className="text-lg font-semibold text-foreground">
              {language === 'vi' ? `Tổng calo hôm nay: ${totalCalories} kcal` : `Total calories today: ${totalCalories} kcal`}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === 'vi' ? `Mục tiêu: ${targetCalories} kcal` : `Target: ${targetCalories} kcal`}
            </p>
          </div>
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Protein</p>
              <p className="font-semibold text-emerald-600">{protein}g</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Carbs</p>
              <p className="font-semibold text-emerald-600">{carbs}g</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Chất béo' : 'Fat'}</p>
              <p className="font-semibold text-emerald-600">{fat}g</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Meal Customization Modal */}
      <MealCustomizationModal 
        open={showMealCustomModal}
        onOpenChange={setShowMealCustomModal}
        language={language}
      />
    </Card>
  );
}