import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
	try {
		const users = [
			{ id: 1, name: 'Darius Okafor' },
			{ id: 2, name: 'Jane Doe' },
		];

		return res.status(200).json({ users });
	} catch (error) {
		throw error;
	}
});

app.listen(4000, () => console.log('App listening on port 4000!'));
