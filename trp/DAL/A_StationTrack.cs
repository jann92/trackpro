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
    
    public partial class A_StationTrack
    {
        public int ID { get; set; }
        public Nullable<int> RectID { get; set; }
        public string ObjectID { get; set; }
        public Nullable<short> RectType { get; set; }
        public Nullable<System.DateTime> GPSTIme { get; set; }
        public Nullable<int> Mileage { get; set; }
        public Nullable<decimal> Mileage2 { get; set; }
    }
}
