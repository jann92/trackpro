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
    
    public partial class sp_PGPS_AccountInformation_Result
    {
        public Nullable<int> accountId { get; set; }
        public Nullable<int> accountParent { get; set; }
        public Nullable<int> user_id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string encryptedPassword { get; set; }
        public Nullable<System.DateTime> createTime { get; set; }
        public string remarks { get; set; }
        public string enabled { get; set; }
        public string apiKey { get; set; }
        public string email { get; set; }
        public Nullable<System.DateTime> lastupdatetime { get; set; }
        public Nullable<int> createrolevalue { get; set; }
        public Nullable<int> readrolevalue { get; set; }
        public Nullable<int> updaterolevalue { get; set; }
        public Nullable<int> deleterolevalue { get; set; }
        public Nullable<int> parentuserid { get; set; }
        public string parent { get; set; }
        public Nullable<int> geofence { get; set; }
        public string userType { get; set; }
        public Nullable<bool> alert { get; set; }
        public Nullable<System.DateTime> lastlogintime { get; set; }
    }
}
