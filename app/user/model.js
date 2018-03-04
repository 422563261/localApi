/**
 * @file
 * @author tanrich@foxmail.com
 */

const mongoose = require('mongoose')

const playlist = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: Number(Math.random().toString().slice(2))
  },
  creator: {
    type: String,
    required: true,
  },
  coverImgUrl: {
    type: String,
    default: 'http://i4.bvimg.com/627650/62c98c9d5028311f.jpg',
    required: true,
  },
  name: {
    type: String,
    default: '默认歌单',
    required: true,
  },
  trackCount: {
    type: Number,
    default: 1,
    required: true
  }
})

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  playlist: [playlist]
})

module.exports = {
  userModel: mongoose.model('user', user),
  playlistModel: mongoose.model('playlist', playlist)
}