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
    
    public partial class A_Road_PlanStation
    {
        public decimal ID { get; set; }
        public string VehicleID { get; set; }
        public string VehicleNo { get; set; }
        public string RoadID { get; set; }
        public int StationID { get; set; }
        public string StationName { get; set; }
        public Nullable<System.DateTime> StartTime { get; set; }
        public Nullable<System.DateTime> EndTime { get; set; }
        public Nullable<int> StationType { get; set; }
    }
}