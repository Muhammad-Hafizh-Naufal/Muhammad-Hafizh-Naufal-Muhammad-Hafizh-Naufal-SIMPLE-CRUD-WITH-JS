// Import Resources
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

// Validasi
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "views");

// Setup Database
const db = mysql.createConnection({
  host: "localhost",
  database: "scholl",
  user: "root",
  password: "",
});

// connect to database
db.connect((err) => {
  if (err) throw err;
  console.log("Database  Connected...");

  const sql = "SELECT * FROM user";

  // get data
  app.get("/", (req, res) => {
    // Mengambil data
    db.query(sql, (err, result) => {
      const users = JSON.parse(JSON.stringify(result));
      console.log("Database Result =>", users);
      res.render("index", { users: users, title: "Daftar Mahasiswa" });
    });
  });

  // post data
  app.post("/tambah", (req, res) => {
    const insertSQL = `INSERT INTO user (NPM, NAMA, KELAS) VALUES ('${req.body.npm}', '${req.body.nama}', '${req.body.kelas}')`;
    db.query(insertSQL, (err, result) => {
      if (err) throw err;
      res.redirect("/");
    });
  });

  // delete data
  app.post("/delete/:npm", (req, res) => {
    const deleteSQL = `DELETE FROM user WHERE NPM = '${req.params.npm}'`;
    db.query(deleteSQL, (err, result) => {
      if (err) throw err;
      res.redirect("/");
    });
  });
});

// Untuk get edit page
app.get("/edit/:npm", (req, res) => {
  const selectSQL = `SELECT * FROM user WHERE NPM = '${req.params.npm}'`;

  db.query(selectSQL, (err, result) => {
    if (err) throw err;
    const user = JSON.parse(JSON.stringify(result[0]));
    res.render("edit", { user: user });
  });
});

// Untuk post edit data
app.post("/edit/:npm", (req, res) => {
  const updateSQL = `UPDATE user SET NAMA='${req.body.nama}', KELAS='${req.body.kelas}' WHERE NPM = '${req.params.npm}'`;

  db.query(updateSQL, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(8000, () => {
  console.log("Server running on port 8000 click http://localhost:8000/");
});
