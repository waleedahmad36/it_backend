import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  thumbnail: { type: String, default: "" },
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', playlistSchema);
export default Playlist;
