/**
 * @file
 * @author tanrich@foxmail.com
 */

const mongoose = require('mongoose');
const router = require('koa-router')();
const { commentModel, commentListModel } = require('./model');

router.prefix('/comment');

// 获取评论
router.get('/music', async (ctx, next) => {
  try {
    let { offset, id } = ctx.request.query;
    offset = Number(offset);

    const total = (await commentModel.findOne({id})).total;
    let limit = 10;
    if (offset > total) {
      ctx.body = {
        code: 200,
        id,
        comments: [],
        hotComments: [],
      };
      return;
    }

    let start = total - limit - offset;
    if (start < 0) {
      start = 0;
      limit = total - limit - offset + 10;
    }

    const comment = await commentModel.findOne({id}).slice('comments', [start, limit]) || {
      _doc: {
        total: 0,
        comments: [],
        hotComments: [],
        id,
      }
    };

    ctx.body = {
      code: 200,
      ...comment._doc
    }
  } catch (err) {
    console.log(err);
    ctx.body = {
      code: 0
    }
  }
});

// 发表评论
router.post('/publish', async (ctx, next) => {
  try {
    const username = ctx.session.user.username;
    const { id, content } = ctx.request.body;

    // 检查这是否有这首歌曲的comment
    let newCommentModel = await commentModel.findOne({ id });
    if (!newCommentModel) {
      newCommentModel = new commentModel({ id });
    }

    // 新建歌曲评论model
    const newCommentListModel = new commentListModel({
      commentId: new mongoose.Types.ObjectId,
      user: {
        nickname: username,
      },
      content: content || ''
    });

    newCommentModel.total += 1;
    newCommentModel.comments.push(newCommentListModel);
    await newCommentModel.save();
    ctx.body = {
      code: 200,
      total: newCommentModel.total,
      _id: newCommentModel._id,
      comments: [newCommentListModel]
    }
  } catch (err) {
    console.log(err);
    ctx.body = {
      code: 0
    }
  }
});

// 点赞&&取消赞
router.put('/like', async (ctx, next) => {
  try {
    const { _id, commentId, agree } = ctx.request.body;
    const commentRes = await commentModel.findById(_id);
    if (!commentRes) throw Error('没有这个歌曲评论');
    commentRes.comments = commentRes.comments.map(item => {
      if (item.commentId.toString() === commentId) {
        const likedCount = agree ? ++item.likedCount : --item.likedCount;
      }
      return item;
    });
    commentRes.save();
    ctx.body = {
      code: 200
    }
  } catch (err) {
    console.log(err);
    ctx.body = {
      code: 0
    }
  }
});

module.exports = router;