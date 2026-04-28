# TodoList 프로젝트 실행계획

> 버전: 1.0.0 | 작성일: 2026-04-28 | 작성자: chpark

---

## 변경이력

| 버전 | 변경일 | 작성자 | 변경 유형 | 변경 내용 |
|------|--------|--------|-----------|-----------|
| 1.0.0 | 2026-04-28 | chpark | 최초 작성 | DB/백엔드/프론트엔드 실행계획 초안 작성 |

---

## 개요

| 항목 | 내용 |
|------|------|
| 참조 문서 | PRD v1.0.0, 도메인 정의서 v1.1.0, 설계 원칙 v1.1.0, ERD v1.0.0 |
| 개발 일정 | Phase 1: 2026-04-28 ~ 2026-04-30 |
| 총 태스크 | DB 6개 / 백엔드 13개 / 프론트엔드 11개 = **30개** |
| 총 예상 소요 | DB 8.5h / 백엔드 33.5h / 프론트엔드 33h = **75h** |

---

## 전체 태스크 목록

| 영역 | ID | 태스크명 | 우선순위 | 예상 소요 |
|------|----|---------|---------|-----------| 
| DB | DB-01 | PostgreSQL 환경 구성 및 DB 생성 | 높음 | 1h |
| DB | DB-02 | schema.sql 실행 및 스키마 검증 | 높음 | 1h |
| DB | DB-03 | Seed 스크립트 작성 (admin 계정) | 높음 | 1.5h |
| DB | DB-04 | DB 연결 설정 (pg Pool, 환경변수) | 높음 | 1.5h |
| DB | DB-05 | 마이그레이션 파일 구조화 | 중간 | 2h |
| DB | DB-06 | 인덱스 및 성능 검증 | 중간 | 1.5h |
| BE | BE-01 | 프로젝트 초기 세팅 | 높음 | 2h |
| BE | BE-02 | 상수 및 유틸리티 모듈 구현 | 높음 | 2h |
| BE | BE-03 | DB 연결 풀 및 환경변수 설정 모듈 | 높음 | 1h |
| BE | BE-04 | 마이그레이션 및 Seed 스크립트 | 높음 | 1.5h |
| BE | BE-05 | JWT 인증 미들웨어 및 역할 미들웨어 | 높음 | 1.5h |
| BE | BE-06 | 전역 에러 핸들러 및 요청 로거 | 높음 | 1.5h |
| BE | BE-07 | 입력 유효성 검증 미들웨어 | 높음 | 2h |
| BE | BE-08 | 인증 API (회원가입, 로그인) | 높음 | 3h |
| BE | BE-09 | 할일 API (CRUD + 완료/완료취소) | 높음 | 5h |
| BE | BE-10 | 카테고리 API (CRUD) | 높음 | 3h |
| BE | BE-11 | 관리자 API (사용자 관리) | 중간 | 2.5h |
| BE | BE-12 | Service 레이어 단위 테스트 | 중간 | 4h |
| BE | BE-13 | 주요 API 통합 테스트 | 중간 | 4h |
| FE | FE-01 | 프로젝트 초기 세팅 | 높음 | 2h |
| FE | FE-02 | 공통 원자 컴포넌트 구현 | 높음 | 3h |
| FE | FE-03 | 라우터 설정 및 ProtectedRoute | 높음 | 2h |
| FE | FE-04 | Zustand auth-store 및 token-storage | 높음 | 2h |
| FE | FE-05 | API 클라이언트 기반 구축 | 높음 | 2h |
| FE | FE-06 | 인증 화면 (로그인/회원가입) | 높음 | 3h |
| FE | FE-07 | 카테고리 관리 화면 | 높음 | 4h |
| FE | FE-08 | 할일 목록 화면 | 높음 | 5h |
| FE | FE-09 | 할일 등록/수정 화면 | 높음 | 4h |
| FE | FE-10 | 관리자 화면 | 중간 | 3h |
| FE | FE-11 | 반응형 레이아웃 통합 점검 | 중간 | 3h |

---

## 전체 의존성 그래프

```
[DB-01] PostgreSQL 환경 구성
    ├── [DB-02] 스키마 실행/검증
    │       ├── [DB-05] 마이그레이션 구조화 ←─ DB-04
    │       └── [DB-06] 인덱스 성능 검증  ←─ DB-03
    └── [DB-04] DB 연결 설정
            └── [DB-03] Seed 스크립트 ←─ DB-02

[BE-01] 백엔드 초기 세팅
    ├── [BE-02] 상수·유틸리티
    │       ├── [BE-05] JWT·역할 미들웨어
    │       └── [BE-06] 에러핸들러·로거
    │               └── [BE-07] 유효성 검증 미들웨어
    └── [BE-03] DB 연결 풀 ←─ DB-01
            └── [BE-04] 마이그레이션·Seed ←─ DB-01

BE-03 + BE-05 + BE-06 + BE-07
    └── [BE-08] 인증 API
            ├── [BE-09] 할일 API
            ├── [BE-10] 카테고리 API
            └── [BE-11] 관리자 API
                    └── [BE-12] 단위 테스트 ←─ BE-09, BE-10
                            └── [BE-13] 통합 테스트 ←─ DB-01

[FE-01] 프론트엔드 초기 세팅
    ├── [FE-02] 공통 컴포넌트
    └── [FE-04] auth-store·token-storage
            ├── [FE-03] 라우터·ProtectedRoute
            └── [FE-05] API 클라이언트
                    ├── [FE-06] 인증 화면     ←─ BE-08
                    ├── [FE-07] 카테고리 관리  ←─ BE-10
                    ├── [FE-08] 할일 목록      ←─ BE-09, FE-07
                    ├── [FE-09] 할일 등록/수정 ←─ BE-09, FE-07, FE-08
                    └── [FE-10] 관리자 화면    ←─ BE-11
                            └── [FE-11] 반응형 통합 점검
```

---

## 데이터베이스 (DB)

---

### DB-01: PostgreSQL 로컬 환경 구성 및 데이터베이스 생성

**설명**: 로컬 개발 환경에 PostgreSQL을 설치하고 프로젝트 전용 데이터베이스와 사용자 계정을 생성한다.
**우선순위**: 높음 | **예상 소요**: 1h | **의존성**: 없음

