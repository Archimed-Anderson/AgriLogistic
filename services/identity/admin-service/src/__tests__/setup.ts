import sequelize from '../config/database';

beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Connect to test database
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
});

afterEach(async () => {
  // Clean up database after each test
  const models = Object.values(sequelize.models);
  for (const model of models) {
    await model.destroy({ where: {}, force: true });
  }
});
