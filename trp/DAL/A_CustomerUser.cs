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
    
    public partial class A_CustomerUser
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public Nullable<byte> UserType { get; set; }
        public string OwnerID { get; set; }
        public Nullable<System.DateTime> RegDate { get; set; }
        public string Password { get; set; }
        public string Default_map { get; set; }
        public Nullable<System.DateTime> Available_StartTime { get; set; }
        public Nullable<System.DateTime> Available_EndTime { get; set; }
        public string remark { get; set; }
        public bool IsActive { get; set; }
        public string CreateUser { get; set; }
        public Nullable<System.DateTime> CreateTime { get; set; }
    }
}
