@echo off
cls
echo.
echo  ========================================
echo   Student Management System
echo  ========================================
echo.
echo  [1/2] Starting Backend Server...
start cmd /k "cd /d d:\student-management-system\backend && node server.js"
timeout /t 2 /nobreak >nul
echo  [2/2] Starting Frontend...
echo.
echo  App will open at: http://localhost:3000
echo.
start cmd /k "cd /d d:\student-management-system\frontend && npm start"
