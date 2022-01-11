using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models.Geofence
{
    public class Route
    {
        public int RouteID { get; set; }
        public int UserID { get; set; }
        public string Name { get; set; }
        public double DistanceInMeters { get; set; }
        public double BufferSizeInMeters { get; set; }
        public Nullable<double> StartLatitude { get; set; }
        public Nullable<double> StartLongitude { get; set; }
        public Nullable<double> EndLatitude { get; set; }
        public Nullable<double> EndLongitude { get; set; }
        public DateTime? StartDatetime { get; set; }
        public DateTime? EndDatetime { get; set; }
        public string StartLocation { get; set; }
        public string EndLocation { get; set; }
        public double SpeedLimitRoute { get; set; }
        public string Geom { get; set; }
        public string Type { get; set; }


        public List<GeoCoordinate> GeoCoordinateList { get; set; }
        public List<String> AssignedAssetList { get; set; }

        public Route()
        {
            this.GeoCoordinateList = new List<GeoCoordinate>();
            this.AssignedAssetList = new List<String>();
        }
    }

    public class RouteStatus
    {
        public string AssetID { get; set; }
        public bool? IsOnRoute { get; set; }
    }

    public class RouteAssignedAssets
    {
        public string AssetID { get; set; }
        public string AssetName { get; set; }
        public bool IsAssigned { get; set; }
    }
    public class AssetAssignedRoutes
    {
        public int RouteID { get; set; }
        public string Name { get; set; }
        public bool IsAssigned { get; set; }
    }
}