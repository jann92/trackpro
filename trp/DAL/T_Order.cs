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
    
    public partial class T_Order
    {
        public decimal OrderID { get; set; }
        public string CustomerName { get; set; }
        public string Tel { get; set; }
        public Nullable<System.DateTime> InTime { get; set; }
        public Nullable<System.DateTime> OutTime { get; set; }
        public string InRoad { get; set; }
        public Nullable<int> InRoadId { get; set; }
        public string NearRoad { get; set; }
        public Nullable<int> NearRoadId { get; set; }
        public string OutPlace { get; set; }
        public string Detail { get; set; }
        public Nullable<bool> IsDouble { get; set; }
        public Nullable<bool> IsOutCity { get; set; }
        public string BillDispatchNO { get; set; }
        public Nullable<int> OverFlag { get; set; }
        public Nullable<int> TotalNeedCars { get; set; }
        public Nullable<int> NeedCars { get; set; }
        public Nullable<byte> ObjectBrand { get; set; }
        public Nullable<byte> CapacityType { get; set; }
        public Nullable<int> CustomerID { get; set; }
        public Nullable<byte> CommType { get; set; }
        public Nullable<decimal> Lon { get; set; }
        public Nullable<decimal> Lat { get; set; }
        public Nullable<short> Miles { get; set; }
        public Nullable<byte> GISflag { get; set; }
        public Nullable<byte> DispatchFlag { get; set; }
        public Nullable<System.DateTime> DispatchTime { get; set; }
        public string ObjectId { get; set; }
        public Nullable<byte> OrderType { get; set; }
        public string Remark { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public string CreateUser { get; set; }
        public Nullable<System.DateTime> CreateTime { get; set; }
        public Nullable<int> Category { get; set; }
    }
}
