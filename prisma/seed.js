const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

const seed = async () => {
  const numUsers = 5;
  const numPlaylists = 10;
  const numTracks = 20;

  // Create users with fake data
  const users = Array.from({ length: numUsers }, () => ({
    username: faker.internet.userName(),
  }));
  await prisma.user.createMany({ data: users });

  // Create tracks with fake data
  const tracks = Array.from({ length: numTracks }, () => ({
    name: faker.music.songName(),
  }));
  await prisma.track.createMany({ data: tracks });

  const allUsers = await prisma.user.findMany();
  const allTracks = await prisma.track.findMany();

  // Create playlists with random tracks
  for (let i = 0; i < numPlaylists; i++) {
    const numTracksInPlaylist = 1 + Math.floor(Math.random() * 5); // 1-5 tracks per playlist
    const trackIds = new Set();

    while (trackIds.size < numTracksInPlaylist) {
      trackIds.add(allTracks[Math.floor(Math.random() * numTracks)].id);
    }

    const playlist = await prisma.playlist.create({
      data: {
        name: faker.lorem.words(2),  // Random playlist name
        description: faker.lorem.sentence(),  // Random playlist description
        owner: {
          connect: {
            id: allUsers[Math.floor(Math.random() * numUsers)].id,
          },
        },
      },
    });

    // Associate random tracks with the playlist
    const playlistTracks = Array.from(trackIds).map((trackId) => ({
      playlistId: playlist.id,
      trackId: trackId,
    }));

    await prisma.playlistTrack.createMany({ data: playlistTracks });
  }

  console.log('Seeding completed!');
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
