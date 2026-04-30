import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

// Mock matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock react-i18next
vi.mock('react-i18next', () => {
  const translations = {
    common: {
      appTitle: "TodoList",
      todoList: "할일 목록",
      categoryManage: "카테고리 관리",
      userManage: "사용자 관리",
      login: "로그인",
      register: "회원가입",
      logout: "로그아웃",
      add: "추가",
      edit: "수정",
      delete: "삭제",
      save: "저장",
      cancel: "취소",
      complete: "완료 처리",
      uncomplete: "완료 취소",
      title: "제목",
      description: "설명",
      category: "카테고리",
      dueDate: "마감일",
      status: "상태",
      optional: "선택",
      required: "필수",
      loading: "로딩 중...",
      noData: "데이터가 없습니다.",
      lightMode: "라이트 모드로 전환",
      darkMode: "다크 모드로 전환",
      openMenu: "메뉴 열기",
      confirm: "확인"
    },
    auth: {
      welcome: "할일 관리 서비스",
      username: "아이디",
      password: "비밀번호",
      noAccount: "계정이 없으신가요?",
      hasAccount: "이미 계정이 있으신가요?",
      usernamePlaceholder: "아이디 입력",
      passwordPlaceholder: "비밀번호 입력",
      usernameHint: "영문·숫자 4~20자"
    },
    todo: {
      list: "할일 목록",
      new: "할일 등록",
      update: "할일 수정",
      newDesc: "새로운 할일을 등록합니다.",
      updateDesc: "할일 정보를 수정합니다.",
      titlePlaceholder: "할 일을 입력하세요",
      descPlaceholder: "상세 내용을 입력하세요",
      none: "할일이 없습니다.",
      delete: "할일 삭제",
      deleteConfirm: "이 할일을 삭제합니다. 이 작업은 되돌릴 수 없습니다.",
      titleRequired: "제목을 입력해주세요.",
      titleTooLong: "제목은 200자 이내로 입력해주세요.",
      descTooLong: "설명은 1000자 이내로 입력해주세요.",
      filter: {
        category: "카테고리 필터",
        status: "상태 필터",
        all: "전체",
        allCategories: "전체 카테고리",
        pending: "대기중",
        completed: "완료",
        overdue: "기한초과"
      }
    },
    category: {
      list: "카테고리 관리",
      new: "새 카테고리",
      update: "카테고리 수정",
      name: "카테고리 이름",
      namePlaceholder: "카테고리 이름 입력",
      color: "색상",
      none: "카테고리가 없습니다.",
      preview: "미리보기",
      deleteConfirm: "이 카테고리를 삭제하면 연결된 할일의 카테고리가 해제됩니다. 계속하시겠습니까?",
      noCategory: "카테고리 없음"
    },
    admin: {
      userManage: "사용자 관리",
      desc: "전체 사용자를 조회하고 상태를 관리합니다.",
      username: "사용자명",
      role: "역할",
      status: "상태",
      createdAt: "생성일",
      actions: "작업",
      active: "활성",
      inactive: "비활성",
      activate: "활성화",
      deactivate: "비활성화",
      none: "사용자가 없습니다.",
      admin: "관리자",
      user: "사용자"
    }
  };

  return {
    useTranslation: () => ({
      t: (key) => {
        const parts = key.split('.');
        let val = translations;
        for (const part of parts) {
          val = val?.[part];
          if (!val) break;
        }
        return typeof val === 'string' ? val : key;
      },
      i18n: {
        changeLanguage: vi.fn(),
        language: 'ko',
      },
    }),
    initReactI18next: {
      type: '3rdParty',
      init: vi.fn(),
    },
  };
});

window.alert = vi.fn();
window.confirm = vi.fn(() => true);
