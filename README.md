# MenuWebsite

Made a website named as RecipeHub which is a lightweight web application for sharing and exploring recipes. It is built with Node.js and Express, and supports user registration, login, and session-based access. Logged-in users can submit recipes with a title, ingredients, steps, and an optional image. All visitors can browse recipes, regardless of whether they are signed in.

# Authors  
Ashutosh Dayal  

# Dependencies  
Node.js  
Express.js  
express-session  


# How to run this program
# 1. Install required packages
npm install express express-session
# 2. Run the server
node server.js
```
go to:

```
http://localhost:3000
```

---

### Usage  
- Register a user at `/register` page.  
- Log in and access the recipe submission form.  
- Add recipes with title, ingredients, steps, and image URL (optional).  
- Browse all recipes from the homepage or at `/recipes/view`.  
- Logout once you're done so the session can be cleared securely.

---

### Features  
- User login and registration with session support  
- Add and view recipes  
- Recipe data stored in JSON files  
- Protected routes for authenticated users  
- Responsive and clean UI with a simple layout

