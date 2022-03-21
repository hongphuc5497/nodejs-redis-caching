import express from 'express';
import fetch from 'node-fetch';
import redis from 'redis';

const client = redis.createClient(6379);

client.on('error', (err) => {
  console.log('Error connecting to REDIS: ', err);
})

const getPhotos = async () => {
  try {
    await client.connect();
    const photosRedisKey = 'user:photos';
    const photos = await client.get(photosRedisKey);

    if (photos) {
      return {
        source: 'cache',
        data: JSON.parse(photos),
      };
    } else {
      const res = await fetch('https://jsonplaceholder.typicode.com/photos');
      const data = await res.json();

      client.set(photosRedisKey, JSON.stringify(data));

      return {
        source: 'api',
        data: data,
      };
    }
  } catch (err) {
    return { msg: err.message };
  } finally {
    await client.disconnect();
  }
};

const app = express();

app.get('/photos', async (req, res) => {
	const result = await getPhotos();

	res.send(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
