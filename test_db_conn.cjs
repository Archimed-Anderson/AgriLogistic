const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgresql://agrodeep:agrodeep_dev_password_2026@localhost:5435/agrodeep_dev');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

test();
