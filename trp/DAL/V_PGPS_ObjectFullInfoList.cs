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
    
    public partial class V_PGPS_ObjectFullInfoList
    {
        public string ObjectID { get; set; }
        public string TerminalID { get; set; }
        public int GISGroupID { get; set; }
        public string ObjectRegNum { get; set; }
        public byte CommChannel { get; set; }
        public Nullable<int> CustomerID { get; set; }
        public string Customer_Name { get; set; }
        public string ContactName { get; set; }
        public Nullable<byte> ObjectType { get; set; }
        public string ObjectTypeDet { get; set; }
        public string ObjectModel { get; set; }
        public string ObjectBrand { get; set; }
        public string GSMVoiceNum { get; set; }
        public Nullable<byte> FuelType { get; set; }
        public Nullable<decimal> FuelRatio { get; set; }
        public Nullable<System.DateTime> ObjectRegDate { get; set; }
        public string Writer { get; set; }
        public string ContractNo { get; set; }
        public Nullable<byte> ServiceType { get; set; }
        public string InstallBillId { get; set; }
        public Nullable<decimal> ServiceFee { get; set; }
        public Nullable<System.DateTime> WriteDate { get; set; }
        public string MDTCompany { get; set; }
        public string MDTType { get; set; }
        public string ProtocolVer { get; set; }
        public string DriverWorkID { get; set; }
        public string Driver_Name { get; set; }
        public string HomePhone { get; set; }
        public string MobilePhone { get; set; }
        public string Sex { get; set; }
        public Nullable<byte> DriveCard_Type { get; set; }
        public string DriveCard_NO { get; set; }
        public string ContactMan1 { get; set; }
        public string ContactPhone1 { get; set; }
        public string MobilePhone1 { get; set; }
        public string ContactMan2 { get; set; }
        public string ContactPhone2 { get; set; }
        public string MobilePhone2 { get; set; }
        public string ObjectColor { get; set; }
    }
}