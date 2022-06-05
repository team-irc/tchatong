export interface Streamer {
  id: number,
  streamerId: string,
  streamerLogin: string,
  nick: string,
  imageUrl: string,
  onAir: boolean,
  viewers: number,
  followers: number
}
