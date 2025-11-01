const Admin = require('../models/Admin'); // Model dữ liệu quản trị viên
const jwt = require('jsonwebtoken');      // Thư viện tạo/xác thực JWT
const bcrypt = require('bcrypt');         // Thư viện mã hóa & kiểm tra mật khẩu

// Hàm xử lý đăng nhập admin
exports.login = async (req, res) => {
  const { email, password } = req.body; // Lấy email, mật khẩu từ request
  try {
    // Tìm quản trị viên theo email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Không tìm thấy email trong hệ thống
      return res.status(401).json({ message: 'Email không tồn tại!' });
    }
    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      // Nếu mật khẩu không khớp
      return res.status(401).json({ message: 'Sai mật khẩu!' });
    }
    // Nếu đúng, tạo JWT token xác thực đăng nhập, role = admin
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
    // Trả về token và thông tin admin (trừ mật khẩu)
    res.json({ token, admin: { email: admin.email, name: admin.name } });
  } catch (err) {
    // Bắt lỗi hệ thống, trả về lỗi
    res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};