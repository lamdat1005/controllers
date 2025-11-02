import Book from "../model/Book";
// Lấy danh sách tất cả sách
// Khởi tạo mảng books bằng dữ liệu import
// Dùng 'let' để có thể thêm/xóa sau này
// Dùng toán tử spread (...) để tạo một bản sao, tránh sửa đổi file gốc
let books = [Book];

// Tính toán ID tiếp theo dựa trên dữ liệu ban đầu
// Tìm ID lớn nhất trong mảng và cộng thêm 1
let nextBookId = books.length > 0 
    ? Math.max(...books.map(b => b.id)) + 1 
    : 1;

// --- KẾT THÚC THAY ĐỔI ---

// Lấy toàn bộ danh sách sách (từ mảng RAM)
export function getAllBooks(req, res) {
  try {
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách sách." });
  }
}

// Tạo mới một sách (lưu vào mảng RAM)
export function createBook(req, res) {
  const {
    title,
    description,
    coverImage,
    page,
    price,
    category,
    author,
    publisher,
  } = req.body;
  
  try {
    const newBook = {
      id: nextBookId++, // Gán ID rồi tăng biến đếm
      title,
      description,
      coverImage,
      page,
      price,
      category,
      author,
      publisher,
    };
    
    books.push(newBook);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo mới sách." });
  }
}

// Xóa một sách theo id (khỏi mảng RAM)
export function deleteBook(req, res) {
  const { id } = req.params; 
  
  try {
    const index = books.findIndex(book => book.id == id);

    if (index === -1) {
      return res.status(404).json({ message: "Không tìm thấy sách." });
    }
    
    books.splice(index, 1);
    res.json({ message: "Đã xóa sách thành công." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa sách." });
  }
}