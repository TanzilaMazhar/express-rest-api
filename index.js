import express from 'express';

const app = express();
app.use(express.json());
const port = 3000;

let registeredUsers = [];

const constantUsers = [
    "admin@gmail.com",
    "abc@gmail.com",
    "123@gmail.com",
    "xyz@gmail.com",
];

const constantRoles = [
    "admin", "programmer", "developer", "Analyst"
];

app.post('/register', (req, res) => {
    //user enter
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(404).json({ message: "email or password are required" });
    }

    //email format
    const emailRegix = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegix.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    //password format
    if (password.length < 4) {
        return res.status(400).json({ message: "password must be atleast 4 characters long" });
    }

    //email exists or not
    const exists = registeredUsers.find((u) => u.email === email);
    if (exists) {
        return res.status(400).json({ message: "user already exists" });
    }

    //if role admin or not present in constantUser
    if (role === "admin" && !constantUsers.includes(email)) {
        return res.status(403).json({ message: "Only authorized emails can register as admin" });
    }
    //assign role
    let assignedRole = "visitor";
    if (constantUsers.includes(email)) {
        assignedRole = "admin"
    } else if (constantRoles.includes(role)) {
        assignedRole = role;
    }

    // register user
    const newUser = { email, password, role: assignedRole };
    registeredUsers.push(newUser);
    return res.status(201).json({
        message: "user registered successfully",
        user: newUser
    });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).json({ message: "email or password are required" });
    }

    const user = registeredUsers.find(user =>
        user.email === email && user.password === password
    );

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
        message: "login Successful!",
        role: user.role
    });
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});