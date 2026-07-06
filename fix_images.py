import os
import re

website_dir = r"C:\Postgres\ERP-8AMPERIOS-RELX\relx-website"
images_dir = os.path.join(website_dir, "assets", "images")

# HTML files to update
html_files = []
for root, _, files in os.walk(website_dir):
    for f in files:
        if f.endswith(".html"):
            html_files.append(os.path.join(root, f))

# Rename map
rename_map = {}

for filename in os.listdir(images_dir):
    old_path = os.path.join(images_dir, filename)
    if os.path.isfile(old_path):
        # Generate new name: lower, replace spaces with hyphens, replace ñ with n
        new_name = filename.lower().replace(" ", "-").replace("ñ", "n").replace("í", "i")
        if new_name != filename:
            new_path = os.path.join(images_dir, new_name)
            os.rename(old_path, new_path)
            rename_map[filename] = new_name
            print(f"Renamed: '{filename}' -> '{new_name}'")

# Update HTML files
for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    for old_name, new_name in rename_map.items():
        if old_name in content:
            content = content.replace(old_name, new_name)
            modified = True
            
    if modified:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated HTML: {html_file}")

print("Done!")
