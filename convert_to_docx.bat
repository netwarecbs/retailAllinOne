@echo off
echo Converting Markdown to DOCX...

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH
    echo Please install Python and try again
    pause
    exit /b 1
)

REM Check if python-docx is installed
python -c "import docx" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing python-docx...
    pip install python-docx
    if %errorlevel% neq 0 (
        echo Failed to install python-docx
        echo Please install it manually: pip install python-docx
        pause
        exit /b 1
    )
)

REM Run the conversion
echo Running conversion...
python convert_simple.py

if %errorlevel% equ 0 (
    echo.
    echo Conversion completed successfully!
    echo Output file: INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.docx
) else (
    echo.
    echo Conversion failed!
    echo Please check the error messages above.
)

echo.
echo Press any key to exit...
pause >nul
