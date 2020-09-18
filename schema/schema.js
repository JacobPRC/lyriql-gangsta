const graphql = require("graphql");
const mongoose = require("mongoose");

const Song = require("../models/Songs");
const Lyrics = require("../models/Lyrics");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const SongType = new GraphQLObjectType({
  name: "Song",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    lyrics: {
      type: new GraphQLList(LyricsType),
      resolve(parentValue, args) {
        return Song.findById(parentValue.id)
          .populate("lyrics")
          .then((song) => song.lyrics);
      },
    },
  }),
});

const LyricsType = new GraphQLObjectType({
  name: "Lyrics",
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    song: {
      type: SongType,
      resolve(parentValue, args) {
        return Lyrics.findById(parentValue.id)
          .populate("songs")
          .then((lyrics) => lyrics.song);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    songs: {
      type: new GraphQLList(SongType),
      resolve(parentValue, args) {
        return Song.find({});
      },
    },
    song: {
      type: SongType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Song.findById(id);
      },
    },
    lyrics: {
      type: LyricsType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Lyrics.findById(id);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addSong: {
      type: SongType,
      args: { title: { type: GraphQLString } },
      resolve(parentValue, { title }) {
        return new Song({ title }).save();
      },
    },
    addLyricToSong: {
      type: SongType,
      args: {
        content: { type: GraphQLString },
        songId: { type: GraphQLID },
      },
      resolve(parentValue, { content, songId }) {
        return Song.addLyric(songId, content);
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation });
