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
    
    public partial class B_POI
    {
        public int PointID { get; set; }
        public int CustomerID { get; set; }
        public string PointName { get; set; }
        public Nullable<int> PointType { get; set; }
        public Nullable<decimal> Lon { get; set; }
        public Nullable<decimal> Lat { get; set; }
        public string Remark { get; set; }
        public Nullable<int> UserID { get; set; }
        public Nullable<System.DateTime> CreateTime { get; set; }
        public Nullable<bool> IfGeofence { get; set; }
        public Nullable<int> Radius { get; set; }
        public Nullable<bool> IfAlert { get; set; }
    }
}
