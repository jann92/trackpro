using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Philgps_WebAPI.Models.Track;

namespace Philgps_WebAPI.Models.Geofence
{
    public class ZoneType
    {
        public int ZoneTypeID { get; set; }
        public string Name { get; set; }
    }

    public class Zone
    {
        public int ZoneID { get; set; }
        public string Name { get; set; }
        public int ZoneTypeID { get; set; }
        public string ZoneTypeName { get; set; }
        public bool Allowed { get; set; }
        public bool OutOfZone { get; set; }
        public double AreaInMeters { get; set; }
        public int UserID { get; set; }
        public double SpeedLimitInMPH { get; set; }
        public string Color { get; set; }
        public bool Enabled { get; set; }
        public DateTime TimeBasedStart { get; set; }
        public DateTime TimeBasedEnd { get; set; }
        //public int AssignedAssetsCount { get; set; }

        public List<GeoCoordinate> GeoCoordinateList { get; set; }
        public List<string> GeoCoordinatesList { get; set; }
        public List<String> AssignedAssetList { get; set; }
        public string Geometry { get; set; }
        public double Radius { get; set; }

        public Zone()
        {
            this.GeoCoordinateList = new List<GeoCoordinate>();
            this.AssignedAssetList = new List<String>();
        }
    }

    public class ZoneLoadParameter
    {
        public int NextPage { get; set; }
        public string Keyword { get; set; }
        public int Take { get; set; }
    }

    public class ZoneGeoJson
    {
        public int GeofenceId { get; set; }
        public string geojson { get; set; }
        public int ZoneTypeId { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public bool Enabled { get; set; }
        public bool Allowed { get; set; }
        public double Radius { get; set; }
    }


    public class ZoneAssignedAssets
    {
        public string AssetID { get; set; }
        public string AssetName { get; set; }
        public bool IsAssigned { get; set; }
    }

    public class AssetAssignedZones
    {
        public int ZoneID { get; set; }
        public string Name { get; set; }
        public bool IsAssigned { get; set; }
    }

    public class insideZone
    {
        //public string[] ObjectList { get; set; }
        public List<string> ObjectList { get; set; }
        public float meters { get; set; }
    }

    
    public class AssetInsideZone
    {
        public string AssetID { get; set; }
        public int? GeofenceID { get; set; }
        public string GeofenceName { get; set; }
        public bool? AllowedZone { get; set; }
        public string Color { get; set; }
        public int ZoneTypeID { get; set; }
        public string Geometry { get; set; }
    }
    public class AssetOutOfZone
    {
        public string AssetID { get; set; }
        public int? GeofenceID { get; set; }
        public string GeofenceName { get; set; }
        public bool? AllowedZone { get; set; }
        public bool? IsOutsideZone { get; set; }
        public string Geometry { get; set; }
        public string Color { get; set; }
        public int? ZoneTypeID { get; set; }

}

   
}
