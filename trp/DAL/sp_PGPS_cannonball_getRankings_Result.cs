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
    
    public partial class sp_PGPS_cannonball_getRankings_Result
    {
        public Nullable<long> Rank { get; set; }
        public string AssetID { get; set; }
        public string Asset { get; set; }
        public Nullable<int> CustomerID { get; set; }
        public string Customer { get; set; }
        public Nullable<int> TotalDuration { get; set; }
        public Nullable<int> TotalCheckpoints { get; set; }
        public Nullable<int> CurrentCheckpoint { get; set; }
        public string CurrentZone { get; set; }
    }
}
