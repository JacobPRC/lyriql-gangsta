const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lyricsSchema = new Schema({
  content: String,
  song: {
    type: Schema.Types.ObjectId,
    ref: "songs",
  },
});

const Lyrics = mongoose.model("lyrics", lyricsSchema);

module.exports = Lyrics;
