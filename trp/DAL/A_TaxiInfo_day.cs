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
    
    public partial class A_TaxiInfo_day
    {
        public decimal TaxiInfo_DayID { get; set; }
        public string ObjectID { get; set; }
        public string CustomerID { get; set; }
        public string ObjectType { get; set; }
        public Nullable<System.DateTime> GPSTime { get; set; }
        public Nullable<System.DateTime> ArvTime { get; set; }
        public Nullable<int> S_year { get; set; }
        public Nullable<int> s_month { get; set; }
        public Nullable<int> S_day { get; set; }
        public Nullable<System.DateTime> S_date { get; set; }
        public Nullable<decimal> R_total { get; set; }
        public Nullable<decimal> Mileage_total { get; set; }
        public Nullable<int> W_total { get; set; }
        public Nullable<int> Times_total { get; set; }
        public Nullable<decimal> Money_total { get; set; }
        public string Con { get; set; }
    }
}
