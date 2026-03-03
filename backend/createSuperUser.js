const bcrypt = require("bcryptjs");
const { User } = require("./models");
const db = require("./models");

async function createSuperUser() {
  try {
    await db.sequelize.sync();

    const hashedPassword = await bcrypt.hash("Super123!", 10);

    const user = await User.create({
      name: "Main Superuser",
      email: "super@system.com",
      password: hashedPassword,
      idNumber: "9999999999999",
      role: "SUPERUSER",
      isStaff: true,
      isSuperUser: true,
      isActive: true
    });

    console.log("👑 Superuser created!");
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

createSuperUser();
