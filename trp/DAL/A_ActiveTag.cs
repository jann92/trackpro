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
    
    public partial class A_ActiveTag
    {
        public decimal ID { get; set; }
        public string TagID { get; set; }
        public Nullable<short> TagType { get; set; }
        public string ObjectID { get; set; }
        public Nullable<System.DateTime> BoardTime { get; set; }
        public Nullable<System.DateTime> GetOffTime { get; set; }
        public Nullable<decimal> Lon { get; set; }
        public Nullable<decimal> Lat { get; set; }
        public Nullable<decimal> Speed { get; set; }
        public Nullable<short> Direct { get; set; }
        public Nullable<System.DateTime> GPSTime { get; set; }
        public Nullable<int> GPSFlag { get; set; }
        public string MDTStatus { get; set; }
        public Nullable<int> Mileage { get; set; }
        public Nullable<decimal> Fuel { get; set; }
    }
}
