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
    
    public partial class A_MapGrid
    {
        public int ID { get; set; }
        public decimal MinLon { get; set; }
        public decimal MinLat { get; set; }
        public decimal MaxLon { get; set; }
        public decimal MaxLat { get; set; }
        public Nullable<int> ParentID { get; set; }
        public Nullable<int> Type { get; set; }
    }
}
