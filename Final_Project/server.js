const express = require('express')
const session = require('express-session')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(session({
    secret: 'recipehubsecret',
    resave: false,
    saveUninitialized: true
}))

// Home Page - Show all recipes
app.get('/', function (req, res) {
    let recipes = []
    if (fs.existsSync('./data/recipes.json')) {
        try {
            recipes = JSON.parse(fs.readFileSync('./data/recipes.json'))
        } catch (e) {
            recipes = []
        }
    }

    let html = fs.readFileSync('./views/home.html', 'utf8')
    let content = ''

    for (let recipe of recipes) {
        content += `
            <div class="recipe-card">
                <h3>${recipe.title}</h3>
                <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                <p><strong>Steps:</strong> ${recipe.steps}</p>
                <p><em>By: ${recipe.author || 'RecipeHub'}</em></p>
            </div>
        `
    }

    html = html.replace('{{recipes}}', content)
    res.send(html)
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/register.html'))
})

app.post('/register', (req, res) => {
    let users = []
    if (fs.existsSync('./data/users.json')) {
        users = JSON.parse(fs.readFileSync('./data/users.json'))
    }
    users.push({ username: req.body.username, password: req.body.password })
    fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2))
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'))
})

app.post('/login', (req, res) => {
    let users = []
    if (fs.existsSync('./data/users.json')) {
        users = JSON.parse(fs.readFileSync('./data/users.json'))
    }
    let valid = users.some(u => u.username === req.body.username && u.password === req.body.password)
    if (valid) {
        req.session.username = req.body.username
        res.redirect('/')
    } else {
        res.send("Invalid login")
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.get('/recipes/add', (req, res) => {
    if (!req.session.username) return res.redirect('/login')
    res.sendFile(path.join(__dirname, 'views/addRecipe.html'))
})

app.post('/recipes/add', function (req, res) {
    if (!req.session.username) {
        res.redirect('/login')
    } else {
        var title = req.body.title
        var ingredients = req.body.ingredients
        var steps = req.body.steps
        var image = req.body.image || '/images/placeholder.jpg'

        var recipes = []
        if (fs.existsSync('./data/recipes.json')) {
            try {
                recipes = JSON.parse(fs.readFileSync('./data/recipes.json'))
            } catch (err) {
                recipes = []
            }
        }

        recipes.push({
            title: title,
            ingredients: ingredients,
            steps: steps,
            author: req.session.username,
            image: image
        })

        fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes, null, 2))
        res.redirect('/recipes/view')
    }
})

app.get('/recipes/view', function (req, res) {
    let recipes = []
    if (fs.existsSync('./data/recipes.json')) {
        try {
            recipes = JSON.parse(fs.readFileSync('./data/recipes.json'))
        } catch (err) {
            console.log('Error parsing recipes:', err)
        }
    }

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Explore Recipes</title>
        <link rel="stylesheet" href="/styles.css">
        <style>
            body {
                font-family: sans-serif;
                background-image: url('/images/bg3.jpg');
                background-color: #f8f5f2;
                margin: 0;
                padding: 0;
            }
            header {
                background-color:rgb(28, 163, 246);
                padding: 20px;
                box-shadow: 0 2px 4px rgba(97, 51, 51, 0.94);
                text-align: center;
            }
            h1 {
                margin: 0;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                padding: 30px;
            }
            .card {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .card img {
                width: 100%;
                height: 180px;
                object-fit: cover;
                border-radius: 8px;
                margin-bottom: 10px;
            }
            .footer {
                text-align: center;
                padding: 20px;
                background-color: #eee;
                margin-top: 40px;
            }
        </style>
    </head>
    <body>
        <header class="site-header">
            <div class="logo-title">
                <img src="/images/logo.jpg" alt="RecipeHub Logo" class="logo-img">
                <h1 class="site-title">RecipeHub</h1>
    
            <h1>🍲 Explore Recipes</h1>
            <p>
                ${req.session.username 
                ? '<a href="/recipes/add">Add Recipe</a> | <a href="/logout">Logout</a>' 
                : '<a href="/login">Login</a> | <a href="/register">Register</a>'
                } | <a href="/">🏠 Back to Home</a>
            </p>
            </div>         
            </header>
        <div class="grid">`

    recipes.forEach(r => {
        html += `
            <div class="card">
                <img src="${r.image || '/placeholder.jpg'}" alt="Recipe Image">
                <h2>${r.title}</h2>
                <p><strong>By:</strong> ${r.author}</p>
                <p><strong>Ingredients:</strong> ${r.ingredients}</p>
                <p><strong>Steps:</strong> ${r.steps}</p>
            </div>`
    })

    html += `</div>
        <div class="footer">
            <h3>Connect With Us</h3>
            <p>Follow us on Instagram, Pinterest, and Facebook for more delicious recipes.</p>
        </div>
    </body>
    </html>
    `

    res.send(html)
})



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
