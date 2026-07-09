@echo off
chcp 65001 >nul
echo ========================================
echo   亲亲家园 - 一键安装 & 推送
echo ========================================
echo.

cd /d "D:\Codex project\codex-project-001"

echo [1/3] 安装 npm 依赖...
call npm install
if %ERRORLEVEL% neq 0 (
  echo npm install 失败，请检查网络或 Node.js 安装
  pause
  exit /b 1
)

echo [2/3] 测试构建...
call npm run build
if %ERRORLEVEL% neq 0 (
  echo 构建失败
  pause
  exit /b 1
)
echo 构建成功！

echo [3/3] 推送到 GitHub...
git init
git add .
git commit -m "feat: migrate to Vue 3 + Vite"
git branch -M main
git remote add origin https://github.com/AduoLi/SHIYI.git
git push -u origin main

if %ERRORLEVEL% equ 0 (
  echo.
  echo ========================================
  echo   全部完成！已推送到 AduoLi/SHIYI.git
  echo   运行 npm run dev 启动开发服务器
  echo ========================================
) else (
  echo.
  echo 推送失败，请检查：
  echo   1. Git 是否已安装
  echo   2. 远程仓库 AduoLi/SHIYI.git 是否存在
  echo   3. 是否有推送权限
)
pause
