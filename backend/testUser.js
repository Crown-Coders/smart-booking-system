const db = require('./models');

async function testUser() {
  await db.sequelize.sync(); // sync models

  const user = await db.User.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    idNumber: '1234567890'
  });

  console.log(user.toJSON());
  process.exit();
}

testUser();
