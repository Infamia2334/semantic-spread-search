const devConfig = {
    PORT: 8001,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
}

const stagingConfig = {
    gcp: {    
        PORT: 3001,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
    azure: {    
        PORT: 3001,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
    aws: {      
        PORT: 3001,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
}

const prodConfig = {
    gcp: {    
        PORT: 3001,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
    azure: {    
        PORT: 3001,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
    aws: {      
        PORT: 3001,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
}

const config = {
  development: devConfig,
  staging: stagingConfig,
  production: prodConfig,
};

type CloudEnvironment = 'gcp' | 'azure' | 'aws';
type NodeEnv = 'development' | 'production' | 'staging';

export default function getConfig() {
  const environment = (process.env.NODE_ENV as NodeEnv) || 'development';

  if (environment === 'production' || environment === 'staging') {
    const cloudEnv = (process.env.CLOUD_ENV as CloudEnvironment) || 'azure';
    return config[environment][cloudEnv];
  }

  return config.development;
}