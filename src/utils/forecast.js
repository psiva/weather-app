const request = require("request");

const forecast = (longitude, latitude, callback) => {
  const url = `https://api.darksky.net/forecast/c77031056df3088b5c5a37764c0c0896/${latitude},${longitude}?exclude=['hourly','minutely']&units=si`;
  request(
    {
      url,
      json: true
    },
    (error, { body }) => {
      if (error) {
        callback("Unable to connect to weather service.Please try later");
      } else if (body.error) {
        callback("Unable to find location. Please try a different location.");
      } else {
        const { temperature, precipProbability: chanceOfRain } = body.currently;
        const { temperatureMin, temperatureMax } = body.daily.data[0];
        callback(
          undefined,
          `${
            body.daily.data[0].summary
          }. It is currently ${temperature} degrees out. There is a ${chanceOfRain}% chance of rain. Today min temperature would be ${temperatureMin} degrees and a max of ${temperatureMax} degrees`
        );
      }
    }
  );
};

module.exports = forecast;
