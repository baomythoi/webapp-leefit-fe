import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Shuffle } from 'lucide-react';
import { nutritionAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { type Language } from '@/components/LanguageToggle';

interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  icon: string;
}

interface DailyMeal {
  breakfast: MealItem[];
  lunch: MealItem[];
  snack: MealItem[];
  dinner: MealItem[];
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

interface MealCustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  foodElements: FoodElement[];
  userMeals: UserMeal[];
  onMealsUpdate: (meals: UserMeal[]) => void;
}

// Example fallback data
const FALLBACK_MEALS: MealItem[] = [
  { id: '1', name: 'Ức gà nướng', calories: 200, protein: 30, carbs: 0, fat: 5, icon: '🍗' },
  { id: '2', name: 'Yến mạch + sữa', calories: 300, protein: 12, carbs: 54, fat: 6, icon: '🥣' },
  { id: '3', name: 'Protein shake', calories: 150, protein: 25, carbs: 5, fat: 2, icon: '🥤' },
  { id: '4', name: 'Cơm gạo lứt', calories: 150, protein: 3, carbs: 30, fat: 1, icon: '🍚' },
  { id: '5', name: 'Cá hồi nướng', calories: 220, protein: 28, carbs: 0, fat: 12, icon: '🐟' },
  { id: '6', name: '2 quả trứng luộc', calories: 140, protein: 12, carbs: 1, fat: 10, icon: '🥚' },
  { id: '7', name: '1 quả táo', calories: 80, protein: 0, carbs: 21, fat: 0, icon: '🍎' },
  { id: '8', name: '1 quả chuối', calories: 105, protein: 1, carbs: 27, fat: 0, icon: '🍌' },
  { id: '9', name: 'Salad rau củ', calories: 70, protein: 2, carbs: 15, fat: 0, icon: '🥗' },
  { id: '10', name: 'Khoai lang nướng', calories: 130, protein: 2, carbs: 30, fat: 0, icon: '🍠' },
  { id: '11', name: 'Rau bông cải xanh', calories: 55, protein: 4, carbs: 11, fat: 0, icon: '🥦' },
];

