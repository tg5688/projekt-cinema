const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const nodeMailer = require('nodemailer');

//Połączenie z mongodb
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'cinema';

// Create a new MongoClient
const client = new MongoClient(url, {
  useNewUrlParser: true
});

//NODE

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//wyświetlanie głównej strony
app.get("/", function (req, res) {
  res.render("home");
});

//wyświetlanie podstrony Repertuar
app.get("/repertuar", function (req, res) {
  res.render("repertuar");
});

//renderowanie repertuaru danego miasta z godzinami seansów i filmami
app.get("/rep/:miasto", function (req, res) {
  app.use('/rep', express.static('public'))

  const city = req.params.miasto;

  client.connect(function (err) {
    const db = client.db(dbName);
    if (err) throw err;

    db.collection("cities").findOne({
      name: city
    }, function (err, result) {
      if (err) throw err;
      res.render('miasto', {
        cityName: result.name,
        movies: result.movies,
      });
    });
  });
});

// W przypadku gdy użytkownik wybrał dany seans wyświetli się sala z wyborem miejsc
app.get("/sala/:miasto/:film", function (req, res) {
  app.use('/sala/:miasto', express.static('public'))

  const city = req.params.miasto;
  const movie = req.params.film;
  client.connect(function (err) {
    const db = client.db(dbName);
    if (err) throw err;
    db.collection("cities").findOne({
      name: city
    }, function (err, result) {
      if (err) throw err;
      //renderowanie sali
      res.render('sala', {
        cityName: result.name,
        movie,
        seats: result.seats
      });
    });
  });
});

// Jeśli wybrano siedzenia w sali aby dokonać rezerwacji trzeba się najpierw zarejestrować
app.post('/rezerwacja', function (req, res) {

  client.connect(function (err) {
    const db = client.db(dbName);
    const email = req.body.email;
    const password = req.body.password;

    db.collection("users").findOne({ //sprawdzanie czy użytkownik jest w bazie
      email: email
    }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result) {
          if (result.password === password) { //gdy hasło jest poprawnie wpisane to następuje wysyłka email z potwierdzeniem rezerwacji
            let transporter = nodeMailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'cinema.projekt123@gmail.com',
                pass: 'xxx'
              }
            });

            let mailOptions = {
              from: '"Rezerwacja kina" <cinema.projekt123@gmail.com>',
              to: req.body.email,
              subject: "Informacja o zarezerwowanych biletach",
              text: 'Witamy. Potwierdzamy rezerwację w kinie na film ' + req.body.movie + '. Koszt biletów (' + req.body.count + ' szt.) wynosi: ' + req.body.price + ' zł.',
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log('Message %s sent: %s', info.messageId, info.response);
              res.render('rezerwacja');
            });
          } else {
            res.render('zle_dane'); // jesli nie wyświetlana jest podstrona o nie poprawnym wprowadzeniu danych logowania
          }
        } else {
          res.render('zle_dane');
        }
      }
    });

  });
});

app.get("/rezerwacja", function (req, res) {
  res.render("rezerwacja");
});

//Panel rejestracji użytkownika do bazy - przed wprowadzaniem danych do serwera za pomocą JS weryfikacja za pomocą wyrażeń regularnych czy email ma prawidłową składnię i czy hasło spełnia minimalne wymagania

app.get("/rejestracja", function (req, res) {
  res.render("rejestracja");
});

app.post("/rejestracja", function (req, res) {

  client.connect(function (err) {
    const db = client.db(dbName);
    const email = req.body.email;
    const password = req.body.password;
    const doc = {
      email,
      password
    };
    db.collection("users").insertOne(doc, function (err, res) {
      if (err) throw err;
    });
    res.redirect("/");
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});