import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { Survey } from "@/components/Survey";
import { Dashboard } from "@/components/Dashboard";
import { type Language } from "@/components/LanguageToggle";

type AppState = 'landing' | 'survey' | 'dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppState>('landing');
  const [language, setLanguage] = useState<Language>('vi');

  const handleStartSurvey = () => {
    setCurrentView('survey');
  };

  const handleSurveyComplete = (surveyData: any) => {
    console.log('Survey completed:', surveyData);
    setCurrentView('dashboard');
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  switch (currentView) {
    case 'landing':
      return (
        <LandingPage
          language={language}
          onLanguageChange={handleLanguageChange}
          onStartSurvey={handleStartSurvey}
        />
      );
    
    case 'survey':
      return (
        <Survey
          language={language}
          onComplete={handleSurveyComplete}
        />
      );
    
    case 'dashboard':
      return (
        <Dashboard
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      );
    
    default:
      return (
        <LandingPage
          language={language}
          onLanguageChange={handleLanguageChange}
          onStartSurvey={handleStartSurvey}
        />
      );
  }
};

export default Index;
