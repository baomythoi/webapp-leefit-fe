import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { translations } from "@/translations";
import { type Language } from "@/components/LanguageToggle";
import { useToast } from "@/hooks/use-toast";

interface SurveyData {
  fitnessGoal: string;
  experience: string;
  timeAvailable: number;
  healthConcerns: string[];
  trainerGender: string;
}

interface SurveyProps {
  language: Language;
  onComplete: (data: SurveyData) => void;
}

export function Survey({ language, onComplete }: SurveyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    fitnessGoal: "",
    experience: "",
    timeAvailable: 30,
    healthConcerns: [],
    trainerGender: "",
  });
  const { toast } = useToast();
  const t = translations[language];

  const questions = [
    {
      id: "fitnessGoal",
      title: t.fitnessGoal,
      type: "radio",
      options: [
        { value: "lose_weight", label: t.loseWeight },
        { value: "gain_muscle", label: t.gainMuscle },
        { value: "maintain_health", label: t.maintainHealth },
        { value: "increase_strength", label: t.increaseStrength },
      ],
    },
    {
      id: "experience",
      title: t.experience,
      type: "radio",
      options: [
        { value: "beginner", label: t.beginner },
        { value: "intermediate", label: t.intermediate },
        { value: "advanced", label: t.advanced },
      ],
    },
    {
      id: "timeAvailable",
      title: t.timeAvailable,
      type: "slider",
      min: 15,
      max: 120,
      step: 15,
    },
    {
      id: "healthConcerns",
      title: t.healthConcerns,
      type: "checkbox",
      options: [
        { value: "none", label: t.none },
        { value: "back_pain", label: t.backPain },
        { value: "knee_pain", label: t.kneePain },
        { value: "heart_condition", label: t.heartCondition },
        { value: "other", label: t.other },
      ],
    },
    {
      id: "trainerGender",
      title: t.trainerGender,
      type: "radio",
      options: [
        { value: "male", label: t.male },
        { value: "female", label: t.female },
        { value: "no_preference", label: t.noPreference },
      ],
    },
  ];

  const currentQuestion = questions[currentStep];

  const handleAnswerChange = (questionId: string, value: any) => {
    setSurveyData(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleHealthConcernsChange = (value: string, checked: boolean) => {
    setSurveyData(prev => {
      const newConcerns = checked
        ? [...prev.healthConcerns, value]
        : prev.healthConcerns.filter(c => c !== value);
      
      // If "none" is selected, clear others
      if (value === "none" && checked) {
        return { ...prev, healthConcerns: ["none"] };
      }
      
      // If other option is selected, remove "none"
      if (value !== "none" && checked) {
        return { ...prev, healthConcerns: newConcerns.filter(c => c !== "none") };
      }
      
      return { ...prev, healthConcerns: newConcerns };
    });
  };

  const canProceed = () => {
    const currentAnswer = surveyData[currentQuestion.id as keyof SurveyData];
    if (currentQuestion.type === "checkbox") {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return currentAnswer !== "" && currentAnswer !== undefined;
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      // Send to webhook (replace with your actual webhook URL)
      const webhookUrl = "https://your-webhook-url.com/survey";
      
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          ...surveyData,
          timestamp: new Date().toISOString(),
          language,
        }),
      });

      toast({
        title: language === 'vi' ? "Thành công!" : "Success!",
        description: language === 'vi' 
          ? "Cảm ơn bạn đã hoàn thành khảo sát. Chúng tôi sẽ tạo chương trình phù hợp cho bạn." 
          : "Thank you for completing the survey. We'll create a personalized program for you.",
      });

      onComplete(surveyData);
    } catch (error) {
      toast({
        title: language === 'vi' ? "Lỗi" : "Error",
        description: language === 'vi' 
          ? "Có lỗi xảy ra. Vui lòng thử lại." 
          : "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "radio":
        return (
          <RadioGroup
            value={surveyData[currentQuestion.id as keyof SurveyData] as string}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            className="space-y-4"
          >
            {currentQuestion.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "slider":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-2xl font-bold text-primary">
                {surveyData.timeAvailable} {language === 'vi' ? 'phút' : 'minutes'}
              </span>
            </div>
            <Slider
              value={[surveyData.timeAvailable]}
              onValueChange={(value) => handleAnswerChange("timeAvailable", value[0])}
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={currentQuestion.step}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>15 {language === 'vi' ? 'phút' : 'min'}</span>
              <span>120 {language === 'vi' ? 'phút' : 'min'}</span>
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-4">
            {currentQuestion.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={option.value}
                  checked={surveyData.healthConcerns.includes(option.value)}
                  onChange={(e) => handleHealthConcernsChange(option.value, e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <Label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-card-fitness">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">{t.surveyTitle}</h1>
          <p className="text-muted-foreground text-center">{t.surveySubtitle}</p>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{currentStep + 1} / {questions.length}</span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.title}</h2>
          {renderQuestion()}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t.previous}
          </Button>

          <Button
            variant="fitness"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === questions.length - 1 ? t.submitSurvey : t.next}
            {currentStep < questions.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}