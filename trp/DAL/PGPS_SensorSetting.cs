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
    
    public partial class PGPS_SensorSetting
    {
        public int sensor_setting_id { get; set; }
        public string objectid { get; set; }
        public Nullable<int> sensor_type_id { get; set; }
        public double max_threshold_value { get; set; }
        public double min_threshold_value { get; set; }
        public string name { get; set; }
    
        public virtual A_ObjectInfo A_ObjectInfo { get; set; }
        public virtual PGPS_SensorType PGPS_SensorType { get; set; }
    }
}
