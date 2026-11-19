const messages = {
  "imageMode": {
    "text2image": "Văn bản sang Ảnh",
    "image2image": "Ảnh sang Ảnh",
    "multiimage": "Đa hình ảnh",
    "text2imageDescription": "Tạo hình ảnh từ mô tả văn bản",
    "image2imageDescription": "Biến đổi dựa trên hình ảnh có sẵn",
    "multiimageDescription": "Tạo ảnh từ nhiều ảnh đầu vào kết hợp với prompt",
    "uploadRequired": "Chế độ Ảnh sang Ảnh yêu cầu tải lên ảnh tham chiếu trước"
  },
  "imageWorkspace": {
    "usage": {
      "tokens": "Lượng token sử dụng",
      "promptTokens": "Token prompt",
      "imageTokens": "Token hình ảnh",
      "totalTokens": "Tổng token",
      "input": "Đầu vào",
      "output": "Đầu ra",
      "image": "Ảnh",
      "aspect": "Tỷ lệ",
      "tier": "Mức phân giải",
      "thinkingTokens": "Token suy luận",
      "inference": "Suy luận"
    },
    "input": {
      "originalPrompt": "Prompt gốc",
      "originalPromptPlaceholder": "Nhập prompt tạo ảnh cần tối ưu",
      "multiImagePromptPlaceholder": "Dùng Ảnh 1 / Ảnh 2 / Ảnh 3 để mô tả mối quan hệ giữa các ảnh và mục tiêu tạo ảnh",
      "image": "Hình ảnh",
      "imageAlt": "Ảnh {index}",
      "imageLabel": "Ảnh {index}",
      "removeImageAriaLabel": "Xóa ảnh {index}",
      "reorderImageAriaLabel": "Kéo để đổi thứ tự ảnh {index}",
      "multiImageHint": "Kéo các thẻ để sắp xếp thứ tự ngữ nghĩa của Ảnh 1 / Ảnh 2 / Ảnh 3",
      "multiImageMinHint": "Thêm ít nhất một ảnh nữa để bắt đầu tạo đa hình ảnh",
      "multiImageReadyHint": "Tải lên ít nhất hai ảnh trước khi bắt đầu tạo đa hình ảnh",
      "selectImage": "Chọn ảnh",
      "optimizeTemplate": "Mẫu tối ưu",
      "templatePlaceholder": "Vui lòng chọn mẫu",
      "textModel": "Mô hình văn bản",
      "modelPlaceholder": "Chọn mô hình",
      "optimizing": "Đang tối ưu...",
      "optimizePrompt": "Tối ưu Prompt",
      "extractFromImage": "Ảnh tham chiếu",
      "extracting": "Đang trích xuất",
      "extractCompleted": "Hoàn tất trích xuất từ ảnh",
      "extractCompletedWithVariables": "Đã trích xuất ảnh và khởi tạo {count} biến cục bộ",
      "extractFailed": "Trích xuất từ ảnh thất bại"
    },
    "referenceImage": {
      "replicateAction": "Tái tạo prompt",
      "replicateActionDescription": "Bỏ qua prompt hiện tại và suy luận ra một prompt có thể tái sử dụng từ ảnh tham chiếu",
      "styleLearnAction": "Học phong cách",
      "styleLearnActionDescription": "Giữ nguyên chủ thể hiện tại và học phong cách, bố cục cùng bảng màu từ ảnh tham chiếu",
      "styleLearnDisabledHint": "Hãy nhập nội dung bạn muốn tạo trước",
      "processingStatus": "Đang xử lý",
      "readyStatus": "Sẵn sàng",
      "errorStatus": "Thất bại",
      "resultTitle": "Kết quả phân tích ảnh tham chiếu",
      "thumbnailAlt": "Ảnh thu nhỏ tham chiếu",
      "generatedPrompt": "Prompt được tạo",
      "variablePreview": "Các biến trích xuất được",
      "noVariables": "Chưa có biến nào được trích xuất",
      "applyToPrompt": "Áp dụng vào Prompt hiện tại",
      "applySuccess": "Đã chèn vào prompt hiện tại"
    },
    "generation": {
      "imageModel": "Mô hình ảnh",
      "imageModelPlaceholder": "Vui lòng chọn mô hình ảnh",
      "compareMode": "Chế độ so sánh",
      "generating": "Đang tạo ảnh...",
      "generateImage": "Tạo ảnh",
      "processing": "Đang xử lý",
      "validationFailed": "Cấu hình/mô hình đã chọn không hỗ trợ thao tác này",
      "generateFailed": "Tạo ảnh thất bại",
      "missingRequiredFields": "Vui lòng chọn mô hình ảnh và nhập prompt hợp lệ",
      "missingVariables": "Biến còn thiếu hoặc đang trống: {vars}",
      "forbiddenTemplateSyntax": "Không hỗ trợ cú pháp Mustache không thoát (như ba dấu ngoặc nhọn {{{ }}} hoặc thẻ &). Vui lòng dùng cú pháp biến thông thường.",
      "inputImageRequired": "Vui lòng tải lên ảnh đầu vào (bắt buộc cho chế độ Ảnh sang Ảnh)",
      "multiImageUnsupported": "Mô hình này không hỗ trợ đầu vào đa hình ảnh. Vui lòng chuyển sang mô hình hỗ trợ đa hình ảnh.",
      "generationCompleted": "Hoàn tất tạo ảnh"
    },
    "results": {
      "originalPromptResult": "Prompt gốc",
      "optimizedPromptResult": "Prompt đã tối ưu",
      "testResult": "Kết quả kiểm thử",
      "download": "Tải xuống",
      "downloadFailed": "Tải xuống thất bại",
      "copyBase64": "Sao chép Base64",
      "copyText": "Sao chép văn bản",
      "copySuccess": "Đã sao chép thành công",
      "copyError": "Sao chép thất bại",
      "textOutput": "Kết quả văn bản",
      "noOriginalResult": "Chưa có kết quả gốc",
      "noOptimizedResult": "Chưa có kết quả tối ưu",
      "noGenerationResult": "Chưa có kết quả tạo ảnh"
    },
    "upload": {
      "title": "Tải lên ảnh tham chiếu",
      "dragText": "Nhấn hoặc kéo thả để tải ảnh lên",
      "fileRequirements": "Hỗ trợ PNG/JPEG tối đa 50MB; ảnh lớn sẽ được tự động chuẩn hóa",
      "uploadFailed": "Tải lên thất bại",
      "uploadSuccess": "Tải lên thành công",
      "preparedSuccess": "Đã chuẩn hóa ảnh để tương thích mô hình: {before} → {after}",
      "preparedBatchSuccess": "Đã chuẩn hóa {count} ảnh để tương thích mô hình",
      "processingFailed": "Chuẩn bị ảnh thất bại. Vui lòng thử ảnh nhỏ hơn.",
      "confirmTitle": "Xác nhận xử lý hình ảnh",
      "confirmDescription": "Để đáp ứng giới hạn đầu vào của mô hình, {count} ảnh sẽ được thu phóng hoặc mã hóa lại. Dung lượng tệp có thể thay đổi nhẹ.",
      "confirmItem": "{name}: {beforeSize}, {beforeDimensions} → {afterSize}, {afterDimensions}",
      "confirmAction": "Xử lý và tiếp tục",
      "fileTypeNotSupported": "Chỉ hỗ trợ định dạng PNG/JPEG",
      "fileTooLarge": "Ảnh được chọn không được vượt quá 50MB",
      "readFailed": "Đọc tệp thất bại, vui lòng thử lại"
    }
  },
  "image": {
    "capability": {
      "text2image": "Văn bản sang Ảnh",
      "image2image": "Ảnh sang Ảnh",
      "multiImage": "Đa hình ảnh",
      "highResolution": "Độ phân giải cao"
    },
    "step": {
      "basic": "Thông tin cơ bản",
      "provider": "Chọn nhà cung cấp",
      "connection": "Cấu hình kết nối",
      "model": "Chọn mô hình",
      "parameters": "Thiết lập tham số"
    },
    "config": {
      "basic": {
        "title": "Cấu hình cơ bản"
      },
      "name": {
        "label": "Tên cấu hình",
        "placeholder": "Vui lòng nhập tên cấu hình"
      },
      "displayName": {
        "label": "Tên hiển thị",
        "placeholder": "Vui lòng nhập tên hiển thị"
      },
      "enabled": {
        "label": "Trạng thái bật"
      },
      "enabledStatus": {
        "label": "Trạng thái bật"
      },
      "updateSuccess": "Đã cập nhật cấu hình",
      "createSuccess": "Đã tạo cấu hình",
      "saveFailed": "Lưu cấu hình thất bại",
      "loadFailed": "Tải cấu hình thất bại"
    },
    "provider": {
      "title": "Chọn nhà cung cấp",
      "section": "Cấu hình nhà cung cấp",
      "label": "Nhà cung cấp ảnh",
      "placeholder": "Vui lòng chọn nhà cung cấp",
      "loadFailed": "Tải danh sách nhà cung cấp thất bại"
    },
    "connection": {
      "title": "Cấu hình kết nối",
      "test": "Kiểm tra kết nối",
      "testing": "Đang kiểm tra kết nối...",
      "testSuccess": "Kiểm tra chức năng thành công",
      "testFailed": "Kiểm tra kết nối thất bại",
      "testError": "Lỗi kiểm tra kết nối",
      "functionTestTextToImage": "Kiểm thử Văn bản sang Ảnh",
      "functionTestImageToImage": "Kiểm thử Ảnh sang Ảnh",
      "testImagePreview": "Xem trước ảnh kiểm thử",
      "downloadSuccess": "Tải ảnh xuống thành công",
      "downloadFailed": "Tải ảnh xuống thất bại",
      "apiKey": {
        "label": "API Key",
        "description": "Khóa xác thực API",
        "placeholder": "Nhập API Key"
      },
      "baseURL": {
        "label": "API Base URL",
        "description": "Địa chỉ URL gốc của điểm cuối dịch vụ",
        "placeholder": "https://api.example.com/v1"
      },
      "accountId": {
        "label": "Account ID",
        "description": "ID tài khoản Cloudflare",
        "placeholder": "Nhập Cloudflare Account ID"
      },
      "organization": {
        "label": "Organization (tùy chọn)",
        "description": "ID tổ chức OpenAI nếu có",
        "placeholder": "org_xxx"
      },
      "validation": {
        "missing": "Thiếu các trường bắt buộc: {fields}",
        "invalidType": "{field} phải có kiểu {expected}, nhưng nhận được {actual}"
      }
    },
    "model": {
      "section": "Cấu hình mô hình",
      "label": "Mô hình",
      "placeholder": "Vui lòng chọn mô hình",
      "loading": "Đang tải danh sách mô hình...",
      "refreshTooltip": "Làm mới danh sách mô hình",
      "refreshDisabledTooltip": {
        "dynamicNotSupported": "Nhà cung cấp hiện tại không hỗ trợ tải danh sách mô hình động",
        "connectionRequired": "Cần cấu hình kết nối hợp lệ để làm mới danh sách mô hình"
      },
      "refreshSuccess": "Đã làm mới danh sách mô hình",
      "refreshError": "Làm mới danh sách mô hình thất bại",
      "selectRequired": "Vui lòng chọn một mô hình để kiểm thử",
      "count": "{count} mô hình",
      "capabilities": "Khả năng hỗ trợ",
      "empty": "Chưa có cấu hình mô hình ảnh nào",
      "addFirst": "Thêm mô hình ảnh đầu tiên",
      "staticLoaded": "Đã tải danh sách mô hình tĩnh",
      "noStaticModels": "Không có mô hình tĩnh",
      "staticLoadFailed": "Không thể tải danh sách mô hình tĩnh",
      "dynamicLoaded": "Đã tải danh sách mô hình động",
      "dynamicFailed": "Không thể tải mô hình động, đã chuyển về danh sách tĩnh",
      "connectionRequired": "Vui lòng điền và xác thực kết nối trước",
      "refreshFailed": "Làm mới mô hình thất bại",
      "quickSwitch": {
        "title": "Chuyển nhanh mô hình ảnh hiện tại",
        "placeholder": "Chọn mô hình ảnh",
        "modelTagTitle": "Nhấn để đổi mô hình cho cấu hình ảnh này",
        "fetchFailed": "Không thể tải danh sách mô hình ảnh trực tuyến: {error}. Bạn vẫn có thể chọn mô hình mặc định cục bộ.",
        "updateSuccess": "Đã chuyển sang {model}",
        "updateFailed": "Chuyển mô hình ảnh thất bại: {error}"
      }
    },
    "parameters": {
      "noParameters": "Không có tham số cấu hình cho mô hình này",
      "advancedConfig": "Cấu hình tham số nâng cao",
      "advancedConfigDescription": "Tùy chọn, dùng để ghi đè các tham số mặc định của mô hình"
    },
    "params": {
      "outputFormat": {
        "label": "Định dạng đầu ra",
        "description": "Mặc định tạo ảnh PNG, hoặc chọn ảnh động GIF",
        "png": "Ảnh PNG",
        "gif": "Ảnh động GIF"
      },
      "frameCount": {
        "label": "Số khung hình GIF",
        "description": "Tùy chọn, từ 2–16 khung hình; dùng mặc định của mô hình khi để trống (thường là 9 khung hình)"
      },
      "frameDuration": {
        "label": "Độ trễ khung hình GIF (ms)",
        "description": "Tùy chọn; giá trị nhỏ hơn sẽ chạy nhanh hơn. Dùng mặc định của mô hình khi để trống (thường 200 ms/khung)"
      },
      "size": {
        "label": "Kích thước ảnh",
        "description": "Độ phân giải/kích thước ảnh tạo ra, VD: 1024x1024"
      },
      "aspect_ratio": {
        "label": "Tỷ lệ khung hình",
        "description": "Tỷ lệ khung hình của ảnh được tạo"
      },
      "resolution": {
        "label": "Độ phân giải",
        "description": "Mức độ phân giải của ảnh được tạo"
      },
      "quality": {
        "label": "Chất lượng ảnh",
        "description": "Mức chất lượng ảnh: auto (tự động), high (cao), medium (trung bình), low (thấp)"
      },
      "background": {
        "label": "Độ trong suốt nền",
        "description": "Thiết lập nền ảnh: auto (tự động), transparent (trong suốt), opaque (đặc)"
      },
      "negativePrompt": {
        "label": "Prompt phủ định (Negative Prompt)",
        "description": "Chỉ định các yếu tố bạn không muốn xuất hiện trong ảnh"
      },
      "promptExtend": {
        "label": "Mở rộng Prompt tự động",
        "description": "Khi bật, mô hình sẽ tự động mở rộng và tối ưu hóa prompt để cho kết quả tốt hơn"
      },
      "watermark": {
        "label": "Đóng dấu (Watermark)",
        "description": "Có thêm watermark vào ảnh được tạo hay không"
      },
      "seed": {
        "label": "Hạt giống ngẫu nhiên (Seed)",
        "description": "Mã seed để tái lập kết quả; cùng một seed sẽ tạo ra các ảnh tương tự nhau"
      },
      "count": {
        "label": "Số lượng ảnh tạo",
        "description": "Số lượng ảnh tạo ra trong một lần chạy"
      },
      "style": {
        "label": "Phong cách ảnh",
        "description": "Phong cách nghệ thuật cho hình ảnh được tạo"
      }
    }
  },
  "toolCall": {
    "title": "Lệnh gọi công cụ (Tool Calls)",
    "count": "{count} lệnh gọi",
    "arguments": "Tham số",
    "result": "Kết quả",
    "error": "Lỗi",
    "status": {
      "pending": "Đang chờ",
      "success": "Thành công",
      "error": "Thất bại"
    }
  },
  "updater": {
    "title": "Cập nhật ứng dụng",
    "checkForUpdates": "Kiểm tra cập nhật",
    "currentVersion": "Phiên bản hiện tại",
    "versionLoadFailed": "Không thể tải thông tin phiên bản",
    "downloadFailed": "Tải xuống thất bại",
    "dismiss": "Đóng",
    "noStableVersionAvailable": "Chưa có phiên bản ổn định nào",
    "noPrereleaseVersionAvailable": "Chưa có phiên bản thử nghiệm (prerelease) nào",
    "failedToGetStableInfo": "Không thể lấy thông tin cập nhật bản ổn định",
    "failedToGetPrereleaseInfo": "Không thể lấy thông tin cập nhật bản thử nghiệm",
    "alreadyLatestStable": "Bạn đang dùng phiên bản ổn định mới nhất ({version})",
    "alreadyLatestPrerelease": "Bạn đang dùng phiên bản thử nghiệm mới nhất ({version})",
    "stableDownloadFailed": "Tải bản ổn định thất bại: {error}",
    "prereleaseDownloadFailed": "Tải bản thử nghiệm thất bại: {error}",
    "unknownError": "Lỗi không xác định",
    "stable": "Ổn định",
    "prerelease": "Thử nghiệm",
    "downloadFailedGeneric": "Tải bản {type} thất bại: {error}",
    "warning": "Cảnh báo",
    "info": "Thông tin",
    "versionIgnored": "Đã bỏ qua phiên bản {version}",
    "checkFailed": "Kiểm tra thất bại",
    "ignored": "Đã bỏ qua",
    "unignore": "Bỏ chặn",
    "latestVersion": "Phiên bản mới nhất",
    "noPrereleaseAvailable": "Không có bản thử nghiệm",
    "latestIsStable": "Phiên bản mới nhất là bản ổn định",
    "latestStableVersion": "Bản ổn định mới nhất",
    "latestPrereleaseVersion": "Bản thử nghiệm mới nhất",
    "viewStable": "Xem bản ổn định",
    "viewPrerelease": "Xem bản thử nghiệm",
    "allowPrerelease": "Nhận bản cập nhật thử nghiệm (prerelease)",
    "noUpdatesAvailable": "Bạn đang sử dụng phiên bản mới nhất",
    "checkNow": "Kiểm tra ngay",
    "checking": "Đang kiểm tra cập nhật...",
    "checkingForUpdates": "Đang kiểm tra cập nhật...",
    "newVersionAvailable": "Có phiên bản mới",
    "viewDetails": "Xem chi tiết",
    "downloadUpdate": "Tải bản cập nhật",
    "download": "Tải xuống",
    "updateAvailable": "Có bản cập nhật",
    "hasUpdate": "Có bản cập nhật",
    "details": "Chi tiết",
    "ignore": "Bỏ qua",
    "ignoreVersion": "Bỏ qua phiên bản này",
    "downloading": "Đang tải bản cập nhật...",
    "downloadingShort": "Đang tải...",
    "downloadComplete": "Tải xuống hoàn tất",
    "clickInstallToRestart": "Nhấn nút bên dưới để cài đặt và khởi động lại ứng dụng",
    "installAndRestart": "Cài đặt và Khởi động lại",
    "updateError": "Cập nhật thất bại",
    "downloadError": "Tải xuống thất bại",
    "installError": "Cài đặt thất bại",
    "upToDate": "Đã cập nhật mới nhất",
    "devEnvironment": "Môi trường phát triển: Đã tắt kiểm tra cập nhật",
    "clickToCheck": "Nhấn để kiểm tra cập nhật",
    "viewOnGitHub": "Xem trên GitHub",
    "manualUpdateTitle": "macOS hiện yêu cầu cập nhật thủ công",
    "manualUpdateDescription": "Bản dựng macOS hiện tại chưa được ký bằng chứng chỉ Apple Developer ID nên không thể cài đặt tự động trong ứng dụng. Hãy mở trang phát hành, tải tệp DMG cho máy Mac này, thoát ứng dụng, kéo vào thư mục Applications và chọn Replace. Nếu macOS chặn lần mở đầu tiên, hãy cấp quyền trong System Settings → Privacy & Security.",
    "updatePolicyUnavailableTitle": "Hiện cần cập nhật thủ công",
    "updatePolicyUnavailableDescription": "Ứng dụng không thể xác nhận bản dựng này có hỗ trợ cài đặt trực tiếp hay không. Để tránh lỗi cập nhật, vui lòng mở trang phát hành và cài đặt gói thủ công.",
    "openReleasePage": "Mở trang phát hành GitHub",
    "openReleaseFailed": "Không thể mở trang phát hành. Vui lòng thử lại sau.",
    "releasePageUnavailable": "Địa chỉ trang phát hành không khả dụng. Hãy kiểm tra cập nhật và thử lại.",
    "noReleasesFound": "Không tìm thấy bản phát hành nào.",
    "noStableReleasesFound": "Không tìm thấy bản phát hành ổn định nào."
  }
} as const;

export default messages;
