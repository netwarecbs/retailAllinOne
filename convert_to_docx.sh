#!/bin/bash

echo "Converting Markdown to DOCX..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed or not in PATH"
    echo "Please install Python3 and try again"
    exit 1
fi

# Check if python-docx is installed
if ! python3 -c "import docx" &> /dev/null; then
    echo "Installing python-docx..."
    pip3 install python-docx
    if [ $? -ne 0 ]; then
        echo "Failed to install python-docx"
        echo "Please install it manually: pip3 install python-docx"
        exit 1
    fi
fi

# Run the conversion
echo "Running conversion..."
python3 convert_simple.py

if [ $? -eq 0 ]; then
    echo ""
    echo "Conversion completed successfully!"
    echo "Output file: INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.docx"
else
    echo ""
    echo "Conversion failed!"
    echo "Please check the error messages above."
    exit 1
fi
