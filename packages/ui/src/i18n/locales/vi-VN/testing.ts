const messages = {
  "history": {
    "title": "Lịch sử",
    "iterationNote": "Ghi chú lặp lại",
    "optimizedPrompt": "Prompt đã tối ưu",
    "searchPlaceholder": "Tìm trong lịch sử...",
    "confirmClear": "Bạn có chắc muốn xóa toàn bộ lịch sử? Hành động này không thể hoàn tác.",
    "confirmDeleteChain": "Bạn có chắc muốn xóa bản ghi lịch sử này? Hành động này không thể hoàn tác.",
    "cleared": "Đã xóa lịch sử",
    "chainDeleted": "Đã xóa bản ghi lịch sử",
    "useThisVersion": "Dùng phiên bản này",
    "noHistory": "Chưa có lịch sử",
    "actionsFor": "Hành động cho {title}"
  },
  "test": {
    "config": {
      "target": "Đối tượng",
      "unassigned": "Chưa gán"
    },
    "title": "Kiểm thử",
    "areaTitle": "Khu vực kiểm thử",
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
      "replace": "Thay ảnh kiểm thử",
      "remove": "Xóa ảnh kiểm thử",
      "previewAlt": "Ảnh kiểm thử đã đính kèm",
      "unsupportedFormat": "Chỉ hỗ trợ ảnh PNG hoặc JPEG",
      "tooLarge": "Ảnh không được vượt quá 5 MiB",
      "readFailed": "Không đọc được ảnh đã chọn",
      "visionHint": "Model đã chọn phải hỗ trợ nhập ảnh",
      "evaluationLabel": "Ảnh kiểm thử"
    },
    "model": "Model kiểm thử",
    "startTest": "Kiểm thử",
    "startCompare": "Kiểm thử",
    "testing": "Đang kiểm thử...",
    "toggleCompare": {
      "enable": "Bật so sánh",
      "disable": "Tắt so sánh"
    },
    "compareMode": "Chế độ so sánh",
    "layout": {
      "columns": "Cột",
      "workspace": "Workspace",
      "previous": "Trước đó",
      "original": "Gốc",
      "previousHelp": {
        "dynamic": "",
        "currentBase": "Workspace đang có thay đổi chưa lưu nên dùng phiên bản đã lưu hiện tại.",
        "earlierSaved": "Workspace đã lưu nên dùng phiên bản trước đó.",
        "originalFallback": "Chưa có phiên bản trước đó nên dùng prompt gốc.",
        "sameAsWorkspace": "Hiện đang giống workspace nên so sánh sẽ xem đây như một lần chạy lại."
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
    "userPromptTest": "Kiểm thử Prompt người dùng",
    "advanced": {
      "startTest": "Kiểm thử",
      "result": "Kết quả kiểm thử",
      "messageCount": "{count} tin nhắn",
      "missingVariables": "Thiếu {count} biến"
    },
    "error": {
      "failed": "Kiểm thử thất bại",
      "noModel": "Vui lòng chọn model kiểm thử trước",
      "noTestContent": "Vui lòng nhập nội dung kiểm thử",
      "noWorkspacePrompt": "Workspace đang trống. Vui lòng nhập hoặc tạo prompt trong workspace trước",
      "noOriginalPrompt": "Vui lòng nhập prompt gốc trước",
      "noOptimizedPrompt": "Vui lòng tạo prompt đã tối ưu trước",
      "missingVariables": "Thiếu hoặc trống biến: {vars}",
      "forbiddenTemplateSyntax": "Không hỗ trợ cú pháp Mustache chưa escape (ví dụ dấu ngoặc nhọn ba hoặc thẻ &). Vui lòng dùng placeholder biến thông thường.",
      "originalTestFailed": "Kiểm thử prompt gốc thất bại",
      "optimizedTestFailed": "Kiểm thử prompt đã tối ưu thất bại",
      "saveToGlobalFailed": "Không lưu được biến {name} vào biến toàn cục"
    },
    "enableMarkdown": "Bật hiển thị Markdown",
    "disableMarkdown": "Tắt hiển thị Markdown",
    "thinking": "Quá trình suy luận",
    "variables": {
      "detected": "Biến đã phát hiện",
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
      "firstRound": "Vòng 1 (Biến có sẵn)",
      "secondRound": "Vòng 2 (Biến tùy chỉnh)",
      "builtinVars": "Biến có sẵn",
      "customVars": "Biến tùy chỉnh",
      "finalPreview": "Xem trước cuối cùng",
      "missingVars": "Biến còn thiếu",
      "saveToGlobal": "Lưu vào biến toàn cục",
      "savedToGlobal": "Đã lưu vào biến toàn cục",
      "emptyValueWarning": "Giá trị trống, không thể lưu",
      "tempCount": "{count} biến tạm thời",
      "addVariable": "Thêm biến",
      "nameRequired": "Tên biến là bắt buộc",
      "addSuccess": "Đã thêm biến thành công",
      "clearAllConfirm": "Xóa tất cả biến tạm thời ({count})?",
      "renameSuccess": "Đã đổi tên biến từ {oldName} thành {newName}",
      "renameNotSupported": "Chế độ xem này không hỗ trợ đổi tên biến",
      "deleteSuccess": "Đã xóa biến {name}",
      "clearSuccess": "Đã xóa tất cả biến tạm thời",
      "delete": "Xóa biến này",
      "fullscreenEdit": "Sửa giá trị ở chế độ toàn màn hình"
    },
    "variableValueGeneration": {
      "generateButton": "Điền giá trị biến thông minh",
      "generating": "Đang tạo thông minh...",
      "dialogTitle": "Xem trước giá trị biến đã tạo",
      "variableName": "Tên biến",
      "generatedValue": "Giá trị đã tạo",
      "valuePlaceholder": "Nhập giá trị biến",
      "reason": "Lý do tạo",
      "confidence": "Độ tin cậy",
      "selected": "Đã chọn",
      "batchApply": "Áp dụng hàng loạt ({count})",
      "noVariablesToGenerate": "Không có biến nào cần điền giá trị",
      "generateFailed": "Tạo giá trị biến thất bại",
      "applySuccess": "Đã áp dụng thành công {count} giá trị biến",
      "noPrompt": "Vui lòng nhập hoặc tạo prompt đã tối ưu trước",
      "noMissingVariables": "Mọi biến đã được điền đủ",
      "serviceNotReady": "Dịch vụ tạo giá trị biến chưa sẵn sàng",
      "noValues": "Chưa tạo được giá trị biến nào"
    },
    "invalidVariables": "Dữ liệu biến không hợp lệ",
    "getVariablesFailed": "Không lấy được biến"
  },
  "evaluation": {
    "button": "Đánh giá",
    "evaluate": "Đánh giá",
    "reEvaluate": "Đánh giá lại",
    "compareEvaluate": "So sánh",
    "loading": "Đang đánh giá...",
    "analyzing": "Đang phân tích...",
    "overallScore": "Tổng thể",
    "dimensions": "Điểm theo tiêu chí",
    "issues": "Vấn đề",
    "improvements": "Cải tiến",
    "applyToIterate": "Lặp lại",
    "rewriteFromEvaluation": "Viết lại",
    "rewriteSkipped": "Đánh giá khuyên giữ nguyên prompt hiện tại nên đã bỏ qua bước viết lại.",
    "applySuccess": "Đang áp dụng cải tiến...",
    "noResult": "Chưa có kết quả đánh giá. Nhấn nút đánh giá để bắt đầu.",
    "viewDetails": "Xem chi tiết",
    "feedbackAnalyze": "Trọng tâm",
    "feedbackTitle": "Trọng tâm",
    "optional": "Không bắt buộc",
    "feedbackPlaceholder": "Mô tả điều cần tập trung. Phân tích sẽ ưu tiên ghi chú của bạn.",
    "feedbackHint": "Esc để hủy · Ctrl/⌘+Enter để gửi",
    "feedbackSubmit": "Gửi & phân tích",
    "focus": "Trọng tâm",
    "focusTitle": "Trọng tâm",
    "focusPlaceholder": "Không bắt buộc: đánh giá nên tập trung vào điều gì? (ví dụ cấu trúc đầu ra, ràng buộc còn thiếu, độ dài ví dụ)",
    "focusHint": "Để trống để chạy đánh giá thông minh mặc định.",
    "stale": {
      "default": "Kết quả này dựa trên nội dung cũ. Chạy lại đánh giá nếu cần.",
      "promptOnly": "Prompt đã thay đổi. Chạy lại phân tích nếu cần.",
      "promptIterate": "Prompt hoặc yêu cầu lặp lại đã thay đổi. Chạy lại phân tích nếu cần.",
      "result": "Thiết lập kiểm thử hoặc workspace đã thay đổi. Chạy lại đánh giá nếu cần.",
      "compare": "Thiết lập kiểm thử hoặc workspace đã thay đổi. Chạy lại so sánh nếu cần."
    },
    "title": {
      "default": "Kết quả đánh giá",
      "result": "Đánh giá kết quả",
      "compare": "Đánh giá so sánh",
      "promptOnly": "Phân tích chất lượng Prompt",
      "promptIterate": "Phân tích lần lặp"
    },
    "type": {
      "result": "Đánh giá kết quả này",
      "compare": "Đánh giá so sánh"
    },
    "compareConfig": {
      "button": "Cài đặt so sánh",
      "dialogTitle": "Cài đặt so sánh",
      "helper": "Xác nhận vai trò của từng cột kiểm thử. Nếu gợi ý của hệ thống đúng, bạn có thể xác nhận ngay.",
      "helperSummary": "Chọn mục tiêu tối ưu trước. Phiên bản trước đó sẽ bám theo workspace hiện tại một cách tự động.",
      "summaryTitle": "Kế hoạch so sánh này",
      "currentTargetLabel": "Mục tiêu tối ưu hiện tại",
      "currentTargetMissing": "Chưa chọn",
      "summaryUnassigned": "Chưa gán",
      "summaryUnused": "Không dùng trong vòng này",
      "summaryNeedTarget": "Cần có mục tiêu tối ưu",
      "summaryAssigned": "Sẵn sàng",
      "summaryRequired": "Bắt buộc",
      "summaryOptional": "Không bắt buộc",
      "summaryStructured": "So sánh thông minh sẽ đánh giá xem mục tiêu tối ưu có cải thiện không, có học được gì từ mẫu tham chiếu không, và kết luận có ổn định không.",
      "summaryGeneric": "Thiết lập này phù hợp hơn với so sánh chuẩn và sẽ không vào so sánh thông minh từng cặp.",
      "summaryPairs": "Nhóm so sánh chính: {pairs}",
      "summaryHints": {
        "target": "Chọn cột bạn thực sự đang muốn cải thiện trong vòng này.",
        "baseline": "Thường là phiên bản ngay trước workspace hiện tại, dùng để kiểm chứng tiến bộ thực sự.",
        "reference": "Thường là cột mạnh hơn hoặc ổn định hơn, đóng vai trò mẫu tham chiếu.",
        "replica": "Dùng để kiểm tra kết luận có ổn định không. Nếu phiên bản trước đó giống workspace, nó có thể xuất hiện ở đây.",
        "referenceBaseline": "Chỉ dùng khi bạn cũng muốn kiểm tra thay đổi có hiệu quả ở phía mẫu tham chiếu không."
      },
      "assignedHints": {
        "baselineDynamic": "Được xác định tự động từ workspace hiện tại.",
        "replicaFromPrevious": "Nội dung giống workspace hiện tại nên được xem như một lần chạy lại."
      },
      "requireTarget": "Đã phát hiện nhiều lần kiểm thử workspace. Vui lòng chọn cột nào là mục tiêu tối ưu.",
      "targetRequired": "Vui lòng chọn mục tiêu tối ưu trước.",
      "targetNeededShort": "Chọn mục tiêu tối ưu",
      "reviewNeededShort": "Vui lòng xác nhận lại",
      "autoDetected": "Gợi ý hệ thống",
      "manualAssigned": "Thủ công",
      "selectRolePlaceholder": "Chọn vai trò",
      "restoreSuggested": "Khôi phục gợi ý",
      "suggestedRoleTag": "Gợi ý hệ thống: {role}",
      "unassignedTag": "Chưa rõ",
      "unresolvedHint": "Cột này chưa được gán rõ ràng nên sẽ không vào luồng so sánh thông minh chính.",
      "unresolvedFallbackSummary": "Các cột {entries} chưa được gán rõ ràng nên lần chạy này sẽ dùng so sánh chuẩn.",
      "expiredManualTag": "Cần xác nhận lại",
      "expiredManualSummary": "{count} cài đặt thủ công cũ không còn hợp lệ nên hệ thống đã quay về gợi ý hiện tại.",
      "workspaceChangedTag": "Cần xác nhận lại",
      "workspaceChangedSummary": "{count} cài đặt vai trò workspace cần xem lại vì prompt workspace đã thay đổi.",
      "keepAuto": "Giữ gợi ý hệ thống",
      "keepAutoWithRole": "Giữ gợi ý hệ thống (hiện tại: {role})",
      "useInferred": "Dùng gợi ý hệ thống",
      "clearManual": "Xóa ghi đè thủ công",
      "slotSectionTitle": "Cài đặt từng cột",
      "slotSectionSummary": "Hệ thống đã điền gợi ý cho từng cột. Chỉ thay đổi khi thấy chưa đúng.",
      "currentRoleLabel": "Vai trò hiện tại",
      "rolePickerLabel": "Vai trò của cột này",
      "suggestedRoleLabel": "Gợi ý hệ thống",
      "workspaceChangedInline": "Prompt workspace đằng sau cột này đã thay đổi. Vui lòng xác nhận lại vai trò.",
      "planStructuredSummaryDynamic": "Lần chạy này sẽ tập trung vào mục tiêu tối ưu hiện tại và xem xét {focuses}.",
      "planGenericSummary": "Các cột kiểm thử hiện tại chưa tạo được thiết lập so sánh thông minh ổn định nên lần chạy này sẽ dùng so sánh chuẩn.",
      "structuredFocusJoiner": ", ",
      "structuredFocusFinalJoiner": " và ",
      "structuredFocus": {
        "targetBaseline": "nó có cải thiện hơn mốc đối chiếu không",
        "targetReference": "vẫn còn khoảng cách với mẫu tham chiếu không",
        "referenceBaseline": "cùng kiểu thay đổi đó có hiệu quả ở phía mẫu tham chiếu không",
        "targetReplica": "kết luận hiện tại có ổn định không"
      },
      "previewModeLabel": "Chế độ so sánh",
      "previewPairsLabel": "Nhóm so sánh từng cặp",
      "previewReasonsLabel": "Ghi chú hệ thống",
      "previewModeStructured": "So sánh thông minh",
      "previewModeGeneric": "So sánh chuẩn",
      "genericFallbackSummary": "Thiết lập này sẽ dùng so sánh chuẩn thay vì so sánh thông minh từng cặp.",
      "confirmDisabled": "Giải quyết các xung đột trước khi xác nhận",
      "noVersionLabel": "Chưa chọn phiên bản",
      "noModel": "Chưa chọn model",
      "blockingSummary": "Cài đặt vai trò hiện tại có xung đột. Vui lòng sửa trước khi xác nhận.",
      "advancedSectionTitle": "Chi tiết nâng cao",
      "advancedSectionSummary": "Phần này giải thích hệ thống sẽ so sánh các cột như thế nào và vì sao.",
      "showAdvancedRoles": "Hiện vai trò nâng cao",
      "hideAdvancedRoles": "Ẩn vai trò nâng cao",
      "showAdvancedDetails": "Xem chi tiết nâng cao",
      "hideAdvancedDetails": "Ẩn chi tiết nâng cao",
      "advancedConflictTitle": "Vấn đề cần giải quyết",
      "pairValues": {
        "targetBaseline": "Mục tiêu tối ưu với Mốc đối chiếu",
        "targetReference": "Mục tiêu tối ưu với Mẫu tham chiếu",
        "referenceBaseline": "Mẫu tham chiếu với Mốc của mẫu",
        "targetReplica": "Mục tiêu tối ưu với Chạy lại"
      },
      "reasonValues": {
        "duplicateTarget": "Có nhiều mục tiêu tối ưu nên hệ thống không biết cột nào mới thực sự đang được tối ưu.",
        "duplicateBaseline": "Có nhiều mốc đối chiếu nên hệ thống không biết nên dùng mốc nào làm mốc đối chiếu.",
        "duplicateReference": "Có nhiều mẫu tham chiếu nên hệ thống không biết nên học từ cột nào.",
        "duplicateReferenceBaseline": "Có nhiều mốc của mẫu tham chiếu nên hệ thống không biết mốc nào thuộc về phía mẫu tham chiếu.",
        "hasAuxiliarySnapshot": "Một số test đã chọn không phải so sánh từng cặp có ý nghĩa nên lần chạy này dùng so sánh chuẩn.",
        "missingTarget": "Không có mục tiêu tối ưu dùng được nên không thể bắt đầu so sánh thông minh.",
        "missingStructuredCompanion": "Mục tiêu tối ưu đang thiếu đối tác quan trọng (mốc đối chiếu, mẫu tham chiếu hoặc lần chạy lại) nên chưa thể chạy đánh giá từng cặp chính.",
        "referenceBaselineWithoutReference": "Có mốc của mẫu tham chiếu nhưng không có mẫu tham chiếu tương ứng nên bằng chứng đó sẽ không tham gia so sánh thông minh."
      },
      "roleValues": {
        "target": "Mục tiêu tối ưu",
        "baseline": "Mốc đối chiếu",
        "reference": "Mẫu tham chiếu",
        "referenceBaseline": "Mốc của mẫu",
        "replica": "Chạy lại",
        "auxiliary": "Test khác"
      },
      "suggestionReasons": {
        "default": "Hệ thống suy ra gợi ý này từ các phiên bản, model và mối quan hệ prompt hiện tại.",
        "target": {
          "uniqueWorkspace": "Đây là cột workspace duy nhất nên được gợi ý làm mục tiêu tối ưu.",
          "workspace": "Đây là cột workspace hiện tại nên được gợi ý làm mục tiêu tối ưu."
        },
        "baseline": {
          "dynamicPrevious": "Đây là phiên bản trước đó của workspace hiện tại nên được gợi ý làm mốc đối chiếu.",
          "sameModelDifferentPrompt": "Dùng cùng model với mục tiêu tối ưu nhưng prompt khác nên được gợi ý làm mốc đối chiếu."
        },
        "reference": {
          "samePromptDifferentModel": "Đây là kết quả workspace từ một model khác nên được gợi ý làm mẫu tham chiếu.",
          "differentModel": "Dùng model khác với mục tiêu tối ưu nên được gợi ý làm mẫu tham chiếu."
        },
        "referenceBaseline": {
          "sameModelDifferentPrompt": "Dùng cùng model với mẫu tham chiếu nhưng prompt khác nên được gợi ý làm phiên bản trước đó của mẫu tham chiếu."
        },
        "replica": {
          "previousMatchesWorkspace": "Nội dung giống workspace hiện tại nên được gợi ý làm lần chạy lại.",
          "samePromptAsTarget": "Dùng cùng prompt với mục tiêu tối ưu nên được gợi ý làm lần chạy lại."
        },
        "auxiliary": {
          "default": "Cột này sẽ không vào so sánh thông minh từng cặp chính nên giữ làm test khác."
        }
      }
    },
    "compareShared": {
      "status": {
        "needTarget": "Vui lòng chọn mục tiêu tối ưu trước.",
        "needReview": "Cài đặt đã thay đổi. Vui lòng xác nhận lại."
      },
      "roleValues": {
        "target": "Mục tiêu tối ưu",
        "baseline": "Mốc đối chiếu",
        "reference": "Mẫu tham chiếu",
        "referenceBaseline": "Mốc của mẫu",
        "replica": "Chạy lại",
        "auxiliary": "Test khác"
      },
      "roleDescriptions": {
        "target": "Đây là cột bạn đang tích cực tối ưu và muốn cải thiện trong vòng này.",
        "baseline": "Mốc đối chiếu có thể là prompt nhập ban đầu hoặc một phiên bản prompt khác; dùng để đánh giá mục tiêu có cải thiện không.",
        "reference": "Đây là đầu ra mẫu đáng học hỏi, thường từ model mạnh hơn hoặc ổn định hơn.",
        "referenceBaseline": "Mốc phía mẫu tham chiếu giúp đánh giá cùng một thay đổi prompt có cải thiện đầu ra của mẫu tham chiếu không.",
        "replica": "Đây là lần chạy lại để kiểm tra kết luận có ổn định không. Nếu phiên bản trước đó giống workspace, nó cũng có thể xuất hiện ở đây.",
        "auxiliary": "Test này vẫn có thể xuất hiện trong so sánh chuẩn nhưng sẽ không thành cặp so sánh thông minh chính."
      },
      "roleSource": {
        "manual": "Bạn đã xác nhận vai trò này thủ công.",
        "auto": "Vai trò này do hệ thống gợi ý tự động."
      },
      "unresolved": {
        "label": "Chưa rõ",
        "description": "Cột này chưa được gắn với vai trò so sánh chính nào.",
        "source": "Hệ thống hiện chưa thể phân loại cột này là mục tiêu tối ưu, mốc đối chiếu, mẫu tham chiếu hay lần chạy lại."
      },
      "review": {
        "workspaceChanged": "Prompt workspace liên kết đã thay đổi nên cần xem lại vai trò này.",
        "staleManual": "Vai trò thủ công cũ không còn khớp với thiết lập so sánh hiện tại."
      },
      "roleAction": "Nhấn vào thẻ này để cập nhật vai trò so sánh.",
      "assignment": {
        "unassigned": "Chưa gán vai trò nào.",
        "manual": "Bạn đã chọn: {role}",
        "auto": "Gợi ý hệ thống: {role}"
      },
      "modeValues": {
        "structured": "So sánh thông minh",
        "generic": "So sánh chuẩn"
      },
      "recommendationValues": {
        "continue": "Tiếp tục lặp lại",
        "stop": "Tạm dừng",
        "review": "Cần xem lại"
      }
    },
    "compareHelp": {
      "title": "Hướng dẫn đánh giá so sánh",
      "tooltip": "Đánh giá so sánh là gì?"
    },
    "compareUnavailable": {
      "missingWorkspace": "Đánh giá so sánh cần ít nhất một kết quả kiểm thử workspace vì hệ thống cần đưa ra hướng dẫn cho prompt workspace hiện tại. Hãy chạy cột workspace trước rồi so sánh lại."
    },
    "compareSummary": {
      "decision": {
        "title": "Lời khuyên lặp lại"
      },
      "reusableImprovements": "Cải tiến dùng lại được",
      "rewriteButton": "Viết lại từ đánh giá này",
      "rewriteSkipHint": "Hướng dẫn hiện tại khuyên giữ nguyên prompt trừ khi bạn đã xác nhận vẫn còn cải tiến rõ ràng, dùng lại được.",
      "rewriteMinorHint": "Nên sửa nhỏ ở đây thay vì viết lại lớn.",
      "compactSignals": {
        "targetVsBaseline": "Trước đó",
        "targetVsReferenceGap": "Khoảng cách với mẫu",
        "improvementHeadroom": "Dư địa",
        "overfitRisk": "Quá khớp"
      },
      "reasonTitles": {
        "progress": "Trước đó",
        "reference": "Mẫu tham chiếu",
        "stability": "Ổn định"
      },
      "reasonBodies": {
        "progress": {
          "improved": "Mục tiêu tối ưu đang tốt hơn phiên bản trước nhưng bạn vẫn nên xác nhận cải tiến nào thực sự dùng lại được.",
          "flat": "Mục tiêu tối ưu gần như ngang với phiên bản trước nên bạn cần kết hợp bằng chứng từ mẫu tham chiếu và độ ổn định trước khi quyết định bước tiếp theo.",
          "regressed": "Mục tiêu tối ưu đã thụt lùi so với phiên bản trước nên bạn nên xem điều gì đã tệ đi trước."
        },
        "reference": {
          "none": "Mục tiêu tối ưu đã gần với mẫu tham chiếu nên viết lại nữa có thể ít hiệu quả.",
          "minor": "Vẫn còn vài thay đổi về cấu trúc mà mục tiêu tối ưu có thể học từ mẫu tham chiếu.",
          "major": "Vẫn còn khoảng cách rõ rệt với mẫu tham chiếu nên vòng tiếp theo cần tập trung học chiến lược mạnh hơn ở phía mẫu tham chiếu."
        },
        "stability": {
          "high": "Mức cải thiện hiện tại có thể chứa rủi ro khớp mẫu cao nên cần lọc các quy tắc quá khớp trước khi viết lại.",
          "medium": "Vẫn còn rủi ro quá khớp nên vòng tiếp theo chỉ nên giữ lại các quy tắc dùng lại được một cách thận trọng hơn.",
          "low": "Kết quả đã gần hội tụ nên hãy xác nhận vẫn còn dư địa cải thiện thực sự trước khi thêm quy tắc mới.",
          "default": "Bạn vẫn cần thêm bằng chứng đầu vào chung để xác nhận kết luận này có ổn định không."
        }
      },
      "advanced": {
        "show": "Xem chi tiết nâng cao",
        "hide": "Ẩn chi tiết nâng cao",
        "title": "Chi tiết so sánh",
        "mode": "Chế độ so sánh",
        "roles": "Các cột được so sánh",
        "stopSignals": "Tín hiệu rủi ro và hội tụ",
        "insights": "Phát hiện chính",
        "focusSummaries": "Phát hiện theo trọng tâm",
        "pairHighlights": "Điểm nổi bật từng cặp",
        "evidence": "Điểm nổi bật bằng chứng thô",
        "learnableSignals": "Tín hiệu học được",
        "overfit": "Rủi ro quá khớp",
        "conflicts": "Cần xem lại thủ công",
        "judgements": "So sánh từng cặp"
      }
    },
    "compareMetadata": {
      "title": "Metadata so sánh nâng cao",
      "insights": "Phát hiện chính",
      "decision": {
        "title": "Quyết định so sánh",
        "keyEvidence": "Bằng chứng chính",
        "nextActions": "Bước tiếp theo",
        "headlines": {
          "continue": "Mục tiêu tối ưu đang đi đúng hướng nhưng vẫn còn dư địa cải thiện có thể hành động.",
          "stop": "Kết quả hiện tại có vẻ gần hội tụ; viết lại tự động thêm nữa khó giúp ích nhiều.",
          "review": "Kết quả so sánh hiện tại cần xem lại thủ công trước khi chấp nhận viết lại.",
          "regressed": "Mục tiêu tối ưu có vẻ đã thụt lùi so với phiên bản trước; không nên chấp nhận bản viết lại này trực tiếp."
        },
        "actions": {
          "inspectRegression": "Xem phiên bản mới đã bỏ hoặc làm yếu điều gì trước khi viết lại.",
          "reviewBeforeRewrite": "Xem lại bằng chứng mâu thuẫn trước rồi mới quyết định viết lại hay giữ phiên bản hiện tại.",
          "reviewPromptValidity": "Kiểm tra thay đổi prompt có thực sự áp dụng được không, vì bằng chứng phía mẫu tham chiếu hiện không ủng hộ nó.",
          "learnFromReference": "Học cấu trúc mạnh hơn ở phía mẫu tham chiếu trước vòng viết lại tiếp theo.",
          "filterOverfit": "Lọc bỏ các quy tắc chỉ đúng với mẫu cụ thể và chỉ giữ hướng dẫn dùng lại được.",
          "continueTargetedRewrite": "Nếu tiếp tục viết lại, chỉ tập trung vào khoảng cách có tín hiệu cao nhất thay vì sửa rộng.",
          "acceptCurrent": "Xem workspace hiện tại là gần hội tụ và tránh thêm quy tắc mới trừ khi có bằng chứng mới.",
          "verifyStability": "Kiểm tra lại độ ổn định bằng một đầu vào chung khác nếu đánh giá hiện tại vẫn còn ở mức ranh giới."
        }
      },
      "focusSummaries": "Phát hiện theo trọng tâm",
      "mode": "Chế độ so sánh",
      "roles": "Các cột được so sánh",
      "judgements": "So sánh từng cặp",
      "pairHighlights": "Điểm nổi bật từng cặp",
      "progressSummary": "So với phiên bản trước",
      "referenceGapSummary": "So với mẫu tham chiếu",
      "promptChangeSummary": "Tính hợp lệ của thay đổi Prompt",
      "stabilitySummary": "Độ ổn định",
      "stopSignals": "Tín hiệu rủi ro và hội tụ",
      "evidence": "Bằng chứng",
      "evidenceHighlights": "Điểm nổi bật bằng chứng",
      "learnableSignals": "Tín hiệu học được",
      "overfitWarnings": "Cảnh báo quá khớp",
      "conflictSignals": "Cần xem lại thủ công",
      "targetVsBaseline": "Mục tiêu tối ưu với Mốc đối chiếu",
      "targetVsReferenceGap": "Mục tiêu tối ưu với Khoảng cách mẫu tham chiếu",
      "improvementHeadroom": "Dư địa cải thiện",
      "overfitRisk": "Rủi ro quá khớp",
      "stopRecommendation": "Khuyến nghị",
      "stopReasons": "Tín hiệu lý giải",
      "modeValues": {
        "structured": "So sánh thông minh",
        "generic": "So sánh chuẩn"
      },
      "roleValues": {
        "target": "Mục tiêu tối ưu",
        "baseline": "Mốc đối chiếu",
        "reference": "Mẫu tham chiếu",
        "referenceBaseline": "Mốc của mẫu",
        "replica": "Chạy lại",
        "auxiliary": "Test khác"
      },
      "verdictValues": {
        "left-better": "Bên trái tốt hơn",
        "right-better": "Bên phải tốt hơn",
        "mixed": "Lẫn lộn",
        "similar": "Tương tự"
      },
      "confidenceValues": {
        "low": "Độ tin cậy thấp",
        "medium": "Độ tin cậy trung bình",
        "high": "Độ tin cậy cao"
      },
      "conflictSignalValues": {
        "improvementNotSupportedOnReference": "Mục tiêu tối ưu đã cải thiện hơn phiên bản trước nhưng cùng thay đổi prompt đó không được ủng hộ ở phía mẫu tham chiếu.",
        "improvementUnstableAcrossReplicas": "Mục tiêu đã cải thiện nhưng bằng chứng kiểm tra độ ổn định cho thấy mức cải thiện có thể không ổn định.",
        "regressionOutweighsCosmeticGains": "Sự thụt lùi so với phiên bản trước nên được coi trọng hơn các cải thiện bề ngoài khác.",
        "sampleOverfitRiskVisible": "Cải thiện dùng lại được và cải thiện do khớp mẫu cùng tồn tại nên kết luận an toàn hơn là giữ rủi ro quá khớp ở mức nhìn thấy được."
      },
      "signalValues": {
        "targetVsBaseline": {
          "improved": "Đã cải thiện",
          "flat": "Gần như không đổi",
          "regressed": "Đã thụt lùi"
        },
        "targetVsReferenceGap": {
          "none": "Khoảng cách rất nhỏ",
          "minor": "Vẫn còn khoảng cách",
          "major": "Khoảng cách rõ rệt"
        },
        "improvementHeadroom": {
          "none": "Gần như không còn",
          "low": "Thấp",
          "medium": "Vừa",
          "high": "Cao"
        },
        "overfitRisk": {
          "low": "Thấp",
          "medium": "Vừa",
          "high": "Cao"
        },
        "stopRecommendation": {
          "continue": "Tiếp tục lặp lại",
          "stop": "Tạm dừng",
          "review": "Cần xem lại"
        }
      }
    },
    "level": {
      "excellent": "Xuất sắc",
      "good": "Tốt",
      "acceptable": "Chấp nhận được",
      "poor": "Kém",
      "veryPoor": "Rất kém"
    },
    "dimension": {
      "goalAchievement": "Đạt mục tiêu",
      "outputQuality": "Chất lượng đầu ra",
      "formatCompliance": "Tuân thủ định dạng",
      "relevance": "Mức liên quan"
    },
    "optimizedBetter": "Phiên bản đã tối ưu tốt hơn",
    "originalBetter": "Phiên bản gốc tốt hơn",
    "syntheticInput": {
      "noExplicitText": "Không có đầu vào kiểm thử bổ sung; đầu ra được tạo trực tiếp từ prompt hiện tại.",
      "noExplicitVariables": "Không có đầu vào biến bổ sung."
    },
    "error": {
      "title": "Đánh giá thất bại",
      "serviceNotReady": "Dịch vụ đánh giá chưa sẵn sàng, vui lòng thử lại sau",
      "failed": "Đánh giá thất bại: {error}",
      "noOptimizedPrompt": "Không có prompt để tối ưu"
    },
    "designContext": {
      "basic": "Ngữ cảnh thiết kế",
      "advanced": "Ngữ cảnh thiết kế"
    },
    "variableExtraction": {
      "extractButton": "Tự trích xuất biến",
      "extracting": "Đang trích xuất...",
      "dialogTitle": "Kết quả trích xuất tự động",
      "variableName": "Tên biến",
      "variableValue": "Giá trị biến",
      "reason": "Lý do",
      "category": "Danh mục",
      "selected": "Đã chọn",
      "batchCreate": "Tạo hàng loạt",
      "noVariables": "Không xác định được biến nào có thể trích xuất",
      "extractFailed": "Trích xuất tự động thất bại",
      "staleResult": "Prompt hoặc biến đã thay đổi. Vui lòng trích xuất lại.",
      "createSuccess": "Đã tạo thành công {count} biến",
      "summary": "Tóm tắt",
      "workspaceNotReady": "Không truy cập được trạng thái workspace",
      "noPromptContent": "Vui lòng nhập nội dung prompt trước",
      "noEvaluationModel": "Vui lòng chọn model đánh giá trước",
      "serviceNotReady": "Dịch vụ trích xuất biến chưa sẵn sàng",
      "invalidVariableNames": "Tên biến không hợp lệ (không bắt đầu bằng số hoặc # / ^ ! > &; không có khoảng trắng/dấu ngoặc; tối đa {max} ký tự): {names}"
    },
    "diagnose": {
      "title": "Phân tích chẩn đoán",
      "confidence": "Độ tin cậy",
      "findings": "Phát hiện",
      "patchPlan": "Kế hoạch vá",
      "noFindings": "Không tìm thấy vấn đề",
      "noPatchPlan": "Không có kế hoạch vá",
      "applyFix": "Áp dụng bản sửa",
      "replaceNow": "Thay ngay",
      "invariantsWarning": "Bị giới hạn bởi bất biến",
      "changeBudgetWarning": "Bị giới hạn bởi ngân sách thay đổi",
      "status": {
        "ok": "Chẩn đoán OK",
        "degraded": "Suy giảm một phần",
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
        "section": "Mục",
        "pattern": "Mẫu"
      },
      "operation": {
        "insert": "Chèn",
        "replace": "Thay thế",
        "delete": "Xóa"
      },
      "anchorPosition": {
        "before": "Trước",
        "after": "Sau",
        "replace": "Thay thế"
      },
      "invariantsRisks": "Rủi ro bất biến"
    }
  }
} as const;

export default messages;
