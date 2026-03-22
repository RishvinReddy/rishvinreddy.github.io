import glob
import re
import os

files = glob.glob("**/*.html", recursive=True) + glob.glob("**/*.js", recursive=True)

for fpath in files:
    if "node_modules" in fpath or ".git" in fpath or ".gemini" in fpath:
        continue
        
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content
    
    # 1. Remove Dark mode toggle button
    content = re.sub(r'<!--\s*Dark mode toggle.*?-->\s*<button\s+id="themeToggle".*?</button>', '', content, flags=re.DOTALL)
    content = re.sub(r'<button\s+id="themeToggle".*?</button>', '', content, flags=re.DOTALL)
    
    # 2. Remove Dark mode JS logic specifically labeled
    content = re.sub(r'/\*\s*───\s*Dark Mode\s*───\s*\*/.*?(?=\}\)\(\);|</script>)', '', content, flags=re.DOTALL)
    # 2b. If standalone script blocks setting dark exist:
    content = re.sub(r"document\.documentElement\.classList\.toggle\('dark'.*?\);", "", content)
    content = re.sub(r"localStorage\.getItem\('theme'\)", "null", content)
    content = re.sub(r"localStorage\.setItem\('theme'.*?\);", "", content)
    
    # 3. Remove all dark: classes (including responsive prefixes like md:dark:, hover:dark: etc)
    content = re.sub(r'\b([a-z0-9\-]+:)*dark:[^\s\'"`<]+', '', content)
    
    # 4. Clean up multiple spaces inside class attributes caused by removals
    def clean_spaces_in_class(match):
        return 'class="' + re.sub(r'\s+', ' ', match.group(1)).strip() + '"'
    content = re.sub(r'class="([^"]*)"', clean_spaces_in_class, content)

    if content != original_content:
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {fpath}")

print("Done cleaning dark mode.")
