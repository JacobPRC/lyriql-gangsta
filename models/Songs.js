const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const songSchema = new Schema({
  title: String,
  lyrics: [
    {
      type: Schema.Types.ObjectId,
      ref: "lyrics",
    },
  ],
});

songSchema.statics.addLyric = function (id, content) {
  const Lyrics = require("./Lyrics");

  return Songs.findById(id).then((song) => {
    const lyric = new Lyrics({ content, song });
    song.lyrics.push(lyric);
    return Promise.all([lyric.save(), song.save()]).then(
      ([lyric, song]) => song
    );
  });
};

const Songs = mongoose.model("songs", songSchema);

module.exports = Songs;
