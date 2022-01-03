const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/api',
    '<rootDir>/libs/entities',
    '<rootDir>/apps/customer-console-backend',
    '<rootDir>/apps/customer-console-frontend',
    '<rootDir>/apps/admin-console-backend',
    '<rootDir>/apps/admin-console-frontend',
    '<rootDir>/apps/browser-client',
    '<rootDir>/libs/decorators',
    '<rootDir>/libs/users-service',
    '<rootDir>/libs/common-controllers',
    '<rootDir>/apps/util-server'
  ]
};
