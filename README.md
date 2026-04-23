# ngthanhvu.github.io

Dự án web full-stack được tách thành hai phần:

- `frontend`: ứng dụng Next.js dùng React, TypeScript và Tailwind CSS.
- `backend`: API server dùng Express, TypeScript và dotenv.

Hiện tại dự án đang ở trạng thái khởi tạo nền tảng. Frontend vẫn là giao diện mẫu của Next.js, còn backend đã có sẵn các endpoint kiểm tra cơ bản.

## Công nghệ sử dụng

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

### Backend

- Node.js
- Express 5
- TypeScript
- tsx cho môi trường phát triển
- dotenv để đọc biến môi trường
- cors để cho phép frontend gọi API

## Cấu trúc thư mục

```text
.
+-- backend/
|   +-- src/
|   |   +-- index.ts
|   +-- .env.example
|   +-- package.json
|   +-- tsconfig.json
+-- frontend/
    +-- app/
    |   +-- globals.css
    |   +-- layout.tsx
    |   +-- page.tsx
    +-- public/
    +-- package.json
    +-- tsconfig.json
```

## Yêu cầu

- Node.js 20 hoặc mới hơn
- npm

## Cài đặt

Cài dependency cho backend:

```bash
cd backend
npm install
```

Cài dependency cho frontend:

```bash
cd frontend
npm install
```

## Cấu hình môi trường

Backend có file mẫu `.env.example`:

```env
PORT=4000
```

Tạo file `.env` trong thư mục `backend` nếu muốn đổi cổng chạy API:

```env
PORT=4000
```

Nếu không cấu hình, backend mặc định chạy ở cổng `4000`.

## Chạy dự án ở môi trường phát triển

Chạy backend:

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại:

```text
http://localhost:4000
```

Chạy frontend ở một terminal khác:

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại:

```text
http://localhost:3000
```

## API hiện có

### `GET /health`

Kiểm tra backend có đang hoạt động hay không.

Ví dụ response:

```json
{
  "ok": true,
  "service": "backend",
  "timestamp": "2026-04-23T00:00:00.000Z"
}
```

### `GET /api/hello`

Endpoint mẫu trả về lời chào từ API.

Ví dụ response:

```json
{
  "message": "Hello from Express + TypeScript"
}
```

## Script hữu ích

### Backend

```bash
npm run dev        # chạy server bằng tsx watch
npm run build      # biên dịch TypeScript
npm run start      # chạy bản build từ dist/index.js
npm run typecheck  # kiểm tra type, không xuất file build
```

### Frontend

```bash
npm run dev    # chạy Next.js development server
npm run build  # build ứng dụng production
npm run start  # chạy bản production sau khi build
npm run lint   # chạy ESLint
```

## Ghi chú phát triển

- Backend entry point nằm tại `backend/src/index.ts`.
- Frontend page chính nằm tại `frontend/app/page.tsx`.
- Frontend hiện chưa gọi API backend; bước tiếp theo có thể là thêm biến môi trường cho API URL và gọi `/api/hello` từ giao diện.
- Khi deploy, frontend và backend có thể được deploy riêng, hoặc cấu hình proxy/API route tùy nền tảng triển khai.
