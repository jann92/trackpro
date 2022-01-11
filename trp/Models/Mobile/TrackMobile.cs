using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models.Track
{
    public class TrackMobile
    {
        public int TrackID { get; set; }
        public string AssetID { get; set; }
        public string AssetName { get; set; }
        public int CustomerID { get; set; }
        public string Location { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int? Odometer { get; set; }
        public Decimal? Speed { get; set; }
        public string DirectionCardinal { get; set; }
        public string DirectionDegrees { get; set; }
        public DateTime GPSTime { get; set; }
        public int? Temperature1 { get; set; }
        public int? Temperature2 { get; set; }
        public int? Fuel { get; set; }
        public Status Status { get; set; }
        public string Description { get; set; }
        public string SIMNum { get; set; }


    }

    public class TrackMobileHistory
    {
        public int TrackID { get; set; }
        public string AssetID { get; set; }
        public string Location { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int? Speed { get; set; }
        public string DirectionCardinal { get; set; }
        public string DirectionDegrees { get; set; }
        public DateTime GPSTime { get; set; }
        public Status Status { get; set; }
    }
}