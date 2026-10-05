export interface SongEntry {
  /** Unique id, used as React key */
  id: string;
  /** Audio file path, relative to /public. Example: "/whose-song/audio/track1.mp3" */
  audioSrc: string;
  /** Who has this song in their playlist */
  owner: "player2" | "player1";
  startTime?: number;
  clipDuration?: number;
}

/**
 * Add one entry per song here, in the order they should be played.
 * Drop the audio file in: public/whose-song/audio/
 */
export const SONGS: SongEntry[] = [
  { id: "song-4", audioSrc: "/whose-song/audio/track4.mp3", owner: "player1", startTime: 50, clipDuration: 40},
  { id: "song-12", audioSrc: "/whose-song/audio/track12.mp3", owner: "player2" , startTime: 3, clipDuration: 40},
  { id: "song-7", audioSrc: "/whose-song/audio/track7.mp3", owner: "player1" , startTime: 35, clipDuration: 40},
  { id: "song-2", audioSrc: "/whose-song/audio/track2.mp3", owner: "player1" , startTime: 33.5, clipDuration: 40},
  { id: "song-14", audioSrc: "/whose-song/audio/track14.mp3", owner: "player2" , startTime: 76, clipDuration: 40},
  { id: "song-9", audioSrc: "/whose-song/audio/track9.mp3", owner: "player2" , startTime: 50, clipDuration: 40},
  { id: "song-1", audioSrc: "/whose-song/audio/track1.mp3", owner: "player1", startTime: 53, clipDuration: 40 },
  { id: "song-11", audioSrc: "/whose-song/audio/track11.mp3", owner: "player2" , startTime: 41, clipDuration: 40},
  { id: "song-6", audioSrc: "/whose-song/audio/track6.mp3", owner: "player1" , startTime: 98, clipDuration: 40},
  { id: "song-13", audioSrc: "/whose-song/audio/track13.mp3", owner: "player2" , startTime: 67, clipDuration: 40},
  { id: "song-5", audioSrc: "/whose-song/audio/track5.mp3", owner: "player1" , startTime: 31, clipDuration: 40},
  { id: "song-10", audioSrc: "/whose-song/audio/track10.mp3", owner: "player2" , startTime: 68, clipDuration: 40},
  { id: "song-8", audioSrc: "/whose-song/audio/track8.mp3", owner: "player2" , startTime: 38, clipDuration: 40},
  { id: "song-3", audioSrc: "/whose-song/audio/track3.mp3", owner: "player1" , startTime: 56, clipDuration: 40},
];

/** Photos shown on each side. Drop images in public/whose-song/photos/. */
export const PLAYER_PHOTOS = {
  player2: "/whose-song/photos/player2.jpg",
  player1: "/whose-song/photos/player1.jpg",
} as const;

export const PLAYER_NAMES = {
  player2: "player2",
  player1: "player1",
} as const;
