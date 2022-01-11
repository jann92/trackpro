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
    
    public partial class V_GPSdata
    {
        public string MDTCompany { get; set; }
        public string ProtocolVer { get; set; }
        public Nullable<int> CustomerID { get; set; }
        public Nullable<int> MDTID { get; set; }
        public Nullable<int> GISGroupID { get; set; }
        public string AlarmRoute { get; set; }
        public Nullable<byte> CommChannel { get; set; }
        public string ObjectID { get; set; }
        public string ObjectRegNum { get; set; }
        public string GSMVoiceNum { get; set; }
        public string GSMDataNum { get; set; }
        public Nullable<int> DriverID { get; set; }
        public Nullable<System.DateTime> GPSTime { get; set; }
        public Nullable<decimal> Lon { get; set; }
        public Nullable<decimal> Lat { get; set; }
        public Nullable<decimal> Speed { get; set; }
        public Nullable<short> Direct { get; set; }
        public Nullable<byte> GPSFlag { get; set; }
        public string Cur_Location { get; set; }
        public string MDTStatus { get; set; }
        public string OperateStatus { get; set; }
        public Nullable<byte> TransType { get; set; }
        public string StatusDes { get; set; }
        public Nullable<System.DateTime> LastDataTime { get; set; }
        public Nullable<System.DateTime> LastSendTime { get; set; }
        public string LastSendCon { get; set; }
        public string LastDataCon { get; set; }
        public Nullable<int> Times_Dispatch { get; set; }
        public Nullable<System.DateTime> LockTime_Dispatch { get; set; }
        public Nullable<bool> IsLocked_Dispatch { get; set; }
        public bool IsActive { get; set; }
        public Nullable<bool> IsStopService { get; set; }
        public Nullable<bool> IsArrearage { get; set; }
        public Nullable<System.DateTime> ArrearageStartDate { get; set; }
        public Nullable<System.DateTime> LastFeeDate { get; set; }
        public Nullable<byte> CurTransType { get; set; }
        public Nullable<int> MileAge { get; set; }
        public Nullable<decimal> Balance { get; set; }
        public Nullable<decimal> Exhaust { get; set; }
        public Nullable<decimal> Temperature { get; set; }
        public Nullable<decimal> Smoke { get; set; }
        public Nullable<int> Mark { get; set; }
        public string RegisterPwd { get; set; }
    }
}