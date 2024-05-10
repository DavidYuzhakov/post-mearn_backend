import { body } from 'express-validator'

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум из 5 символов').isLength({ min: 5 })
]

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум из 5 символов').isLength({ min: 5 }),
  body('fullName', 'Имя должно быть минимум из 3 символов').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isString(),
]

export const postCreateValidation = [
  body('title', 'Enter the title of the post (min length 2 of simbols)').isLength({ min: 2 }).isString(),
  body('text', 'Enter the text of the post (min length 10 of simbols)').isLength({ min: 10 }).isString(),
  body('tags', 'Invalid format of tags').isString().optional(),
  body('imageUrl', 'Invalid image URL').optional().isString(),
]

export const commentsValidation = [
  body('text', 'Enter the text of the comment').isString()
]