#### 완료 조건
- [ ] PostgreSQL 서비스가 정상 기동되고 `psql` 접속이 성공한다
- [ ] `todolist_db` 데이터베이스가 생성되어 있다
- [ ] 전용 DB 사용자가 `todolist_db`에 대한 접속 및 DDL 권한을 보유한다
- [ ] `pgcrypto` 확장이 `todolist_db`에서 활성화된다

#### 작업 항목
- [ ] PostgreSQL 16 이상 설치 확인 (`psql --version`)
- [ ] 전용 사용자 생성 (`CREATE USER todolist_user WITH PASSWORD '...'`)
- [ ] `todolist_db` 데이터베이스 생성 (`CREATE DATABASE todolist_db OWNER todolist_user`)
- [ ] `todolist_user`에 권한 부여 (`GRANT ALL PRIVILEGES ON DATABASE todolist_db TO todolist_user`)
- [ ] `psql -U todolist_user -d todolist_db` 접속 성공 확인
- [ ] 연결 정보를 `.env` 파일 초안에 기록

---

### DB-02: schema.sql 실행 및 스키마 검증

**설명**: 작성 완료된 `database/schema.sql`을 실행하고 모든 테이블·제약조건·트리거·인덱스가 ERD 명세와 일치하는지 검증한다.
**우선순위**: 높음 | **예상 소요**: 1h | **의존성**: DB-01

#### 완료 조건
- [ ] `users`, `categories`, `todos` 테이블 3개가 모두 생성된다
- [ ] CHECK 제약조건이 ERD 명세와 일치한다 (`ADMIN|USER`, `PENDING|COMPLETED`, OVERDUE 미포함)
- [ ] `categories → users` CASCADE 삭제, `todos → categories` SET NULL 동작이 검증된다
- [ ] `trg_todos_updated_at` 트리거가 UPDATE 시 `updated_at`을 자동 갱신한다
- [ ] 5개 인덱스가 모두 존재한다

#### 작업 항목
- [ ] `psql -U todolist_user -d todolist_db -f database/schema.sql` 실행
- [ ] `\dt`로 3개 테이블 존재 확인
- [ ] `\d users` / `\d categories` / `\d todos`로 컬럼 타입·제약조건 검증
- [ ] FK ON DELETE CASCADE / SET NULL 동작 테스트
- [ ] 트리거 동작 검증 (todos UPDATE 후 `updated_at` 변경 확인)
- [ ] `\di`로 5개 인덱스 생성 확인
- [ ] 테스트 데이터 삭제 (`TRUNCATE`)

---

### DB-03: Seed 스크립트 작성 (admin 계정, bcrypt 해시 적용)

**설명**: 기본 admin 계정(`admin/admin`)을 멱등성 있게 삽입하는 Seed 스크립트를 `backend/src/db/seeds/01_admin_user.js`에 작성한다.
**우선순위**: 높음 | **예상 소요**: 1.5h | **의존성**: DB-01, DB-02, DB-04

#### 완료 조건
- [ ] `npm run db:seed` 실행 시 admin 레코드가 1건 삽입된다
- [ ] `users.password`에 bcrypt 해시값(`$2b$...`)이 저장되고 평문이 저장되지 않는다
- [ ] 스크립트를 2회 이상 반복 실행해도 중복 생성되지 않는다 (멱등성 보장)
- [ ] `bcrypt.compare('admin', storedHash)` 검증이 성공한다

#### 작업 항목
- [ ] `backend/src/db/seeds/` 디렉토리 생성
- [ ] `01_admin_user.js` 파일 생성
- [ ] `SELECT id FROM users WHERE username = $1`로 존재 여부 확인 로직 작성
- [ ] 미존재 시 `bcrypt.hash('admin', BCRYPT_SALT_ROUNDS)`로 해시 후 INSERT
- [ ] `package.json` scripts에 `"db:seed"` 추가
- [ ] 멱등성 테스트: 2회 실행 후 `COUNT(*) = 1` 확인

---

### DB-04: DB 연결 설정 (pg Pool, 환경변수 연동)

**설명**: `pg` 라이브러리의 Pool 인스턴스를 `backend/src/config/database.js` 단일 지점에서 생성하고 환경변수로 설정값을 주입한다.
**우선순위**: 높음 | **예상 소요**: 1.5h | **의존성**: DB-01

#### 완료 조건
- [ ] `backend/src/config/database.js`에서 Pool 인스턴스가 단일 생성되어 named export된다
- [ ] DB 연결 정보가 모두 환경변수에서 주입된다
- [ ] 필수 환경변수 누락 시 애플리케이션이 즉시 종료된다
- [ ] `pool.query('SELECT NOW()')` 테스트 쿼리가 성공한다
- [ ] DB 연결 문자열이 로그에 출력되지 않는다

#### 작업 항목
- [ ] `npm install pg` 실행
- [ ] `src/config/database.js` 작성 (`pg.Pool` 생성, 환경변수 바인딩, named export)
- [ ] 필수 환경변수 검증 로직 작성 (누락 시 `process.exit(1)`)
- [ ] `.env`, `.env.example`에 DB 관련 환경변수 6개 설정
- [ ] `pool.on('error', ...)` 이벤트 핸들러 등록
- [ ] 연결 검증 후 DB 연결 정보 로그 미출력 확인

---

### DB-05: 마이그레이션 파일 정리 (migrations/ 구조화)

**설명**: `database/schema.sql`을 기반으로 `backend/src/db/migrations/` 디렉토리에 테이블별 순번 SQL 파일로 분리하고 마이그레이션 실행 스크립트를 작성한다.
**우선순위**: 중간 | **예상 소요**: 2h | **의존성**: DB-02, DB-04

#### 완료 조건
- [ ] `backend/src/db/migrations/`에 번호 prefix 파일 4개 이상이 존재한다
- [ ] `npm run db:migrate` 실행 시 오류 없이 스키마 전체가 적용된다
- [ ] 재실행 시 `IF NOT EXISTS`로 오류가 발생하지 않는다

