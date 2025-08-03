const env: string | undefined = import.meta.env.VITE_NODE_ENV;

export const useEnvironment = () => ({
  isDebug: env !== "production",
  isProduction: env === "production",
});
