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
    
    public partial class SpTest_Result
    {
        public string ObjectID { get; set; }
        public string Writer { get; set; }
        public Nullable<System.DateTime> WriteDate { get; set; }
        public Nullable<byte> ServiceStatus { get; set; }
        public Nullable<System.DateTime> ServiceTime { get; set; }
        public string ContractNo { get; set; }
        public string BankName { get; set; }
        public string BankNo { get; set; }
        public string Accounts { get; set; }
        public Nullable<decimal> ServiceFee { get; set; }
        public Nullable<byte> ConsignFlag { get; set; }
        public Nullable<System.DateTime> ConsignDate { get; set; }
        public Nullable<byte> MonthType { get; set; }
        public Nullable<byte> SetType { get; set; }
        public Nullable<decimal> PrePay { get; set; }
        public Nullable<decimal> PresentPay { get; set; }
        public string remark { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public string RegisterPWD { get; set; }
        public Nullable<int> CustomerID { get; set; }
        public Nullable<bool> S_Tel { get; set; }
        public Nullable<bool> S_Alarm { get; set; }
        public Nullable<bool> S_MedicalHelp { get; set; }
        public Nullable<bool> S_CarHelp { get; set; }
        public Nullable<bool> S_Query { get; set; }
        public Nullable<bool> S_Location { get; set; }
        public Nullable<bool> S_SetSafety { get; set; }
        public Nullable<bool> S_StealAlarm { get; set; }
        public Nullable<bool> S_Lock { get; set; }
        public Nullable<bool> S_Listen { get; set; }
        public Nullable<bool> S_OpenDoor { get; set; }
        public Nullable<bool> S_Range { get; set; }
        public Nullable<bool> S_LogQuery { get; set; }
        public Nullable<bool> S_WebQuery { get; set; }
        public Nullable<bool> Conf_SoundBox { get; set; }
        public Nullable<bool> Conf_BP { get; set; }
        public Nullable<bool> Conf_CutOil { get; set; }
        public Nullable<bool> Conf_Price { get; set; }
        public string InstallUnit { get; set; }
        public Nullable<System.DateTime> InstallDate { get; set; }
        public string InstallBillId { get; set; }
        public Nullable<byte> ServiceType { get; set; }
        public Nullable<decimal> ServiceCharge { get; set; }
        public string FeeTo { get; set; }
        public Nullable<decimal> Arrear { get; set; }
        public Nullable<bool> PayCash { get; set; }
    }
}