#### 작업 항목
- [ ] `001_create_users.sql` 작성 (pgcrypto 확장, users DDL)
- [ ] `002_create_categories.sql` 작성 (categories DDL, 인덱스)
- [ ] `003_create_todos.sql` 작성 (todos DDL, 인덱스 3개)
- [ ] `004_create_triggers.sql` 작성 (set_updated_at 함수, 트리거)
- [ ] `src/db/migrate.js` 작성 (순번 기준 정렬 후 순차 실행)
- [ ] `package.json`에 `"db:migrate"` 스크립트 추가
- [ ] DROP 후 마이그레이션만으로 재생성 성공 확인

---

### DB-06: 인덱스 및 성능 검증

**설명**: `EXPLAIN ANALYZE`로 주요 쿼리 패턴에서 인덱스가 올바르게 사용되는지 검증한다.
**우선순위**: 중간 | **예상 소요**: 1.5h | **의존성**: DB-02, DB-03

#### 완료 조건
- [ ] `WHERE user_id = $1` 쿼리에서 `idx_todos_user_id` 인덱스 스캔이 확인된다
- [ ] OVERDUE 판별 쿼리에서 `idx_todos_status_due` 복합 인덱스가 활용된다
- [ ] `uq_users_username` UNIQUE 인덱스가 중복 삽입 시 오류를 발생시킨다
- [ ] `uq_categories_user_name` 복합 UNIQUE가 사용자 내 중복만 차단한다

#### 작업 항목
- [ ] 검증용 더미 데이터 삽입 (user 1건, categories 3건, todos 10건 이상)
- [ ] `EXPLAIN ANALYZE`로 주요 쿼리 4종 실행 및 인덱스 스캔 확인
- [ ] UNIQUE 제약조건 위반 테스트 2건
- [ ] `ANALYZE` 실행으로 통계 정보 갱신
- [ ] 더미 데이터 정리 (`TRUNCATE users CASCADE`)

---

## 백엔드 (BE)

---

### BE-01: 프로젝트 초기 세팅

**설명**: Node.js 24 + Express 5 기반 백엔드 프로젝트 골격을 구성한다. `app.js`와 `server.js`를 역할에 따라 분리한다.
**우선순위**: 높음 | **예상 소요**: 2h | **의존성**: 없음

#### 완료 조건
- [ ] `npm run dev`로 서버가 정상 기동된다
- [ ] ESLint 및 Prettier 검사가 오류 없이 통과된다
- [ ] `.env.example`에 모든 필수 환경변수가 문서화된다
- [ ] `app.js`(앱 설정)와 `server.js`(포트 바인딩)가 분리된다
- [ ] `GET /health` 요청 시 `{ success: true, data: { status: "ok" } }` 반환된다

#### 작업 항목
- [ ] `backend/` 하위 전체 폴더 구조 생성 (`src/config`, `routes`, `controllers`, `services`, `repositories`, `middlewares`, `utils`, `constants`, `db/migrations`, `db/seeds`)
- [ ] `package.json` 작성 (`"type": "module"`, Express 5, pg, jsonwebtoken, bcrypt, dotenv, cors 의존성)
- [ ] 개발 의존성 추가 (nodemon, eslint, prettier, jest, supertest)
- [ ] `npm run dev`, `start`, `lint`, `test` 스크립트 정의
- [ ] `.eslintrc.json` 작성 (`no-unused-vars: error`, `no-console: warn`, `eqeqeq: error`)
- [ ] `.prettierrc` 작성 (2칸 들여쓰기, 세미콜론 필수, 작은따옴표, 100자)
- [ ] `.env.example` 작성 (PORT, NODE_ENV, DB_*, JWT_*, BCRYPT_SALT_ROUNDS, CORS_ORIGIN)
- [ ] `src/app.js` 작성 (Express 인스턴스, CORS, express.json(), `listen` 호출 금지)
- [ ] `server.js` 작성 (app.listen, SIGTERM 처리)

---

### BE-02: 상수 및 유틸리티 모듈 구현

**설명**: 전체 레이어에서 공통으로 사용하는 상수와 순수 유틸리티 함수를 구현한다. JWT, bcrypt, OVERDUE 판별 유틸이 포함된다.
**우선순위**: 높음 | **예상 소요**: 2h | **의존성**: BE-01

#### 완료 조건
- [ ] `TODO_STATUS`, `USER_ROLE`, `ERROR_CODES` 상수가 UPPER_SNAKE_CASE named export된다
- [ ] `jwt-utils.js`의 `signToken()`, `verifyToken()`이 HS-512 알고리즘을 사용한다
- [ ] `password-utils.js`의 `hashPassword()`, `comparePassword()`가 bcrypt를 사용한다
- [ ] `date-utils.js`의 `isOverdue()`가 `due_date < now() AND status = 'PENDING'` 조건을 정확히 판별한다
- [ ] 모든 유틸 함수가 Express `req`, `res` 의존성 없는 순수 함수이다

#### 작업 항목
- [ ] `src/constants/todo-status.js` 작성 (`PENDING`, `COMPLETED`, `OVERDUE`)
- [ ] `src/constants/user-role.js` 작성 (`ADMIN`, `USER`)
- [ ] `src/constants/error-codes.js` 작성 (UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT 등)
- [ ] `src/utils/jwt-utils.js` 작성 (`signToken`, `verifyToken` — HS512, 만료시간 환경변수)
- [ ] `src/utils/password-utils.js` 작성 (`hashPassword`, `comparePassword`)
- [ ] `src/utils/date-utils.js` 작성 (`isOverdue(dueDate, status)`)
- [ ] `src/utils/response-utils.js` 작성 (`successResponse`, `errorResponse` 헬퍼)

---

### BE-03: DB 연결 풀 및 환경변수 설정 모듈

**설명**: pg 라이브러리 Pool을 단일 지점에서 생성하고 환경변수 로드·검증 모듈을 구현한다.
**우선순위**: 높음 | **예상 소요**: 1h | **의존성**: BE-01, DB-01

#### 완료 조건
- [ ] `src/config/database.js`에서 Pool 인스턴스가 단일 생성되어 named export된다
- [ ] 필수 환경변수 누락 시 서버 기동이 중단된다
- [ ] DB 연결 테스트 쿼리(`SELECT 1`)가 성공한다
- [ ] DB 비밀번호가 로그에 출력되지 않는다

