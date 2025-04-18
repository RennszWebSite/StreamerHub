import { AppSettings } from './types';

// Apply the theme class to the document body based on seasonal theme
export function applySeasonalTheme(seasonalTheme: string): void {
  // Remove all existing theme classes
  document.body.classList.remove(
    'theme-default', 
    'theme-halloween', 
    'theme-christmas', 
    'theme-spring', 
    'theme-summer'
  );
  
  // Add the appropriate theme class
  document.body.classList.add(`theme-${seasonalTheme}`);
}

// Update theme.json based on app settings
export const updateThemeFile = async (settings: Partial<AppSettings>): Promise<boolean> => {
  const token = localStorage.getItem('auth_token');
  if (!token) return false;

  try {
    // Get theme data based on app settings
    const themeData = {
      primary: settings.primaryColor || '#FF6B00',
      appearance: settings.darkMode ? 'dark' : 'light',
      radius: 0.5,
      variant: 'vibrant',
    };
    
    // Send request to update theme.json
    const response = await fetch('/api/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(themeData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update theme file');
    }
    
    // Apply the seasonal theme if provided
    if (settings.seasonalTheme) {
      applySeasonalTheme(settings.seasonalTheme);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update theme file:', error);
    return false;
  }
};