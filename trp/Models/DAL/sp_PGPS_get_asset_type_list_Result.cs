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
    
    public partial class sp_PGPS_get_asset_type_list_Result
    {
        public string AssetID { get; set; }
        public string Name { get; set; }
        public Nullable<System.DateTime> GPSTime { get; set; }
        public Nullable<decimal> Latitude { get; set; }
        public Nullable<decimal> Longitude { get; set; }
        public Nullable<decimal> Fuel { get; set; }
        public Nullable<decimal> Temperature1 { get; set; }
        public Nullable<decimal> Temperature2 { get; set; }
        public Nullable<int> Sensor1 { get; set; }
        public Nullable<int> Sensor2 { get; set; }
        public string Location { get; set; }
        public Nullable<decimal> Speed { get; set; }
        public Nullable<short> Direction { get; set; }
        public string Status { get; set; }
    }
}