#### 작업 항목
- [ ] `src/config/env.js` 작성 (dotenv 로드, 필수 환경변수 검증, 누락 시 `process.exit(1)`)
- [ ] `src/config/database.js` 작성 (pg.Pool 인스턴스, named export)
- [ ] `src/app.js`에서 `env.js` 최우선 import 적용

---

### BE-04: 마이그레이션 및 Seed 스크립트

**설명**: DB 스키마 마이그레이션 실행 스크립트와 초기 admin 계정 Seed 스크립트를 구현한다.
**우선순위**: 높음 | **예상 소요**: 1.5h | **의존성**: BE-03, DB-01

#### 완료 조건
- [ ] `npm run db:migrate` 실행 시 테이블, 인덱스, 트리거가 생성된다
- [ ] `npm run db:seed` 실행 시 admin 계정이 생성되며 중복 실행 시 오류가 없다 (멱등성)
- [ ] admin 비밀번호가 bcrypt 해시로 저장된다

#### 작업 항목
- [ ] `src/db/migrations/001_create_users.sql` 작성
- [ ] `src/db/migrations/002_create_categories.sql` 작성
- [ ] `src/db/migrations/003_create_todos.sql` 작성
- [ ] `src/db/migrate.js` 작성 (파일 순번 정렬 후 순차 실행)
- [ ] `src/db/seeds/01_admin_user.js` 작성 (존재 확인 후 INSERT, bcrypt 해시)
- [ ] `package.json`에 `db:migrate`, `db:seed` 스크립트 등록

---

### BE-05: JWT 인증 미들웨어 및 역할 미들웨어

**설명**: 보호 라우트에 적용되는 JWT 인증 미들웨어와 ADMIN 전용 역할 검증 미들웨어를 구현한다.
**우선순위**: 높음 | **예상 소요**: 1.5h | **의존성**: BE-02

#### 완료 조건
- [ ] 토큰 없음/유효하지 않은 토큰에 대해 401 응답이 반환된다
- [ ] 유효한 토큰의 경우 `req.user`에 `{ id, username, role }`이 설정된다
- [ ] `requireAdmin` 미들웨어가 USER 역할 요청에 403을 반환한다
- [ ] 만료 토큰에 `TOKEN_EXPIRED` 오류 코드가 반환된다
- [ ] 로그에 JWT 전체 문자열이 출력되지 않는다

#### 작업 항목
- [ ] `src/middlewares/auth-middleware.js` 작성 (헤더 파싱, verifyToken, req.user 설정)
- [ ] `src/middlewares/role-middleware.js` 작성 (`requireAdmin` — role 검증, 403 반환)
- [ ] 토큰 만료/서명 오류 케이스별 오류 코드 분기 처리

---

### BE-06: 전역 에러 핸들러 및 요청 로거

**설명**: Express 전역 오류 핸들러와 요청/응답 로거 미들웨어를 구현한다.
**우선순위**: 높음 | **예상 소요**: 1.5h | **의존성**: BE-02

#### 완료 조건
- [ ] 모든 오류가 `{ success: false, error: { code, message } }` 구조로 반환된다
- [ ] `NODE_ENV=production`에서 스택 트레이스가 응답에 포함되지 않는다
- [ ] 요청 로그에 `userId`, `method`, `path`, `statusCode`, `responseTime`이 포함된다
- [ ] `password` 필드 및 `Authorization` 헤더가 로그에 노출되지 않는다

#### 작업 항목
- [ ] `src/middlewares/error-handler.js` 작성 (4인자 핸들러, 환경별 스택 분기)
- [ ] 커스텀 `AppError` 클래스 작성 (`message`, `code`, `statusCode`)
- [ ] `src/middlewares/logger.js` 작성 (요청/응답 로깅, password·Authorization 마스킹)
- [ ] `src/app.js`에 로거(라우터 앞), 에러핸들러(라우터 뒤) 등록

---

### BE-07: 입력 유효성 검증 미들웨어

**설명**: 각 API 엔드포인트의 요청 본문·쿼리 파라미터에 대한 입력 유효성 검증 미들웨어를 구현한다.
**우선순위**: 높음 | **예상 소요**: 2h | **의존성**: BE-06

#### 완료 조건
- [ ] 필수 필드 누락 시 400 + `VALIDATION_ERROR` 코드로 응답한다
- [ ] username 4~20자 영문·숫자 미준수 시 400 반환된다
- [ ] title 200자 초과, description 1000자 초과 시 400 반환된다
- [ ] colorCode hex 형식 미준수 시 400 반환된다

#### 작업 항목
- [ ] `src/middlewares/validators/auth-validator.js` 작성 (`validateRegister`, `validateLogin`)
- [ ] `src/middlewares/validators/todo-validator.js` 작성 (`validateCreateTodo`, `validateUpdateTodo`)
- [ ] `src/middlewares/validators/category-validator.js` 작성 (`validateCreateCategory`, `validateUpdateCategory`)
- [ ] `src/middlewares/validators/admin-validator.js` 작성 (`validateUpdateUserStatus`)
- [ ] 실패 시 `next(new AppError(...))` 방식으로 에러 핸들러에 위임

---

### BE-08: 인증 API 구현 (회원가입, 로그인)

**설명**: FR-01(회원가입), FR-02(로그인) API를 Repository → Service → Controller → Route 레이어 전체로 구현한다.
**우선순위**: 높음 | **예상 소요**: 3h | **의존성**: BE-03, BE-05, BE-06, BE-07

#### 완료 조건
- [ ] `POST /api/auth/register` 성공 시 201 + 사용자 정보 반환 (password 미포함)
- [ ] username 중복 시 409 + `CONFLICT` 코드 반환
- [ ] `POST /api/auth/login` 성공 시 200 + JWT 토큰 반환
- [ ] 잘못된 자격증명 시 401 + `UNAUTHORIZED` 반환
- [ ] 비활성 계정 로그인 시 401 + `ACCOUNT_DISABLED` 반환 (BR-12)
- [ ] 비밀번호가 bcrypt 해시로 DB에 저장된다

