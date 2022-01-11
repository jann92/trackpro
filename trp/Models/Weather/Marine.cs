using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models.Weather
{
    public class MarineWeather
    {
        public int CloudCover { get; set; }
        public float Humidity { get; set; }
        public int Pressure { get; set; }
        public int Wind { get; set; }
        public int WindDirectionDegree { get; set; }
        public string WindDirection { get; set; }
        public int TemperatureWater { get; set; }
        public int TemperatureGround { get; set; }
        public float Wave { get; set; }
        public float WavePeriod { get; set; }
        public float Precipitation { get; set; }
        public string IconURL { get; set; }
        public string Description { get; set; }
    }
}