import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageToggle, type Language } from "@/components/LanguageToggle";
import { translations } from "@/translations";
import { Dumbbell, Users, Target, Trophy, Star, ArrowRight } from "lucide-react";

interface LandingPageProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onStartSurvey: () => void;
}

export function LandingPage({ language, onLanguageChange, onStartSurvey }: LandingPageProps) {
  const t = translations[language];

  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: language === 'vi' ? "Chương trình cá nhân hóa" : "Personalized Programs",
      description: language === 'vi' 
        ? "Được thiết kế riêng cho mục tiêu và thể trạng của bạn"
        : "Designed specifically for your goals and fitness level"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: language === 'vi' ? "Huấn luyện viên chuyên nghiệp" : "Professional Trainers",
      description: language === 'vi'
        ? "Đội ngũ HLV giàu kinh nghiệm và được chứng nhận"
        : "Experienced and certified coaching team"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: language === 'vi' ? "Theo dõi tiến trình" : "Progress Tracking",
      description: language === 'vi'
        ? "Ghi nhận và phân tích chi tiết quá trình phát triển"
        : "Detailed tracking and analysis of your development"
    }
  ];

  const testimonials = [
    {
      name: language === 'vi' ? "Nguyễn Văn A" : "John Smith",
      result: language === 'vi' ? "Giảm 15kg trong 4 tháng" : "Lost 15kg in 4 months",
      quote: language === 'vi' 
        ? "Chương trình rất hiệu quả và phù hợp với lịch trình bận rộn của tôi"
        : "The program is very effective and fits my busy schedule"
    },
    {
      name: language === 'vi' ? "Trần Thị B" : "Sarah Johnson", 
      result: language === 'vi' ? "Tăng 8kg cơ bắp" : "Gained 8kg muscle mass",
      quote: language === 'vi'
        ? "HLV rất tận tâm và chương trình được thiết kế khoa học"
        : "The trainer is very dedicated and the program is scientifically designed"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/8dba926f-60c5-47d1-86a7-e0a32a5839ad.png" 
              alt="LEEFIT" 
              className="h-8"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-muted-foreground">
              {t.gymCoachingOnline}
            </span>
            <LanguageToggle 
              currentLanguage={language} 
              onLanguageChange={onLanguageChange} 
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              {t.heroTitle}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>
            <Button 
              variant="fitness" 
              size="xl" 
              onClick={onStartSurvey}
              className="transform hover:scale-105 transition-all duration-300"
            >
              {t.startJourney}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center shadow-card-fitness hover:shadow-fitness transition-all duration-300 transform hover:scale-105">
                <div className="text-primary mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">
                {language === 'vi' ? 'Học viên thành công' : 'Successful Students'}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">
                {language === 'vi' ? 'Huấn luyện viên' : 'Professional Trainers'}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">
                {language === 'vi' ? 'Tỷ lệ hài lòng' : 'Satisfaction Rate'}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">
                {language === 'vi' ? 'Hỗ trợ' : 'Support'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'vi' ? 'Câu chuyện thành công' : 'Success Stories'}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 shadow-card-fitness">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-primary font-medium">{testimonial.result}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'vi' 
              ? 'Sẵn sàng thay đổi cuộc sống của bạn?' 
              : 'Ready to transform your life?'}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {language === 'vi'
              ? 'Bắt đầu hành trình với khảo sát cá nhân hóa ngay hôm nay'
              : 'Start your journey with a personalized assessment today'}
          </p>
          <Button 
            variant="secondary" 
            size="xl" 
            onClick={onStartSurvey}
            className="bg-white text-primary hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
          >
            {t.startJourney}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/8dba926f-60c5-47d1-86a7-e0a32a5839ad.png" 
              alt="LEEFIT" 
              className="h-6"
            />
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 LEEFIT. {language === 'vi' ? 'Bảo lưu mọi quyền.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}