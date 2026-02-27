require('dotenv').config(); // .env ဖိုင်ထဲက အချက်အလက်တွေကို သုံးနိုင်အောင် လုပ်ခြင်း
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware များ
app.use(cors());
app.use(express.json());
app.use('/images', express.static('images')); // ပုံတွေပေါ်လာအောင် လုပ်ဆောင်ခြင်း

// Database ချိတ်ဆက်မှု (Connection String ကို .env ထဲကနေ ယူသုံးပါမည်)
const dbURI = process.env.MONGODB_URI; 

mongoose.connect(dbURI)
  .then(() => console.log('Database ချိတ်ဆက်မှု အောင်မြင်ပါသည်'))
  .catch((err) => console.log('Database error:', err));

// Schema နှင့် Model သတ်မှတ်ခြင်း
const productSchema = new mongoose.Schema({
  name_en: String,
  name_mm: String,
  price: String,
  category: String,
  image_url: String
});

const Product = mongoose.model('Product', productSchema);

// API Routes
// ၁။ ပစ္စည်းစာရင်းအားလုံးကို ပြန်ပေးရန်
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Data ဆွဲယူရာတွင် အမှားရှိပါသည်" });
  }
});

// ၂။ ပစ္စည်းအသစ် ထည့်သွင်းရန်
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: "ပစ္စည်းထည့်သွင်းမှု မအောင်မြင်ပါ" });
  }
});

// Server ဖွင့်လှစ်ခြင်း (Render အတွက် Port ကို ပြောင်းလွယ်ပြင်လွယ် ထားထားပါသည်)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});