#### 작업 항목
- [ ] `src/repositories/user-repository.js` 작성 (`findByUsername`, `createUser`, `findById`)
- [ ] `src/services/auth-service.js` 작성 (`register`, `login`)
- [ ] `src/controllers/auth-controller.js` 작성 (`register`, `login` 핸들러)
- [ ] `src/routes/auth-routes.js` 작성 (미들웨어 + 컨트롤러 연결)
- [ ] `src/app.js`에 `/api/auth` prefix 등록

---

### BE-09: 할일 API 구현 (CRUD + 완료/완료취소)

**설명**: FR-05~FR-11에 해당하는 할일 전체 API를 레이어 전체로 구현한다. OVERDUE 런타임 판별 로직이 Service에 포함된다.
**우선순위**: 높음 | **예상 소요**: 5h | **의존성**: BE-03, BE-05, BE-06, BE-07, BE-08

#### 완료 조건
- [ ] `GET /api/todos` 요청 시 본인 할일만 반환 (ADMIN은 전체), 카테고리/상태 필터 동작 (BR-02, FR-06)
- [ ] OVERDUE 판별 결과가 응답 `status`에 반영되며 DB에는 'PENDING'으로 저장 (BR-07)
- [ ] 타인 todo 접근 시 404로 처리 (BR-02)
- [ ] `PATCH .../complete` 성공 시 `completedAt`이 기록됨 (BR-08)
- [ ] `PATCH .../uncomplete` 성공 시 `completedAt: null`로 초기화 (FR-11)
- [ ] 응답 DTO에서 snake_case → camelCase 변환 (LA-03)

#### 작업 항목
- [ ] `src/repositories/todo-repository.js` 작성 (findAll, findById, create, update, deleteById, complete, uncomplete)
- [ ] `src/services/todo-service.js` 작성 (`toTodoDto` — OVERDUE 판별 포함, getTodos, getTodoById, createTodo, updateTodo, deleteTodo, completeTodo, uncompleteTodo)
- [ ] `src/controllers/todo-controller.js` 작성 (7개 핸들러)
- [ ] `src/routes/todo-routes.js` 작성 (authenticate 미들웨어 공통 적용)
- [ ] `src/app.js`에 `/api/todos` prefix 등록

---

### BE-10: 카테고리 API 구현 (CRUD)

**설명**: FR-13~FR-16에 해당하는 카테고리 API를 레이어 전체로 구현한다. 사용자 내 카테고리명 중복 검증이 포함된다.
**우선순위**: 높음 | **예상 소요**: 3h | **의존성**: BE-03, BE-05, BE-06, BE-07, BE-08

#### 완료 조건
- [ ] `GET /api/categories` 요청 시 본인 카테고리 목록만 반환 (BR-04)
- [ ] 중복 카테고리명 시 409 + `CONFLICT` 반환 (BR-06)
- [ ] `DELETE` 성공 시 204 반환, 연결 todos의 `category_id`는 null 유지 (BR-05)
- [ ] 타인 카테고리 접근 시 404 처리 (BR-02)

#### 작업 항목
- [ ] `src/repositories/category-repository.js` 작성 (findAllByUserId, findById, findByNameAndUserId, create, update, deleteById)
- [ ] `src/services/category-service.js` 작성 (toCategoryDto, getCategories, createCategory, updateCategory, deleteCategory)
- [ ] `src/controllers/category-controller.js` 작성 (4개 핸들러)
- [ ] `src/routes/category-routes.js` 작성 (authenticate 공통 적용)
- [ ] `src/app.js`에 `/api/categories` prefix 등록

---

### BE-11: 관리자 API 구현 (사용자 관리)

**설명**: FR-18(사용자 목록 조회), FR-19(계정 활성/비활성) ADMIN 전용 API를 구현한다. 기본 admin 계정 비활성화 방지 규칙이 포함된다.
**우선순위**: 중간 | **예상 소요**: 2.5h | **의존성**: BE-03, BE-05, BE-06, BE-07, BE-08

#### 완료 조건
- [ ] `GET /api/admin/users`는 ADMIN만 접근 가능하며 전체 사용자 목록 반환 (FR-18)
- [ ] 응답에 `password` 필드가 포함되지 않는다
- [ ] admin 계정 비활성화 시도 시 400 + `ADMIN_DEACTIVATION_FORBIDDEN` 반환
- [ ] USER 역할로 접근 시 403 반환

#### 작업 항목
- [ ] `src/repositories/user-repository.js`에 `findAll()`, `updateStatus(id, isActive)` 추가
- [ ] `src/services/admin-service.js` 작성 (toUserDto — password 제외, getAllUsers, updateUserStatus)
- [ ] `src/controllers/admin-controller.js` 작성 (`listUsers`, `updateUserStatus` 핸들러)
- [ ] `src/routes/admin-routes.js` 작성 (authenticate + requireAdmin 공통 적용)
- [ ] `src/app.js`에 `/api/admin` prefix 등록

---

### BE-12: Service 레이어 단위 테스트

**설명**: 핵심 비즈니스 로직이 집중된 Service 레이어의 단위 테스트를 작성한다. Service 80% 이상 커버리지 목표.
**우선순위**: 중간 | **예상 소요**: 4h | **의존성**: BE-08, BE-09, BE-10, BE-11

#### 완료 조건
- [ ] `npm test` 실행 시 모든 단위 테스트가 통과한다
- [ ] Service 레이어 코드 커버리지가 80% 이상이다
- [ ] Repository 의존성이 `jest.mock()`으로 격리된다
- [ ] OVERDUE 판별 테스트에서 `new Date()`가 Mock 처리된다
- [ ] 정상/오류 경로가 모두 테스트된다

#### 작업 항목
- [ ] `jest.config.js` 작성 (커버리지 임계값 80%, 대상 `src/services/**`)
- [ ] `src/services/auth-service.test.js` (register 정상/중복, login 정상/비밀번호오류/비활성)
- [ ] `src/services/todo-service.test.js` (toTodoDto OVERDUE 판별 4가지 케이스, 소유권 검증)
- [ ] `src/services/category-service.test.js` (생성 정상/중복, 수정 소유권/중복, 삭제 소유권)
- [ ] `src/services/admin-service.test.js` (비활성화 정상, admin 계정 비활성화 오류)

