# TodoList 기술 아키텍처 다이어그램

> 버전: 1.0.0 | 작성일: 2026-04-28 | 작성자: chpark

---

## 변경이력

| 버전 | 변경일 | 작성자 | 변경 유형 | 변경 내용 |
|------|--------|--------|-----------|-----------|
| 1.0.0 | 2026-04-28 | chpark | 최초 작성 | 아키텍처 다이어그램 초안 작성 |

---

## 1. 시스템 전체 구조 (3-Tier)

```mermaid
graph TD
    subgraph Client["Presentation Tier"]
        B["Browser<br/>(React 19 + Tailwind CSS)"]
    end

    subgraph Server["Application Tier"]
        E["Express 5<br/>(Node.js 24)"]
    end

    subgraph DB["Data Tier"]
        P[("PostgreSQL")]
    end

    B -- "HTTP/REST + JWT" --> E
    E -- "pg (SQL)" --> P
```

---

## 2. 백엔드 레이어 구조

```mermaid
graph LR
    Route --> Controller
    Controller --> Service
    Service --> Repository
    Repository --> DB[("PostgreSQL")]
```

> 의존 방향은 단방향. 레이어 건너뛰기 금지.

---

## 3. 프론트엔드 레이어 구조

```mermaid
graph LR
    Page --> Component
    Component --> Hook
    Hook --> API["API Client<br/>(TanStack Query)"]
    API -- "HTTP" --> Server["Express Server"]

    Hook -- "전역상태" --> Store["Zustand Store"]
```

---

## 4. 도메인 모델 (ERD)

```mermaid
erDiagram
    USER {
        uuid id PK
        string username
        string password
        enum role
        boolean is_active
        timestamp created_at
    }
    CATEGORY {
        uuid id PK
        uuid user_id FK
        string name
        string color_code
        timestamp created_at
    }
    TODO {
        uuid id PK
        uuid user_id FK
        uuid category_id FK
        string title
        string description
        timestamp due_date
        enum status
        timestamp created_at
        timestamp updated_at
        timestamp completed_at
    }

    USER ||--o{ CATEGORY : "owns"
    USER ||--o{ TODO : "owns"
    CATEGORY ||--o{ TODO : "classifies"
```

---

## 5. 할일 상태 전이

```mermaid
stateDiagram-v2
    [*] --> PENDING : 할일 등록
    PENDING --> COMPLETED : 완료 처리
    PENDING --> OVERDUE : dueDate 경과\n(런타임 판별)
    OVERDUE --> COMPLETED : 완료 처리
    COMPLETED --> PENDING : 완료 취소
```

> OVERDUE 는 DB에 저장되지 않으며, 서버가 응답 시 `dueDate` vs 현재 시각으로 런타임 판별한다.

---

## 6. 인증 흐름 (JWT)

```mermaid
sequenceDiagram
    participant C as Client
    participant E as Express
    participant DB as PostgreSQL

    C->>E: POST /api/auth/login
    E->>DB: username 조회
    DB-->>E: user row
    E->>E: bcrypt 비밀번호 검증
    E-->>C: JWT (HS-512)

    C->>E: GET /api/todos<br/>Authorization: Bearer <token>
    E->>E: JWT 서명·만료 검증
    E->>DB: SELECT todos WHERE user_id = ?
    DB-->>E: todo rows
    E->>E: OVERDUE 런타임 판별
    E-->>C: 200 OK { data: [...] }
```

---

*본 문서는 PRD(2-prd.md v1.0.0) 및 설계 원칙(4-architecture-principles.md v1.1.0)을 기반으로 한다.*
