const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/urbandrive', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    // Add missing fields with default values if not present
    const result = await User.updateMany(
      { $or: [
        { phone: { $exists: false } },
        { avatar: { $exists: false } },
        { totalBookings: { $exists: false } }
      ] },
      { $set: { phone: '', avatar: '', totalBookings: 0 } }
    );
    console.log('Updated users:', result.modifiedCount);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });
