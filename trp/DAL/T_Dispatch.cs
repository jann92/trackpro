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
    
    public partial class T_Dispatch
    {
        public decimal SendId { get; set; }
        public decimal OrderId { get; set; }
        public string ObjectId { get; set; }
        public Nullable<System.DateTime> SendTime { get; set; }
        public string BillDispatchNO { get; set; }
        public Nullable<byte> FinishFlag { get; set; }
        public string Remark { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public string CreateUser { get; set; }
        public Nullable<System.DateTime> CreateTime { get; set; }
    }
}
