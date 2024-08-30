# LMS (Learning Management System) 🚀🔥

## 📚 LMS Main Structure

![Main Image](./LMS%20Main.jpg)

## 📚 LMS Student

![Student Side Image](./LMS%20Student.jpg)

## 📚 LMS Admin

![Admin Side Image](./LMS%20Admin.jpg)

### 💡 Server Structure

```
Server
    - package.json (dependencies)
    - package-lock.json (dependencies more info)
    - .gitignore (git related)
    - .env (environment variables)
    - server.js (root file)
    - app.js (configuration files for routes, etc.)
    - routes
        - user route
        - course route
        - payment route
        - miscellaneous route (contact, about, etc)
    -controllers
        - user controller
        - course controller
        - payment controller
        - miscellaneous controller
    -configs
        - data base configurations
    - models
        - user model
        - course model
        - payment model
    - middlewares
        - auth middleware (authentication)
        - error middleware (error)
        - multer
        - async handler middleware
    - utils
        - mail send
        - error tracking, etc
```

### ⚒️ Dependencies

- bcryptjs
- cloudinary
- cookie-parser
- cors
- dotenv
- express
- jsonwebtoken
- mongoose
- multer
- nodemailer
- razorpay
