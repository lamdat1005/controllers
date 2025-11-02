// Khai báo mảng inventory để lưu dữ liệu tồn kho tạm thời trên RAM
const inventory = [];//tạo một mảng (array) trên RAM để lưu thông tin các sản phẩm đang có trong kho

// Lấy danh sách toàn bộ hàng tồn kho
export function getAllInventory(req, res) {
  res.json(inventory); // Trả về toàn bộ mảng inventory cho client
}

// Thêm mới một sản phẩm vào tồn kho
export function addInventoryItem(req, res) {
  const { productId, productName, quantity } = req.body; // Nhận dữ liệu từ request client gửi lên

  // Ràng buộc: tên sản phẩm là bắt buộc
  if (!productName || typeof productName !== 'string' || productName.trim() === '') {
    return res.status(400).json({ message: 'Tên sản phẩm là bắt buộc.' });
  }

  // Ràng buộc: không cho trùng mã sản phẩm trong tồn kho
  const found = inventory.find(item => item.productId === productId);
  if (found) {
    return res.status(400).json({ message: 'Mã sản phẩm đã tồn tại.' });
  }

  // Kiểm tra thêm trường quantity(số liệu hiện hữu trong kho) và productId(mã sách,hàng hóa) như ban đầu
  if (!productId || typeof quantity !== 'number') {
    return res.status(400).json({ message: 'Thiếu thông tin hoặc dữ liệu không hợp lệ.' });
  }

  // Nếu hợp lệ, tạo mới và thêm vào mảng inventory
  const newItem = { id: inventory.length + 1, productId, productName, quantity };
  inventory.push(newItem);
  res.status(201).json(newItem); // Trả về sản phẩm vừa thêm kèm mã 201 (Created)
}

// Cập nhật lại số lượng tồn kho cho sản phẩm đã nhập kho
export function updateInventoryItem(req, res) {
  const { id } = req.params; // Lấy id (số thứ tự trong mảng) từ URL
  const { quantity } = req.body; // Lấy quantity mới từ request

  const item = inventory.find(i => i.id == id); // Tìm sp trong mảng inventory theo id
  if (!item) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' }); // Không có thì trả lỗi 404
  }
  if (typeof quantity !== 'number') {
    return res.status(400).json({ message: 'Số lượng phải là số.' }); // Số lượng nhập vào bắt buộc phải là số
  }
  item.quantity = quantity; // Cập nhật số lượng mới
  res.json({ message: 'Đã cập nhật số lượng.', item });
}

// Xóa sản phẩm khỏi tồn kho
export function deleteInventoryItem(req, res) {
  const { id } = req.params; // Lấy id sản phẩm cần xóa từ URL
  const index = inventory.findIndex(i => i.id == id); // Tìm vị trí trong mảng inventory
  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm cần xóa.' });
  }
  inventory.splice(index, 1); // Xóa khỏi mảng bằng splice(xóa chính xác phần tử sản phẩm tại vị trí đó mà không làm ảnh hưởng phần tử còn lại trong mảng.)
  res.json({ message: 'Đã xóa sản phẩm khỏi tồn kho.' });
}
