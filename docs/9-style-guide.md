# TodoList 프론트엔드 스타일 가이드

> 버전: 1.0.0 | 작성일: 2026-04-29 | 작성자: chpark

---

## 변경이력

| 버전 | 변경일 | 작성자 | 변경 유형 | 변경 내용 |
|------|--------|--------|-----------|-----------|
| 1.0.0 | 2026-04-29 | chpark | 최초 작성 | 프론트엔드 스타일 가이드 초안 작성 |

---

## 참조 문서

| 문서 | 경로 |
|------|------|
| 아키텍처 설계 원칙 | docs/4-architecture-principles.md (v1.1.0) |
| 와이어프레임 | docs/8-wireframe.md (v1.0.0) |
| PRD | docs/2-prd.md (v1.0.0) |

---

## 1. 디자인 시스템 원칙

프론트엔드는 아키텍처 설계 원칙의 최상위 공통 원칙(CP-01~CP-06)을 준수한다.

### DS-01 디자인 시스템 기반

**원칙명**: 디자인 시스템은 백엔드의 모듈化和와 동일한 원칙을 적용한다.

**Why**: 일관된 UI 패턴은 개발 생산성을 높이고 유지보수성을 보장한다.

**How**:

- 모든 UI 요소는 재사용 가능한 원자(Atom) 컴포넌트로 분리한다.
- 원자 컴포넌트는 단일 책임 원칙을 따른다. (버튼은 클릭 처리, 입력栏은 값 입력만 담당)
- 컴포넌트 Props는 명시적으로 정의하고 암묵적 props 전달을 금지한다.
- styled-components를 사용하여 컴포넌트와 스타일을 함께 관리한다.

---

## 2. 색상 시스템

### 색상 팔레트

**원칙명**:的颜色은 의미를 명확히 하고 일관되게 사용한다.

**How**:

| 용도 | 색상 이름 | Hex códigos | 용도 설명 |
|------|----------|------------|-----------|
| Primary | Indigo | #4F46E5 | 주요 버튼, 링크, 활성 상태 |
| Primary Dark | Indigo 700 | #4338CA | 호버 상태의 Primary |
| Primary Light | Indigo 50 | #EEF2FF | Primary 배경, 강조 구역 |
| Secondary | Slate | #64748B | 보조 텍스트, 비활성 상태 |
| Background | White | #FFFFFF | 페이지 배경 |
| Surface | Gray 50 | #F8FAFC | 카드, 입력欄 배경 |
| Border | Gray 200 | #E2E8F0 | 구분선, 테두리 |
| Text Primary | Gray 900 | #0F172A | 제목, 주요 텍스트 |
| Text Secondary | Gray 600 | #475569 | 보조 설명 텍스트 |
| Text Muted | Gray 400 | #94A3B8 | 플레이스홀더, 비활성 텍스트 |
| Success | Emerald | #10B981 | 완료 상태, 성공 메시지 |
| Error | Red | #EF4444 | 오류 상태, 삭제 버튼 |
| Warning | Amber | #F59E0B | 경고 메시지 |

### 할일 상태 색상

**원칙명**: 할일 상태(PENDING, COMPLETED, OVERDUE)는 색상으로 직관적으로 구분한다.

**How**:

