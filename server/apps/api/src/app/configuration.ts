import { entities } from '@botaiml-videoflo/entities';

export default () => ({
  siteUrl: process.env.SITE_URL || 'http://localhost:8800',
  siteOvWebhookHandler: process.env.SITE_URL_OV_WH_HANDLER,
  faceApiSettings: {
    url: process.env.FACE_API_URL,
    appId: process.env.FACE_API_APP_ID,
    secretKey: process.env.FACE_API_SECRET_KEY
  },
  ipDataApiKey: process.env.IP_DATA_API_KEY,
  googleGeoCodingKey: process.env.GOOGLE_GEOCODING_KEY,
  openVidu: {
    serverUrl: process.env.OV_SERVER_URL,
    secretKey: process.env.OV_SECRET_KEY
  },
  addJobUrl: process.env.UTIL_SERVER_ADD_JOB_URL,
  utilServer: {
    addJobUrl: process.env.UTIL_SERVER_ADD_JOB_URL,
    registerWebhook: process.env.UTIL_SERVER_REGISTER_WEBHOOK
  },
  jwtOptions: {
    secret: process.env.JWT_SECRET_KEY,
    signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '60s' }
  },
  typeOrmOptions: {
    type: process.env.TYPE_ORM_DB_TYPE || 'postgres',
    host: process.env.TYPE_ORM_HOST || 'localhost',
    port: process.env.TYPE_ORM_PORT || 5432,
    username: process.env.TYPE_ORM_USERNAME || 'postgres',
    password: process.env.TYPE_ORM_PASSWORD || 'postgres',
    database: process.env.TYPE_ORM_DATABASE || 'VideofloDb',
    entities: entities,
    synchronize: true
  },
  mongoDb: {
    url: 'mongodb://localhost/videoflo',
    options: {}
  },
  activeLivessCheck: {
    url: process.env.ACTIVE_LIVENESS_CHECK
  },
  panRecognition: {
    url: process.env.PAN_RECOGNITION_URL
  }
});
