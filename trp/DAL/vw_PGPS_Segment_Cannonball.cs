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
    using System.Collections.Generic;
    
    public partial class vw_PGPS_Segment_Cannonball
    {
        public string AssetID { get; set; }
        public string Asset { get; set; }
        public Nullable<int> CustomerID { get; set; }
        public string Customer { get; set; }
        public Nullable<int> StartZoneID { get; set; }
        public string StartZone { get; set; }
        public Nullable<int> StartCheckpointNo { get; set; }
        public Nullable<int> EndZoneID { get; set; }
        public string EndZone { get; set; }
        public Nullable<int> EndCheckpointNo { get; set; }
        public Nullable<decimal> MaxSpeed { get; set; }
        public Nullable<decimal> AverageSpeed { get; set; }
        public Nullable<int> Duration { get; set; }
        public Nullable<int> Distance { get; set; }
        public Nullable<decimal> StartLongitude { get; set; }
        public Nullable<decimal> StartLatitude { get; set; }
        public Nullable<decimal> EndLongitude { get; set; }
        public Nullable<decimal> EndLatitude { get; set; }
        public Nullable<System.DateTime> StartDateTime { get; set; }
        public Nullable<System.DateTime> EndDateTime { get; set; }
    }
}
