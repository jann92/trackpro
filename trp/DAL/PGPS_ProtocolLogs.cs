//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Philgps_WebAPI.DAL
{
    using System;
    using System.Collections.Generic;
    
    public partial class PGPS_ProtocolLogs
    {
        public int protocol_log_id { get; set; }
        public Nullable<int> protocol_id { get; set; }
        public string asset_id { get; set; }
        public Nullable<System.DateTime> date_time { get; set; }
        public string alert { get; set; }
    }
}
