import express from "express"
import mongoose from "mongoose"
import fs from "fs"
import multer from "multer"
import cors from "cors"
import cloudinary from "cloudinary"

import { registerValidation, loginValidation, postCreateValidation, commentsValidation } from './validations.js'
import { checkAuth, validationErrors } from "./utils/index.js"
import {UserController, PostController, CommentsController} from "./controllers/index.js"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB ok'))
  .catch(err => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
  destination: (req, file, cb) => { // куда сохранять картинки (в папку uploads)
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads') // если будет mkdir - ассинхронно то не вызовится cb в любом случае
    }
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => { // как будет называться файл
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

app.use(express.json()) // позволяет читать json-формат
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, validationErrors, UserController.login)
app.post('/auth/register', registerValidation, validationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), async (req, res) => { //ожидаем св-во image с какой-то картинкой
  try {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path)
    res.json({ url: secure_url })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to upload image to Cloudinary'
    })
  }
})
app.post('/upload/avatar', upload.single('icon'), async (req, res) => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path)
    res.json({ url: secure_url })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to upload icon to Cloudinary'
    })
  }
})

app.get('/posts', PostController.getAll)
app.get('/tags', PostController.getLastTags)
app.get('/tags/:tag', PostController.getPostsByTags)
app.get('/posts/:id', PostController.getOne) 
app.post('/posts', checkAuth, postCreateValidation, validationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, validationErrors, PostController.update)

app.get('/comments/:id', CommentsController.getFromPost)
app.get('/comment/:id', CommentsController.getOne)
app.get('/comments', CommentsController.getAll)
app.post('/comments/:id', checkAuth, commentsValidation, validationErrors, CommentsController.create)
app.delete('/comments/:id', checkAuth, CommentsController.remove)
app.patch('/comments/:id', checkAuth, commentsValidation, validationErrors, CommentsController.edit)

const port = process.env.PORT || 4444
app.listen(port, (err) => {
  if (err) console.log(err)

  console.log(`Server OK on ${port} port`)
})

