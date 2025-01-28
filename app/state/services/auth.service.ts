import { buildApiUrl } from "~/functions/getApiBaseUrl";

export const AuthService = {
  authorize: async (
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const response = await fetch(buildApiUrl("api/v1/auth/sign-in"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
