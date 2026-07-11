import os
import re

files_to_fix = [
    "src/contexts/AuthContext.tsx",
    "src/app/(public)/register/page.tsx",
    "src/app/(public)/jobs/[id]/page.tsx",
    "src/app/(public)/login/page.tsx",
    "src/app/(dashboard)/chat/page.tsx",
    "src/app/(dashboard)/employer/page.tsx",
    "src/app/(dashboard)/employer/post-job/page.tsx",
    "src/app/(dashboard)/admin/page.tsx",
    "src/app/(dashboard)/admin/users/page.tsx",
    "src/app/(dashboard)/profile/page.tsx"
]

for file in files_to_fix:
    if os.path.exists(file):
        with open(file, 'r') as f:
            content = f.read()
        new_content = re.sub(r':\s*unknown\b', ': any', content)
        if new_content != content:
            with open(file, 'w') as f:
                f.write(new_content)

