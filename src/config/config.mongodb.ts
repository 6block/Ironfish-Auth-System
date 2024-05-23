const env = process.env.NODE_ENV;

const mongodbUriMap = {
  dev: 'mongodb://localhost/iron_dev',
  prod: 'mongodb://localhost/iron',
};

const connectionName = 'iron_auth';

const devConfig = {
  connectionName,
};

const prodConfig = {
  connectionName,
};

export const mongodbUri = env === 'dev' ? mongodbUriMap.dev : mongodbUriMap.prod;
export const mongodbConfig = env === 'dev' ? devConfig : prodConfig;
