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
    
    public partial class Route
    {
        public int RouteId { get; set; }
        public double DistanceInMeters { get; set; }
        public double BufferSizeInMeters { get; set; }
        public Nullable<double> StartLatitude { get; set; }
        public Nullable<double> StartLongitude { get; set; }
        public Nullable<double> EndLatitude { get; set; }
        public Nullable<double> EndLongitude { get; set; }
        public string StartLocation { get; set; }
        public string EndLocation { get; set; }
        public Nullable<System.DateTime> StartDatetime { get; set; }
        public Nullable<System.DateTime> EndDatetime { get; set; }
        public Nullable<bool> Type { get; set; }
    
        public virtual Geofence Geofence { get; set; }
    }
}
