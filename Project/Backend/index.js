const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const mailer = require('nodemailer');

// const bodyParser = require("body-parser");
const port = 5000;
const multer = require("multer");

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
    })
})

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
      pass: "ceomswufmvsviqcl", // App password created from google account
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


app.get('/Test', (req, res) => {
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
        required: true
    }
});

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
            adminPassword
        });

        await admin.save();
         

        res.json({ mesasge: "Admin inserted successfully" });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/Admin", async (req, res) =>{
    try{
        const admin = await Admin.find();

        if(admin.length === 0){
            return res.send({message: "Admin not found"});
        } else{
            res.send({admin}).status(200);
        }
    } catch(err) {
        console.error("Error finding admin:",err);
        res.status(500).json({message: "internal server error"});
    }
});

app.get("/AdminById/:id", async (req, res) =>{
    try{
        const adminId = req.params.id;
        const admin = await Admin.findById(adminId);

        if(!admin){
            return res.send({mesasge: "Admin not found", admin: {}});
        } else {
            res.send({admin}).status(200);
        }
    } catch(err) {
        console.error("Error finding Admin:", err);
        res.status(500).json({message: "Internal server error"});
    }
});

app.delete("/Admin/:id", async (req, res)=> {
    try{
        const adminId = req.params.id;
        const deleteAdmin = await Admin.findByIdAndDelete(adminId);

        if(!deleteAdmin) {
            return res.json({message: "Admin not found"});
        } else{
            res.json({message: "Admin deleted successfully", deleteAdmin});
        }
    } catch(err) {
        console.error("Error deleting admin:", err);
        res.status(500).json({message: "Internal server error"});
    }
});

app.put("/Admin/:id", async (req, res) => {
    try{
        const adminId = req.params.id;
        const {adminName, adminEmail, adminContact, adminPassword} = req.body;

        let admin = await Admin.findByIdAndUpdate(adminId, {adminName, adminEmail, adminContact}, {new: true});

        if(admin){
            res.json({message: "Admin updated successfully"});
        } else {
            res.json({message: "Admin not found"});
        }

    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});








const shopSchemaStructure = new mongoose.Schema({
    shopName: {
        type: String,
        required: true
    },
    shopEmail: {
        type: String,
        required: true
    },
    shopContact: {
        type: String,
        required: true
    },
    shopPassword: {
        type: String,
        required: true
    },
    shopAddress: {
        type: String,
        required: true
    },
    shopImage: {
        type: String,
        required: true

    },
    shopProof: {
        type: String,
        required: true

    },
    PANNO: {
        type: String,
        required: true
    },
    GSTNO: {
        type: String,
        required: true
    },
    shopLocation: {
        type: String,
        required: true
    },
    placeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "placecollection",
        // required: true
    },
    shopStatus: {
        type: String,
        enum: ["pending", "rejected", "verified"],
        default: "pending",
    }
});

const Shop = mongoose.model("shopcollection", shopSchemaStructure);

app.post("/Shop", upload.fields([
    { name: "shopImage", maxCount: 1 },
    { name: "shopProof", maxCount: 1 },
]), async (req, res) => {
    try {
        const { shopName, shopEmail, shopContact, shopPassword, shopAddress, PANNO, GSTNO, shopLocation, placeId } = req.body;

        let shop = await Shop.findOne({ shopEmail });

        if (shop) {
            return res.json({ message: "Shop already exists" });
        }

        const baseUrl = `http://127.0.0.1:${port}`;

        const shopImage = req.files.shopImage ? `${baseUrl}/images/${req.files.shopImage[0].filename}` : "";
        const shopProof = req.files.shopProof ? `${baseUrl}/images/${req.files.shopProof[0].filename}` : "";

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
            placeId

        });

        await shop.save();

        res.json({ message: "Registration completed successfully! Please wait for verification.", shop });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/Shop", async (req, res) =>{
    try{  
        const shop = await Shop.find();

        if(shop.length === 0){
            return res.send({message: "Shop not found", shop: []})
        } else {
            res.send({shop}).status(200);
        }
    } catch(err) {
        console.error("Error finding shops:", err);
        res.status(500).json({message: "Internal server error"});
    }
});

