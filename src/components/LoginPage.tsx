import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageToggle, type Language } from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('vi');
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate login - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockToken = 'mock-jwt-token-' + Date.now();
      login(mockToken, email);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle 
          currentLanguage={language} 
          onLanguageChange={setLanguage} 
        />
      </div>
      
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/8dba926f-60c5-47d1-86a7-e0a32a5839ad.png" 
            alt="LEEFIT" 
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold">
            {language === 'vi' ? 'Đăng nhập' : 'Login'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'vi' 
              ? 'Đăng nhập vào tài khoản của bạn' 
              : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">
              {language === 'vi' ? 'Email' : 'Email'}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'vi' ? 'Nhập email của bạn' : 'Enter your email'}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">
              {language === 'vi' ? 'Mật khẩu' : 'Password'}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'vi' ? 'Nhập mật khẩu' : 'Enter your password'}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            variant="fitness"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <LogIn className="h-4 w-4 mr-2" />
            )}
            {language === 'vi' ? 'Đăng nhập' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {language === 'vi' 
            ? 'Để demo, nhập bất kỳ email và mật khẩu nào' 
            : 'For demo, enter any email and password'}
        </div>
      </Card>
    </div>
  );
}