import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec()
    const tags = posts.map(post => post.tags).flat().slice(0, 5)
    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get last tags'
    })
  }
}  

export const getPostsByTags = async (req, res) => {
  try {
    const tag = req.params.tag
    const posts = await PostModel.find({ tags: tag  }).populate('user').exec()
    res.json(posts)
    } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to find posts by tags'
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const { sort } = req.query
    let posts
      
    if (sort === 'new') {
      posts = await PostModel.find().sort({ createdAt: -1 }).populate('user').exec() //populate - подключение связи которые указал в таблице в поле ref 1й парамет указывает на то, какое поле я должен заполнить | -1 - desc; 1- ask sorting
    } else if (sort === 'popular') {
      posts = await PostModel.find().sort({ views: -1 }).populate('user').exec()
    } else {
      throw Error('This type of sorting is not exist')
    }

    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get all posts',
    })
  }
}


export const getOne = async (req, res) => {
  try {
    const postId = req.params.id
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } }, // поле views увелечится на ед.
      { new: true } // возвратить обновленный документ
    ).populate('user').exec()

    if (!updatedPost) {
      return res.status(404).json({
        message: 'The post is not found',
      })
    }

    res.json(updatedPost)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get the post',
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id
    const deletedPost = await PostModel.findByIdAndDelete(postId)

    if (!deletedPost) {
      return res.status(404).json({
        message: 'The post is not found'
      })
    }

    res.json({
      success: true
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to delete the post',
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id
    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(',')
      }
    )

    res.json({
      success: true
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to updated your post'
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    })

    const post = await doc.save()

    post.commentsCount = 0

    res.json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to create post',
    })
  }
}
