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
    
    public partial class sp_Account_Result
    {
        public string ObjectID { get; set; }
        public Nullable<int> AYear { get; set; }
        public Nullable<int> AMonth { get; set; }
        public string SimNo { get; set; }
        public string ContractNo { get; set; }
        public string BankName { get; set; }
        public string BankNo { get; set; }
        public string Accounts { get; set; }
        public Nullable<decimal> ServiceFee { get; set; }
        public Nullable<byte> ConsignFlag { get; set; }
        public Nullable<System.DateTime> ConsignDate { get; set; }
        public Nullable<byte> MonthType { get; set; }
        public Nullable<decimal> PrePay { get; set; }
        public Nullable<decimal> PresentPay { get; set; }
        public Nullable<decimal> MonthFee { get; set; }
        public Nullable<decimal> ChooseFee { get; set; }
        public Nullable<decimal> RxTxFee { get; set; }
        public Nullable<decimal> TotalPlan { get; set; }
        public Nullable<decimal> TotalReal { get; set; }
    }
}
