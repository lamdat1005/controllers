const User = require('../models/User'); // Model dữ liệu người dùng
const bcrypt = require('bcrypt');       // Thư viện mã hóa mật khẩu

// Lấy danh sách toàn bộ người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Truy vấn tất cả người dùng
    res.json(users);                 // Trả về danh sách JSON
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách người dùng.' });
  }
};

// Tạo mới một người dùng
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body; // Nhận dữ liệu từ request
  try {
    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save(); // Lưu user mới vào CSDL
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo mới người dùng.' });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  const { id } = req.params; // Lấy id từ URL
  const { name, email } = req.body; // Nhận các trường cập nhật
  try {
    const user = await User.findByIdAndUpdate(id, { name, email }, { new: true }); // Cập nhật và trả về user mới
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật thông tin người dùng.' });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  const { id } = req.params; // Lấy id từ URL
  try {
    const result = await User.findByIdAndDelete(id); // Xóa user
    if (!result) {
      return res.status(404).json({ message: 'Không tìm thấy user.' });
    }
    res.json({ message: 'Đã xóa user thành công.' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa người dùng.' });
  }
};
