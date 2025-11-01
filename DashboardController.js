const Order = require('../models/Order'); // Model đơn hàng
const User = require('../models/User');   // Model người dùng
const Book = require('../models/Book');   // Model sách

// Hàm trả dữ liệu tổng quan dashboard cho admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();       // Đếm số lượng người dùng
    const totalBooks = await Book.countDocuments();       // Đếm số lượng sách
    const totalOrders = await Order.countDocuments();     // Đếm số lượng đơn hàng
    const recentOrders = await Order.find()               // Lấy 5 đơn hàng mới nhất
      .sort({ createdAt: -1 })
      .limit(5);

    // Trả về số liệu tổng quan & đơn hàng mới nhất
    res.json({
      stats: {
        users: totalUsers,
        books: totalBooks,
        orders: totalOrders
      },
      recentOrders
    });
  } catch (err) {
    // Báo lỗi truy vấn số liệu
    res.status(500).json({ message: 'Lỗi lấy dữ liệu tổng quan.' });
  }
};
