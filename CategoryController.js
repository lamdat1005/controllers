import Category from "../models/Category.js"; 
// Lấy danh sách toàn bộ thể loại
export async function getAllCategories(_req, res) {
  try {
    const categories = await Category.find(); // Truy vấn tất cả document trong collection Category (lấy hết list thể loại)
    res.json(categories);                     // Trả về dữ liệu dưới dạng mảng JSON đến client (thường cho admin dashboard hoặc để select)
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách thể loại." }); //trả về code 500 và message cho client
  }
}
// Tạo mới một thể loại
export async function createCategory(req, res) {
  const { name } = req.body;                   // Lấy trường name từ dữ liệu client gửi lên
  try {
    const newCategory = new Category({ name }); // Tạo instance Category với name được truyền vào
    await newCategory.save();                   // Lưu category vào MongoDB, trả về giá trị category vừa được tạo nếu thành công
    res.status(201).json(newCategory);          // Phản hồi về client: category mới và code 201 (Created)
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo mới thể loại." }); // trả về lỗi hệ thống
  }
}
// Xóa một thể loại theo id
export async function deleteCategory(req, res) {
  const { id } = req.params;                        // Lấy id của category từ URL client gửi lên
  try {
    const result = await Category.findByIdAndDelete(id); // Tìm và xóa category theo id. Trả về document vừa xóa hoặc null nếu không có.
    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy thể loại." }); // trả về code 404 và thông báo lỗi
    }
    res.json({ message: "Đã xóa thể loại thành công." }); // trả về thông báo xác nhận cho client
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa thể loại." }); // trả về code 500 và message tới client
  }
}
