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
    
    public partial class sp_PGPS_GetTrackHistory_Staging_Result
    {
        public Nullable<int> TrackID { get; set; }
        public string AssetID { get; set; }
        public Nullable<System.DateTime> GPSTime { get; set; }
        public Nullable<double> Latitude { get; set; }
        public Nullable<double> Longitude { get; set; }
        public Nullable<double> Speed { get; set; }
        public Nullable<int> Direction { get; set; }
        public string StatusDes { get; set; }
        public string Location { get; set; }
        public Nullable<int> Odometer { get; set; }
    }
}
