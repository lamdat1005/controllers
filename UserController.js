import User from "../models/User.js" // Model dữ liệu người dùng
const bcrypt = require('bcrypt');       // Thư viện mã hóa & kiểm tra mật khẩu

const users = []; // Mảng dùng lưu dữ liệu user tạm thời trên RAM (không dùng database)

// Lấy danh sách toàn bộ người dùng
export const getAllUsers = (req, res) => {
  res.json(users); // Trả về mảng users dạng JSON cho phía client
};

// Tạo mới một người dùng (email và password bắt buộc)
export const createUser = async (req, res) => {
  const { name, email, password } = req.body; // Nhận dữ liệu từ client gửi lên qua request

  // Kiểm tra ràng buộc: email và password bắt buộc phải có
  if (!email || !password) {
    return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc.' });
  }

  // Kiểm tra có bị trùng email không
  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'Email đã tồn tại.' });
  }

  // Mã hóa password bằng bcrypt, 10 rounds để an toàn ("10 rounds" làm mật khẩu an toàn hơn khi bẻ khóa bởi hacker)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo user mới với id tự động, lưu tên/email/mật khẩu mã hóa
  const newUser = {
    id: users.length + 1,      // Sinh id tự động (số thứ tự trong mảng)
    name,                      // Tên lấy từ request
    email,                     // Email lấy từ request
    password: hashedPassword   // Mật khẩu lưu ở dạng hash chứ KHÔNG phải text
  };

  users.push(newUser); // Thêm user mới vào mảng đã định nghĩa

  res.status(201).json(newUser); // Gửi lại kết quả cho phía client, mã trạng thái HTTP 201 (created)
};

// Cập nhật thông tin người dùng (có thể đổi trực tiếp name/email)
export const updateUser = (req, res) => {
  const { id } = req.params;              // Lấy id từ địa chỉ URL
  const { name, email } = req.body;       // Nhận dữ liệu muốn thay đổi từ request

  // Tìm user có id đúng
  const user = users.find(u => u.id == id);
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy user.' }); // Nếu không có user thì trả mã lỗi 404
  }

  if (name) user.name = name;             // Nếu truyền name mới thì cập nhật
  if (email) user.email = email;          // Nếu truyền email mới thì cập nhật

  res.json(user); // Trả lại kết quả sau cập nhật
};

// Xóa người dùng (dựa vào id truyền lên)
export const deleteUser = (req, res) => {
  const { id } = req.params;                // Lấy id từ URL
  const index = users.findIndex(u => u.id == id); // Tìm vị trí user cần xóa trong mảng

  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy user.' }); // Không có user để xóa thì trả lỗi 404
  }

  users.splice(index, 1); // Xóa user khỏi mảng

  res.json({ message: 'Đã xóa user thành công.' }); // Xác nhận đã xóa cho phía client
};
