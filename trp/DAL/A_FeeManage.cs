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
    
    public partial class A_FeeManage
    {
        public string ObjectID { get; set; }
        public string FeeYear { get; set; }
        public string FeeMonth { get; set; }
        public Nullable<System.DateTime> Service_Startdate { get; set; }
        public Nullable<System.DateTime> FeeFreeFrom { get; set; }
        public Nullable<System.DateTime> FeeFreeTo { get; set; }
        public Nullable<System.DateTime> Fee_Startdate { get; set; }
        public Nullable<System.DateTime> Fee_Enddate { get; set; }
        public Nullable<decimal> Fee_Now { get; set; }
        public Nullable<decimal> Fee_day { get; set; }
        public Nullable<int> FeeType1 { get; set; }
        public Nullable<int> FeeType2 { get; set; }
        public Nullable<int> FeeType3 { get; set; }
        public Nullable<int> FeeType4 { get; set; }
        public Nullable<int> FeeType5 { get; set; }
        public Nullable<int> FeeType6 { get; set; }
        public Nullable<int> FeeType7 { get; set; }
        public Nullable<int> FeeType8 { get; set; }
        public string remark { get; set; }
        public bool IsActive { get; set; }
        public string CreateUser { get; set; }
        public Nullable<System.DateTime> CreateTime { get; set; }
    }
}