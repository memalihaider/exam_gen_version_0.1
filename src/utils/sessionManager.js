export const checkSession = () => {
  const token = localStorage.getItem('userToken');
  const lastActivity = localStorage.getItem('lastActivity');
  const sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds

  if (!token) return false;

  if (lastActivity && Date.now() - parseInt(lastActivity) > sessionTimeout) {
    // Session expired
    localStorage.removeItem('userToken');
    localStorage.removeItem('lastActivity');
    return false;
  }

  // Update last activity
  localStorage.setItem('lastActivity', Date.now().toString());
  return true;
};