/*
  Warnings:

  - You are about to drop the `_PlaylistToTrack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlaylistToTrack" DROP CONSTRAINT "_PlaylistToTrack_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlaylistToTrack" DROP CONSTRAINT "_PlaylistToTrack_B_fkey";

-- DropTable
DROP TABLE "_PlaylistToTrack";

-- CreateTable
CREATE TABLE "PlaylistTrack" (
    "playlistId" INTEGER NOT NULL,
    "trackId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistTrack_pkey" PRIMARY KEY ("playlistId","trackId")
);

-- AddForeignKey
ALTER TABLE "PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