---

### BE-13: 주요 API 통합 테스트

**설명**: Supertest를 사용하여 HTTP 요청부터 DB 응답까지 전체 흐름을 검증하는 통합 테스트를 작성한다.
**우선순위**: 중간 | **예상 소요**: 4h | **의존성**: BE-12, DB-01

#### 완료 조건
- [ ] `npm run test:integration` 실행 시 모든 통합 테스트가 통과한다
- [ ] 각 테스트 케이스 전후 DB 상태가 초기화된다
- [ ] 미인증 접근 시 401, USER의 ADMIN 접근 시 403이 검증된다

#### 작업 항목
- [ ] `.env.test` 설정 (테스트 전용 DB 분리)
- [ ] `tests/helpers/test-setup.js` 작성 (TRUNCATE 헬퍼, 사용자 생성 헬퍼, JWT 발급 헬퍼)
- [ ] `tests/integration/auth.test.js` 작성 (register 201/409/400, login 200/401)
- [ ] `tests/integration/todos.test.js` 작성 (목록조회, OVERDUE 반영, 완료처리, 삭제, 타인 접근 404)
- [ ] `tests/integration/categories.test.js` 작성 (생성 201/409, 삭제 후 todos.category_id null 검증)
- [ ] `tests/integration/admin.test.js` 작성 (사용자 목록 ADMIN/USER 분기, admin 비활성화 400)
- [ ] `package.json`에 `test:integration` 스크립트 등록

---

## 프론트엔드 (FE)

---

### FE-01: 프로젝트 초기 세팅

**설명**: Vite + React 19 기반 프론트엔드 프로젝트를 생성하고 TanStack Query, Zustand, Tailwind CSS, React Router, ESLint, Prettier를 설치·구성한다.
**우선순위**: 높음 | **예상 소요**: 2h | **의존성**: 없음

#### 완료 조건
- [ ] `npm run dev`로 Vite 개발 서버가 정상 기동된다
- [ ] 모든 패키지가 설치되어 import 가능하다
- [ ] ESLint 및 Prettier 검사가 오류 없이 완료된다
- [ ] `src/main.jsx`에 QueryClientProvider, BrowserRouter 설정이 조립된다
- [ ] `.env.example`에 `VITE_API_BASE_URL` 항목이 문서화된다

#### 작업 항목
- [ ] `npm create vite@latest frontend -- --template react` 실행
- [ ] TanStack Query, Zustand, React Router DOM 설치
- [ ] Tailwind CSS 설치 및 설정 (`tailwind.config.js`, `src/styles/index.css`)
- [ ] ESLint, Prettier 설치 및 설정 파일 작성
- [ ] `src/main.jsx`에 Provider 조립
- [ ] 문서 기준 디렉토리 구조 전체 생성
- [ ] `.env.example` 생성 (`VITE_API_BASE_URL=http://localhost:3000`)

---

### FE-02: 공통 원자 컴포넌트 구현

**설명**: 여러 화면에서 재사용 가능한 도메인 비종속 원자 컴포넌트를 `src/components/common/`에 구현한다.
**우선순위**: 높음 | **예상 소요**: 3h | **의존성**: FE-01

#### 완료 조건
- [ ] `Button`, `Input`, `Dialog`, `Badge`, `Spinner` 컴포넌트가 독립 파일로 존재한다
- [ ] 각 컴포넌트는 비즈니스 로직 없이 props만으로 제어된다
- [ ] `Badge`는 PENDING/COMPLETED/OVERDUE에 따라 색상을 달리 표시한다
- [ ] 모두 Tailwind CSS 클래스만으로 스타일링된다
- [ ] 모바일(375px)/데스크탑(1280px)에서 레이아웃이 깨지지 않는다

#### 작업 항목
- [ ] `Button.jsx` 구현 (variant, size, disabled, isLoading props)
- [ ] `Input.jsx` 구현 (label, error, value, onChange props)
- [ ] `Dialog.jsx` 구현 (isOpen, onClose, onConfirm, title, children)
- [ ] `Badge.jsx` 구현 (PENDING: 회색, COMPLETED: 초록, OVERDUE: 빨강)
- [ ] `Spinner.jsx` 구현 (Tailwind animate-spin)
- [ ] `src/components/common/index.js` 생성 (named export 일괄)

---

### FE-03: 라우터 설정 및 ProtectedRoute

**설명**: React Router로 전체 라우트를 정의하고 비인증 접근을 로그인 화면으로 리다이렉트하는 ProtectedRoute를 구현한다 (BR-01, FR-04).
**우선순위**: 높음 | **예상 소요**: 2h | **의존성**: FE-01, FE-04

#### 완료 조건
- [ ] 모든 화면 라우트가 `src/router/index.jsx`에 정의된다
- [ ] 유효한 JWT 미존재 시 `/login`으로 리다이렉트된다
- [ ] `/admin/users`는 ADMIN role만 접근 가능하다
- [ ] 인증된 사용자의 `/login`, `/register` 접근 시 `/todos`로 리다이렉트된다

#### 작업 항목
- [ ] `src/router/ProtectedRoute.jsx` 구현 (auth-store 토큰 확인, 리다이렉트)
- [ ] `src/router/index.jsx` 작성 (모든 경로 정의 및 ProtectedRoute 적용)
- [ ] 리다이렉트 전 URL을 sessionStorage에 저장, 로그인 성공 후 해당 경로로 이동 (SC-EX-03)
- [ ] ADMIN role 검증 처리 (`requiredRole` prop 또는 별도 컴포넌트)

---

### FE-04: Zustand auth-store 및 token-storage

**설명**: JWT 토큰과 인증 사용자 정보를 관리하는 Zustand auth-store와 localStorage 기반 token-storage 유틸을 구현한다.
**우선순위**: 높음 | **예상 소요**: 2h | **의존성**: FE-01

