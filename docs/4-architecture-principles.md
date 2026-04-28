# TodoList 구조 설계 원칙

> 버전: 1.0.0 | 작성일: 2026-04-28 | 작성자: chpark

---

## 변경이력

| 버전 | 변경일 | 작성자 | 변경 유형 | 변경 내용 |
|------|--------|--------|-----------|-----------|
| 1.0.0 | 2026-04-28 | chpark | 최초 작성 | 아키텍처 설계 원칙 초안 작성 |
| 1.1.0 | 2026-04-28 | chpark | 추가 | SE-08 환경변수 분리 원칙 추가 |

---

## 1. 최상위 공통 원칙

모든 스택(Frontend, Backend)에 공통 적용되는 원칙이다.

---

### CP-01 단일 책임 원칙 (Single Responsibility Principle)

**원칙명**: 하나의 모듈/함수/클래스는 하나의 책임만 가진다.

**Why**: 책임이 분산되지 않아야 변경 영향 범위가 최소화되고 테스트가 용이해진다.

**How**:
- Backend: Controller는 요청/응답만, Service는 비즈니스 로직만, Repository는 SQL만 담당한다.
- Frontend: Page는 레이아웃과 라우팅, Component는 UI 렌더링, Hook은 상태/사이드이펙트만 담당한다.
- 함수 하나가 200줄을 초과하면 분리를 검토한다.

---

### CP-02 명시적 의존성

**원칙명**: 모듈 간 의존성은 암묵적 전역이 아닌 명시적 import로 선언한다.

**Why**: 의존 관계가 명확해야 순환 참조 방지 및 모듈 교체가 쉽다.

**How**:
- 전역 변수나 `global` 객체를 통한 모듈 공유를 금지한다.
- 필요한 함수/객체는 반드시 `import`로 선언하여 사용한다.
- Backend에서 DB 커넥션 풀은 `src/config/database.js` 단일 지점에서 생성하고 import하여 사용한다.

---

### CP-03 환경 분리

**원칙명**: 개발(development)과 운영(production) 환경 설정을 코드에서 분리한다.

**Why**: 환경별 동작 차이로 인한 운영 장애를 예방한다.

**How**:
- 환경 구분은 `NODE_ENV` 환경변수로 제어한다.
- 개발 환경에서는 상세 오류 스택을 응답에 포함하고, 운영 환경에서는 일반 메시지만 반환한다.
- 환경별 설정이 필요한 값(DB host, 포트 등)은 `.env` 파일로 관리한다.

---

### CP-04 비밀값 관리

**원칙명**: 보안 민감 정보는 코드에 하드코딩하지 않는다.

**Why**: 코드 저장소에 비밀값이 포함되면 유출 위험이 발생한다.

**How**:
- JWT secret, DB password, bcrypt salt rounds 등 모든 비밀값은 `.env` 파일에서 관리한다.
- `.env` 파일은 `.gitignore`에 반드시 추가한다.
- `.env.example` 파일을 제공하여 필요한 환경변수 목록을 문서화한다.
- 코드 리뷰 시 하드코딩된 비밀값 여부를 반드시 확인한다.

---

### CP-05 일관된 오류 응답 구조

**원칙명**: 모든 API 오류 응답은 동일한 JSON 구조를 따른다.

**Why**: 클라이언트가 오류 처리 로직을 통일할 수 있어 유지보수성이 높아진다.

