//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Philgps_WebAPI.DAL
{
    using System;
    using System.Collections.Generic;
    
    public partial class A_ObjectPhoto
    {
        public int PhotoID { get; set; }
        public string ObjectID { get; set; }
        public Nullable<System.DateTime> RevTime { get; set; }
        public byte[] PhotoData { get; set; }
        public Nullable<double> Lon { get; set; }
        public Nullable<double> Lat { get; set; }
        public Nullable<int> Speed { get; set; }
        public Nullable<int> Direct { get; set; }
        public string MDTStatus { get; set; }
        public Nullable<int> ChannelNo { get; set; }
    }
}
