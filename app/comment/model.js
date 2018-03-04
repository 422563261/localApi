/**
 * @file
 * @author tanrich@foxmail.com
 */

const mongoose = require('mongoose');

const commentList = new mongoose.Schema({
  user: {
    nickname: String,
    avatarUrl: {
      type: String,
      default: 'http://i2.bvimg.com/627650/bf66dee03b557d05.jpg',
    },
  },
  likedCount: {
    type: Number,
    default: 0,
  },
  _id: false,
  commentId: mongoose.Schema.Types.ObjectId,
  time: {
    type: Date,
    default: Date.now
  },
  content: String,
  agree: {
    type: Boolean,
    default: false,
  },
});

const comment = new mongoose.Schema({
  id: String,
  total: {
    type: Number,
    default: 0,
  },
  comments: [commentList],
  hotComments: []
});

module.exports = {
  commentModel: mongoose.model('comment', comment),
  commentListModel: mongoose.model('commentList', commentList)
}