#### 완료 조건
- [ ] `auth-store.js`에 token, user, isAuthenticated 상태와 setAuth, clearAuth 액션이 정의된다
- [ ] 앱 초기 로드 시 localStorage 토큰이 존재하면 auth-store에 자동 복원된다
- [ ] `clearAuth()` 호출 시 localStorage 토큰도 함께 제거된다
- [ ] `token-storage.js`는 React 의존성 없는 순수 함수로 구성된다
- [ ] `ui-store.js`에 모달 상태 등 UI 전역 상태가 분리 정의된다

#### 작업 항목
- [ ] `src/utils/token-storage.js` 구현 (`getToken`, `setToken`, `removeToken`)
- [ ] `src/store/auth-store.js` 구현 (Zustand create, token/user/isAuthenticated/setAuth/clearAuth)
- [ ] 앱 초기화 지점에서 `getToken()`으로 auth-store 복원 로직 추가
- [ ] `src/store/ui-store.js` 구현 (isDialogOpen 등 UI 상태)
- [ ] `src/constants/user-role.js` 생성

---

### FE-05: API 클라이언트 기반 구축

**설명**: 모든 HTTP 요청에 공통 적용되는 fetch wrapper를 구현한다. Bearer 토큰 자동 첨부, 공통 에러 처리, 401 시 자동 로그아웃을 담당한다.
**우선순위**: 높음 | **예상 소요**: 2h | **의존성**: FE-01, FE-04

#### 완료 조건
- [ ] `src/api/http-client.js`에 공통 fetch wrapper가 구현된다
- [ ] 모든 요청에 `Authorization: Bearer {token}` 헤더가 자동 첨부된다
- [ ] `{ success: false, error }` 응답을 파싱하여 일관된 에러를 throw한다
- [ ] 401 수신 시 auth-store 초기화 및 `/login` 리다이렉트가 동작한다
- [ ] `src/constants/api-endpoints.js`에 모든 API 경로 상수가 정의된다

#### 작업 항목
- [ ] `src/constants/api-endpoints.js` 구현 (NM-04 기준 모든 엔드포인트 상수)
- [ ] `src/api/http-client.js` 구현 (`request` 함수: baseURL 조합, 헤더 첨부, 응답 파싱, 401 처리)
- [ ] `get`, `post`, `put`, `patch`, `del` 편의 함수 내보내기
- [ ] `src/constants/todo-status.js` 생성

---

### FE-06: 인증 화면 구현 (로그인/회원가입)

**설명**: 로그인(FR-02)과 회원가입(FR-01) 화면을 구현하고 관련 Hook·API 함수를 작성한다.
**우선순위**: 높음 | **예상 소요**: 3h | **의존성**: FE-02, FE-03, FE-04, FE-05, BE-08

#### 완료 조건
- [ ] 로그인 성공 시 `/todos`로 이동하고 토큰이 저장된다
- [ ] 비활성 계정 로그인 시 "비활성화된 계정입니다." 메시지가 표시된다 (SC-EX-02)
- [ ] 잘못된 자격증명 시 "아이디 또는 비밀번호가 올바르지 않습니다." 메시지가 표시된다
- [ ] 회원가입 성공 시 `/login`으로 이동한다
- [ ] username 중복 시 "이미 사용 중인 사용자 이름입니다." 메시지가 표시된다 (SC-EX-01)
- [ ] API 호출 중 버튼이 disabled + Spinner 상태로 표시된다

#### 작업 항목
- [ ] `src/api/auth-api.js` 구현 (`register`, `login`)
- [ ] `src/hooks/useAuth.js` 구현 (`useLogin`, `useRegister` — useMutation, 성공 시 setAuth + navigate)
- [ ] `src/utils/validators.js` 구현 (`validateUsername`, `validatePassword`)
- [ ] `src/pages/LoginPage.jsx` 구현 (폼, 에러 메시지, 회원가입 링크)
- [ ] `src/pages/RegisterPage.jsx` 구현 (폼, 에러 메시지, 로그인 링크)
- [ ] 로그인 성공 후 sessionStorage redirect URL 처리
- [ ] 로그아웃: `clearAuth()` + navigate('/login')

---

### FE-07: 카테고리 관리 화면

**설명**: 카테고리 목록 조회(FR-14), 등록(FR-13), 수정(FR-15), 삭제(FR-16) 기능을 TanStack Query로 구현한다.
**우선순위**: 높음 | **예상 소요**: 4h | **의존성**: FE-02, FE-03, FE-05, BE-10

#### 완료 조건
- [ ] 카테고리 목록이 표시되고 추가 후 즉시 목록이 갱신된다
- [ ] 중복 카테고리명 시 "이미 사용 중인 카테고리 이름입니다." 표시 (SC-EX-05)
- [ ] 삭제 시 "연결된 할일의 카테고리가 해제됩니다." 확인 Dialog 표시 (FR-16)
- [ ] colorCode 기반 색상이 각 카테고리에 표시된다
- [ ] 로딩 중 Spinner가 표시된다

#### 작업 항목
- [ ] `src/api/category-api.js` 구현 (getCategories, createCategory, updateCategory, deleteCategory)
- [ ] `src/hooks/useCategories.js` 구현 (useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory — invalidate 포함)
- [ ] `src/pages/CategoryPage.jsx` 구현 (레이아웃 조합)
- [ ] `src/components/CategoryCard.jsx` 구현 (색상점, name, 수정/삭제 버튼)
- [ ] `src/components/CategoryForm.jsx` 구현 (name Input, colorCode Input, 저장/취소)
- [ ] 삭제 확인 Dialog 연동
- [ ] 반응형 그리드 레이아웃 적용

---

### FE-08: 할일 목록 화면

**설명**: 할일 목록 조회(FR-06), 카테고리/상태 필터(FR-17), OVERDUE 표시(FR-12), 완료/완료취소(FR-10, FR-11) 기능을 구현한다.
**우선순위**: 높음 | **예상 소요**: 5h | **의존성**: FE-02, FE-03, FE-05, FE-07, BE-09

#### 완료 조건
- [ ] OVERDUE 항목이 빨간 Badge로 표시된다 (서버 응답값 기준, 클라이언트 시각 미사용)
- [ ] 카테고리/상태 필터가 정상 동작한다
- [ ] 완료 처리/완료 취소 후 목록이 즉시 갱신된다
- [ ] 빈 목록 시 안내 메시지와 등록 유도 버튼이 표시된다
- [ ] 삭제 시 확인 Dialog가 표시된다

