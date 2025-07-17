import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Apple, Plus, Edit, Clock } from 'lucide-react';
import { useAPI } from '@/hooks/useAPI';
import { nutritionAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { type Language } from '@/components/LanguageToggle';
import { translations } from '@/translations';

interface NutritionViewProps {
  language: Language;
}

export function NutritionView({ language }: NutritionViewProps) {
  const { toast } = useToast();
  const t = translations[language];
  
  const { data: menus, loading: menusLoading, refetch: refetchMenus } = useAPI(nutritionAPI.getMenus);
  const { data: meals, loading: mealsLoading, refetch: refetchMeals } = useAPI(nutritionAPI.getMeals);

  const handleCreateMeal = async () => {
    try {
      const newMeal = {
        name: language === 'vi' ? 'Món ăn mới' : 'New Meal',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        category: 'main'
      };
      
      const { error } = await nutritionAPI.createMeal(newMeal);
      if (error) throw new Error(error);
      
      toast({
        title: language === 'vi' ? 'Thành công!' : 'Success!',
        description: language === 'vi' ? 'Đã thêm món ăn mới' : 'New meal added',
      });
      
      refetchMeals();
    } catch (error) {
      toast({
        title: language === 'vi' ? 'Lỗi' : 'Error',
        description: language === 'vi' ? 'Không thể thêm món ăn' : 'Failed to add meal',
        variant: 'destructive',
      });
    }
  };

  const handleCreateMenu = async () => {
    try {
      const newMenu = {
        name: language === 'vi' ? 'Thực đơn mới' : 'New Menu',
        description: language === 'vi' ? 'Thực đơn được tạo tự động' : 'Auto-generated menu',
        total_calories: 0,
        date: new Date().toISOString()
      };
      
      const { error } = await nutritionAPI.createMenu(newMenu);
      if (error) throw new Error(error);
      
      toast({
        title: language === 'vi' ? 'Thành công!' : 'Success!',
        description: language === 'vi' ? 'Đã tạo thực đơn mới' : 'New menu created',
      });
      
      refetchMenus();
    } catch (error) {
      toast({
        title: language === 'vi' ? 'Lỗi' : 'Error',
        description: language === 'vi' ? 'Không thể tạo thực đơn' : 'Failed to create menu',
        variant: 'destructive',
      });
    }
  };

  // Sample data for demonstration
  const todayNutrition = {
    totalCalories: 1650,
    targetCalories: 1800,
    protein: 140,
    carbs: 180,
    fat: 45,
    meals: [
      {
        type: t.breakfast,
        time: '7:00 AM',
        calories: 420,
        items: ['Oatmeal + Milk', '2 Boiled Eggs', '1 Apple']
      },
      {
        type: t.lunch,
        time: '12:00 PM',
        calories: 520,
        items: ['Grilled Chicken', 'Brown Rice', 'Vegetable Salad']
      },
      {
        type: t.snack,
        time: '4:00 PM',
        calories: 255,
        items: ['Protein Shake', '1 Banana']
      },
      {
        type: t.dinner,
        time: '7:00 PM',
        calories: 455,
        items: ['Grilled Salmon', 'Sweet Potato', 'Broccoli']
      }
    ]
  };

  if (menusLoading || mealsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t.nutrition}</h1>
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
        <h1 className="text-3xl font-bold">{t.nutrition}</h1>
        <div className="flex space-x-2">
          <Button onClick={handleCreateMeal} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Thêm món' : 'Add Meal'}
          </Button>
          <Button onClick={handleCreateMenu} variant="fitness">
            <Plus className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Tạo thực đơn' : 'Create Menu'}
          </Button>
        </div>
      </div>

      {/* Today's Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Apple className="h-5 w-5 mr-2 text-primary" />
          {language === 'vi' ? 'Hôm nay' : 'Today\'s Overview'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{t.totalCalories}: {todayNutrition.totalCalories} kcal</span>
              <span>{t.targetCalories}: {todayNutrition.targetCalories} kcal</span>
            </div>
            <Progress value={(todayNutrition.totalCalories / todayNutrition.targetCalories) * 100} className="mb-4" />
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{t.protein}</p>
                <p className="font-medium text-primary">{todayNutrition.protein}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{t.carbs}</p>
                <p className="font-medium text-primary">{todayNutrition.carbs}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{t.fat}</p>
                <p className="font-medium text-primary">{todayNutrition.fat}g</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Today's Meals */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">{language === 'vi' ? 'Bữa ăn hôm nay' : 'Today\'s Meals'}</h3>
        {todayNutrition.meals.map((meal, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h4 className="font-medium">{meal.type}</h4>
                  <Badge variant="outline">{meal.calories} kcal</Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                  <Clock className="h-3 w-3" />
                  <span>{meal.time}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {meal.items.join(' • ')}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Available Meals */}
      {meals && Array.isArray(meals) && meals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{language === 'vi' ? 'Danh sách món ăn' : 'Available Meals'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meals.map((meal: any) => (
              <Card key={meal.id} className="p-4">
                <h4 className="font-medium mb-2">{meal.name}</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Calories: {meal.calories} kcal</div>
                  <div>Protein: {meal.protein}g</div>
                  <div>Carbs: {meal.carbs}g</div>
                  <div>Fat: {meal.fat}g</div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Plus className="h-3 w-3 mr-1" />
                  {language === 'vi' ? 'Thêm vào thực đơn' : 'Add to Menu'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}