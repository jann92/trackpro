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
    
    public partial class A_MTCommand
    {
        public decimal IndexID { get; set; }
        public Nullable<int> CmdPlanID { get; set; }
        public Nullable<int> RuleID { get; set; }
        public string ObjectID { get; set; }
        public string CmdDesc { get; set; }
        public string CmdContent { get; set; }
        public Nullable<System.DateTime> CreateTime { get; set; }
        public Nullable<int> CreateUserID { get; set; }
        public Nullable<int> CreateSource { get; set; }
        public Nullable<int> SendFlag { get; set; }
        public Nullable<int> SendType { get; set; }
        public Nullable<int> SendResult { get; set; }
        public Nullable<int> ReSendCountLimit { get; set; }
        public Nullable<System.DateTime> UpdateTime { get; set; }
        public Nullable<int> NeedReport { get; set; }
        public Nullable<int> FailCount { get; set; }
        public string FailReason { get; set; }
    }
}
