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
    
    public partial class PGPS_MaintenanceActivity
    {
        public int maintenance_activity_id { get; set; }
        public string asset_id { get; set; }
        public Nullable<int> type_id { get; set; }
        public Nullable<int> odo_current { get; set; }
        public Nullable<int> odo_next { get; set; }
        public Nullable<int> gpsodo_next { get; set; }
        public Nullable<System.DateTime> due_date { get; set; }
        public Nullable<System.DateTime> date_completed { get; set; }
        public string vendor { get; set; }
        public Nullable<int> cost { get; set; }
        public string other_details { get; set; }
        public Nullable<bool> is_reminder { get; set; }
        public Nullable<int> gpsodo_current { get; set; }
        public Nullable<int> user_id { get; set; }
        public Nullable<int> category_id { get; set; }
        public Nullable<int> reminder_time { get; set; }
        public Nullable<int> reminder_odo { get; set; }
        public Nullable<bool> is_deleted { get; set; }
    
        public virtual PGPS_SystemUser PGPS_SystemUser { get; set; }
    }
}
