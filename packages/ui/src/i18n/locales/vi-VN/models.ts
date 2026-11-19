const messages = {
  localParameters: { reasoning: 'Mức độ suy luận', default: 'Mặc định', defaultWithValue: 'Mặc định ({value})', effort: { none: 'Tắt', minimal: 'Tối thiểu', low: 'Thấp', medium: 'Trung bình', high: 'Cao', xhigh: 'Rất cao', max: 'Tối đa' }, title: 'Tham số mô hình', thinking: 'Suy luận (Thinking)', more: 'Tham số', moreOptions: 'Tham số khác…', reset: 'Đặt lại mặc định', resetParameter: 'Dùng giá trị kế thừa', inherit: 'Theo cấu hình ({value})', automatic: 'Tự động' },
  localDiscovery: {
    cliproxyapiApiKeyHint: 'Nếu CLIProxyAPI yêu cầu xác thực, hãy nhập khóa API máy khách (không dùng khóa quản trị)',
    apiKeyHint: 'Nhập API Key nếu tính năng xác thực được bật cho {name}',
    magpieApiKeyHint: 'Nhập khóa cổng Magpie (gateway key) để tải danh sách mô hình',
    downloadable: ' · Cần tải xuống',
    downloading: ' · Đang tải xuống',
    "found": "Đã phát hiện:",
    "create": "Tạo nhà cung cấp {name}"
  },
  networkSettings: {
    title: 'Cài đặt mạng',
    description: 'Thiết lập phương thức kết nối cho mô hình văn bản và hình ảnh, bao gồm dò tìm mô hình, kiểm tra kết nối và sinh kết quả.',
    mode: 'Chế độ kết nối', system: 'Dùng cài đặt hệ thống (mặc định)', direct: 'Kết nối trực tiếp', manual: 'Proxy thủ công',
    proxyUrl: 'Địa chỉ HTTP Proxy',
    proxyHint: 'Ví dụ: http://127.0.0.1:7890. Phiên bản này hỗ trợ HTTP proxy không yêu cầu xác thực.',
    advanced: 'Tùy chọn nâng cao', bypassRules: 'Địa chỉ kết nối trực tiếp (bỏ qua proxy)',
    bypassPlaceholder: 'llm.company.com\n*.company.com',
    bypassHint: 'Mỗi dòng một tên miền, tối đa 100 dòng. Dùng *.company.com cho tên miền phụ. Các máy chủ khớp quy tắc sẽ kết nối trực tiếp; địa chỉ nội bộ (localhost/LAN) mặc định bỏ qua proxy.',
    activeMode: 'Đang áp dụng: {mode}',
    localOnly: 'Chỉ áp dụng cho yêu cầu gọi mô hình trên ứng dụng máy tính này. Tải bản cập nhật và sao lưu đám mây không bị ảnh hưởng. Không bao gồm trong tệp sao lưu mô hình. Khởi động lại sau khi lưu để áp dụng.',
    pendingRestart: 'Đã lưu cài đặt. Hãy khởi động lại ứng dụng để áp dụng. Các kết nối hiện tại vẫn dùng cài đặt cũ.',
    restartLater: 'Khởi động lại sau', restartNow: 'Khởi động lại ngay',
    restartConfirm: 'Khởi động lại ứng dụng để áp dụng cài đặt mạng. Hãy hoàn tất chỉnh sửa hiện tại trước. Không thể khởi động lại khi đang chạy yêu cầu mô hình.',
    lastTest: 'Lần kiểm tra kết nối gần nhất: {route}',
    routes: { direct: 'Trực tiếp', 'system-proxy': 'Proxy hệ thống', 'manual-proxy': 'Proxy thủ công', none: 'Chưa có yêu cầu mạng' },
    errors: {
      invalidMode: 'Vui lòng chọn chế độ kết nối hợp lệ.',
      invalidProxy: 'Vui lòng nhập địa chỉ HTTP proxy hợp lệ (không kèm thông tin đăng nhập, đường dẫn hay tham số truy vấn).',
      invalidRules: 'Nhập một tên miền hoặc *.domain trên mỗi dòng, tối đa 100 quy tắc.',
      loadFailed: 'Không thể tải cài đặt mạng. Hãy đóng hộp thoại này và thử lại.', saveFailed: 'Không thể lưu cài đặt mạng. Vui lòng thử lại.',
      restartFailed: 'Không thể tự khởi động lại. Vui lòng đóng và mở lại ứng dụng thủ công.',
      busy: 'Đang có yêu cầu mô hình đang chạy. Vui lòng đợi hoàn tất trước khi khởi động lại.', restarting: 'Ứng dụng đang khởi động lại. Vui lòng thử lại sau.',
      unsupportedSystemProxy: 'Hệ thống trả về loại proxy không được hỗ trợ. Hãy dùng HTTP proxy hoặc kiểm tra lại cài đặt proxy hệ thống.',
    },
  },
  "modelManager": {
    localProviderHelp: {
      serviceTitle: 'Trợ giúp kết nối {name}',
      services: {
        cliproxyapi: {
          setup: 'Cấu hình tài khoản hoặc nhà cung cấp thượng nguồn trong CLIProxyAPI trước. Máy chủ đang chạy không đồng nghĩa đã có sẵn mô hình gọi được.',
          auth: 'Nhập khóa API máy khách được CLIProxyAPI chấp nhận: access.api-keys ở cấu hình mới hoặc api-keys ở cấu hình cũ. Không dùng khóa quản trị hoặc khóa tài khoản thượng nguồn. Để trống nếu tắt xác thực máy khách.',
          web: 'Chọn đầy đủ ID mô hình do danh mục trả về, bao gồm cả tiền tố. Nếu truy cập từ trình duyệt thất bại, hãy kiểm tra cấu hình CORS trên máy chủ hoặc reverse proxy; thêm API key không khắc phục được lỗi CORS.',
        },
        litellm: {
          setup: 'Kết nối tới cổng LiteLLM Proxy và sử dụng tên hoặc bí danh mô hình đã cấu hình. Chỉ cài thư viện LiteLLM đơn thuần sẽ không tự khởi chạy cổng proxy.',
          auth: 'Nếu bật xác thực, hãy nhập LiteLLM Virtual Key do quản trị viên cấp. Khóa của nhà cung cấp thượng nguồn được khai báo ở tầng gateway. Để trống nếu tắt xác thực.',
          web: 'Quyền truy cập mô hình phụ thuộc vào quyền của khóa và định tuyến trên gateway. Nếu truy cập từ Web thất bại, hãy kiểm tra xem gateway và reverse proxy đã cho phép origin của trang này chưa.',
        },
        llamacpp: {
          setup: 'Chạy llama-server với một mô hình hỗ trợ trò chuyện (chat). Chương trình dòng lệnh llama-cli không tự mở giao diện API này.',
          auth: 'Mặc định không cần API key. Nếu máy chủ đặt khóa qua --api-key, --api-key-file hoặc biến môi trường, hãy nhập giá trị tương ứng.',
          web: 'Đợi mô hình nạp xong trước khi tải danh mục. Nếu CORS chặn trang, hãy kiểm tra tham số --cors-origins. Một số chế độ công cụ/Agent giới hạn origin mặc định ở localhost.',
        },
      },
      magpieHint: 'Kết nối tới cổng Magpie cục bộ. Truy cập từ trình duyệt Web yêu cầu khóa gateway hợp lệ; mở phần trợ giúp bên dưới ô API Key để tạo khóa.',
      ollamaHint: 'Kết nối tới Ollama cục bộ. Mặc định không cần API key. Hãy khởi chạy Ollama và tải mô hình trước khi lấy danh sách mô hình.',
      magpieKeyPlaceholder: 'Chỉ nhập khóa cổng Magpie (không thêm tiền tố Bearer)',
      ollamaKeyPlaceholder: 'Mặc định không bắt buộc đối với Ollama cục bộ',
      magpieTitle: 'Làm sao để lấy khóa gateway?', ollamaTitle: 'Trợ giúp API Key và kết nối từ trình duyệt Web',
      system: 'Hệ điều hành', powershell: 'Chạy trong PowerShell:', terminal: 'Chạy trong Terminal:',
      copyCommand: 'Sao chép lệnh', copyFailed: 'Không thể sao chép tự động. Vui lòng bôi đen và sao chép lệnh thủ công.',
      magpieIntro: 'Lệnh này tạo một khóa gateway mới tên là Prompt Optimizer và in toàn bộ giá trị khóa ra màn hình (không truy xuất khóa cũ).',
      magpieAfter: 'Dán toàn bộ chuỗi sk-magpie-key-… vào ô API Key rồi tải danh sách mô hình. Không thêm chữ Bearer. Chuỗi giữ chỗ magpie không thể xác thực yêu cầu từ trình duyệt.',
      windowsPath: 'Sử dụng đường dẫn cài đặt mặc định trên Windows. Nếu bạn cài ở thư mục khác, hãy thay bằng đường dẫn thực tế tới magpie-cli.exe.',
      unixPath: 'Cần cài đặt Magpie và đảm bảo lệnh magpie gọi được trong terminal. Nếu không tìm thấy lệnh, hãy dùng đường dẫn thực thi đầy đủ.',
      magpieCors: 'Để truy cập từ trình duyệt Web, hãy thêm origin của trang này vào danh sách web origins được phép của Magpie. Truy cập nội bộ trên cùng máy không cần bật chia sẻ LAN.',
      ollamaAuth: 'Ollama cục bộ mặc định không cần khóa; hãy để trống. Nếu bạn đi qua reverse proxy có xác thực, hãy nhập khóa do proxy đó yêu cầu.',
      ollamaCors: 'Ollama mặc định cho phép các origin nội bộ như localhost và 127.0.0.1. Nếu trang trực tuyến bị chặn bởi CORS, hãy thêm origin của trang vào biến môi trường OLLAMA_ORIGINS, giữ lại các mục hiện có và khởi động lại Ollama. Nhập đầy đủ giao thức, tên miền và cổng (không kèm đường dẫn). API key không giải quyết được lỗi CORS.',
      currentOrigin: 'Origin của trang hiện tại:', docs: 'Tài liệu chính thức',
    },
    "title": "Quản lý mô hình",
    "textModels": "Mô hình văn bản",
    "imageModels": "Mô hình hình ảnh",
    "functionModels": "Mô hình chức năng",
    "modelList": "Danh sách mô hình",
    "testConnection": "Kiểm tra kết nối",
    "editModel": "Sửa",
    "deleteModel": "Xóa",
    "displayName": "Tên hiển thị",
    "enabled": "Đã bật",
    "enabledStatus": "Trạng thái bật",
    "modelKey": "Khóa định danh (Model Key)",
    "apiUrl": "Địa chỉ API (API URL)",
    "apiUrlHint": "Ví dụ: https://api.example.com/v1; hầu hết nhà cung cấp dùng đường dẫn kết thúc bằng /v1",
    "apiUrlHintAriaLabel": "Xem trợ giúp địa chỉ API URL",
    "defaultModel": "Mô hình mặc định",
    "clickToFetchModels": "Nhấn mũi tên để tải danh sách mô hình",
    "apiKey": "API Key",
    "getApiKey": "Lấy API Key",
    "addModel": "Thêm",
    "addImageModel": "Thêm mô hình ảnh",
    "provider": {
      "section": "Cấu hình nhà cung cấp",
      "label": "Nhà cung cấp",
      "placeholder": "Chọn nhà cung cấp",
      "more": "Khác",
      "openaiCompatibleCustomLabel": "Tương thích OpenAI (Tùy chỉnh)",
      "openaiHint": "Đây là API chính thức của OpenAI. Nếu bạn muốn dùng địa chỉ Base URL tùy chỉnh, dịch vụ bên thứ ba tương thích OpenAI hoặc mô hình cục bộ, hãy chọn \"Tương thích OpenAI (Tùy chỉnh)\".",
      "customApiHint": "Dùng cho các điểm cuối tùy chỉnh tương thích chuẩn OpenAI. Bạn có thể cấu hình Base URL, nhập tên mô hình riêng và chọn kiểu giao thức Chat Completions hoặc Responses.",
      "dashscopeHint": "DashScope hỗ trợ cả hai chuẩn tương thích OpenAI là Chat Completions và Responses API. Bạn có thể chuyển đổi kiểu yêu cầu trực tiếp tại đây.",
      "xiaomiMimoHint": "Mặc định dùng điểm cuối Xiaomi MiMo Token Plan Trung Quốc: https://token-plan-cn.xiaomimimo.com/v1. Bạn có thể đổi sang điểm cuối Singapore https://token-plan-sgp.xiaomimimo.com/v1 hoặc Amsterdam https://token-plan-ams.xiaomimimo.com/v1 hiển thị trong Quản lý thuê bao. Biến môi trường dùng tiền tố VITE_MIMO_TOKEN_PLAN_*.",
      "minimaxHint": "Điểm cuối mặc định là API MiniMax quốc tế tương thích chuẩn OpenAI. Người dùng tại Trung Quốc đại lục nên đặt API URL thành https://api.minimaxi.com/v1. Không sử dụng điểm cuối MiniMax định dạng Anthropic tại đây.",
      "chromeBuiltInHint": "Sử dụng trực tiếp Gemini Nano tích hợp trong trình duyệt Chrome hiện tại mà không cần API URL hay API Key. Lần đầu sử dụng có thể cần nhấn Tải xuống. Ngôn ngữ hỗ trợ và yêu cầu phần cứng phụ thuộc vào phiên bản Chrome."
    },
    "chromeBuiltIn": {
      "downloadAction": "Tải xuống / chuẩn bị mô hình cục bộ",
      "recheckAction": "Kiểm tra lại",
      "preparing": "Đang chuẩn bị mô hình cục bộ trên Chrome...",
      "ready": "Mô hình cục bộ trên Chrome đã sẵn sàng",
      "prepareFailed": "Chuẩn bị mô hình cục bộ trên Chrome thất bại: {error}",
      "statusWithError": "{status} ({error})",
      "title": {
        "checking": "Đang kiểm tra AI tích hợp trong Chrome",
        "available": "AI tích hợp trong Chrome đã sẵn sàng",
        "downloadable": "Cần tải xuống mô hình cục bộ cho Chrome",
        "downloading": "Chrome đang tải mô hình cục bộ",
        "unavailable": "Môi trường hiện tại không được hỗ trợ",
        "api-missing": "Trình duyệt này không mở giao diện Chrome Prompt API"
      },
      "status": {
        "checking": "Đang kiểm tra xem trình duyệt có hỗ trợ Prompt API và mô hình cục bộ đã sẵn sàng hay chưa.",
        "available": "Sẵn sàng sử dụng mà không cần API URL hay API Key. Khả năng ngôn ngữ phụ thuộc vào phiên bản Chrome hiện tại.",
        "downloadable": "Trình duyệt Chrome của bạn hỗ trợ tính năng này nhưng chưa tải mô hình cục bộ. Chrome chỉ bắt đầu tải khi bạn nhấn nút bên dưới.",
        "downloading": "Chrome đang tải mô hình xuống. Quá trình này có thể mất vài phút; sau khi hoàn tất, bạn có thể kiểm thử hoặc lưu cấu hình này.",
        "unavailable": "Trình duyệt, thiết bị, hồ sơ người dùng hoặc chính sách quản trị hiện tại không hỗ trợ tính năng này. Bạn vẫn có thể cấu hình nhà cung cấp mô hình văn bản khác.",
        "api-missing": "Hãy mở ứng dụng Web trên trình duyệt Chrome máy tính có hỗ trợ Prompt API qua giao thức HTTPS hoặc địa chỉ localhost. Ứng dụng Desktop không thể mượn AI từ trình duyệt Chrome cài rời bên ngoài."
      }
    },
    "connection": {
      "accountId": "Account ID",
      "requestStyle": "Kiểu giao thức (Request Style)",
      "requestStyleOptions": {
        "chatCompletions": "Chat Completions",
        "responses": "Responses"
      }
    },
    "customHeaders": {
      "label": "Header yêu cầu tùy chỉnh (Custom Headers)",
      "namePlaceholder": "Tên header, VD: x-auth-token",
      "valuePlaceholder": "Giá trị header",
      "add": "Thêm Header",
      "validationError": "Header yêu cầu tùy chỉnh không hợp lệ: {details}",
      "validation": {
        "invalid-name": "Tên header không hợp lệ",
        "forbidden-name": "Header này do trình duyệt hoặc hệ thống quản lý và không thể ghi đè",
        "missing-value": "Giá trị header là bắt buộc",
        "invalid-value": "Giá trị header phải là chuỗi văn bản, số hoặc giá trị logic (boolean)"
      }
    },
    "model": {
      "section": "Cấu hình mô hình"
    },
    "advancedParameters": {
      "title": "Tham số nâng cao",
      "noParamsConfigured": "Chưa cấu hình tham số nâng cao nào",
      "customParam": "Tùy chỉnh",
      "advancedTag": "Nâng cao",
      "add": "Thêm tham số",
      "select": "Chọn một tham số",
      "selectTitle": "Thêm tham số nâng cao",
      "custom": "Tham số tùy chỉnh",
      "customKeyPlaceholder": "Nhập tên tham số",
      "customValuePlaceholder": "Nhập giá trị tham số",
      "stopSequencesPlaceholder": "Nhập các chuỗi dừng (phân tách bằng dấu phẩy)",
      "unitLabel": "Đơn vị",
      "currentProvider": "Nhà cung cấp hiện tại",
      "customProvider": "Tùy chỉnh",
      "availableParams": "tham số khả dụng",
      "noAvailableParams": "không có tham số khả dụng",
      "validation": {
        "unknownParam": "Không tìm thấy định nghĩa tham số",
        "customKeyRequired": "Tên tham số là bắt buộc",
        "customValueRequired": "Giá trị tham số là bắt buộc",
        "duplicateParam": "Tham số này đã tồn tại",
        "dangerousParam": "Tham số này tiềm ẩn rủi ro bảo mật và không được phép sử dụng",
        "invalidNumber": "Phải là một số hợp lệ",
        "belowMin": "Giá trị không được nhỏ hơn {min}",
        "aboveMax": "Giá trị không được lớn hơn {max}",
        "mustBeInteger": "Phải là số nguyên"
      },
      "formatJson": "JSON",
      "formatString": "Chuỗi (String)",
      "parsedAsObject": "Đã phân tích thành Object ✓",
      "invalidJson": "JSON không hợp lệ, sẽ được gửi dưới dạng chuỗi"
    },
    "modelKeyPlaceholder": "Nhập khóa định danh mô hình",
    "displayNamePlaceholder": "Nhập tên hiển thị",
    "apiUrlPlaceholder": "https://api.example.com/v1",
    "defaultModelPlaceholder": "Nhập hoặc chọn tên mô hình",
    "apiKeyPlaceholder": "Nhập API Key (tùy chọn)",
    "modelKeyRequired": "Khóa định danh mô hình là bắt buộc",
    "modelKeyReserved": "Khóa mô hình \"{id}\" trùng với mô hình tích hợp sẵn. Vui lòng chọn khóa khác hoặc chỉnh sửa trực tiếp cấu hình tích hợp sẵn.",
    "modelKeyAlreadyExists": "Khóa mô hình \"{id}\" đã tồn tại. Vui lòng chọn khóa khác.",
    "modelIdGenerateFailed": "Không thể tạo ID mô hình duy nhất. Vui lòng thử lại.",
    "deleteConfirm": "Bạn có chắc chắn muốn xóa mô hình này không? Thao tác này không thể hoàn tác.",
    "testing": "Đang kiểm tra kết nối...",
    "testSuccess": "Kết nối tới {provider} thành công!",
    "testFailed": "Kết nối tới {provider} thất bại: {error}",
    "updateSuccess": "Cập nhật thành công",
    "updateFailed": "Cập nhật thất bại: {error}",
    "addSuccess": "Đã thêm mô hình thành công",
    "addFailed": "Thêm mô hình thất bại: {error}",
    "createSuccess": "Đã tạo mô hình thành công",
    "createFailed": "Tạo mô hình thất bại: {error}",
    "enableSuccess": "Đã bật mô hình",
    "enableFailed": "Bật mô hình thất bại: {error}",
    "disableSuccess": "Đã tắt mô hình",
    "disableFailed": "Tắt mô hình thất bại: {error}",
    "cloneModel": "Nhân bản",
    "cloneSuccess": "Đã nhân bản mô hình",
    "cloneFailed": "Nhân bản mô hình thất bại",
    "deleteSuccess": "Đã xóa mô hình",
    "deleteFailed": "Xóa mô hình thất bại: {error}",
    "toggleFailed": "Chuyển trạng thái thất bại: {error}",
    "fetchModelsSuccess": "Đã lấy thành công 1 mô hình | Đã lấy thành công {count} mô hình",
    "loadingModels": "Đang tải danh sách mô hình...",
    "noModelsAvailable": "Không có mô hình nào khả dụng",
    "selectModel": "Chọn một mô hình",
    "fetchModelsFailed": "Lấy danh sách mô hình thất bại: {error}",
    "fetchModelsFallback": "Lấy danh sách mô hình thất bại: {error} (đã chuyển về {count} mô hình mặc định)",
    "needApiKeyAndBaseUrl": "Vui lòng điền API Key và địa chỉ Base URL trước",
    "needBaseUrl": "Vui lòng điền địa chỉ API URL trước",
    "corsRestrictedTag": "Giới hạn CORS",
    "corsRestrictedConfirm": "{provider} có giới hạn bảo mật CORS trên trình duyệt nên kiểm tra kết nối trên bản Web có thể thất bại.\n\nĐiều này không có nghĩa API Key của bạn sai, mà do chính sách bảo mật của trình duyệt chặn yêu cầu trực tiếp.\nKhuyên dùng bản Desktop App hoặc đảm bảo nhà cung cấp này cho phép gọi trực tiếp từ trình duyệt.\n\nVẫn tiếp tục kiểm tra?",
    "errors": {
      "crossOriginConnectionFailed": "Kết nối liên miền (CORS) thất bại. Vui lòng kiểm tra kết nối mạng hoặc cấu hình CORS",
      "connectionFailed": "Kết nối thất bại. Vui lòng kiểm tra địa chỉ API và kết nối mạng",
      "missingV1Suffix": "Định dạng API URL chưa chuẩn. Các API tương thích OpenAI thường cần hậu tố \"/v1\"",
      "invalidResponseFormat": "Định dạng phản hồi API không tương thích. Vui lòng kiểm tra xem dịch vụ có hỗ trợ chuẩn OpenAI hay không",
      "emptyModelList": "API trả về danh sách mô hình trống. Dịch vụ này có thể chưa có mô hình khả dụng",
      "apiError": "Lỗi API: {error}"
    },
    "capabilities": {
      "tools": "Gọi công cụ (Tool Calling)",
      "reasoning": "Suy luận (Reasoning)",
      "vision": "Thị giác (Vision)"
    },
    "disabled": "Đã tắt",
    "testConnectionAriaLabel": "Kiểm tra kết nối tới {name}",
    "editModelAriaLabel": "Sửa mô hình {name}",
    "enableModelAriaLabel": "Bật mô hình {name}",
    "disableModelAriaLabel": "Tắt mô hình {name}",
    "deleteModelAriaLabel": "Xóa mô hình {name}",
    "displayNameAriaLabel": "Tên hiển thị của mô hình",
    "apiUrlAriaLabel": "Địa chỉ API URL của mô hình",
    "defaultModelAriaLabel": "Tên mô hình mặc định",
    "apiKeyAriaLabel": "Khóa API Key",
    "cancelEditAriaLabel": "Hủy sửa mô hình",
    "saveEditAriaLabel": "Lưu thay đổi mô hình",
    "cancelAddAriaLabel": "Hủy thêm mô hình",
    "confirmAddAriaLabel": "Xác nhận thêm mô hình"
  },
  "functionModel": {
    "evaluationModel": "Mô hình đánh giá (Evaluation Model)",
    "evaluationModelPlaceholder": "Mặc định: dùng mô hình tối ưu chung",
    "evaluationModelUnavailable": "Mô hình đánh giá đã cấu hình hiện đang tắt hoặc đã bị xóa. Hệ thống sẽ tự chọn mô hình khả dụng theo thứ tự mặc định.",
    "saveFailed": "Không thể lưu cài đặt mô hình chức năng. Vui lòng thử lại",
    "loadFailed": "Không thể tải cài đặt mô hình chức năng. Vui lòng thử lại",
    "evaluationModelHint": "Dùng để phân tích chất lượng prompt, chấm điểm kết quả, trích xuất và sinh giá trị biến. Mô hình chọn tại đây sẽ được ưu tiên cao nhất; nếu để trống sẽ dùng mô hình tối ưu chung hoặc mô hình kiểm thử.",
    "imageRecognitionModel": "Mô hình nhận diện ảnh (Vision Model)",
    "imageRecognitionModelHint": "Dùng để trích xuất prompt JSON và giá trị biến mặc định từ ảnh tham chiếu (cần cấu hình riêng một mô hình hỗ trợ Vision)",
    "imageRecognitionModelUnavailable": "Mô hình nhận diện ảnh đã cấu hình hiện đang tắt hoặc đã bị xóa. Hãy bật lại hoặc chọn mô hình khác.",
    "noImageRecognitionModel": "Vui lòng cấu hình Mô hình nhận diện ảnh trong mục Mô hình chức năng trước",
    "unsupportedImageRecognitionModel": "Mô hình nhận diện ảnh hiện tại không hỗ trợ trích xuất từ hình ảnh: {provider}"
  },
  "model": {
    "selector": {
      "textGeneration": "Tạo văn bản",
      "imageGeneration": "Tạo hình ảnh",
      "clear": "Xóa lựa chọn",
      "useCustom": "Dùng \"{model}\"",
      "followDefault": "Theo mô hình tối ưu mặc định",
      "choose": "Chọn cấu hình và mô hình",
      "search": "Tìm cấu hình hoặc tên mô hình",
      "configuration": "Cấu hình",
      "more": "Xem thêm mô hình ({count})",
      "back": "Tất cả cấu hình",
      "loading": "Đang tải danh sách mô hình…",
      "retry": "Không thể tải mô hình. Thử lại",
      "empty": "Không có mô hình phù hợp",
      "manage": "Quản lý cấu hình"
    },
    "select": {
      "placeholder": "Vui lòng chọn mô hình",
      "configure": "Cấu hình mô hình",
      "noModels": "Chưa có mô hình",
      "noAvailableModels": "Không có mô hình khả dụng"
    },
    "quickSwitch": {
      "title": "Chuyển nhanh mô hình hiện tại",
      "placeholder": "Chọn một mô hình",
      "modelTagTitle": "Nhấn để đổi mô hình cho cấu hình này",
      "fetchFailed": "Không thể tải danh sách mô hình trực tuyến: {error}. Bạn vẫn có thể chọn mô hình mặc định cục bộ.",
      "updateSuccess": "Đã chuyển sang {model}",
      "updateFailed": "Chuyển mô hình thất bại: {error}"
    },
    "manager": {
      "displayName": "VD: Mô hình tùy chỉnh",
      "apiUrl": "Địa chỉ API URL",
      "defaultModel": "Tên mô hình mặc định",
      "modelNamePlaceholder": "VD: gpt-4o-mini"
    }
  },
  "params": {
    "temperature": {
      "label": "Độ sáng tạo (Temperature)",
      "description": "Kiểm soát tính ngẫu nhiên: Giá trị thấp (VD: 0.2) giúp câu trả lời tập trung và nhất quán hơn; giá trị cao (VD: 0.8) giúp câu trả lời đa dạng và sáng tạo hơn."
    },
    "top_p": {
      "label": "Lấy mẫu hạt nhân (Top P)",
      "description": "Chỉ xét các token nằm trong nhóm có tổng xác suất tích lũy đạt P. Ví dụ: 0.1 nghĩa là chỉ xét 10% nhóm token có xác suất cao nhất."
    },
    "max_tokens": {
      "label": "Số token tối đa (Max Tokens)",
      "description": "Số lượng token tối đa được sinh ra trong một câu trả lời."
    },
    "presence_penalty": {
      "label": "Phạt lặp chủ đề (Presence Penalty)",
      "description": "Giá trị từ -2.0 đến 2.0. Giá trị dương phạt các token đã xuất hiện trong văn bản, khuyến khích mô hình mở rộng sang chủ đề mới."
    },
    "frequency_penalty": {
      "label": "Phạt tần suất lặp (Frequency Penalty)",
      "description": "Giá trị từ -2.0 đến 2.0. Giá trị dương phạt các token dựa trên số lần đã xuất hiện, giảm tình trạng lặp lại nguyên văn cùng một câu."
    },
    "timeout": {
      "label": "Thời gian chờ (Timeout ms)",
      "description_openai": "Thời gian chờ tối đa (tính bằng mili-giây) cho kết nối tới máy chủ OpenAI."
    },
    "maxOutputTokens": {
      "label": "Token đầu ra tối đa (Max Output Tokens)",
      "description": "Số lượng token tối đa mà mô hình có thể xuất ra trong một phản hồi."
    },
    "top_k": {
      "label": "Top K",
      "description": "Giới hạn lựa chọn token kế tiếp trong K token có xác suất cao nhất, giúp giảm sinh từ vô nghĩa."
    },
    "candidateCount": {
      "label": "Số phương án (Candidate Count)",
      "description": "Số lượng phương án phản hồi trả về (từ 1 đến 8)."
    },
    "stopSequences": {
      "label": "Chuỗi dừng (Stop Sequences)",
      "description": "Các chuỗi ký tự tùy chỉnh khiến mô hình dừng sinh văn bản ngay khi gặp phải (phân tách bằng dấu phẩy)."
    },
    "thinkingBudget": {
      "label": "Ngân sách suy luận (Thinking Budget)",
      "description": "Số token tối đa dành cho quá trình suy luận nội bộ của mô hình (chỉ hỗ trợ Gemini 2.5+, từ 1 đến 8192 token)."
    },
    "includeThoughts": {
      "label": "Hiển thị quá trình suy luận (Include Thoughts)",
      "description": "Có trả về các bước suy luận nội bộ của mô hình trong phản hồi hay không (chỉ hỗ trợ Gemini 2.5+)."
    },
    "reasoning_effort": {
      "label": "Nỗ lực suy luận (Reasoning Effort)",
      "description": "Điều chỉnh mức độ đầu tư suy luận cho các mô hình hỗ trợ chế độ Thinking."
    },
    "deepseek": {
      "thinking_type": {
        "label": "Chế độ suy luận (Thinking Mode)",
        "description": "Điều khiển chế độ suy luận của DeepSeek (gửi dưới dạng thinking.type trong yêu cầu API).",
        "disabled": "Đã tắt",
        "enabled": "Đã bật"
      }
    },
    "tokens": {
      "unit": "token"
    },
    "size": {
      "label": "Kích thước ảnh",
      "description": "Độ phân giải/kích thước của ảnh được tạo, VD: 1024x1024"
    },
    "quality": {
      "label": "Chất lượng ảnh",
      "description": "Mức chất lượng ảnh tạo ra: auto (tự động), high (cao), medium (trung bình), low (thấp)"
    },
    "background": {
      "label": "Độ trong suốt nền",
      "description": "Thiết lập nền ảnh: auto (tự động), transparent (trong suốt), opaque (đặc)"
    },
    "imageSize": {
      "label": "Kích thước ảnh",
      "description": "Độ phân giải/kích thước của ảnh được tạo, VD: 1024x1024"
    },
    "steps": {
      "label": "Số bước lấy mẫu (Steps)",
      "description": "Số bước khuếch tán/suy luận; nhiều bước hơn thường cho chất lượng tốt hơn nhưng tốn thời gian hơn"
    },
    "guidance": {
      "label": "Độ bám sát (Guidance Scale)",
      "description": "Mức độ bám sát nội dung prompt; giá trị cao hơn sẽ tuân thủ chặt hơn mô tả trong prompt"
    },
    "cfg": {
      "label": "Hệ số CFG (CFG Scale)",
      "description": "Hệ số Classifier-Free Guidance kiểm soát mức độ bám sát prompt (dành cho Qwen-Image)"
    },
    "negativePrompt": {
      "label": "Prompt phủ định (Negative Prompt)",
      "description": "Nội dung hoặc phong cách bạn không muốn xuất hiện trong ảnh"
    },
    "responseFormat": {
      "label": "Định dạng phản hồi",
      "description": "Định dạng trả về của ảnh (URL hoặc chuỗi Base64)"
    },
    "outputFormat": {
      "label": "Định dạng tệp ảnh",
      "description": "Định dạng tệp cho ảnh đầu ra (như PNG, JPEG hoặc WebP)"
    },
    "watermark": {
      "label": "Đóng dấu (Watermark)",
      "description": "Có gắn watermark vào ảnh được tạo hay không"
    },
    "sequentialGeneration": {
      "label": "Tạo ảnh tuần tự",
      "description": "Điều khiển chế độ tạo chuỗi ảnh liên tiếp (trên các mô hình hỗ trợ)"
    },
    "tools": {
      "label": "Công cụ mở rộng (Tools)",
      "description": "Danh sách công cụ mở rộng dòng 5.0, mỗi dòng một tên công cụ"
    },
    "seed": {
      "label": "Hạt giống (Seed)",
      "description": "Số ngẫu nhiên cố định để kiểm soát kết quả; cùng một seed sẽ cho ra kết quả tương đồng"
    },
    "enable_thinking": {
      "label": "Bật chế độ suy luận",
      "description": "Bật chế độ suy luận sâu cho các tác vụ phức tạp (chỉ trên mô hình hỗ trợ)"
    },
    "thinking_budget": {
      "label": "Ngân sách suy luận",
      "description": "Số token tối đa dành cho bước suy luận, giúp giới hạn độ dài suy nghĩ"
    },
    "enable_search": {
      "label": "Bật tìm kiếm web",
      "description": "Cho phép tra cứu thông tin thời gian thực trên internet (chỉ trên mô hình hỗ trợ)"
    },
    "max_completion_tokens": {
      "label": "Token hoàn thành tối đa (Max Completion Tokens)",
      "description": "Số lượng token tối đa sinh ra trong phần hoàn thành (khuyên dùng thay cho max_tokens, từ 1 đến 1.000.000)."
    },
    "logprobs": {
      "label": "Xác suất Log (Log Probabilities)",
      "description": "Có trả về xác suất log của từng token đầu ra hay không. Khi bật, bạn có thể xem mức độ tự tin của mô hình trên từng token."
    },
    "top_logprobs": {
      "label": "Số lượng Top Logprobs",
      "description": "Số lượng token có khả năng cao nhất kèm xác suất log tại mỗi vị trí (từ 0 đến 20, yêu cầu bật Log Probabilities trước)."
    },
    "n": {
      "label": "Số lượng phản hồi (n)",
      "description": "Số lượng phương án trả lời sinh ra cho mỗi đầu vào (từ 1 đến 128). Lưu ý: sinh nhiều kết quả sẽ tiêu tốn nhiều hạn mức token hơn."
    }
  }
} as const;

export default messages;