| 상태 | Primary color | 배경색 ||border 색상 | 사용场景 |
|------|--------------|--------|-----------|-----------|
| PENDING | Gray 500 (#64748B) | Gray 100 (#F1F5F9) | Gray 300 (#CBD5E1) | 대기 중 할일 |
| COMPLETED | Emerald 500 (#10B981) | Emerald 50 (#ECFDF5) | Emerald 200 (#A7F3D0) | 완료된 할일 |
| OVERDUE | Red 500 (#EF4444) | Red 50 (#FEF2F2) | Red 200 (#FECACA) | 기한 초과 할일 |

### 카테고리 색상

**원칙명**: 카테고리는 사용자 지정 색상을 지원하며 기본 색상 세트를 제공한다.

**How**:

기본 카테고리 색상 세트:

| 색상 이름 | Hex códigos |
|----------|------------|
| Blue | #3B82F6 |
| Green | #22C55E |
| Yellow | #EAB308 |
| Orange | #F97316 |
| Red | #EF4444 |
| Purple | #8B5CF6 |
| Pink | #EC4899 |
| Cyan | #06B6D4 |

---

## 3. 타이포그래피

### 폰트 스택

**원칙명**: 일관된 폰트 시스템을 사용한다.

**How**:

```css
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

- Pretendard를 기본 폰트로 사용하고, 시스�� 폰트를 폴백으로 제공한다.
- 웹 폰트는 프로젝트 빌드 시점에서 최적화한다.

### 폰트 크기 체계

**원칙명**: 의미론적 폰트 크기를 사용하고 예측 가능한 크기를 적용한다.

**How**:

| 용도 | 크기 | 행 높이 | font-weight |
|------|------|---------|----------|
| 페이지 제목 (h1) | 32px (2rem) | 1.2 | 700 |
| 섹션 제목 (h2) | 24px (1.5rem) | 1.3 | 600 |
| 카드 제목 (h3) | 18px (1.125rem) | 1.4 | 600 |
| 본문 | 16px (1rem) | 1.5 | 400 |
| 보조 텍스트 | 14px (0.875rem) | 1.5 | 400 |
| 작은 텍스트 | 12px (0.75rem) | 1.4 | 400 |

### 폰트 사용 규칙

- 제목은 Bold(600~700), 본문은 Regular(400)를 기본으로 한다.
- 제목에서 의도가 없는 경우 bold를 제거하고, 필수的情况에만 명시的に 적용한다.
- 폰트 크기 12px 이하에서는 行 높이 1.5 이상을 유지한다.

---

## 4. 간격 체계

### 스페이스 시스템

**원칙명**: 일관된 간격 단위를 사용하고 예측 가능한 레이아웃을 구성한다.

**How**:

| 크기 이름 | 크기 | 활용场景 |
|----------|------|--------|
| xs | 4px (0.25rem) | 아이콘과 텍스트 간격,裌밀한 요소 간격 |
| sm | 8px (0.5rem) | 컴포넌트 내부 패딩, 작은 요소 간격 |
| md | 16px (1rem) | 기본 컴포넌트 간격, 일반적인 패딩 |
| lg | 24px (1.5rem) | 섹션 간격, 카드 내부 패딩 |
| xl | 32px (2rem) | 페이지 섹션 간격 |
| 2xl | 48px (3rem) | 큰 섹션 간격 |

### 레이아웃 원칙

- 카드 내부 패딩: 16px (lg)
- 카드 간 간격: 12px (md - sm 사이)
- 페이지 좌우 여백: 16px (모바일), 24px (태블릿), 32px (데스크탑)
- 최대 콘텐츠 너비: 640px (阅读 가독성을 위한 최적 너비)

---

## 5. 컴포넌트 설계 원칙

### CD-01 원자 컴포넌트

**원칙명**: 가장 기본이 되는 UI 요소는 도메인에 종속되지 않는 원자 컴포넌트로 분리한다.

**Why**: 재사용성을 극대화하고 비즈니스 로직과 UI를 분리한다.

**How**:

원자 컴포넌트 디렉토리: `src/components/common/`

| 컴포넌트 | 역할 | Props |
|----------|------|------|
| Button | 클릭 가능한 버튼 | variant (primary/secondary/danger), size (sm/md/lg), disabled, children |
| Input | 텍스트 입력 | type, placeholder, error, disabled, value, onChange |
| Dialog | 모달 다이얼로그 | isOpen, onClose, title, children |
| Badge | 상태/카테고리 표시 | variant (pending/completed/overdue/custom), color, children |
| Spinner | 로딩 인디케이터 | size (sm/md/lg) |
| Select | 드롭다운 선택 | options, value, onChange, placeholder |
| Checkbox | 체크박스 | checked, onChange, label |

### CD-01-1 Button 컴포넌트

```jsx
// 올바른 사용 예시
<Button variant="primary" size="md" onClick={handleSubmit}>
  저장
</Button>

<Button variant="danger" size="sm" disabled>
  삭제
</Button>
```

- variant: 버튼 용도에 따라 primary, secondary, danger, ghost中选择
- size: sm (32px), md (40px), lg (48px)
- disabled: 비활성화 상태 명시

### CD-01-2 Input 컴포넌트

```jsx
// 올바른 사용 예시
<Input
  type="text"
  placeholder="할일을 입력하세요"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  error={errors.title}
/>

<Input
  type="password"
  placeholder="비밀번호"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

- type: text, password, email, number 등 HTML input type 지원
- error: 오류 메시지 문자열을 전달하면 오류 상태로 렌더링
- disabled: 비활성화 상태 지원

### CD-01-3 Badge 컴포넌트

```jsx
// 상태 Badge 사용
<Badge variant="pending">대기중</Badge>
<Badge variant="completed">완료</Badge>
<Badge variant="overdue">기한초과</Badge>

// 카테고리 Badge 사용
<Badge variant="custom" color="#3B82F6">업무</Badge>
```

- variant: pending, completed, overdue, custom中选择
- color: custom 선택 시 색상 코드 전달

### CD-02 도메인 컴포넌트

**원칙명**: 비즈니스 영역과 결합된 컴포넌트는 도메인 디렉토리에 분리한다.

**Why**: 원자 컴포넌트의 조합으로 도메인별 특화된 동작을 제공한다.

**How**:

도메인 컴포넌트 디렉토리: `src/components/`

| 컴포넌트 | 역할 | 의존성 |
|----------|------|--------|
| TodoCard | 할일 하나의 표시 | Badge, Checkbox, Button 조합 |
| TodoForm | 할일 등록/수정 폼 | Input, Button, Select 조합 |
| CategoryFilter | 카테고리 필터 드롭다운 | Select, Badge 조합 |
| TodoList | 할일 목록 표시 | TodoCard 조합 |
| CategoryList | 카테고리 목록 표시 | Button, Badge 조합 |
| LoginForm | 로그인 폼 | Input, Button 조합 |
| RegisterForm | 회원가입 폼 | Input, Button 조합 |

### CD-02-1 TodoCard 컴포넌트

```jsx
// 올바른 사용 예시
<TodoCard
  todo={{
    id: 1,
    title: '오늘 할 일',
    description: '설명',
    status: 'PENDING',
    category: { id: 1, name: '업무', colorCode: '#3B82F6' },
    dueDate: '2026-04-30',
  }}
  onToggle={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

Props 인터페이스:

```typescript
interface Todo {
  id: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  category?: {
    id: number;
    name: string;
    colorCode: string;
  };
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}
```

### CD-03 컴포넌트命名

**원칙명**: 파일명과 컴포넌트명은 일관된 casing 규칙을 따른다.

**How**:

| 유형 | casing | 예시 |
|------|--------|------|
| 파일명 (컴포넌트) | PascalCase | `TodoCard.jsx`, `LoginForm.jsx`, `Badge.jsx` |
| 파일명 (유틸) | camelCase | `dateFormatter.js`, `tokenStorage.js` |
| 파일명 (상수) | camelCase | `todoStatus.js`, `userRole.js` |
| 컴포넌트 함수 | PascalCase | `function TodoCard() { }` |
| 유틸 함수 | camelCase | `function formatDate() { }` |
| 상수 | UPPER_SNAKE_CASE | `const TODO_STATUS = { ... }` |

---

## 6. 상태 관리 스타일

### SM-01 서버 상태

**원칙명**: 서버에서 가져온 상태는 TanStack Query로 관리하고, 캐시 전략을 적용한다.

**Why**: 백엔드 서비스 레이어와 동일한 원칙으로(server state / client state 분리) 상태 관리를 명확히 한다.

**How**:

- Query Client 설정은 `src/main.jsx`에서一次性初始化한다.
- 쿼리 키는 배열 형태로 `[queryName, variables]` 형식을 따른다.
- stale 시간은 5분(300초)을 기본으로 한다.

```jsx
// 쿼리 함수 정의 (src/api/todo-api.js)
export async function getTodos(filters) {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`/api/todos?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
}

// Hook 정의 (src/hooks/useTodos.js)
export function useTodos(filters) {
  return useQuery({
    queryKey: ['todos', filters],
    queryFn: () => getTodos(filters),
    staleTime: 5 * 60 * 1000, // 5분
  });
}
```

### SM-02 클라이언트 상태

**원칙명**: 클라이언트 전역 상태는 Zustand로 관리하고, 서버 상태와 분리한다.

**Why**: 인증 정보, 모달 열림 여부 등 서버와 무관한 클라이언트 상태를 서버 캐시와 분리하여 관리한다.

**How**:

```javascript
// src/store/auth-store.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

// src/store/ui-store.js
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isLoginModalOpen: false,
  isDeleteModalOpen: false,
  selectedTodoId: null,

  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  openDeleteModal: (todoId) => set({ isDeleteModalOpen: true, selectedTodoId: todoId }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedTodoId: null }),
}));
```

### SM-03 컴포넌트 로컬 상태

**원칙명**: 특정 컴포넌트에서만 사용하는 상태는 useState로 관리한다.

**How**:

```jsx
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // ... 폼 제출 로직
}
```

---

## 7. 반응형 디자인

### RD-01 브레이크포인트

**원칙명**: 모바일 퍼스트 방식으로 반응형 레이아웃을 구성한다.

**How**:

| 브레이크포인트 | 너비 | 용도 |
|-------------|------|------|
| mobile | < 640px | 스마트폰 |
| tablet | 640px ~ 1024px | 태블릿 |
| desktop | > 1024px | 데스크탑 |

### RD-02 반응형 컴포넌트

```jsx
// 올바른 반응형 패딩 예시
const Container = styled.div`
  padding: 16px;

  @media (min-width: 640px) {
    padding: 24px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }
`;

// 올바른 반응형 폰트 예시
const Title = styled.h1`
  font-size: 24px;

  @media (min-width: 640px) {
    font-size: 32px;
  }
`;
```

- 모바일에서 데스크탑으로 확장하는 방식으로 구현한다.
- 너비固定 대신 max-width를 사용하여阅读 가독성을 보장한다.

---

## 8. 접근성 원칙

### A11y-01 시멘틱 HTML

**원칙명**: 의미에 맞는 HTML 요소를 사용하고 ARIA 속성을 적절히 적용한다.

**How**:

|情况 | 올바른_markup | 오류_markup |
|------|-------------|-----------|
| 클릭 가능한 제목 | `<button>` | `<div onClick={...}>` |
| 나열된 목록 | `<ul>`, `<li>` | `<div>` 나열 |
| 모달 | `<dialog>` 또는 ARIA 역할 |普通的 `<div>` |
| 로딩 중 | `aria-busy="true"` | 로딩 상태 미표시 |

### A11y-02 키보드 접근

**원칙명**: 모든 상호작용 요소는 키보드로 접근 가능해야 한다.

**How**:

- `<button>`, `<a>`, `<input>` 등 기본 시멘틱 요소를 사용한다.
- `tabIndex`는 0 또는 -1만 사용하고, 양수 값은 금지한다.
- 포커스 시각적 표시를 제공해야 한다.

```css
button:focus-visible,
a:focus-visible {
  outline: 2px solid #4F46E5;
  outline-offset: 2px;
}
```

### A11y-03 색상 대비

**원칙명**: 텍스트와 배경 간의 명 contraste比为 최소 4.5:1 이상이어야 한다.

**How**:

- Primary 텍스트 (#0F172A) on White (#FFFFFF): 15.9:1 ✓
- Secondary 텍스트 (#475569) on White (#FFFFFF): 7.2:1 ✓
- White 텍스트 on Primary (#4F46E5): 4.6:1 ✓

### A11y-04 스크린 리더

**원칙명**: 상태 변경 사항은 aria-live로 알린다.

**How**:

```jsx
// 할일 완료 시 스크린 리더에게 알림
<div aria-live="polite">
  {isCompleted && <span className="sr-only">할일이 완료되었습니다</span>}
</div>
```

---

## 9. 애니메이션

### Anim-01Transition

**원칙명**: 상태 변경 시 부드러운 전환 효과�� 적���한다.

**How**:

|情况 | 시간 | 이징 |
|------|------|------|
| 버튼 호버 | 150ms | ease-out |
| 모달 열기/닫기 | 200ms | ease-in-out |
| 리스트 항목 추가/제거 | 200ms | ease-in-out |
| 페이지 전환 | 300ms | ease-in-out |

### Anim-02 로딩 상태

**원칙명**: 네트워크 요청 중에는視覚적 피드백을 제공해야 한다.

```jsx
function TodoList() {
  const { data: todos, isLoading, isError } = useTodos(filters);

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  if (isError) {
    return <ErrorMessage>할일을 불러오는 중 오류가 발생했습니다</ErrorMessage>;
  }

  return (
    <ul>
      {todos?.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

---

## 10. 폼 검증

### FV-01 클라이언트 검증

**원칙명**: 입력 즉시 클라이언트 검증 결과를 제공하고, 제출 시 전체 검증을 실행한다.

**How**:

```jsx
function TodoForm() {
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    } else if (title.length > 200) {
      newErrors.title = '제목은 200자 이하로 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // 제출 로직
    }
  };

  return (
    <form>
      <Input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title) setErrors({ ...errors, title: null });
        }}
        error={errors.title}
      />
      <Button onClick={handleSubmit}>저장</Button>
    </form>
  );
}
```

### FV-02 검증 규칙

| 필드 | 규칙 | 오류 메시지 |
|------|------|-----------|
| 제목 | 필수, 200자 이하 | '제목은 필수입니다', '제목은 200자 이하입니다' |
| 설명 | 선택, 1000자 이하 | '설명은 1000자 이하입니다' |
| 카테고리 | 선택 | - |
| 마감일 | 선택,的未来 날짜 | '마감일은 오늘 이후の日付여야 합니다' |
| 아이디 | 필수, 4~20자 | '아이디는 4~20자입니다' |
| 비밀번호 | 필수, 8자 이상 | '비밀번호는 8자 이상입니다' |

---

## 11. 에러 처리

### EH-01 에러 상태ui

**원칙명**: 에러 발생 시 사용자에게 명확한 피드백을 제공하고 복구 옵션을 안내한다.

**How**:

```jsx
// 일반 에러 상태
function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      css={css`
        padding: 12px 16px;
        background: #FEF2F2;
        border: 1px solid #FECACA;
        border-radius: 8px;
        color: #EF4444;
        font-size: 14px;
      `}
    >
      {message || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
    </div>
  );
}

// 네트워크 에러
function NetworkError() {
  return (
    <ErrorMessage message="네트워크 연결을 확인해해주세요" />
  );
}
```

### EH-02 에러 경계

**원칙명**: 주요 컴포넌트에는 에러 경계(Error Boundary)를 적용한다.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>문제가 발생했습니다</h1>;
    }
    return this.props.children;
  }
}
```

---

## 12. 성능 최적화

### Perf-01 이미지 최적화

**원칙명**: 이미지는 modern format을 사용하고 적절한 크기로 제공한다.

**How**:

- WebP 포맷을 우선 사용하고, 브라우저 지원을 폴백으로 제공한다.
- srcset을 사용하여 뷰포트별로 다른 크기의 이미지를 제공한다.
- 지연 로딩(lazy loading)을 적용한다.

### Perf-02 코드 분할

**원칙명**: 라우트별로 코드를 분할하여 초기 로드 시간을 단축한다.

**How**:

```jsx
// 라우트별 코드 분할
const TodoListPage = lazy(() => import('./pages/TodoListPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/todos" element={<TodoListPage />} />
        <Route path="/categories" element={<CategoryPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Perf-03 Memoization

**원칙명**: 불필요한 재렌더링을 방지하기 위해 memo를 적절히 사용한다.

```jsx
// 불필요한 재렌더링 방지
const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li>
      {todo.title}
      <button onClick={() => onToggle(todo.id)}>토글</button>
      <button onClick={() => onDelete(todo.id)}>삭제</button>
    </li>
  );
});
```

---

## 13. 테스트 가능한 컴포넌트

### TC-01 테스트riendly 컴포넌트

**원칙명**: 컴포넌트는 테스트 가능한 구조로 설계한다.

**How**:

- 테스트 IDs을 위해 data-testid 속성을 제공한다.
- 의미론적-role을 사용하여 접근성을 확인한다.
- 컴포넌트의 내부 구현보다 공개 API에 집중한다.

```jsx
// 테스트riendly 예시
<Button
  data-testid="todo-submit-button"
  aria-label="할일 저장"
  onClick={handleSubmit}
