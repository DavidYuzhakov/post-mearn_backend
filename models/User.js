import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  avatarUrl: String
}, {
  timestamps: true // автоматически при создании любого user должна прикрутить дату создания и обновления сущности
})

export default mongoose.model('User', UserSchema) // 1й параметр применяется при запуске MongoDB Compass в папке db на основе этого параметра создается внтуренняя папка