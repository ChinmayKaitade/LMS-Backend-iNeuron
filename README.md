# LMS (Learning Management System) 🚀🔥

## 📚 LMS Main Structure

![Main Image](./Images/LMS%20Main.jpg)

## 📚 LMS Student

![Student Side Image](./Images/LMS%20Student.jpg)

## 📚 LMS Admin

![Admin Side Image](./Images/LMS%20Admin.jpg)

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
- morgan
- nodemailer
- razorpay

## ⚒️ Image Processing via Cloudinary and Multer

![Image Processing](./Images/Image%20Process%20Clodinary%20and%20Multer.jpg)

Here’s a detailed overview of the Cloudinary and Multer packages, their uses, and how they work together in a Node.js application:

### 1. **Cloudinary**

#### **Overview:**

Cloudinary is a cloud-based image and video management service. It offers comprehensive media management capabilities, including uploading, transforming, optimizing, and delivering images and videos. Cloudinary is widely used for its ability to handle various image transformations on-the-fly and for its delivery network that ensures fast and efficient content delivery.

#### **Key Features:**

- **Image and Video Upload:** Upload media files directly to the cloud.
- **Transformation:** Resize, crop, apply effects, and transform images and videos in real-time.
- **Optimization:** Automatically optimize media files for faster delivery and better performance.
- **Content Delivery Network (CDN):** Deliver images and videos globally with minimal latency.

#### **Use Cases:**

- **E-commerce Websites:** Manage and deliver product images with optimized performance.
- **Social Media Platforms:** Handle user-uploaded images and videos, applying filters and transformations.
- **Blogs and Portfolios:** Manage media assets and ensure they are delivered quickly and in the right format.

#### **Basic Setup:**

1. **Installation:**
   ```bash
   npm install cloudinary
   ```
2. **Configuration:**

   ```javascript
   const cloudinary = require("cloudinary").v2;

   cloudinary.config({
     cloud_name: "your_cloud_name",
     api_key: "your_api_key",
     api_secret: "your_api_secret",
   });
   ```

3. **Uploading an Image:**
   ```javascript
   cloudinary.uploader.upload("path_to_image", function (error, result) {
     if (error) {
       console.error("Upload Error:", error);
     } else {
       console.log("Upload Result:", result);
     }
   });
   ```

### 2. **Multer**

#### **Overview:**

Multer is a middleware for handling `multipart/form-data` in Node.js, which is primarily used for file uploads. It works with Express and Node.js, making it easy to manage file uploads within your application.

#### **Key Features:**

- **File Storage:** Allows you to specify where and how files should be stored on your server (disk or memory).
- **File Filtering:** Provides mechanisms to filter files by type, size, etc.
- **Error Handling:** Handles errors during file upload, such as file size limits.

#### **Use Cases:**

- **Form Handling:** Manage file uploads from user-submitted forms.
- **Profile Picture Uploads:** Allow users to upload profile pictures.
- **File Management:** Handle file uploads in any application that requires users to submit files.

#### **Basic Setup:**

1. **Installation:**
   ```bash
   npm install multer
   ```
2. **Configuration:**

   ```javascript
   const multer = require("multer");

   const storage = multer.diskStorage({
     destination: function (req, file, cb) {
       cb(null, "uploads/"); // Save the file to the 'uploads/' folder
     },
     filename: function (req, file, cb) {
       cb(
         null,
         file.fieldname + "-" + Date.now() + path.extname(file.originalname)
       ); // Unique filename
     },
   });

   const upload = multer({ storage: storage });
   ```

3. **Handling File Upload in Express:**

   ```javascript
   const express = require("express");
   const app = express();

   app.post("/upload", upload.single("image"), (req, res) => {
     res.send("File uploaded successfully");
   });

   app.listen(3000, () => console.log("Server started on port 3000"));
   ```

### 3. **Using Cloudinary with Multer**

By combining Multer and Cloudinary, you can handle file uploads locally with Multer, then upload them to Cloudinary for storage and further processing.

#### **Step-by-Step Integration:**

1. **Multer Setup to Handle File Uploads:**

   ```javascript
   const multer = require("multer");
   const upload = multer({ dest: "uploads/" }); // Temporarily store files in 'uploads/' folder
   ```

2. **Cloudinary Setup:**

   ```javascript
   const cloudinary = require("cloudinary").v2;

   cloudinary.config({
     cloud_name: "your_cloud_name",
     api_key: "your_api_key",
     api_secret: "your_api_secret",
   });
   ```

3. **Handling File Upload and Transfer to Cloudinary:**

   ```javascript
   const express = require("express");
   const app = express();

   app.post("/upload", upload.single("image"), (req, res) => {
     // req.file contains the file information
     cloudinary.uploader.upload(req.file.path, function (error, result) {
       if (error) {
         return res.status(500).send("Upload to Cloudinary failed");
       }
       res.send(result); // Send the Cloudinary response back to the client
     });
   });

   app.listen(3000, () => console.log("Server started on port 3000"));
   ```

#### **Benefits of Using Both:**

- **Scalability:** Cloudinary takes care of storage, optimization, and CDN, making it easy to scale your application.
- **Convenience:** Multer handles the initial file upload from the client, and Cloudinary manages the storage and delivery.
- **Flexibility:** Allows you to apply real-time transformations and optimizations to images before they are delivered to users.

This setup is ideal for applications that require efficient media management and delivery, such as e-commerce platforms, social media applications, and content-rich websites.

## Forgot Password

![Forgot Password Image](./Images/Forgot%20Password.jpg)

## Payment Module

![Payment Module Image]()

### Student

- Subscribe
- Unsubscribe
- Verify

### Admin

- List
- View
