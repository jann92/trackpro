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
    
    public partial class CannonballGF
    {
        public int CannonballGfID { get; set; }
        public Nullable<int> GeofenceId { get; set; }
        public Nullable<int> GeofenceOrder { get; set; }
        public Nullable<bool> isActive { get; set; }
    
        public virtual Geofence Geofence { get; set; }
    }
}
