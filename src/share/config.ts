import dotenv from 'dotenv';

dotenv.config({
  // path: process.env.NODE_ENV === 'production' ? '.env' : `.env.${process.env.NODE_ENV}`
});

const port = process.env.PORT || '3000';

export const config = {
  envName: process.env.NODE_ENV,
  port,
  jwtSecret: process.env.JWT_SECRET_KEY || '200L@b.io',
  rpc: {
    jwtSecret: process.env.JWT_SECRET_KEY || '200L@b.io',
    introspectUrl: process.env.VERIFY_TOKEN_URL || `http://localhost:${port}/v1/rpc/introspect`,
    postServiceURL: process.env.POST_SERVICE_URL || `http://localhost:${port}/v1`,
    userServiceURL: process.env.USER_SERVICE_URL || `http://localhost:${port}/v1`,
    commentServiceURL: process.env.COMMENT_SERVICE_URL || `http://localhost:${port}/v1`,
    followServiceURL: process.env.FOLLOW_SERVICE_URL || `http://localhost:${port}/v1`,
    topicServiceURL: process.env.TOPIC_SERVICE_URL || `http://localhost:${port}/v1`,
    postLikeServiceURL: process.env.POST_LIKE_SERVICE_URL || `http://localhost:${port}/v1`,
    postSavedServiceURL: process.env.POST_SAVED_SERVICE_URL || `http://localhost:${port}/v1`
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    url: process.env.REDIS_URL || 'redis://:200lab_redis@localhost:6379/0'
  },
  db: {
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  },
  upload: {
    type: 'local',
    path: 'uploads',
    cdn: process.env.CDN_URL || `http://localhost:${port}/uploads`
  },
  dbURL: `postgresql://200lab:200lab_secret@localhost:5432/bento-social?connection_limit=50`
};