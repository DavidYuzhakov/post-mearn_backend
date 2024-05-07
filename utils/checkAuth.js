import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization ?? '').replace(/Bearer\s?/, '')

  if (token) {
    try {
      console.log(token)
      const decoded = jwt.verify(token, 'secret123')
      
      req.userId = decoded._id
      next() // если не вызвать то в insomnia будет загрузка, при вызoве этой функции мы говорим что в index.js app.get('/auth/me') продолжи работу там
    } catch (err) {
      console.log(err)
      return res.status(403).json({
        message: 'No access'
      })
    }
  } else {
    return res.status(403).json({
      message: 'No access!'
    })
  }
}