const messages = {
  localParameters: { reasoning: 'Mức suy luận', default: 'Mặc định', defaultWithValue: 'Mặc định ({value})', effort: { none: 'Tắt', minimal: 'Tối thiểu', low: 'Thấp', medium: 'Vừa', high: 'Cao', xhigh: 'Rất cao', max: 'Tối đa' }, title: 'Tham số model', thinking: 'Suy luận', more: 'Tham số', moreOptions: 'Tham số khác…', reset: 'Đặt lại mặc định', resetParameter: 'Dùng giá trị kế thừa', inherit: 'Dùng cấu hình ({value})', automatic: 'Tự động' },
  localDiscovery: {
    cliproxyapiApiKeyHint: 'Nếu CLIProxyAPI yêu cầu xác thực, hãy nhập API key phía client (không phải key quản lý)',
    apiKeyHint: 'Nhập API key nếu {name} bật xác thực',
    magpieApiKeyHint: 'Nhập key gateway Magpie của bạn để lấy danh sách model',
    downloadable: ' · Cần tải xuống',
    downloading: ' · Đang tải xuống',
    "found": "Đã phát hiện:",
    "create": "Tạo nhà cung cấp {name}"
  },
  networkSettings: {
    title: 'Cài đặt mạng',
    description: 'Cài đặt cách model văn bản và model ảnh kết nối, gồm phát hiện model, kiểm tra kết nối và tạo nội dung.',
    mode: 'Chế độ kết nối', system: 'Dùng cài đặt hệ thống (mặc định)', direct: 'Kết nối trực tiếp', manual: 'Proxy thủ công',
    proxyUrl: 'Địa chỉ proxy HTTP',
    proxyHint: 'Ví dụ: http://127.0.0.1:7890. Phiên bản này hỗ trợ proxy HTTP không cần xác thực.',
    advanced: 'Tùy chọn nâng cao', bypassRules: 'Địa chỉ kết nối trực tiếp',
    bypassPlaceholder: 'llm.company.com\n*.company.com',
    bypassHint: 'Một hostname mỗi dòng, tối đa 100. Dùng *.company.com cho subdomain. Host khớp sẽ kết nối trực tiếp; địa chỉ IP cục bộ và IP riêng mặc định bỏ qua proxy.',
    activeMode: 'Đang dùng: {mode}',
    localOnly: 'Chỉ áp dụng cho yêu cầu model trên desktop này. Tải bản cập nhật và sao lưu đám mây không bị ảnh hưởng. Không nằm trong bản sao lưu model. Hãy khởi động lại sau khi lưu để áp dụng.',
    pendingRestart: 'Đã lưu cài đặt. Hãy khởi động lại ứng dụng để áp dụng. Kết nối vẫn đang dùng cài đặt cũ.',
    restartLater: 'Khởi động lại sau', restartNow: 'Khởi động lại ngay',
    restartConfirm: 'Khởi động lại ứng dụng để áp dụng cài đặt mạng. Hãy hoàn thành chỉnh sửa hiện tại trước. Không thể khởi động lại khi yêu cầu model đang chạy.',
    lastTest: 'Lần kiểm tra kết nối cuối: {route}',
    routes: { direct: 'Trực tiếp', 'system-proxy': 'Proxy hệ thống', 'manual-proxy': 'Proxy thủ công', none: 'Không có yêu cầu mạng' },
    errors: {
      invalidMode: 'Hãy chọn chế độ kết nối hợp lệ.',
      invalidProxy: 'Hãy nhập địa chỉ proxy HTTP hợp lệ, không kèm thông tin đăng nhập, đường dẫn hay tham số truy vấn.',
      invalidRules: 'Hãy nhập một hostname hoặc *.hostname mỗi dòng, tối đa 100 quy tắc.',
      loadFailed: 'Không tải được cài đặt mạng. Hãy đóng hộp thoại này và thử lại.', saveFailed: 'Không lưu được cài đặt mạng. Vui lòng thử lại.',
      restartFailed: 'Không khởi động lại được. Hãy đóng và mở lại ứng dụng thủ công.',
      busy: 'Một yêu cầu model đang chạy. Hãy đợi xong rồi mới khởi động lại.', restarting: 'Ứng dụng đang khởi động lại. Vui lòng thử lại sau.',
      unsupportedSystemProxy: 'Hệ thống trả về kiểu proxy không được hỗ trợ. Hãy dùng proxy HTTP hoặc kiểm tra cài đặt proxy hệ thống.',
    },
  },
  "modelManager": {
    localProviderHelp: {
      serviceTitle: 'Trợ giúp kết nối {name}',
      services: {
        cliproxyapi: {
          setup: 'Hãy cấu hình tài khoản hoặc nhà cung cấp upstream trong CLIProxyAPI trước. Máy chủ đang chạy không đảm bảo model gọi được.',
          auth: 'Nhập API key phía client mà CLIProxyAPI chấp nhận: access.api-keys ở cấu hình mới hơn, api-keys ở cấu hình cũ hơn. Không dùng key quản lý hay key tài khoản upstream. Để trống nếu đã tắt xác thực client.',
          web: 'Chọn ID model đầy đủ do catalog trả về, gồm cả tiền tố. Nếu truy cập web thất bại, hãy kiểm tra CORS ở máy chủ hoặc reverse proxy; thêm key không sửa được CORS.',
        },
        litellm: {
          setup: 'Kết nối tới gateway LiteLLM Proxy và dùng tên model hoặc alias đã cấu hình. Chỉ cài thư viện LiteLLM thì chưa khởi động gateway.',
          auth: 'Nếu đã bật xác thực, hãy nhập LiteLLM Virtual Key do quản trị viên cấp. Key của nhà cung cấp upstream thuộc về gateway. Để trống nếu đã tắt xác thực.',
          web: 'Quyền truy cập model phụ thuộc vào quyền của key và route của gateway. Nếu truy cập web thất bại, hãy kiểm tra gateway và reverse proxy có cho phép origin của trang này không.',
        },
        llamacpp: {
          setup: 'Chạy llama-server với model có khả năng chat. Chương trình dòng lệnh llama-cli không tự mở API này.',
          auth: 'Mặc định không cần API key. Nếu máy chủ đặt key bằng --api-key, --api-key-file hoặc biến môi trường, hãy nhập giá trị tương ứng.',
          web: 'Hãy đợi model tải xong rồi mới lấy catalog. Nếu CORS chặn trang, hãy kiểm tra --cors-origins. Một số chế độ tool/Agent giới hạn origin mặc định cho phép ở localhost.',
        },
      },
      magpieHint: 'Kết nối tới gateway Magpie cục bộ của bạn. Truy cập web cần key gateway hợp lệ; mở phần trợ giúp bên dưới API Key để tạo key.',
      ollamaHint: 'Kết nối tới Ollama cục bộ. Mặc định không cần API key. Hãy khởi động Ollama và tải một model trước khi lấy danh sách model.',
      magpieKeyPlaceholder: 'Chỉ key gateway Magpie (không có tiền tố Bearer)',
      ollamaKeyPlaceholder: 'Mặc định không cần cho Ollama cục bộ',
      magpieTitle: 'Làm sao lấy gateway key?', ollamaTitle: 'Trợ giúp API key và kết nối web',
      system: 'Hệ điều hành', powershell: 'Chạy trong PowerShell:', terminal: 'Chạy trong terminal:',
      copyCommand: 'Sao chép lệnh', copyFailed: 'Không sao chép được. Hãy chọn và sao chép lệnh thủ công.',
      magpieIntro: 'Lệnh này tạo một gateway key mới tên Prompt Optimizer và in ra toàn bộ giá trị của nó. Nó không lấy lại key hiện có.',
      magpieAfter: 'Dán toàn bộ giá trị sk-magpie-key-… vào API Key rồi lấy danh sách model. Không thêm Bearer. Placeholder magpie không xác thực được yêu cầu từ trình duyệt.',
      windowsPath: 'Dùng đường dẫn cài đặt mặc định trên Windows. Nếu bạn cài ở nơi khác, hãy thay bằng đường dẫn magpie-cli.exe thực tế.',
      unixPath: 'Magpie phải được cài đặt và lệnh magpie có sẵn trong terminal. Nếu không tìm thấy, hãy dùng đường dẫn thực thi thực tế.',
      magpieCors: 'Để truy cập web, hãy thêm origin của trang này vào danh sách origin web được phép của Magpie. Truy cập cục bộ không cần bật chia sẻ LAN.',
      ollamaAuth: 'Ollama cục bộ mặc định không cần key; cứ để trống. Nếu bạn dùng reverse proxy có xác thực, hãy nhập key mà proxy đó yêu cầu.',
      ollamaCors: 'Ollama mặc định cho phép các origin trang cục bộ như localhost và 127.0.0.1. Nếu trang online bị CORS chặn, hãy thêm origin của nó vào OLLAMA_ORIGINS, giữ nguyên các mục hiện có và khởi động lại Ollama. Ghi cả scheme, host và port, không kèm đường dẫn. API key không sửa được CORS.',
      currentOrigin: 'Origin trang hiện tại:', docs: 'Tài liệu chính thức',
    },
    "title": "Quản lý Model",
    "textModels": "Model văn bản",
    "imageModels": "Model ảnh",
    "functionModels": "Model chức năng",
    "modelList": "Danh sách Model",
    "testConnection": "Kiểm tra kết nối",
    "editModel": "Sửa",
    "deleteModel": "Xóa",
    "displayName": "Tên hiển thị",
    "enabled": "Đã bật",
    "enabledStatus": "Trạng thái bật",
    "modelKey": "Khóa Model",
    "apiUrl": "API URL",
    "apiUrlHint": "Ví dụ: https://api.example.com/v1; hầu hết nhà cung cấp dùng endpoint kết thúc bằng /v1",
    "apiUrlHintAriaLabel": "Hiện trợ giúp API URL",
    "defaultModel": "Model mặc định",
    "clickToFetchModels": "Nhấn vào mũi tên để lấy danh sách model",
    "apiKey": "API Key",
    "getApiKey": "Lấy API Key",
    "addModel": "Thêm",
    "addImageModel": "Thêm Model ảnh",
    "provider": {
      "section": "Cấu hình nhà cung cấp",
      "label": "Nhà cung cấp",
      "placeholder": "Chọn nhà cung cấp",
      "more": "Thêm",
      "openaiCompatibleCustomLabel": "Tương thích OpenAI (Tùy chỉnh)",
      "openaiHint": "Đây là API chính thức của OpenAI. Nếu bạn muốn dùng base URL tùy chỉnh, dịch vụ tương thích của bên thứ ba hoặc model cục bộ, hãy chọn \"Tương thích OpenAI (Tùy chỉnh)\".",
      "customApiHint": "Dùng cho endpoint tùy chỉnh tương thích OpenAI. Bạn có thể cấu hình base URL, dùng tên model của riêng mình và chọn Chat Completions hoặc Responses làm kiểu yêu cầu.",
      "dashscopeHint": "DashScope hỗ trợ cả Chat Completions và Responses API tương thích OpenAI. Bạn có thể chuyển kiểu yêu cầu ngay tại đây.",
      "xiaomiMimoHint": "Mặc định dùng endpoint Xiaomi MiMo Token Plan Trung Quốc: https://token-plan-cn.xiaomimimo.com/v1. Bạn có thể đổi sang endpoint Singapore https://token-plan-sgp.xiaomimimo.com/v1 hoặc Amsterdam https://token-plan-ams.xiaomimimo.com/v1 trong Quản lý gói đăng ký. Preset env dùng VITE_MIMO_TOKEN_PLAN_*.",
      "minimaxHint": "Endpoint mặc định là API toàn cầu tương thích OpenAI của MiniMax. Người dùng Trung Quốc đại lục nên đặt API URL thành https://api.minimaxi.com/v1. Không dùng endpoint MiniMax định dạng Anthropic tại đây.",
      "chromeBuiltInHint": "Dùng Gemini Nano trong trình duyệt hiện tại mà không cần API URL hay key. Lần đầu dùng có thể cần nhấn Tải xuống. Ngôn ngữ khả dụng và yêu cầu phần cứng phụ thuộc vào phiên bản Chrome. Ứng dụng hiện tạo phiên với khả năng tiếng Anh."
    },
    "chromeBuiltIn": {
      "downloadAction": "Tải xuống / chuẩn bị model cục bộ",
      "recheckAction": "Kiểm tra lại",
      "preparing": "Đang chuẩn bị model cục bộ của Chrome...",
      "ready": "Model cục bộ của Chrome đã sẵn sàng",
      "prepareFailed": "Chuẩn bị model cục bộ của Chrome thất bại: {error}",
      "statusWithError": "{status} ({error})",
      "title": {
        "checking": "Đang kiểm tra AI tích hợp sẵn của Chrome",
        "available": "AI tích hợp sẵn của Chrome đã sẵn sàng",
        "downloadable": "Model cục bộ của Chrome cần tải xuống",
        "downloading": "Chrome đang tải xuống model cục bộ",
        "unavailable": "Môi trường này không được hỗ trợ",
        "api-missing": "Trình duyệt này không có Chrome Prompt API"
      },
      "status": {
        "checking": "Đang kiểm tra trình duyệt này có Prompt API không và model cục bộ đã sẵn sàng chưa.",
        "available": "Sẵn sàng dùng mà không cần API URL hay key. Phiên hiện yêu cầu khả năng đầu ra tiếng Anh; ngôn ngữ khả dụng phụ thuộc vào phiên bản Chrome.",
        "downloadable": "Chrome của bạn hỗ trợ tính năng này nhưng model cục bộ chưa được tải xuống. Chrome chỉ tải xuống sau khi bạn nhấn nút bên dưới.",
        "downloading": "Chrome đang tải xuống model. Có thể mất một lúc; khi xong, bạn có thể kiểm tra hoặc lưu model này.",
        "unavailable": "Trình duyệt, thiết bị, hồ sơ người dùng hoặc chính sách quản lý này có thể không hỗ trợ tính năng. Bạn vẫn có thể cấu hình nhà cung cấp model văn bản khác.",
        "api-missing": "Hãy mở ứng dụng web trong Chrome trên máy tính có hỗ trợ Prompt API, dùng HTTPS hoặc địa chỉ localhost. Ứng dụng desktop không thể mượn AI từ trình duyệt Chrome đã cài. Hãy chọn model khác nếu trình duyệt hoặc thiết bị không được hỗ trợ."
      }
    },
    "connection": {
      "accountId": "ID tài khoản",
      "requestStyle": "Kiểu yêu cầu",
      "requestStyleOptions": {
        "chatCompletions": "Chat Completions",
        "responses": "Responses"
      }
    },
    "customHeaders": {
      "label": "Header yêu cầu tùy chỉnh",
      "namePlaceholder": "Tên header, ví dụ x-auth-token",
      "valuePlaceholder": "Giá trị header",
      "add": "Thêm Header",
      "validationError": "Header yêu cầu tùy chỉnh không hợp lệ: {details}",
      "validation": {
        "invalid-name": "Tên header không hợp lệ",
        "forbidden-name": "Header này do client hoặc trình duyệt quản lý nên không thể ghi đè",
        "missing-value": "Giá trị header là bắt buộc",
        "invalid-value": "Giá trị header phải là văn bản, số hoặc boolean"
      }
    },
    "model": {
      "section": "Cấu hình Model"
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
      "stopSequencesPlaceholder": "Nhập chuỗi dừng (phân tách bằng dấu phẩy)",
      "unitLabel": "Đơn vị",
      "currentProvider": "Nhà cung cấp hiện tại",
      "customProvider": "Tùy chỉnh",
      "availableParams": "tham số khả dụng",
      "noAvailableParams": "không có tham số khả dụng",
      "validation": {
        "unknownParam": "Không tìm thấy định nghĩa tham số",
        "customKeyRequired": "Tên tham số là bắt buộc",
        "customValueRequired": "Giá trị tham số là bắt buộc",
        "duplicateParam": "Tham số đã tồn tại",
        "dangerousParam": "Tham số này được coi là nguy hiểm và không được phép",
        "invalidNumber": "Phải là số hợp lệ",
        "belowMin": "Giá trị không được nhỏ hơn {min}",
        "aboveMax": "Giá trị không được lớn hơn {max}",
        "mustBeInteger": "Phải là số nguyên"
      },
      "formatJson": "JSON",
      "formatString": "Chuỗi",
      "parsedAsObject": "Đã phân tích thành Object ✓",
      "invalidJson": "JSON không hợp lệ, sẽ gửi dưới dạng chuỗi"
    },
    "modelKeyPlaceholder": "Nhập khóa model",
    "displayNamePlaceholder": "Nhập tên hiển thị",
    "apiUrlPlaceholder": "https://api.example.com/v1",
    "defaultModelPlaceholder": "Nhập hoặc chọn tên model",
    "apiKeyPlaceholder": "Nhập API key (không bắt buộc)",
    "modelKeyRequired": "Khóa model là bắt buộc",
    "modelKeyReserved": "Khóa model \"{id}\" trùng với model có sẵn. Vui lòng chọn khóa khác hoặc sửa cấu hình model có sẵn.",
    "modelKeyAlreadyExists": "Khóa model \"{id}\" đã tồn tại. Vui lòng chọn khóa khác.",
    "modelIdGenerateFailed": "Tạo ID model duy nhất thất bại. Vui lòng thử lại.",
    "deleteConfirm": "Bạn có chắc muốn xóa model này? Hành động này không thể hoàn tác.",
    "testing": "Đang kiểm tra kết nối...",
    "testSuccess": "Kết nối {provider} thành công!",
    "testFailed": "Kết nối {provider} thất bại: {error}",
    "updateSuccess": "Cập nhật thành công",
    "updateFailed": "Cập nhật thất bại: {error}",
    "addSuccess": "Đã thêm model thành công",
    "addFailed": "Thêm model thất bại: {error}",
    "createSuccess": "Đã tạo model thành công",
    "createFailed": "Tạo model thất bại: {error}",
    "enableSuccess": "Đã bật model",
    "enableFailed": "Bật model thất bại: {error}",
    "disableSuccess": "Đã tắt model",
    "disableFailed": "Tắt model thất bại: {error}",
    "cloneModel": "Nhân bản",
    "cloneSuccess": "Đã nhân bản model",
    "cloneFailed": "Nhân bản model thất bại",
    "deleteSuccess": "Đã xóa model",
    "deleteFailed": "Xóa model thất bại: {error}",
    "toggleFailed": "Chuyển đổi thất bại: {error}",
    "fetchModelsSuccess": "Đã lấy thành công 1 model | Đã lấy thành công {count} model",
    "loadingModels": "Đang tải lựa chọn model...",
    "noModelsAvailable": "Không có model nào",
    "selectModel": "Chọn một model",
    "fetchModelsFailed": "Lấy danh sách model thất bại: {error}",
    "fetchModelsFallback": "Lấy danh sách model thất bại: {error} (đã dùng {count} model mặc định)",
    "needApiKeyAndBaseUrl": "Vui lòng điền API key và base URL trước",
    "needBaseUrl": "Vui lòng điền API URL trước",
    "corsRestrictedTag": "Bị hạn chế CORS",
    "corsRestrictedConfirm": "{provider} bị hạn chế CORS trên trình duyệt nên kiểm tra kết nối có thể thất bại trên Web.\n\nĐiều này không có nghĩa API Key của bạn không hợp lệ, mà chính sách bảo mật của trình duyệt đã chặn yêu cầu.\nKhuyên dùng ứng dụng Desktop, hoặc đảm bảo nhà cung cấp này hỗ trợ truy cập trực tiếp từ trình duyệt.\n\nTiếp tục kiểm tra?",
    "errors": {
      "crossOriginConnectionFailed": "Kết nối cross-origin thất bại. Vui lòng kiểm tra kết nối mạng",
      "connectionFailed": "Kết nối thất bại. Vui lòng kiểm tra địa chỉ API và kết nối mạng",
      "missingV1Suffix": "Lỗi định dạng API URL. API tương thích OpenAI nên có hậu tố \"/v1\"",
      "invalidResponseFormat": "Định dạng phản hồi API không tương thích. Vui lòng kiểm tra dịch vụ API có dùng định dạng tương thích OpenAI không",
      "emptyModelList": "API trả về danh sách model trống. Dịch vụ này có thể không có model khả dụng",
      "apiError": "Lỗi API: {error}"
    },
    "capabilities": {
      "tools": "Gọi Tool",
      "reasoning": "Suy luận",
      "vision": "Nhìn ảnh"
    },
    "disabled": "Đã tắt",
    "testConnectionAriaLabel": "Kiểm tra kết nối tới {name}",
    "editModelAriaLabel": "Sửa model {name}",
    "enableModelAriaLabel": "Bật model {name}",
    "disableModelAriaLabel": "Tắt model {name}",
    "deleteModelAriaLabel": "Xóa model {name}",
    "displayNameAriaLabel": "Tên hiển thị của model",
    "apiUrlAriaLabel": "API URL của model",
    "defaultModelAriaLabel": "Tên model mặc định",
    "apiKeyAriaLabel": "API key",
    "cancelEditAriaLabel": "Hủy sửa model",
    "saveEditAriaLabel": "Lưu thay đổi model",
    "cancelAddAriaLabel": "Hủy thêm model",
    "confirmAddAriaLabel": "Xác nhận thêm model"
  },
  "functionModel": {
    "evaluationModel": "Model đánh giá",
    "evaluationModelPlaceholder": "Mặc định: dùng model tối ưu toàn cục",
    "evaluationModelUnavailable": "Model đánh giá đã cấu hình bị tắt hoặc đã xóa. Các model khả dụng sẽ được chọn theo thứ tự mặc định.",
    "saveFailed": "Không lưu được cài đặt model chức năng. Vui lòng thử lại",
    "loadFailed": "Không tải được cài đặt model chức năng. Vui lòng thử lại",
    "evaluationModelHint": "Dùng để phân tích chất lượng prompt, đánh giá kết quả và trích xuất/tạo biến. Model được chọn tại đây được ưu tiên. Nếu không, dùng model tối ưu toàn cục, nếu chưa chọn model tối ưu toàn cục thì dùng model kiểm thử.",
    "imageRecognitionModel": "Model nhận dạng ảnh",
    "imageRecognitionModelHint": "Dùng để trích xuất prompt JSON và giá trị mặc định của biến từ ảnh, cần cấu hình riêng",
    "imageRecognitionModelUnavailable": "Model nhận dạng ảnh đã cấu hình bị tắt hoặc đã xóa. Hãy bật nó hoặc chọn model khác.",
    "noImageRecognitionModel": "Vui lòng cấu hình model nhận dạng ảnh trong Model chức năng trước",
    "unsupportedImageRecognitionModel": "Model nhận dạng ảnh hiện tại không hỗ trợ trích xuất ảnh: {provider}"
  },
  "model": {
    "selector": {
      "textGeneration": "Tạo văn bản",
      "imageGeneration": "Tạo ảnh",
      "clear": "Xóa lựa chọn",
      "useCustom": "Dùng \"{model}\"",
      "followDefault": "Theo model tối ưu mặc định",
      "choose": "Chọn cấu hình và model",
      "search": "Tìm cấu hình hoặc model",
      "configuration": "Cấu hình",
      "more": "Thêm {count} model",
      "back": "Tất cả cấu hình",
      "loading": "Đang tải model…",
      "retry": "Không tải được model. Thử lại",
      "empty": "Không có model khớp",
      "manage": "Quản lý cấu hình"
    },
    "select": {
      "placeholder": "Vui lòng chọn một model",
      "configure": "Cấu hình Model",
      "noModels": "Không có model",
      "noAvailableModels": "Không có model khả dụng"
    },
    "quickSwitch": {
      "title": "Chuyển model hiện tại",
      "placeholder": "Chọn một model",
      "modelTagTitle": "Nhấn để chuyển model cho cấu hình này",
      "fetchFailed": "Lấy model online thất bại: {error}. Bạn vẫn có thể chọn model mặc định cục bộ.",
      "updateSuccess": "Đã chuyển sang {model}",
      "updateFailed": "Chuyển model thất bại: {error}"
    },
    "manager": {
      "displayName": "ví dụ: Model tùy chỉnh",
      "apiUrl": "API URL",
      "defaultModel": "Tên model mặc định",
      "modelNamePlaceholder": "ví dụ: gpt-3.5-turbo"
    }
  },
  "params": {
    "temperature": {
      "label": "Temperature",
      "description": "Kiểm soát độ ngẫu nhiên: giá trị thấp (ví dụ 0,2) cho đầu ra tập trung và xác định hơn, giá trị cao (ví dụ 0,8) cho đầu ra ngẫu nhiên hơn."
    },
    "top_p": {
      "label": "Top P",
      "description": "Lấy mẫu nucleus. Xét các token có tổng khối xác suất top P. Ví dụ 0,1 nghĩa là chỉ xét các token chiếm 10% khối xác suất cao nhất."
    },
    "max_tokens": {
      "label": "Max Tokens",
      "description": "Số token tối đa được tạo trong phần hoàn thiện."
    },
    "presence_penalty": {
      "label": "Presence Penalty",
      "description": "Số từ -2.0 đến 2.0. Giá trị dương phạt token mới dựa trên việc nó đã xuất hiện trong văn bản hay chưa, làm model có xu hướng nói về chủ đề mới hơn."
    },
    "frequency_penalty": {
      "label": "Frequency Penalty",
      "description": "Số từ -2.0 đến 2.0. Giá trị dương phạt token mới dựa trên tần suất xuất hiện của nó trong văn bản, làm model ít lặp lại cùng một câu nguyên văn hơn."
    },
    "timeout": {
      "label": "Timeout (ms)",
      "description_openai": "Thời gian chờ yêu cầu tính bằng mili giây cho kết nối client OpenAI."
    },
    "maxOutputTokens": {
      "label": "Max Output Tokens",
      "description": "Số token tối đa model có thể xuất trong một phản hồi."
    },
    "top_k": {
      "label": "Top K",
      "description": "Lọc lựa chọn token tiếp theo chỉ còn K token có khả năng cao nhất. Giúp giảm tạo token vô nghĩa."
    },
    "candidateCount": {
      "label": "Số lượng ứng viên",
      "description": "Số phản hồi được tạo để trả về. Phải từ 1 đến 8."
    },
    "stopSequences": {
      "label": "Chuỗi dừng",
      "description": "Chuỗi tùy chỉnh sẽ dừng tạo đầu ra khi gặp phải. Nhập nhiều chuỗi phân tách bằng dấu phẩy."
    },
    "thinkingBudget": {
      "label": "Ngân sách suy luận",
      "description": "Số token tối đa dành cho quá trình suy luận của model (chỉ Gemini 2.5+). Phạm vi: 1-8192 token."
    },
    "includeThoughts": {
      "label": "Bao gồm suy luận",
      "description": "Có đưa quá trình suy luận của model vào phản hồi hay không (chỉ Gemini 2.5+). Khi bật, bạn có thể xem các bước suy luận của model."
    },
    "reasoning_effort": {
      "label": "Mức suy luận",
      "description": "Kiểm soát mức suy luận cho model hỗ trợ chế độ suy luận."
    },
    "deepseek": {
      "thinking_type": {
        "label": "Chế độ suy luận",
        "description": "Kiểm soát chế độ suy luận của DeepSeek. Được gửi dưới dạng thinking.type trong yêu cầu API.",
        "disabled": "Đã tắt",
        "enabled": "Đã bật"
      }
    },
    "tokens": {
      "unit": "token"
    },
    "size": {
      "label": "Kích thước ảnh",
      "description": "Độ phân giải/kích thước của ảnh được tạo, ví dụ 1024x1024"
    },
    "quality": {
      "label": "Chất lượng ảnh",
      "description": "Mức chất lượng của ảnh được tạo: auto (tự động), high (chất lượng cao), medium, low (chất lượng thấp)"
    },
    "background": {
      "label": "Nền trong suốt",
      "description": "Đặt nền ảnh: auto (tự động), transparent (trong suốt), opaque (đục)"
    },
    "imageSize": {
      "label": "Kích thước ảnh",
      "description": "Độ phân giải/kích thước của ảnh được tạo, ví dụ 1024x1024"
    },
    "steps": {
      "label": "Số bước",
      "description": "Số bước diffusion/suy luận; nhiều bước thường cải thiện chất lượng nhưng tốn thời gian hơn"
    },
    "guidance": {
      "label": "Mức hướng dẫn",
      "description": "Mức độ bám theo prompt; giá trị càng cao càng bám sát prompt"
    },
    "cfg": {
      "label": "CFG Scale",
      "description": "Thang Classifier-Free Guidance để kiểm soát độ bám prompt (chỉ Qwen-Image)"
    },
    "negativePrompt": {
      "label": "Prompt phủ định",
      "description": "Nội dung hoặc phong cách bạn không muốn có trong ảnh"
    },
    "responseFormat": {
      "label": "Định dạng phản hồi",
      "description": "Định dạng của ảnh trả về (URL hoặc Base64)"
    },
    "outputFormat": {
      "label": "Định dạng đầu ra",
      "description": "Định dạng tệp của ảnh được tạo (như PNG, JPEG hoặc WebP)"
    },
    "watermark": {
      "label": "Watermark",
      "description": "Có thêm watermark vào ảnh được tạo hay không"
    },
    "sequentialGeneration": {
      "label": "Tạo ảnh tuần tự",
      "description": "Kiểm soát chế độ tạo ảnh tuần tự (cho model được hỗ trợ)"
    },
    "tools": {
      "label": "Công cụ",
      "description": "Danh sách công cụ mở rộng dòng 5.0, mỗi dòng một tên công cụ"
    },
    "seed": {
      "label": "Seed",
      "description": "Seed ngẫu nhiên để kiểm soát kết quả tạo, cùng seed cho cùng đầu ra"
    },
    "enable_thinking": {
      "label": "Bật suy luận",
      "description": "Bật chế độ suy luận cho tác vụ suy luận phức tạp (chỉ model được hỗ trợ)"
    },
    "thinking_budget": {
      "label": "Ngân sách suy luận",
      "description": "Số token tối đa cho quá trình suy luận, giới hạn độ dài suy luận"
    },
    "enable_search": {
      "label": "Bật tìm kiếm",
      "description": "Bật tìm kiếm internet để lấy thông tin thời gian thực (chỉ model được hỗ trợ)"
    },
    "max_completion_tokens": {
      "label": "Max Completion Tokens",
      "description": "Số token tối đa được tạo trong phần hoàn thiện (khuyên dùng, thay thế max_tokens). Phạm vi: 1-1.000.000."
    },
    "logprobs": {
      "label": "Log Probabilities",
      "description": "Có trả về log probability của các token đầu ra trong phản hồi hay không. Khi bật, bạn có thể xem độ tin cậy của model với từng token."
    },
    "top_logprobs": {
      "label": "Số lượng Top Log Probabilities",
      "description": "Số token có khả năng cao nhất được trả về kèm log probability cho mỗi vị trí. Phạm vi: 0-20. Cần bật logprobs trước."
    },
    "n": {
      "label": "Số lượng hoàn thiện",
      "description": "Số lựa chọn hoàn thiện được tạo cho mỗi đầu vào. Phạm vi: 1-128. Lưu ý: tạo nhiều kết quả tốn thêm hạn mức token."
    }
  }
} as const;

export default messages;
