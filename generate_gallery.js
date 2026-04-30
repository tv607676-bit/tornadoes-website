const fs = require('fs');
const files = fs.readdirSync('assets/images/students').filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg')).sort();

let html = "";
for (const f of files) {
    let name = f.replace('.jpeg', '').replace('.jpg', '');
    let post = 'Student';
    const match = name.match(/(.*)[({](.*)[)}]/);
    if (match) {
        name = match[1].trim();
        post = match[2].trim();
    } else if (name.includes('SSC GD CISF')) {
        name = name.replace('SSC GD CISF', '').trim();
        post = 'SSC GD CISF';
    }
    html += `
                <div class="student-card">
                    <div class="student-image">
                        <img src="assets/images/students/${f}" alt="${name}">
                    </div>
                    <div class="student-info">
                        <h3 class="student-name">${name}</h3>
                        <p class="student-post">${post}</p>
                    </div>
                </div>`;
}
fs.writeFileSync('scratch.html', html);
