import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      unique: true
    },
    tags: {
      type: Array,
      default: []
    },
    views: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Указывает на модель User
      required: true
    },
    imageUrl: String
  },
  {
    timestamps: true,
  }
)

// Виртуальное поле для вычисления количества комментариев для каждого поста
PostSchema.virtual('commentsCount', {
  ref: 'Comment', // Используем модель Comment для подсчета комментариев
  localField: '_id', // Поле в текущей схеме
  foreignField: 'postId', // Поле в схеме Comment, которое ссылается на _id поста
  count: true, // Указываем, что нам нужно только количество комментариев
});

// Включаем виртуальное поле в вывод при конвертации в объект
PostSchema.set('toObject', { virtuals: true });

export default mongoose.model('Post', PostSchema)