// Fetch specific shop data
app.get("/Shop/:id", async (req, res) =>{
    try{ 
        const shopId = req.params.id; 
        const shop = await Shop.findById(shopId).populate({path: "placeId", populate: {path: "districtId"}});
        
        if(!shop){
            return res.status(404).json({message: "Shop not found"});
        }

        res.status(200).json({shop});
    } catch(err) {
        console.error("Error fetching shop details:", err);
        res.status(500).json({message: "Internal server error"});
    }
});

app.delete("/Shop/:id", async (req, res) =>{
    try{
        const shopId = req.params.id;
        const deleteShop = await Shop.findByIdAndDelete(shopId);

        if(!deleteShop){
            return res.json({message: "Shop not found"});
        } else{
            res.json({message: "Shop deleted successfully", deleteShop});
        }
    } catch(err) {
        console.error("Error deleting shop:", err);
        res.status(500).json({message: "Internal srever error"});
    }
});

app.put("/Shop/:id", upload.fields([
    {name: "shopImage", maxCount: 1},
    {name: "shopProof", maxCount: 1},
]), async (req, res) =>{
    try{
        const shopId = req.params.id;
        const { shopName, shopEmail, shopContact, shopPassword, shopAddress, PANNO, GSTNO, shopLocation } = req.body;

        const shopImage = req.files.shopImage ? "/images/" + req.files.shopImage[0].filename : "";
        const shopProof = req.files.shopProof ? "/images/" + req.files.shopProof[0].filename : "";

        let shop = await Shop.findByIdAndUpdate(shopId, {shopName,
            shopEmail,
            shopContact,
            shopPassword,
            shopAddress,
            PANNO,
            GSTNO,
            shopLocation,
            shopImage,
            shopProof}, {new: true});

        if(!shop){
            return res.json({message: "Shop not found"});
        } else{
            res.json({message: "Shop updated successfully"});
        }

       
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Shop Verification

app.put(`/ShopVerification/:id`, async (req, res) => {
    try{
        const shopId = req.params.id;
        const { status } = req.body;

        let shop = await Shop.findByIdAndUpdate(shopId,{shopStatus: status},{new: true});
        
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }
        const isVerified = status === "verified";
        const message = isVerified ? "Shop verified successfully" : "Shop rejected successfully";
        
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
    sendEmail(shop.shopEmail, content, status ? "Shop Registration Verified" : "Shop registrarion Rejected");
        res.status(200).json({ message, shop });
    } catch(err) {
        console.error("Error verifying shop:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})









const userSchemaStructure = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userContact: {
        type: String,
        // required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userAddress: {
        type: String,
        // required: true
    },
    userLocation: {
        type: String,
        required: true
    },
    placeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "placecollection",
        // required: true
    }
});

const User = mongoose.model("usercollection", userSchemaStructure);

app.post("/User", async (req, res) => {
    try {
        const { userName, userEmail, userContact, userPassword, userAddress, userLocation, placeId } = req.body;

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
            placeId
        });

        await user.save();

        res.json({ message: "User registartion successfully completed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/User", async (req, res) =>{
    try{
       const user = await User.find().populate("placeId");
       if(user.length === 0){
        return res.send({message: "Users not found", user :[]});
       } else {
        res.send({user}).status(200);
       }
    } catch{
        console.error("Error finding User:", err);
        res.status(500).json({message: "Internal server error"});
    }
});

app.delete("/User/:id", async (req, res) =>{
    try{
        const userId = req.params.id;
        const deleteUser = await User.findByIdAndDelete(userId);

        if(!    deleteUser){
            return res.json({message: "User not found"});
        } else{
            res.json({message: "User deleted successfully", deleteUser})
        }
    } catch(err) {
        console.error("Error deleting User:", err);
        res.status(500).json({message: "Internal server error"});
    }
});

app.put("/User/:id", async (req, res) =>{
    try{
        const userId = req.params.id;
        const { userName, userEmail, userContact, userPassword, userAddress, userLocation } = req.body;

        const user = await User.findByIdAndUpdate(userId, { userName, userEmail, userContact, userPassword, userAddress, userLocation });

        if(!user){
            return res.json({message: "User not found"});
        } else {
            res.json({message: "User updated successfully", user})
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});









const productSchemaStructure = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shopcollection",
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategorycollection",
        required: true
    },
    productPrice: {
        type: String,
        required: true
    },
    fitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fitcollection",
    },
    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "materialcollection",
        required: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brandcollection",
        required: true
    }

});

const Product = mongoose.model("productcollection", productSchemaStructure);

app.post("/Product", async (req, res) => {
    try {
        const { shopId, productName, productDescription, categoryId, subcategoryId, productPrice, fitId, materialId, brandId } = req.body;

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

        });

        await product .save();

        res.json({ message: "Product adding completed successfully", product });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/Product", async (req, res) => {
    try {
        const products = await Product.find();

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
try{
    const productId = req.params.id;
    const { shopId, productName, productDescription, categoryId, subcategoryId, productPrice, fitId, materialId, brandId } = req.body;

    let product = await Product.findByIdAndUpdate(productId,
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
        {new: true}
    );

    if(!product){
        return res.json({message: "Product not found"});
    } else{
        res.json({message: "Product updated successfully"});
    }
} catch(err) {
    console.error(err.message);
    res.status(500).send("Server error");
}
});

//  Populate productcollection
app.get("/ProductPopulate", async (req, res) => {
    try {
        const products = await Product.find()
        .populate("shopId")
        .populate({
            path: "subcategoryId",
            populate: {
                path: "categoryId",
                model: "categorycollection"
            }
        })
        .populate("fitId")
        .populate("materialId")
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









const variantSchemaStructure = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productcollection",
        required: true
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "typecollection",
        required: true
    },
    sizeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sizecollection",
        required: true
    }
});

const Variant = mongoose.model("variantcollection", variantSchemaStructure);

app.post("/Variant", async (req, res) =>{
    try{
        const {productId, typeId, sizeId} = req.body;

        let variant = await Variant.findOne({productId, typeId, sizeId});

        if(variant){
            return res.json({message: "Variant already exists"});
        }

        variant = new Variant({
            productId,
            typeId,
            sizeId
        });

        await variant.save();

        res.json({message: "Variant addeed successfully"});
    } catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/Variant", async (req, res) =>{
    try{
        const variant = await Variant.find();
        if(variant.length === 0){
            return res.send({message: "Variant not found"});
        } else{
            res.send({variant}).status(200);
        }
    } catch(err) {
        console.error("Error finding variant:", err);
        res.status(500).json({message: "Internal server error"});
    }
});

app.delete("/Variant/:id", async (req, res) =>{
    try{
        const variantId = req.params.id;
        const deleteVariant = await Variant.findByIdAndDelete(variantId);

        if(!deleteVariant){
            return res.json({message: "Variant not found"});
        } else{
            res.json({message: "Variant deleted successfully", deleteVariant});
        }
    } catch(err) {
        console.error("Error deleting Variant:", err);
        res.status(500).json({message: "Internal server error"});
    }
});

app.put("/Variant/:id", async (req, res) =>{
    try{
        const varaintId = req.params.id;
        const {productId, typeId, sizeId} = req.body;

        let variant = await Variant.findByIdAndUpdate(varaintId, {productId, typeId, sizeId}, {new: true});

        if(!variant){
            return res.json({message: "varinat not found"});
        } else{
            res.json({message: "Varinat updated successfully"});
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Populate Variant

app.get("/VariantPopulate", async (req, res) =>{
    try{
        const variant = await Variant.find()
        .populate({
            path: "productId",
            populate: {
                path: "subcategoryId",
                populate: {
                    path: "categoryId"
                }
            }
        })
        .populate("typeId")
        .populate("sizeId");
        if(variant.length === 0){
            return res.send({message: "Variant not found"});
        } else{
            res.send({variant}).status(200);
        }
    } catch(err) {
        console.error("Error finding variant:", err);
        res.status(500).json({message: "Internal server error"});
    }
});








const imageSchemaStructure = new mongoose.Schema({
    productImage: {
        type: String,
        required: true
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "variantcollection",
        required: true
    }
});

const Image = mongoose.model("imagecollection", imageSchemaStructure);  

app.post("/Image", upload.single("productImage"),async (req, res) => {
    try{
        console.log("File recevied:", req.file);
        console.log("Body recevied:", req.body);

        const { variantId } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const image = new Image({
            productImage : req.file.filename,
            variantId,
        })
        
        await image.save();

        res.json({message: "Product image inserted", data: image});
    } catch (err) {
        console.error("Error uploading image:", err);
        res.status(500).send("Server error");
    }
});

app.get("/Image/:id", async (req, res) => {
    try {
        const imageId = req.params.id;
        const image = await Image.findById(imageId).populate("variantId");

        if (!image) {
            return res.json({ message: "Image not found" });
        }

        res.json({ message: "Image fetched successfully", image });

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

        const updatedImage = await Image.findByIdAndUpdate(imageId, updateData, { new: true });

        if (!updatedImage) {
            return res.json({ message: "Image not found" });
        }

        res.json({ message: "Image updated successfully", updatedImage });

    } catch (err) {
        console.error("Error updating image:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});











const orderSchemaStruture = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usercollection",
        required: true
    },
    totalAmount: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled", "returned"],
        default: "processing"
    },
    transactionId: {
        type: String,
        required: true
    }
});

const Order = mongoose.model("ordercollection", orderSchemaStruture);

app.post("/Order", async (req, res) =>{
    try{
        const {userId, totalAmount, transactionId} = req.body;

        let order = await Order.findOne({transactionId});

        if(order){
            return res.json({message: "Order already exists"});
        }

        order = new Order({
            userId,
            totalAmount,
            transactionId
        });

        await order.save();

        res.json({message: "Order inserted successfully"});
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/Order", async (req, res) =>{
    try{
        const order = await Order.find();
        if(order.length === 0){
            return res.send({message: "Order not found", order: []});
        } else {
            res.send({order}).status(200);
        }
    } catch(err){
        console.error("Error Finding Order:", err);
        res.status(500).json({ message: "Internal server error" })
    }
});

app.delete("/Order/:id", async (req, res) =>{
    try{
        const orderId = req.params.id;
        const deleteOrder = await Order.findOneAndDelete(orderId);

        if(!deleteOrder) {
            res.json({message: "Order not found"});
        } else {
            res.json({message: "Order deleted successfully", deleteOrder});
        }
    } catch (err) {
        console.error("Error deleting order", err);
        res.status(500).json({message: "Server error"});
    }
});

app.put("/Order/:id", async (req, res) =>{
    try{
        const orderId = req.params.id;
        const {userId, totalAmount, transactionId} = req.body;

        const order = await Order.findByIdAndUpdate(orderId, {userId, totalAmount, transactionId}, {new: true});

        if(!order){
            res.json({message: "Order not found"});
        } else{
            res.json({message: "Order updated successfully", order})
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");  
    }
});

// Populate Order

app.get("/OrderPopulate", async (req, res) =>{
    try{
        const order = await Order.find().populate("userId", "userName userEmail");
        if(order.length === 0){
            return res.send({message: "Order not found", order: []});
        } else {
            res.send({order}).status(200);
        }
    } catch(err){
        console.error("Error Finding Order:", err);
        res.status(500).json({ message: "Internal server error" })
    }
});







const orderItemSchemaStructure = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ordercollection",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productcollection",
        required: true
    },
    orderItemPrice: {
        type: String,
        required: true
    },
    orderItemStatus: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled", "returned"],
        default: "processing"
    }
});

const OrderItem = mongoose.model("orderitemcollection", orderItemSchemaStructure);

app.post("/OrderItem", async (req, res) =>{
    try{
        const {orderId, productId, orderItemPrice} = req.body;

        let orderitem = await OrderItem.findOne({orderId, productId});

        if(orderitem){
            return res.json({message: "Order item already exists"});
        }

        orderitem = new OrderItem({
            orderId,
            productId,
            orderItemPrice,
        });

        await orderitem.save();

        res.json({message: "Order Item inserted successfully"});
    } catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/OrderItem", async (req, res) => {
    try{
        const item = await OrderItem.find();
        if(item.length === 0){
            return res.send({message: "Order item not found", item: []});
        } else {
            res.send({item}).status(200);
        }
    } catch(err) {
        console.error("Error finding Order item:", err);
        res.status(500).json({message: "Internal server error"});
    }
});

app.delete("/OrderItem/:id", async (req, res) =>{
    try{
        const itemId = req.params.id;

        const deleteItem = await OrderItem.findByIdAndDelete(itemId);

    if (!deleteItem) {
      return res.json({ message: "Order item not found" });
    } else {
      res.json({ message: "Order item deleted successfully", deletedDistrict });
    }
  } catch (err) {
    console.error("Error deleting order item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/OrderItem/:id", async (req, res) => {
    try{
        const itemId = req.params.id;
        const {orderId, productId, orderItemPrice} = req.body;
        
        let item = await OrderItem.findByIdAndUpdate(itemId, {orderId, productId, orderItemPrice}, {new: true});
        
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
    try{
        const item = await OrderItem.find()
        .populate("orderId")
        .populate("productId");

        if(item.length === 0){
            return res.send({message: "Order item not found", item: []});
        } else {
            res.send({item}).status(200);
        }
    } catch(err) {
        console.error("Error finding Order item:", err);
        res.status(500).json({message: "Internal server error"});
    }
});









const wishListSchemaStructure = new mongoose.Schema({
    productId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "productcollection",
            required: true
        },
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usercollection",
        required: true
    }
});

const WishList = mongoose.model("wishlistcollection", wishListSchemaStructure);

app.post("/WishList", async (req, res) =>{
    try{
        const {userId, productId} = req.body;

        let wishlist = await WishList.findOne({userId, productId});

        if(wishlist){
            return res.json({message: "Product already exists in wish list"});
        }

        wishlist = new WishList({
            userId,
            productId
        });

        await wishlist.save();

        res.json({message: "Product added to wish list successfully"});
    } catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    } 
});

app.get("/WishList", async (req, res) =>{
    try{
        const wishlist = await WishList.find();

        if(wishlist.length === 0){
            return res.send({message: "Wish list not found"});
        } else{
            res.send({wishlist}).status(200);
        }
    } catch(err) {
        console.error("Error finding wishlist:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete("/WishList/:id", async (req, res) =>{
    try{
        const wishlistId = req.params.id;
        const deleteWishlist = await WishList.findByIdAndDelete(wishlistId);

        if(!deleteWishlist){
            return res.json({message: "Wishlist not found"});
        } else{
            res.json({message: "Wishlist deleted successfully"});
        }
    } catch(err) {
        console.error("Error deleting wishlist:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.put("/WishList/:id", async (req, res) => {
    try{
        const wishlistId = req.params.id;
        const {userId, productId} = req.body;

        let wishlist = await WishList.findByIdAndUpdate(wishlistId, {userId, productId}, {new: true});

        if(!wishlist){
            return res.json({message: "Wishlist not found"});
        } else{
            res.json({message: "Wishlist updated successfully"});
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Populate WishList

app.get("/WishListPopulate", async (req, res) =>{
    try{
        const wishlist = await WishList.find()
        .populate("userId", "userName userEmail")
        .populate("productId");

        if(wishlist.length === 0){
            return res.send({message: "Wish list not found"});
        } else{
            res.send({wishlist}).status(200);
        }
    } catch(err) {
        console.error("Error finding wishlist:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});










const complaintSchemaStructure = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productcollection",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usercollection",
        required: true
    },
    complaintTitle: {
        type: String,
        required: true
    },
    complaintDescription: {
        type: String,
        required: true
    },
    complaintReply: {
        type: String,
    },
    compalintStatus: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved", "Rejected"],
        default: "Pending"
    }
});

const Complaint = mongoose.model("complaintcollection", complaintSchemaStructure);

app.post("/Complaint", async (req, res) => {
    try {
        const { productId, userId, complaintTitle, complaintDescription, } = req.body;

        let complaint = await Complaint.findOne({ complaintTitle, productId, userId });

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
    try{
        const complaint  = await Complaint.find();

        if(complaint.length === 0){
            return res.json({message: "Complaint not found"});
        } else {
            res.send({complaint}).status(200);
        }
    } catch (err) {
        console.error("Error finding wishlist:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete("/Complaint/:id", async (req, res) => {
    try{
        const complaintId = req.params.id;
        const deleteComplaint = await Complaint.findByIdAndDelete(complaintId);
        
        if(!deleteComplaint){
            return res.json({message: "Complaint not found"});
        } else{
            res.json({message: "Complaint deleted successfully"});
        }
    } catch (err) {
        console.error("Error deleting complaint:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.put("/Complaint/:id", async (req, res) => {
    try{
        const complaintId = req.params.id;
        const { productId, userId, complaintTitle, complaintDescription, } = req.body;

        let complaint = await Complaint.findByIdAndUpdate(complaintId, { productId, userId, complaintTitle, complaintDescription, } , {new: true});

        if(!complaint){
            return res.json({message: "Complaint not found"});
        } else{
            res.json({message: "Complaint updated successfully"});
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Populate Complaint

app.get("/ComplaintPopulate", async (req, res) => {
    try{
        const complaint  = await Complaint.find()
        .populate("userId", "userName userEmail")
        .populate("productId");

        if(complaint.length === 0){
            return res.json({message: "Complaint not found"});
        } else {
            res.send({complaint}).status(200);
        }
    } catch (err) {
        console.error("Error finding wishlist:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});







const ratingReviewSchemaStructure = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usercollection",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productcollection",
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ordercollection",
        required: true
    },
    ratingValue: {
        type: String,
        required: true
    },
    reviewContent: {
        type: String,
        required: true
    },
    ratingReviewDate: {
        type: Date,
        default: Date.now
    }
});

const ReviewRating = mongoose.model("ratingreviewcollection", ratingReviewSchemaStructure);

app.post("/RatingReview", async (req, res) =>{
    try{
        const {userId, productId, orderId, ratingValue, reviewContent} = req.body;

        let ratingreview = await ReviewRating.findOne({orderId});

        if(ratingreview){
            return res.json({message: "Rating And review already exists"});
        }

        ratingreview = new ReviewRating({
            userId,
            productId,
            orderId,
            ratingValue,
            reviewContent
        });

        await ratingreview.save();

        res.json({message: "Rating and review inserted successfully"});
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/RatingReview", async (req, res) => {
    try{
        const ratingreview  = await ReviewRating.find();

        if(ratingreview.length === 0){
            return res.json({message: "Raitng review not found"});
        } else {
            res.send({ratingreview}).status(200);
        }
    } catch (err) {
        console.error("Error finding ratingreview:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete("/RatingReview/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const deleteRatingReview = await ReviewRating.findByIdAndDelete(id);
        
        if(!deleteRatingReview){
            return res.json({message: "Rating review not found"});
        } else{
            res.json({message: "Rating review deleted successfully"});
        }
    } catch (err) {
         console.error("Error deleting ratingreview:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.put("/RatingReview/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const {userId, productId, orderId, ratingValue, reviewContent} = req.body;

        let ratingreview = await ReviewRating.findByIdAndUpdate(id,{userId, productId, orderId, ratingValue, reviewContent}, {new: true} );
        
        if(!ratingreview){
            return res.json({message: "Rating review not found"});
        } else{
            res.json({message: "Rating review updated successfully"});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Populate RatingReview

app.get("/RatingReviewPopulate", async (req, res) => {
    try{
        const ratingreview  = await ReviewRating.find()
        .populate("userId", "userName userEmail")
        .populate("productId")
        .populate("orderId");

        if(ratingreview.length === 0){
            return res.json({message: "Raitng review not found"});
        } else {
            res.send({ratingreview}).status(200);
        }
    } catch (err) {
        console.error("Error finding ratingreview:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});








const categorySchemeStructure = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
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
        const {categoryName} = req.body;
        let category = await Category.findByIdAndUpdate(categoryId,{categoryName}, {new: true});

        if (!category) {
            return res.json({ message: "Category not found" });
        } else {
            res.json({ message: "Category updated successfully"});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});







const subcategorySchemaStructure = new mongoose.Schema({
    subcategoryName: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categorycollection",
        required: true
    }
});

const Subcategory = mongoose.model("subcategorycollection", subcategorySchemaStructure);

app.post("/Subcategory", async (req, res) => {
    try {
        const { subcategoryName, categoryId } = req.body;

        let subcategory = await Subcategory.findOne({ subcategoryName });

        if (subcategory) {
            return res.json({ message: "Subcategory already exists" });
        }

        subcategory = new Subcategory({
            subcategoryName,
            categoryId
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
        const deleteSubcategory = await Subcategory.findByIdAndDelete(subcategoryId);

        if (!deleteSubcategory) {
            return res.json({ message: "Subcategory not found" });
        } else {
            res.json({ message: "Subcategory deleted successfully", deleteSubcategory });
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
        required: true
    }
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
            typeName
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

        let type = await Type.findByIdAndUpdate(typeId, { typeName }, { new: true });

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
        required: true
    }
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
            sizeName
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

        let size = await Size.findByIdAndUpdate(sizeId, { sizeName }, { new: true });

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
        required: true
    }
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
            fitName
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
        required: true
    }
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
            colorName
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

        let color = await Color.findByIdAndUpdate(colorId, { colorName }, { new: true });

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
        required: true
    }
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
            materialName
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

        let material = await Material.findByIdAndUpdate(materialId, { materialName }, { new: true });

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
        required: true
    }
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
            brandName
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

        let brand = await Brand.findByIdAndUpdate(brandId, { brandName }, { new: true });

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







const stockSchemaStructure = new mongoose.Schema({
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "variantcollection",
        required: true
    },
    stockQuantity: {
        type: String,
        required: true
    },
    stockDate: {
        type: Date,
        default: Date.now
    },
    stockDescription: {
        type: String,
        required: true
    }
});

const Stock = mongoose.model("stockcollection", stockSchemaStructure);

app.post("/Stock", async (req, res) =>{
    try{
        const {variantId, stockQuantity, stockDescription} = req.body;

        let stock = await Stock.findOne({variantId});

        if(stock){
            return res.json({message: "Stock already exists"});
        }
    
        stock = new Stock({
            variantId,
            stockQuantity,
            stockDescription
        });

        await stock.save();

        res.json({message: "Stock added successfully"});
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/Stock", async (req, res) => {
    try{
        const stock = await Stock.find();
        
        if(stock.length === 0){
           return res.json({message: "Stock not found"}); 
        } else{
            res.send({stock}).status(200);
        }
    } catch(err) {
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
        const { variantId, stockQuantity, stockDescription } = req.body;

        let stock = await Stock.findByIdAndUpdate(
            stockId,
            { variantId, stockQuantity, stockDescription },
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
    try{
        const stock = await Stock.find()
        .populate("variantId");
        
        if(stock.length === 0){
           return res.json({message: "Stock not found"}); 
        } else{
            res.send({stock}).status(200);
        }
    } catch(err) {
         console.error("Error finding stock:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});







const productColorSchemaStructure = new mongoose.Schema({
    colorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "colorcollection",
        required: true
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "variantcollection",
        required: true
    }
});




const ProductColor = mongoose.model("productcolorcollection", productColorSchemaStructure);

app.post("/ProductColor", async (req, res) =>{
    try{
        const {colorId, variantId} = req.body;

        let productcolor = await ProductColor.findOne({variantId, colorId});

        if(productcolor){
            return res.json({message: "Product color already exists"});
        }

        productcolor = new ProductColor({
            colorId,
            variantId
        });

        await productcolor.save();

        res.json({message: "Product color added successfully"});
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/ProductColor", async (req, res) => {
    try {
        const productColors = await ProductColor.find();

        if (productColors.length === 0) {
            return res.send({ message: "No product colors found", productColors: [] });
        } else {
            res.send({ productColors }).status(200);
        }
    } catch (err) {
        console.error("Error finding Product Colors:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete("/ProductColor/:id", async (req, res) => {
    try {
        const productColorId = req.params.id;
        const deleteProductColor = await ProductColor.findByIdAndDelete(productColorId);

        if (!deleteProductColor) {
            return res.json({ message: "Product color not found" });
        } else {
            res.json({ message: "Product color deleted successfully", deleteProductColor });
        }
    } catch (err) {
        console.error("Error deleting Product Color:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.put("/ProductColor/:id", async (req, res) => {
    try {
        const productColorId = req.params.id;
        const { colorId, variantId } = req.body;

        let productColor = await ProductColor.findByIdAndUpdate(
            productColorId,
            { colorId, variantId },
            { new: true }
        );

        if (!productColor) {
            return res.json({ message: "Product color not found" });
        } else {
            res.json({ message: "Product color updated successfully" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Populate ProductColor

app.get("/ProductColorPopulate", async (req, res) => {
    try {
        const productColors = await ProductColor.find()
        .populate("colorId")
        .populate("variantId");

        if (productColors.length === 0) {
            return res.send({ message: "No product colors found", productColors: [] });
        } else {
            res.send({ productColors }).status(200);
        }
    } catch (err) {
        console.error("Error finding Product Colors:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

const districtSchemaStructure = new mongoose.Schema({
    districtName: {
        type: String,
        required: true
    }
});

const District = mongoose.model("districtcollection", districtSchemaStructure);

app.post("/District", async (req, res) =>{
    try{
        const {districtName} = req.body;
        let district = await District.findOne({districtName});

        if(district) {
            return res.json({message: "District already existing"});
        }

        district = new District({
            districtName,
        });

        await district.save();
         let content=` 
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
  sendEmail('abcd5050@gmail.com',content,'verify');  

        res.json({message: "District inserted successfully"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/District", async (req, res) =>{
    try{
        const district = await District.find();

        if(district.length === 0){
            return res.send({message: "No ditricts found", district: []});
        } else {
            res.send({district}).status(200);
        }
    } catch (err) {
        console.error("Error Finding Categories:", err);
        res.status(500).json({message: "Internal server error"});
    }
});

app.delete("/District/:id", async (req, res) =>{
    try{
        const districtId = req.params.id;
        const deleteDistrict = await District.findByIdAndDelete(districtId);

        if(!deleteDistrict) {
            return res.json({message: "District not found"});
        } else {
            res.json({message: "District deleted successfully", deleteDistrict});
        }
    } catch (err) {
        console.error("Error deleting district", err);
        res.status(500).json({message: "Internal serve erro"});
    }
});

app.put("/District/:id", async (req, res) =>{
    try{
        const districtId = req.params.id;
        const {districtName} = req.body;
        let districtEdit = await District.findByIdAndUpdate(districtId, {districtName}, {new: true});

        if(!districtEdit) {
            return res.json({message: "District not found"});
        } else {
            res.json({message: "District updated successfully"});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

const placeSchemaStructure = new mongoose.Schema({
    placeName: {
        type: String,
        required: true
    },
    districtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "districtcollection",
        required: true
    }
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
            districtId
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
app.post('/Login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({userEmail: email, userPassword: password});
    const admin = await Admin.findOne({adminEmail: email, adminPassword: password});
    const shop = await Shop.findOne({shopEmail: email, shopPassword: password});
    if(user){
        return res.send({
            role: "user",
            id: user._id,
            name: user.userName,
            message: "Login successful"
        });
    } else if(admin) {
        return res.send({
            role: "admin",
            id: admin._id,
            message: "Login successful"
        })
    }else if(shop){
        if(shop.shopStatus === "verified"){
            return res.send({
                role: "shop",
                id: shop._id,
                message: "Login successful"
            });
        } else if(shop.shopStatus === "rejected"){
            return res.send({
                message: "Sorry, your shop registration has been rejected. You cannot login. Please contact the admin for further assistance."
            });
        } else if(shop.shopStatus === "pending") {
            return res.send({
                message: "Your shop is not verified yet. Please wait for admin approval."
            });
        }
        
    } else {
        return res.status(401).json({message: "Invalid email or passowrd"});
    }
});