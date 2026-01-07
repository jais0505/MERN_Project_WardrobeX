const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();
const cors = require("cors");
const mailer = require("nodemailer");

const Razorpay = require("razorpay");
const crypto = require("crypto");

require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//JWT Auth MiddleWare
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { userId, role }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


// const bodyParser = require("body-parser");
const port = 5000;
const multer = require("multer");
const { type } = require("os");

const PATH = "./public/images";
const upload = multer({
  storage: multer.diskStorage({
    destination: PATH,
    filename: function (req, file, cb) {
      let originalname = file.originalname;
      let ext = originalname.split(".").pop();
      let filename = originalname.split(".").slice(0, -1).join(".");
      cb(null, filename + "." + ext);
    },
  }),
});

app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.listen(port, () => {
  try {
    console.log(`Server is running ${port}`);
    mongoose.connect(
      "mongodb+srv://jaisjose:jaisjose@cluster0.860prdz.mongodb.net/db_wardrobex"
    );
    console.log("db connection established");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
});

var transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: "contact.wardrobe.official@gmail.com", //from email Id
    pass: "ypdscrtcfreqjvwj", // App password created from google account
  },
});
function sendEmail(to, content, subject) {
  const mailOptions = {
    from: "contact.wardrobe.official@gmail.com", //from email Id for recipient can view
    to,
    subject: subject,
    html: content,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sented");
    }
  });
}

app.get("/Test", (req, res) => {
  console.log(req.body);
  res.send({ message: "Hi" });
});
 






const adminSchemaStructure = new mongoose.Schema({
  adminName: {
    type: String,
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
  },
  adminContact: {
    type: String,
    required: true,
  },
  adminPassword: {
    type: String,
    required: true,
  },
});

adminSchemaStructure.pre("save", async function (next) {
  if (!this.isModified("adminPassword")) return next();

  try{
    const salt = await bcrypt.genSalt(10);
    this.adminPassword = await bcrypt.hash(this.adminPassword, salt);
    next();
  } catch (err) {
    next(err);
  }
});

adminSchemaStructure.methods.comparePassword = async function (
  candidatePassword
) {
  return await bcrypt.compare(candidatePassword, this.adminPassword);
}

