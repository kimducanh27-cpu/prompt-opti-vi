const messages = {
  "history": {
    "title": "Lịch sử",
    "iterationNote": "Ghi chú tinh chỉnh",
    "optimizedPrompt": "Prompt đã tối ưu",
    "searchPlaceholder": "Tìm kiếm lịch sử...",
    "confirmClear": "Bạn có chắc chắn muốn xóa toàn bộ bản ghi lịch sử không? Thao tác này không thể hoàn tác.",
    "confirmDeleteChain": "Bạn có chắc chắn muốn xóa chuỗi lịch sử này không? Thao tác này không thể hoàn tác.",
    "cleared": "Đã xóa toàn bộ lịch sử",
    "chainDeleted": "Đã xóa bản ghi lịch sử",
    "useThisVersion": "Dùng phiên bản này",
    "noHistory": "Chưa có bản ghi lịch sử nào"
  },
  "test": {
    "config": {
      "target": "Mục tiêu",
      "unassigned": "Chưa gán"
    },
    "title": "Kiểm thử",
    "areaTitle": "Vùng kiểm thử",
    "content": "Nội dung kiểm thử",
    "placeholder": "Nhập nội dung cần kiểm thử...",
    "modes": {
      "simple": "Chế độ đơn giản",
      "conversation": "Chế độ hội thoại"
    },
    "simpleMode": {
      "label": "Nội dung kiểm thử",
      "placeholder": "Nhập nội dung cần kiểm thử...",
      "help": ""
    },
    "image": {
      "attach": "Đính kèm ảnh kiểm thử",
      "replace": "Đổi ảnh kiểm thử",
      "remove": "Gỡ ảnh kiểm thử",
      "previewAlt": "Ảnh kiểm thử đính kèm",
      "unsupportedFormat": "Chỉ hỗ trợ định dạng ảnh PNG hoặc JPEG",
      "tooLarge": "Dung lượng ảnh không được vượt quá 5 MiB",
      "readFailed": "Không thể đọc ảnh đã chọn",
      "visionHint": "Mô hình được chọn phải hỗ trợ đầu vào hình ảnh (Vision)",
      "evaluationLabel": "Ảnh kiểm thử"
    },
    "model": "Mô hình kiểm thử",
    "startTest": "Kiểm thử",
    "startCompare": "So sánh",
    "testing": "Đang thử...",
    "toggleCompare": {
      "enable": "Bật so sánh",
      "disable": "Tắt so sánh"
    },
    "compareMode": "Chế độ so sánh",
    "layout": {
      "columns": "Số cột",
      "workspace": "Không gian làm việc",
      "previous": "Bản trước",
      "original": "Bản gốc",
      "previousHelp": {
        "dynamic": "",
        "currentBase": "Không gian làm việc có chỉnh sửa chưa lưu, nên mục này dùng phiên bản đã lưu gần nhất.",
        "earlierSaved": "Không gian làm việc đã được lưu, nên mục này dùng phiên bản ngay trước đó.",
        "originalFallback": "Chưa có phiên bản trước đó nên mục này dùng prompt gốc.",
        "sameAsWorkspace": "Hiện trùng khớp với không gian làm việc nên bước so sánh sẽ coi đây là lượt chạy kiểm tra lại (retest)."
      },
      "latest": "Mới nhất",
      "runAll": "Chạy tất cả",
      "runThisColumn": "Chạy cột này",
      "stale": "Cấu hình đã đổi"
    },
    "originalResult": "Kết quả A",
    "optimizedResult": "Kết quả B",
    "compareResultA": "Kết quả A",
    "compareResultB": "Kết quả B",
    "testResult": "Kết quả kiểm thử",
    "userPromptTest": "Kiểm thử User Prompt",
    "advanced": {
      "startTest": "Kiểm thử",
      "result": "Kết quả kiểm thử",
      "messageCount": "{count} tin nhắn",
      "missingVariables": "Thiếu {count} biến"
    },
    "error": {
      "failed": "Kiểm thử thất bại",
      "noModel": "Vui lòng chọn mô hình kiểm thử trước",
      "noTestContent": "Vui lòng nhập nội dung kiểm thử",
      "noWorkspacePrompt": "Không gian làm việc đang trống. Vui lòng nhập hoặc tạo một prompt trước",
      "noOriginalPrompt": "Vui lòng nhập prompt gốc trước",
      "noOptimizedPrompt": "Vui lòng tạo prompt tối ưu trước",
      "missingVariables": "Biến còn thiếu hoặc đang trống: {vars}",
      "forbiddenTemplateSyntax": "Không hỗ trợ cú pháp Mustache không thoát (như ba dấu ngoặc nhọn {{{ }}} hoặc thẻ &). Vui lòng dùng cú pháp biến thông thường.",
      "originalTestFailed": "Kiểm thử prompt gốc thất bại",
      "optimizedTestFailed": "Kiểm thử prompt tối ưu thất bại",
      "saveToGlobalFailed": "Lưu biến {name} vào biến toàn cục thất bại"
    },
    "enableMarkdown": "Bật hiển thị Markdown",
    "disableMarkdown": "Tắt hiển thị Markdown",
    "thinking": "Quá trình suy luận",
    "variables": {
      "detected": "Biến phát hiện được",
      "manageVariables": "Quản lý biến",
      "viewPreview": "Xem trước",
      "title": "Biến",
      "formTitle": "Biến tạm thời",
      "variablesCount": "biến",
      "clearAll": "Xóa tất cả",
      "inputPlaceholder": "Nhập giá trị biến",
      "overridesGlobal": "Ghi đè biến toàn cục",
      "noVariables": "Không phát hiện biến nào",
      "previewTitle": "Kết quả xem trước",
      "firstRound": "Vòng 1 (Biến tích hợp sẵn)",
      "secondRound": "Vòng 2 (Biến tùy chỉnh)",
      "builtinVars": "Biến tích hợp",
      "customVars": "Biến tùy chỉnh",
      "finalPreview": "Bản xem trước cuối cùng",
      "missingVars": "Biến còn thiếu",
      "saveToGlobal": "Lưu vào biến toàn cục",
      "savedToGlobal": "Đã lưu vào biến toàn cục",
      "emptyValueWarning": "Giá trị đang trống, không thể lưu",
      "tempCount": "{count} biến tạm thời",
      "addVariable": "Thêm biến",
      "nameRequired": "Tên biến là bắt buộc",
      "addSuccess": "Đã thêm biến thành công",
      "clearAllConfirm": "Xóa toàn bộ biến tạm thời ({count})?",
      "renameSuccess": "Đã đổi tên biến từ {oldName} thành {newName}",
      "renameNotSupported": "Chế độ xem này không hỗ trợ đổi tên biến",
      "deleteSuccess": "Đã xóa biến {name}",
      "clearSuccess": "Đã xóa toàn bộ biến tạm thời",
      "delete": "Xóa biến này",
      "fullscreenEdit": "Chỉnh sửa giá trị toàn màn hình"
    },
    "variableValueGeneration": {
      "generateButton": "Tự động điền giá trị biến",
      "generating": "Đang sinh giá trị thông minh...",
      "dialogTitle": "Xem trước giá trị biến được sinh tự động",
      "variableName": "Tên biến",
      "generatedValue": "Giá trị đề xuất",
      "valuePlaceholder": "Nhập giá trị biến",
      "reason": "Lý do đề xuất",
      "confidence": "Độ tin cậy",
      "selected": "Đã chọn",
      "batchApply": "Áp dụng hàng loạt ({count})",
      "noVariablesToGenerate": "Không có biến nào cần sinh giá trị",
      "generateFailed": "Sinh giá trị biến thất bại",
      "applySuccess": "Đã áp dụng thành công {count} giá trị biến",
      "noPrompt": "Vui lòng nhập hoặc tạo prompt tối ưu trước",
      "noMissingVariables": "Tất cả các biến đã có giá trị",
      "serviceNotReady": "Dịch vụ sinh giá trị biến chưa sẵn sàng",
      "noValues": "Không có giá trị biến nào được sinh ra"
    },
    "invalidVariables": "Dữ liệu biến không hợp lệ",
    "getVariablesFailed": "Không thể lấy danh sách biến"
  },
  "evaluation": {
    "button": "Đánh giá",
    "evaluate": "Đánh giá",
    "reEvaluate": "Đánh giá lại",
    "compareEvaluate": "So sánh",
    "loading": "Đang đánh giá...",
    "analyzing": "Đang phân tích...",
    "overallScore": "Điểm tổng",
    "dimensions": "Điểm theo tiêu chí",
    "issues": "Vấn đề phát hiện",
    "improvements": "Đề xuất cải thiện",
    "applyToIterate": "Tinh chỉnh",
    "rewriteFromEvaluation": "Viết lại",
    "rewriteSkipped": "Kết quả đánh giá khuyến nghị giữ nguyên prompt hiện tại nên bước viết lại được bỏ qua.",
    "applySuccess": "Đang áp dụng cải thiện...",
    "noResult": "Chưa có kết quả đánh giá. Nhấn nút Đánh giá để bắt đầu.",
    "viewDetails": "Xem chi tiết",
    "feedbackAnalyze": "Trọng tâm",
    "feedbackTitle": "Trọng tâm phân tích",
    "optional": "Tùy chọn",
    "feedbackPlaceholder": "Mô tả điểm bạn muốn tập trung kiểm tra. Hệ thống sẽ ưu tiên ghi chú của bạn.",
    "feedbackHint": "Esc để hủy · Ctrl/⌘+Enter để gửi",
    "feedbackSubmit": "Gửi & Phân tích",
    "focus": "Trọng tâm",
    "focusTitle": "Trọng tâm đánh giá",
    "focusPlaceholder": "Tùy chọn: Bạn muốn bước đánh giá tập trung vào khía cạnh nào? (VD: cấu trúc đầu ra, ràng buộc còn thiếu, độ dài ví dụ)",
    "focusHint": "Để trống nếu muốn chạy đánh giá thông minh mặc định.",
    "stale": {
      "default": "Kết quả này dựa trên nội dung cũ. Hãy chạy đánh giá lại nếu cần.",
      "promptOnly": "Prompt đã thay đổi. Hãy chạy phân tích lại nếu cần.",
      "promptIterate": "Prompt hoặc yêu cầu tinh chỉnh đã thay đổi. Hãy chạy phân tích lại nếu cần.",
      "result": "Thiết lập kiểm thử hoặc không gian làm việc đã thay đổi. Hãy chạy đánh giá lại nếu cần.",
      "compare": "Thiết lập kiểm thử hoặc không gian làm việc đã thay đổi. Hãy chạy so sánh lại nếu cần."
    },
    "title": {
      "default": "Kết quả đánh giá",
      "result": "Đánh giá kết quả",
      "compare": "Đánh giá so sánh",
      "promptOnly": "Phân tích chất lượng Prompt",
      "promptIterate": "Phân tích tinh chỉnh lặp"
    },
    "type": {
      "result": "Đánh giá kết quả này",
      "compare": "Đánh giá so sánh"
    },
    "compareConfig": {
      "button": "Cài đặt so sánh",
      "dialogTitle": "Cài đặt so sánh",
      "helper": "Xác nhận vai trò của từng cột kiểm thử. Nếu gợi ý tự động của hệ thống đã đúng, bạn có thể xác nhận ngay.",
      "helperSummary": "Hãy chọn Mục tiêu tối ưu trước. Phiên bản trước sẽ tự động bám theo không gian làm việc hiện tại.",
      "summaryTitle": "Kế hoạch so sánh lượt này",
      "currentTargetLabel": "Mục tiêu tối ưu hiện tại",
      "currentTargetMissing": "Chưa chọn",
      "summaryUnassigned": "Chưa gán",
      "summaryUnused": "Không dùng trong lượt này",
      "summaryNeedTarget": "Bắt buộc chọn Mục tiêu tối ưu",
      "summaryAssigned": "Sẵn sàng",
      "summaryRequired": "Bắt buộc",
      "summaryOptional": "Tùy chọn",
      "summaryStructured": "So sánh thông minh sẽ đánh giá xem mục tiêu tối ưu có tiến bộ hơn bản trước không, có thể học hỏi gì từ cột Mẫu chuẩn (Teacher) và kết luận có ổn định không.",
      "summaryGeneric": "Thiết lập này phù hợp với so sánh tiêu chuẩn hơn và sẽ không đi vào luồng chấm điểm từng cặp chuyên sâu.",
      "summaryPairs": "Các cặp so sánh chính: {pairs}",
      "summaryHints": {
        "target": "Chọn cột mà bạn thực sự muốn cải thiện trong vòng này.",
        "baseline": "Thường là phiên bản ngay trước không gian làm việc hiện tại, dùng để kiểm chứng mức độ tiến bộ thực tế.",
        "reference": "Thường là cột dùng mô hình mạnh hơn hoặc có kết quả ổn định hơn để làm Mẫu chuẩn (Teacher).",
        "replica": "Dùng để kiểm tra độ ổn định của kết luận. Nếu bản trước trùng nội dung với không gian làm việc, nó sẽ đóng vai trò chạy kiểm tra lại (Retest).",
        "referenceBaseline": "Chỉ dùng khi bạn muốn kiểm tra thêm liệu thay đổi prompt có mang lại hiệu quả tương tự trên mô hình Mẫu chuẩn hay không."
      },
      "assignedHints": {
        "baselineDynamic": "Được tự động xác định từ không gian làm việc hiện tại.",
        "replicaFromPrevious": "Trùng nội dung với không gian làm việc hiện tại nên được tính là lượt chạy kiểm tra lại (Retest)."
      },
      "requireTarget": "Phát hiện nhiều cột dùng chung không gian làm việc. Vui lòng chọn rõ cột nào là Mục tiêu tối ưu.",
      "targetRequired": "Vui lòng chọn một Mục tiêu tối ưu trước.",
      "targetNeededShort": "Chọn mục tiêu tối ưu",
      "reviewNeededShort": "Cần xác nhận lại",
      "autoDetected": "Gợi ý hệ thống",
      "manualAssigned": "Thủ công",
      "selectRolePlaceholder": "Chọn vai trò",
      "restoreSuggested": "Khôi phục gợi ý",
      "suggestedRoleTag": "Gợi ý hệ thống: {role}",
      "unassignedTag": "Chưa rõ vai trò",
      "unresolvedHint": "Cột này chưa được gán vai trò rõ ràng nên sẽ không tham gia luồng so sánh cặp chuyên sâu.",
      "unresolvedFallbackSummary": "Các cột {entries} chưa rõ vai trò nên lượt chạy này sẽ chuyển về chế độ so sánh tiêu chuẩn.",
      "expiredManualTag": "Cần xác nhận lại",
      "expiredManualSummary": "{count} thiết lập thủ công trước đó không còn hợp lệ nên hệ thống đã quay về gợi ý hiện tại.",
      "workspaceChangedTag": "Cần xác nhận lại",
      "workspaceChangedSummary": "{count} vai trò cột cần kiểm tra lại vì nội dung prompt trong không gian làm việc đã thay đổi.",
      "keepAuto": "Giữ gợi ý hệ thống",
      "keepAutoWithRole": "Giữ gợi ý hệ thống (hiện tại: {role})",
      "useInferred": "Dùng gợi ý hệ thống",
      "clearManual": "Xóa các thiết lập thủ công",
      "slotSectionTitle": "Thiết lập từng cột",
      "slotSectionSummary": "Hệ thống đã điền sẵn gợi ý cho từng cột. Bạn chỉ cần đổi khi thấy chưa đúng ý.",
      "currentRoleLabel": "Vai trò hiện tại",
      "rolePickerLabel": "Vai trò của cột này",
      "suggestedRoleLabel": "Gợi ý của hệ thống",
      "workspaceChangedInline": "Prompt phía sau cột này đã thay đổi. Vui lòng xác nhận lại vai trò.",
      "planStructuredSummaryDynamic": "Lượt đánh giá này sẽ xoay quanh Mục tiêu tối ưu hiện tại và kiểm tra xem {focuses}.",
      "planGenericSummary": "Các cột kiểm thử hiện tại chưa tạo thành bộ so sánh cặp ổn định nên sẽ chạy ở chế độ so sánh tiêu chuẩn.",
      "structuredFocusJoiner": ", ",
      "structuredFocusFinalJoiner": " và ",
      "structuredFocus": {
        "targetBaseline": "nó có cải thiện hơn so với Bản cơ sở (Baseline) hay không",
        "targetReference": "còn khoảng cách nào so với Mẫu chuẩn (Teacher) hay không",
        "referenceBaseline": "thay đổi tương tự có phát huy tác dụng bên phía Mẫu chuẩn hay không",
        "targetReplica": "kết luận hiện tại có ổn định qua các lần chạy lại hay không"
      },
      "previewModeLabel": "Chế độ so sánh",
      "previewPairsLabel": "Các cặp đối chiếu",
      "previewReasonsLabel": "Ghi chú hệ thống",
      "previewModeStructured": "So sánh thông minh",
      "previewModeGeneric": "So sánh tiêu chuẩn",
      "genericFallbackSummary": "Thiết lập này sẽ dùng so sánh tiêu chuẩn thay vì so sánh thông minh từng cặp.",
      "confirmDisabled": "Hãy xử lý các xung đột vai trò trước khi xác nhận",
      "noVersionLabel": "Chưa chọn phiên bản",
      "noModel": "Chưa chọn mô hình",
      "blockingSummary": "Thiết lập vai trò hiện tại đang có xung đột. Vui lòng sửa trước khi xác nhận.",
      "advancedSectionTitle": "Chi tiết nâng cao",
      "advancedSectionSummary": "Phần này giải thích cách hệ thống ghép cặp các cột và lý do suy luận.",
      "showAdvancedRoles": "Hiện vai trò nâng cao",
      "hideAdvancedRoles": "Ẩn vai trò nâng cao",
      "showAdvancedDetails": "Xem chi tiết nâng cao",
      "hideAdvancedDetails": "Ẩn chi tiết nâng cao",
      "advancedConflictTitle": "Các vấn đề cần giải quyết",
      "pairValues": {
        "targetBaseline": "Mục tiêu tối ưu vs Bản cơ sở",
        "targetReference": "Mục tiêu tối ưu vs Mẫu chuẩn (Teacher)",
        "referenceBaseline": "Mẫu chuẩn vs Bản cơ sở của Mẫu chuẩn",
        "targetReplica": "Mục tiêu tối ưu vs Chạy kiểm tra lại (Retest)"
      },
      "reasonValues": {
        "duplicateTarget": "Có nhiều hơn một Mục tiêu tối ưu nên hệ thống không thể xác định cột chính cần cải thiện.",
        "duplicateBaseline": "Có nhiều hơn một Bản cơ sở nên hệ thống không thể xác định mốc đối chiếu chuẩn.",
        "duplicateReference": "Có nhiều hơn một Mẫu chuẩn (Teacher) nên hệ thống không thể xác định cột cần học hỏi.",
        "duplicateReferenceBaseline": "Có nhiều hơn một Bản cơ sở của Mẫu chuẩn nên không thể ghép cặp chính xác.",
        "hasAuxiliarySnapshot": "Một số cột được chọn không thuộc cặp đối chiếu cốt lõi nên lượt này chuyển về so sánh tiêu chuẩn.",
        "missingTarget": "Chưa có Mục tiêu tối ưu hợp lệ nên không thể bắt đầu so sánh thông minh.",
        "missingStructuredCompanion": "Mục tiêu tối ưu đang thiếu cột đối chiếu đi kèm (Bản cơ sở, Mẫu chuẩn hoặc Chạy lại) nên chưa thể chấm điểm từng cặp.",
        "referenceBaselineWithoutReference": "Có Bản cơ sở của Mẫu chuẩn nhưng lại thiếu cột Mẫu chuẩn tương ứng."
      },
      "roleValues": {
        "target": "Mục tiêu tối ưu",
        "baseline": "Bản cơ sở (Baseline)",
        "reference": "Mẫu chuẩn (Teacher)",
        "referenceBaseline": "Cơ sở của Mẫu chuẩn",
        "replica": "Chạy lại (Retest)",
        "auxiliary": "Kiểm thử khác"
      },
      "suggestionReasons": {
        "default": "Hệ thống suy luận gợi ý này từ mối quan hệ giữa các phiên bản, mô hình và nội dung prompt hiện tại.",
        "target": {
          "uniqueWorkspace": "Đây là cột duy nhất dùng không gian làm việc hiện tại nên được gợi ý làm Mục tiêu tối ưu.",
          "workspace": "Đây là cột không gian làm việc hiện tại nên được gợi ý làm Mục tiêu tối ưu."
        },
        "baseline": {
          "dynamicPrevious": "Đây là phiên bản liền trước của không gian làm việc hiện tại nên được gợi ý làm Bản cơ sở.",
          "sameModelDifferentPrompt": "Cột này dùng cùng mô hình với Mục tiêu tối ưu nhưng khác phiên bản prompt nên được gợi ý làm Bản cơ sở."
        },
        "reference": {
          "samePromptDifferentModel": "Đây là kết quả chạy cùng prompt nhưng trên một mô hình khác nên được gợi ý làm Mẫu chuẩn (Teacher).",
          "differentModel": "Cột này dùng mô hình khác với Mục tiêu tối ưu nên được gợi ý làm Mẫu chuẩn (Teacher)."
        },
        "referenceBaseline": {
          "sameModelDifferentPrompt": "Cột này dùng cùng mô hình với Mẫu chuẩn nhưng ở phiên bản prompt trước nên được gợi ý làm Cơ sở của Mẫu chuẩn."
        },
        "replica": {
          "previousMatchesWorkspace": "Nội dung trùng khớp với không gian làm việc hiện tại nên được gợi ý làm lượt Chạy lại (Retest).",
          "samePromptAsTarget": "Dùng cùng nội dung prompt với Mục tiêu tối ưu nên được gợi ý làm lượt Chạy lại (Retest)."
        },
        "auxiliary": {
          "default": "Cột này không nằm trong các cặp đối chiếu cốt lõi nên được xếp vào nhóm Kiểm thử khác."
        }
      }
    },
    "compareShared": {
      "status": {
        "needTarget": "Vui lòng chọn Mục tiêu tối ưu trước.",
        "needReview": "Cài đặt đã thay đổi. Vui lòng xác nhận lại."
      },
      "roleValues": {
        "target": "Mục tiêu tối ưu",
        "baseline": "Bản cơ sở",
        "reference": "Mẫu chuẩn (Teacher)",
        "referenceBaseline": "Cơ sở Mẫu chuẩn",
        "replica": "Chạy lại (Retest)",
        "auxiliary": "Kiểm thử khác"
      },
      "roleDescriptions": {
        "target": "Cột bạn đang trực tiếp tối ưu và muốn cải thiện chất lượng trong vòng này.",
        "baseline": "Mốc đối chiếu (có thể là bản gốc hoặc phiên bản trước) dùng để đánh giá xem Mục tiêu tối ưu có thực sự tiến bộ hay không.",
        "reference": "Kết quả mẫu đáng học hỏi, thường được sinh từ một mô hình mạnh hơn hoặc ổn định hơn.",
        "referenceBaseline": "Bản cơ sở bên phía mô hình Mẫu chuẩn, giúp kiểm tra xem thay đổi prompt có mang lại tiến bộ tương tự trên mô hình mạnh hay không.",
        "replica": "Lượt chạy kiểm tra lại nhằm đánh giá độ ổn định của kết quả (tránh ăn may trên một lần sinh).",
        "auxiliary": "Cột kiểm thử phụ; vẫn xuất hiện trong so sánh tiêu chuẩn nhưng không tạo thành cặp chấm điểm cốt lõi."
      },
      "roleSource": {
        "manual": "Bạn đã xác nhận vai trò này thủ công.",
        "auto": "Vai trò này được hệ thống tự động gợi ý."
      },
      "unresolved": {
        "label": "Chưa rõ vai trò",
        "description": "Cột này chưa được ánh xạ rõ vào vai trò so sánh cốt lõi nào.",
        "source": "Hệ thống hiện chưa thể phân loại cột này vào Mục tiêu tối ưu, Bản cơ sở, Mẫu chuẩn hay Chạy lại."
      },
      "review": {
        "workspaceChanged": "Prompt liên kết trong không gian làm việc đã thay đổi, cần xem lại vai trò này.",
        "staleManual": "Vai trò chọn thủ công trước đó không còn khớp với cấu hình so sánh hiện tại."
      },
      "roleAction": "Nhấn vào nhãn này để cập nhật vai trò so sánh.",
      "assignment": {
        "unassigned": "Chưa gán vai trò.",
        "manual": "Bạn đã chọn: {role}",
        "auto": "Gợi ý hệ thống: {role}"
      },
      "modeValues": {
        "structured": "So sánh thông minh",
        "generic": "So sánh tiêu chuẩn"
      },
      "recommendationValues": {
        "continue": "Tiếp tục tinh chỉnh",
        "stop": "Nên dừng tại đây",
        "review": "Cần kiểm tra thủ công"
      }
    },
    "compareHelp": {
      "title": "Hướng dẫn Đánh giá So sánh",
      "tooltip": "Đánh giá so sánh là gì?"
    },
    "compareUnavailable": {
      "missingWorkspace": "Đánh giá so sánh yêu cầu ít nhất một kết quả kiểm thử từ Không gian làm việc hiện tại để đưa ra đề xuất cải thiện. Hãy chạy kiểm thử cột Không gian làm việc trước rồi so sánh lại."
    },
    "compareSummary": {
      "decision": {
        "title": "Khuyến nghị tinh chỉnh"
      },
      "reusableImprovements": "Các điểm cải thiện có thể tái sử dụng",
      "rewriteButton": "Viết lại theo đánh giá này",
      "rewriteSkipHint": "Khuyến nghị hiện tại là giữ nguyên prompt trừ khi bạn xác định vẫn còn dư địa cải thiện rõ ràng.",
      "rewriteMinorHint": "Tại đây chỉ nên tinh chỉnh nhỏ thay vì viết lại toàn bộ cấu trúc lớn.",
      "compactSignals": {
        "targetVsBaseline": "So với bản trước",
        "targetVsReferenceGap": "Khoảng cách Teacher",
        "improvementHeadroom": "Dư địa cải thiện",
        "overfitRisk": "Nguy cơ quá khớp"
      },
      "reasonTitles": {
        "progress": "So với bản trước",
        "reference": "Mẫu chuẩn (Teacher)",
        "stability": "Độ ổn định"
      },
      "reasonBodies": {
        "progress": {
          "improved": "Mục tiêu tối ưu đã vượt lên so với phiên bản trước, nhưng vẫn nên kiểm tra xem những cải thiện nào thực sự tái sử dụng được.",
          "flat": "Mục tiêu tối ưu tương đương phiên bản trước; hãy kết hợp thêm bằng chứng từ Mẫu chuẩn và độ ổn định trước khi quyết định bước tiếp theo.",
          "regressed": "Mục tiêu tối ưu bị thụt lùi so với phiên bản trước; hãy kiểm tra xem quy tắc nào vừa bị lược bỏ hoặc làm yếu đi."
        },
        "reference": {
          "none": "Mục tiêu tối ưu đã tiệm cận chất lượng của Mẫu chuẩn (Teacher), việc viết lại thêm có thể không mang lại nhiều khác biệt.",
          "minor": "Vẫn còn một vài điểm cấu trúc nhỏ mà Mục tiêu tối ưu có thể học hỏi từ Mẫu chuẩn.",
          "major": "Vẫn còn khoảng cách rõ rệt so với Mẫu chuẩn; vòng tinh chỉnh tiếp theo nên tập trung học hỏi chiến lược trình bày của Mẫu chuẩn."
        },
        "stability": {
          "high": "Mức cải thiện hiện tại có nguy cơ quá khớp (overfit) cao vào mẫu thử đơn lẻ; cần lọc bỏ các quy tắc quá hẹp trước khi viết lại.",
          "medium": "Vẫn tồn tại rủi ro quá khớp ở mức trung bình; vòng tiếp theo chỉ nên giữ lại các quy tắc tổng quát.",
          "low": "Kết quả đã gần hội tụ ổn định; hãy cân nhắc kỹ trước khi chồng thêm quy tắc mới.",
          "default": "Cần thêm bằng chứng trên cùng đầu vào để khẳng định kết luận hiện tại có thực sự ổn định hay không."
        }
      },
      "advanced": {
        "show": "Xem chi tiết nâng cao",
        "hide": "Ẩn chi tiết nâng cao",
        "title": "Chi tiết so sánh",
        "mode": "Chế độ so sánh",
        "roles": "Các cột được đối chiếu",
        "stopSignals": "Tín hiệu rủi ro & hội tụ",
        "insights": "Phát hiện chính",
        "focusSummaries": "Tóm tắt theo trọng tâm",
        "pairHighlights": "Điểm nhấn từng cặp",
        "evidence": "Bằng chứng gốc nổi bật",
        "learnableSignals": "Điểm có thể học hỏi",
        "overfit": "Nguy cơ quá khớp (Overfit)",
        "conflicts": "Cần kiểm tra thủ công",
        "judgements": "Kết quả chấm từng cặp"
      }
    },
    "compareMetadata": {
      "title": "Siêu dữ liệu so sánh nâng cao",
      "insights": "Phát hiện chính",
      "decision": {
        "title": "Quyết định so sánh",
        "keyEvidence": "Bằng chứng cốt lõi",
        "nextActions": "Hành động tiếp theo",
        "headlines": {
          "continue": "Mục tiêu tối ưu đang đi đúng hướng và vẫn còn dư địa cải thiện rõ ràng.",
          "stop": "Kết quả hiện tại đã gần hội tụ; việc tự động viết lại thêm ít có khả năng cải thiện đáng kể.",
          "review": "Kết quả so sánh hiện tại có điểm mâu thuẫn, cần xem xét thủ công trước khi viết lại.",
          "regressed": "Mục tiêu tối ưu có dấu hiệu thụt lùi so với phiên bản trước; không nên áp dụng bản viết lại này ngay."
        },
        "actions": {
          "inspectRegression": "Kiểm tra xem phiên bản mới đã làm mất hoặc làm yếu đi chỉ dẫn quan trọng nào trước khi viết lại.",
          "reviewBeforeRewrite": "Xem kỹ các bằng chứng mâu thuẫn trước, sau đó quyết định nên viết lại hay giữ bản hiện tại.",
          "reviewPromptValidity": "Kiểm tra xem thay đổi trong prompt có thực sự tổng quát không, vì kết quả bên phía Mẫu chuẩn chưa ủng hộ thay đổi này.",
          "learnFromReference": "Học hỏi cấu trúc lập luận vững hơn từ phía Mẫu chuẩn (Teacher) trong vòng tinh chỉnh kế tiếp.",
          "filterOverfit": "Lọc bỏ các quy tắc chỉ phục vụ riêng mẫu thử hiện tại và giữ lại hướng dẫn tổng quát.",
          "continueTargetedRewrite": "Nếu tiếp tục viết lại, chỉ tập trung giải quyết khoảng trống quan trọng nhất thay vì sửa dàn trải.",
          "acceptCurrent": "Coi phiên bản hiện tại đã đạt ngưỡng hội tụ và tránh chồng thêm quy tắc trừ khi có trường hợp kiểm thử mới.",
          "verifyStability": "Kiểm tra lại độ ổn định bằng một đầu vào dùng chung khác nếu kết quả hiện tại vẫn sát nút."
        }
      },
      "focusSummaries": "Tóm tắt theo trọng tâm",
      "mode": "Chế độ so sánh",
      "roles": "Các cột được đối chiếu",
      "judgements": "Kết quả chấm từng cặp",
      "pairHighlights": "Điểm nhấn từng cặp",
      "progressSummary": "So với phiên bản trước",
      "referenceGapSummary": "So với Mẫu chuẩn (Teacher)",
      "promptChangeSummary": "Độ hiệu lực của thay đổi Prompt",
      "stabilitySummary": "Độ ổn định",
      "stopSignals": "Tín hiệu rủi ro & hội tụ",
      "evidence": "Bằng chứng",
      "evidenceHighlights": "Điểm nhấn bằng chứng",
      "learnableSignals": "Tín hiệu có thể học hỏi",
      "overfitWarnings": "Cảnh báo quá khớp (Overfit)",
      "conflictSignals": "Cần kiểm tra thủ công",
      "targetVsBaseline": "Mục tiêu tối ưu vs Bản cơ sở",
      "targetVsReferenceGap": "Khoảng cách tới Mẫu chuẩn",
      "improvementHeadroom": "Dư địa cải thiện",
      "overfitRisk": "Nguy cơ quá khớp",
      "stopRecommendation": "Khuyến nghị",
      "stopReasons": "Tín hiệu suy luận",
      "modeValues": {
        "structured": "So sánh thông minh",
        "generic": "So sánh tiêu chuẩn"
      },
      "roleValues": {
        "target": "Mục tiêu tối ưu",
        "baseline": "Bản cơ sở",
        "reference": "Mẫu chuẩn (Teacher)",
        "referenceBaseline": "Cơ sở Mẫu chuẩn",
        "replica": "Chạy lại (Retest)",
        "auxiliary": "Kiểm thử khác"
      },
      "verdictValues": {
        "left-better": "Bên trái tốt hơn",
        "right-better": "Bên phải tốt hơn",
        "mixed": "Hơn kém đan xen",
        "similar": "Tương đương nhau"
      },
      "confidenceValues": {
        "low": "Độ tin cậy thấp",
        "medium": "Độ tin cậy trung bình",
        "high": "Độ tin cậy cao"
      },
      "conflictSignalValues": {
        "improvementNotSupportedOnReference": "Mục tiêu tối ưu cải thiện hơn bản trước, nhưng thay đổi prompt tương tự không mang lại hiệu quả bên phía Mẫu chuẩn.",
        "improvementUnstableAcrossReplicas": "Mục tiêu tối ưu có cải thiện, nhưng bằng chứng chạy kiểm tra lại cho thấy kết quả chưa ổn định.",
        "regressionOutweighsCosmeticGains": "Sự thụt lùi về nội dung cốt lõi so với bản trước nghiêm trọng hơn các cải thiện hình thức nhỏ lẻ.",
        "sampleOverfitRiskVisible": "Cải thiện thực chất và dấu hiệu học vẹt theo mẫu cùng tồn tại, cần lưu ý rủi ro quá khớp."
      },
      "signalValues": {
        "targetVsBaseline": {
          "improved": "Có tiến bộ",
          "flat": "Tương đương",
          "regressed": "Thụt lùi"
        },
        "targetVsReferenceGap": {
          "none": "Khoảng cách rất nhỏ",
          "minor": "Còn khoảng cách nhỏ",
          "major": "Khoảng cách rõ rệt"
        },
        "improvementHeadroom": {
          "none": "Hầu như không còn",
          "low": "Thấp",
          "medium": "Trung bình",
          "high": "Cao"
        },
        "overfitRisk": {
          "low": "Thấp",
          "medium": "Trung bình",
          "high": "Cao"
        },
        "stopRecommendation": {
          "continue": "Tiếp tục tinh chỉnh",
          "stop": "Nên dừng tại đây",
          "review": "Cần kiểm tra lại"
        }
      }
    },
    "level": {
      "excellent": "Xuất sắc",
      "good": "Tốt",
      "acceptable": "Đạt yêu cầu",
      "poor": "Kém",
      "veryPoor": "Rất kém"
    },
    "dimension": {
      "goalAchievement": "Mức độ đạt mục tiêu",
      "outputQuality": "Chất lượng đầu ra",
      "formatCompliance": "Tuân thủ định dạng",
      "relevance": "Độ liên quan"
    },
    "optimizedBetter": "Phiên bản tối ưu tốt hơn",
    "originalBetter": "Phiên bản gốc tốt hơn",
    "syntheticInput": {
      "noExplicitText": "Không có đầu vào kiểm thử riêng; kết quả được sinh trực tiếp từ prompt hiện tại.",
      "noExplicitVariables": "Không có đầu vào biến bổ sung."
    },
    "error": {
      "title": "Đánh giá thất bại",
      "serviceNotReady": "Dịch vụ đánh giá chưa sẵn sàng, vui lòng thử lại sau",
      "failed": "Đánh giá thất bại: {error}",
      "noOptimizedPrompt": "Chưa có prompt để tối ưu"
    },
    "designContext": {
      "basic": "Ngữ cảnh thiết kế",
      "advanced": "Ngữ cảnh thiết kế"
    },
    "variableExtraction": {
      "extractButton": "Tự động trích xuất biến",
      "extracting": "Đang trích xuất...",
      "dialogTitle": "Kết quả trích xuất biến tự động",
      "variableName": "Tên biến",
      "variableValue": "Giá trị biến",
      "reason": "Lý do trích xuất",
      "category": "Phân loại",
      "selected": "Đã chọn",
      "batchCreate": "Tạo hàng loạt",
      "noVariables": "Không phát hiện biến nào có thể trích xuất",
      "extractFailed": "Tự động trích xuất biến thất bại",
      "staleResult": "Prompt hoặc danh sách biến đã thay đổi. Vui lòng trích xuất lại.",
      "createSuccess": "Đã tạo thành công {count} biến",
      "summary": "Tóm tắt",
      "workspaceNotReady": "Không thể truy cập trạng thái không gian làm việc",
      "noPromptContent": "Vui lòng nhập nội dung prompt trước",
      "noEvaluationModel": "Vui lòng chọn mô hình đánh giá trước",
      "serviceNotReady": "Dịch vụ trích xuất biến chưa sẵn sàng",
      "invalidVariableNames": "Tên biến không hợp lệ (không bắt đầu bằng số hoặc # / ^ ! > &; không chứa khoảng trắng/ngoặc nhọn; tối đa {max} ký tự): {names}"
    },
    "diagnose": {
      "title": "Phân tích chẩn đoán",
      "confidence": "Độ tin cậy",
      "findings": "Vấn đề phát hiện",
      "patchPlan": "Kế hoạch vá lỗi (Patch Plan)",
      "noFindings": "Không phát hiện vấn đề nào",
      "noPatchPlan": "Chưa có kế hoạch vá lỗi",
      "applyFix": "Áp dụng bản sửa",
      "replaceNow": "Thay thế ngay",
      "invariantsWarning": "Bị giới hạn bởi các điều kiện bất biến (invariants)",
      "changeBudgetWarning": "Bị giới hạn bởi phạm vi thay đổi cho phép",
      "status": {
        "ok": "Chẩn đoán hoàn tất",
        "degraded": "Hoàn tất một phần",
        "failed": "Chẩn đoán thất bại"
      },
      "severity": {
        "critical": "Nghiêm trọng",
        "major": "Lớn",
        "minor": "Nhỏ",
        "suggestion": "Gợi ý",
        "unknown": "Không rõ"
      },
      "anchorType": {
        "text": "Văn bản",
        "section": "Phân đoạn",
        "pattern": "Mẫu (Pattern)"
      },
      "operation": {
        "insert": "Chèn thêm",
        "replace": "Thay thế",
        "delete": "Xóa"
      },
      "anchorPosition": {
        "before": "Trước",
        "after": "Sau",
        "replace": "Thay thế"
      },
      "invariantsRisks": "Rủi ro vi phạm điều kiện bất biến"
    }
  }
} as const;

export default messages;
