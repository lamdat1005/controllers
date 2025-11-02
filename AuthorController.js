const Author = require('../models/Author'); // Import model Author

// Lấy tất cả tác giả
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors); // Trả về mảng tác giả cho admin
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách tác giả.' });
  }
};

// Chi tiết một tác giả theo id
exports.getAuthorDetail = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id); // Tìm theo id
    if (!author) return res.status(404).json({ message: 'Không tìm thấy tác giả.' });
    res.json(author); // Trả về chi tiết
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy chi tiết tác giả.' });
  }
};

// Tạo mới tác giả - cần tên (name) bắt buộc
exports.createAuthor = async (req, res) => {
  const { name, isActive } = req.body;
  if (!name) return res.status(400).json({ message: 'Tên tác giả là bắt buộc.' });
  try {
    const newAuthor = new Author({ name, isActive }); // Tạo instance model Author
    await newAuthor.save();                            // Save vào DB
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Lỗi tạo mới tác giả.' });
  }
};

// Sửa thông tin tác giả (name và isActive)
exports.updateAuthor = async (req, res) => {
  const { id } = req.params; // Lấy id của tác giả từ URL client gửi lên
  const { name, isActive } = req.body; // Nhận giá trị mới muốn cập nhật cho name và trạng thái hoạt động
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      id,// Tìm đúng document theo _id cần sửa
      { name, isActive },
      { new: true, runValidators: true } // Đảm bảo kiểm tra ràng buộc đầy đủ
    );
    if (!updatedAuthor) return res.status(404).json({ message: 'Không tìm thấy tác giả.' }); // Nếu không tìm thấy thì trả lỗi 404 về client
    res.json(updatedAuthor);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Lỗi cập nhật tác giả.' }); // Bắt mọi lỗi khi cập nhật, trả 500 và message cụ thể (nếu có)
  }
};

// Xóa tác giả
exports.deleteAuthor = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Author.findByIdAndDelete(id);  // Tìm và xóa tác giả có id đúng trong database. Nếu xóa được sẽ trả về document đã bị xóa, nếu không thì trả về null
    if (!result) return res.status(404).json({ message: 'Không tìm thấy tác giả.' });
    res.json({ message: 'Đã xóa tác giả thành công.' });  // Nếu xóa thành công thì phản hồi xác nhận về cho frontend
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa tác giả.' });
  }
};
