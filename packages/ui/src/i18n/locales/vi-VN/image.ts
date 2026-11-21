const messages = {
  "imageMode": {
    "text2image": "Văn bản thành ảnh",
    "image2image": "Ảnh thành ảnh",
    "multiimage": "Nhiều ảnh",
    "text2imageDescription": "Tạo ảnh từ mô tả bằng văn bản",
    "image2imageDescription": "Chỉnh sửa dựa trên ảnh có sẵn",
    "multiimageDescription": "Tạo ảnh từ nhiều ảnh nhập và một prompt",
    "uploadRequired": "Chế độ Ảnh thành ảnh cần tải ảnh tham chiếu lên trước"
  },
  "imageWorkspace": {
    "usage": {
      "tokens": "Mức dùng token",
      "promptTokens": "Token prompt",
      "imageTokens": "Token ảnh",
      "totalTokens": "Tất cả token",
      "input": "Đầu vào",
      "output": "Đầu ra",
      "image": "Ảnh",
      "aspect": "Tỉ lệ",
      "tier": "Bậc giá",
      "thinkingTokens": "Token suy luận",
      "inference": "Suy luận"
    },
    "input": {
      "originalPrompt": "Prompt gốc",
      "originalPromptPlaceholder": "Nhập prompt tạo ảnh cần tối ưu",
      "multiImagePromptPlaceholder": "Dùng Ảnh 1 / Ảnh 2 / Ảnh 3 để mô tả mối quan hệ giữa các ảnh và mục tiêu tạo ảnh",
      "image": "Ảnh",
      "imageAlt": "Ảnh {index}",
      "imageLabel": "Ảnh {index}",
      "removeImageAriaLabel": "Xóa ảnh {index}",
      "reorderImageAriaLabel": "Kéo để sắp xếp lại ảnh {index}",
      "multiImageHint": "Kéo thẻ để điều chỉnh thứ tự ngữ nghĩa của Ảnh 1 / Ảnh 2 / Ảnh 3",
      "multiImageMinHint": "Thêm một ảnh nữa để bắt đầu tạo ảnh multi-image",
      "multiImageReadyHint": "Tải lên ít nhất hai ảnh trước khi bắt đầu tạo ảnh multi-image",
      "selectImage": "Chọn",
      "optimizeTemplate": "Mẫu tối ưu",
      "templatePlaceholder": "Vui lòng chọn mẫu",
      "textModel": "Model văn bản",
      "modelPlaceholder": "Chọn model",
      "optimizing": "Đang tối ưu...",
      "optimizePrompt": "Tối ưu Prompt",
      "extractFromImage": "Ảnh tham chiếu",
      "extracting": "Đang trích xuất",
      "extractCompleted": "Trích xuất ảnh hoàn tất",
      "extractCompletedWithVariables": "Trích xuất ảnh hoàn tất và đã khởi tạo {count} biến cục bộ",
      "extractFailed": "Trích xuất ảnh thất bại"
    },
    "referenceImage": {
      "replicateAction": "Tái tạo",
      "replicateActionDescription": "Bỏ qua prompt hiện tại và suy ra một prompt dùng lại được từ ảnh tham chiếu",
      "styleLearnAction": "Học phong cách",
      "styleLearnActionDescription": "Giữ nguyên chủ thể hiện tại và học phong cách, bố cục, ngôn ngữ màu sắc từ ảnh",
      "styleLearnDisabledHint": "Hãy nhập nội dung bạn muốn tạo trước",
      "processingStatus": "Đang xử lý",
      "readyStatus": "Sẵn sàng",
      "errorStatus": "Thất bại",
      "resultTitle": "Kết quả tham chiếu",
      "thumbnailAlt": "Ảnh thu nhỏ tham chiếu",
      "generatedPrompt": "Prompt đã tạo",
      "variablePreview": "Biến đã trích xuất",
      "noVariables": "Chưa trích xuất được biến nào",
      "applyToPrompt": "Áp dụng vào Prompt hiện tại",
      "applySuccess": "Đã chèn vào prompt hiện tại"
    },
    "generation": {
      "imageModel": "Model ảnh",
      "imageModelPlaceholder": "Vui lòng chọn model ảnh",
      "compareMode": "Chế độ so sánh",
      "generating": "Đang tạo...",
      "generateImage": "Tạo ảnh",
      "processing": "Đang xử lý",
      "validationFailed": "Cấu hình/model đã chọn không hỗ trợ thao tác này",
      "generateFailed": "Tạo ảnh thất bại",
      "missingRequiredFields": "Vui lòng chọn model ảnh và nhập prompt hợp lệ",
      "missingVariables": "Thiếu hoặc trống biến: {vars}",
      "forbiddenTemplateSyntax": "Không hỗ trợ cú pháp Mustache chưa escape (ví dụ dấu ngoặc nhọn ba hoặc thẻ &). Vui lòng dùng placeholder biến thông thường.",
      "inputImageRequired": "Vui lòng tải ảnh nhập lên (bắt buộc cho image-to-image)",
      "multiImageUnsupported": "Model này không hỗ trợ nhập multi-image. Vui lòng chuyển sang model ảnh hỗ trợ multi-image.",
      "generationCompleted": "Tạo ảnh hoàn tất"
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
      "textOutput": "Đầu ra văn bản",
      "noOriginalResult": "Không có kết quả gốc",
      "noOptimizedResult": "Không có kết quả đã tối ưu",
      "noGenerationResult": "Không có kết quả tạo ảnh"
    },
    "upload": {
      "title": "Tải ảnh tham chiếu lên",
      "dragText": "Nhấn hoặc kéo để tải ảnh lên",
      "fileRequirements": "Hỗ trợ PNG/JPEG tối đa 50MB; ảnh lớn được chuẩn bị tự động",
      "uploadFailed": "Tải lên thất bại",
      "uploadSuccess": "Tải lên thành công",
      "preparedSuccess": "Đã chuẩn bị ảnh cho tương thích model: {before} → {after}",
      "preparedBatchSuccess": "Đã chuẩn bị {count} ảnh cho tương thích model",
      "processingFailed": "Chuẩn bị ảnh thất bại. Vui lòng thử ảnh nhỏ hơn.",
      "confirmTitle": "Xác nhận xử lý ảnh",
      "confirmDescription": "Để đáp ứng giới hạn nhập của model, {count} ảnh sẽ được đổi kích thước hoặc mã hóa lại. Kích thước tệp có thể tăng nhẹ.",
      "confirmItem": "{name}: {beforeSize}, {beforeDimensions} → {afterSize}, {afterDimensions}",
      "confirmAction": "Xử lý và tiếp tục",
      "fileTypeNotSupported": "Chỉ hỗ trợ PNG/JPEG",
      "fileTooLarge": "Ảnh đã chọn không được vượt quá 50MB",
      "readFailed": "Đọc tệp thất bại, vui lòng thử lại"
    }
  },
  "image": {
    "capability": {
      "text2image": "Văn bản thành ảnh",
      "image2image": "Ảnh thành ảnh",
      "multiImage": "Nhiều ảnh",
      "highResolution": "Độ phân giải cao"
    },
    "step": {
      "basic": "Thông tin cơ bản",
      "provider": "Chọn nhà cung cấp",
      "connection": "Cấu hình kết nối",
      "model": "Chọn Model",
      "parameters": "Cài đặt tham số"
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
      "loadFailed": "Tải nhà cung cấp thất bại"
    },
    "connection": {
      "title": "Cấu hình kết nối",
      "test": "Kiểm tra kết nối",
      "testing": "Đang kiểm tra kết nối...",
      "testSuccess": "Kiểm tra chức năng thành công",
      "testFailed": "Kiểm tra kết nối thất bại",
      "testError": "Lỗi kiểm tra kết nối",
      "functionTestTextToImage": "Kiểm thử Văn bản thành ảnh",
      "functionTestImageToImage": "Kiểm thử Ảnh thành ảnh",
      "testImagePreview": "Xem trước ảnh kiểm thử",
      "downloadSuccess": "Đã tải ảnh xuống thành công",
      "downloadFailed": "Tải ảnh xuống thất bại",
      "apiKey": {
        "label": "API Key",
        "description": "Khóa xác thực",
        "placeholder": "Nhập API Key"
      },
      "baseURL": {
        "label": "API Base URL",
        "description": "Base URL của endpoint dịch vụ",
        "placeholder": "https://api.example.com/v1"
      },
      "accountId": {
        "label": "Account ID",
        "description": "Account ID Cloudflare",
        "placeholder": "Nhập Account ID Cloudflare"
      },
      "organization": {
        "label": "Organization (không bắt buộc)",
        "description": "ID organization OpenAI nếu có",
        "placeholder": "org_xxx"
      },
      "validation": {
        "missing": "Thiếu trường bắt buộc: {fields}",
        "invalidType": "{field} phải là {expected}, nhận được {actual}"
      }
    },
    "model": {
      "section": "Cấu hình Model",
      "label": "Model",
      "placeholder": "Vui lòng chọn model",
      "loading": "Đang tải model...",
      "refreshTooltip": "Làm mới danh sách model",
      "refreshDisabledTooltip": {
        "dynamicNotSupported": "Nhà cung cấp hiện tại không hỗ trợ tải model động",
        "connectionRequired": "Cần cấu hình kết nối hợp lệ để làm mới model"
      },
      "refreshSuccess": "Đã làm mới danh sách model",
      "refreshError": "Làm mới danh sách model thất bại",
      "selectRequired": "Vui lòng chọn một model để kiểm thử",
      "count": "{count} model",
      "capabilities": "Khả năng",
      "empty": "Không có cấu hình model ảnh nào",
      "addFirst": "Thêm Model ảnh đầu tiên",
      "staticLoaded": "Đã tải model tĩnh",
      "noStaticModels": "Không có model tĩnh",
      "staticLoadFailed": "Tải model tĩnh thất bại",
      "dynamicLoaded": "Đã tải model động",
      "dynamicFailed": "Tải model động thất bại, đã dùng danh sách tĩnh",
      "connectionRequired": "Vui lòng điền và xác thực kết nối trước",
      "refreshFailed": "Làm mới model thất bại",
      "quickSwitch": {
        "title": "Chuyển model ảnh hiện tại",
        "placeholder": "Chọn model ảnh",
        "modelTagTitle": "Nhấn để chuyển model cho cấu hình ảnh này",
        "fetchFailed": "Lấy model ảnh online thất bại: {error}. Bạn vẫn có thể chọn model mặc định cục bộ.",
        "updateSuccess": "Đã chuyển sang {model}",
        "updateFailed": "Chuyển model ảnh thất bại: {error}"
      }
    },
    "parameters": {
      "noParameters": "Model này không có tham số nào cấu hình được",
      "advancedConfig": "Cấu hình tham số nâng cao",
      "advancedConfigDescription": "Không bắt buộc, dùng để ghi đè tham số mặc định của model"
    },
    "params": {
      "outputFormat": {
        "label": "Định dạng đầu ra",
        "description": "Mặc định tạo ảnh PNG, hoặc chọn ảnh GIF động",
        "png": "Ảnh PNG",
        "gif": "GIF động"
      },
      "frameCount": {
        "label": "Số khung hình GIF",
        "description": "Không bắt buộc, 2–16 khung hình; khi không đặt sẽ dùng mặc định của model, thường là 9 khung hình"
      },
      "frameDuration": {
        "label": "Độ trễ khung hình GIF (ms)",
        "description": "Không bắt buộc; giá trị càng nhỏ phát càng nhanh. Khi không đặt sẽ dùng mặc định của model, thường là 200 ms mỗi khung hình"
      },
      "size": {
        "label": "Kích thước ảnh",
        "description": "Độ phân giải/kích thước ảnh được tạo, ví dụ 1024x1024"
      },
      "aspect_ratio": {
        "label": "Tỉ lệ khung hình",
        "description": "Tỉ lệ khung hình của ảnh được tạo"
      },
      "resolution": {
        "label": "Độ phân giải",
        "description": "Bậc độ phân giải của ảnh được tạo"
      },
      "quality": {
        "label": "Chất lượng ảnh",
        "description": "Mức chất lượng ảnh được tạo: auto (tự động), high (chất lượng cao), medium (trung bình), low (chất lượng thấp)"
      },
      "background": {
        "label": "Nền trong suốt",
        "description": "Đặt nền ảnh: auto (tự động), transparent (trong suốt), opaque (đục)"
      },
      "negativePrompt": {
        "label": "Prompt phủ định",
        "description": "Nêu nội dung bạn không muốn xuất hiện trong ảnh được tạo"
      },
      "promptExtend": {
        "label": "Mở rộng Prompt",
        "description": "Khi bật, model sẽ tự mở rộng và tối ưu prompt để cho kết quả tốt hơn"
      },
      "watermark": {
        "label": "Watermark",
        "description": "Có thêm watermark vào ảnh được tạo hay không"
      },
      "seed": {
        "label": "Seed ngẫu nhiên",
        "description": "Seed ngẫu nhiên cho kết quả tái tạo được, cùng seed tạo ảnh tương tự nhau"
      },
      "count": {
        "label": "Số lượng tạo",
        "description": "Số ảnh tạo cùng lúc"
      },
      "style": {
        "label": "Phong cách ảnh",
        "description": "Phong cách nghệ thuật của ảnh được tạo"
      }
    }
  },
  "toolCall": {
    "title": "Lệnh gọi Tool",
    "count": "{count} lệnh gọi",
    "arguments": "Đối số",
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
    "versionLoadFailed": "Tải phiên bản thất bại",
    "downloadFailed": "Tải xuống thất bại",
    "dismiss": "Bỏ qua",
    "noStableVersionAvailable": "Không có phiên bản ổn định nào",
    "noPrereleaseVersionAvailable": "Không có phiên bản prerelease nào",
    "failedToGetStableInfo": "Không lấy được thông tin cập nhật phiên bản ổn định",
    "failedToGetPrereleaseInfo": "Không lấy được thông tin cập nhật phiên bản prerelease",
    "alreadyLatestStable": "Bạn đang dùng phiên bản ổn định mới nhất ({version})",
    "alreadyLatestPrerelease": "Bạn đang dùng phiên bản prerelease mới nhất ({version})",
    "stableDownloadFailed": "Tải phiên bản ổn định thất bại: {error}",
    "prereleaseDownloadFailed": "Tải phiên bản prerelease thất bại: {error}",
    "unknownError": "Lỗi không xác định",
    "stable": "Ổn định",
    "prerelease": "Prerelease",
    "downloadFailedGeneric": "Tải {type} thất bại: {error}",
    "warning": "Cảnh báo",
    "info": "Thông tin",
    "versionIgnored": "Phiên bản {version} đã bị bỏ qua",
    "checkFailed": "Kiểm tra thất bại",
    "ignored": "Đã bỏ qua",
    "unignore": "Bỏ qua việc bỏ qua",
    "latestVersion": "Phiên bản mới nhất",
    "noPrereleaseAvailable": "Không có prerelease",
    "latestIsStable": "Phiên bản mới nhất là bản ổn định",
    "latestStableVersion": "Phiên bản ổn định mới nhất",
    "latestPrereleaseVersion": "Phiên bản prerelease mới nhất",
    "viewStable": "Xem bản ổn định",
    "viewPrerelease": "Xem bản prerelease",
    "allowPrerelease": "Nhận cập nhật prerelease",
    "noUpdatesAvailable": "Bạn đang dùng phiên bản mới nhất",
    "checkNow": "Kiểm tra cập nhật",
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
    "downloadingShort": "Đang tải xuống...",
    "downloadComplete": "Tải xuống hoàn tất",
    "clickInstallToRestart": "Nhấn nút bên dưới để cài đặt và khởi động lại ứng dụng",
    "installAndRestart": "Cài đặt và khởi động lại",
    "updateError": "Cập nhật thất bại",
    "downloadError": "Tải xuống thất bại",
    "installError": "Cài đặt thất bại",
    "upToDate": "Đã cập nhật",
    "devEnvironment": "Môi trường phát triển: đã tắt kiểm tra cập nhật",
    "clickToCheck": "Nhấn để kiểm tra cập nhật",
    "viewOnGitHub": "Xem trên GitHub",
    "manualUpdateTitle": "macOS hiện cần cập nhật thủ công",
    "manualUpdateDescription": "Bản build macOS hiện tại không được ký bằng Apple Developer ID nên không thể cài qua trình cập nhật trong ứng dụng. Hãy mở trang release, tải DMG cho máy Mac này, thoát ứng dụng, rồi kéo vào Applications và chọn Replace. Nếu macOS chặn lần mở đầu tiên, hãy cho phép trong System Settings → Privacy & Security.",
    "updatePolicyUnavailableTitle": "Hiện cần cập nhật thủ công",
    "updatePolicyUnavailableDescription": "Ứng dụng không xác nhận được build này có hỗ trợ cài đặt trong ứng dụng hay không. Để tránh cập nhật thất bại, hãy mở trang release và cài đặt gói thủ công.",
    "openReleasePage": "Mở GitHub Release",
    "openReleaseFailed": "Không mở được trang release. Vui lòng thử lại sau.",
    "releasePageUnavailable": "Không có địa chỉ trang release. Hãy kiểm tra cập nhật lại và thử lại.",
    "noReleasesFound": "Không tìm thấy release nào. Dự án này có thể chưa phát hành phiên bản nào.",
    "noStableReleasesFound": "Không tìm thấy release ổn định nào. Có thể chỉ có phiên bản prerelease."
  }
} as const;

export default messages;
