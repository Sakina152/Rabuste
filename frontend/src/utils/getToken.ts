export const getToken = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) return null;
  
    try {
      const parsed = JSON.parse(userInfo);
      return parsed.token || null;
    } catch {
      return null;
    }
  };
  