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
    
    public partial class PointOfInterest
    {
        public int PointOfInterestId { get; set; }
        public double RadiusInMeters { get; set; }
        public int PointOfInterestTypeId { get; set; }
    
        public virtual PointOfInterestType PointOfInterestType { get; set; }
        public virtual Geofence Geofence { get; set; }
    }
}
