import axios from 'axios';
import CurrentData from "../model/currentCoinData.js";
import HistoryData from "../model/coinHistory.js";
import cron from "node-cron";


// This is to fetch the latest coins from CoinGecko and save them to the database
export const getCoins = async (req, res) => {
  try {
   
    const coins = await CurrentData.find({});
    console.log("coins",coins);
 
    res.status(200).json(coins);
  } catch (error) {
    console.error(' Error fetching coins:', error.message);
    res.status(500).json({ message: 'Failed to fetch coins' });
  }
};

// this is to create a history snapshot of the coins
 export const createHistorySnapshot = async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1
        }
      }
    );

    const coins = response.data;


    await HistoryData.insertMany(
      coins.map((coin) => ({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        priceUsd: coin.current_price,
        marketCap: coin.market_cap,
        percentChange24h: coin.price_change_percentage_24h,
        timestamp: new Date()
      }))
    );


  } catch (error) {
    console.error('Cron Job Error:', error);
  }
};


// this is to fetch the history of a specific coin on the basis of coinId
export const getCoinHistory = async (req, res) => {
  const { coinId } = req.params;
  try {
    const history = await HistoryData.find({ coinId }).sort({ timestamp: -1 }).limit(10);
    res.status(200).json(history);
  } catch (error) {
    console.error(' Error fetching coin history:', error.message);
    res.status(500).json({ message: 'Failed to fetch coin history.' });
  }
};


// This is a node-cron job that runs every hour to create a history snapshot of the coins
cron.schedule('0 * * * *', async () => {
   
  try{

    createHistorySnapshot();

  } catch(error){
     console.log("cron job error " , error);
  }
});

// This is to maintain the  current Coin data updated after every 30 minutes
 const maintainCurrentCoinData = async () => {
  try {

    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1
        }
      }
    );

    const coins = response.data;

    await CurrentData.deleteMany({});

        await CurrentData.insertMany(
      coins.map((coin) => ({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        priceUsd: coin.current_price,
        marketCap: coin.market_cap,
        percentChange24h: coin.price_change_percentage_24h,
        timestamp: new Date()
      }))
    );

  } catch (error) {
    console.error(' Error fetching coins:', error.message);
    res.status(500).json({ message: 'Failed to fetch coins' });
  }
};

// This is a node-cron job that runs every half hour to create a history snapshot of the coins
cron.schedule('*/30 * * * *', async () => {
   
  try{

    maintainCurrentCoinData();

  } catch(error){
     console.log("cron job error " , error);
  }
});
