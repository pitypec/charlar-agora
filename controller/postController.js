import Post from '../models/postModel.js';
import User from '../models/userModel.js';
export const getComments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const post = await Post.findById(req.params.postId).sort('-createdAt');
    if (post) {
      const comments = post.comments.slice();
      if (!comments) {
        return res.status(400).json({ msg: 'no comments' });
      } else {
        return res.status(200).json(comments);
      }
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getUserPost = async (req, res, next) => {
  try {
    const post = await Post.find({});
    if (post) {
      const userPost = post.filter(
        (p) => JSON.stringify(p.userid) === JSON.stringify(req.params.userId)
      );
      return res.status(200).json(userPost);
    } else {
      return res.status(400).json({ msg: 'no post found' });
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
export const getAllPost = async (req, res, next) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(400).json({ msg: 'post not found' });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { message, images } = req.body;
    const id = req.user._id;
    const newPost = new Post({
      userid: id,
      message
    });
    for (let i = 0; i < images.length; i++) {
      let image = {
        secure_url: images[i].secure_url,
        publicId: images[i].public_id
      };
      newPost.images.push(image);
    }
    await newPost.save();
    return res.status(200).json({ msg: 'post created successfully' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }
    return res.status(200).json({ msg: 'Post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const createComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(req.user._id);
    const post = await Post.findById(req.params.postId);
    if (post) {
      post.comments.unshift({
        userId,
        message: req.body.message
      });
      post.commentCount++;
      await post.save();
      return res.status(200).json({ msg: 'comment sent' });
    } else {
      return res.status(400).json({ msg: 'post not found' });
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const post = await Post.findById(req.params.postId);
    if (post) {
      const comment = post.comments.filter(
        (c) => c._id == req.params.commentId
      );
      if (!comment) {
        return res.status(400).json({ msg: 'comment not found' });
      } else {
        return res.status(200).json(comment);
      }
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const post = await Post.findById(req.params.postId);
    if (post) {
      const commentIndex = post.comments.findIndex(
        (c) => c._id == req.params.commentId
      );
      if (
        JSON.stringify(post.comments[commentIndex].userId) ===
        JSON.stringify(userId)
      ) {
        console.log(commentIndex);
        post.comments.splice(commentIndex, 1);
        console.log(post.comments);
        await post.save();
        console.log(post);
        return res.status(200).json({ msg: 'deleted successfully' });
      } else {
        return res.status(401).json({ msg: 'action not allowed' });
      }
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const likePost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const post = await Post.findById(req.params.postId);
    if (post) {
      if (
        post.likes.find(
          (like) => JSON.stringify(like.userId) === JSON.stringify(userId)
        )
      ) {
        post.likes = post.likes.filter(
          (like) => JSON.stringify(like.userId) !== JSON.stringify(userId)
        );
        post.likeCount--;
        await post.save();
        return res.status(200).json({ msg: 'post unliked successfully' });
      } else {
        post.likes.push({
          userId
        });
        post.likeCount++;
        await post.save();
        return res.status(200).json({ msg: 'post liked successfully' });
      }
    } else {
      return res.status(400).json({ msg: 'post not found' });
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