const Admin = mongoose.model("admincollection", adminSchemaStructure);

  app.post("/Admin", async (req, res) => {
    try {
      const { adminName, adminEmail, adminContact, adminPassword } = req.body;

      let admin = await Admin.findOne({ adminEmail });

      if (admin) {
        return res.json({ message: "Admin already exists" });
      }

      admin = new Admin({
        adminName,
        adminEmail,
        adminContact,
        adminPassword,
      });

      await admin.save();

      res.json({ mesasge: "Admin registered successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

app.get("/Admin", async (req, res) => {
  try {
    const admin = await Admin.find();

    if (admin.length === 0) {
      return res.send({ message: "Admin not found" });
    } else {
      res.send({ admin }).status(200);
    }
  } catch (err) {
    console.error("Error finding admin:", err);
    res.status(500).json({ message: "internal server error" });
  }
});

app.get("/AdminById/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findById(adminId).select("-adminPassword");

    if (!admin) {
      return res.send({ mesasge: "Admin not found", admin: {} });
    } else {
      res.send({ admin }).status(200);
    }
  } catch (err) {
    console.error("Error finding Admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Admin/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const deleteAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deleteAdmin) {
      return res.json({ message: "Admin not found" });
    } else {
      res.json({ message: "Admin deleted successfully", deleteAdmin });
    }
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Admin/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const { adminName, adminEmail, adminContact, adminPassword } = req.body;

    let admin = await Admin.findByIdAndUpdate(
      adminId,
      { adminName, adminEmail, adminContact },
      { new: true }
    );

    if (admin) {
      res.json({ message: "Admin updated successfully" });
    } else {
      res.json({ message: "Admin not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Admin edit profile
app.put("/AdminUpdate/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { adminName, adminContact } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { adminName, adminContact },
      { new: true, select: "-adminPassword" } // return updated without password
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      message: "Profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (err) {
    console.error("Admin Update Error", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Admin Password Change
app.put("/AdminChangePassword/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // compare old password using schema method
    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    admin.adminPassword = newPassword;

    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change Password Error", err);
    res.status(500).json({ message: "Server error" });
  }
});


const shopSchemaStructure = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  shopEmail: {
    type: String,
    required: true,
  },
  shopContact: {
    type: String,
    required: true,
  },
  shopPassword: {
    type: String,
    required: true,
  },
  shopAddress: {
    type: String,
    required: true,
  },
  shopImage: {
    type: String,
    required: true,
  },
  shopProof: {
    type: String,
    required: true,
  },
  PANNO: {
    type: String,
    required: true,
  },
  GSTNO: {
    type: String,
    required: true,
  },
  shopLocation: {
    type: String,
    required: true,
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "placecollection",
    // required: true
  },
  shopStatus: {
    type: String,
    enum: ["pending", "rejected", "verified"],
    default: "pending",
  },
});

shopSchemaStructure.pre("save", async function (next) {
  if (!this.isModified("shopPassword")) return next();

  try{
    const salt = await bcrypt.genSalt(10);
    this.shopPassword = await bcrypt.hash(this.shopPassword, salt);
    next();
  } catch (err) {
    next(err);
  }
});

shopSchemaStructure.methods.comparePassword = async function (
  candidatePassword
) {
  return await bcrypt.compare(candidatePassword, this.shopPassword);
};


const Shop = mongoose.model("shopcollection", shopSchemaStructure);

app.post(
  "/Shop",
  upload.fields([
    { name: "shopImage", maxCount: 1 },
    { name: "shopProof", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        shopName,
        shopEmail,
        shopContact,
        shopPassword,
        shopAddress,
        PANNO,
        GSTNO,
        shopLocation,
        placeId,
      } = req.body;

      let shop = await Shop.findOne({ shopEmail });

      if (shop) {
        return res.json({ message: "Shop already exists" });
      }

      const baseUrl = `http://127.0.0.1:${port}`;

      const shopImage = req.files.shopImage
        ? `${baseUrl}/images/${req.files.shopImage[0].filename}`
        : "";
      const shopProof = req.files.shopProof
        ? `${baseUrl}/images/${req.files.shopProof[0].filename}`
        : "";

      shop = new Shop({
        shopName,
        shopEmail,
        shopContact,
        shopPassword,
        shopAddress,
        PANNO,
        GSTNO,
        shopLocation,
        shopImage,
        shopProof,
        placeId,
      });

      await shop.save();

      res.json({
        message:
          "Registration completed successfully! Please wait for verification.",
        shop,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

app.get("/Shop", async (req, res) => {
  try {
    const shop = await Shop.find();

    if (shop.length === 0) {
      return res.send({ message: "Shop not found", shop: [] });
    } else {
      res.send({ shop }).status(200);
    }
  } catch (err) {
    console.error("Error finding shops:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch specific shop data
app.get("/Shop/:id", async (req, res) => {
  try {
    const shopId = req.params.id;
    const shop = await Shop.findById(shopId).populate({
      path: "placeId",
      populate: { path: "districtId" },
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({ shop });
  } catch (err) {
    console.error("Error fetching shop details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Shop/:id", async (req, res) => {
  try {
    const shopId = req.params.id;
    const deleteShop = await Shop.findByIdAndDelete(shopId);

    if (!deleteShop) {
      return res.json({ message: "Shop not found" });
    } else {
      res.json({ message: "Shop deleted successfully", deleteShop });
    }
  } catch (err) {
    console.error("Error deleting shop:", err);
    res.status(500).json({ message: "Internal srever error" });
  }
});

app.put(
  "/Shop/:id",
  upload.fields([
    { name: "shopImage", maxCount: 1 },
    { name: "shopProof", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const shopId = req.params.id;
      const {
        shopName,
        shopEmail,
        shopContact,
        shopPassword,
        shopAddress,
        PANNO,
        GSTNO,
        shopLocation,
      } = req.body;

      const shopImage = req.files.shopImage
        ? "/images/" + req.files.shopImage[0].filename
        : "";
      const shopProof = req.files.shopProof
        ? "/images/" + req.files.shopProof[0].filename
        : "";

      let shop = await Shop.findByIdAndUpdate(
        shopId,
        {
          shopName,
          shopEmail,
          shopContact,
          shopPassword,
          shopAddress,
          PANNO,
          GSTNO,
          shopLocation,
          shopImage,
          shopProof,
        },
        { new: true }
      );

      if (!shop) {
        return res.json({ message: "Shop not found" });
      } else {
        res.json({ message: "Shop updated successfully" });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//Shop editing
app.put(
  "/ShopEditing/:id",
  upload.fields([{ name: "shopImage", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { shopName, shopContact, shopAddress, shopLocation } = req.body;

      let updateData = {
        shopName,
        shopContact,
        shopAddress,
        shopLocation,
      };

      // Only update image if uploaded
      if (req.files.shopImage) {
        updateData.shopImage = `http://127.0.0.1:5000/images/${req.files.shopImage[0].filename}`;
      }

      const updatedShop = await Shop.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      );

      res.json({ message: "Shop updated", shop: updatedShop });
    } catch (err) {
      console.error("Error updating shop:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Change Shop Password
app.put("/ShopChangePassword/:id", async (req, res) => {
  try {
    const shopId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    // Validate fields
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // Check old password
    if (shop.shopPassword !== oldPassword) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Update password
    shop.shopPassword = newPassword;
    await shop.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Shop Verification
app.put(`/ShopVerification/:id`, async (req, res) => {
  try {
    const shopId = req.params.id;
    const { status } = req.body;

    let shop = await Shop.findByIdAndUpdate(
      shopId,
      { shopStatus: status },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    const isVerified = status === "verified";
    const message = isVerified
      ? "Shop verified successfully"
      : "Shop rejected successfully";

    const content = `
<html>
<head>
  <title>Shop Verification Status</title>
  <style>
    .container {
      width: 90%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f2f2f2;
      font-family: Arial, sans-serif;
    }

    .box {
      background-color: #ffffff;
      padding: 25px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .title {
      font-size: 22px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 10px;
    }

    .status {
      font-size: 32px;
      font-weight: bold;
      color: ${isVerified ? "#00b300" : "#e60000"};
      margin: 10px 0;
    }

    .message {
      font-size: 16px;
      color: #555555;
      margin-top: 10px;
      line-height: 1.6;
    }

    .footer {
      font-size: 13px;
      color: #888888;
      margin-top: 25px;
      border-top: 1px solid #e0e0e0;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="box">
      <div class="title">Shop Verification Update</div>
      <div class="status">${isVerified ? "✅ Verified" : "❌ Rejected"}</div>
      <div class="message">
        Hi <strong>${shop.shopName}</strong>,<br><br>
        ${
          isVerified
            ? "We are happy to inform you that your shop has been successfully verified. You can now access all the platform features by login."
            : "Unfortunately, your shop verification request has been rejected. Please review your submitted details and reapply for verification. If you need any help contact admin."
        }
      </div>
      <div class="footer">
        Thank you for being a part of our platform.<br>
        <strong>Wardrobe</strong>
      </div>
    </div>
  </div>
</body>
</html>
`;
    sendEmail(
      shop.shopEmail,
      content,
      status ? "Shop Registration Verified" : "Shop registrarion Rejected"
    );
    res.status(200).json({ message, shop });
  } catch (err) {
    console.error("Error verifying shop:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const userSchemaStructure = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userContact: {
    type: String,
    // required: true
  },
  userPassword: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiry: {
    type: Date,
  },
  userAddress: {
    type: String,
    // required: true
  },
  userLocation: {
    type: String,
    required: true,
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "placecollection",
    // required: true
  },
  loginOtp: {
    type: String
  },
  loginOtpExpiry: {
    type: Date
  }
});

userSchemaStructure.pre("save", async function (next) {
  if (!this.isModified("userPassword")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.userPassword = await bcrypt.hash(this.userPassword, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchemaStructure.methods.comparePassword = async function (
  candidatePassword
) {
  return await bcrypt.compare(candidatePassword, this.userPassword);
};

const User = mongoose.model("usercollection", userSchemaStructure);

app.post("/User", async (req, res) => {
  try {
    const {
      userName,
      userEmail,
      userContact,
      userPassword,
      userAddress,
      userLocation,
      placeId,
    } = req.body;

    console.log(req.body);

    let user = await User.findOne({ userEmail });

    if (user) {
      return res.json({ message: "User already exists" });
    }

    user = new User({
      userName,
      userEmail,
      userContact,
      userPassword,
      userAddress,
      userLocation,
      placeId,
    });

    await user.save();

    res.json({ message: "User registartion successfully completed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/User", async (req, res) => {
  try {
    const user = await User.find().populate("placeId");
    if (user.length === 0) {
      return res.send({ message: "Users not found", user: [] });
    } else {
      res.send({ user }).status(200);
    }
  } catch {
    console.error("Error finding User:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/UserDataFetch", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("placeId");
    res.json({ user });
    if (!user.length) {
      return res.send({ message: "User not found"});
    } else {  
      res.send({ user }).status(200);
    }
  } catch {
    console.error("Error finding User:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/UserAddress", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select(
      "userName userContact userAddress"
    );

    if (!user) {
      return res.status(404).json({ massage: "User not found" });
    }

    res.status(200).json({
      userName: user.userName,
      contactNo: user.userContact,
      userAddress: user.userAddress,
    });
  } catch (err) {
    console.error("Error fetching user address:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/User/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deleteUser = await User.findByIdAndDelete(userId);

    if (!deleteUser) {
      return res.json({ message: "User not found" });
    } else {
      res.json({ message: "User deleted successfully", deleteUser });
    }
  } catch (err) {
    console.error("Error deleting User:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/UserEditProfile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { userName, userContact, userAddress, userLocation, placeId } =
      req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    }).populate("placeId");

    res.json({ user: updatedUser });

    if (!updatedUser) {
      return res.json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ userEmail: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetToken = otp;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const content = `
      <h2>Password Reset OTP</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    `;

    sendEmail(user.userEmail, content, "Password Reset OTP");

    res.json({
      message: "OTP sent to your email",
      userId: user._id, // IMPORTANT
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/verify-reset-otp", async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);

  if (
    !user ||
    user.resetToken !== otp ||
    user.resetTokenExpiry < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified" });
});



app.post("/reset-password", async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.userPassword = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


const productSchemaStructure = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shopcollection",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategorycollection",
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  fitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "fitcollection",
  },
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "materialcollection",
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brandcollection",
    required: true,
  },
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "typecollection",
    required: true,
  },
  // Singel Image
  productImage: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("productcollection", productSchemaStructure);

app.post("/Product", upload.single("productImage"), async (req, res) => {
  try {
    const {
      shopId,
      productName,
      productDescription,
      subcategoryId,
      productPrice,
      fitId,
      materialId,
      brandId,
      typeId,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    let product = await Product.findOne({ productName });

    if (product) {
      return res.json({ message: "Product already exists" });
    }

    product = new Product({
      shopId,
      productName,
      productDescription,
      subcategoryId,
      productPrice,
      fitId,
      materialId,
      brandId,
      typeId,
      productImage: req.file.filename,
    });

    await product.save();

    res.json({ message: "Product adding completed successfully", product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Product", async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: "subcategoryId",
        populate: {
          path: "categoryId",
        },
      })
      .populate("shopId")
      .populate("brandId");

    if (products.length === 0) {
      return res.send({ message: "Products not found", products: [] });
    } else {
      return res.status(200).send({ products });
    }
  } catch (err) {
    console.error("Error finding products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/Product/Shop/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    const products = await Product.find({ shopId })
      .populate({
        path: "subcategoryId",
        populate: { path: "categoryId" },
      })
      .populate("shopId")
      .populate("brandId");

    if (products.length === 0) {
      return res
        .status(404)
        .send({ message: "No products found for this shop", products: [] });
    }

    return res.status(200).send({ products });
  } catch (err) {
    console.error("Error finding products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/Product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId)
      .populate({
        path: "subcategoryId",
        populate: {
          path: "categoryId",
          model: "categorycollection",
        },
      })
      .populate("fitId")
      .populate("typeId")
      .populate("brandId")
      .populate("materialId")
      .populate("shopId");

    if (!product) {
      return res.send({ message: "Product not found" });
    }

    // Fetch reviews for this product
    const reviews = await ReviewRating.find({ productId: product._id })
      .sort({ reviewDate: -1 }) // newest first
      .limit(5) // latest 5 reviews
      .populate("userId", "userName"); // get user name

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((acc, r) => acc + r.ratingValue, 0) / totalReviews
        : 0;

    return res.status(200).json({
      product,
      averageRating,
      totalReviews,
      reviews,
    });
  } catch (err) {
    console.error("Error finding products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/ProductFullData/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Fetch product with population
    const product = await Product.findById(productId)
      .populate("shopId")
      .populate("subcategoryId")
      .populate("fitId")
      .populate("materialId")
      .populate("brandId")
      .populate("typeId");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch all variants for the product
    const variants = await Variant.find({ productId }).populate("colorId"); // Get color name

    let finalVariants = [];

    for (const variant of variants) {
      // Fetch Images for each variant
      const images = await Image.find({ variantId: variant._id });

      // Fetch sizes for each variant
      const variantSizes = await VariantSize.find({
        variantId: variant._id,
      }).populate("sizeId");

      let sizeStock = {};

      for (const vs of variantSizes) {
        const stock = await Stock.findOne({ variantSizeId: vs._id });

        sizeStock[vs.sizeId.sizeName] = stock ? Number(stock.stockQuantity) : 0;
      }

      finalVariants.push({
        color: variant.colorId.colorName,
        images: images.map((img) => img.productImage),
        sizes: sizeStock,
      });
    }

    return res.json({
      product,
      variants: finalVariants,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

app.delete("/Product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.json({ message: "Product not found" });
    } else {
      res.json({ message: "Product deleted successfully", deletedProduct });
    }
  } catch (err) {
    console.error("Error deleting Product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      shopId,
      productName,
      productDescription,
      categoryId,
      subcategoryId,
      productPrice,
      fitId,
      materialId,
      brandId,
    } = req.body;

    let product = await Product.findByIdAndUpdate(
      productId,
      {
        shopId,
        productName,
        productDescription,
        subcategoryId,
        productPrice,
        fitId,
        materialId,
        brandId,
      },
      { new: true }
    );

    if (!product) {
      return res.json({ message: "Product not found" });
    } else {
      res.json({ message: "Product updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const variantSchemaStructure = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productcollection",
    required: true,
  },
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "colorcollection",
    required: true,
  },
});

const Variant = mongoose.model("variantcollection", variantSchemaStructure);

app.post("/Variant", async (req, res) => {
  try {
    const { productId, colorId } = req.body;

    let variant = await Variant.findOne({ productId, colorId });

    if (variant) {
      return res.json({ message: "Variant already exists" });
    }

    variant = new Variant({
      productId,
      colorId,
    });

    await variant.save();

    res.json({ message: "Variant addeed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Variant", async (req, res) => {
  try {
    const variant = await Variant.find().populate("colorId");
    if (variant.length === 0) {
      return res.send({ message: "Variant not found" });
    } else {
      res.send({ variant }).status(200);
    }
  } catch (err) {
    console.error("Error finding variant:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/Variant/:id", async (req, res) => {
  try {
    const variantId = req.params.id;

    const variant = await Variant.findById(variantId)
      .populate("colorId")
      .populate("productId");
    if (!variant) {
      return res.send({ message: "Variant not found" });
    } else {
      res.send({ variant }).status(200);
    }
  } catch (err) {
    console.error("Error finding variant:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/Variant/Product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const variants = await Variant.find({ productId })
      .populate("colorId")
      .populate("productId");
    if (!variants || variants.length === 0) {
      return res
        .status(404)
        .json({ message: "No variants found for this product" });
    } else {
      res.send({ variants }).status(200);
    }
  } catch (err) {
    console.error("Error finding variant:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Variant/:id", async (req, res) => {
  try {
    const variantId = req.params.id;
    const deleteVariant = await Variant.findByIdAndDelete(variantId);

    if (!deleteVariant) {
      return res.json({ message: "Variant not found" });
    } else {
      res.json({ message: "Variant deleted successfully", deleteVariant });
    }
  } catch (err) {
    console.error("Error deleting Variant:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Variant/:id", async (req, res) => {
  try {
    const varaintId = req.params.id;
    const { productId, typeId, sizeId } = req.body;

    let variant = await Variant.findByIdAndUpdate(
      varaintId,
      { productId, typeId, sizeId },
      { new: true }
    );

    if (!variant) {
      return res.json({ message: "varinat not found" });
    } else {
      res.json({ message: "Varinat updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Populate Variant

app.get("/VariantPopulate", async (req, res) => {
  try {
    const variant = await Variant.find()
      .populate({
        path: "productId",
        populate: {
          path: "subcategoryId",
          populate: {
            path: "categoryId",
          },
        },
      })
      .populate("colorId");
    if (variant.length === 0) {
      return res.send({ message: "Variant not found" });
    } else {
      res.send({ variant }).status(200);
    }
  } catch (err) {
    console.error("Error finding variant:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const variantSizeSchemaStructure = new mongoose.Schema({
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "variantcollection",
    required: true,
  },
  sizeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sizecollection",
    required: true,
  },
});

variantSizeSchemaStructure.index({ variantId: 1, sizeId: 1 }, { unique: true });

const VariantSize = mongoose.model(
  "variantsizecollection",
  variantSizeSchemaStructure
);

app.post("/VariantSize", async (req, res) => {
  try {
    const { variantId, sizeId } = req.body;

    let sizeEntry = await VariantSize.findOne({ variantId, sizeId });

    if (sizeEntry) {
      return res.json({ message: "Size already exists for this variant" });
    }

    sizeEntry = new VariantSize({
      variantId,
      sizeId,
    });

    await sizeEntry.save();

    res.json({ message: "Variant size added", sizeEntry });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/VariantSize/variant/:variantId", async (req, res) => {
  try {
    const { variantId } = req.params;

    const sizes = await VariantSize.find({ variantId }).populate("sizeId");

    res.json({ sizes });
  } catch (err) {
    console.error("Error fetching sizes:", err);
    res.status(500).send("Server error");
  }
});

// Fetch Variant Size With Stock
app.get("/WithStockByVariant/:variantId", async (req, res) => {
  try {
    const { variantId } = req.params;

    const sizes = await VariantSize.aggregate([
      { $match: { variantId: new mongoose.Types.ObjectId(variantId) } },

      // join size details
      {
        $lookup: {
          from: "sizecollections",
          localField: "sizeId",
          foreignField: "_id",
          as: "sizeData",
        },
      },
      { $unwind: "$sizeData" },

      // join stock
      {
        $lookup: {
          from: "stockcollections",
          localField: "_id",
          foreignField: "variantSizeId",
          as: "stockData",
        },
      },
    ]);

    // Convert
    const formatted = sizes.map((s) => ({
      variantSizeId: s._id,
      sizeName: s.sizeData.sizeName,
      stockQty: s.stockData.length ? Number(s.stockData[0].stockQuantity) : 0,
    }));

    res.json({ sizes: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const imageSchemaStructure = new mongoose.Schema({
  productImage: {
    type: String,
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "variantcollection",
    required: true,
  },
});

const Image = mongoose.model("imagecollection", imageSchemaStructure);

app.post("/Image", upload.array("productImage", 5), async (req, res) => {
  try {
    console.log("File recevied:", req.files);
    console.log("Body recevied:", req.body);

    const { variantId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const images = [];

    for (const file of req.files) {
      const img = new Image({
        productImage: file.filename,
        variantId,
      });

      await img.save();
      images.push(img);
    }

    res.json({ message: "Product image inserted", data: images });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).send("Server error");
  }
});

app.get("/VarinatImages/:id", async (req, res) => {
  try {
    const variantId = req.params.id;
    const images = await Image.find({ variantId }).populate("variantId");

    if (!images) {
      return res.json({ message: "Image not found" });
    }

    res.json({ message: "Image fetched successfully", images });
  } catch (err) {
    console.error("Error fetching image:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Image/:id", async (req, res) => {
  try {
    const imageId = req.params.id;
    const deletedImage = await Image.findByIdAndDelete(imageId);

    if (!deletedImage) {
      return res.json({ message: "Image not found" });
    }

    res.json({ message: "Image deleted successfully", deletedImage });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Image/:id", upload.single("productImage"), async (req, res) => {
  try {
    const imageId = req.params.id;
    const { variantId } = req.body;

    const updateData = {};
    if (req.file) updateData.productImage = req.file.filename;
    if (variantId) updateData.variantId = variantId;

    const updatedImage = await Image.findByIdAndUpdate(imageId, updateData, {
      new: true,
    });

    if (!updatedImage) {
      return res.json({ message: "Image not found" });
    }

    res.json({ message: "Image updated successfully", updatedImage });
  } catch (err) {
    console.error("Error updating image:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const stockSchemaStructure = new mongoose.Schema({
  variantSizeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "variantsizecollection",
    required: true,
  },
  stockQuantity: {
    type: Number,
    required: true,
  },
  stockDate: {
    type: Date,
    default: Date.now,
  },
  stockDescription: {
    type: String,
    required: true,
  },
});

const Stock = mongoose.model("stockcollection", stockSchemaStructure);

app.post("/Stock", async (req, res) => {
  try {
    const { variantSizeId, stockQuantity, stockDescription } = req.body;

    let stock = await Stock.findOne({ variantSizeId });

    if (stock) {
      // UPDATE existing
      stock.stockQuantity = stockQuantity;
      stock.stockDescription = stockDescription;
      await stock.save();

      return res.json({
        message: "Stock updated successfully",
        stock,
      });
    }

    // INSERT new
    stock = new Stock({
      variantSizeId,
      stockQuantity,
      stockDescription,
    });

    await stock.save();

    res.json({
      message: "Stock save successfully",
      stock,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/// Shop Stock API
app.get("/VariantSize/variant/:variantId/withStock", async (req, res) => {
  try {
    const { variantId } = req.params;

    const sizes = await VariantSize.find({ variantId }).populate("sizeId");

    // Get stock for each variantSize
    const result = [];

    for (const size of sizes) {
      const stock = await Stock.findOne({ variantSizeId: size._id });

      result.push({
        ...size._doc,
        currentStock: stock ? stock.stockQuantity : 0,
        description: stock ? stock.stockDescription : "",
      });
    }

    res.json({ sizes: result });
  } catch (err) {
    console.error("Error fetching sizes with stock:", err);
    res.status(500).send("Server error");
  }
});

// User check stcok available API
app.get("/VariantSize/WithStock/:variantSizeId", async (req, res) => {
  try {
    const { variantSizeId } = req.params;
    const stock = await Stock.find({ variantSizeId });

    if (stock.length === 0) {
      return res.json({ message: "Stock not found" });
    }

    res.send({ stock }).status(200);
  } catch (err) {
    console.error("Error fetching sizes with stock:", err);
    res.status(500).send("Server error");
  }
});

app.get("/Stock", async (req, res) => {
  try {
    const stock = await Stock.find();

    if (stock.length === 0) {
      return res.json({ message: "Stock not found" });
    } else {
      res.send({ stock }).status(200);
    }
  } catch (err) {
    console.error("Error finding stock:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Stock/:id", async (req, res) => {
  try {
    const stockId = req.params.id;
    const deleteStock = await Stock.findByIdAndDelete(stockId);

    if (!deleteStock) {
      return res.json({ message: "Stock not found" });
    } else {
      res.json({ message: "Stock deleted successfully", deleteStock });
    }
  } catch (err) {
    console.error("Error deleting Stock:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Stock/:id", async (req, res) => {
  try {
    const stockId = req.params.id;
    const { variantSizeId, stockQuantity, stockDescription } = req.body;

    let stock = await Stock.findByIdAndUpdate(
      stockId,
      { variantSizeId, stockQuantity, stockDescription },
      { new: true }
    );

    if (!stock) {
      return res.json({ message: "Stock not found" });
    } else {
      res.json({ message: "Stock updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Populate Stock

app.get("/StockPopulate", async (req, res) => {
  try {
    const stock = await Stock.find().populate("variantId");

    if (stock.length === 0) {
      return res.json({ message: "Stock not found" });
    } else {
      res.send({ stock }).status(200);
    }
  } catch (err) {
    console.error("Error finding stock:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const orderSchemaStruture = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usercollection",
    required: true,
  },
  userName: {
    type: String,
  },
  contactNo: {
    type: String,
  },
  deliveryAddress: {
    type: String,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  refundedAmount: {
    type: Number,
    default: 0,
  },

  orderDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: [
      "inCart",
      "buyNow",
      "paymentPending",
      "paymentSuccess",
      "partiallyCancelled",
      "cancelled",
      "refunded",
    ],
    default: "inCart",
  },
  razorpayPaymentId: {
    type: String,
    default: null,
  },
});

const Order = mongoose.model("ordercollection", orderSchemaStruture);

app.post("/Order", async (req, res) => {
  try {
    const { userId, totalAmount } = req.body;

    let order = await Order.findOne({ userId });

    if (order) {
      return res.json({ message: "Order already exists" });
    }

    order = new Order({
      userId,
      totalAmount,
    });

    await order.save();

    res.json({ message: "Order inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Order", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const order = await Order.findOne({ userId, orderStatus: "inCart" });

    if (!order) {
      return res.status(200).json({ message: "No order found", order: null });
    }

    return res.status(200).json({ order });
  } catch (err) {
    console.error("Error Finding Order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Order/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const deleteOrder = await Order.findOneAndDelete(orderId);

    if (!deleteOrder) {
      res.json({ message: "Order not found" });
    } else {
      res.json({ message: "Order deleted successfully", deleteOrder });
    }
  } catch (err) {
    console.error("Error deleting order", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/Order/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const { userId, totalAmount } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { userId, totalAmount },
      { new: true }
    );

    if (!order) {
      res.json({ message: "Order not found" });
    } else {
      res.json({ message: "Order updated successfully", order });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Populate Order

app.get("/OrderPopulate", async (req, res) => {
  try {
    const order = await Order.find().populate("userId", "userName userEmail");
    if (order.length === 0) {
      return res.send({ message: "Order not found", order: [] });
    } else {
      res.send({ order }).status(200);
    }
  } catch (err) {
    console.error("Error Finding Order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Fetching orders for myorders
app.get("/order/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({
      userId,
      orderStatus: { $nin: ["inCart", "buyNow"] },
    }).sort({ orderDate: -1 });

    if (!orders.length) {
      return res.status(200).json({ orders: [] });
    }

    const ordersResponse = [];

    for (const order of orders) {
      const orderItems = await OrderItem.find({ orderId: order._id }).populate({
        path: "variantSizeId",
        populate: [
          { path: "sizeId" },
          {
            path: "variantId",
            populate: [
              { path: "colorId" },
              {
                path: "productId",
                populate: { path: "brandId" },
              },
            ],
          },
        ],
      });

      if (!orderItems.length) continue;

      const variantIds = orderItems.map(
        (item) => item.variantSizeId.variantId._id
      );

      const images = await Image.find({
        variantId: { $in: variantIds },
      });

      const imageMap = {};
      images.forEach((img) => {
        imageMap[img.variantId.toString()] = img.productImage;
      });

      const previewItem = orderItems[0];
      const variantId = previewItem.variantSizeId.variantId._id.toString();

      // 8️⃣ Build response object
      ordersResponse.push({
        orderId: order._id,
        orderDate: order.orderDate,
        orderStatus: order.orderStatus,
        totalAmount: order.totalAmount,
        deliveryAddress: order.deliveryAddress,
        totalItems: orderItems.length,

        previewItem: {
          productName:
            previewItem.variantSizeId.variantId.productId.productName,

          // ✅ Variant image (color specific)
          productImage:
            imageMap[variantId] ||
            previewItem.variantSizeId.variantId.productId.productImage,

          brandName:
            previewItem.variantSizeId.variantId.productId.brandId.brandName,

          sizeName: previewItem.variantSizeId.sizeId.sizeName,

          colorName: previewItem.variantSizeId.variantId.colorId.colorName,

          itemStatus: previewItem.orderItemStatus,
          refundStatus: previewItem.refundStatus,
        },
      });
    }
    return res.status(200).json({ orders: ordersResponse });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//OrderDetails data fetch
app.get("/order/details/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const orderItems = await OrderItem.find({ orderId }).populate({
      path: "variantSizeId",
      populate: [
        { path: "sizeId" },
        {
          path: "variantId",
          populate: [
            { path: "colorId" },
            { path: "productId", populate: { path: "brandId" } },
          ],
        },
      ],
    });

    if (!orderItems.length) {
      return res.status(200).json({ order, items: [] });
    }

    const variantIds = orderItems.map(
      (item) => item.variantSizeId.variantId._id
    );

    const images = await Image.find({ variantId: { $in: variantIds } });

    const imageMap = {};
    images.forEach(
      (img) => (imageMap[img.variantId.toString()] = img.productImage)
    );

    const orderItemIds = orderItems.map((item) => item._id);
    const reviews = await ReviewRating.find({
      orderItemId: { $in: orderItemIds },
    });

    const reviewMap = {};
    reviews.forEach((r) => {
      reviewMap[r.orderItemId.toString()] = {
        isReviewed: true,
        ratingValue: r.ratingValue,
        reviewContent: r.reviewContent,
        reviewDate: r.reviewDate,
      };
    });

    const itemsResponse = orderItems.map((item) => {
      const variant = item.variantSizeId.variantId;
      const product = variant.productId;
      const variantId = variant._id.toString();

      const reviewInfo = reviewMap[item._id.toString()] || {
        isReviewed: false,
        ratingValue: null,
        reviewContent: null,
        reviewDate: null,
      };

      return {
        orderItemId: item._id,
        productName: product.productName,
        brandName: product.brandId.brandName,
        productImage: imageMap[variantId] || product.productImage,
        sizeName: item.variantSizeId.sizeId.sizeName,
        colorName: variant.colorId.colorName,
        quantity: item.quantity,
        price: item.orderItemPrice,
        itemStatus: item.orderItemStatus,
        refundStatus: item.refundStatus,
        ...reviewInfo, // add review info here
      };
    });

    return res.status(200).json({
      order: {
        orderId: order._id,
        orderDate: order.orderDate,
        orderStatus: order.orderStatus,
        totalAmount: order.totalAmount,
        refundedAmount: order.refundedAmount,
        deliveryAddress: order.deliveryAddress,
        userName: order.userName,
        contactNo: order.contactNo,
        razorpayPaymentId: order.razorpayPaymentId,
      },
      items: itemsResponse,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const orderItemSchemaStructure = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ordercollection",
    required: true,
  },
  variantSizeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "variantsizecollection",
    required: true,
  },
  orderItemPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  orderItemStatus: {
    type: String,
    enum: [
      "processing",
      "packed",
      "shipped",
      "outForDelivery",
      "delivered",
      "cancelled",
    ],
    default: "processing",
  },
  cancellationReason: {
    type: String,
    default: null,
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
  refundStatus: {
    type: String,
    enum: ["notInitiated", "initiated", "approved", "completed"],
    default: "notInitiated",
  },
});

const OrderItem = mongoose.model(
  "orderitemcollection",
  orderItemSchemaStructure
);

app.post("/OrderItem", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { variantSizeId, orderItemPrice } = req.body;

    if (
      !userId ||
      !variantSizeId ||
      orderItemPrice === undefined ||
      orderItemPrice === null
    ) {
      return res
        .status(400)
        .json({ action: "error", message: "Missing required fields" });
    }

    let order = await Order.findOne({ userId, orderStatus: "inCart" });

    if (!order) {
      order = new Order({
        userId,
        orderStatus: "inCart",
        orderDate: new Date(),
      });
      await order.save();
    }

    const existing = await OrderItem.findOne({
      orderId: order._id,
      variantSizeId: variantSizeId,
    });

    if (existing) {
      return res.json({
        action: "info",
        message: "Item already in cart",
        orderId: order._id,
      });
    }

    const orderitem = new OrderItem({
      orderId: order._id,
      variantSizeId,
      orderItemPrice,
    });

    await orderitem.save();

    return res.json({
      action: "success",
      message: "Item added to cart",
      orderId: order._id,
      orderitem,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/buyNowOrder", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product } = req.body;

    if (!userId || !product) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = new Order({
      userId,
      totalAmount: product.price * product.quantity,
      orderStatus: "buyNow",
    });

    await order.save();

    const orderItem = new OrderItem({
      orderId: order._id,
      variantSizeId: product.variantSizeId,
      orderItemPrice: product.price,
      quantity: product.quantity,
    });

    await orderItem.save();

    res.status(200).json({
      message: "Buy Now order created",
      orderId: order._id,
      product,
    });
  } catch (err) {
    console.error("Error creating Buy Now order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/OrderItem/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const item = await OrderItem.find({ orderId }).populate({
      path: "variantSizeId",
      populate: [
        {
          path: "variantId",
          populate: [
            { path: "productId", populate: ["subcategoryId", "brandId"] },
            { path: "colorId" }, // populate color here
          ],
        },
        { path: "sizeId" }, // populate size
      ],
    });

    if (item.length === 0) {
      return res.send({ message: "Order item not found", item: [] });
    } else {
      res.send({ item }).status(200);
    }
  } catch (err) {
    console.error("Error finding Order item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/OrderItemDelete/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    const deleteItem = await OrderItem.findByIdAndDelete(itemId);

    if (!deleteItem) {
      return res.status(4040).json({ message: "Order item not found" });
    } else {
      res.json({ message: "Order item deleted successfully", deleteItem });
    }
  } catch (err) {
    console.error("Error deleting order item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/OrderItem/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const { orderId, productId, orderItemPrice } = req.body;

    let item = await OrderItem.findByIdAndUpdate(
      itemId,
      { orderId, productId, orderItemPrice },
      { new: true }
    );

    if (!item) {
      res.json({ message: "Order item not found" });
    } else {
      res.json({ message: "Order item updated successfully", item });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Populate OrderItem

app.get("/OrderItemPopulate", async (req, res) => {
  try {
    const item = await OrderItem.find()
      .populate("orderId")
      .populate("productId");

    if (item.length === 0) {
      return res.send({ message: "Order item not found", item: [] });
    } else {
      res.send({ item }).status(200);
    }
  } catch (err) {
    console.error("Error finding Order item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Item Quantity Update
app.patch("/UpdateQty/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const updateItem = await OrderItem.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    res.status(200).json({ message: "Quantity updated", item: updateItem });
  } catch (err) {
    console.error("Error Updating quantity:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//OrderItems fetching for shop
app.get("/OrderItemFetch/:shopId", async (req, res) => {
  try {
    const shopId = new mongoose.Types.ObjectId(req.params.shopId);

    const shopOrderItems = await OrderItem.aggregate([
      // 1️⃣ VariantSize
      {
        $lookup: {
          from: "variantsizecollections",
          localField: "variantSizeId",
          foreignField: "_id",
          as: "variantSize",
        },
      },
      { $unwind: "$variantSize" },

      // 2️⃣ Variant
      {
        $lookup: {
          from: "variantcollections",
          localField: "variantSize.variantId",
          foreignField: "_id",
          as: "variant",
        },
      },
      { $unwind: "$variant" },

      // 3️⃣ Product
      {
        $lookup: {
          from: "productcollections",
          localField: "variant.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      // 4️⃣ Filter by shop
      {
        $match: { "product.shopId": shopId },
      },

      // 5️⃣ Variant Images (variantId only – schema correct)
      {
        $lookup: {
          from: "imagecollections",
          localField: "variant._id",
          foreignField: "variantId",
          as: "variantImages",
        },
      },

      // 6️⃣ Color
      {
        $lookup: {
          from: "colorcollections",
          localField: "variant.colorId",
          foreignField: "_id",
          as: "color",
        },
      },
      { $unwind: "$color" },

      // 7️⃣ Size
      {
        $lookup: {
          from: "sizecollections",
          localField: "variantSize.sizeId",
          foreignField: "_id",
          as: "size",
        },
      },
      { $unwind: "$size" },

      // 8️⃣ Order
      {
        $lookup: {
          from: "ordercollections",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: "$order" },

      // 9️⃣ Final shape
      {
        $project: {
          orderItemId: "$_id",
          orderId: "$order._id",

          productName: "$product.productName",
          productImage: { $first: "$variantImages.productImage" },

          colorName: "$color.colorName",
          sizeName: "$size.sizeName",

          quantity: 1,
          price: "$orderItemPrice",
          orderItemStatus: 1,

          orderDate: "$order.orderDate",
          deliveryAddress: "$order.deliveryAddress",
          userName: "$order.userName",
        },
      },

      // 🔟 Latest first
      { $sort: { orderDate: -1 } },
    ]);

    res.status(200).json({ shopOrderItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//OrderItemDetails fetching for OrdeDetails
app.get("/order-item/:orderItemId", async (req, res) => {
  try {
    const orderItemId = new mongoose.Types.ObjectId(req.params.orderItemId);

    const result = await OrderItem.aggregate([
      // 1️⃣ Match OrderItem
      {
        $match: { _id: orderItemId },
      },

      // 2️⃣ VariantSize
      {
        $lookup: {
          from: "variantsizecollections",
          localField: "variantSizeId",
          foreignField: "_id",
          as: "variantSize",
        },
      },
      { $unwind: "$variantSize" },

      // 3️⃣ Variant
      {
        $lookup: {
          from: "variantcollections",
          localField: "variantSize.variantId",
          foreignField: "_id",
          as: "variant",
        },
      },
      { $unwind: "$variant" },

      // 4️⃣ Size
      {
        $lookup: {
          from: "sizecollections",
          localField: "variantSize.sizeId",
          foreignField: "_id",
          as: "size",
        },
      },
      { $unwind: "$size" },

      // 5️⃣ Color
      {
        $lookup: {
          from: "colorcollections",
          localField: "variant.colorId",
          foreignField: "_id",
          as: "color",
        },
      },
      { $unwind: "$color" },

      // 6️⃣ Product
      {
        $lookup: {
          from: "productcollections",
          localField: "variant.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      // 7️⃣ Images
      {
        $lookup: {
          from: "imagecollections",
          localField: "variant._id",
          foreignField: "variantId",
          as: "images",
        },
      },

      // 8️⃣ Order
      {
        $lookup: {
          from: "ordercollections",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: "$order" },

      // 9️⃣ Final Shape
      {
        $project: {
          orderItemId: "$_id",
          orderItemStatus: 1,
          quantity: 1,
          price: "$orderItemPrice",

          productName: "$product.productName",
          productImage: { $first: "$images.productImage" },

          colorName: "$color.colorName",
          sizeName: "$size.sizeName",

          orderDate: "$order.orderDate",
          deliveryAddress: "$order.deliveryAddress",
          userName: "$order.userName",
          contactNo: "$order.contactNo",

          paymentMethod: "$order.paymentMethod",
          paymentStatus: "$order.paymentStatus",
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//OrderItems Status Update
app.patch("/order-item/status/:orderItemId", async (req, res) => {
  try {
    const { status } = req.body;
    const orderItemId = req.params.orderItemId;

    const allowedStatuses = [
      "processing",
      "packed",
      "shipped",
      "outForDelivery",
      "delivered",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedOrderItem = await OrderItem.findByIdAndUpdate(
      orderItemId,
      { orderItemStatus: status },
      { new: true }
    );

    if (!updatedOrderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.status(200).json(updatedOrderItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//orderItem cancellation
app.patch("/order-item/:orderItemId/cancel", async (req, res) => {
  try {
    const { orderItemId } = req.params;
    const { reason } = req.body;

    const orderItem = await OrderItem.findById(orderItemId);
    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    // ❌ Block if already shipped
    if (
      ["shipped", "outForDelivery", "delivered"].includes(
        orderItem.orderItemStatus
      )
    ) {
      return res.status(400).json({
        message: "This item can no longer be cancelled",
      });
    }

    if (orderItem.orderItemStatus === "cancelled") {
      return res.status(400).json({
        message: "Item already cancelled",
      });
    }

    // ✅ Cancel item
    orderItem.orderItemStatus = "cancelled";
    orderItem.cancellationReason = reason;
    orderItem.cancelledAt = new Date();
    orderItem.refundStatus = "initiated";
    await orderItem.save();

    await Stock.findOneAndUpdate(
      { variantSizeId: orderItem.variantSizeId },
      { $inc: { stockQuantity: orderItem.quantity } }
    );

    // 🔄 Update Order
    const order = await Order.findById(orderItem.orderId);

    const refundAmount = orderItem.orderItemPrice * orderItem.quantity;

    order.refundedAmount += refundAmount;

    // Check remaining active items
    const activeItems = await OrderItem.find({
      orderId: order._id,
      orderItemStatus: { $ne: "cancelled" },
    });

    order.orderStatus =
      activeItems.length === 0 ? "cancelled" : "partiallyCancelled";

    await order.save();

    res.json({
      message: "Order item cancelled successfully",
      refundAmount,
      refundEta: "5 business days",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cancellation failed" });
  }
});

//Refund backend for Admin
app.patch("/admin/order-item/:orderItemId/refund", async (req, res) => {
  try {
    const { orderItemId } = req.params;
    const { refundStatus } = req.body;

    const validStatuses = ["approved", "completed"];
    if (!validStatuses.includes(refundStatus)) {
      return res.status(400).json({ message: "Invalid refund status" });
    }

    const orderItem = await OrderItem.findById(orderItemId);
    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    if (orderItem.orderItemStatus !== "cancelled") {
      return res
        .status(400)
        .json({ message: "Refund allowed only for cancelled items" });
    }

    if (refundStatus === "approved" && orderItem.refundStatus !== "initiated") {
      return res
        .status(400)
        .json({ message: "Refund must be initiated before approval" });
    }

    if (refundStatus === "completed" && orderItem.refundStatus !== "approved") {
      return res
        .status(400)
        .json({ message: "Refund must be approved before completion" });
    }

    // Update refund status
    orderItem.refundStatus = refundStatus;
    await orderItem.save();

    // Update order status if all items refunded
    const orderItems = await OrderItem.find({ orderId: orderItem.orderId });
    const allRefunded = orderItems.every(
      (item) =>
        item.orderItemStatus === "cancelled" &&
        item.refundStatus === "completed"
    );
    if (allRefunded) {
      await Order.findByIdAndUpdate(orderItem.orderId, {
        orderStatus: "refunded",
      });
    }

    // ✅ Send email only if refund is completed
    if (refundStatus === "completed") {
      const order = await Order.findById(orderItem.orderId);

      // Fetch user by userId
      const user = await User.findById(order.userId);

      if (user && user.userEmail) {
        console.log("Refund email will be sent to:", user.userEmail);

        const refundAmount = orderItem.orderItemPrice * orderItem.quantity;

        const emailContent = `
<html>
<body>
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px;">
    <h2>Refund Completed</h2>
    <p>Hi <strong>${user.userName || "Customer"}</strong>,</p>
    <p>Your refund for the cancelled item has been successfully processed.</p>
    <p><strong>Amount refunded:</strong> ₹${refundAmount}</p>
    <p>Order ID: #${order._id.toString().slice(-8).toUpperCase()}</p>
    <p>The amount will be credited to your original payment method within 3–5 business days.</p>
    <p>Thank you for shopping with us.</p>
    <strong>Wardrobe</strong>
  </div>
</body>
</html>`;

        await sendEmail(
          user.userEmail,
          emailContent,
          "Refund Completed – Wardrobe"
        );

        console.log("Refund email sent successfully");
      } else {
        console.log("User not found or email missing for refund notification");
      }
    }

    res.json({ message: `Refund ${refundStatus} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Refund update failed" });
  }
});

// GET /admin/refunds
app.get("/admin/refunds", async (req, res) => {
  try {
    // Fetch all cancelled order items
    const refundItems = await OrderItem.find({ orderItemStatus: "cancelled" });

    const itemsWithUser = await Promise.all(
      refundItems.map(async (item) => {
        const order = await Order.findById(item.orderId);
        const user = await User.findById(order.userId);

        // Step 1: Get variantSize
        const variantSize = await VariantSize.findById(item.variantSizeId);
        let productName = "Unknown Product";

        if (variantSize) {
          // Step 2: Get variant
          const variant = await Variant.findById(variantSize.variantId);
          if (variant) {
            // Step 3: Get product
            const product = await Product.findById(variant.productId);
            if (product) {
              productName = product.productName;
            }
          }
        }

        return {
          orderItemId: item._id,
          orderId: order._id,
          userName: user ? user.userName : "Unknown",
          userEmail: user ? user.userEmail : "",
          productName,
          quantity: item.quantity,
          price: item.orderItemPrice,
          refundStatus: item.refundStatus,
          reason: item.cancellationReason,
        };
      })
    );

    res.json(itemsWithUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch refund items" });
  }
});

//Rating data fetch
app.get("/order/item/:orderItemId", async (req, res) => {
  const { orderItemId } = req.params;
  const orderItem = await OrderItem.findById(orderItemId).populate({
    path: "variantSizeId",
    populate: [
      { path: "sizeId" },
      {
        path: "variantId",
        populate: [
          { path: "colorId" },
          { path: "productId", populate: { path: "brandId" } },
        ],
      },
    ],
  });

  if (!orderItem)
    return res.status(404).json({ message: "Order item not found" });

  res.json({
    productImage: orderItem.variantSizeId.variantId.productId.productImage,
    productName: orderItem.variantSizeId.variantId.productId.productName,
    brandName: orderItem.variantSizeId.variantId.productId.brandId.brandName,
    sizeName: orderItem.variantSizeId.sizeId.sizeName,
    colorName: orderItem.variantSizeId.variantId.colorId.colorName,
    orderItemId: orderItem._id,
  });
});

const wishListSchemaStructure = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productcollection",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usercollection",
    required: true,
  },
  addedDate: {
    type: Date,
    default: Date.now,
  },
});

const WishList = mongoose.model("wishlistcollection", wishListSchemaStructure);

app.post("/WishList", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    let wishlist = await WishList.findOne({ userId, productId });

    if (wishlist) {
      return res.json({ message: "Product already exists in wish list" });
    }

    wishlist = new WishList({
      userId,
      productId,
    });

    await wishlist.save();

    res.json({ message: "Product added to wish list successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/WishListDataFetch", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const wishlist = await WishList.find({ userId })
      .populate({
        path: "productId",
        populate: [
          { path: "brandId" },
          { path: "shopId" },
          { path: "subcategoryId" },
        ],
      })
      .populate("userId");

    if (wishlist.length === 0) {
      return res.send({ message: "Wish list not found" });
    } else {
      res.send({ wishlist }).status(200);
    }
  } catch (err) {
    console.error("Error finding wishlist:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Deleted wishlist using productId and userId
app.delete("/WishList/:productId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.productId;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "userId and productId are required" });
    }

    const deleteWishlist = await WishList.findOneAndDelete({
      userId,
      productId,
    });

    if (!deleteWishlist) {
      return res.json({ message: "Wishlist item not found" });
    }

    res.json({ message: "Product removed from wishlist" });
  } catch (err) {
    console.error("Error deleting wishlist item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Deleted wishlist using wishListId
app.delete("/WishListRemoveItem/:id", async (req, res) => {
  try {
    const id = req.params.userId;
    const deleteItem = await WishList.findOneAndDelete(id);

    if (!deleteItem) {
      return res.json({ message: "Wishlist item not found" });
    }

    res.json({ message: "Product removed from wishlist" });
  } catch (err) {
    console.error("Error deleting wishlist item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/WishList/:id", async (req, res) => {
  try {
    const wishlistId = req.params.id;
    const { userId, productId } = req.body;

    let wishlist = await WishList.findByIdAndUpdate(
      wishlistId,
      { userId, productId },
      { new: true }
    );

    if (!wishlist) {
      return res.json({ message: "Wishlist not found" });
    } else {
      res.json({ message: "Wishlist updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Populate WishList

app.get("/WishListPopulate", async (req, res) => {
  try {
    const wishlist = await WishList.find()
      .populate("userId", "userName userEmail")
      .populate("productId");

    if (wishlist.length === 0) {
      return res.send({ message: "Wish list not found" });
    } else {
      res.send({ wishlist }).status(200);
    }
  } catch (err) {
    console.error("Error finding wishlist:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const complaintSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productcollection",
      required: true,
    },

    orderItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orderitemcollection",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usercollection",
      required: true,
    },

    complaintTitle: {
      type: String,
      required: true,
      trim: true,
    },

    complaintDescription: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔽 FILE / IMAGE UPLOADS
    complaintAttachments: [
      {
        fileUrl: { type: String, required: true }, // path or cloud URL
        fileType: { type: String }, // image/png, image/jpeg, pdf
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    complaintReply: {
      type: String,
      trim: true,
    },

    complaintStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("complaintcollection", complaintSchema);

app.post("/Complaint", async (req, res) => {
  try {
    const { productId, userId, complaintTitle, complaintDescription } =
      req.body;

    let complaint = await Complaint.findOne({
      complaintTitle,
      productId,
      userId,
    });

    if (complaint) {
      return res.json({ message: "Complaint already exists" });
    }

    complaint = new Complaint({
      productId,
      userId,
      complaintTitle,
      complaintDescription,
    });

    await complaint.save();

    res.json({ message: "Complaint inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Complaint", async (req, res) => {
  try {
    const complaint = await Complaint.find();

    if (complaint.length === 0) {
      return res.json({ message: "Complaint not found" });
    } else {
      res.send({ complaint }).status(200);
    }
  } catch (err) {
    console.error("Error finding wishlist:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Complaint/:id", async (req, res) => {
  try {
    const complaintId = req.params.id;
    const deleteComplaint = await Complaint.findByIdAndDelete(complaintId);

    if (!deleteComplaint) {
      return res.json({ message: "Complaint not found" });
    } else {
      res.json({ message: "Complaint deleted successfully" });
    }
  } catch (err) {
    console.error("Error deleting complaint:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Complaint/:id", async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { productId, userId, complaintTitle, complaintDescription } =
      req.body;

    let complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { productId, userId, complaintTitle, complaintDescription },
      { new: true }
    );

    if (!complaint) {
      return res.json({ message: "Complaint not found" });
    } else {
      res.json({ message: "Complaint updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Populate Complaint
app.get("/ComplaintPopulate", async (req, res) => {
  try {
    const complaint = await Complaint.find()
      .populate("userId", "userName userEmail")
      .populate("productId");

    if (complaint.length === 0) {
      return res.json({ message: "Complaint not found" });
    } else {
      res.send({ complaint }).status(200);
    }
  } catch (err) {
    console.error("Error finding wishlist:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//complaint creation
app.post("/complaint/create/:orderItemId", authMiddleware, async (req, res) => {
  try {
    const { orderItemId } = req.params;
    const userId = req.user.userId;
    const { complaintTitle, complaintDescription } = req.body;

    // 1️⃣ Validate Inputs
    if (!userId || !complaintTitle || !complaintDescription) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Check Order Item Exists
    const orderItem = await OrderItem.findById(orderItemId).populate("orderId");

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: "Order item not found",
      });
    }

    // 3️⃣ Check User Owns This Order
    if (String(orderItem.orderId.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You cannot raise complaint for this order",
      });
    }

    // 4️⃣ Get Product ID (through Variant → Product)
    const variantSize = await VariantSize.findById(orderItem.variantSizeId);
    const variant = await Variant.findById(variantSize.variantId);
    const productId = variant.productId;

    // 5️⃣ Prevent Duplicate Complaint
    const alreadyExists = await Complaint.findOne({ orderItemId });
    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Complaint already raised for this order item",
      });
    }

    // 6️⃣ Create Complaint
    const complaint = new Complaint({
      userId,
      orderItemId,
      productId,
      complaintTitle,
      complaintDescription,
    });

    await complaint.save();

    res.status(201).json({
      success: true,
      message: "Complaint registered successfully",
      complaint,
    });
  } catch (err) {
    console.log("Complaint Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

//Get comlpaints using userId
app.get("/complaint/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const complaints = await Complaint.find({ userId })
      .populate({
        path: "productId",
        select: "productName productImage",
      })
      .populate({
        path: "orderItemId",
        select: "_id",
      })
      .sort({ createdAt: -1 });

    // Ensure complaintReply is returned
    const result = complaints.map((c) => ({
      _id: c._id,
      productId: c.productId,
      orderItemId: c.orderItemId,
      complaintTitle: c.complaintTitle,
      complaintDescription: c.complaintDescription,
      complaintStatus: c.complaintStatus,
      complaintReply: c.complaintReply || null, // <-- include reply
      complaintAttachments: c.complaintAttachments,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//Fetch all complaints for admin
// GET /admin/complaints
app.get("/admin/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate({
        path: "userId",
        select: "userName userEmail",
      })
      .populate({
        path: "productId",
        select: "productName productImage",
      })
      .populate({
        path: "orderItemId",
        select: "_id",
      })
      .sort({ createdAt: -1 });

    // Format response for front-end
    const formatted = complaints.map((c) => ({
      _id: c._id,
      complaintTitle: c.complaintTitle,
      complaintDescription: c.complaintDescription,
      complaintStatus: c.complaintStatus,
      complaintReply: c.complaintReply,
      user: {
        name: c.userId.userName,
        email: c.userId.userEmail,
      },
      product: {
        name: c.productId.productName,
        image: c.productId.productImage,
      },
      orderItemId: c.orderItemId._id,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

// UPDATE complaint (reply / status)
// PUT /admin/complaint/:id
app.put("/admin/complaint/:id", async (req, res) => {
  const { adminReply, status } = req.body;

  if (!adminReply && !status) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        ...(adminReply !== undefined && { complaintReply: adminReply }),
        ...(status !== undefined && { complaintStatus: status }),
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update complaint" });
  }
});

const ratingReviewSchemaStructure = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usercollection",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productcollection",
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ordercollection",
    required: true,
  },
  orderItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orderitemcollection",
    required: true,
    unique: true,
  },
  ratingValue: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewContent: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "hidden"],
    default: "active",
  },
  ratingReviewDate: {
    type: Date,
    default: Date.now,
  },
});

const ReviewRating = mongoose.model(
  "ratingreviewcollection",
  ratingReviewSchemaStructure
);

app.post("/RatingReview", async (req, res) => {
  try {
    const { userId, productId, orderId, ratingValue, reviewContent } = req.body;

    let ratingreview = await ReviewRating.findOne({ orderId });

    if (ratingreview) {
      return res.json({ message: "Rating And review already exists" });
    }

    ratingreview = new ReviewRating({
      userId,
      productId,
      orderId,
      ratingValue,
      reviewContent,
    });

    await ratingreview.save();

    res.json({ message: "Rating and review inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/RatingReview", async (req, res) => {
  try {
    const ratingreview = await ReviewRating.find();

    if (ratingreview.length === 0) {
      return res.json({ message: "Raitng review not found" });
    } else {
      res.send({ ratingreview }).status(200);
    }
  } catch (err) {
    console.error("Error finding ratingreview:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/RatingReview/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleteRatingReview = await ReviewRating.findByIdAndDelete(id);

    if (!deleteRatingReview) {
      return res.json({ message: "Rating review not found" });
    } else {
      res.json({ message: "Rating review deleted successfully" });
    }
  } catch (err) {
    console.error("Error deleting ratingreview:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/RatingReview/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userId, productId, orderId, ratingValue, reviewContent } = req.body;

    let ratingreview = await ReviewRating.findByIdAndUpdate(
      id,
      { userId, productId, orderId, ratingValue, reviewContent },
      { new: true }
    );

    if (!ratingreview) {
      return res.json({ message: "Rating review not found" });
    } else {
      res.json({ message: "Rating review updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Populate RatingReview

app.get("/RatingReviewPopulate", async (req, res) => {
  try {
    const ratingreview = await ReviewRating.find()
      .populate("userId", "userName userEmail")
      .populate("productId")
      .populate("orderId");

    if (ratingreview.length === 0) {
      return res.json({ message: "Raitng review not found" });
    } else {
      res.send({ ratingreview }).status(200);
    }
  } catch (err) {
    console.error("Error finding ratingreview:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Rating & Review Api
app.post("/review", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderItemId, ratingValue, reviewContent } = req.body;

    // 1️⃣ Order item with populated product
    const orderItem = await OrderItem.findById(orderItemId).populate({
      path: "variantSizeId",
      populate: {
        path: "variantId",
        populate: { path: "productId" },
      },
    });

    if (!orderItem)
      return res.status(404).json({ message: "Order item not found" });

    if (orderItem.orderItemStatus !== "delivered")
      return res.status(400).json({ message: "Item not delivered yet" });

    // 2️⃣ Order
    const order = await Order.findById(orderItem.orderId);
    if (!order || order.userId.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    if (!["paymentSuccess", "partiallyCancelled"].includes(order.orderStatus))
      return res.status(400).json({ message: "Invalid order status" });

    // 3️⃣ Check existing review
    const existingReview = await ReviewRating.findOne({ orderItemId });
    if (existingReview)
      return res.status(400).json({ message: "Already reviewed" });

    // 4️⃣ Create review
    const productId = orderItem.variantSizeId.variantId.productId._id;

    const review = await ReviewRating.create({
      userId,
      productId,
      orderId: order._id,
      orderItemId,
      ratingValue,
      reviewContent,
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add review" });
  }
});

const categorySchemeStructure = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("categorycollection", categorySchemeStructure);

app.post("/Category", async (req, res) => {
  try {
    const { categoryName } = req.body;

    let category = await Category.findOne({ categoryName });

    if (category) {
      return res.json({ message: "Category already exists" });
    }

    category = new Category({
      categoryName,
    });

    await category.save();

    res.json({ message: "Category inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Category", async (req, res) => {
  try {
    const category = await Category.find();
    if (category.length === 0) {
      return res.send({ message: "No categories founded", category: [] });
    } else {
      res.send({ category }).status(200);
    }
  } catch (err) {
    console.error("Error Finding Categories:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deleteCategory = await Category.findByIdAndDelete(categoryId);

    if (!deleteCategory) {
      return res.json({ message: "Category not found" });
    } else {
      res.json({ message: "Category deleted successfully", deleteCategory });
    }
  } catch (err) {
    console.error("Error deleteing Category:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { categoryName } = req.body;
    let category = await Category.findByIdAndUpdate(
      categoryId,
      { categoryName },
      { new: true }
    );

    if (!category) {
      return res.json({ message: "Category not found" });
    } else {
      res.json({ message: "Category updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const subcategorySchemaStructure = new mongoose.Schema({
  subcategoryName: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categorycollection",
    required: true,
  },
});

const Subcategory = mongoose.model(
  "subcategorycollection",
  subcategorySchemaStructure
);

app.post("/Subcategory", async (req, res) => {
  try {
    const { subcategoryName, categoryId } = req.body;

    let subcategory = await Subcategory.findOne({ subcategoryName });

    if (subcategory) {
      return res.json({ message: "Subcategory already exists" });
    }

    subcategory = new Subcategory({
      subcategoryName,
      categoryId,
    });

    await subcategory.save();

    res.json({ message: "Subcategory inserted sucsessfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Subcategory", async (req, res) => {
  try {
    const subcategory = await Subcategory.find();
    if (subcategory.length === 0) {
      return res.send({ message: "No subcategories found", subcategory: [] });
    } else {
      res.send({ subcategory }).status(200);
    }
  } catch (err) {
    console.error("Error finding Subcategories:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Subcategory/:id", async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const deleteSubcategory = await Subcategory.findByIdAndDelete(
      subcategoryId
    );

    if (!deleteSubcategory) {
      return res.json({ message: "Subcategory not found" });
    } else {
      res.json({
        message: "Subcategory deleted successfully",
        deleteSubcategory,
      });
    }
  } catch (err) {
    console.error("Error deleting Subcategory:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Subcategory/:id", async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const { subcategoryName, categoryId } = req.body;

    let subcategory = await Subcategory.findByIdAndUpdate(
      subcategoryId,
      { subcategoryName, categoryId },
      { new: true }
    );

    if (!subcategory) {
      return res.json({ message: "Subcategory not found" });
    } else {
      res.json({ message: "Subcategory updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Populate subcategory and category

app.get("/SubcategoryPopulate", async (req, res) => {
  try {
    const subcategory = await Subcategory.find().populate("categoryId");
    if (subcategory.length === 0) {
      return res.send({ message: "No subcategories found", subcategory: [] });
    } else {
      res.send({ subcategory }).status(200);
    }
  } catch (err) {
    console.error("Error finding Subcategories:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const typeSchemaStructure = new mongoose.Schema({
  typeName: {
    type: String,
    required: true,
  },
});

const Type = mongoose.model("typecollection", typeSchemaStructure);

app.post("/Type", async (req, res) => {
  try {
    const { typeName } = req.body;

    let type = await Type.findOne({ typeName });

    if (type) {
      return res.json({ message: "Type already exists" });
    }

    type = new Type({
      typeName,
    });

    await type.save();

    res.json({ message: "Type inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Type", async (req, res) => {
  try {
    const type = await Type.find();
    if (type.length === 0) {
      return res.send({ message: "No types found", type: [] });
    } else {
      res.send({ type }).status(200);
    }
  } catch (err) {
    console.error("Error finding Types:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Type/:id", async (req, res) => {
  try {
    const typeId = req.params.id;
    const deleteType = await Type.findByIdAndDelete(typeId);

    if (!deleteType) {
      return res.json({ message: "Type not found" });
    } else {
      res.json({ message: "Type deleted successfully", deleteType });
    }
  } catch (err) {
    console.error("Error deleting Type:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Type/:id", async (req, res) => {
  try {
    const typeId = req.params.id;
    const { typeName } = req.body;

    let type = await Type.findByIdAndUpdate(
      typeId,
      { typeName },
      { new: true }
    );

    if (!type) {
      return res.json({ message: "Type not found" });
    } else {
      res.json({ message: "Type updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const sizeSchemaStructure = new mongoose.Schema({
  sizeName: {
    type: String,
    required: true,
  },
});

const Size = mongoose.model("sizecollection", sizeSchemaStructure);

app.post("/Size", async (req, res) => {
  try {
    const { sizeName } = req.body;

    let size = await Size.findOne({ sizeName });

    if (size) {
      return res.json({ message: "Size already exists" });
    }

    size = new Size({
      sizeName,
    });

    await size.save();

    res.json({ message: "Size inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Size", async (req, res) => {
  try {
    const size = await Size.find();
    if (size.length === 0) {
      return res.send({ message: "No sizes found", size: [] });
    } else {
      res.send({ size }).status(200);
    }
  } catch (err) {
    console.error("Error finding Sizes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Size/:id", async (req, res) => {
  try {
    const sizeId = req.params.id;
    const deleteSize = await Size.findByIdAndDelete(sizeId);

    if (!deleteSize) {
      return res.json({ message: "Size not found" });
    } else {
      res.json({ message: "Size deleted successfully", deleteSize });
    }
  } catch (err) {
    console.error("Error deleting Size:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Size/:id", async (req, res) => {
  try {
    const sizeId = req.params.id;
    const { sizeName } = req.body;

    let size = await Size.findByIdAndUpdate(
      sizeId,
      { sizeName },
      { new: true }
    );

    if (!size) {
      return res.json({ message: "Size not found" });
    } else {
      res.json({ message: "Size updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const fitSchemaStructure = new mongoose.Schema({
  fitName: {
    type: String,
    required: true,
  },
});

const Fit = mongoose.model("fitcollection", fitSchemaStructure);

app.post("/Fit", async (req, res) => {
  try {
    const { fitName } = req.body;

    let fit = await Fit.findOne({ fitName });

    if (fit) {
      return res.json({ message: "Fit already exists" });
    }

    fit = new Fit({
      fitName,
    });

    await fit.save();

    res.json({ message: "Fit inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Fit", async (req, res) => {
  try {
    const fit = await Fit.find();
    if (fit.length === 0) {
      return res.send({ message: "No fits found", fit: [] });
    } else {
      res.send({ fit }).status(200);
    }
  } catch (err) {
    console.error("Error finding Fits:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Fit/:id", async (req, res) => {
  try {
    const fitId = req.params.id;
    const deleteFit = await Fit.findByIdAndDelete(fitId);

    if (!deleteFit) {
      return res.json({ message: "Fit not found" });
    } else {
      res.json({ message: "Fit deleted successfully", deleteFit });
    }
  } catch (err) {
    console.error("Error deleting Fit:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Fit/:id", async (req, res) => {
  try {
    const fitId = req.params.id;
    const { fitName } = req.body;

    let fit = await Fit.findByIdAndUpdate(fitId, { fitName }, { new: true });

    if (!fit) {
      return res.json({ message: "Fit not found" });
    } else {
      res.json({ message: "Fit updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const colorSchemaStructure = new mongoose.Schema({
  colorName: {
    type: String,
    required: true,
  },
});

const Color = mongoose.model("colorcollection", colorSchemaStructure);

app.post("/Color", async (req, res) => {
  try {
    const { colorName } = req.body;

    let color = await Color.findOne({ colorName });

    if (color) {
      return res.json({ message: "Color alreay exists" });
    }

    color = new Color({
      colorName,
    });

    await color.save();

    res.json({ message: "Color inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Color", async (req, res) => {
  try {
    const color = await Color.find();
    if (color.length === 0) {
      return res.send({ message: "No colors found", color: [] });
    } else {
      res.send({ color }).status(200);
    }
  } catch (err) {
    console.error("Error finding Colors:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Color/:id", async (req, res) => {
  try {
    const colorId = req.params.id;
    const deleteColor = await Color.findByIdAndDelete(colorId);

    if (!deleteColor) {
      return res.json({ message: "Color not found" });
    } else {
      res.json({ message: "Color deleted successfully", deleteColor });
    }
  } catch (err) {
    console.error("Error deleting Color:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Color/:id", async (req, res) => {
  try {
    const colorId = req.params.id;
    const { colorName } = req.body;

    let color = await Color.findByIdAndUpdate(
      colorId,
      { colorName },
      { new: true }
    );

    if (!color) {
      return res.json({ message: "Color not found" });
    } else {
      res.json({ message: "Color updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const materialSchemaStructure = new mongoose.Schema({
  materialName: {
    type: String,
    required: true,
  },
});

const Material = mongoose.model("materialcollection", materialSchemaStructure);

app.post("/Material", async (req, res) => {
  try {
    const { materialName } = req.body;

    let material = await Material.findOne({ materialName });

    if (material) {
      return res.json({ message: "Material already exists" });
    }

    material = new Material({
      materialName,
    });

    await material.save();

    res.json({ message: "Material inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Material", async (req, res) => {
  try {
    const material = await Material.find();
    if (material.length === 0) {
      return res.send({ message: "No materials found", material: [] });
    } else {
      res.send({ material }).status(200);
    }
  } catch (err) {
    console.error("Error finding Materials:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Material/:id", async (req, res) => {
  try {
    const materialId = req.params.id;
    const deleteMaterial = await Material.findByIdAndDelete(materialId);

    if (!deleteMaterial) {
      return res.json({ message: "Material not found" });
    } else {
      res.json({ message: "Material deleted successfully", deleteMaterial });
    }
  } catch (err) {
    console.error("Error deleting Material:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Material/:id", async (req, res) => {
  try {
    const materialId = req.params.id;
    const { materialName } = req.body;

    let material = await Material.findByIdAndUpdate(
      materialId,
      { materialName },
      { new: true }
    );

    if (!material) {
      return res.json({ message: "Material not found" });
    } else {
      res.json({ message: "Material updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const brandSchemaStructure = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
  },
});

const Brand = mongoose.model("brandcollection", brandSchemaStructure);

app.post("/Brand", async (req, res) => {
  try {
    const { brandName } = req.body;

    let brand = await Brand.findOne({ brandName });

    if (brand) {
      return res.json({ message: "Brand already exists" });
    }

    brand = new Brand({
      brandName,
    });

    await brand.save();

    res.json({ message: "Brand inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Brand", async (req, res) => {
  try {
    const brand = await Brand.find();
    if (brand.length === 0) {
      return res.send({ message: "No brands found", brand: [] });
    } else {
      res.send({ brand }).status(200);
    }
  } catch (err) {
    console.error("Error finding Brands:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Brand/:id", async (req, res) => {
  try {
    const brandId = req.params.id;
    const deleteBrand = await Brand.findByIdAndDelete(brandId);

    if (!deleteBrand) {
      return res.json({ message: "Brand not found" });
    } else {
      res.json({ message: "Brand deleted successfully", deleteBrand });
    }
  } catch (err) {
    console.error("Error deleting Brand:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Brand/:id", async (req, res) => {
  try {
    const brandId = req.params.id;
    const { brandName } = req.body;

    let brand = await Brand.findByIdAndUpdate(
      brandId,
      { brandName },
      { new: true }
    );

    if (!brand) {
      return res.json({ message: "Brand not found" });
    } else {
      res.json({ message: "Brand updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const districtSchemaStructure = new mongoose.Schema({
  districtName: {
    type: String,
    required: true,
  },
});

const District = mongoose.model("districtcollection", districtSchemaStructure);

app.post("/District", async (req, res) => {
  try {
    const { districtName } = req.body;
    let district = await District.findOne({ districtName });

    if (district) {
      return res.json({ message: "District already existing" });
    }

    district = new District({
      districtName,
    });

    await district.save();
    let content = ` 
 <html>
<head>
    <title>OTP Email</title>
    <style>
        /* Define the style for the container */
        .container {
            width: 90%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f2f2f2;
            font-family: Arial, sans-serif;
        }

        /* Define the style for the OTP box */
        .otp-box {
            width: 90%;
             max-width: 600px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
        }

        /* Define the style for the OTP text */
        .otp-text {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
        }

        /* Define the style for the OTP number */
        .otp-number {
            font-size: 48px;
            font-weight: bold;
            color: #007bff;
            margin-top: 10px;
        }

        /* Define the style for the instructions text */
        .instructions {
            font-size: 14px;
            color: #666666;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <!-- Display OTP in an improved email view -->
    <div class="container">
        <div class="otp-box">
            <div class="otp-text">One-Time Password (OTP)</div>
            <div class="otp-number">123456</div>
            <div class="instructions">Please use the above OTP to verify your account.</div>
        </div>
    </div>
</body>
</html> `;
    sendEmail("jaisjose5050@gmail.com", content, "verify");

    res.json({ message: "District inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/District", async (req, res) => {
  try {
    const district = await District.find();

    if (district.length === 0) {
      return res.send({ message: "No ditricts found", district: [] });
    } else {
      res.send({ district }).status(200);
    }
  } catch (err) {
    console.error("Error Finding Categories:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/District/:id", async (req, res) => {
  try {
    const districtId = req.params.id;
    const deleteDistrict = await District.findByIdAndDelete(districtId);

    if (!deleteDistrict) {
      return res.json({ message: "District not found" });
    } else {
      res.json({ message: "District deleted successfully", deleteDistrict });
    }
  } catch (err) {
    console.error("Error deleting district", err);
    res.status(500).json({ message: "Internal serve erro" });
  }
});

app.put("/District/:id", async (req, res) => {
  try {
    const districtId = req.params.id;
    const { districtName } = req.body;
    let districtEdit = await District.findByIdAndUpdate(
      districtId,
      { districtName },
      { new: true }
    );

    if (!districtEdit) {
      return res.json({ message: "District not found" });
    } else {
      res.json({ message: "District updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const placeSchemaStructure = new mongoose.Schema({
  placeName: {
    type: String,
    required: true,
  },
  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "districtcollection",
    required: true,
  },
});

const Place = mongoose.model("placecollection", placeSchemaStructure);

app.post("/Place", async (req, res) => {
  try {
    const { placeName, districtId } = req.body;

    let place = await Place.findOne({ placeName });

    if (place) {
      return res.json({ message: "Place already exists" });
    }

    place = new Place({
      placeName,
      districtId,
    });

    await place.save();
    res.json({ message: "Place inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Place", async (req, res) => {
  try {
    const place = await Place.find();
    if (place.length === 0) {
      return res.send({ message: "No places found", places: [] });
    }
    res.status(200).send({ place });
  } catch (err) {
    console.error("Error fetching places:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Place/:id", async (req, res) => {
  try {
    const placeId = req.params.id;
    const deletedPlace = await Place.findByIdAndDelete(placeId);

    if (!deletedPlace) {
      return res.json({ message: "Place not found" });
    }

    res.json({ message: "Place deleted successfully", deletedPlace });
  } catch (err) {
    console.error("Error deleting place:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/Place/:id", async (req, res) => {
  try {
    const placeId = req.params.id;
    const { placeName, districtId } = req.body;

    let place = await Place.findByIdAndUpdate(
      placeId,
      { placeName, districtId },
      { new: true }
    );

    if (!place) {
      return res.json({ message: "Place not found" });
    }

    res.json({ message: "Place updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Place populate

app.get("/PlacePopulate", async (req, res) => {
  try {
    const place = await Place.find().populate("districtId");

    if (place.length === 0) {
      return res.send({ message: "No places found", place: [] });
    }

    res.status(200).send({ place });
  } catch (err) {
    console.error("Error populating places:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//-------Login-------
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ userEmail: email });

  const admin = await Admin.findOne({adminEmail: email});

  const shop = await Shop.findOne({ shopEmail: email });

  if (user) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.loginOtp = otp;
      user.loginOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
      await user.save();

      // Send OTP Email
      const html = `
        <h3>User Login Verification</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>Valid for 5 minutes</p>
      `;

      sendEmail(user.userEmail, html, "Login OTP");

      return res.json({
        role: "user",
        step: "otp",
        userId: user._id,
        message: "OTP sent to your email",
      });
    } else if (admin) {
    const isMatch = await admin.comparePassword(password);

    if(!isMatch) {
      return res.status(401).json({message: "Invalid email or password" })
    }

    return res.send({
      role: "admin",
      id: admin._id,
      name: admin.adminName,
      message: "Login successful",
    });
  } else if (shop) {
    const isMatch = await shop.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({message: "Invalid email or password"});
    }

    if (shop.shopStatus === "verified") {
      return res.send({
        role: "shop",
        id: shop._id,
        name: shop.shopName,
        message: "Login successful",
      });
    } else if (shop.shopStatus === "rejected") {
      return res.send({
        message:
          "Sorry, your shop registration has been rejected. You cannot login. Please contact the admin for further assistance.",
      });
    } else if (shop.shopStatus === "pending") {
      return res.send({
        message:
          "Your shop is not verified yet. Please wait for admin approval.",
      });
    }
  } else {
    return res.status(401).json({ message: "Invalid email or passowrd" });
  }
});

//Otp-Verification
app.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.loginOtp !== otp ||
      user.loginOtpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.loginOtp = undefined;
    user.loginOtpExpiry = undefined;
    await user.save();

    // 🔐 CREATE JWT
    const token = generateToken({
      userId: user._id,
      role: "user",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.userName,
        email: user.userEmail
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



app.put("/ChangePassword", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.userPassword = newPassword;
    await user.save();

    res.json({ messge: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing paassword", err);
    res.status(500).json({ message: "Server error" });
  }
});

//CREATE PAYMENT ORDER
app.post("/create-order", async (req, res) => {
  try {
    let { amount } = req.body;

    amount = Number(amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Convert to paise & ensure integer
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      userName,
      contactNo,
      deliveryAddress,
      amount,
    } = req.body;

    console.log("Received orderId:", orderId);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          orderStatus: "paymentSuccess",
          razorpayPaymentId: razorpay_payment_id,
          totalAmount: amount,
          userName: userName,
          contactNo: contactNo,
          deliveryAddress: deliveryAddress,
        },
        { new: true }
      );

      const orderItems = await OrderItem.find({ orderId });
      for (let item of orderItems) {
        await Stock.findOneAndUpdate(
          { variantSizeId: item.variantSizeId },
          { $inc: { stockQuantity: -item.quantity } }
        );
      }

      return res.status(200).json({
        message: "Payment verified",
        orderId: updatedOrder._id,
        paymentId: razorpay_payment_id,
        amount: updatedOrder.totalAmount,
        deliveryAddress: updatedOrder.deliveryAddress,
      });
    } else {
      return res.status(400).json({ message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Payment verificatio  error", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});
