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

## Database migration

Backend dùng MySQL và quản lý schema bằng migration trong thư mục:

```text
backend/src/database/migrations/
```

Trước khi chạy migration, tạo file `backend/.env` và cấu hình các biến MySQL:

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=portfolio_auth
MYSQL_CONNECTION_LIMIT=10
```

Chạy các migration chưa chạy:

```bash
cd backend
npm run migrate
```

Lệnh này sẽ tự tạo database nếu chưa tồn tại, tạo bảng `schema_migrations` để lưu các migration đã chạy, rồi chạy lần lượt các file trong `src/database/migrations`.

Rollback migration gần nhất:

```bash
cd backend
npm run migrate:down
```

Khi thêm migration mới, tạo file `.js` trong `backend/src/database/migrations`, export object `migration`, rồi import migration đó vào `backend/src/database/migrations/index.ts`.

Ví dụ:

```js
export const migration = {
  name: "003_create_posts",
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  },
  down: async (pool) => {
    await pool.query("DROP TABLE IF EXISTS posts;");
  }
};
```

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

## Chạy bằng Docker

Dự án có sẵn Dockerfile riêng cho từng phần và một file `docker-compose.yml` ở thư mục gốc.

Build và chạy cả frontend lẫn backend:

```bash
docker compose up --build
```

Sau khi chạy thành công:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:4000
```

Dừng container:

```bash
docker compose down
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
npm run dev          # chạy server bằng tsx watch
npm run migrate      # chạy các database migration chưa chạy
npm run migrate:down # rollback migration gần nhất
npm run build        # biên dịch TypeScript
npm run start        # chạy bản build từ dist/index.js
npm run typecheck    # kiểm tra type, không xuất file build
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
