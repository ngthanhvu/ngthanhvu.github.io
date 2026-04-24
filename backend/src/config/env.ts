import dotenv from "dotenv";

dotenv.config();

const required = (value: string | undefined, fallback = ""): string => value?.trim() || fallback;

export const env = {
  nodeEnv: required(process.env.NODE_ENV, "development"),
  port: Number(process.env.PORT) || 4000,
  clientUrl: required(process.env.CLIENT_URL, "http://localhost:3000"),
  jwtSecret: required(process.env.JWT_SECRET, "change-me-in-production"),
  jwtExpiresIn: required(process.env.JWT_EXPIRES_IN, "7d"),
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  mysql: {
    host: required(process.env.MYSQL_HOST, "127.0.0.1"),
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: required(process.env.MYSQL_USER, "root"),
    password: required(process.env.MYSQL_PASSWORD),
    database: required(process.env.MYSQL_DATABASE, "portfolio_auth"),
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT) || 10,
    queueLimit: 0
  },
  mail: {
    host: required(process.env.SMTP_HOST),
    port: Number(process.env.SMTP_PORT) || 587,
    user: required(process.env.SMTP_USER),
    pass: required(process.env.SMTP_PASS),
    from: required(process.env.MAIL_FROM, "no-reply@example.com")
  },
  resetTokenExpiresMinutes: Number(process.env.RESET_TOKEN_EXPIRES_MINUTES) || 15
};
