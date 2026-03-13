# Feature-Sliced Design (FSD) 폴더 구조

**기준:** [Feature-Sliced Design](https://feature-sliced.design/docs/reference/layers)  
**프로젝트:** 블록 드래그 앤 드롭 HTML 대시보드

---

## 1. 레이어 개요 (의존 방향: 위 → 아래)

| 레이어 | 경로 | 역할 |
|--------|------|------|
| **App** | `src/app/` | 앱 진입점, 전역 스타일, 프로바이더, 라우터 설정 |
| **Pages** | `src/pages/` | 화면 단위 (한 라우트에 대응하는 페이지) |
| **Widgets** | `src/widgets/` | 여러 feature/entity를 묶는 큰 UI 블록 (재사용) |
| **Features** | `src/features/` | 사용자 시나리오·상호작용 (비즈니스 가치) |
| **Entities** | `src/entities/` | 비즈니스 엔티티 (블록, 캔버스 등) |
| **Shared** | `src/shared/` | UI 킷, lib, api, config 등 프로젝트 공통 코드 |

- **Import 규칙:** 상위 레이어는 하위 레이어만 import 가능. (예: `pages` → `widgets`, `features`, `entities`, `shared`)
- **App / Shared:** 슬라이스가 아닌 세그먼트 단위; 내부 세그먼트끼리 자유롭게 import 가능.

---

## 2. 디렉터리 구조 (목표)

```
src/
├── app/                    # App 레이어
│   ├── App.tsx             # 루트 컴포넌트
│   ├── index.ts            # Public API (export App 등)
│   └── styles/             # 전역 스타일
│       ├── tailwind.css
│       └── index.scss
│
├── pages/                  # Pages 레이어
│   └── dashboard/          # 슬라이스: 대시보드 페이지
│       ├── ui/             # 페이지 UI
│       └── index.ts        # Public API
│
├── widgets/                # Widgets 레이어 (블록 팔레트, 캔버스, 결과 패널 등)
│   └── (추가 시 슬라이스 단위로 생성)
│
├── features/               # Features 레이어 (드래그 앤 드롭, 블록 편집 등)
│   └── (추가 시 슬라이스 단위로 생성)
│
├── entities/               # Entities 레이어 (블록 타입, 캔버스 모델 등)
│   └── (추가 시 슬라이스 단위로 생성)
│
├── shared/                 # Shared 레이어
│   ├── ui/                 # UI 킷 (Tab, Layout, Button 등)
│   │   ├── Tab/
│   │   └── Layout/
│   ├── lib/                # 공용 라이브러리
│   └── config/             # 전역 설정 (선택)
│
└── main.tsx                # 진입점 (Vite)
```

---

## 3. 세그먼트 (슬라이스 내)

- **ui** — 컴포넌트, 스타일
- **model** — 상태, 타입, 스토어 (필요 시)
- **api** — API 호출 (필요 시)
- **lib** — 해당 슬라이스 내부 유틸
- **config** — 해당 슬라이스 설정 (필요 시)

각 슬라이스는 **Public API**만 노출. 외부에서는 `pages/dashboard`, `shared/ui` 등 **index.ts**를 통해서만 import.

---

## 4. 이 프로젝트에서의 매핑 (PRD 기준)

| PRD 요소 | FSD 위치 |
|-----------|----------|
| 전체 레이아웃 (3열) | `shared/ui/Layout` (SplitLayout 등) |
| 블록 팔레트 | `widgets/block-palette` (추가 시) |
| 캔버스 | `widgets/canvas` (추가 시) |
| 결과 패널 (Preview/HTML) | `widgets/result-panel` (추가 시) |
| 블록 타입·캔버스 상태 | `entities/block`, `entities/canvas` (추가 시) |
| 드래그 앤 드롭 | `features/dnd` 또는 widgets 내부 (추가 시) |
| 탭 UI | `shared/ui/Tab` (기존) |

---

## 5. Import 예시

- `app/App.tsx` → `@/pages/dashboard`, `@/shared/ui/Layout`, `@/shared/ui/Tab`
- `pages/dashboard/ui/Page.tsx` → `@/widgets/...`, `@/shared/ui/...`
- `shared/ui/Layout/SplitLayout.tsx` → `@/shared/ui/...` (shared 내부만)

---

**문서 끝.**
