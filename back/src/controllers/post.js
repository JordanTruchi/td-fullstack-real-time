const Post = require('~Models/post.js');
const User = require('~Models/user.js');
async function list(req, res) {
  try {
    const posts = await Post.find().populate('user').populate('likes');
    const result = {
      status: 'OK',
      code: 200,
      message: 'Postes récuprés',
      result: posts,
      user: res.locals.user.personnalData
    }

    res.status(200).json(result);

  } catch(error) {

    const code = typeof error.code === "number" ? error.code : 500,
          message = error.message || error;
    res.status(code).json(message);
  }
}

async function create (req, res) {
  try {
    const { content, user } = req.body
    const postCreated = await Post.create({ content, user: user._id });
    const result = {
      status: 'OK',
      code: 201,
      message: 'Poste crée',
      result: postCreated
    }
    res.status(201).json(result);
    const userGlobal = await User.findOne({ _id: user._id });
    result.result.user = userGlobal;
    global.io.emit('postCreate', result.result);

  } catch (error) {
    const code = typeof error.code === "number" ? error.code : 500,
          message = error.message || error;
    res.status(code).json(message);
  }
}


async function like (req, res) {
  try {
    
    const { id: idPost } = req.params,
          { idUser } = req.body;
    
    const postExist = await Post.findOne({ _id: idPost });
    if (!postExist) throw { code: 404, message: 'Post doesn\'t exist' };
    const hasAlreadyLikeIndex = postExist.likes.findIndex(like => like._id == idUser);
    let message = '';

    if (hasAlreadyLikeIndex !== -1) {
      postExist.likes.splice(hasAlreadyLikeIndex, 1);
      message = 'Post unlike'
    } else {
      postExist.likes.push(idUser);
      message = 'Post like'
    }

    postExist.save();

    const result = {
      status: 'OK',
      code: 200,
      message,
      result: 'OK'
    }
    const user = await User.findOne({ _id: idUser });
    if (hasAlreadyLikeIndex !== 1)
      global.io.emit('postDisLike', { idPost, user });
    else global.io.emit('postLike', { idPost, user });

    res.status(201).json(result);

  } catch (error) {
    const code = typeof error.code === "number" ? error.code : 500,
          message = error.message || error;
    res.status(code).json(message);
  }
}

module.exports = {
  list,
  create,
  like
}