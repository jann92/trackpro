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
    
    public partial class PGPS_EmailReports
    {
        public int RowID { get; set; }
        public Nullable<int> UserID { get; set; }
        public Nullable<int> ReportTypesID { get; set; }
        public Nullable<int> Frequency { get; set; }
        public string email { get; set; }
    
        public virtual PGPS_ReportTypes PGPS_ReportTypes { get; set; }
        public virtual PGPS_SystemUser PGPS_SystemUser { get; set; }
    }
}
