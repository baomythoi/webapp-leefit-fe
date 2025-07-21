import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw } from 'lucide-react';
import { type Language } from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { nutritionAPI } from '@/services/api';
import { MealCustomizationModal } from './MealCustomizationModal';

interface NutritionViewProps {
  language: Language;
}

interface FoodElement {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  category: string;
}

interface UserMeal {
  id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  calories: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  time: string;
  portion_size?: number;
}

const fallbackMeals: UserMeal[] = [
  { id: '1', meal_type: 'breakfast', food_name: 'Yến mạch + sữa', calories: 300, time: '7:00 AM', protein_g: 12, carbs_g: 45, fat_g: 8 },
  { id: '2', meal_type: 'breakfast', food_name: '2 quả trứng luộc', calories: 140, time: '7:00 AM', protein_g: 12, carbs_g: 2, fat_g: 10 },
  { id: '3', meal_type: 'breakfast', food_name: '1 quả táo', calories: 80, time: '7:00 AM', protein_g: 0, carbs_g: 20, fat_g: 0 },
  { id: '4', meal_type: 'lunch', food_name: 'Ức gà nướng', calories: 250, time: '12:00 PM', protein_g: 30, carbs_g: 0, fat_g: 12 },
  { id: '5', meal_type: 'lunch', food_name: 'Cơm gạo lứt', calories: 150, time: '12:00 PM', protein_g: 3, carbs_g: 32, fat_g: 1 },
  { id: '6', meal_type: 'lunch', food_name: 'Salad rau củ', calories: 70, time: '12:00 PM', protein_g: 2, carbs_g: 12, fat_g: 2 },
  { id: '7', meal_type: 'snack', food_name: 'Protein shake', calories: 150, time: '4:00 PM', protein_g: 25, carbs_g: 5, fat_g: 3 },
  { id: '8', meal_type: 'snack', food_name: '1 quả chuối', calories: 105, time: '4:00 PM', protein_g: 1, carbs_g: 27, fat_g: 0 },
  { id: '9', meal_type: 'dinner', food_name: 'Cá hồi nướng', calories: 220, time: '7:00 PM', protein_g: 25, carbs_g: 0, fat_g: 12 },
  { id: '10', meal_type: 'dinner', food_name: 'Khoai lang nướng', calories: 130, time: '7:00 PM', protein_g: 2, carbs_g: 30, fat_g: 0 },
  { id: '11', meal_type: 'dinner', food_name: 'Rau bông cải xanh', calories: 55, time: '7:00 PM', protein_g: 4, carbs_g: 8, fat_g: 1 }
];

const fallbackFoodElements: FoodElement[] = [
  { id: '1', name: 'Ức gà nướng', calories_per_100g: 165, protein_g: 31, carbs_g: 0, fat_g: 3.6, category: 'protein' },
  { id: '2', name: 'Cơm gạo lứt', calories_per_100g: 111, protein_g: 2.6, carbs_g: 22, fat_g: 0.9, category: 'carbs' },
  { id: '3', name: 'Cá hồi', calories_per_100g: 208, protein_g: 25, carbs_g: 0, fat_g: 12, category: 'protein' },
  { id: '4', name: 'Yến mạch', calories_per_100g: 389, protein_g: 16.9, carbs_g: 66.3, fat_g: 6.9, category: 'carbs' },
  { id: '5', name: 'Trứng luộc', calories_per_100g: 155, protein_g: 13, carbs_g: 1.1, fat_g: 11, category: 'protein' }
];

const getMealIcon = (foodName: string): string => {
  const name = foodName.toLowerCase();
  if (name.includes('yến mạch') || name.includes('oatmeal')) return '🥣';
  if (name.includes('trứng') || name.includes('egg')) return '🥚';
  if (name.includes('táo') || name.includes('apple')) return '🍎';
  if (name.includes('gà') || name.includes('chicken')) return '🍗';
  if (name.includes('cơm') || name.includes('rice')) return '🍚';
  if (name.includes('salad') || name.includes('rau')) return '🥗';
  if (name.includes('protein') || name.includes('shake')) return '🥤';
  if (name.includes('chuối') || name.includes('banana')) return '🍌';
  if (name.includes('cá') || name.includes('salmon')) return '🐟';
  if (name.includes('khoai') || name.includes('potato')) return '🍠';
  if (name.includes('bông cải') || name.includes('broccoli')) return '🥦';
  return '🍽️';
};

const getMealTimeLabel = (mealType: string, language: Language): string => {
  const labels = {
    breakfast: language === 'vi' ? 'Bữa sáng' : 'Breakfast',
    lunch: language === 'vi' ? 'Bữa trưa' : 'Lunch',
    dinner: language === 'vi' ? 'Bữa tối' : 'Dinner',
    snack: language === 'vi' ? 'Bữa phụ' : 'Snack'
  };
  return labels[mealType as keyof typeof labels] || mealType;
};

