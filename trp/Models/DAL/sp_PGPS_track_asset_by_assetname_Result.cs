//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Philgps_WebAPI.DAL
{
    using System;
    
    public partial class sp_PGPS_track_asset_by_assetname_Result
    {
        public Nullable<int> CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string AssetID { get; set; }
        public string Name { get; set; }
        public Nullable<System.DateTime> GPSTime { get; set; }
        public Nullable<decimal> Speed { get; set; }
        public Nullable<int> DirectionDegrees { get; set; }
        public string Status { get; set; }
        public string Status1 { get; set; }
        public string AlertStatus { get; set; }
        public string SIMNumber { get; set; }
        public Nullable<decimal> Latitude { get; set; }
        public Nullable<decimal> Longitude { get; set; }
        public Nullable<int> Odometer { get; set; }
        public string Schedule { get; set; }
        public Nullable<bool> IsBan { get; set; }
        public Nullable<decimal> Fuel { get; set; }
        public Nullable<int> Sensor1 { get; set; }
        public Nullable<int> Sensor2 { get; set; }
        public Nullable<decimal> Temperature1 { get; set; }
        public Nullable<decimal> Temperature2 { get; set; }
        public Nullable<int> PowerCut { get; set; }
        public Nullable<int> SOS { get; set; }
        public Nullable<int> Ignition { get; set; }
        public string TypeName { get; set; }
    }
}
