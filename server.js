import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Users Routes
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: { playlists: true },
  });
  res.json(user);
});

// Playlists Routes
app.get('/playlists', async (req, res) => {
  const playlists = await prisma.playlist.findMany();
  res.json(playlists);
});

app.post('/playlists', async (req, res) => {
  const { name, description, ownerId, trackIds } = req.body;

  const playlist = await prisma.playlist.create({
    data: {
      name,
      description,
      owner: { connect: { id: ownerId } },
      tracks: {
        connect: trackIds.map(trackId => ({ id: trackId })),
      },
    },
  });
  res.json(playlist);
});

app.get('/playlists/:id', async (req, res) => {
  const { id } = req.params;
  const playlist = await prisma.playlist.findUnique({
    where: { id: parseInt(id) },
    include: { tracks: true },
  });
  res.json(playlist);
});

// Tracks Routes
app.get('/tracks', async (req, res) => {
  const tracks = await prisma.track.findMany();
  res.json(tracks);
});

app.get('/tracks/:id', async (req, res) => {
  const { id } = req.params;
  const track = await prisma.track.findUnique({
    where: { id: parseInt(id) },
  });
  res.json(track);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
