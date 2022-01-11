using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Philgps_WebAPI.Models.Geofence
{
    public class LandmarkType
    {
        public int LandmarkTypeID { get; set; }
        public string Name { get; set; }
    }

    public class Landmark
    {
        public int LandmarkID { get; set; }
        public string Name { get; set; }
        public int LandmarkTypeID { get; set; }
        public double RadiusInMeters { get; set; }
        public int UserID { get; set; }
        public bool Enabled { get; set; }
        public List<GeoCoordinate> GeoCoordinateList { get; set; }
        public bool isExist { get; set; }
        public string LandmarkTypeName { get; set; }
        public Landmark()
        {
            this.GeoCoordinateList = new List<GeoCoordinate>();
        }
    }


}