**How**: 아래 구조를 표준으로 사용한다.

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "요청한 리소스를 찾을 수 없습니다."
  }
}
```

- 성공 응답은 `{ "success": true, "data": { ... } }` 구조를 사용한다.
- HTTP 상태 코드와 `error.code`를 함께 사용하여 오류 유형을 구분한다.
- 운영 환경에서는 스택 트레이스를 응답 본문에 포함하지 않는다.

---

### CP-06 로그 전략

**원칙명**: 로그 레벨을 구분하고, 민감 정보는 로그에서 제외한다.

**Why**: 운영 환경에서 디버깅에 필요한 정보를 확보하면서 보안 정보 유출을 방지한다.

**How**:
- 로그 레벨: `error` (시스템 오류) > `warn` (비정상 상황) > `info` (주요 이벤트) > `debug` (개발용 상세).
- 운영 환경에서는 `info` 이상만 출력한다.
- 로그에서 반드시 제외할 항목: `password`, `passwordHash`, JWT 토큰 전체 문자열, 개인식별정보(PII).
- 요청 로그에는 `userId`, `method`, `path`, `statusCode`, `responseTime`을 포함한다.

---

## 2. 의존성 / 레이어 원칙

---

### LA-01 레이어 단방향 의존

**원칙명**: 레이어 간 의존 방향은 단방향이며 역방향 참조를 금지한다.

**Why**: 상위 레이어가 하위 레이어를 알지만 하위 레이어가 상위 레이어를 알면 결합도가 높아져 변경이 어려워진다.

**How**:

Backend 의존 방향 (단방향):
```
Route → Controller → Service → Repository → DB (pg)
```

Frontend 의존 방향 (단방향):
```
Page → Component → Hook → API Client → Server
```

- Route는 Controller만 호출한다. Service나 Repository를 직접 호출하지 않는다.
- Controller는 Service만 호출한다. Repository를 직접 호출하지 않는다.
- Service는 Repository만 호출한다. Controller의 `req`, `res` 객체를 참조하지 않는다.
- Repository는 pg 쿼리만 실행한다. 비즈니스 로직을 포함하지 않는다.
- Component는 Hook을 통해 데이터를 가져온다. API Client를 직접 호출하지 않는다.

---

### LA-02 레이어 간 직접 참조 금지

**원칙명**: 두 레이어 이상을 건너뛰는 직접 참조를 금지한다.

**Why**: 중간 레이어를 우회하면 해당 레이어의 검증, 변환, 보안 로직이 적용되지 않아 버그 및 보안 취약점이 발생한다.

**How**:
- Controller에서 `import`로 Repository를 직접 가져오는 코드를 허용하지 않는다.
- Page 컴포넌트에서 `fetch`나 `axios`를 직접 호출하지 않는다. 반드시 `api/` 모듈을 거친다.
- 코드 리뷰 시 레이어 건너뛰기 패턴을 반드시 지적하고 수정 요청한다.

---

### LA-03 도메인 모델과 DTO 분리

**원칙명**: DB에서 조회한 원본 행(row)과 API 응답용 객체(DTO)를 분리한다.

**Why**: DB 스키마 변경이 API 응답 구조에 직접 영향을 미치는 것을 방지한다. 또한 민감 필드(예: `password`)가 응답에 노출되는 사고를 예방한다.

**How**:
- Repository는 DB row를 그대로 반환한다.
- Service 또는 Controller에서 응답 전에 필요한 필드만 추출하여 DTO 형태로 변환한다.
- `password`, `passwordHash` 등 민감 필드는 응답 객체에서 반드시 제거한다.
- OVERDUE 판별처럼 런타임 계산이 필요한 필드는 Service 계층에서 추가한다.

```js
// 올바른 예: Service에서 DTO 변환 및 OVERDUE 판별
function toTodoDto(row) {
  const isOverdue =
    row.status === 'PENDING' &&
    row.due_date !== null &&
    new Date(row.due_date) < new Date();

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: isOverdue ? 'OVERDUE' : row.status,
    dueDate: row.due_date,
    completedAt: row.completed_at,
    categoryId: row.category_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
```

---

## 3. 코드 / 네이밍 원칙

---

### NM-01 파일명 규칙

**원칙명**: Backend는 kebab-case, Frontend 컴포넌트는 PascalCase를 사용한다.

**Why**: 파일 역할을 파일명만으로 즉시 식별할 수 있어 탐색 효율이 높아진다.

**How**:

| 위치 | 규칙 | 예시 |
|------|------|------|
| Backend 전체 | kebab-case | `todo-service.js`, `auth-middleware.js` |
| Frontend 컴포넌트 | PascalCase | `TodoCard.jsx`, `CategoryFilter.jsx` |
| Frontend Hook | camelCase, `use` 접두사 | `useTodos.js`, `useAuth.js` |
| Frontend 유틸 | camelCase | `dateFormatter.js`, `tokenStorage.js` |
| Frontend 상수 | camelCase | `statusConstants.js` |

---

### NM-02 함수 / 변수명 규칙

**원칙명**: 함수와 변수는 camelCase를 사용하며, 함수는 동사+명사 패턴을 따른다.

**Why**: 일관된 네이밍은 코드 가독성을 높이고 의도를 명확히 전달한다.

**How**:
- 변수: `todoList`, `currentUser`, `categoryId`
- 함수: `getTodos`, `createCategory`, `validatePassword`, `isOverdue`
- 불리언 반환 함수: `is`, `has`, `can` 접두사 사용 — `isActive()`, `hasPermission()`
- 비동기 함수: `async` 키워드를 명시하고 내부에서 `await`를 사용한다.

---

### NM-03 상수 규칙

**원칙명**: 변경되지 않는 상수값은 UPPER_SNAKE_CASE로 선언한다.

**Why**: 일반 변수와 상수를 즉시 구분할 수 있어 실수로 재할당하는 오류를 방지한다.

**How**:
- `const TODO_STATUS = { PENDING: 'PENDING', COMPLETED: 'COMPLETED', OVERDUE: 'OVERDUE' };`
- `const USER_ROLE = { ADMIN: 'ADMIN', USER: 'USER' };`
- `const MAX_TITLE_LENGTH = 200;`
- 상수는 `src/constants/` 디렉토리에 도메인별로 파일을 분리하여 관리한다.

---

### NM-04 API 엔드포인트 네이밍

**원칙명**: RESTful 규칙을 따르며 복수형 명사를 사용한다.

**Why**: 예측 가능한 URL 패턴은 API 사용자의 학습 비용을 낮추고 일관성을 보장한다.

**How**:

| HTTP 메서드 | 경로 | 설명 |
|-------------|------|------|
| `POST` | `/api/auth/register` | 회원가입 |
| `POST` | `/api/auth/login` | 로그인 |
| `GET` | `/api/todos` | 할일 목록 조회 |
| `POST` | `/api/todos` | 할일 생성 |
| `GET` | `/api/todos/:id` | 할일 단건 조회 |
| `PUT` | `/api/todos/:id` | 할일 전체 수정 |
| `PATCH` | `/api/todos/:id/complete` | 할일 완료 처리 |
| `PATCH` | `/api/todos/:id/uncomplete` | 할일 완료 취소 |
| `DELETE` | `/api/todos/:id` | 할일 삭제 |
| `GET` | `/api/categories` | 카테고리 목록 조회 |
| `POST` | `/api/categories` | 카테고리 생성 |
| `PUT` | `/api/categories/:id` | 카테고리 수정 |
| `DELETE` | `/api/categories/:id` | 카테고리 삭제 |
| `GET` | `/api/admin/users` | 전체 사용자 조회 (ADMIN) |
| `PATCH` | `/api/admin/users/:id/status` | 계정 활성/비활성 (ADMIN) |

- 동사를 URL에 사용하지 않는다. (금지: `/api/getTodos`, `/api/deleteTodo`)
- 버전 prefix가 필요한 경우 `/api/v1/todos` 형식을 사용한다.

---

### NM-05 DB 컬럼명 규칙

**원칙명**: DB 컬럼명은 snake_case를 사용한다.

**Why**: PostgreSQL 관례를 따르며 SQL 쿼리 가독성을 높인다.

**How**:
- 테이블명: `users`, `categories`, `todos` (복수형 소문자)
- 컬럼명: `user_id`, `category_id`, `due_date`, `created_at`, `completed_at`, `is_active`, `color_code`
- JavaScript 레이어에서는 camelCase로 변환하여 사용한다. (변환은 Repository 또는 Service 계층에서 수행)

---

### NM-06 JS 모듈 규칙

**원칙명**: ESModule(`import`/`export`) 방식을 사용한다.

**Why**: CommonJS(`require`)보다 정적 분석이 가능하고 트리 쉐이킹(tree-shaking)에 유리하다.

**How**:
- `package.json`에 `"type": "module"`을 설정하거나, 파일 확장자를 `.mjs`로 사용한다.
- `require()` 사용을 금지한다. (레거시 CommonJS 패키지 호환 필요 시 예외 허용, 주석 명시 필수)
- 기본 내보내기(default export)보다 명명된 내보내기(named export)를 선호한다. (단, React 컴포넌트는 default export 허용)

```js
// 권장
export function getTodos() { ... }
export function createTodo() { ... }

// React 컴포넌트 (허용)
export default function TodoCard({ todo }) { ... }
```

---

## 4. 테스트 / 품질 원칙

---

### TQ-01 테스트 범위 정의

**원칙명**: 테스트 유형별 역할을 명확히 구분하여 중복을 줄이고 효율적으로 커버리지를 확보한다.

**Why**: 유형 구분 없이 테스트를 작성하면 유지보수 비용이 증가하고 테스트 실행 시간이 길어진다.

**How**:

| 테스트 유형 | 대상 | 도구 |
|-------------|------|------|
| 단위 테스트 (Unit) | Service 함수, 유틸 함수, OVERDUE 판별 로직 | Jest / Vitest |
| 통합 테스트 (Integration) | API 엔드포인트 (HTTP 요청 → DB 응답) | Supertest + Jest |
| E2E 테스트 | 주요 사용자 시나리오 (SC-HP-01~06, SC-AD-01~03) | 선택 적용 (Phase 2) |

- 단위 테스트는 외부 의존성(DB, 네트워크)을 Mock으로 대체한다.
- 통합 테스트는 테스트 전용 DB 또는 트랜잭션 롤백 방식을 사용한다.
- 목표 커버리지: Service 레이어 80% 이상.

---

### TQ-02 테스트 파일 위치 규칙

**원칙명**: 테스트 파일은 테스트 대상 파일과 동일한 디렉토리에 위치시킨다.

**Why**: 테스트 파일과 소스 파일의 거리가 가까울수록 관리가 쉽고 누락을 방지할 수 있다.

**How**:
- 파일명: `todo-service.js` → 테스트 파일: `todo-service.test.js`
- 또는 `__tests__/` 디렉토리를 해당 모듈 디렉토리 내에 생성한다.
- E2E 테스트는 프로젝트 루트의 `e2e/` 디렉토리에서 별도로 관리한다.

```
backend/src/services/
├── todo-service.js
├── todo-service.test.js   # 권장 위치
└── __tests__/             # 또는 이 디렉토리 사용
    └── todo-service.test.js
```

---

### TQ-03 외부 의존성 Mock 전략

**원칙명**: 단위 테스트에서 외부 의존성은 반드시 Mock으로 격리한다.

**Why**: 실제 DB나 네트워크에 의존하면 테스트가 느려지고 환경에 따라 결과가 달라진다.

**How**:
- DB 쿼리(Repository): `jest.mock()` 또는 인터페이스 주입으로 Mock 처리한다.
- 현재 시각(`new Date()`): OVERDUE 판별 테스트 시 날짜를 Mock으로 고정한다.
- JWT 검증: 테스트용 토큰을 생성하거나 미들웨어를 Mock 처리한다.
- 외부 API 호출이 있는 경우: `nock` 또는 `jest.fn()`으로 HTTP 요청을 가로챈다.

---

### TQ-04 코드 품질 도구

**원칙명**: ESLint와 Prettier를 설정하고 커밋 전 자동 검사를 적용한다.

**Why**: 스타일 불일치와 잠재적 버그를 코드 작성 시점에 조기 발견한다.

**How**:
- ESLint: `eslint:recommended` 규칙 세트를 기반으로 프로젝트 규칙을 추가한다.
  - `no-unused-vars`, `no-console` (warn), `eqeqeq` (error) 필수 설정.
- Prettier: 들여쓰기 2칸, 세미콜론 필수, 작은따옴표 사용, 줄 너비 100자.
- `husky` + `lint-staged`를 설정하여 커밋 전 ESLint와 Prettier를 자동 실행한다.
- CI 파이프라인에서도 Lint 검사를 필수 단계로 포함한다.

---

### TQ-05 PR / 커밋 기준

**원칙명**: 커밋은 기능 단위로 원자적(atomic)으로 작성하고 일관된 메시지 형식을 사용한다.

**Why**: 이력 추적과 롤백을 쉽게 하기 위해 하나의 커밋이 하나의 논리적 변경을 담아야 한다.

**How**:

커밋 메시지 형식:
```
<type>: <subject>

[optional body]
```

| type | 설명 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변경 없는 코드 개선 |
| `test` | 테스트 추가/수정 |
| `chore` | 빌드, 설정, 의존성 변경 |
| `docs` | 문서 작성/수정 |

예시:
```
feat: 할일 목록 조회 API 구현 (카테고리/상태 필터 포함)
fix: OVERDUE 판별 시 dueDate null 체크 누락 수정
test: todo-service OVERDUE 판별 단위 테스트 추가
```

- PR은 하나의 기능 또는 하나의 버그 수정 단위로 구성한다.
- PR 병합 전 최소 1명의 리뷰 승인을 필수로 한다.

---

## 5. 설정 / 보안 / 운영 원칙

---

### SE-01 환경변수 관리

**원칙명**: `.env` 파일을 통해 환경변수를 관리하고 `.env.example`을 항상 최신 상태로 유지한다.

**Why**: 저장소에 비밀값이 노출되는 것을 방지하면서 신규 개발자의 환경 구성을 돕는다.

**How**:
- `.env` 파일은 `.gitignore`에 추가하여 저장소에 커밋하지 않는다.
- `.env.example` 파일에는 실제 값 대신 설명 주석과 더미 형식만 포함한다.
- 애플리케이션 시작 시 필수 환경변수 존재 여부를 검증하고, 누락된 경우 즉시 종료한다.

`.env.example` 예시:
```
# 서버
PORT=3000
NODE_ENV=development

# 데이터베이스
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todolist_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret_min_64_chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# bcrypt
BCRYPT_SALT_ROUNDS=12
```

---

### SE-02 JWT 보안 원칙

**원칙명**: JWT는 HS-512 알고리즘을 사용하고 만료 시간을 반드시 설정한다.

**Why**: 알고리즘 강도가 낮거나 만료 시간이 없으면 탈취된 토큰이 영구적으로 유효해진다.

**How**:
- 알고리즘: `HS512` 고정. `none` 알고리즘을 허용하지 않는다.
- Access Token 만료: 1시간 (`1h`). 운영 환경에서 환경변수로 조정 가능.
- Refresh Token 만료: 7일 (`7d`). Phase 1에서는 Refresh Token 미구현 시 재로그인 요구.
- JWT secret은 최소 64자 이상의 무작위 문자열을 사용한다.
- 클라이언트는 토큰을 `localStorage` 또는 메모리에 저장한다. (`httpOnly` 쿠키는 Phase 2 검토)
- 서버는 요청마다 토큰 서명과 만료 시간을 검증한다.
- 응답 본문이나 로그에 JWT 전체 문자열을 출력하지 않는다.

---

### SE-03 비밀번호 해시 원칙

**원칙명**: 비밀번호는 bcrypt로 해시하여 저장하며 평문을 절대 저장하지 않는다.

**Why**: DB가 유출되더라도 원본 비밀번호를 역추적할 수 없도록 단방향 해시를 사용한다.

**How**:
- `bcrypt` 라이브러리의 `hash()` 함수를 사용한다.
- salt rounds: 최소 12 이상 (환경변수 `BCRYPT_SALT_ROUNDS`로 관리).
- 비밀번호 검증 시 `bcrypt.compare()`를 사용하며 해시를 직접 비교하지 않는다.
- 로그인 실패 시 응답 메시지에서 사용자명과 비밀번호 중 어느 것이 틀렸는지 구분하지 않는다. ("아이디 또는 비밀번호가 올바르지 않습니다.")

---

### SE-04 CORS 설정 원칙

**원칙명**: 허용 출처(origin)를 명시적으로 지정하고 와일드카드(`*`) 사용을 지양한다.

**Why**: 와일드카드 허용은 CSRF 공격 벡터를 넓힌다.

**How**:
- 허용 출처는 환경변수(`CORS_ORIGIN`)로 관리한다.
- 개발 환경: `http://localhost:5173` (Vite 기본 포트)
- 운영 환경: 실제 도메인 URL
- 허용 메서드: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- 허용 헤더: `Content-Type, Authorization`
- `credentials: true` 설정 시 출처를 반드시 명시한다.

```js
// backend/src/app.js
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

### SE-05 SQL Injection 방지

**원칙명**: 모든 SQL 쿼리는 파라미터 바인딩을 사용하고 문자열 연결 방식을 금지한다.

**Why**: 사용자 입력을 SQL 문자열에 직접 삽입하면 SQL Injection 공격에 취약해진다.

**How**:
- `pg` 라이브러리의 파라미터 바인딩(`$1, $2, ...`) 방식을 반드시 사용한다.
- 문자열 템플릿으로 쿼리를 조합하는 패턴을 금지한다.

```js
// 금지 (SQL Injection 취약)
const result = await pool.query(`SELECT * FROM todos WHERE user_id = '${userId}'`);

// 올바른 예 (파라미터 바인딩)
const result = await pool.query('SELECT * FROM todos WHERE user_id = $1', [userId]);
```

- 동적 ORDER BY나 컬럼명이 필요한 경우 허용 목록(allowlist)을 사전 정의하고 검증 후 사용한다.

---

### SE-06 민감정보 로그 제외 원칙

**원칙명**: 로그 출력 시 민감 정보를 자동으로 마스킹하거나 제외한다.

**Why**: 로그 수집 시스템이 유출되더라도 비밀번호, 토큰 등이 노출되지 않도록 한다.

**How**: 아래 항목은 로그에서 반드시 제외하거나 마스킹 처리한다.

| 항목 | 처리 방법 |
|------|-----------|
| `password` | 완전 제외 또는 `"***"` 대체 |
| JWT 토큰 전체 문자열 | 앞 10자만 표시 (`token: "eyJhbGci..."`) |
| `Authorization` 헤더 | 완전 제외 또는 `"Bearer ***"` 대체 |
| DB 연결 문자열 | 완전 제외 |

- 요청 로깅 미들웨어에서 요청 본문의 `password` 필드를 로그 전에 제거한다.

---

### SE-07 초기 데이터(Seed) 관리 원칙

**원칙명**: Seed 데이터는 코드로 관리하며 운영 환경에서는 최초 1회만 실행한다.

**Why**: Seed 스크립트를 반복 실행하면 중복 데이터가 생성되거나 기존 데이터를 덮어쓸 수 있다.

**How**:
- Seed 파일 위치: `backend/src/db/seeds/`
- 기본 admin 계정 Seed는 `username = 'admin'`이 존재하는지 확인 후 없을 때만 삽입한다.
- Seed 스크립트는 `npm run db:seed` 명령으로 수동 실행하거나 마이그레이션 후 자동 실행 옵션을 제공한다.
- admin 기본 비밀번호(`admin`)는 Seed 실행 시 bcrypt로 해시하여 저장한다. 평문으로 DB에 저장하지 않는다.

```js
// 멱등성 보장 예시
const existing = await pool.query('SELECT id FROM users WHERE username = $1', ['admin']);
if (existing.rows.length === 0) {
  const hashed = await bcrypt.hash('admin', parseInt(process.env.BCRYPT_SALT_ROUNDS));
  await pool.query(
    'INSERT INTO users (username, password, role, is_active) VALUES ($1, $2, $3, $4)',
    ['admin', hashed, 'ADMIN', true]
  );
}
```

---

## 6. 프론트엔드 디렉토리 구조

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── common/
│   ├── pages/
│   ├── hooks/
│   ├── api/
│   ├── store/
│   ├── styles/
│   ├── utils/
│   ├── constants/
│   ├── router/
│   └── main.jsx
├── .env.example
├── .eslintrc.json
├── .prettierrc
└── package.json
```

| 디렉토리 / 파일 | 역할 | 파일 예시 | 금지 사항 |
|----------------|------|-----------|-----------|
| `public/` | 빌드 시 그대로 복사되는 정적 파일 | `favicon.ico`, `robots.txt` | 소스 코드 포함 금지 |
| `src/assets/` | 컴포넌트에서 import하여 사용하는 이미지, 폰트 등 정적 파일 | `logo.svg`, `fonts/` | 비즈니스 로직 포함 금지 |
| `src/components/` | 여러 Page에서 재사용 가능한 공통 UI 컴포넌트 | `TodoCard.jsx`, `CategoryBadge.jsx`, `Modal.jsx` | 페이지 전용 레이아웃 포함 금지. API 직접 호출 금지 |
| `src/components/common/` | 버튼, 인풋 등 도메인 비종속 원자 컴포넌트 | `Button.jsx`, `Input.jsx`, `Dialog.jsx` | 비즈니스 로직 포함 금지 |
| `src/pages/` | React Router 라우트와 1:1 매핑되는 페이지 컴포넌트 | `TodoListPage.jsx`, `LoginPage.jsx`, `CategoryPage.jsx` | 페이지 내 직접 fetch 호출 금지. 레이아웃 구성만 담당 |
| `src/hooks/` | 상태 관리, 서버 데이터 Fetching, 사이드이펙트를 포함한 커스텀 Hook | `useTodos.js`, `useCategories.js`, `useAuth.js` | JSX 반환 금지. UI 렌더링 로직 포함 금지 |
| `src/api/` | TanStack Query 쿼리 함수 및 axios/fetch API 클라이언트 정의 | `todo-api.js`, `auth-api.js`, `category-api.js` | 상태(state) 관리 금지. 순수 HTTP 요청 함수만 포함 |
| `src/store/` | Zustand 전역 상태 슬라이스 (서버 상태 제외) | `auth-store.js`, `ui-store.js` | 서버 데이터(Todo 목록 등) 캐시 금지. TanStack Query 담당 |
| `src/styles/` | Tailwind CSS 설정 및 전역 CSS | `index.css`, `tailwind.config.js` | 컴포넌트별 스타일은 해당 컴포넌트 파일 내 Tailwind 클래스로 처리 |
| `src/utils/` | 순수 함수(사이드이펙트 없음) 유틸리티 | `date-formatter.js`, `token-storage.js`, `validators.js` | React 의존성 포함 금지. Hook 사용 금지 |
| `src/constants/` | 애플리케이션 전역 상수 정의 | `todo-status.js`, `user-role.js`, `api-endpoints.js` | 함수 또는 상태 포함 금지. 순수 상수 값만 허용 |
| `src/router/` | React Router 라우트 정의 및 인증 보호 라우트(ProtectedRoute) | `index.jsx`, `ProtectedRoute.jsx` | 비즈니스 로직 포함 금지. 라우트 구성과 접근 제어만 담당 |
| `src/main.jsx` | 앱 진입점. QueryClient, Router, Zustand Provider 조립 | - | 비즈니스 로직 포함 금지. Provider 조립만 담당 |

**상태 관리 역할 분리 원칙**:
- 서버 상태 (Todo 목록, 카테고리 목록 등): TanStack Query (`src/hooks/` + `src/api/`)
- 클라이언트 전역 상태 (인증 정보, 모달 열림 여부 등): Zustand (`src/store/`)
- 컴포넌트 로컬 상태 (폼 입력값 등): `useState`

---

## 7. 백엔드 디렉토리 구조

```
backend/
├── src/
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middlewares/
│   ├── utils/
│   ├── constants/
│   ├── db/
│   │   ├── migrations/
│   │   └── seeds/
│   └── app.js
├── server.js
├── .env.example
├── .eslintrc.json
├── .prettierrc
└── package.json
```

| 디렉토리 / 파일 | 역할 | 파일 예시 | 금지 사항 |
|----------------|------|-----------|-----------|
| `src/config/` | DB 연결 풀 생성, 환경변수 로드 및 검증 | `database.js`, `env.js` | 비즈니스 로직 포함 금지 |
| `src/routes/` | Express 라우터. URL 경로와 Controller 함수를 연결하고 미들웨어를 적용 | `todo-routes.js`, `auth-routes.js`, `category-routes.js`, `admin-routes.js` | 비즈니스 로직 포함 금지. `req.body` 파싱 외 로직 금지 |
| `src/controllers/` | HTTP 요청 수신, 입력 유효성 검증, Service 호출, HTTP 응답 반환 | `todo-controller.js`, `auth-controller.js`, `category-controller.js` | DB 직접 접근 금지. 비즈니스 로직 포함 금지. `req`, `res` 객체는 이 계층에서만 사용 |
| `src/services/` | 핵심 비즈니스 로직. OVERDUE 판별, 비밀번호 검증, 카테고리명 중복 확인 등 | `todo-service.js`, `auth-service.js`, `category-service.js` | `req`, `res` 객체 참조 금지. HTTP 관련 코드 포함 금지 |
| `src/repositories/` | pg 라이브러리를 사용한 SQL 쿼리 캡슐화. DB CRUD 전담 | `todo-repository.js`, `user-repository.js`, `category-repository.js` | 비즈니스 로직 포함 금지. SQL 파라미터 바인딩 필수. 문자열 연결 쿼리 금지 |
| `src/middlewares/` | JWT 인증 검증, ADMIN 권한 확인, 전역 오류 핸들러, 요청 로거 | `auth-middleware.js`, `role-middleware.js`, `error-handler.js`, `logger.js` | 비즈니스 로직 포함 금지 |
| `src/utils/` | 순수 유틸리티 함수 (사이드이펙트 없음) | `password-utils.js`, `jwt-utils.js`, `date-utils.js` | Express 의존성 포함 금지. 순수 함수만 허용 |
| `src/constants/` | 애플리케이션 전역 상수 | `todo-status.js`, `user-role.js`, `error-codes.js` | 함수 또는 상태 포함 금지. 순수 상수 값만 허용 |
| `src/db/migrations/` | PostgreSQL 스키마 생성 SQL 파일. 순서 보장을 위해 파일명 앞에 번호 부여 | `001_create_users.sql`, `002_create_categories.sql`, `003_create_todos.sql` | 비즈니스 로직 포함 금지. 스키마 DDL만 허용 |
| `src/db/seeds/` | 초기 데이터 삽입 스크립트. 멱등성 보장 필수 (존재 확인 후 삽입) | `01_admin_user.js` | 운영 데이터 초기화 로직 포함 금지. 초기값 삽입만 허용 |
| `src/app.js` | Express 앱 인스턴스 생성, CORS, 미들웨어, 라우터 등록, 오류 핸들러 연결 | - | 서버 `listen` 호출 금지. 순수 앱 설정만 담당 |
| `server.js` | HTTP 서버 시작(`app.listen`). 포트 바인딩, 종료 시그널(SIGTERM) 처리 | - | 비즈니스 로직 및 라우트 설정 포함 금지 |

**app.js와 server.js 분리 이유**: `app.js`를 테스트에서 독립적으로 `import`하여 supertest로 HTTP 서버 없이 통합 테스트를 실행할 수 있다.

---

### SE-08 환경변수 분리 원칙

**원칙명**: 환경(개발/운영)별 변수 파일을 분리하고 혼용하지 않는다.

**Why**: 개발 환경의 설정값(로컬 DB, 낮은 보안 설정 등)이 운영 환경에 적용되면 보안 사고나 장애가 발생한다.

**How**:

| 파일명 | 용도 | 저장소 포함 여부 |
|--------|------|-----------------|
| `.env.example` | 필요한 환경변수 목록 문서화 (더미값) | **포함** |
| `.env` | 로컬 개발 기본값 | 제외 (`.gitignore`) |
| `.env.development` | 개발 환경 전용 설정 | 제외 |
| `.env.production` | 운영 환경 전용 설정 | 제외 |

- `NODE_ENV` 값에 따라 해당 환경 파일을 우선 로드한다.
- 운영 환경 변수는 서버 환경변수 또는 시크릿 매니저(AWS SSM, Vault 등)로 주입하며 파일로 배포하지 않는다.
- 개발 환경에서만 유효한 값(예: `DEBUG=true`, 로컬 DB 주소)을 운영 `.env`에 포함하지 않는다.
- 두 환경 간 반드시 달라야 하는 값:

| 항목 | 개발 | 운영 |
|------|------|------|
| `NODE_ENV` | `development` | `production` |
| `JWT_SECRET` | 임의 개발용 문자열 | 64자 이상 무작위 문자열 |
| `BCRYPT_SALT_ROUNDS` | `10` (속도 우선) | `12` 이상 (보안 우선) |
| `DB_HOST` | `localhost` | 실제 DB 호스트 |
| `CORS_ORIGIN` | `http://localhost:5173` | 실제 서비스 도메인 |

---

*본 문서는 PRD(2-prd.md v1.0.0) 및 도메인 정의서(1-domain-definition.md v1.1.0)를 기반으로 작성된 TodoList 구조 설계 원칙 문서이며, 아키텍처 결정 변경 시 버전을 갱신하여 관리한다.*
