// Khai báo mảng pricingList để lưu thông tin giá cả của các sản phẩm/dịch vụ ngay trên RAM (không dùng CSDL)
const pricingList = [];

// Lấy toàn bộ bảng giá đang lưu trên RAM
export function getAllPricing(req, res) {
  res.json(pricingList); // Trả về toàn bộ danh sách pricing cho client dưới dạng mảng JSON
}

// Thêm mới một bản giá cho sản phẩm hoặc dịch vụ
export function addPricing(req, res) {
  const { productId, productName, price, startDate, endDate } = req.body; // Lấy thông tin cần thiết từ body request

  // Kiểm tra dữ liệu đầu vào: productId, productName bắt buộc phải có, price phải là số
  if (!productId || !productName || typeof price !== 'number') {
    return res.status(400).json({ message: 'Thiếu thông tin hoặc dữ liệu không hợp lệ.' });
  }

  // Ràng buộc: mỗi sản phẩm chỉ có một bản giá (theo productId)
  const found = pricingList.find(item => item.productId === productId);
  if (found) {
    return res.status(400).json({ message: 'Sản phẩm này đã có trong bảng giá.' });
  }

  // Tạo object bản giá mới, có thêm trường id tự tăng để tiện quản lý
  const newPricing = {
    id: pricingList.length + 1,    // Sinh id tự động (số thứ tự trong mảng)
    productId,                   
    productName,                   
    price,                        
    startDate,                     // Ngày áp dụng giá này (có thể bỏ trống)
    endDate                        // Ngày hết hạn giá này (có thể bỏ trống)
  };
  pricingList.push(newPricing); // Thêm vào mảng
  res.status(201).json(newPricing); // Trả về bản giá vừa thêm kèm http 201
}

// Cập nhật giá một sản phẩm cụ thể
export function updatePricing(req, res) {
  const { id } = req.params; // Lấy id bản giá cần cập nhật từ URL
  const { price, startDate, endDate } = req.body; // Trường cần cập nhật gửi từ client

  // Tìm kiếm bản giá trong mảng bằng id
  const pricing = pricingList.find(p => p.id == id);
  if (!pricing) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong bảng giá.' });
  }

  // Chỉ cập nhật trường nào client truyền, không truyền sẽ giữ nguyên
  if (typeof price === 'number') pricing.price = price;
  if (startDate) pricing.startDate = startDate;
  if (endDate) pricing.endDate = endDate;

  res.json({ message: 'Đã cập nhật giá thành công.', pricing }); // Xác nhận đã cập nhật và trả lại bản ghi mới
}

// Xóa bản giá khỏi bảng giá
export function deletePricing(req, res) {
  const { id } = req.params; // Lấy id bản giá cần xóa từ URL
  const index = pricingList.findIndex(p => p.id == id); // Tìm vị trí bản giá trong mảng
  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy bản giá để xóa.' });
  }
  pricingList.splice(index, 1); // Xóa bản giá tại vị trí tìm được
  res.json({ message: 'Đã xóa bản giá thành công.' }); // Trả về xác nhận đã xóa
}
