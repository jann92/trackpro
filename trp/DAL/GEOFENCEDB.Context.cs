﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class GEOFENCEDBEntities : DbContext
    {
        public GEOFENCEDBEntities(string entity)
            : base("name="+ entity)
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<CannonballGF> CannonballGF { get; set; }
        public virtual DbSet<Geocoordinate> Geocoordinate { get; set; }
        public virtual DbSet<Geofence> Geofence { get; set; }
        public virtual DbSet<GeofenceInfo> GeofenceInfo { get; set; }
        public virtual DbSet<ObjectGeofence> ObjectGeofence { get; set; }
        public virtual DbSet<PointOfInterest> PointOfInterest { get; set; }
        public virtual DbSet<PointOfInterestType> PointOfInterestType { get; set; }
        public virtual DbSet<Route> Route { get; set; }
        public virtual DbSet<Zone> Zone { get; set; }
        public virtual DbSet<ZoneType> ZoneType { get; set; }
    
        [DbFunction("GEOFENCEDBEntities", "fn_pgps_isOnRoute")]
        public virtual IQueryable<fn_pgps_isOnRoute_Result> fn_pgps_isOnRoute(Nullable<double> longitude, Nullable<double> latitude, string objectid, Nullable<System.DateTime> gpstime)
        {
            var longitudeParameter = longitude.HasValue ?
                new ObjectParameter("longitude", longitude) :
                new ObjectParameter("longitude", typeof(double));
    
            var latitudeParameter = latitude.HasValue ?
                new ObjectParameter("latitude", latitude) :
                new ObjectParameter("latitude", typeof(double));
    
            var objectidParameter = objectid != null ?
                new ObjectParameter("objectid", objectid) :
                new ObjectParameter("objectid", typeof(string));
    
            var gpstimeParameter = gpstime.HasValue ?
                new ObjectParameter("gpstime", gpstime) :
                new ObjectParameter("gpstime", typeof(System.DateTime));
    
            return ((IObjectContextAdapter)this).ObjectContext.CreateQuery<fn_pgps_isOnRoute_Result>("[GEOFENCEDBEntities].[fn_pgps_isOnRoute](@longitude, @latitude, @objectid, @gpstime)", longitudeParameter, latitudeParameter, objectidParameter, gpstimeParameter);
        }
    
        [DbFunction("GEOFENCEDBEntities", "fn_pgps_isOnRoute_2")]
        public virtual IQueryable<fn_pgps_isOnRoute_2_Result> fn_pgps_isOnRoute_2(Nullable<double> longitude, Nullable<double> latitude, string objectid, Nullable<System.DateTime> gpstime, Nullable<int> routeid)
        {
            var longitudeParameter = longitude.HasValue ?
                new ObjectParameter("longitude", longitude) :
                new ObjectParameter("longitude", typeof(double));
    
            var latitudeParameter = latitude.HasValue ?
                new ObjectParameter("latitude", latitude) :
                new ObjectParameter("latitude", typeof(double));
    
            var objectidParameter = objectid != null ?
                new ObjectParameter("objectid", objectid) :
                new ObjectParameter("objectid", typeof(string));
    
            var gpstimeParameter = gpstime.HasValue ?
                new ObjectParameter("gpstime", gpstime) :
                new ObjectParameter("gpstime", typeof(System.DateTime));
    
            var routeidParameter = routeid.HasValue ?
                new ObjectParameter("routeid", routeid) :
                new ObjectParameter("routeid", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.CreateQuery<fn_pgps_isOnRoute_2_Result>("[GEOFENCEDBEntities].[fn_pgps_isOnRoute_2](@longitude, @latitude, @objectid, @gpstime, @routeid)", longitudeParameter, latitudeParameter, objectidParameter, gpstimeParameter, routeidParameter);
        }
    
        [DbFunction("GEOFENCEDBEntities", "fn_Split")]
        public virtual IQueryable<fn_Split_Result> fn_Split(string stringToSplit)
        {
            var stringToSplitParameter = stringToSplit != null ?
                new ObjectParameter("stringToSplit", stringToSplit) :
                new ObjectParameter("stringToSplit", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.CreateQuery<fn_Split_Result>("[GEOFENCEDBEntities].[fn_Split](@stringToSplit)", stringToSplitParameter);
        }
    
        public virtual ObjectResult<Nullable<double>> sp_getDistanceToNextZone(Nullable<int> zoneid, Nullable<double> longitude, Nullable<double> latitude)
        {
            var zoneidParameter = zoneid.HasValue ?
                new ObjectParameter("zoneid", zoneid) :
                new ObjectParameter("zoneid", typeof(int));
    
            var longitudeParameter = longitude.HasValue ?
                new ObjectParameter("longitude", longitude) :
                new ObjectParameter("longitude", typeof(double));
    
            var latitudeParameter = latitude.HasValue ?
                new ObjectParameter("latitude", latitude) :
                new ObjectParameter("latitude", typeof(double));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Nullable<double>>("sp_getDistanceToNextZone", zoneidParameter, longitudeParameter, latitudeParameter);
        }
    
        public virtual int sp_IosGetZone(string sUserName, string userId)
        {
            var sUserNameParameter = sUserName != null ?
                new ObjectParameter("sUserName", sUserName) :
                new ObjectParameter("sUserName", typeof(string));
    
            var userIdParameter = userId != null ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_IosGetZone", sUserNameParameter, userIdParameter);
        }
    
        public virtual ObjectResult<Nullable<int>> sp_pgps_count_assets_inside_zone(Nullable<int> userid)
        {
            var useridParameter = userid.HasValue ?
                new ObjectParameter("userid", userid) :
                new ObjectParameter("userid", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Nullable<int>>("sp_pgps_count_assets_inside_zone", useridParameter);
        }
    
        public virtual ObjectResult<sp_pgps_get_assetlist_inside_by_zone_Result> sp_pgps_get_assetlist_inside_by_zone(Nullable<int> userid, Nullable<int> geofenceid, Nullable<bool> allowed)
        {
            var useridParameter = userid.HasValue ?
                new ObjectParameter("userid", userid) :
                new ObjectParameter("userid", typeof(int));
    
            var geofenceidParameter = geofenceid.HasValue ?
                new ObjectParameter("geofenceid", geofenceid) :
                new ObjectParameter("geofenceid", typeof(int));
    
            var allowedParameter = allowed.HasValue ?
                new ObjectParameter("allowed", allowed) :
                new ObjectParameter("allowed", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_pgps_get_assetlist_inside_by_zone_Result>("sp_pgps_get_assetlist_inside_by_zone", useridParameter, geofenceidParameter, allowedParameter);
        }
    
        public virtual ObjectResult<sp_pgps_get_assets_inside_list_based_zone_type_Result> sp_pgps_get_assets_inside_list_based_zone_type(Nullable<int> account_id, Nullable<bool> allowed)
        {
            var account_idParameter = account_id.HasValue ?
                new ObjectParameter("account_id", account_id) :
                new ObjectParameter("account_id", typeof(int));
    
            var allowedParameter = allowed.HasValue ?
                new ObjectParameter("allowed", allowed) :
                new ObjectParameter("allowed", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_pgps_get_assets_inside_list_based_zone_type_Result>("sp_pgps_get_assets_inside_list_based_zone_type", account_idParameter, allowedParameter);
        }
    
        public virtual int sp_pgps_get_assets_inside_list_based_zone_type_ios(Nullable<int> account_id, Nullable<int> geoId, Nullable<bool> allowed)
        {
            var account_idParameter = account_id.HasValue ?
                new ObjectParameter("account_id", account_id) :
                new ObjectParameter("account_id", typeof(int));
    
            var geoIdParameter = geoId.HasValue ?
                new ObjectParameter("geoId", geoId) :
                new ObjectParameter("geoId", typeof(int));
    
            var allowedParameter = allowed.HasValue ?
                new ObjectParameter("allowed", allowed) :
                new ObjectParameter("allowed", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_pgps_get_assets_inside_list_based_zone_type_ios", account_idParameter, geoIdParameter, allowedParameter);
        }
    
        public virtual int sp_pgps_get_assets_inside_list_based_zone_type_ios_2(Nullable<int> account_id, Nullable<bool> allowed)
        {
            var account_idParameter = account_id.HasValue ?
                new ObjectParameter("account_id", account_id) :
                new ObjectParameter("account_id", typeof(int));
    
            var allowedParameter = allowed.HasValue ?
                new ObjectParameter("allowed", allowed) :
                new ObjectParameter("allowed", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_pgps_get_assets_inside_list_based_zone_type_ios_2", account_idParameter, allowedParameter);
        }
    
        public virtual ObjectResult<sp_pgps_get_assets_inside_zone_type_Result> sp_pgps_get_assets_inside_zone_type(Nullable<int> userid, Nullable<bool> allowed)
        {
            var useridParameter = userid.HasValue ?
                new ObjectParameter("userid", userid) :
                new ObjectParameter("userid", typeof(int));
    
            var allowedParameter = allowed.HasValue ?
                new ObjectParameter("allowed", allowed) :
                new ObjectParameter("allowed", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_pgps_get_assets_inside_zone_type_Result>("sp_pgps_get_assets_inside_zone_type", useridParameter, allowedParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_object_zone_list_Result> sp_PGPS_get_object_zone_list(Nullable<int> userID, string objectID, string take, Nullable<int> page)
        {
            var userIDParameter = userID.HasValue ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(int));
    
            var objectIDParameter = objectID != null ?
                new ObjectParameter("ObjectID", objectID) :
                new ObjectParameter("ObjectID", typeof(string));
    
            var takeParameter = take != null ?
                new ObjectParameter("Take", take) :
                new ObjectParameter("Take", typeof(string));
    
            var pageParameter = page.HasValue ?
                new ObjectParameter("Page", page) :
                new ObjectParameter("Page", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_object_zone_list_Result>("sp_PGPS_get_object_zone_list", userIDParameter, objectIDParameter, takeParameter, pageParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_object_zone_list_filtered_Result> sp_PGPS_get_object_zone_list_filtered(Nullable<int> userID, string objectID, string take, Nullable<int> page, string filter)
        {
            var userIDParameter = userID.HasValue ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(int));
    
            var objectIDParameter = objectID != null ?
                new ObjectParameter("ObjectID", objectID) :
                new ObjectParameter("ObjectID", typeof(string));
    
            var takeParameter = take != null ?
                new ObjectParameter("Take", take) :
                new ObjectParameter("Take", typeof(string));
    
            var pageParameter = page.HasValue ?
                new ObjectParameter("Page", page) :
                new ObjectParameter("Page", typeof(int));
    
            var filterParameter = filter != null ?
                new ObjectParameter("Filter", filter) :
                new ObjectParameter("Filter", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_object_zone_list_filtered_Result>("sp_PGPS_get_object_zone_list_filtered", userIDParameter, objectIDParameter, takeParameter, pageParameter, filterParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_user_route_list_status_Result> sp_PGPS_get_user_route_list_status(string account_id)
        {
            var account_idParameter = account_id != null ?
                new ObjectParameter("account_id", account_id) :
                new ObjectParameter("account_id", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_user_route_list_status_Result>("sp_PGPS_get_user_route_list_status", account_idParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_user_zone_list_Result> sp_PGPS_get_user_zone_list(Nullable<int> userID, Nullable<int> parentID, string take, Nullable<int> page)
        {
            var userIDParameter = userID.HasValue ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(int));
    
            var parentIDParameter = parentID.HasValue ?
                new ObjectParameter("ParentID", parentID) :
                new ObjectParameter("ParentID", typeof(int));
    
            var takeParameter = take != null ?
                new ObjectParameter("Take", take) :
                new ObjectParameter("Take", typeof(string));
    
            var pageParameter = page.HasValue ?
                new ObjectParameter("Page", page) :
                new ObjectParameter("Page", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_user_zone_list_Result>("sp_PGPS_get_user_zone_list", userIDParameter, parentIDParameter, takeParameter, pageParameter);
        }
    
        public virtual ObjectResult<sp_PGPS_get_user_zone_list_filtered_Result> sp_PGPS_get_user_zone_list_filtered(Nullable<int> userID, Nullable<int> parentID, string take, string filter, Nullable<int> page)
        {
            var userIDParameter = userID.HasValue ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(int));
    
            var parentIDParameter = parentID.HasValue ?
                new ObjectParameter("ParentID", parentID) :
                new ObjectParameter("ParentID", typeof(int));
    
            var takeParameter = take != null ?
                new ObjectParameter("Take", take) :
                new ObjectParameter("Take", typeof(string));
    
            var filterParameter = filter != null ?
                new ObjectParameter("Filter", filter) :
                new ObjectParameter("Filter", typeof(string));
    
            var pageParameter = page.HasValue ?
                new ObjectParameter("Page", page) :
                new ObjectParameter("Page", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_PGPS_get_user_zone_list_filtered_Result>("sp_PGPS_get_user_zone_list_filtered", userIDParameter, parentIDParameter, takeParameter, filterParameter, pageParameter);
        }
    
        public virtual ObjectResult<string> sp_PGPS_get_zones_single_geojson(string geofenceID)
        {
            var geofenceIDParameter = geofenceID != null ?
                new ObjectParameter("GeofenceID", geofenceID) :
                new ObjectParameter("GeofenceID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("sp_PGPS_get_zones_single_geojson", geofenceIDParameter);
        }
    }
}
