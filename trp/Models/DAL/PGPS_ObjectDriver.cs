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
    
    public partial class PGPS_ObjectDriver
    {
        public int ObjectDriverId { get; set; }
        public string ObjectId { get; set; }
        public Nullable<int> DriverId { get; set; }
        public Nullable<bool> ActivePair { get; set; }
    
        public virtual A_ObjectInfo A_ObjectInfo { get; set; }
        public virtual PGPS_Driver PGPS_Driver { get; set; }
    }
}
