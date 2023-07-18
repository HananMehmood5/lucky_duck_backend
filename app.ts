import express from 'express';
import debug from "debug";
import cors from 'cors';
import dotenv from 'dotenv';

import Pools from "./src/modals/pools";
import { poolsData } from "./src/mocks/pools"

const debugLog = debug('app');

const config = dotenv.config();
if (config.error) {
    throw config.error;
}


// Create Express app
const app: express.Application = express();

// here we are adding middleware to parse all incoming requests as JSON 
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// Routes
app.get('/seed', async (req, res) => {
  try {
    const pools = await Pools.addSeedData(poolsData);
    res.json({pools: pools});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/pools', async (req, res) => {
  try {
    const pools = await Pools.getPools();
    res.json(pools);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/pools', async (req, res) => {
  try {
    const pool = await Pools.addPool(req.body);
    res.status(201).json(pool);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/pools/:id', async (req, res) => {
  try {
    const pool = await Pools.updatePoolById(req.params.id, req.body);
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }
    res.json(pool);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});