const path = require('path');
const express = require('express');
const { connectToMongoDB } = require('./database');
const cors = require('cors');

const app = express()
app.use(cors(
	{
		origin: ["https:todos-list-bb.vercel.app"],
		methods: ['POST' , 'GET'],
		credentials: true 
	}
));

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const router = require('./routes');
app.use('/api', router);

const port = process.env.PORT || 5000;

async function startServer() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });
}
startServer();
