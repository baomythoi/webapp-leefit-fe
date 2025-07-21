const API_BASE_URL = 'https://api-leefit-be.vietnamaisolution.com/api';

// Generic API handler with error handling and loading states
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; loading: boolean; error: string | null }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, loading: false, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { 
      data: null, 
      loading: false, 
      error: error instanceof Error ? error.message : 'An error occurred' 
    };
  }
}

// Account & Users API
export const accountAPI = {
  getAllAccounts: () => apiRequest('/account'),
  registerUser: (userData: any) => apiRequest('/account', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getUserProfile: (email: string) => apiRequest(`/users/${email}`),
  updateUserProfile: (userData: any) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  uploadAvatar: (id: string, formData: FormData) => apiRequest(`/users/${id}/avatar`, {
    method: 'POST',
    body: formData,
    headers: {}, // Remove Content-Type to let browser set it for FormData
  }),
};

// Packages & Lessons API
export const packagesAPI = {
  getPackages: () => apiRequest('/packages'),
  createPackage: (packageData: any) => apiRequest('/packages', {
    method: 'POST',
    body: JSON.stringify(packageData),
  }),
  getLessons: () => apiRequest('/lessons'),
  createLesson: (lessonData: any) => apiRequest('/lessons', {
    method: 'POST',
    body: JSON.stringify(lessonData),
  }),
  getExerciseVideos: () => apiRequest('/exercise-videos'),
};

// Trainers API
export const trainersAPI = {
  getTrainers: () => apiRequest('/trainers'),
  updateTrainer: (id: string, trainerData: any) => apiRequest(`/trainers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(trainerData),
  }),
  getTrainerDetail: (id: string) => apiRequest(`/trainers/${id}`),
};

// Training Schedule & Sessions API
export const sessionsAPI = {
  getUserSchedule: (userId: string) => apiRequest(`/users/${userId}/schedule`),
  getTrainerSchedule: (trainerId: string) => apiRequest(`/trainers/${trainerId}/schedule`),
  getTrainingSessions: () => apiRequest('/training_sessions'),
  createSession: (sessionData: any) => apiRequest('/training_sessions', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  }),
  updateSession: (id: string, sessionData: any) => apiRequest(`/training_sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(sessionData),
  }),
  deleteSession: (id: string) => apiRequest(`/training_sessions/${id}`, {
    method: 'DELETE',
  }),
};

// Payments API
export const paymentsAPI = {
  getUserPayments: (userId: string) => apiRequest(`/users/${userId}/payments`),
  getPaymentHistory: () => apiRequest('/payments'),
  recordPayment: (paymentData: any) => apiRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
};

// Meals, Menus, Menu-Meal Mapping API
export const nutritionAPI = {
  getFoodElements: () => apiRequest('/food-elements'),
  getUserMeals: (userId: string) => apiRequest(`/users/${userId}/meals`),
  getMeals: () => apiRequest('/meals'),
  createMeal: (mealData: any) => apiRequest('/meals', {
    method: 'POST',
    body: JSON.stringify(mealData),
  }),
  getMenus: () => apiRequest('/menus'),
  createMenu: (menuData: any) => apiRequest('/menus', {
    method: 'POST',
    body: JSON.stringify(menuData),
  }),
  assignMealToMenu: (menuMealData: any) => apiRequest('/menu_meals', {
    method: 'POST',
    body: JSON.stringify(menuMealData),
  }),
};

// User Progress API
export const progressAPI = {
  getUserProgress: (userId: string) => apiRequest(`/users/${userId}/progress`),
  uploadProgress: (progressData: any) => apiRequest('/user_progress', {
    method: 'POST',
    body: JSON.stringify(progressData),
  }),
};

// Notifications API
export const notificationsAPI = {
  getUserNotifications: (userId: string) => apiRequest(`/notifications?user_id=${userId}`),
  sendNotification: (notificationData: any) => apiRequest('/notifications', {
    method: 'POST',
    body: JSON.stringify(notificationData),
  }),
};

// Reports / Feedback API
export const reportsAPI = {
  getReports: () => apiRequest('/reports'),
  submitReport: (reportData: any) => apiRequest('/reports', {
    method: 'POST',
    body: JSON.stringify(reportData),
  }),
};

// Survey submission (updated to use your API instead of webhook)
export const surveyAPI = {
  submitSurvey: (surveyData: any) => apiRequest('/survey', {
    method: 'POST',
    body: JSON.stringify(surveyData),
  }),
};