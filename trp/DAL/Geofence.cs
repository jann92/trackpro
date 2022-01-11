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
    
    public partial class Geofence
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Geofence()
        {
            this.CannonballGF = new HashSet<CannonballGF>();
            this.Geocoordinate = new HashSet<Geocoordinate>();
            this.ObjectGeofence = new HashSet<ObjectGeofence>();
        }
    
        public int GeofenceId { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public System.Data.Entity.Spatial.DbGeography Geom { get; set; }
        public bool ParkZone { get; set; }
        public bool NotAllowedZone { get; set; }
        public bool AllowedZone { get; set; }
        public bool OutOfZone { get; set; }
        public bool SpeedLimitZone { get; set; }
        public double SpeedLimitInMph { get; set; }
        public bool TimeBased { get; set; }
        public System.DateTime TimeBasedStart { get; set; }
        public System.DateTime TimeBasedEnd { get; set; }
        public string Color { get; set; }
        public bool Enabled { get; set; }
        public string Consignee { get; set; }
        public Nullable<int> GeofenceType { get; set; }
        public string Remarks { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CannonballGF> CannonballGF { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Geocoordinate> Geocoordinate { get; set; }
        public virtual GeofenceInfo GeofenceInfo { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ObjectGeofence> ObjectGeofence { get; set; }
        public virtual PointOfInterest PointOfInterest { get; set; }
        public virtual Route Route { get; set; }
        public virtual Zone Zone { get; set; }
    }
}