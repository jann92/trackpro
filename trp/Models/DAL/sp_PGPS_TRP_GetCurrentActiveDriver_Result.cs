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
    
    public partial class sp_PGPS_TRP_GetCurrentActiveDriver_Result
    {
        public string ObjectID { get; set; }
        public Nullable<int> DriverId { get; set; }
        public string Code { get; set; }
        public Nullable<int> TagId { get; set; }
        public string DriverName { get; set; }
        public Nullable<System.DateTime> EventDateTime { get; set; }
        public string LicenseNo { get; set; }
        public string LicenseType { get; set; }
        public string MobilePhoneNo { get; set; }
        public Nullable<int> isAssigned { get; set; }
        public Nullable<int> CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string Schedule { get; set; }
        public int IsAvailable { get; set; }
    }
}