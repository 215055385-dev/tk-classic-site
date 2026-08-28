# 本地下载与部署

本项目支持两种本地运行方式。两种方式都继续使用同一个 Supabase 云数据库和对象存储，因此后台、产品、询盘和线上站点不会产生两套互相冲突的数据。

## 方式一：Windows 本地运行

要求：Node.js 24 LTS、网络可访问 Supabase 和 Resend。

1. 解压项目。
2. 在项目目录打开 PowerShell。
3. 运行 `npm run local:setup`。
4. 首次运行会生成 `.env.local`，按 `config/local.env.example` 填写变量。
5. 再次运行 `npm run local:setup` 完成依赖安装、代码检查和生产构建。
6. 运行 `npm run local:start`。
7. 打开 `http://127.0.0.1:3011`，后台为 `http://127.0.0.1:3011/admin`。

## 方式二：Docker 部署

要求：Docker Desktop。

1. 从 `config/local.env.example` 复制并填写 `.env.local`。
2. 运行 `docker compose up -d --build`。
3. 打开 `http://127.0.0.1:3011`。
4. 停止服务时运行 `docker compose down`。

## 生成可下载部署包

运行 `npm run local:package`。压缩包将生成到 `dist/tk-classic-local-日期时间.zip`。

打包脚本不会包含 `.env.local`、Supabase 密钥、Resend 密钥、Vercel 配置、依赖缓存或测试截图。收到压缩包的人必须单独配置自己的环境变量。

## 数据说明

- 本地网站只是另一套运行入口，默认仍连接正式 Supabase 数据库。
- 不要把 `SUPABASE_SECRET_KEY`、`SUPABASE_SERVICE_ROLE_KEY` 或数据库密码放到浏览器代码中。
- `NEXT_PUBLIC_SUPABASE_*` 变量可以被浏览器读取，但只能配合 RLS 使用。
- 如果以后需要完全离线部署，需要额外部署本地 PostgreSQL、Supabase Auth、对象存储和邮件服务，不能直接与当前云端数据自动保持一致。
