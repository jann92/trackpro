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
    
    public partial class A_TaxInfo
    {
        public decimal TaxInfoID { get; set; }
        public System.DateTime GenDate { get; set; }
        public Nullable<decimal> Distance { get; set; }
        public Nullable<decimal> Fare { get; set; }
        public Nullable<decimal> AircFee { get; set; }
        public Nullable<decimal> Toll { get; set; }
        public Nullable<decimal> sLon { get; set; }
        public Nullable<decimal> sLat { get; set; }
        public Nullable<decimal> eLon { get; set; }
        public Nullable<decimal> eLat { get; set; }
        public string ICCardID { get; set; }
        public string remark { get; set; }
        public bool IsActive { get; set; }
        public string CreateUser { get; set; }
        public Nullable<System.DateTime> CreateTime { get; set; }
    }
}
