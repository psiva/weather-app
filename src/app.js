const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const app = express();

const port = process.env.PORT || 3000;

//Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
//Setup to serve static assets
app.use(express.static(publicDirPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Siva Puvvada"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    message: "Enter a location to get the weather",
    name: "Siva Puvvada"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    imgSrc: "/img/photo.jpeg",
    name: "Siva Puvvada"
  });
});
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address"
    });
  }
  geocode(
    req.query.address,
    (error, { longitude, latitude, location } = {}) => {
      if (error) {
        return res.send({
          error
        });
      }
      forecast(longitude, latitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location: location
        });
      });
    }
  );
});

app.get("*", (req, res) => {
  res.render("error", {
    title: "404",
    message:
      "You have reached an non-existent page. Please use one of the pages above",
    name: "Siva Puvvada"
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
