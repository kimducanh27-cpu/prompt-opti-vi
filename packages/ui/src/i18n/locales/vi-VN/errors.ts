const messages = {
  "error": {
    "evaluation": {
      "validation": "Lỗi xác thực đánh giá: {details}",
      "model_not_found": "Lỗi mô hình đánh giá: Mô hình \"{context}\" không tồn tại hoặc chưa bật",
      "template_not_found": "Lỗi mẫu đánh giá: Mẫu \"{context}\" không tồn tại",
      "parse": "Lỗi phân tích kết quả đánh giá: {details}",
      "execution": "Lỗi thực thi đánh giá: {details}"
    },
    "llm": {
      "api": "Lỗi API: {details}",
      "config": "Lỗi cấu hình: {details}",
      "validation": "Lỗi xác thực: {details}",
      "initialization": "Lỗi khởi tạo: {details}",
      "api_key_required": "Tối ưu thất bại: API Key không được để trống",
      "model_not_found": "Tối ưu thất bại: Không tìm thấy mô hình",
      "template_invalid": "Tối ưu thất bại: Định dạng mẫu prompt không hợp lệ",
      "empty_input": "Tối ưu thất bại: Prompt không được để trống",
      "optimization_failed": "Tối ưu hóa thất bại",
      "iteration_failed": "Tinh chỉnh lặp thất bại",
      "test_failed": "Kiểm thử thất bại",
      "model_key_required": "Tối ưu thất bại: Khóa mô hình (Model Key) không được để trống",
      "input_too_long": "Tối ưu thất bại: Nội dung đầu vào quá dài"
    },
    "history": {
      "not_found": "Không tìm thấy bản ghi lịch sử có ID \"{context}\"",
      "chain": "Lỗi chuỗi lịch sử: {details}",
      "record_not_found": "Không tìm thấy bản ghi: {details}",
      "storage": "Lỗi lưu trữ lịch sử: {details}",
      "validation": "Lỗi xác thực bản ghi: {details}"
    },
    "compare": {
      "validation": "Lỗi xác thực đầu vào: {details}",
      "calculation": "Lỗi tính toán so sánh: {details}"
    },
    "storage": {
      "read": "Lỗi đọc bộ nhớ: {details}",
      "write": "Lỗi ghi bộ nhớ: {details}",
      "delete": "Lỗi xóa dữ liệu: {details}",
      "clear": "Lỗi dọn dẹp bộ nhớ: {details}",
      "config": "Lỗi cấu hình lưu trữ: {details}"
    },
    "model": {
      "validation": "Lỗi xác thực mô hình: {details}",
      "config": "Lỗi cấu hình mô hình: {details}"
    },
    "template": {
      "load": "Lỗi tải mẫu: {details}",
      "not_found": "Không tìm thấy mẫu: {context}",
      "validation": "Lỗi xác thực mẫu: {details}",
      "cache": "Lỗi bộ nhớ đệm mẫu: {details}",
      "storage": "Lỗi lưu trữ mẫu: {details}"
    },
    "prompt": {
      "optimization": "Lỗi tối ưu hóa: {details}",
      "iteration": "Lỗi tinh chỉnh lặp: {details}",
      "test": "Lỗi kiểm thử: {details}",
      "service_dependency": "Lỗi phụ thuộc dịch vụ: {details}"
    },
    "favorite": {
      "not_found": "Không tìm thấy mục yêu thích: {context}",
      "already_exists": "Mục yêu thích đã tồn tại",
      "category_not_found": "Không tìm thấy danh mục: {context}",
      "validation": "Lỗi xác thực: {details}",
      "storage": "Lỗi lưu trữ: {details}",
      "tag": "Lỗi thẻ (tag): {details}",
      "tag_already_exists": "Thẻ đã tồn tại: {context}",
      "tag_not_found": "Không tìm thấy thẻ: {context}",
      "migration": "Lỗi chuyển đổi dữ liệu: {details}",
      "import_export": "Lỗi nhập/xuất dữ liệu: {details}"
    },
    "image": {
      "prompt_empty": "Prompt không được để trống",
      "config_id_empty": "ID cấu hình mô hình ảnh không được để trống",
      "config_not_found": "Không tìm thấy cấu hình mô hình ảnh: {configId}",
      "config_not_enabled": "Cấu hình mô hình ảnh chưa được bật: {configName}",
      "config_already_exists": "Cấu hình mô hình ảnh đã tồn tại: {configId}",
      "config_does_not_exist": "Cấu hình mô hình ảnh không tồn tại: {configId}",
      "config_invalid": "Cấu hình mô hình ảnh không hợp lệ: {details}",
      "api_key_required": "Cần có API Key cho {providerName}",
      "model_id_required": "Cần có ID mô hình (Model ID)",
      "config_provider_mismatch": "Nhà cung cấp cấu hình ảnh không khớp: config={configProviderId}, adapter={adapterProviderId}",
      "connection_config_missing_field": "Thiếu trường kết nối bắt buộc: {field}",
      "connection_config_invalid_field_type": "Trường kết nối {field} phải có kiểu {expectedType}, nhưng nhận được {actualType}",
      "provider_not_found": "Không tìm thấy nhà cung cấp ảnh: {providerId}",
      "dynamic_models_not_supported": "{providerName} không hỗ trợ tải danh sách mô hình động",
      "unsupported_test_type": "Loại kiểm thử không được hỗ trợ: {testType}",
      "invalid_response_format": "Định dạng phản hồi API không hợp lệ",
      "base64_decoding_not_supported": "Giải mã Base64 không được hỗ trợ trong môi trường này",
      "only_single_image_supported": "Chỉ hỗ trợ tạo một ảnh mỗi lần",
      "text2image_input_image_not_allowed": "Chế độ Văn bản sang Ảnh không cho phép truyền ảnh đầu vào",
      "image2image_input_image_required": "Chế độ Ảnh sang Ảnh bắt buộc phải có ảnh đầu vào",
      "input_image_b64_required": "Ảnh đầu vào phải ở định dạng Base64",
      "input_image_url_not_supported": "Không hỗ trợ URL ảnh đầu vào (chỉ hỗ trợ Base64)",
      "input_image_invalid_format": "Định dạng ảnh đầu vào không hợp lệ",
      "input_image_unsupported_mime": "Chỉ hỗ trợ ảnh PNG/JPEG (hiện tại: {mimeType})",
      "input_image_too_large": "Ảnh đầu vào quá lớn (tối đa {maxSizeMB}MB)",
      "input_image_normalization_failed": "Chuẩn bị ảnh thất bại: {details}",
      "input_image_too_many": "Quá nhiều ảnh đầu vào (tối đa {maxCount}, hiện có {actualCount})",
      "model_not_support_text2image": "Mô hình không hỗ trợ Văn bản sang Ảnh: {modelName}",
      "model_not_support_image2image": "Mô hình không hỗ trợ Ảnh sang Ảnh: {modelName}",
      "model_only_supports_image2image_need_input": "Mô hình chỉ hỗ trợ Ảnh sang Ảnh. Vui lòng tải lên ảnh đầu vào: {modelName}",
      "generation_failed": "Tạo ảnh thất bại: {details}"
    },
    "context": {
      "not_found": "Không tìm thấy ngữ cảnh: {context}",
      "minimum_violation": "Không thể xóa ngữ cảnh cuối cùng",
      "invalid_id": "ID ngữ cảnh không hợp lệ: {context}",
      "import_format": "Định dạng nhập ngữ cảnh không hợp lệ: {details}",
      "invalid_store": "Kho ngữ cảnh không hợp lệ: {details}",
      "storage": "Lỗi lưu trữ ngữ cảnh: {details}",
      "electron_api_unavailable": "Dịch vụ ngữ cảnh không khả dụng trong môi trường này"
    },
    "variable_extraction": {
      "validation": "Lỗi xác thực trích xuất biến: {details}",
      "model_not_found": "Không tìm thấy mô hình trích xuất biến: {context}",
      "parse": "Lỗi phân tích trích xuất biến: {details}",
      "execution": "Lỗi thực thi trích xuất biến: {details}"
    },
    "variable_value_generation": {
      "validation": "Lỗi xác thực sinh giá trị biến: {details}",
      "model_not_found": "Không tìm thấy mô hình sinh giá trị biến: {context}",
      "parse": "Lỗi phân tích sinh giá trị biến: {details}",
      "execution": "Lỗi thực thi sinh giá trị biến: {details}"
    },
    "import_export": {
      "export_failed": "Xuất dữ liệu thất bại: {details}",
      "import_failed": "Nhập dữ liệu thất bại: {details}",
      "validation": "Lỗi xác thực nhập/xuất dữ liệu: {details}"
    },
    "data": {
      "invalid_json": "JSON không hợp lệ: {details}",
      "invalid_format": "Định dạng dữ liệu không hợp lệ: {details}",
      "import_partial_failed": "Nhập hoàn tất với {count} lỗi: {details}",
      "export_failed": "Xuất dữ liệu thất bại: {details}",
      "electron_api_unavailable": "Dịch vụ dữ liệu không khả dụng trong môi trường này"
    },
    "core": {
      "ipc_serialization_failed": "Tuần tự hóa IPC thất bại: {details}"
    }
  }
} as const;

export default messages;
