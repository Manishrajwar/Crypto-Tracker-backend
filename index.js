import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import coinRoutes from './routes/coinRoutes.js'; 
import {connectDB} from "./utils/db.js"


dotenv.config();


const app = express();
app.use(express.json());

app.use(cors({
  origin:"https://crypto-tracker-dvso.onrender.com"
}));

// this is to connect to the MongoDB database
connectDB();


// Coin Routes 
app.use('/api', coinRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get('/', (req, res) => {
  res.send(' VR Automations Crypto Tracker API is running!');
});

