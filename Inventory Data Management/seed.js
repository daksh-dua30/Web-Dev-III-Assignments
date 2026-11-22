const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");

dotenv.config();

const sampleProducts = [
  {
    name: "Study Table",
    sku: "FURN-TB-812",
    category: "Furniture",
    price: 3999,
    quantity: 2,
    reorderLevel: 4,
    supplier: "IKEA India",
  },
  {
    name: "Ergonomic Office Chair",
    sku: "FURN-CH-104",
    category: "Furniture",
    price: 7499,
    quantity: 8,
    reorderLevel: 3,
    supplier: "Godrej Interio",
  },
  {
    name: "Mechanical Keyboard",
    sku: "ELEC-KB-201",
    category: "Electronics",
    price: 4299,
    quantity: 25,
    reorderLevel: 10,
    supplier: "Logitech India",
  },
  {
    name: "Wireless Gaming Mouse",
    sku: "ELEC-MS-202",
    category: "Electronics",
    price: 2499,
    quantity: 40,
    reorderLevel: 15,
    supplier: "Logitech India",
  },
  {
    name: "27-inch IPS Monitor",
    sku: "ELEC-MN-203",
    category: "Electronics",
    price: 14999,
    quantity: 3,
    reorderLevel: 5,
    supplier: "LG Electronics",
  },
  {
    name: "USB-C Hub 7-in-1",
    sku: "ELEC-HB-204",
    category: "Electronics",
    price: 1499,
    quantity: 28,
    reorderLevel: 10,
    supplier: "Anker India",
  },
  {
    name: "Cotton Polo T-Shirt",
    sku: "APPR-TS-301",
    category: "Apparel",
    price: 899,
    quantity: 50,
    reorderLevel: 15,
    supplier: "FabIndia",
  },
  {
    name: "Denim Jacket",
    sku: "APPR-JK-302",
    category: "Apparel",
    price: 1899,
    quantity: 20,
    reorderLevel: 8,
    supplier: "Levis India",
  },
  {
    name: "Spiral Notebook A4",
    sku: "STNY-NB-401",
    category: "Stationery",
    price: 180,
    quantity: 5,
    reorderLevel: 15,
    supplier: "Classmate",
  },
  {
    name: "Whiteboard Marker Set",
    sku: "STNY-MK-402",
    category: "Stationery",
    price: 220,
    quantity: 35,
    reorderLevel: 10,
    supplier: "Camlin",
  },
  {
    name: "Roasted Coffee Beans 500g",
    sku: "GROC-CF-501",
    category: "Groceries",
    price: 650,
    quantity: 4,
    reorderLevel: 10,
    supplier: "Blue Tokai",
  },
  {
    name: "Green Tea Pack of 50",
    sku: "GROC-GT-502",
    category: "Groceries",
    price: 320,
    quantity: 30,
    reorderLevel: 12,
    supplier: "Organic India",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log("12 sample products inserted successfully.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exit(1);
  }
};

seedDatabase();
