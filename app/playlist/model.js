/**
 * @file
 * @author tanrich@foxmail.com
 */

const mongoose = require('mongoose');

const track = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ar: [],
  al: {
    name: {
      type: String,
      required: true,
    },
    picUrl: {
      type: String,
      required: true,
    }
  }
})

const playlistDetail = new mongoose.Schema({
  coverImgUrl: {
    type: String,
    required: true,
    default: 'http://i4.bvimg.com/627650/62c98c9d5028311f.jpg',
  },
  trackCount: {
    type: Number,
    required: true,
    default: 1,
  },
  playCount: {
    type: Number,
    required: true,
    default: 0,
  },
  name: {
    type: String,
    required: true,
    default: '默认音乐',
  },
  id: {
    type: String,
    required: true,
  },
  creator: {
    avatarUrl: {
      type: String,
      required: true,
      default: 'http://i2.bvimg.com/627650/bf66dee03b557d05.jpg',
    },
    nickname: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
      default: '他什么也没留下'
    }
  },
  tracks: [track]
})

module.exports = {
  playlistDetailModel: mongoose.model('playlistDetail', playlistDetail),
  trackModel: mongoose.model('track', track),
}