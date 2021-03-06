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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Objects;
    using System.Data.Objects.DataClasses;
    using System.Linq;
    
    public partial class TFDBEntities : DbContext
    {
        public TFDBEntities(string _Entity)
            : base("name=" + _Entity)
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public DbSet<A_ActiveTag> A_ActiveTag { get; set; }
        public DbSet<A_ActiveTracks> A_ActiveTracks { get; set; }
        public DbSet<A_CustomerInfo> A_CustomerInfo { get; set; }
        public DbSet<A_ObjectInfo> A_ObjectInfo { get; set; }
        public DbSet<A_ObjectPhoto> A_ObjectPhoto { get; set; }
        public DbSet<A_Tracks> A_Tracks { get; set; }
        public DbSet<A_Tracks_01> A_Tracks_01 { get; set; }
        public DbSet<A_Tracks_02> A_Tracks_02 { get; set; }
        public DbSet<A_Tracks_03> A_Tracks_03 { get; set; }
        public DbSet<A_Tracks_04> A_Tracks_04 { get; set; }
        public DbSet<A_Tracks_05> A_Tracks_05 { get; set; }
        public DbSet<A_Tracks_06> A_Tracks_06 { get; set; }
        public DbSet<A_Tracks_07> A_Tracks_07 { get; set; }
        public DbSet<A_Tracks_08> A_Tracks_08 { get; set; }
        public DbSet<A_Tracks_09> A_Tracks_09 { get; set; }
        public DbSet<A_Tracks_10> A_Tracks_10 { get; set; }
        public DbSet<A_Tracks_11> A_Tracks_11 { get; set; }
        public DbSet<A_Tracks_12> A_Tracks_12 { get; set; }
        public DbSet<A_TrackTag> A_TrackTag { get; set; }
        public DbSet<D_ObjectType> D_ObjectType { get; set; }
        public DbSet<PGPS_CustomerReports> PGPS_CustomerReports { get; set; }
        public DbSet<PGPS_Driver> PGPS_Driver { get; set; }
        public DbSet<PGPS_Module> PGPS_Module { get; set; }
        public DbSet<PGPS_ObjectDelivery> PGPS_ObjectDelivery { get; set; }
        public DbSet<PGPS_ObjectDriver> PGPS_ObjectDriver { get; set; }
        public DbSet<PGPS_ReportTypes> PGPS_ReportTypes { get; set; }
        public DbSet<PGPS_SensorSetting> PGPS_SensorSetting { get; set; }
        public DbSet<PGPS_SensorType> PGPS_SensorType { get; set; }
        public DbSet<PGPS_SystemUser> PGPS_SystemUser { get; set; }
        public DbSet<PGPS_SystemUserObject> PGPS_SystemUserObject { get; set; }
        public DbSet<PGPS_Tag> PGPS_Tag { get; set; }
        public DbSet<PGPS_UserSettings> PGPS_UserSettings { get; set; }
        public DbSet<S_SysRole> S_SysRole { get; set; }
        public DbSet<S_SysUser> S_SysUser { get; set; }
        public DbSet<S_SysUserVehicle> S_SysUserVehicle { get; set; }
        public DbSet<S_UserRole> S_UserRole { get; set; }
        public DbSet<PGPS_EmailReports> PGPS_EmailReports { get; set; }
    
        public virtual ObjectResult<sp_PGPS_get_asset_information_Result> sp_PGPS_get_asset_information(string assetID)
        {
            var assetIDParameter = assetID != null ?
                new ObjectParameter("AssetID", assetID) :
                new ObjectParameter("AssetID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_asset_information_Result>("sp_PGPS_get_asset_information", assetIDParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_asset_information1_Result> sp_PGPS_get_asset_information1(string assetID)
        {
            var assetIDParameter = assetID != null ?
                new ObjectParameter("AssetID", assetID) :
                new ObjectParameter("AssetID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_asset_information1_Result>("sp_PGPS_get_asset_information1", assetIDParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_asset_information2_Result> sp_PGPS_get_asset_information2(string assetID)
        {
            var assetIDParameter = assetID != null ?
                new ObjectParameter("AssetID", assetID) :
                new ObjectParameter("AssetID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_asset_information2_Result>("sp_PGPS_get_asset_information2", assetIDParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_asset_list_Result> sp_PGPS_get_asset_list(Nullable<int> account_id)
        {
            var account_idParameter = account_id.HasValue ?
                new ObjectParameter("account_id", account_id) :
                new ObjectParameter("account_id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_asset_list_Result>("sp_PGPS_get_asset_list", account_idParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_asset_map_Result> sp_PGPS_get_asset_map(Nullable<int> userid)
        {
            var useridParameter = userid.HasValue ?
                new ObjectParameter("userid", userid) :
                new ObjectParameter("userid", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_asset_map_Result>("sp_PGPS_get_asset_map", useridParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_asset_notif_Result> sp_PGPS_get_asset_notif(Nullable<int> userID)
        {
            var userIDParameter = userID.HasValue ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_asset_notif_Result>("sp_PGPS_get_asset_notif", userIDParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_asset_popup_information_Result> sp_PGPS_get_asset_popup_information(string assetID)
        {
            var assetIDParameter = assetID != null ?
                new ObjectParameter("AssetID", assetID) :
                new ObjectParameter("AssetID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_asset_popup_information_Result>("sp_PGPS_get_asset_popup_information", assetIDParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_asset_popup_information1_Result> sp_PGPS_get_asset_popup_information1(string assetID)
        {
            var assetIDParameter = assetID != null ?
                new ObjectParameter("AssetID", assetID) :
                new ObjectParameter("AssetID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_asset_popup_information1_Result>("sp_PGPS_get_asset_popup_information1", assetIDParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_asset_settings_Result> sp_PGPS_get_asset_settings(string assetID)
        {
            var assetIDParameter = assetID != null ?
                new ObjectParameter("AssetID", assetID) :
                new ObjectParameter("AssetID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_asset_settings_Result>("sp_PGPS_get_asset_settings", assetIDParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_asset_type_list_Result> sp_PGPS_get_asset_type_list(Nullable<int> account_id, string type)
        {
            var account_idParameter = account_id.HasValue ?
                new ObjectParameter("account_id", account_id) :
                new ObjectParameter("account_id", typeof(int));
    
            var typeParameter = type != null ?
                new ObjectParameter("type", type) :
                new ObjectParameter("type", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_asset_type_list_Result>("sp_PGPS_get_asset_type_list", account_idParameter, typeParameter);
        }
    
        public virtual ObjectResult<sp_pgps_get_assets_inside_zone_Result> sp_pgps_get_assets_inside_zone(string objectlist)
        {
            var objectlistParameter = objectlist != null ?
                new ObjectParameter("objectlist", objectlist) :
                new ObjectParameter("objectlist", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_pgps_get_assets_inside_zone_Result>("sp_pgps_get_assets_inside_zone", objectlistParameter);
        }
    
        public virtual ObjectResult<Nullable<int>> sp_pgps_get_assets_inside_zone_count(string account_id)
        {
            var account_idParameter = account_id != null ?
                new ObjectParameter("account_id", account_id) :
                new ObjectParameter("account_id", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Nullable<int>>("sp_pgps_get_assets_inside_zone_count", account_idParameter);
        }
    
        public virtual int sp_pgps_get_assets_inside_zone_shawn(Nullable<double> radius, string objectlist)
        {
            var radiusParameter = radius.HasValue ?
                new ObjectParameter("radius", radius) :
                new ObjectParameter("radius", typeof(double));
    
            var objectlistParameter = objectlist != null ?
                new ObjectParameter("objectlist", objectlist) :
                new ObjectParameter("objectlist", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_pgps_get_assets_inside_zone_shawn", radiusParameter, objectlistParameter);
        }
    
        public virtual int sp_PGPS_get_customer_combo_list(string user_id)
        {
            var user_idParameter = user_id != null ?
                new ObjectParameter("user_id", user_id) :
                new ObjectParameter("user_id", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_PGPS_get_customer_combo_list", user_idParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_roles_list_Result> sp_PGPS_get_roles_list(Nullable<int> rolevalue)
        {
            var rolevalueParameter = rolevalue.HasValue ?
                new ObjectParameter("rolevalue", rolevalue) :
                new ObjectParameter("rolevalue", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_roles_list_Result>("sp_PGPS_get_roles_list", rolevalueParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_summary_info_Result> sp_PGPS_get_summary_info()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_summary_info_Result>("sp_PGPS_get_summary_info");
        }
    
        public virtual ObjectResult<sp_PGPS_get_summary_info_account_Result> sp_PGPS_get_summary_info_account(Nullable<int> account_id)
        {
            var account_idParameter = account_id.HasValue ?
                new ObjectParameter("account_id", account_id) :
                new ObjectParameter("account_id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_summary_info_account_Result>("sp_PGPS_get_summary_info_account", account_idParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_summary_info_assetid_Result> sp_PGPS_get_summary_info_assetid(string assetids)
        {
            var assetidsParameter = assetids != null ?
                new ObjectParameter("assetids", assetids) :
                new ObjectParameter("assetids", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_summary_info_assetid_Result>("sp_PGPS_get_summary_info_assetid", assetidsParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_summary_info_group_Result> sp_PGPS_get_summary_info_group(string groupcodes)
        {
            var groupcodesParameter = groupcodes != null ?
                new ObjectParameter("groupcodes", groupcodes) :
                new ObjectParameter("groupcodes", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_summary_info_group_Result>("sp_PGPS_get_summary_info_group", groupcodesParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_summary_info_sysuser_Result> sp_PGPS_get_summary_info_sysuser(Nullable<int> account_id)
        {
            var account_idParameter = account_id.HasValue ?
                new ObjectParameter("account_id", account_id) :
                new ObjectParameter("account_id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_summary_info_sysuser_Result>("sp_PGPS_get_summary_info_sysuser", account_idParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_user_zones_Result> sp_PGPS_get_user_zones(string userID)
        {
            var userIDParameter = userID != null ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_user_zones_Result>("sp_PGPS_get_user_zones", userIDParameter);
        }
    
        public virtual ObjectResult<sp_pgps_GetCounterByUserID_Result> sp_pgps_GetCounterByUserID(string userID)
        {
            var userIDParameter = userID != null ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_pgps_GetCounterByUserID_Result>("sp_pgps_GetCounterByUserID", userIDParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_GetTrackHistory_Staging_Result> sp_PGPS_GetTrackHistory_Staging(string objectid, string tableName, string start, string end)
        {
            var objectidParameter = objectid != null ?
                new ObjectParameter("objectid", objectid) :
                new ObjectParameter("objectid", typeof(string));
    
            var tableNameParameter = tableName != null ?
                new ObjectParameter("tableName", tableName) :
                new ObjectParameter("tableName", typeof(string));
    
            var startParameter = start != null ?
                new ObjectParameter("start", start) :
                new ObjectParameter("start", typeof(string));
    
            var endParameter = end != null ?
                new ObjectParameter("end", end) :
                new ObjectParameter("end", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_GetTrackHistory_Staging_Result>("sp_PGPS_GetTrackHistory_Staging", objectidParameter, tableNameParameter, startParameter, endParameter);
        }
    
        public virtual ObjectResult<sp_pgps_GetVehicleDistance_Result> sp_pgps_GetVehicleDistance(string userID, Nullable<System.DateTime> startTime, Nullable<System.DateTime> endTime)
        {
            var userIDParameter = userID != null ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(string));
    
            var startTimeParameter = startTime.HasValue ?
                new ObjectParameter("StartTime", startTime) :
                new ObjectParameter("StartTime", typeof(System.DateTime));
    
            var endTimeParameter = endTime.HasValue ?
                new ObjectParameter("EndTime", endTime) :
                new ObjectParameter("EndTime", typeof(System.DateTime));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_pgps_GetVehicleDistance_Result>("sp_pgps_GetVehicleDistance", userIDParameter, startTimeParameter, endTimeParameter);
        }
    
        public virtual ObjectResult<sp_pgps_GetVehicleUtili_Result> sp_pgps_GetVehicleUtili(string userID, Nullable<System.DateTime> startTime, Nullable<System.DateTime> endTime)
        {
            var userIDParameter = userID != null ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(string));
    
            var startTimeParameter = startTime.HasValue ?
                new ObjectParameter("StartTime", startTime) :
                new ObjectParameter("StartTime", typeof(System.DateTime));
    
            var endTimeParameter = endTime.HasValue ?
                new ObjectParameter("EndTime", endTime) :
                new ObjectParameter("EndTime", typeof(System.DateTime));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_pgps_GetVehicleUtili_Result>("sp_pgps_GetVehicleUtili", userIDParameter, startTimeParameter, endTimeParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_track_asset_by_assetid_Result> sp_PGPS_track_asset_by_assetid(string assetID, string username)
        {
            var assetIDParameter = assetID != null ?
                new ObjectParameter("AssetID", assetID) :
                new ObjectParameter("AssetID", typeof(string));
    
            var usernameParameter = username != null ?
                new ObjectParameter("Username", username) :
                new ObjectParameter("Username", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_track_asset_by_assetid_Result>("sp_PGPS_track_asset_by_assetid", assetIDParameter, usernameParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_track_asset_by_assetname_Result> sp_PGPS_track_asset_by_assetname(string assetName, string username)
        {
            var assetNameParameter = assetName != null ?
                new ObjectParameter("AssetName", assetName) :
                new ObjectParameter("AssetName", typeof(string));
    
            var usernameParameter = username != null ?
                new ObjectParameter("Username", username) :
                new ObjectParameter("Username", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_track_asset_by_assetname_Result>("sp_PGPS_track_asset_by_assetname", assetNameParameter, usernameParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_TRP_GetCurrentActiveDriver_Result> sp_PGPS_TRP_GetCurrentActiveDriver(string assetid)
        {
            var assetidParameter = assetid != null ?
                new ObjectParameter("assetid", assetid) :
                new ObjectParameter("assetid", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_TRP_GetCurrentActiveDriver_Result>("sp_PGPS_TRP_GetCurrentActiveDriver", assetidParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_TRP_getHistoryDriverList_Result> sp_PGPS_TRP_getHistoryDriverList(string assetid)
        {
            var assetidParameter = assetid != null ?
                new ObjectParameter("assetid", assetid) :
                new ObjectParameter("assetid", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_TRP_getHistoryDriverList_Result>("sp_PGPS_TRP_getHistoryDriverList", assetidParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_TRP_getUserChildAssignmentList_Result> sp_PGPS_TRP_getUserChildAssignmentList(string account_id, string childAccount_id)
        {
            var account_idParameter = account_id != null ?
                new ObjectParameter("account_id", account_id) :
                new ObjectParameter("account_id", typeof(string));
    
            var childAccount_idParameter = childAccount_id != null ?
                new ObjectParameter("childAccount_id", childAccount_id) :
                new ObjectParameter("childAccount_id", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_TRP_getUserChildAssignmentList_Result>("sp_PGPS_TRP_getUserChildAssignmentList", account_idParameter, childAccount_idParameter);
        }
    
        public virtual int sp_PGPS_TRP_UpdatePassword(string accountID, string oldPassword, string newPassword, string newEncryptedPassword)
        {
            var accountIDParameter = accountID != null ?
                new ObjectParameter("accountID", accountID) :
                new ObjectParameter("accountID", typeof(string));
    
            var oldPasswordParameter = oldPassword != null ?
                new ObjectParameter("oldPassword", oldPassword) :
                new ObjectParameter("oldPassword", typeof(string));
    
            var newPasswordParameter = newPassword != null ?
                new ObjectParameter("newPassword", newPassword) :
                new ObjectParameter("newPassword", typeof(string));
    
            var newEncryptedPasswordParameter = newEncryptedPassword != null ?
                new ObjectParameter("newEncryptedPassword", newEncryptedPassword) :
                new ObjectParameter("newEncryptedPassword", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_PGPS_TRP_UpdatePassword", accountIDParameter, oldPasswordParameter, newPasswordParameter, newEncryptedPasswordParameter);
        }
    
        public virtual int sp_PGPS_TRP_UpdateUserEmail(string accountID, string email)
        {
            var accountIDParameter = accountID != null ?
                new ObjectParameter("accountID", accountID) :
                new ObjectParameter("accountID", typeof(string));
    
            var emailParameter = email != null ?
                new ObjectParameter("email", email) :
                new ObjectParameter("email", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_PGPS_TRP_UpdateUserEmail", accountIDParameter, emailParameter);
        }
    
        public virtual int spGetVehicleDistance(string userID, Nullable<System.DateTime> startTime, Nullable<System.DateTime> endTime)
        {
            var userIDParameter = userID != null ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(string));
    
            var startTimeParameter = startTime.HasValue ?
                new ObjectParameter("StartTime", startTime) :
                new ObjectParameter("StartTime", typeof(System.DateTime));
    
            var endTimeParameter = endTime.HasValue ?
                new ObjectParameter("EndTime", endTime) :
                new ObjectParameter("EndTime", typeof(System.DateTime));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("spGetVehicleDistance", userIDParameter, startTimeParameter, endTimeParameter);
        }
    
        public virtual int spUpdateDriverTag(string objectID, Nullable<System.DateTime> boardTime, Nullable<double> lon, Nullable<double> lat, Nullable<double> speed, Nullable<short> direct, Nullable<System.DateTime> gPSTime, Nullable<int> gPSFlag, string mDTStatus, Nullable<int> mileage, Nullable<double> fuel, string tagID, Nullable<short> tagType)
        {
            var objectIDParameter = objectID != null ?
                new ObjectParameter("ObjectID", objectID) :
                new ObjectParameter("ObjectID", typeof(string));
    
            var boardTimeParameter = boardTime.HasValue ?
                new ObjectParameter("BoardTime", boardTime) :
                new ObjectParameter("BoardTime", typeof(System.DateTime));
    
            var lonParameter = lon.HasValue ?
                new ObjectParameter("Lon", lon) :
                new ObjectParameter("Lon", typeof(double));
    
            var latParameter = lat.HasValue ?
                new ObjectParameter("Lat", lat) :
                new ObjectParameter("Lat", typeof(double));
    
            var speedParameter = speed.HasValue ?
                new ObjectParameter("Speed", speed) :
                new ObjectParameter("Speed", typeof(double));
    
            var directParameter = direct.HasValue ?
                new ObjectParameter("Direct", direct) :
                new ObjectParameter("Direct", typeof(short));
    
            var gPSTimeParameter = gPSTime.HasValue ?
                new ObjectParameter("GPSTime", gPSTime) :
                new ObjectParameter("GPSTime", typeof(System.DateTime));
    
            var gPSFlagParameter = gPSFlag.HasValue ?
                new ObjectParameter("GPSFlag", gPSFlag) :
                new ObjectParameter("GPSFlag", typeof(int));
    
            var mDTStatusParameter = mDTStatus != null ?
                new ObjectParameter("MDTStatus", mDTStatus) :
                new ObjectParameter("MDTStatus", typeof(string));
    
            var mileageParameter = mileage.HasValue ?
                new ObjectParameter("Mileage", mileage) :
                new ObjectParameter("Mileage", typeof(int));
    
            var fuelParameter = fuel.HasValue ?
                new ObjectParameter("Fuel", fuel) :
                new ObjectParameter("Fuel", typeof(double));
    
            var tagIDParameter = tagID != null ?
                new ObjectParameter("TagID", tagID) :
                new ObjectParameter("TagID", typeof(string));
    
            var tagTypeParameter = tagType.HasValue ?
                new ObjectParameter("TagType", tagType) :
                new ObjectParameter("TagType", typeof(short));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("spUpdateDriverTag", objectIDParameter, boardTimeParameter, lonParameter, latParameter, speedParameter, directParameter, gPSTimeParameter, gPSFlagParameter, mDTStatusParameter, mileageParameter, fuelParameter, tagIDParameter, tagTypeParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_asset_count_list_Result> sp_PGPS_get_asset_count_list(Nullable<int> account_id)
        {
            var account_idParameter = account_id.HasValue ?
                new ObjectParameter("account_id", account_id) :
                new ObjectParameter("account_id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_asset_count_list_Result>("sp_PGPS_get_asset_count_list", account_idParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_asset_filter_list_Result> sp_PGPS_get_asset_filter_list(Nullable<int> account_id, string status)
        {
            var account_idParameter = account_id.HasValue ?
                new ObjectParameter("account_id", account_id) :
                new ObjectParameter("account_id", typeof(int));
    
            var statusParameter = status != null ?
                new ObjectParameter("status", status) :
                new ObjectParameter("status", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_asset_filter_list_Result>("sp_PGPS_get_asset_filter_list", account_idParameter, statusParameter);
        }
    
        public virtual int sp_PGPS_get_asset_info(string assetID)
        {
            var assetIDParameter = assetID != null ?
                new ObjectParameter("AssetID", assetID) :
                new ObjectParameter("AssetID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_PGPS_get_asset_info", assetIDParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_history_summary_2_Result> sp_PGPS_history_summary_2(string objectid, string tableName, Nullable<System.DateTime> start, Nullable<System.DateTime> end)
        {
            var objectidParameter = objectid != null ?
                new ObjectParameter("objectid", objectid) :
                new ObjectParameter("objectid", typeof(string));
    
            var tableNameParameter = tableName != null ?
                new ObjectParameter("tableName", tableName) :
                new ObjectParameter("tableName", typeof(string));
    
            var startParameter = start.HasValue ?
                new ObjectParameter("start", start) :
                new ObjectParameter("start", typeof(System.DateTime));
    
            var endParameter = end.HasValue ?
                new ObjectParameter("end", end) :
                new ObjectParameter("end", typeof(System.DateTime));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_history_summary_2_Result>("sp_PGPS_history_summary_2", objectidParameter, tableNameParameter, startParameter, endParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_history_summary_Result> sp_PGPS_history_summary(string objectid, string tableName, string start, string end)
        {
            var objectidParameter = objectid != null ?
                new ObjectParameter("objectid", objectid) :
                new ObjectParameter("objectid", typeof(string));
    
            var tableNameParameter = tableName != null ?
                new ObjectParameter("tableName", tableName) :
                new ObjectParameter("tableName", typeof(string));
    
            var startParameter = start != null ?
                new ObjectParameter("start", start) :
                new ObjectParameter("start", typeof(string));
    
            var endParameter = end != null ?
                new ObjectParameter("end", end) :
                new ObjectParameter("end", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_history_summary_Result>("sp_PGPS_history_summary", objectidParameter, tableNameParameter, startParameter, endParameter);
        }
    }
}
