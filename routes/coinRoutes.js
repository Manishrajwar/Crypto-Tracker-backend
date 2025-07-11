import express from 'express';
import { getCoins, getCoinHistory , createHistorySnapshot} from '../controller/coinController.js';

const router = express.Router();

// Define routes for coin operations 
router.get('/coins', getCoins);
router.post("/history" , createHistorySnapshot);
router.get('/history/:coinId', getCoinHistory);

export default router;
