import { entities } from '@botaiml-videoflo/entities';

export default () => ({
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
  }
});
