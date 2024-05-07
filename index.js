import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import cors from "cors"

import { registerValidation, loginValidation, postCreateValidation, commentsValidation } from './validations.js'
import { checkAuth, validationErrors } from "./utils/index.js"
import {UserController, PostController, CommentsController} from "./controllers/index.js"

mongoose
  .connect('mongodb+srv://admin:ddddd@cluster0.gzvdawi.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('DB ok'))
  .catch(err => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
  destination: (req, file, cb) => { // куда сохранять картинки (в папку uploads)
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

app.post('/upload', checkAuth, upload.single('image'), (req, res) => { //ожидаем св-во image с какой-то картинкой
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.post('/upload/avatar', upload.single('icon'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
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

app.listen(process.env.PORT || 4444, (err) => {
  if (err) console.log(err)

  console.log('Server OK')
})

