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
    
    public partial class PGPS_Driver
    {
        public PGPS_Driver()
        {
            this.PGPS_ObjectDriver = new HashSet<PGPS_ObjectDriver>();
            this.PGPS_Tag = new HashSet<PGPS_Tag>();
        }
    
        public int DriverID { get; set; }
        public string Name { get; set; }
        public string LicenseNo { get; set; }
        public string LicenseType { get; set; }
        public Nullable<System.DateTime> LicenseExpiryDate { get; set; }
        public Nullable<System.DateTime> Birthdate { get; set; }
        public string MobilePhoneNo { get; set; }
        public string Address { get; set; }
        public string Nickname { get; set; }
        public string StaffNo { get; set; }
        public string StaffType { get; set; }
        public Nullable<System.DateTime> Hiredate { get; set; }
        public string HomePhoneNo { get; set; }
        public string OfficePhoneNo { get; set; }
        public string Gender { get; set; }
        public string Remarks { get; set; }
        public string EmergencyContactName { get; set; }
        public string EmergencyContactPhoneNo { get; set; }
        public string Status { get; set; }
        public Nullable<int> CustomerID { get; set; }
        public string PhotoURL { get; set; }
        public string Schedule { get; set; }
    
        public virtual ICollection<PGPS_ObjectDriver> PGPS_ObjectDriver { get; set; }
        public virtual ICollection<PGPS_Tag> PGPS_Tag { get; set; }
    }
}
