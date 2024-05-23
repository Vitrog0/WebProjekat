import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";

const app = express();
const port = 3000;
const saltRounds = 10;
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "ZenicaTur",
    password: "BazistA845!",
    port: 5432,
  });
db.connect();

app.get("/carpe", (req,res) => {
    res.redirect("https://www.carpediemzenica.ba/");
});
app.get("/beslic", (req,res) => {
    res.redirect("https://www.facebook.com/cevabdzinicabeslic/?locale=hr_HR");
});
app.get("/dubrovnik", (req,res) => {
    res.redirect("https://www.hoteldubrovnik.ba/");
});
app.get("/oliv", (req,res) => {
    res.redirect("https://oliv.ba/");
});
app.get("/gradska", (req,res) => {
    res.redirect("https://www.instagram.com/gradska_kafana_zenica/");
});
app.get("/korzo", (req,res) => {
    res.redirect("https://www.facebook.com/korzozenica/?locale=hr_HR");
});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'bekon',
    resave: false,
    saveUninitialized: false,
    cookie: { name: 'jakaSesija' }
  }));
  function checkNotAuthenticated(req, res, next) {
    if (!req.session.isLoggedIn) {
      return res.redirect('/register'); //ako nije ulogovan, redirektujemo ga na login
    }
    next();
  }
app.get("/", (req,res) => {
    res.render("glavna.ejs");
});
app.get("/priroda", (req,res) => { 
    res.render("priroda.ejs");
});
app.get("/pojestpopit", (req,res) => { 
    res.render("pojestpopit.ejs");
});
app.get("/blog", async (req,res) => {  
    const result =  await db.query("SELECT blog.*, users.username FROM blog JOIN users ON users.id = blog.user_id");
    console.log(result.rows);
    res.render("blog.ejs", {
        posts: result.rows,
        role: req.session.role
    });
});
app.get("/sport", (req,res) => { 
    res.render("sport.ejs");
});
app.get("/oficijelna" , (req,res) => {
  res.redirect("https://zenica.ba/");
});
app.get("/register", (req,res) => {
    res.render("signup.ejs");
});
app.post("/signup", async (req,res) => {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
          email,
        ]);
    
        if (checkResult.rows.length > 0) {
          res.send("Email već postoji.Pokušaj se ulogovati.");
        } else {
          //Hashuje se password
          bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
              console.error("Error u hashovanju passworda:", err);
            } else {
            
              await db.query(
                "INSERT INTO users (email,username,password) VALUES ($1, $2, $3)",
                [email, username, hash]
              );
              res.render("unos.ejs");
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }); 
app.post("/login", async (req,res) => {
    const loginemail = req.body.email;
    const loginpassword = req.body.password;
    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
          loginemail,
        ]);
        if(checkResult.rows.length === 0){
            res.send("Korisnik ne postoji.");
        } else {
            const user = checkResult.rows[0];
            bcrypt.compare(loginpassword, user.password, (err, result) => {
                if (result) {
                  req.session.isLoggedIn = true;
                  req.session.userId = user.id;
                  req.session.role = user.role;
                  console.log(req.session.role);
                  res.render("unos.ejs");
                } else {
                  res.send("Pogrešan password.");
                }
              });
        }

    } catch (err) {
        console.log(err);
    }
});
app.get("/unos",checkNotAuthenticated, (req,res) => {
    res.render("unos.ejs");
});
app.get("/logout", (req,res) => {
    req.session.destroy(err => {
        if(err) {
          return res.redirect('/unos');
        }
        res.clearCookie('jakaSesija');
        res.redirect('/register');
      })
    });
app.post("/unos", async(req,res) => {
    const userId = req.session.userId;
    const title = req.body.title;
    const content = req.body.content;
    console.log(userId);
    try {
        await db.query("INSERT INTO blog (title,content,user_id) VALUES ($1,$2,$3)", [title,content,userId]);
    }catch(err) {
        console.log(err);
    }
    res.redirect("/blog");
});
app.post('/delete-post/:id', async (req, res) => {
    const postId = req.params.id;
    await db.query('DELETE FROM blog WHERE id = $1', [postId]);
    res.redirect('/blog');
  });
app.get("/insta" , (req,res) => {
  res.redirect("https://www.instagram.com/filip33s");
   });
app.get("/face", (req,res) => {
  res.redirect("https://www.facebook.com/profile.php?id=100008393860903");
});
app.get("/git", (req,res) => {
  res.redirect("https://github.com/Vitrog0/WebProjekat");
});
app.get("/kontakt", (req,res) => {
    res.render("kontakt.ejs");
});
app.get("/onama", (req,res) => {
  res.render("onama.ejs");
});
app.post("/posalji", async (req,res) => {
    const ime = req.body.ime;
    const mail = req.body.email;
    try {
        await db.query("INSERT INTO kontakt (ime,mail) VALUES ($1,$2)",[ime,mail]);
        res.redirect("/blog");
    } catch(err) {
      console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});