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
    
    public partial class A_Road_DataReport
    {
        public decimal ID { get; set; }
        public string VehicleSIM { get; set; }
        public string VehicleNo { get; set; }
        public string curRoadID { get; set; }
        public string curRoadName { get; set; }
        public System.DateTime GPSTime { get; set; }
        public decimal Lon { get; set; }
        public decimal Lat { get; set; }
        public int Speed { get; set; }
        public Nullable<int> RoadSpeed { get; set; }
        public string Direction { get; set; }
        public string Status { get; set; }
    }
}