export function NutritionView({ language }: NutritionViewProps) {
  const [showMealCustomModal, setShowMealCustomModal] = useState(false);
  const [userMeals, setUserMeals] = useState<UserMeal[]>(fallbackMeals);
  const [foodElements, setFoodElements] = useState<FoodElement[]>(fallbackFoodElements);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch food elements and user meals
  useEffect(() => {
    const fetchNutritionData = async () => {
      setLoading(true);
      try {
        // Fetch food elements
        const { data: foodData, error: foodError } = await nutritionAPI.getFoodElements();
        if (foodData && !foodError) {
          setFoodElements(foodData as FoodElement[]);
        }

        // Fetch user meals if user exists
        if (user?.id) {
          const { data: mealData, error: mealError } = await nutritionAPI.getUserMeals(user.id);
          if (mealData && !mealError) {
            setUserMeals(mealData as UserMeal[]);
          }
        }
      } catch (error) {
        console.log('Using fallback nutrition data - API not available');
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, [user?.id]);

  // Group meals by meal type
  const groupedMeals = userMeals.reduce((acc, meal) => {
    if (!acc[meal.meal_type]) {
      acc[meal.meal_type] = [];
    }
    acc[meal.meal_type].push(meal);
    return acc;
  }, {} as Record<string, UserMeal[]>);

  // Prepare meal display data
  const todayMeals = Object.entries(groupedMeals).map(([mealType, meals]) => ({
    name: getMealTimeLabel(mealType, language),
    time: meals[0]?.time || '00:00',
    type: mealType,
    items: meals.map(meal => ({
      name: meal.food_name,
      calories: meal.calories,
      protein: meal.protein_g || 0,
      carbs: meal.carbs_g || 0,
      fat: meal.fat_g || 0,
      icon: getMealIcon(meal.food_name)
    }))
  }));

  // Calculate totals
  const totals = userMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + (meal.protein_g || 0),
      carbs: acc.carbs + (meal.carbs_g || 0),
      fat: acc.fat + (meal.fat_g || 0)
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const targetCalories = 1800;

  const handleRefreshMeals = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data: mealData, error: mealError } = await nutritionAPI.getUserMeals(user.id);
      if (mealData && !mealError) {
        setUserMeals(mealData as UserMeal[]);
        toast({
          title: language === 'vi' ? 'Cập nhật thực đơn thành công' : 'Meals refreshed successfully'
        });
      }
    } catch (error) {
      toast({
        title: language === 'vi' ? 'Không thể cập nhật thực đơn' : 'Failed to refresh meals',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {language === 'vi' ? 'Thực Đơn Hôm Nay' : "Today's Meal Plan"}
        </h1>
        <div className="flex space-x-2">
          <Button 
            onClick={handleRefreshMeals}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {language === 'vi' ? 'Làm mới' : 'Refresh'}
          </Button>
          <Button 
            onClick={() => setShowMealCustomModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
          >
            <Settings className="h-4 w-4 mr-2" />
            {language === 'vi' ? 'Tùy chỉnh thực đơn' : 'Customize Meal Plan'}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && todayMeals.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">
            {language === 'vi' ? 'Đang tải thực đơn...' : 'Loading meals...'}
          </span>
        </div>
      )}

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
              {meal.items.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  {language === 'vi' ? 'Chưa có món ăn' : 'No items yet'}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Section */}
      <Card className="p-4 bg-muted/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <p className="text-lg font-semibold text-foreground">
              {language === 'vi' ? `Tổng calo hôm nay: ${Math.round(totals.calories)} kcal` : `Total calories today: ${Math.round(totals.calories)} kcal`}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === 'vi' ? `Mục tiêu: ${targetCalories} kcal` : `Target: ${targetCalories} kcal`}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, (totals.calories / targetCalories) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Protein</p>
              <p className="font-semibold text-emerald-600">{Math.round(totals.protein)}g</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Carbs</p>
              <p className="font-semibold text-emerald-600">{Math.round(totals.carbs)}g</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Chất béo' : 'Fat'}</p>
              <p className="font-semibold text-emerald-600">{Math.round(totals.fat)}g</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Meal Customization Modal */}
      <MealCustomizationModal 
        open={showMealCustomModal}
        onOpenChange={setShowMealCustomModal}
        language={language}
        foodElements={foodElements}
        userMeals={userMeals}
        onMealsUpdate={setUserMeals}
      />
    </Card>
  );
}