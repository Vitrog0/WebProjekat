import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "ZenicaTur",
    password: "BazistA845!",
    port: 5432,
  });

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.render("glavna.ejs");
});
app.get("/priroda", (req,res) => { 
    res.render("priroda.ejs");
});
app.get("/pojestpopit", (req,res) => { 
    res.render("pojestpopit.ejs");
});
app.get("/blog", (req,res) => { 
    res.render("blog.ejs");
});
app.get("/register", (req,res) => {
    res.render("signup.ejs");
});
app.post("/login",(req,res) => {
    console.log(req.body);
    res.redirect("/blog");
});
app.post("/signup",(req,res) => {
    console.log(req.body);
    res.redirect("/blog");
});
app.get("/unos", (req,res) => {
    res.render("unos.ejs");
});
app.post("/unos",(req,res) => {
    console.log(req.body);
    res.redirect("/blog");
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});