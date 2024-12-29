export const AuthService = {
  authorize: async (email: string, password: string): Promise<string> => {
    try {
      const response = await fetch("http://localhost/api/v1/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const body = await response.json();

      return body.token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
