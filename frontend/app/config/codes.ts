export const codeA = [
    'A0001',
    'A0100',
    'A0101',
    'A0102',
    'A0110',
    'A0111',
    'A0112',
    'A0200',
    'A0201',
    'A0202',
    'A0203',
];
export const codeB = ['B0001', 'B0100', 'B0101', 'B0200', 'B0210', 'B0220', 'B0300', 'B0310', 'B0311', 'B0312'];
export const codeC = ['C0001', 'C0100', 'C0110', 'C0111', 'C0112'];

export const errCodes = {
    /** 成功 */
    SUCCESS: '0',
    UNKNOWN: 'UNKNOWN',
    client: {
        /** 用户端错误 */
        CLIENT_SIDE_ERROR: 'A0001',
        /** 用户注册错误 */
        USER_REGISTRATION_ERROR: 'A0100',
        /** 用户未同意隐私协议 */
        USER_DID_NOT_AGREE_TO_PRIVACY_POLICY: 'A0101',
        /** 注册国家或地区受限 */
        REGISTRATION_RESTRICTED_IN_COUNTRY_OR_REGION: 'A0102',
        /** 用户名校验失败 */
        USERNAME_VALIDATION_FAILED: 'A0110',
        /** 用户名已存在 */
        USERNAME_ALREADY_EXISTS: 'A0111',
        /** 用户名包含敏感词 */
        USERNAME_CONTAINS_SENSITIVE_WORDS: 'A0112',
        /** 用户登录异常 */
        USER_LOGIN_EXCEPTION: 'A0200',
        /** 用户账户不存在 */
        USER_ACCOUNT_DOES_NOT_EXIST: 'A0201',
        /** 用户密码错误 */
        INCORRECT_USER_PASSWORD: 'A0202',
        /** 用户账户已作废 */
        USER_ACCOUNT_IS_OBSOLETE: 'A0203',
    },
    server: {
        /** 系统执行出错 */
        SYSTEM_EXECUTION_ERROR: 'B0001',
        /** 系统执行超时 */
        SYSTEM_EXECUTION_TIMEOUT: 'B0100',
        /** 系统订单处理超时 */
        SYSTEM_ORDER_PROCESSING_TIMEOUT: 'B0101',
        /** 系统容灾功能被触发 */
        DISASTER_RECOVERY_FUNCTION_TRIGGERED: 'B0200',
        /** 系统限流 */
        SYSTEM_RATE_LIMITING: 'B0210',
        /** 系统功能降级 */
        SYSTEM_FEATURE_DEGRADATION: 'B0220',
        /** 系统资源异常 */
        SYSTEM_RESOURCE_EXCEPTION: 'B0300',
        /** 系统资源耗尽 */
        SYSTEM_RESOURCES_EXHAUSTED: 'B0310',
        /** 系统磁盘空间耗尽 */
        SYSTEM_DISK_SPACE_EXHAUSTED: 'B0311',
        /** 系统内存耗尽 */
        SYSTEM_MEMORY_EXHAUSTED: 'B0312',
    },
    remote: {
        /** 调用第三方服务出错 */
        THIRD_PARTY_SERVICE_CALL_ERROR: 'C0001',
        /** 中间件服务出错 */
        MIDDLEWARE_SERVICE_ERROR: 'C0100',
        /** RPC服务出错 */
        RPC_SERVICE_ERROR: 'C0110',
        /** RPC服务未找到 */
        RPC_SERVICE_NOT_FOUND: 'C0111',
        /** RPC服务未注册 */
        RPC_SERVICE_NOT_REGISTERED: 'C0112',
    },
};
