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
    
    public partial class A_RxTx
    {
        public decimal RxTxID { get; set; }
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public Nullable<System.DateTime> SendTime { get; set; }
        public Nullable<System.DateTime> RcvTime { get; set; }
        public Nullable<int> CommandType { get; set; }
        public string Content { get; set; }
        public Nullable<byte> TransType { get; set; }
        public string UserID { get; set; }
        public Nullable<byte> SendSource { get; set; }
    }
}
