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
    
    public partial class A_UserLog
    {
        public int LogID { get; set; }
        public Nullable<int> AppID { get; set; }
        public int UserID { get; set; }
        public Nullable<int> GroupID { get; set; }
        public Nullable<System.DateTime> LogTime { get; set; }
        public Nullable<byte> LogState { get; set; }
        public string LopIp { get; set; }
    }
}