export function MealCustomizationModal({ 
  open, 
  onOpenChange, 
  language, 
  foodElements, 
  userMeals, 
  onMealsUpdate 
}: MealCustomizationModalProps) {
  const { toast } = useToast();
  const [meals, setMeals] = useState<MealItem[]>(FALLBACK_MEALS);
  const [dailyMeal, setDailyMeal] = useState<DailyMeal>({
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: []
  });
  
  const [calorieTarget, setCalorieTarget] = useState<string>('1800');
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);

  useEffect(() => {
    if (open && foodElements.length > 0) {
      // Convert foodElements to MealItem format
      const convertedMeals = foodElements.map(food => ({
        id: food.id,
        name: food.name,
        calories: food.calories_per_100g,
        protein: food.protein_g,
        carbs: food.carbs_g,
        fat: food.fat_g,
        icon: '🍽️'
      }));
      setMeals(convertedMeals);
      setShowFallbackMessage(false);
    } else if (open) {
      setMeals(FALLBACK_MEALS);
      setShowFallbackMessage(true);
    }

    // Initialize daily meals from userMeals
    if (open && userMeals.length > 0) {
      const grouped = userMeals.reduce((acc, meal) => {
        const mealItems = acc[meal.meal_type] || [];
        mealItems.push({
          id: meal.id,
          name: meal.food_name,
          calories: meal.calories,
          protein: meal.protein_g,
          carbs: meal.carbs_g,
          fat: meal.fat_g,
          icon: '🍽️'
        });
        acc[meal.meal_type] = mealItems;
        return acc;
      }, {} as any);
      
      setDailyMeal({
        breakfast: grouped.breakfast || [],
        lunch: grouped.lunch || [],
        snack: grouped.snack || [],
        dinner: grouped.dinner || []
      });
    }
  }, [open, foodElements, userMeals]);

  const mealTimes = {
    breakfast: '7:00 AM',
    lunch: '12:00 PM', 
    snack: '4:00 PM',
    dinner: '7:00 PM'
  };

  const mealNames = {
    breakfast: language === 'vi' ? 'Bữa sáng' : 'Breakfast',
    lunch: language === 'vi' ? 'Bữa trưa' : 'Lunch',
    snack: language === 'vi' ? 'Bữa chiều' : 'Snack', 
    dinner: language === 'vi' ? 'Bữa tối' : 'Dinner'
  };


  const calculateTotals = () => {
    const allMeals = [...dailyMeal.breakfast, ...dailyMeal.lunch, ...dailyMeal.snack, ...dailyMeal.dinner];
    return allMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const removeMealItem = (mealType: keyof DailyMeal, itemId: string) => {
    setDailyMeal(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(item => item.id !== itemId)
    }));
  };

  const addMealItem = (mealType: keyof DailyMeal, mealId: string) => {
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
      setDailyMeal(prev => ({
        ...prev,
        [mealType]: [...prev[mealType], meal]
      }));
    }
  };

  const generateRandomMealPlan = () => {
    const target = parseInt(calorieTarget);
    if (isNaN(target) || meals.length === 0) {
      toast({
        title: language === 'vi' ? 'Lỗi' : 'Error',
        description: language === 'vi' ? 'Vui lòng nhập mục tiêu calo hợp lệ' : 'Please enter valid calorie target',
        variant: 'destructive',
      });
      return;
    }

    // Simple random distribution
    const mealTargets = {
      breakfast: Math.floor(target * 0.25),
      lunch: Math.floor(target * 0.35),
      snack: Math.floor(target * 0.15),
      dinner: Math.floor(target * 0.25),
    };

    const newDailyMeal: DailyMeal = {
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: []
    };

    Object.entries(mealTargets).forEach(([mealType, targetCals]) => {
      let currentCals = 0;
      const availableMeals = [...meals];
      
      while (currentCals < targetCals && availableMeals.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableMeals.length);
        const meal = availableMeals[randomIndex];
        
        if (currentCals + meal.calories <= targetCals + 50) {
          newDailyMeal[mealType as keyof DailyMeal].push(meal);
          currentCals += meal.calories;
        }
        
        availableMeals.splice(randomIndex, 1);
      }
    });

    setDailyMeal(newDailyMeal);
    
    toast({
      title: language === 'vi' ? 'Thành công!' : 'Success!',
      description: language === 'vi' ? 'Đã tạo thực đơn ngẫu nhiên' : 'Random meal plan generated',
    });
  };

  const saveMealPlan = async () => {
    try {
      const totals = calculateTotals();
      
      // Convert dailyMeal back to UserMeal format
      const newUserMeals: UserMeal[] = [];
      const mealTimes = {
        breakfast: '7:00 AM',
        lunch: '12:00 PM',
        snack: '4:00 PM',
        dinner: '7:00 PM'
      };

      Object.entries(dailyMeal).forEach(([mealType, items]) => {
        items.forEach((item, index) => {
          newUserMeals.push({
            id: `${mealType}-${index}-${Date.now()}`,
            meal_type: mealType as any,
            food_name: item.name,
            calories: item.calories,
            protein_g: item.protein,
            carbs_g: item.carbs,
            fat_g: item.fat,
            time: mealTimes[mealType as keyof typeof mealTimes],
            portion_size: 100
          });
        });
      });

      // Update parent component
      onMealsUpdate(newUserMeals);
      
      toast({
        title: language === 'vi' ? 'Thành công!' : 'Success!',
        description: language === 'vi' ? 'Đã lưu thực đơn' : 'Meal plan saved',
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: language === 'vi' ? 'Lỗi' : 'Error',
        description: language === 'vi' ? 'Không thể lưu thực đơn' : 'Failed to save meal plan',
        variant: 'destructive',
      });
    }
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {language === 'vi' ? 'Tuỳ chỉnh thực đơn' : 'Customize Meal Plan'}
          </DialogTitle>
        </DialogHeader>

        {showFallbackMessage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              {language === 'vi' 
                ? 'Hiển thị dữ liệu mẫu vì hiện tại chưa có món ăn nào trong hệ thống.'
                : 'Showing sample data as no meals are currently in the system.'}
            </p>
          </div>
        )}

        {/* Random Meal Plan Generator */}
        <div className="border rounded-lg p-4 mb-4 bg-muted/20">
          <h3 className="font-medium mb-3">
            {language === 'vi' ? 'Gợi ý thực đơn ngẫu nhiên theo mục tiêu calo' : 'Suggest Random Meal Plan by Calorie Goal'}
          </h3>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder={language === 'vi' ? 'Mục tiêu calo (VD: 1800)' : 'Calorie target (e.g. 1800)'}
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(e.target.value)}
              className="w-48"
            />
            <Button onClick={generateRandomMealPlan} variant="outline">
              <Shuffle className="h-4 w-4 mr-2" />
              {language === 'vi' ? 'Gợi ý' : 'Suggest'}
            </Button>
          </div>
        </div>

        {/* Meal Plan Layout */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b-2 border-primary pb-2">
            {language === 'vi' ? 'Thực Đơn Hôm Nay' : 'Today\'s Meal Plan'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(dailyMeal) as Array<keyof DailyMeal>).map((mealType) => (
              <Card key={mealType} className="p-4 bg-muted/30">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-base">{mealNames[mealType]}</h3>
                    <p className="text-sm text-muted-foreground">{mealTimes[mealType]}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {dailyMeal[mealType].map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex items-center justify-between bg-background rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.calories} kcal</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMealItem(mealType, item.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Select onValueChange={(value) => addMealItem(mealType, value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={language === 'vi' ? 'Thêm món ăn' : 'Add food'} />
                    </SelectTrigger>
                    <SelectContent>
                      {meals.map((meal) => (
                        <SelectItem key={meal.id} value={meal.id}>
                          <div className="flex items-center space-x-2">
                            <span>{meal.icon}</span>
                            <span>{meal.name} ({meal.calories} kcal)</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary */}
        <Card className="p-4 mt-6 bg-muted/20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'vi' ? 'Tổng calo hôm nay' : 'Total calories today'}: 
                <span className="font-bold ml-1">{totals.calories} kcal</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'vi' ? 'Mục tiêu' : 'Target'}: {calorieTarget} kcal
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Protein</p>
                <p className="font-bold text-primary">{Math.round(totals.protein)}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Carbs</p>
                <p className="font-bold text-primary">{Math.round(totals.carbs)}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {language === 'vi' ? 'Chất béo' : 'Fat'}
                </p>
                <p className="font-bold text-primary">{Math.round(totals.fat)}g</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={saveMealPlan} className="bg-primary hover:bg-primary/90">
            {language === 'vi' ? 'Lưu thực đơn' : 'Save Meal Plan'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}