>
  저장
</Button>

<Input
  data-testid="todo-title-input"
  aria-label="할일 제목"
  value={title}
  onChange={handleChange}
/>
```

---

## 14. 코드 컨벤션

### CC-01 ESLint / Prettier

**원칙명**: 코드의 일관성을 유지하기 위해 ESLint와 Prettier를 적용한다.

**How**:

ESLint 설정 (.eslintrc.json):

```json
{
  "extends": ["eslint:recommended"],
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off",
    "eqeqeq": "error",
    "react/prop-types": "warn",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

Prettier 설정 (.prettierrc):

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### CC-02 import 순서

**원칙명**: import 문을グループ화하여 가독성을 높인다.

**How**:

```jsx
// 1. React/라이브러리 import
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// 2. TanStack Query import
import { useQuery } from '@tanstack/react-query';

// 3. 내부 모듈 import (상대 경로)
import { useAuthStore } from '../store/auth-store';
import { useTodos } from '../hooks/useTodos';

// 4. 유틸/상수 import
import { TODO_STATUS } from '../constants/todo-status';

// 5. 컴포넌트 import
import Button from '../components/common/Button';
import TodoCard from '../components/TodoCard';
```

### CC-03 주석 규칙

**원칙명**: 코드 의도가 명확하지 않은 경우에만 주석을 추가한다.

**How**:

- 코드 자체로 의도가 명확하면 주석을 추가하지 않는다.
- 복잡한 로직이나 비즈니스 규칙은 주석으로 설명한다.
- TODO 주석은 이슈 번호와 함께 사용한다.

```jsx
// 올바른 예시
// OVERDUE 판별: PENDING 상태이면서 dueDate가 과거인 경우
const isOverdue = status === 'PENDING' && dueDate && new Date(dueDate) < new Date();

//_BAD_ 예시 (불필요한 주석)
// title 변수를 title이라는 변수에 할당
const title = todo.title;
```

---

## 15. 디렉토리 구조

```
frontend/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Dialog.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── TodoCard.jsx
│   │   ├── TodoForm.jsx
│   │   ├── TodoList.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── CategoryList.jsx
│   │   ├── CategoryForm.jsx
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── TodoListPage.jsx
│   │   ├── CategoryPage.jsx
│   │   └── AdminPage.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTodos.js
│   │   └── useCategories.js
│   ├── api/
│   │   ├── client.js
│   │   ├── todo-api.js
│   │   ├── auth-api.js
│   │   ├── category-api.js
│   │   └── admin-api.js
│   ├── store/
│   │   ├── auth-store.js
│   │   └── ui-store.js
│   ├── styles/
│   │   ├── GlobalStyles.js
│   │   └── theme.js
│   ├── utils/
│   │   ├── date-formatter.js
│   │   ├── token-storage.js
│   │   └── validators.js
│   ├── constants/
│   │   ├── todo-status.js
│   │   ├── user-role.js
│   │   └── api-endpoints.js
│   ├── router/
│   │   ├── index.jsx
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

| 디렉토리 / 파일 | 역할 | 파일 예시 | 금지 사항 |
|----------------|------|-----------|-----------|
| `public/` | 빌드 시 그대로 복사되는 정적 파일 | `favicon.ico` | 소스 코드 포함 금지 |
| `src/assets/` | 컴포넌트에서 import하여 사용하는 이미지 | `logo.svg` | 비즈니스 로직 포함 금지 |
| `src/components/common/` | 원자 컴포넌트 | `Button.jsx`, `Input.jsx` | 도메인 비종속, 비즈니스 로직 포함 금지 |
| `src/components/` | 도메인 컴포넌트 | `TodoCard.jsx`, `TodoList.jsx` | 페이지 레이아웃 포함 금지, API 직접 호출 금지 |
| `src/pages/` | 라우트와 1:1 매핑되는 페이지 | `TodoListPage.jsx` | 직접 fetch 호출 금지, 레이아웃만 담당 |
| `src/hooks/` | 커스텀 Hook | `useTodos.js`, `useAuth.js` | JSX 반환 금지, UI 렌더링 로직 포함 금지 |
| `src/api/` | HTTP 클라이언트 및 쿼리 함수 | `todo-api.js`, `auth-api.js` | 상태 관리 금지, 순수 HTTP 함수만 |
| `src/store/` | Zustand 전역 상태 | `auth-store.js`, `ui-store.js` | 서버 데이터 캐시 금지, 클라이언트 상태만 |
| `src/styles/` | 글로벌 스타일 및 테마 | `GlobalStyles.js`, `theme.js` | 컴포넌트별 스타일 해당 파일에 |
| `src/utils/` | 순수 함수 유틸리티 | `date-formatter.js` | React 의존성 포함 금지 |
| `src/constants/` | 전역 상수 | `todo-status.js` | 함수 또는 상태 포함 금지 |
| `src/router/` | 라우트 정의 | `index.jsx` | 비즈니스 로직 금지 |

---

## 16. 빌드 및 개발 환경

### BE-01 vite 설정

**원칙명**: 개발 환경과 운영 환경의 빌드 설정을 분리한다.

**How**:

vite.config.js:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
```

---

*본 문서는 아키텍처 설계 원칙 문서(docs/4-architecture-principles.md v1.1.0)를 기반으로 작성된 프론트엔드 스타일 가이드 문서이며, 디자인 시스템 변경 시 버전을 갱신하여 관리한다.*