# Markdown to DOCX Conversion Guide

This guide provides multiple methods to convert the `INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.md` file to a Word document (DOCX format).

## Method 1: Using Python Script (Recommended)

### Prerequisites
- Python 3.6 or higher
- pip package manager

### Installation
```bash
pip install python-docx
```

### Windows Users
1. Double-click `convert_to_docx.bat`
2. The script will automatically install dependencies and convert the file

### Linux/Mac Users
1. Make the script executable:
   ```bash
   chmod +x convert_to_docx.sh
   ```
2. Run the script:
   ```bash
   ./convert_to_docx.sh
   ```

### Manual Python Execution
```bash
python convert_simple.py
```

## Method 2: Using Pandoc (Alternative)

### Installation
#### Windows
1. Download pandoc from: https://pandoc.org/installing.html
2. Install the Windows installer

#### Linux
```bash
sudo apt-get install pandoc
```

#### Mac
```bash
brew install pandoc
```

### Conversion Command
```bash
pandoc INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.md -o INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.docx
```

### Advanced Pandoc Options
```bash
# With custom styling
pandoc INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.md -o INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.docx --reference-doc=template.docx

# With table of contents
pandoc INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.md -o INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.docx --toc

# With custom formatting
pandoc INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.md -o INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.docx --toc --number-sections
```

## Method 3: Online Converters

### Free Online Tools
1. **Pandoc Try**: https://pandoc.org/try/
2. **Markdown to Word**: https://word-to-markdown.herokuapp.com/
3. **Dillinger**: https://dillinger.io/

### Steps for Online Conversion
1. Copy the content from `INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.md`
2. Paste into the online converter
3. Download the resulting DOCX file

## Method 4: Using Microsoft Word

### Direct Import
1. Open Microsoft Word
2. Go to File → Open
3. Select the markdown file
4. Word will automatically convert it
5. Save as DOCX

### Copy-Paste Method
1. Open the markdown file in a text editor
2. Copy all content
3. Paste into a new Word document
4. Apply formatting as needed
5. Save as DOCX

## Method 5: Using VS Code Extensions

### Installation
1. Install VS Code
2. Install "Markdown PDF" extension
3. Install "Markdown All in One" extension

### Conversion Steps
1. Open the markdown file in VS Code
2. Right-click in the editor
3. Select "Markdown PDF: Export (docx)"
4. Choose save location

## Troubleshooting

### Common Issues

#### Python Script Issues
- **ModuleNotFoundError**: Run `pip install python-docx`
- **Permission Error**: Run as administrator (Windows) or with sudo (Linux)
- **File Not Found**: Ensure the markdown file is in the same directory

#### Pandoc Issues
- **Command Not Found**: Add pandoc to your PATH or use full path
- **Format Not Supported**: Update pandoc to latest version
- **Encoding Issues**: Use `--from markdown+smart` flag

#### General Issues
- **Large File**: Split the document into smaller sections
- **Complex Formatting**: Use the Python script for better control
- **Code Blocks**: Ensure proper indentation in markdown

### File Size Considerations
- Large documents may take longer to convert
- Consider splitting into multiple documents if needed
- Use compression for email sharing

## Output Quality

### Python Script Features
- ✅ Preserves heading hierarchy
- ✅ Maintains code formatting
- ✅ Handles bullet points and numbered lists
- ✅ Preserves bold text
- ✅ Clean paragraph formatting

### Pandoc Features
- ✅ Advanced formatting options
- ✅ Table of contents generation
- ✅ Cross-reference support
- ✅ Bibliography support
- ✅ Custom styling options

## Customization

### Python Script Customization
Edit `convert_simple.py` to modify:
- Font styles and sizes
- Paragraph spacing
- Code block formatting
- Heading styles

### Pandoc Customization
Create a reference document:
```bash
pandoc --print-default-data-file reference.docx > template.docx
```
Edit `template.docx` and use:
```bash
pandoc input.md -o output.docx --reference-doc=template.docx
```

## Support

If you encounter issues:
1. Check the error messages carefully
2. Ensure all dependencies are installed
3. Try different conversion methods
4. Verify the markdown file is valid
5. Check file permissions

## Output Files

After successful conversion, you will have:
- `INVENTORY_PURCHASE_SYSTEM_DOCUMENTATION.docx` - The converted Word document
- Original markdown file remains unchanged

The converted document will maintain the structure and formatting of the original markdown while being fully compatible with Microsoft Word and other word processors.
