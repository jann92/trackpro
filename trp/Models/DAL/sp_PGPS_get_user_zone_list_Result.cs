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
    
    public partial class sp_PGPS_get_user_zone_list_Result
    {
        public string Color { get; set; }
        public bool Allowed { get; set; }
        public bool Enabled { get; set; }
        public string ZoneName { get; set; }
        public double SpeedLimitInMph { get; set; }
        public int UserID { get; set; }
        public int ZoneID { get; set; }
        public string Geometry { get; set; }
        public Nullable<double> AreaInMeters { get; set; }
        public Nullable<int> ZoneTypeID { get; set; }
        public string ZoneTypeName { get; set; }
        public string Name { get; set; }
        public Nullable<bool> Share { get; set; }
    }
}
