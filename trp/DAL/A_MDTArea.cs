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
    
    public partial class A_MDTArea
    {
        public int MDTAreaID { get; set; }
        public string ObjectID { get; set; }
        public int StationID { get; set; }
        public int StationType { get; set; }
        public decimal StationRUX { get; set; }
        public decimal StationRUY { get; set; }
        public decimal StationLDX { get; set; }
        public decimal StationLDY { get; set; }
        public System.DateTime StationStartTime { get; set; }
        public System.DateTime StationEndTime { get; set; }
        public string Remark { get; set; }
        public bool IsActive { get; set; }
        public string CreateUser { get; set; }
        public Nullable<System.DateTime> CreateTime { get; set; }
    }
}
