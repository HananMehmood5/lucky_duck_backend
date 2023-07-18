import mongooseService from './db';

import debug from 'debug';

const log = debug('app:in-memory-dao');

class Pools {
  pools = [];

  constructor() {
    log('Created new instance of Pools');
  }

  Schema = mongooseService.getMongoose().Schema;

  poolsSchema = new this.Schema({
    title: String,
    description: String,
    ticketValue: Number,
    drawDate: String,
    status: Number,
    img: String,
    participators: Array,
  });

  Pool = mongooseService.getMongoose().model('Pools', this.poolsSchema);

  async addSeedData(poolsData: Array<any>) {
    await this.Pool.deleteMany(); // Clear existing data
    return await this.Pool.insertMany(poolsData); // Seed with new data
  }

  async addPool(poolFields: any) {
    const pool = new this.Pool({
      ...poolFields,
    });
    await pool.save();
    return pool;
  }

  async getPools(limit = 25, page = 0) {
    return this.Pool.find().limit(limit).skip(limit * page).exec();
  }

  async updatePoolById(poolId: any, poolFields: any) {
    const existingPool = await this.Pool.findOneAndUpdate({ _id: poolId }, { $set: poolFields }, { new: true }).exec();
    return existingPool;
  }

  async removePoolById(poolId: any) {
    return this.Pool.deleteOne({ _id: poolId }).exec();
  }
}

const PoolsModal = new Pools();
export default PoolsModal;