#### 작업 항목
- [ ] `src/api/todo-api.js` 구현 (getTodos, deleteTodo, completeTodo, uncompleteTodo)
- [ ] `src/hooks/useTodos.js` 구현 (useTodos, useCompleteTodo, useUncompleteTodo, useDeleteTodo)
- [ ] `src/pages/TodoListPage.jsx` 구현 (필터 + 목록 레이아웃)
- [ ] `src/components/TodoCard.jsx` 구현 (제목, 카테고리 Badge, 상태 Badge, dueDate, 완료/삭제 버튼)
- [ ] `src/components/TodoFilter.jsx` 구현 (카테고리 필터, 상태 필터)
- [ ] 삭제 확인 Dialog 연동
- [ ] 반응형 레이아웃 (모바일 1열, 데스크탑 다열)

---

### FE-09: 할일 등록/수정 화면

**설명**: 할일 등록(FR-05)과 수정(FR-08)을 하나의 폼 화면으로 구현한다.
**우선순위**: 높음 | **예상 소요**: 4h | **의존성**: FE-02, FE-03, FE-05, FE-07, FE-08, BE-09

#### 완료 조건
- [ ] `/todos/new`에서 등록 폼, `/todos/:id/edit`에서 기존 데이터 pre-fill 수정 폼이 표시된다
- [ ] title 미입력/200자 초과 시 오류 메시지가 표시된다 (BR-10)
- [ ] categoryId 미선택(null) 허용이다 (BR-09)
- [ ] 저장 성공 시 `/todos`로 이동하고 캐시가 갱신된다

#### 작업 항목
- [ ] `src/api/todo-api.js`에 `createTodo`, `updateTodo` 추가
- [ ] `src/hooks/useTodos.js`에 `useTodo`, `useCreateTodo`, `useUpdateTodo` 추가
- [ ] `src/pages/TodoFormPage.jsx` 구현 (id 유무로 등록/수정 모드 분기)
- [ ] `src/components/TodoForm.jsx` 구현 (title, description, categoryId select, dueDate, 저장/취소)
- [ ] 수정 모드: `useTodo(id)`로 기존 데이터 조회 후 폼 초기값 설정
- [ ] 반응형: 모바일 전체 너비, 데스크탑 중앙 정렬 카드

---

### FE-10: 관리자 화면

**설명**: ADMIN 전용 사용자 관리 화면(FR-18, FR-19)을 구현한다. 기본 admin 계정 비활성화 버튼은 클라이언트에서 disabled 처리한다.
**우선순위**: 중간 | **예상 소요**: 3h | **의존성**: FE-02, FE-03, FE-05, BE-11

#### 완료 조건
- [ ] `/admin/users`는 ADMIN만 접근 가능하다
- [ ] 전체 사용자 목록이 username, role, isActive, createdAt과 함께 표시된다
- [ ] `admin` 계정의 비활성화 버튼이 disabled 처리된다 (SC-AD-03)
- [ ] 비활성화 처리 전 확인 Dialog가 표시된다 (SC-AD-02)
- [ ] isActive 상태에 따라 활성(초록)/비활성(빨강) Badge가 표시된다

#### 작업 항목
- [ ] `src/api/admin-api.js` 구현 (`getUsers`, `updateUserStatus`)
- [ ] `src/hooks/useAdmin.js` 구현 (`useUsers`, `useUpdateUserStatus` — invalidate 포함)
- [ ] `src/pages/AdminUserPage.jsx` 구현 (목록 레이아웃)
- [ ] `src/components/UserTable.jsx` 구현 (username, role, isActive Badge, createdAt, 토글 버튼)
- [ ] `admin` 계정 disabled 처리 및 안내 문구 표시
- [ ] 비활성화 확인 Dialog 연동
- [ ] ADMIN 전용 네비게이션 메뉴 조건부 표시

---

### FE-11: 반응형 레이아웃 적용 및 UI 통합 점검

**설명**: 전체 화면에 반응형 레이아웃을 최종 점검하고 공통 네비게이션, 빈 상태, 에러 상태 UI를 통합 완성한다.
**우선순위**: 중간 | **예상 소요**: 3h | **의존성**: FE-06, FE-07, FE-08, FE-09, FE-10

#### 완료 조건
- [ ] 모바일(375px), 데스크탑(1280px)에서 모든 화면 레이아웃이 깨지지 않는다 (NFR-05)
- [ ] Chrome, Edge, Safari 최신 버전에서 주요 기능이 정상 동작한다 (NFR-08)
- [ ] 공통 Header에 로그아웃, 카테고리 관리, 할일 목록 링크가 표시된다
- [ ] ADMIN에게만 "사용자 관리" 메뉴가 표시된다
- [ ] 데이터 없는 화면에서 빈 상태 안내 메시지가 표시된다
- [ ] 로그인 → 카테고리 등록 → 할일 등록 → 완료 처리 → 로그아웃 전체 흐름이 정상 동작한다

#### 작업 항목
- [ ] `src/components/Layout.jsx` 구현 (Header + `<Outlet />` 공통 레이아웃)
- [ ] `src/components/Header.jsx` 구현 (네비게이션 링크, 로그아웃 버튼, ADMIN 메뉴 조건부)
- [ ] 모바일 햄버거 메뉴 또는 탭 네비게이션 적용
- [ ] TanStack Query 전역 `onError` 핸들러 설정
- [ ] `src/components/EmptyState.jsx` 구현 (안내 메시지 + 액션 버튼)
- [ ] 375px / 768px / 1280px 해상도 레이아웃 검증 및 Tailwind 반응형 클래스 보정
- [ ] ESLint 전체 검사 및 경고/오류 해소
- [ ] Prettier 전체 포맷 실행
- [ ] 전체 흐름 E2E 수동 검증

---

*본 문서는 PRD(2-prd.md v1.0.0), 도메인 정의서(1-domain-definition.md v1.1.0), 설계 원칙(4-architecture-principles.md v1.1.0)을 기반으로 작성되었다.*
