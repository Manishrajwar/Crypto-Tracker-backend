

import mongoose from 'mongoose';

const currentDataSchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  priceUsd: {
    type: Number,
    required: true
  },
  marketCap: {
    type: Number,
    required: true
  },
  percentChange24h: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const CurrentData = mongoose.model('CurrentData', currentDataSchema);

export default CurrentData;
