@echo off
REM ========================================================
REM AWS Elastic Beanstalk Multi-Container Docker Deployment
REM ========================================================

REM Ask for EB environment name
set /p ENV_NAME=Enter Elastic Beanstalk environment name (no spaces): 

REM Step 1: Check EB CLI installation
where eb >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo EB CLI not found. Installing...
    pip install awsebcli --upgrade --user
    echo Please restart your terminal after installation and run this script again.
    pause
    exit /b
)

REM Step 2: Initialize EB project
echo Initializing Elastic Beanstalk project...
eb init --platform "Docker running on 64bit Amazon Linux 2" --region us-east-1

REM Step 3: Create EB environment if it doesn't exist
echo Creating EB environment "%ENV_NAME%"...
eb create %ENV_NAME% --platform "Docker running on 64bit Amazon Linux 2" --multi

REM Step 4: Deploy to EB
echo Deploying to AWS Elastic Beanstalk...
eb deploy

REM Step 5: Show environment status
eb status

echo ========================================================
echo Deployment complete!
echo Environment URL:
eb open
pause
