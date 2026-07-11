import os
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace ": any" with ": unknown"
    new_content = re.sub(r':\s*any\b', ': unknown', content)
    
    # Also fix some specific unused variables if we can, but let's focus on "any" first
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed 'any' in {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            fix_file(os.path.join(root, file))

