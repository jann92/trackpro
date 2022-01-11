using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Philgps_WebAPI.Helpers;
using premium.marineweather;
using Philgps_WebAPI.Models.Geofence;
using Philgps_WebAPI.Models.Weather;

namespace Philgps_WebAPI.Controllers.Weather
{
    [Authorize]
    [RoutePrefix("Weather")]
    public class WeatherController : ApiController
    {

        public string GroupCodeViewRoleValue = ConfigurationManager.AppSettings["GroupCodeViewRoleValue"];


        [Authorize]
        [Route("Marine")]
        [HttpPost]
        public IHttpActionResult GetMarineWeatherData(GeoCoordinate _GeoCoordinates)
        {
            // set input parameters for the API
            WWOMarineWeatherInput input = new WWOMarineWeatherInput();
            input.query = _GeoCoordinates.Latitude + "," + _GeoCoordinates.Longitude;
            input.format = "JSON";

            // call the location Search method with input parameters
            WorldWeatherOnlinePremiumAPI api = new WorldWeatherOnlinePremiumAPI();
            WWOMarineWeather marineWeather = api.GetMarineWeather(input);

            var d = (from m in marineWeather.data.weather.ToList()
                     select m).ToList();
            var ds = d.FirstOrDefault().hourly.FirstOrDefault();
            var wd = new MarineWeather()
            {
                CloudCover = ds.cloudcover,
                Humidity = ds.humidity,
                Pressure = ds.pressure,
                Precipitation = ds.precipMM,
                TemperatureGround = ds.tempC,
                TemperatureWater = ds.waterTemp_C,
                Wave = ds.swellHeight_m,
                WavePeriod = ds.swellPeriod_secs,
                Wind = ds.windspeedKmph,
                WindDirection = ds.winddir16Point,
                WindDirectionDegree = ds.winddirDegree,
                IconURL = ds.weatherIconUrl.FirstOrDefault().value,
                Description = ds.weatherDesc.FirstOrDefault().value
            };

            return Ok(wd);
        }
    }


}
