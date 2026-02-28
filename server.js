require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ပြင်ဆင်ပြီး

const app = express();

// Middleware များ
app.use(cors());
app.use(express.json());

// ပုံများရှိရာ folder ကို static အဖြစ် သတ်မှတ်ခြင်း
// Render ပေါ်မှာ /images/filename.jpg လို့ ခေါ်ရင် images folder ထဲမှာ သွားရှာမှာပါ
app.use('/images', express.static(path.join(__dirname, 'images')));

// Database ချိတ်ဆက်မှု
const dbURI = process.env.MONGODB_URI; 

mongoose.connect(dbURI)
  .then(() => console.log('Database ချိတ်ဆက်မှု အောင်မြင်ပါသည်'))
  .catch((err) => console.log('Database error:', err));

// Schema (vendor field လေးပါ တစ်ခါတည်း ထည့်ပေးထားပါတယ်)
const productSchema = new mongoose.Schema({
  name_en: String,
  name_mm: String,
  price: String,
  category: String,
  vendor: String,
  image_url: String
});

const Product = mongoose.model('Product', productSchema);

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Data ဆွဲယူရာတွင် အမှားရှိပါသည်" });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: "ပစ္စည်းထည့်သွင်းမှု မအောင်မြင်ပါ" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});