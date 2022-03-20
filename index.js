import express from 'express';
import fetch from 'node-fetch';
import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => {
	console.log('Redis Error ' + err);
});

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
