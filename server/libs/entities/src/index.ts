export * from './dto/authenticated-user.dto';
export * from './dto/login.dto';
export * from './dto/project.dto';
export * from './dto/videoflo-session-dtos';
export * from './entities';
export * from './lib/account-user.entity';
export * from './lib/account.entity';
export * from './lib/address.entity';
export * from './lib/contact.entity';
export * from './lib/project.entity';
export * from './lib/user.entity';
export * from './lib/video-session.entity';
export * from './lib/workflow-role.entity';
export * from './schemas/request-logging-schema';

import { v4 } from 'uuid';

export const guid = () => v4().replace(/-/g, '');
