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
    
    public partial class sp_PGPS_get_asset_settings_Result
    {
        public string AssetID { get; set; }
        public string SIMNumber { get; set; }
        public string Name { get; set; }
        public Nullable<int> TypeID { get; set; }
        public string TypeName { get; set; }
        public Nullable<decimal> FuelRatio { get; set; }
        public Nullable<byte> FuelTypeID { get; set; }
        public Nullable<System.DateTime> RegistrationExpiry { get; set; }
        public Nullable<System.DateTime> InsuranceExpiry { get; set; }
        public Nullable<System.DateTime> PermitExpiry { get; set; }
        public Nullable<System.DateTime> ServiceExpiry { get; set; }
        public Nullable<int> ServiceOdo { get; set; }
        public string Schedule { get; set; }
        public Nullable<bool> IsBan { get; set; }
    }
}
