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
    
    public partial class Dyan_StagingLocationGateway
    {
        public decimal TracksID { get; set; }
        public string ObjectID { get; set; }
        public Nullable<decimal> Lon { get; set; }
        public Nullable<decimal> Lat { get; set; }
        public Nullable<decimal> Speed { get; set; }
        public Nullable<short> Direct { get; set; }
        public System.DateTime GPSTime { get; set; }
        public System.DateTime LastDataTime { get; set; }
        public Nullable<byte> GPSFlag { get; set; }
        public string MDTStatus { get; set; }
        public Nullable<byte> TransType { get; set; }
        public string StatusDes { get; set; }
        public Nullable<int> MileAge { get; set; }
        public string SourceGateway { get; set; }
    }
}
