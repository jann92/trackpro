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
    
    public partial class WebServerConfiguration
    {
        public int web_server_configuration_id { get; set; }
        public Nullable<int> web_server_id { get; set; }
        public string config_name { get; set; }
        public string database_name { get; set; }
        public string web_config_name { get; set; }
    
        public virtual WebServers WebServers { get; set; }
    }
}
