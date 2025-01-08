const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = 3000;

// Load data from JSON files

function loadData() {
    try {
        const dataData = fs.readFileSync(path.join(__dirname, 'data', 'data.json'), 'utf-8');
        const usersData = fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf-8');
        return { data: JSON.parse(dataData), users: JSON.parse(usersData) };
    } catch (err) {
        console.error('Error loading data:', err);
        return { data: [], users: [] };
    }
}

function saveData(data, users) {
    fs.writeFileSync(path.join(__dirname, 'data', 'data.json'), JSON.stringify(data, null, 2));
    fs.writeFileSync(path.join(__dirname, 'data', 'users.json'), JSON.stringify(users, null, 2));
}

let { data, users } = loadData();

const server = http.createServer((req, res) => {

if (req.method === 'GET') {

    if (req.url === '/') {
        res.writeHead(200, {"content-type":"text/html"});
        const index = fs.readFileSync("./index.html", "utf-8");
        res.end(index);
        //sendFile(res, 'index.html'); // Serve the index.html file

    } else if (req.url === '/login.html') {

        res.writeHead(200, {"content-type":"text/html"});
        const login = fs.readFileSync("./login.html", "utf-8");
        res.end(login);
        //sendFile(res, 'login.html');

    } else if (req.url === '/signup.html') {

        res.writeHead(200, {"content-type":"text/html"});
        const signup = fs.readFileSync("./signup.html", "utf-8");
        res.end(signup);
        //sendFile(res, 'signup.html');

    } else if (req.url === '/todos.html' /*&& req.headers.authorization*/) {

        const authorized = true;//validateUser(req.headers.authorization);

        if (authorized) {
            res.writeHead(200, {"content-type":"text/html"});
            const todo = fs.readFileSync("./todos.html", "utf-8");
            res.end(todo);
            //sendFile(res, 'todos.html'); // Serve the todos.html file
        } else {
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Unauthorized');
        }

    } else {

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');

    }

} else if (req.method === 'POST') {

    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {

        try {

            const parsedBody = JSON.parse(body);

            if (req.url === '/signup') {
                handlesignup(parsedBody, res);
            } else if (req.url === '/login') {
                handleLogin(parsedBody, res);
            } else if (req.url === '/todos') {
                const authorized = validateUser(req.headers.authorization);
            if (authorized) {
                handleTodosPost(parsedBody, res);
            } else {
                res.writeHead(401, { 'Content-Type': 'text/plain' });
                res.end('Unauthorized');
            }

            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }

        } catch (error) {
            console.error('Error parsing request body:', error);
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid request body');

        }
    });

} else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }

});



function sendFile(res, filename) {

    const filePath = path.join(__dirname, 'public', filename);
    fs.readFile(filePath, (err, data) => {

    if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    }

    });

}



function validateUser(authorizationHeader) {

    if (!authorizationHeader) {
        return false;
    }

    const parts = authorizationHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return false;
    }

    const token = parts[1];

    return token === 'dummy_token';

}



function handleRegister(body, res) {

    const { username, password } = body;

    if (!username || !password) {
        return handleError(res, 400, 'Username and password are required');
    }

    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
        return handleError(res, 400, 'Username already exists');
    }

    users.push({ username, password });
    saveData(data, users);
    res.writeHead(302, { 'Location': '/login.html' });
    res.end();

}

function handleLogin(body, res) {

    const { username, password } = body;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return handleError(res, 401, 'Invalid credentials');
    }

    // In a real-world application, you would generate a secure token here

    const token = 'dummy_token'; // Replace with a secure token generation method


    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`<script>localStorage.setItem('token', '${token}'); window.location.href = '/todos';</script>`);

}



function handleTodosPost(body, res) {

    const { task } = body;
    if (!task) {
        return handleError(res, 400, 'Task is required');
    }

    data.push({ id: Date.now(), task, completed: false });
    saveData(data, users);
    res.writeHead(302, { 'Location': '/todos.html' }); // Redirect back to todos page
    res.end();

}

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

