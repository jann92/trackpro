using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models.Track
{
    public class DriverTag
    {
        public string ObjectID { get; set; }
        public DateTime BoardTime { get; set; }
        public DateTime GPSTime { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public double Speed { get; set; }
        public int Direction { get; set; }
        public int GPSFlag { get; set; }
        public string MDTStatus { get; set; }
        public int Mileage { get; set; }
        public double Fuel { get; set; }
        public string TagID { get; set; }
        public int TagType { get; set; }
        public int DriverID { get; set; }
    }
}