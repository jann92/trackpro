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
    
    public partial class A_TaxiTracks
    {
        public decimal TaxiTracksID { get; set; }
        public string ObjectID { get; set; }
        public string ObjectRegNum { get; set; }
        public string GSMVoiceNum { get; set; }
        public Nullable<byte> TaxiFlag { get; set; }
        public Nullable<System.DateTime> GPSTime { get; set; }
        public Nullable<System.DateTime> lastDataTime { get; set; }
        public Nullable<decimal> Lon { get; set; }
        public Nullable<decimal> Lat { get; set; }
        public Nullable<short> Speed { get; set; }
        public Nullable<short> Direct { get; set; }
        public Nullable<byte> GPSFlag { get; set; }
        public string MDTStatus { get; set; }
        public Nullable<byte> TransType { get; set; }
        public Nullable<int> StateInt { get; set; }
    }
}
