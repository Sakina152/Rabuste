import { auth } from '../firebase';

export const getToken = async (): Promise<string | null> => {
  try {
    // 1. Check local storage for explicit Admin login
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      // If the user is logged in as an ADMIN, we MUST prioritize this token
      // This overrides any potential background firebase customer session
      if (parsed.role === 'admin' && parsed.token) {
        return parsed.token;
      }
    }

    // 2. Check Firebase (for regular users)
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }

    // 3. Fallback to local storage (for jwt-based regular users if any)
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      return parsed.token || null;
    }

    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// For backward compatibility, keep the sync version
export const getTokenSync = (): string | null => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    return parsed.token || null;
  }
  return null;
};