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
    
    public partial class PointOfInterestType
    {
        public PointOfInterestType()
        {
            this.PointOfInterest = new HashSet<PointOfInterest>();
        }
    
        public int PointOfInterestTypeId { get; set; }
        public string Name { get; set; }
    
        public virtual ICollection<PointOfInterest> PointOfInterest { get; set; }
    }
}
