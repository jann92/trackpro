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
    
    public partial class A_CustomerInfo
    {
        public A_CustomerInfo()
        {
            this.PGPS_CustomerReports = new HashSet<PGPS_CustomerReports>();
            this.PGPS_Tag = new HashSet<PGPS_Tag>();
        }
    
        public int CustomerID { get; set; }
        public string CustomerLevel { get; set; }
        public string Customer_Name { get; set; }
        public string Customer_Abbr { get; set; }
        public string customer_pwd { get; set; }
        public Nullable<byte> Customer_Type { get; set; }
        public Nullable<byte> Customer_status { get; set; }
        public Nullable<byte> credit_level { get; set; }
        public string industry_Type { get; set; }
        public string city { get; set; }
        public string province { get; set; }
        public string Customer_Address { get; set; }
        public string Customer_Post { get; set; }
        public string Contacter { get; set; }
        public string Contacter_CardID { get; set; }
        public string Contacter_Tel { get; set; }
        public string Contacter_fax { get; set; }
        public string Contacter_email { get; set; }
        public string Customer_WEB { get; set; }
        public string Customer_LicenceID { get; set; }
        public string Customer_bank { get; set; }
        public string Customer_accounts { get; set; }
        public string remark { get; set; }
        public bool IsActive { get; set; }
        public string CreateUser { get; set; }
        public Nullable<System.DateTime> CreateTime { get; set; }
    
        public virtual ICollection<PGPS_CustomerReports> PGPS_CustomerReports { get; set; }
        public virtual ICollection<PGPS_Tag> PGPS_Tag { get; set; }
    }
}