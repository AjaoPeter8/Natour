import mongoose from 'mongoose';
import app from './app.js';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
const port = process.env.PORT || 5000;

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});



// const testTour = new Tour ({
//   name: 'The Park Camper',
//   price: 997
// })

// testTour.save().then(doc => {
//   console.log(doc);
// }).catch(err => {
//   console.log('Error:', err);
// });

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
