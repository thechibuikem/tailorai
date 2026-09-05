// 4. a getter function to expose our urls
export function getUrls() {
  //1. tracking development mode
  const mode = import.meta.env.MODE || "local";

  //2. constructing our config map
  const config = {
    local: {
      backendUrl: import.meta.env.VITE_LOCAL_BACKEND_URL,
      frontendUrl: import.meta.env.VITE_LOCAL_FRONTEND_URL,
    },
    remote: {
      backendUrl: import.meta.env.VITE_REMOTE_BACKEND_URL,
      frontendUrl: import.meta.env.VITE_REMOTE_FRONTEND_URL,
    },
  };

  //3. fallback to local if mode is invalid
  const targetConfig = config[mode as keyof typeof config] || config.local;
  const { backendUrl, frontendUrl } = targetConfig;

  console.log("frontend url:", frontendUrl, "backend url:", backendUrl);
  return { frontendUrl, backendUrl };
}
