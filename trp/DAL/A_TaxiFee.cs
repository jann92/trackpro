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
    
    public partial class A_TaxiFee
    {
        public int TaxiFeeID { get; set; }
        public string ObjectID { get; set; }
        public Nullable<System.DateTime> S_Datetime { get; set; }
        public Nullable<System.DateTime> E_Datetime { get; set; }
        public Nullable<decimal> Price { get; set; }
        public Nullable<int> W_Time { get; set; }
        public Nullable<decimal> R_km { get; set; }
        public Nullable<decimal> Total_Money { get; set; }
        public Nullable<decimal> P_km { get; set; }
        public Nullable<decimal> sLon { get; set; }
        public Nullable<decimal> sLat { get; set; }
        public Nullable<decimal> eLon { get; set; }
        public Nullable<decimal> eLat { get; set; }
        public string ICCardID { get; set; }
        public string businessID { get; set; }
        public Nullable<int> cheatNum { get; set; }
        public string CarStatus { get; set; }
        public string Con { get; set; }
        public string remark { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public string CreateUser { get; set; }
        public Nullable<System.DateTime> CreateTime { get; set; }
    }
}
