const messages = {
  "error": {
    "evaluation": {
      "validation": "Lỗi kiểm tra đánh giá: {details}",
      "model_not_found": "Lỗi model đánh giá: Model \"{context}\" không tồn tại hoặc chưa được bật",
      "template_not_found": "Lỗi mẫu đánh giá: Mẫu \"{context}\" không tồn tại",
      "parse": "Lỗi phân tích đánh giá: {details}",
      "execution": "Lỗi thực thi đánh giá: {details}"
    },
    "llm": {
      "api": "Lỗi API: {details}",
      "config": "Lỗi cấu hình: {details}",
      "validation": "Lỗi kiểm tra: {details}",
      "initialization": "Lỗi khởi tạo: {details}",
      "api_key_required": "Tối ưu thất bại: API key không được để trống",
      "model_not_found": "Tối ưu thất bại: Không tìm thấy model",
      "template_invalid": "Tối ưu thất bại: Định dạng prompt không hợp lệ",
      "empty_input": "Tối ưu thất bại: Prompt không được để trống",
      "optimization_failed": "Tối ưu thất bại",
      "iteration_failed": "Lặp lại thất bại",
      "test_failed": "Kiểm thử thất bại",
      "model_key_required": "Tối ưu thất bại: Khóa model không được để trống",
      "input_too_long": "Tối ưu thất bại: Nội dung nhập quá dài"
    },
    "history": {
      "not_found": "Không tìm thấy bản ghi lịch sử có ID \"{context}\"",
      "chain": "Lỗi chuỗi lịch sử: {details}",
      "record_not_found": "Không tìm thấy bản ghi: {details}",
      "storage": "Lỗi lưu trữ lịch sử: {details}",
      "validation": "Lỗi kiểm tra bản ghi: {details}"
    },
    "compare": {
      "validation": "Lỗi kiểm tra đầu vào: {details}",
      "calculation": "Lỗi tính toán so sánh: {details}"
    },
    "storage": {
      "read": "Lỗi đọc lưu trữ: {details}",
      "write": "Lỗi ghi lưu trữ: {details}",
      "delete": "Lỗi xóa lưu trữ: {details}",
      "clear": "Lỗi xóa sạch lưu trữ: {details}",
      "config": "Lỗi cấu hình lưu trữ: {details}"
    },
    "model": {
      "validation": "Lỗi kiểm tra model: {details}",
      "config": "Lỗi cấu hình model: {details}"
    },
    "template": {
      "load": "Lỗi tải mẫu: {details}",
      "not_found": "Không tìm thấy mẫu: {context}",
      "validation": "Lỗi kiểm tra mẫu: {details}",
      "cache": "Lỗi bộ nhớ đệm mẫu: {details}",
      "storage": "Lỗi lưu trữ mẫu: {details}"
    },
    "prompt": {
      "optimization": "Lỗi tối ưu: {details}",
      "iteration": "Lỗi lặp lại: {details}",
      "test": "Lỗi kiểm thử: {details}",
      "service_dependency": "Lỗi phụ thuộc dịch vụ: {details}"
    },
    "favorite": {
      "not_found": "Không tìm thấy mục yêu thích: {context}",
      "already_exists": "Mục yêu thích đã tồn tại",
      "category_not_found": "Không tìm thấy danh mục: {context}",
      "validation": "Lỗi kiểm tra: {details}",
      "storage": "Lỗi lưu trữ: {details}",
      "tag": "Lỗi thẻ: {details}",
      "tag_already_exists": "Thẻ đã tồn tại: {context}",
      "tag_not_found": "Không tìm thấy thẻ: {context}",
      "migration": "Lỗi di chuyển: {details}",
      "import_export": "Lỗi nhập/xuất: {details}"
    },
    "image": {
      "prompt_empty": "Prompt không được để trống",
      "config_id_empty": "ID cấu hình model ảnh không được để trống",
      "config_not_found": "Không tìm thấy cấu hình model ảnh: {configId}",
      "config_not_enabled": "Cấu hình model ảnh chưa được bật: {configName}",
      "config_already_exists": "Cấu hình model ảnh đã tồn tại: {configId}",
      "config_does_not_exist": "Cấu hình model ảnh không tồn tại: {configId}",
      "config_invalid": "Cấu hình model ảnh không hợp lệ: {details}",
      "api_key_required": "Cần API key cho {providerName}",
      "model_id_required": "Cần có Model ID",
      "config_provider_mismatch": "Nhà cung cấp cấu hình ảnh không khớp: config={configProviderId}, adapter={adapterProviderId}",
      "connection_config_missing_field": "Thiếu trường kết nối bắt buộc: {field}",
      "connection_config_invalid_field_type": "Trường kết nối {field} phải là {expectedType}, nhận được {actualType}",
      "provider_not_found": "Không tìm thấy nhà cung cấp ảnh: {providerId}",
      "dynamic_models_not_supported": "{providerName} không hỗ trợ lấy model động",
      "unsupported_test_type": "Kiểu kiểm thử không được hỗ trợ: {testType}",
      "invalid_response_format": "Định dạng phản hồi API không hợp lệ",
      "base64_decoding_not_supported": "Môi trường này không hỗ trợ giải mã Base64",
      "only_single_image_supported": "Chỉ hỗ trợ tạo một ảnh",
      "text2image_input_image_not_allowed": "Không cho phép ảnh nhập với text-to-image",
      "image2image_input_image_required": "Cần có ảnh nhập cho image-to-image",
      "input_image_b64_required": "Ảnh nhập phải là base64",
      "input_image_url_not_supported": "Không hỗ trợ URL ảnh nhập (chỉ base64)",
      "input_image_invalid_format": "Định dạng ảnh nhập không hợp lệ",
      "input_image_unsupported_mime": "Chỉ hỗ trợ PNG/JPEG (hiện tại: {mimeType})",
      "input_image_too_large": "Ảnh nhập quá lớn (tối đa {maxSizeMB}MB)",
      "input_image_normalization_failed": "Chuẩn bị ảnh thất bại: {details}",
      "input_image_too_many": "Quá nhiều ảnh nhập (tối đa {maxCount}, nhận được {actualCount})",
      "model_not_support_text2image": "Model không hỗ trợ text-to-image: {modelName}",
      "model_not_support_image2image": "Model không hỗ trợ image-to-image: {modelName}",
      "model_only_supports_image2image_need_input": "Model chỉ hỗ trợ image-to-image. Vui lòng cung cấp ảnh nhập: {modelName}",
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
      "validation": "Lỗi kiểm tra trích xuất biến: {details}",
      "model_not_found": "Không tìm thấy model trích xuất biến: {context}",
      "parse": "Lỗi phân tích trích xuất biến: {details}",
      "execution": "Lỗi thực thi trích xuất biến: {details}"
    },
    "variable_value_generation": {
      "validation": "Lỗi kiểm tra tạo giá trị biến: {details}",
      "model_not_found": "Không tìm thấy model tạo giá trị biến: {context}",
      "parse": "Lỗi phân tích tạo giá trị biến: {details}",
      "execution": "Lỗi thực thi tạo giá trị biến: {details}"
    },
    "import_export": {
      "export_failed": "Xuất thất bại: {details}",
      "import_failed": "Nhập thất bại: {details}",
      "validation": "Lỗi kiểm tra nhập/xuất: {details}"
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
