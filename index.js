const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
  try {
    await client.connect();
    const participantsCollection = client.db("event").collection("participants");

    // POST API to store participant data
    app.post('/participants', async (req, res) => {
      const { name, id } = req.body;

      if (!name || !id) {
        return res.status(400).json({ message: 'Name and ID are required.' });
      }

      const newParticipant = { name, id };

      try {
        await participantsCollection.insertOne(newParticipant);
        res.status(201).json({ message: 'Participant added successfully.', participant: newParticipant });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add participant.' });
      }
    });

    //GET API to fetch all participant data
    app.get('/participants', async (req, res) => {
        try {
            const participants = await participantsCollection.find().toArray();
            res.json(participants);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to fetch participant data.' });
        }
    });
    

    // GET API to fetch participant data
    app.get('/participants/:id', async (req, res) => {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'ID is required.' });
      }

      try {
        const participant = await participantsCollection.findOne({ id: id });

        if (participant) {
          res.json(participant);
        } else {
          res.status(404).json({ message: 'Participant not found.' });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch participant data.' });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main().catch(console.error);
