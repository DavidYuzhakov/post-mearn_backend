import CommentModel from "../models/Comment.js"

export const getFromPost = async (req, res) => {
  try {
    const postId = req.params.id
    const comments = await CommentModel.find({ postId }).populate('user').exec()
    res.json(comments)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get comments'
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id)
    res.json(comment)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get one comment'
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate('user').exec()
    res.json(comments)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get all comments'
    })
  }
}

export const create = async (req, res) => {
  try {
    const postId = req.params.id
    const doc = new CommentModel({
      postId,
      user: req.userId,
      text: req.body.text
    })
    const comments = await doc.save()
    res.json(comments)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to create the comment'
    })
  }
}

export const remove = async (req, res) => {
  try {
    const commentId = req.params.id
    const deletedComment = await CommentModel.findByIdAndDelete(commentId)

    if (!deletedComment) {
      return res.status(404).json({
        message: 'Not found this comment'
      })
    } 

    res.json({
      success: true
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to remove this comment'
    })
  }
}

export const edit = async (req, res) => {
  try {
    const commentId = req.params.id

    const updatedComment = await CommentModel.findByIdAndUpdate(
      commentId, { text: req.body.text}, { new: true }
    )
    res.json(updatedComment)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to edit this comment'
    })
  }
}