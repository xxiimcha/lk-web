const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// MongoDB connection URI
const MONGODB_URI = 'mongodb+srv://admin:admin@cluster0.d8noxkl.mongodb.net/dash?retryWrites=true&w=majority'; // Replace with your MongoDB connection string

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define the user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});

// Create the User model
const User = mongoose.model('User', userSchema, 'users'); // Explicitly specify the 'users' collection

// Hash the password and update it
(async () => {
  try {
    const email = 'admin@example.com'; // Replace with the email of the user you want to update
    const plainPassword = 'Admin@123'; // Replace with the plain-text password

    // Hash the password
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);

    // Update the user password
    const result = await User.updateOne(
      { email }, // Find the user by email
      { $set: { password: hashedPassword } } // Update the password field
    );

    if (result.modifiedCount > 0) {
      console.log('Password updated successfully');
    } else {
      console.log('No user found or password already up-to-date');
    }

    // Close the database connection
    mongoose.connection.close();
  } catch (err) {
    console.error('Error updating password:', err);
    mongoose.connection.close();
  }
})();
