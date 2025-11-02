// Khai báo mảng lưu dữ liệu tạm thời trên RAM
const categories = [];

// Import từ file CSV (ví dụ dùng Multer nhận file upload client, filePath = req.file.path)
import fs from 'fs';
import csv from 'csv-parser';

// Import từ file CSV vào mảng RAM
export function importCategoriesFromCSV(req, res) {
  try {
    const filePath = req.file.path; // Đường dẫn file vừa upload
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data); // Thêm mỗi dòng là 1 category vào mảng tạm
      })
      .on('end', () => {
        categories.push(...results); // Lưu toàn bộ vào mảng RAM chính
        res.json({ message: 'Đã import thành công.', count: results.length });
      });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi nhập file.' });
  }
}

// Import trực tiếp từ API (JSON array)
export function importCategories(req, res) {
  // Dữ liệu gửi lên dưới dạng: { categories: [ {name: "A"}, {name: "B"} ] }
  const inputCategories = req.body.categories;
  if (!Array.isArray(inputCategories)) {
    return res.status(400).json({ message: 'Dữ liệu gửi lên phải là array.' });
  }
  categories.push(...inputCategories); // Lưu toàn bộ vào mảng RAM
  res.json({ message: 'Nhập dữ liệu thành công.', count: inputCategories.length });
}

// Lấy danh sách dữ liệu đã import tạm trong RAM
export function getImportedCategories(req, res) {
  res.json(categories); // Trả về toàn bộ mảng dữ liệu đang lưu trong RAM
}
