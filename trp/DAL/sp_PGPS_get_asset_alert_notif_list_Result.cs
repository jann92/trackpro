//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Philgps_WebAPI.DAL
{
    using System;
    
    public partial class sp_PGPS_get_asset_alert_notif_list_Result
    {
        public string AssetID { get; set; }
        public string Name { get; set; }
        public Nullable<System.DateTime> GPSTime { get; set; }
        public Nullable<double> Latitude { get; set; }
        public Nullable<double> Longitude { get; set; }
        public Nullable<int> OverIdle { get; set; }
        public Nullable<int> OverSpeed { get; set; }
        public Nullable<int> OverPark { get; set; }
        public Nullable<int> NoZone { get; set; }
        public Nullable<int> OutOfZone { get; set; }
        public Nullable<int> SOS { get; set; }
        public Nullable<int> Sensor1 { get; set; }
        public Nullable<int> Sensor2 { get; set; }
        public Nullable<int> PowerCut { get; set; }
        public Nullable<int> HarshBraking { get; set; }
        public Nullable<int> HarshAcceleration { get; set; }
        public Nullable<int> TemperatureUp { get; set; }
        public Nullable<int> TemperatureDown { get; set; }
    }
}
