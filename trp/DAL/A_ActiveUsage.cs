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
    
    public partial class A_ActiveUsage
    {
        public int RecId { get; set; }
        public string ObjectId { get; set; }
        public string ObjectRegNum { get; set; }
        public Nullable<System.DateTime> GPSTime { get; set; }
        public Nullable<System.DateTime> LastDataTime { get; set; }
        public short EngineOn { get; set; }
        public short Sensor1On { get; set; }
        public short Sensor2On { get; set; }
        public int UsageEngineOn { get; set; }
        public int UsageSensor1On { get; set; }
        public int UsageSensor2On { get; set; }
    }
}
