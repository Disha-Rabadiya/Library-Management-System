const Role = require('../api/models/Role');
const User = require('../api/models/User');
const { ROLES, BCRYPT } = require('./constants');

module.exports.bootstrap = async () => {
  try {
    const roles = [
      {
        name: ROLES.ADMIN,
        description: 'Administrator Role',
      },
      {
        name: ROLES.LIBRARIAN,
        description: 'Librarian Role',
      },
      {
        name: ROLES.STUDENT,
        description: 'Student Role',
      },
    ];

    const roleMap = {};

    // Create default roles if they don't exist
    for (const roleData of roles) {
      const [role] = await Role.findOrCreate({
        where: {
          name: roleData.name,
          isDeleted: false,
        },
        defaults: roleData,
      });

      roleMap[role.name] = role;
    }

    // Create default admin user
    const adminRole = roleMap[ROLES.ADMIN];

    const admin = await User.findOne({
      where: {
        email: process.env.ADMIN_EMAIL,
        isDeleted: false,
      },
    });

    if (!admin) {
      const hash = BCRYPT.hashSync(process.env.ADMIN_PASSWORD, 10);

      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: process.env.ADMIN_EMAIL,
        password: hash,
        roleId: adminRole.id,
      });

      console.log('Default admin created.');
    }

    console.log('Bootstrap completed successfully.');
  } catch (error) {
    console.error('Bootstrap Error:', error);
    throw error;
  }
};
