import bcrypt from 'bcryptjs';

const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@thewomancompany.com',
    password: 'password123', // In a real app this would be hashed, but our seeder uses insertMany which bypasses 'save' middleware. Oh wait, insertMany bypasses `pre('save')`. Let's hash it here.
    isAdmin: true,
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false,
  },
];

// Hash passwords before exporting
users.forEach((user) => {
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
});

export default users;
