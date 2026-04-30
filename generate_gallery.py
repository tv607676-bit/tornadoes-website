import os, re
html = ""
files = os.listdir("assets/images/students")
files.sort()

for f in files:
    name = f.replace('.jpeg','').replace('.jpg','')
    post = 'Student'
    m = re.search(r'(.*?)[({](.*?)[)}]', name)
    if m:
        name = m.group(1).strip()
        post = m.group(2).strip()
    elif 'SSC GD CISF' in name:
        name = name.replace('SSC GD CISF','').strip()
        post = 'SSC GD CISF'
        
    html += f"""
                <div class="student-card">
                    <div class="student-image">
                        <img src="assets/images/students/{f}" alt="{name}">
                    </div>
                    <div class="student-info">
                        <h3 class="student-name">{name}</h3>
                        <p class="student-post">{post}</p>
                    </div>
                </div>"""

with open("scratch.html", "w") as out:
    out.write(html)
