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
    
    public partial class I_InfoTxTmp
    {
        public int TxID { get; set; }
        public string TxContent { get; set; }
        public string RcvSimNO { get; set; }
        public Nullable<System.DateTime> SendTime { get; set; }
        public Nullable<byte> SendSource { get; set; }
        public Nullable<byte> CommChannel { get; set; }
        public Nullable<int> SendFlag { get; set; }
    }
}
