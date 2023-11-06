/* 
Reference URL: https://devdojo.com/bo-iliev/how-to-write-your-first-nodejs-script

Command to hit: node script.js SecretProject
*/


const fs = require('fs'); // File System Module
const folderName = process.argv[2] || 'Project';

try {
    fs.mkdirSync(folderName);

    // Specify the data you want to write to the files.
    const htmlContent = '<!DOCTYPE html><html><head><title>My Project</title></head><body></body></html>';
    const cssContent = '/* Your CSS styles here */';
    const jsContent = '// Your JavaScript code here';

    // Write data to the files.
    fs.writeFileSync(`${folderName}/index.html`, htmlContent);
    fs.writeFileSync(`${folderName}/style.css`, cssContent);
    fs.writeFileSync(`${folderName}/app.js`, jsContent);
    
    console.log('Project created successfully.');
} catch (err) {
    console.error('Error:', err);
}
