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
    
    public partial class V_ActivityPerCustomer
    {
        public string ObjectRegNum { get; set; }
        public string ObjectID { get; set; }
        public string GSMVoiceNum { get; set; }
        public System.DateTime GPSTime { get; set; }
        public string Cur_Location { get; set; }
        public string StatusDes { get; set; }
        public Nullable<decimal> Speed { get; set; }
        public Nullable<int> MileAge { get; set; }
        public Nullable<short> Direct { get; set; }
        public Nullable<double> Lon { get; set; }
        public Nullable<double> Lat { get; set; }
        public System.DateTime LastDataTime { get; set; }
    }
}