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
    
    public partial class PGPS_Application
    {
        public int application_id { get; set; }
        public string project_name { get; set; }
        public string project_code { get; set; }
        public string last_version { get; set; }
        public Nullable<System.DateTime> last_version_date_time { get; set; }
        public string description { get; set; }
    }
}