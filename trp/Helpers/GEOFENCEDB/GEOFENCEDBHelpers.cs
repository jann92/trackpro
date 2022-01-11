using Philgps_WebAPI.DAL;
using Philgps_WebAPI.Models.Geofence;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.SqlServer.Types;
using Philgps_WebAPI.Models;
using Philgps_WebAPI.Helpers.MAPDB;
using System.Data.Entity.Spatial;
using Newtonsoft.Json;
using Philgps_WebAPI.Helpers;
using System.Data.Entity.Validation;

namespace Philgps_WebAPI.Helpers.GEOFENCEDB
{
    public static class GEOFENCEDBHelpers
    {
        public class Foo
        {
            [JsonConverter(typeof(DbGeographyGeoJsonConverter))]
            public DbGeography Polyline { get; set; }
        }

        #region Zone
        public static List<Models.Geofence.ZoneType> GetZoneTypeList(string _WebConfigurationName)
        {

            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var result = (from zt in gfdb.ZoneType
                              select new Models.Geofence.ZoneType()
                              {
                                  Name = zt.Name,
                                  ZoneTypeID = zt.ZoneTypeId
                              }).ToList();

                if (result.Count() > 0)
                {
                    return result;
                }
                else
                {
                    return null;
                }
            }


        }

        //public static List<Models.Geofence.ZoneGeoJson> GetAllUserZoneGeoJsonList(int _UserID, string _WebConfigurationName)
        //{
        //    using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
        //    {
        //        var filteredZone = gfdb.sp_PGPS_get_zones_geojson(_UserID.ToString()).Where(x=> x != null).ToList();

        //        if (filteredZone.Count() > 0)
        //        {
        //            var result = (from g in filteredZone.ToList()
        //                          select new Models.Geofence.ZoneGeoJson()
        //                          {
        //                              GeofenceId = g.GeofenceId,
        //                              geojson = g.Geometry,
        //                              Name = g.Name,
        //                              ZoneTypeId = g.ZoneTypeId ?? 0,
        //                              Color = g.Color,
        //                              Allowed = g.AllowedZone,
        //                              Enabled = g.Enabled,
        //                              Radius =  g.AreaInMeters.AreaToRadius()
        //                          }).ToList();
        //            return result;
        //        }else
        //        {
        //            return null;
        //        }
              
        //    }
        //}

        public static List<sp_PGPS_get_user_zone_list_Result> GetUserZoneList(int _UserID,int _ParentID, int _Take, int _nextPage, string _keyword, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {

                var result = gfdb.sp_PGPS_get_user_zone_list(_UserID, _ParentID, _Take.ToString(), _nextPage).ToList();

                return result;   
            }
        }


        public static List<sp_PGPS_get_object_zone_list_Result> GetAssetZoneList(int _AccountID, string _AssetID,int _Take,int _NextPage, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {

                var result = gfdb.sp_PGPS_get_object_zone_list(_AccountID, _AssetID, _Take.ToString(), _NextPage).ToList();

                //var result = gfdb.sp_PGPS_get_object_zone_list_filtered(_AccountID, _AssetID, _Take.ToString(), 0, "").ToList();

                return result;
            }
        }


        public static int? DeleteZone(int _ZoneID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {

                var result = (from z in gfdb.Geofence
                              where z.GeofenceId == _ZoneID
                              select z).ToList();

                if (result.Count() > 0)
                {
                    gfdb.Geofence.Remove(result.FirstOrDefault());
                    gfdb.SaveChanges();

                    return result.FirstOrDefault().GeofenceId;
                }
                else
                {
                    return null;
                }

            }
        }


        public static Models.Geofence.Zone AddZone(Models.Geofence.Zone _Zone, int _AccountID, string _WebConfigurationName)
        {
            if (_Zone.GeoCoordinateList.Count() == 0)
            {
                return null;
            }
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var newGeofence = new DAL.Geofence()
                {
                    Name = _Zone.Name,
                    AllowedZone = _Zone.Allowed,
                    OutOfZone = _Zone.OutOfZone,
                    UserId = _AccountID,
                    SpeedLimitInMph = _Zone.SpeedLimitInMPH,
                    Color = _Zone.Color,
                    TimeBasedStart = _Zone.TimeBasedStart,
                    TimeBasedEnd = _Zone.TimeBasedEnd,
                    TimeBased = false,
                    Enabled = _Zone.Enabled,
                    GeofenceType = 2
                };

                newGeofence.Zone = new DAL.Zone()
                {
                    AreaInMeters = _Zone.AreaInMeters,
                    ZoneTypeId = _Zone.ZoneTypeID
                };

                _Zone.GeoCoordinateList.ForEach(gc => newGeofence.Geocoordinate.Add(new DAL.Geocoordinate()
                {
                    Longitude = gc.Longitude,
                    Latitude = gc.Latitude
                }));

                if (_Zone.GeoCoordinateList.Count() == 1)
                {
                    var circle = CreateCircle(_Zone.GeoCoordinateList.FirstOrDefault(), _Zone.AreaInMeters.AreaToRadius());
                    newGeofence.Geom = DbGeography.FromBinary(circle.STAsBinary().Buffer, 4326);

                }
                else
                {
                    var polygon = CreatePolygon(_Zone.GeoCoordinateList);
                    newGeofence.Geom = DbGeography.FromBinary(polygon.STAsBinary().Buffer, 4326);

                }
                newGeofence.Zone.AreaInMeters = newGeofence.Geom.Area ?? 0;
                if (_Zone.AssignedAssetList[0] != null)
                {
                    _Zone.AssignedAssetList.ForEach(x => newGeofence.ObjectGeofence.Add(new ObjectGeofence()
                    {
                        ObjectId = x
                    }));
                }
                gfdb.Geofence.Add(newGeofence);

                //gfdb.SaveChanges();


                try
                {
                    gfdb.SaveChanges();
                }
                catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
                {
                    Exception raise = dbEx;
                    foreach (var validationErrors in dbEx.EntityValidationErrors)
                    {
                        foreach (var validationError in validationErrors.ValidationErrors)
                        {
                            string message = string.Format("{0}:{1}",
                                validationErrors.Entry.Entity.ToString(),
                                validationError.ErrorMessage);
                            // raise a new exception nesting
                            // the current instance as InnerException
                            raise = new InvalidOperationException(message, raise);
                        }
                    }
                    throw raise;
                }

                _Zone.AreaInMeters = newGeofence.Zone.AreaInMeters;
                _Zone.ZoneID = newGeofence.GeofenceId;
                _Zone.Geometry = gfdb.sp_PGPS_get_zones_single_geojson(_Zone.ZoneID.ToString()).FirstOrDefault();
                _Zone.Radius = newGeofence.Zone.AreaInMeters.AreaToRadius();
                return _Zone;
            }
        }


        public static Models.Geofence.Zone UpdateZone(int _ZoneID, int _AccountID, Models.Geofence.Zone _Zone, string _WebConfigurationName)
        {
            if (_Zone.GeoCoordinateList.Count() == 0)
            {
                return null;
            }

            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {

                var findGeofence = (from gz in gfdb.Geofence
                                    where gz.GeofenceId == _ZoneID
                                    select gz).ToList();

                if (findGeofence.Count() > 0)
                {
                    var foundGeofence = findGeofence.FirstOrDefault();

                 

                    foundGeofence.Name = _Zone.Name;
                    foundGeofence.AllowedZone = _Zone.Allowed;
                    foundGeofence.OutOfZone = _Zone.OutOfZone;
                    foundGeofence.SpeedLimitInMph = _Zone.SpeedLimitInMPH;
                    foundGeofence.Color = _Zone.Color;
                    foundGeofence.Enabled = _Zone.Enabled;
                    foundGeofence.Zone.AreaInMeters = _Zone.AreaInMeters;
                    foundGeofence.Zone.ZoneTypeId = _Zone.ZoneTypeID;
                    foundGeofence.UserId = _AccountID;
                    foundGeofence.TimeBasedStart = _Zone.TimeBasedStart;
                    foundGeofence.TimeBasedEnd = _Zone.TimeBasedEnd;

                    var gclist = foundGeofence.Geocoordinate.ToList();
                    gclist.ForEach(gc => foundGeofence.Geocoordinate.Remove(gc));


                    foreach (var gc in gclist)
                    {
                        gfdb.Geocoordinate.Remove(gc);
                    }

                    gfdb.SaveChanges();
                    _Zone.GeoCoordinateList.ForEach(gc => foundGeofence.Geocoordinate.Add(new DAL.Geocoordinate()
                    {
                        Longitude = gc.Longitude,
                        Latitude = gc.Latitude
                    }));


                    if (_Zone.GeoCoordinateList.Count() == 1)
                    {
                        var circle = CreateCircle(_Zone.GeoCoordinateList.FirstOrDefault(), _Zone.AreaInMeters.AreaToRadius());
                        foundGeofence.Geom = DbGeography.FromBinary(circle.STAsBinary().Buffer, 4326);
                    }
                    else
                    {
                        var polygon = CreatePolygon(_Zone.GeoCoordinateList);
                        foundGeofence.Geom = DbGeography.FromBinary(polygon.STAsBinary().Buffer, 4326);
                    }

                    foundGeofence.Zone.AreaInMeters = foundGeofence.Geom.Area ?? 0;
                    _Zone.AreaInMeters = foundGeofence.Zone.AreaInMeters;
                }

                gfdb.SaveChanges();

                var getGeofenceInfo = gfdb.GeofenceInfo.Where(x => x.InfoID == _ZoneID).ToList();

                if (getGeofenceInfo.Count() > 0)
                {
                    _Zone.Name = getGeofenceInfo.FirstOrDefault().Type == "1" ? _Zone.Name + "{0}" : _Zone.Name + "{D}";

                }


                    return _Zone;
            }
        }


        public static SqlGeography CreatePolygon(List<Models.Geofence.GeoCoordinate> _GeoCoordinateList)
        {
            if (_GeoCoordinateList.Count() == 0)
            {
                return null;
            }

            //arrange to reverse order
            _GeoCoordinateList.ArrangeCoordinates();

            SqlGeographyBuilder sgb = new SqlGeographyBuilder();
            sgb.SetSrid(4326);
            sgb.BeginGeography(OpenGisGeographyType.Polygon);

            var firstGC = _GeoCoordinateList.FirstOrDefault();

            sgb.BeginFigure(firstGC.Latitude, firstGC.Longitude);
            foreach (Models.Geofence.GeoCoordinate gc in _GeoCoordinateList)
            {
                sgb.AddLine(gc.Latitude, gc.Longitude);
            }
            sgb.AddLine(firstGC.Latitude, firstGC.Longitude);
            sgb.EndFigure();

            sgb.EndGeography();
            return sgb.ConstructedGeography.MakeValid();
        }

        public static SqlGeography CreatePolyline(List<Models.Geofence.GeoCoordinate> _GeoCoordinateList)
        {
            if (_GeoCoordinateList.Count() == 0)
            {
                return null;
            }

            //arrange to reverse order
            _GeoCoordinateList.ArrangeCoordinates();

            SqlGeographyBuilder sgb = new SqlGeographyBuilder();
            sgb.SetSrid(4326);
            sgb.BeginGeography(OpenGisGeographyType.LineString);

            var firstGC = _GeoCoordinateList.FirstOrDefault();

            sgb.BeginFigure(firstGC.Latitude, firstGC.Longitude);
            foreach (Models.Geofence.GeoCoordinate gc in _GeoCoordinateList)
            {
                sgb.AddLine(gc.Latitude, gc.Longitude);
            }
            sgb.AddLine(firstGC.Latitude, firstGC.Longitude);
            sgb.EndFigure();

            sgb.EndGeography();
            return sgb.ConstructedGeography.MakeValid();
        }


        public static SqlGeography CreateRoute(List<Models.Geofence.GeoCoordinate> _GeoCoordinateList)
        {
            if (_GeoCoordinateList.Count() == 0)
            {
                return null;
            }

            //arrange to reverse order
            _GeoCoordinateList.ArrangeCoordinates();

            SqlGeographyBuilder sgb = new SqlGeographyBuilder();
            sgb.SetSrid(4326);

            sgb.BeginGeography(OpenGisGeographyType.LineString);

            //sgb.BeginFigure()

            //sgb.BeginGeography(OpenGisGeographyType.MultiLineString);


            var firstGC = _GeoCoordinateList.FirstOrDefault();

            sgb.BeginFigure(firstGC.Latitude, firstGC.Longitude);
            foreach (Models.Geofence.GeoCoordinate gc in _GeoCoordinateList)
            {
                sgb.AddLine(gc.Latitude, gc.Longitude);
            }
            //sgb.AddLine(firstGC.Latitude, firstGC.Longitude);
            sgb.EndFigure();

            sgb.EndGeography();
            return sgb.ConstructedGeography.MakeValid();

        }


        public static SqlGeography CreateCircle(Models.Geofence.GeoCoordinate _GeoCoordinate, double _Radius)
        {
            if (_GeoCoordinate == null)
            {
                return null;
            }

            var point = SqlGeography.Point(_GeoCoordinate.Latitude, _GeoCoordinate.Longitude, 4326);
            var circle = point.BufferWithTolerance(_Radius, 0.01, true);
            return circle.MakeValid();
        }


        private static List<Models.Geofence.GeoCoordinate> ArrangeCoordinates(this List<Models.Geofence.GeoCoordinate> _GeoCoordinateList)
        {
            List<double> edge = new List<double>();
            for (int i = 0; i < _GeoCoordinateList.Count() - 1; i++)
            {
                double sum = (_GeoCoordinateList[i + 1].Latitude - _GeoCoordinateList[i].Latitude) * (_GeoCoordinateList[i + 1].Longitude + _GeoCoordinateList[i].Longitude);
                edge.Add(sum);
            }

            double sum2 = (_GeoCoordinateList[0].Latitude - _GeoCoordinateList[_GeoCoordinateList.Count() - 1].Latitude) * (_GeoCoordinateList[0].Longitude + _GeoCoordinateList[_GeoCoordinateList.Count() - 1].Longitude);
            edge.Add(sum2);

            var x = edge.Sum();
            if (x < 0)
            {
                _GeoCoordinateList.Reverse();
            }

            return _GeoCoordinateList;
        }


        public static double AreaToRadius(this double _Area)
        {
            if (_Area > 0)
            {
                double areaPI = _Area / Math.PI;
                return Math.Sqrt(areaPI);
            }
            else
            {
                return 0;
            }
        }


        public static void GetZoneAssignedAssets(ref List<AssignmentCustomer> _AUCA, int _ZoneID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var AssignedAssets = (from za in gfdb.ObjectGeofence
                                      where za.GeofenceId == _ZoneID
                                      select za.ObjectId).ToList();


                foreach (var cus in _AUCA)
                {
                    foreach (var asset in cus.AccountUserChildAssetList)
                    {
                        asset.IsAssigned = AssignedAssets.Contains(asset.AssetID);
                    }
                    cus.Total = cus.AccountUserChildAssetList.Where(x => x.IsAssigned == true).ToList().Count();
                }

            }
        }


        public static List<AssetAssignedZones> GetAssetAssignedZones(string _AssetID, int _UserID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var AssignedAssets = (from za in gfdb.ObjectGeofence
                                      where za.ObjectId == _AssetID
                                      select za.GeofenceId).ToList();

                var UserZones = (from uz in gfdb.Zone
                                 where uz.Geofence.UserId == _UserID
                                 select new AssetAssignedZones()
                                 {
                                     ZoneID = uz.ZoneId,
                                     Name = uz.Geofence.Name,
                                     IsAssigned = false
                                 }).ToList();

                UserZones.ForEach(x => x.IsAssigned = AssignedAssets.Any(y => x.ZoneID == y));

                return UserZones;
            }
        }


        //use to get zone list without geometry json
        public static List<AssetAssignedZones> GetZoneList(int _UserID, int _ParentID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var UserZones = (from uz in gfdb.Zone
                                 where uz.Geofence.UserId == _UserID || uz.Geofence.UserId == _ParentID
                                 select new AssetAssignedZones()
                                 {
                                     ZoneID = uz.ZoneId,
                                     Name = uz.Geofence.Name,
                                     IsAssigned = false
                                 }).ToList();

                return UserZones;
            }
        }


        //count total zones of user
        public static int GetCountZoneList(int _UserID,int _ParentID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var res = gfdb.Zone.Where(x => x.Geofence.UserId == _UserID ).ToList().Count();

                return res;
            }
        }


        //count total zones of asset
        public static int GetCountAssetZoneList(string _AssetID, int _UserID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {

                var AssignedAssets = (from za in gfdb.ObjectGeofence
                                      where za.ObjectId == _AssetID
                                      select za.GeofenceId).ToList();

                var result = AssignedAssets.Count();

                return result;

            }
        }


        //Update Account Asset Assigned Asset List
        public static void UpdateZoneAssignedAssetList(List<ZoneAssignedAssets> _AUCA, int _ZoneID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var AssignedAssets = (from suv in gfdb.ObjectGeofence
                                      where suv.GeofenceId == _ZoneID
                                      select suv).ToList();

                AssignedAssets.ForEach(x => gfdb.ObjectGeofence.Remove(x));

                _AUCA.Where(x => x.IsAssigned == true)
                    .ToList()
                    .ForEach(x => gfdb.ObjectGeofence.Add(
                        new ObjectGeofence()
                        {
                            ObjectId = x.AssetID,
                            GeofenceId = _ZoneID
                        }));

                gfdb.SaveChanges();
            }
        }


        public static void UpdateAssetAssignedZoneList(List<AssetAssignedZones> _AUCA, string _AssetID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var AssignedAssets = (from suv in gfdb.ObjectGeofence
                                      where suv.ObjectId == _AssetID
                                      select suv).ToList();

                AssignedAssets.ForEach(x => gfdb.ObjectGeofence.Remove(x));

                _AUCA.Where(x => x.IsAssigned == true)
                    .ToList()
                    .ForEach(x => gfdb.ObjectGeofence.Add(
                        new ObjectGeofence()
                        {
                            ObjectId = _AssetID,
                            GeofenceId = x.ZoneID
                        }));

                gfdb.SaveChanges();
            }
        }


        public static List<Models.Geofence.AssetInsideZone> getInsideZoneList(Models.Geofence.insideZone _Zone, string _WebConfigurationName)
        {


            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var ObjectString = String.Join(",", from l in _Zone.ObjectList select String.Format("{0}", l));
                var zoneList = tfdb.sp_pgps_get_assets_inside_zone(ObjectString).ToList();


                var assetzonelist = zoneList.Select(a => new AssetInsideZone()
                {
                    GeofenceID = a.GeofenceID,
                    AssetID = a.ObjectID,
                    GeofenceName = a.GeofenceName,
                    AllowedZone = a.AllowedZone,
                    Color = a.Color,
                    ZoneTypeID = a.ZoneTypeId,
                    Geometry = a.Geom
                }).ToList();
                if (assetzonelist.Count() > 0)
                {
                    return assetzonelist;
                }

                else
                {
                    return null;
                }
            }
        }

        //assets list that out of  assigned zones
        //public static List<Models.Geofence.AssetOutOfZone> getOutsideZoneList(int _AccountID, string _WebConfigurationName)
        //{
        //    using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
        //    {
        //        var assetlist = tfdb.sp_pgps_get_assets_out_zone_alert(_AccountID).ToList();
        //        var result = assetlist.Select(a => new AssetOutOfZone()
        //        {
        //            GeofenceID = a.GeofenceID,
        //            AssetID = a.ObjectID,
        //            GeofenceName = a.Name,
        //            AllowedZone = a.AllowedZone,
        //            ZoneTypeID = a.ZoneTypeId,
        //            Color = a.Color,
        //        }).ToList();

        //        return result.DistinctBy(x=> x.AssetID).ToList();
        //    }
        //}

        //zone filter assets based on type
        public static List<Models.Track.TrackZoneFilterList> getZoneFilterAssets(int _AccountID, bool _Allowed, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                //var ObjectString = String.Join(",", from l in _Zone.ObjectList select String.Format("{0}", l));
                //var zoneList = gfdb.sp_pgps_get_assets_inside_list_based_zone_type(_AccountID,_Allowed);
                var zoneList = gfdb.sp_pgps_get_assets_inside_zone_type(_AccountID, _Allowed);

                var assetzonelist = zoneList.Select(a => new Models.Track.TrackZoneFilterList()
                {
                    //AssetID = a.AssetID,
                    //Name = a.Name,
                    //GPSTime = a.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                    //Latitude = (double)a.Latitude ,
                    //Longitude = (double)a.Longitude,
                    //Location = a.Location,
                    //Fuel = a.Fuel ?? 0,
                    //Temperature1 = (int)a.Temperature1,
                    //Temperature2 = (int)a.Temperature2,
                    //Sensor1 = a.Sensor1 == 1 ? true: false,
                    //Sensor2 = a.Sensor2 == 1 ? true : false,
                    //Speed = a.Speed ?? 0,
                    //DirectionCardinal = a.Direction.ToString().strToInt().degreesToCardinal(),
                    //DirectionDegrees = a.Direction.ToString(),
                    //Status = a.Status,
                    //GeofenceName = a.GeofenceName

                    AssetID = a.ObjectID,
                    Name = a.ObjectRegNum,
                    GPSTime = a.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                    Latitude = (double)a.Latitude,
                    Longitude = (double)a.Longitude,
                    Location = a.Location,
                    Fuel = (decimal)a.Fuel,
                    Temperature1 = (int)a.Temperature1,
                    Temperature2 = (int)a.Temperature2,
                    Sensor1 = a.Sensor1 == 1 ? true : false,
                    Sensor2 = a.Sensor2 == 1 ? true : false,
                    Speed = (decimal)a.Speed,
                    DirectionCardinal = a.Direction.ToString().strToInt().degreesToCardinal(),
                    DirectionDegrees = a.Direction.ToString(),
                    Status = a.Status,
                    GeofenceName = a.GeofenceName
                }).ToList();
                if (assetzonelist.Count() > 0)
                {
                    return assetzonelist;
                }

                else
                {
                    return null;
                }
            }
        }

        //zone filter assets all
        public static List<Models.Track.TrackZoneFilterList> getZonefilterAssetsAll(int _AccountID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                List<sp_pgps_get_assets_inside_list_based_zone_type_Result> allzonelist = new List<sp_pgps_get_assets_inside_list_based_zone_type_Result>();

                //var gozoneList = gfdb.sp_pgps_get_assets_inside_list_based_zone_type(_AccountID, true).ToList();
                //var nozoneList = gfdb.sp_pgps_get_assets_inside_list_based_zone_type(_AccountID, false).ToList();

                var gozoneList = gfdb.sp_pgps_get_assets_inside_zone_type(_AccountID, true).ToList();
                var nozoneList = gfdb.sp_pgps_get_assets_inside_zone_type(_AccountID, false).ToList();

                gozoneList.AddRange(nozoneList);

                var assetzonelist = gozoneList.Select(a => new Models.Track.TrackZoneFilterList()
                {
                    //AssetID = a.AssetID,
                    //Name = a.Name,
                    //GPSTime = a.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                    //Latitude = (double)a.Latitude,
                    //Longitude = (double)a.Longitude,
                    //Location = a.Location,
                    //Fuel = a.Fuel ?? 0,
                    //Temperature1 = (int)a.Temperature1,
                    //Temperature2 = (int)a.Temperature2,
                    //Sensor1 = a.Sensor1 == 1 ? true : false,
                    //Sensor2 = a.Sensor2 == 1 ? true : false,
                    //Speed = a.Speed ?? 0,
                    //DirectionCardinal = a.Direction.ToString().strToInt().degreesToCardinal(),
                    //DirectionDegrees = a.Direction.ToString(),
                    //Status = a.Status,
                    //GeofenceName = a.GeofenceName

                    AssetID = a.ObjectID,
                    Name = a.ObjectRegNum,
                    GPSTime = a.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                    Latitude = (double)a.Latitude,
                    Longitude = (double)a.Longitude,
                    Location = a.Location,
                    Fuel = (decimal)a.Fuel,
                    Temperature1 = (int)a.Temperature1,
                    Temperature2 = (int)a.Temperature2,
                    Sensor1 = a.Sensor1 == 1 ? true : false,
                    Sensor2 = a.Sensor2 == 1 ? true : false,
                    Speed = (decimal)a.Speed,
                    DirectionCardinal = a.Direction.ToString().strToInt().degreesToCardinal(),
                    DirectionDegrees = a.Direction.ToString(),
                    Status = a.Status,
                    GeofenceName = a.GeofenceName
                }).ToList();
                if (assetzonelist.Count() > 0)
                {
                    return assetzonelist;
                }

                else
                {
                    return null;
                }

            }

        }

        public static List<sp_PGPS_get_object_zone_list_filtered_Result> SearchAssetZoneList(int AccountID, string _AssetID,int _Take, string _Keyword, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var result = gfdb.sp_PGPS_get_object_zone_list_filtered(AccountID, _AssetID, _Take.ToString(), 0, _Keyword).ToList();

                return result;
            }
        }


        public static List<sp_PGPS_get_user_zone_list_filtered_Result> SearchAllZoneList(int _UserID, int _ParentID,int _NextPage, int _Take, string _Keyword, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var result = gfdb.sp_PGPS_get_user_zone_list_filtered(_UserID, _ParentID, _Take.ToString(), _Keyword, _NextPage);

                return result.ToList();
            }
        }

        #endregion

        #region route
       

        public static List<Models.Geofence.Route> GetUserRouteList(int _UserID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var filteredRoute = (from r in gfdb.Route
                                     where r.Geofence.UserId == _UserID
                                     select r).ToList();

                var result = (from r in filteredRoute.ToList()
                              select new Models.Geofence.Route()
                              {
                                  RouteID = r.RouteId,
                                  BufferSizeInMeters = r.BufferSizeInMeters,
                                  DistanceInMeters = r.DistanceInMeters,
                                  SpeedLimitRoute = r.Geofence.SpeedLimitInMph,
                                  StartLatitude = r.StartLatitude,
                                  StartLongitude = r.StartLongitude,
                                  EndLatitude = r.EndLatitude,
                                  EndLongitude = r.EndLongitude,
                                  StartDatetime = r.StartDatetime,
                                  EndDatetime = r.EndDatetime,
                                  Name = r.Geofence.Name,
                                  UserID = r.Geofence.UserId,
                                  StartLocation = r.StartLocation,
                                  EndLocation = r.EndLocation,
                                  //StartLocation = MAPDBHelpers.ReverseGeocode(r.StartLatitude, r.StartLongitude),
                                  //EndLocation = MAPDBHelpers.ReverseGeocode(r.EndLatitude, r.EndLongitude),
                                  AssignedAssetList = r.Geofence.ObjectGeofence.ToList().Select(x => x.ObjectId).ToList(),
                                  GeoCoordinateList = (from gc in r.Geofence.Geocoordinate
                                                       select new Models.Geofence.GeoCoordinate()
                                                       {
                                                           Latitude = gc.Latitude,
                                                           Longitude = gc.Longitude
                                                       }).ToList(),
                                  Geom = JsonConvert.SerializeObject(new Foo  { Polyline = r.Geofence.Geom }),
                                  Type = r.Type == true ? "snap" : "line"
                                  //JsonConvert.SerializeObject(r.Geofence.Geom.AsText) // r.Geofence.Geom.ToString()
                              }).ToList();

                if (result.Count() > 0)
                {
                    return result;
                }
                else
                {
                    return null;
                }

            }
        }

        public static List<Models.Geofence.RouteStatus> GetUserRouteStatusList(int _UserID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var result = (from i in gfdb.sp_PGPS_get_user_route_list_status(_UserID.ToString()).ToList()
                              select new RouteStatus()
                              {
                                  AssetID = i.ObjectID,
                                  IsOnRoute = i.IsOnRoute
                              }).ToList();

                return result;
                
            }
        }

        public static List<Models.Geofence.Route> GetAssetRouteList(string _AssetID, int _AccountID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var filteredZone = (from r in gfdb.Route
                                    where r.Geofence.ObjectGeofence.Any(x => x.ObjectId == _AssetID)
                                   && r.Geofence.UserId == _AccountID
                                    select r).ToList();
                if (filteredZone.Count() > 0)
                {
                    var result = (from r in filteredZone.ToList()
                                  select new Models.Geofence.Route()
                                  {
                                      RouteID = r.Geofence.Route.RouteId,
                                      BufferSizeInMeters = r.Geofence.Route.BufferSizeInMeters,
                                      DistanceInMeters = r.Geofence.Route.DistanceInMeters,
                                      SpeedLimitRoute = r.Geofence.SpeedLimitInMph,
                                      StartLatitude = r.Geofence.Route.StartLatitude,
                                      StartLongitude = r.Geofence.Route.StartLongitude,
                                      EndLatitude = r.Geofence.Route.EndLatitude,
                                      EndLongitude = r.Geofence.Route.EndLongitude,
                                      StartDatetime = r.Geofence.Route.StartDatetime,
                                      EndDatetime = r.Geofence.Route.EndDatetime,
                                      Name = r.Geofence.Name,
                                      UserID = r.Geofence.UserId,
                                      //StartLocation = MAPDBHelpers.ReverseGeocode(r.Geofence.Route.StartLatitude, r.Geofence.Route.StartLongitude),
                                      //EndLocation = MAPDBHelpers.ReverseGeocode(r.Geofence.Route.EndLatitude, r.Geofence.Route.EndLongitude),
                                      StartLocation = r.StartLocation,
                                      EndLocation = r.EndLocation,
                                      AssignedAssetList = r.Geofence.ObjectGeofence.ToList().Select(x => x.ObjectId).ToList(),
                                      GeoCoordinateList = (from gc in r.Geofence.Geocoordinate
                                                           select new Models.Geofence.GeoCoordinate()
                                                           {
                                                               Latitude = gc.Latitude,
                                                               Longitude = gc.Longitude
                                                           }).ToList(),
                                      Type = r.Type == true ? "snap" : "line"
                                  }).ToList();
                    if (result.Count() > 0)
                    {
                        return result;
                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {
                    return null;
                }
            }
        }


        public static Models.Geofence.Route AddRoute(Models.Geofence.Route _Route, int _AccountID, string _WebConfigurationName)
        {
            //if (_Route.GeoCoordinateList.Count() == 0)
            //{
            //    return null;
            //}

            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {

                var start_location = "";//MAPDBHelpers.ReverseGeocodeGoogle(_Route.StartLatitude, _Route.StartLongitude);
                var end_location = "";//MAPDBHelpers.ReverseGeocodeGoogle(_Route.EndLatitude, _Route.EndLongitude);

                var newGeofence = new DAL.Geofence()
                {
                    Name = _Route.Name,
                    AllowedZone = true,
                    UserId = _AccountID,
                    SpeedLimitInMph = _Route.SpeedLimitRoute,
                    Color = "#000",
                    TimeBasedStart = DateTime.Now,
                    TimeBasedEnd = DateTime.Now,
                    TimeBased = false,
                    Enabled = true,
                    GeofenceType = 3
                };
                newGeofence.Route = new DAL.Route()
                {
                    DistanceInMeters = _Route.DistanceInMeters,
                    BufferSizeInMeters = _Route.BufferSizeInMeters,
                    StartLatitude = _Route.StartLatitude,
                    StartLongitude = _Route.StartLongitude,
                    EndLatitude = _Route.EndLatitude,
                    EndLongitude = _Route.EndLongitude,
                    StartDatetime = _Route.StartDatetime,
                    EndDatetime = _Route.EndDatetime,
                    StartLocation = start_location,
                    EndLocation = end_location,
                    Type = (_Route.Type == "line" ? false : true)
                };


                var route = CreateRoute(_Route.GeoCoordinateList);
                newGeofence.Geom = DbGeography.FromBinary(route.STAsBinary().Buffer, 4326);
                if (_Route.AssignedAssetList[0] != null)
                {
                    _Route.AssignedAssetList.ForEach(x => newGeofence.ObjectGeofence.Add(new ObjectGeofence()
                    {
                        ObjectId = x
                    }));
                }
                //newGeofence.ObjectGeofence.Add(new ObjectGeofence()
                //{
                //    ObjectId = _AssetID
                //});
                gfdb.Geofence.Add(newGeofence);

                gfdb.SaveChanges();
                _Route.RouteID = newGeofence.GeofenceId;
                //_Route.StartLocation = MAPDBHelpers.ReverseGeocode(newGeofence.Route.StartLatitude, newGeofence.Route.StartLongitude);
                //_Route.EndLocation = MAPDBHelpers.ReverseGeocode(newGeofence.Route.EndLatitude, newGeofence.Route.EndLongitude);
                _Route.StartLocation = start_location;
                _Route.EndLocation = end_location;
                _Route.StartDatetime = newGeofence.Route.StartDatetime;
                _Route.EndDatetime = newGeofence.Route.EndDatetime;
                return _Route;
            }
        }


        public static Models.Geofence.Route UpdateRoute(int _RouteID, int _AccountID, Models.Geofence.Route _Route, string _WebConfigurationName)
        {
            if (_Route.GeoCoordinateList.Count() == 0)
            {
                return null;
            }

            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var findGeofence = (from gz in gfdb.Geofence
                                    where gz.GeofenceId == _RouteID
                                    select gz).ToList();

                if (findGeofence.Count() > 0)
                {
                    var foundGeofence = findGeofence.FirstOrDefault();

                    //var start_location = MAPDBHelpers.ReverseGeocodeGoogle(foundGeofence.Route.StartLatitude, foundGeofence.Route.StartLongitude);
                    //var end_location = MAPDBHelpers.ReverseGeocodeGoogle(foundGeofence.Route.EndLatitude, foundGeofence.Route.EndLongitude);
                    var start_location = MAPDBHelpers.ReverseGeocode(foundGeofence.Route.StartLatitude, foundGeofence.Route.StartLongitude);
                    var end_location = MAPDBHelpers.ReverseGeocode(foundGeofence.Route.EndLatitude, foundGeofence.Route.EndLongitude);

                    foundGeofence.Name = _Route.Name;
                    foundGeofence.AllowedZone = true;
                    foundGeofence.SpeedLimitInMph = _Route.SpeedLimitRoute;
                    foundGeofence.Color = "#000";
                    foundGeofence.Enabled = true;
                    foundGeofence.UserId = _AccountID;
                    foundGeofence.TimeBasedStart = DateTime.Now;
                    foundGeofence.TimeBasedEnd = DateTime.Now;
                    foundGeofence.Route.DistanceInMeters = _Route.DistanceInMeters;
                    foundGeofence.Route.StartLatitude = _Route.StartLatitude;
                    foundGeofence.Route.EndLatitude = _Route.EndLatitude;
                    foundGeofence.Route.StartLongitude = _Route.StartLongitude;
                    foundGeofence.Route.EndLongitude = _Route.EndLongitude;
                    foundGeofence.Route.StartLocation = start_location;
                    foundGeofence.Route.EndLocation = end_location;
                
                    //foundGeofence.Route.

                    var gclist = foundGeofence.Geocoordinate.ToList();
                    gclist.ForEach(gc => foundGeofence.Geocoordinate.Remove(gc));

                    foreach (var gc in gclist)
                    {
                        gfdb.Geocoordinate.Remove(gc);
                    }

                    gfdb.SaveChanges();
                    _Route.GeoCoordinateList.ForEach(gc => foundGeofence.Geocoordinate.Add(new DAL.Geocoordinate()
                    {
                        Longitude = gc.Longitude,
                        Latitude = gc.Latitude
                    }));

                    //_Route.StartLocation = MAPDBHelpers.ReverseGeocode(foundGeofence.Route.StartLatitude, foundGeofence.Route.StartLongitude);
                    //_Route.EndLocation = MAPDBHelpers.ReverseGeocode(foundGeofence.Route.EndLatitude, foundGeofence.Route.EndLongitude);
                    _Route.StartLocation = start_location;
                    _Route.EndLocation = end_location;
                    _Route.StartDatetime = foundGeofence.Route.StartDatetime;
                    _Route.EndDatetime = foundGeofence.Route.EndDatetime;
                    _Route.Type = foundGeofence.Route.Type == false ? "line" : "snap";

                    var route = CreateRoute(_Route.GeoCoordinateList);
                    foundGeofence.Geom = DbGeography.FromBinary(route.STAsBinary().Buffer, 4326);

                }

                gfdb.SaveChanges();

                return _Route;
            }
        }


        public static int? DeleteRoute(int _RouteID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {

                var result = (from r in gfdb.Geofence
                              where r.GeofenceId == _RouteID
                              select r).ToList();

                if (result.Count() > 0)
                {
                    gfdb.Geofence.Remove(result.FirstOrDefault());
                    gfdb.SaveChanges();

                    return result.FirstOrDefault().GeofenceId;
                }
                else
                {
                    return null;
                }

            }
        }


        public static void GetRouteAssignedAssets(ref List<AssignmentCustomer> _AUCA, int _RouteID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var AssignedAssets = (from za in gfdb.ObjectGeofence
                                      where za.GeofenceId == _RouteID
                                      select za.ObjectId).ToList();


                foreach (var cus in _AUCA)
                {
                    foreach (var asset in cus.AccountUserChildAssetList)
                    {
                        asset.IsAssigned = AssignedAssets.Contains(asset.AssetID);
                    }
                }

            }
        }


        public static List<AssetAssignedRoutes> GetAssetAssignedRoutes(string _AssetID, int _UserID, string _WebConfigurationName)
        {

            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var AssignedAssets = (from za in gfdb.ObjectGeofence
                                      where za.ObjectId == _AssetID
                                      select za.GeofenceId).ToList();

                var UserRoutes = (from uz in gfdb.Geofence
                                  where uz.UserId == _UserID
                                  where uz.Route.RouteId == uz.GeofenceId
                                  select new AssetAssignedRoutes()
                                  {
                                      RouteID = uz.GeofenceId,
                                      Name = uz.Name,
                                      IsAssigned = false
                                  }).ToList();

                UserRoutes.ForEach(x => x.IsAssigned = AssignedAssets.Any(y => x.RouteID == y));

                return UserRoutes;
            }
        }


        public static void UpdateRouteAssignedAssetList(List<RouteAssignedAssets> _AUCA, int _RouteID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var AssignedAssets = (from suv in gfdb.ObjectGeofence
                                      where suv.GeofenceId == _RouteID
                                      select suv).ToList();

                AssignedAssets.ForEach(x => gfdb.ObjectGeofence.Remove(x));

                _AUCA.Where(x => x.IsAssigned == true)
                    .ToList()
                    .ForEach(x => gfdb.ObjectGeofence.Add(
                        new ObjectGeofence()
                        {
                            ObjectId = x.AssetID,
                            GeofenceId = _RouteID
                        }));

                gfdb.SaveChanges();
            }
        }


        public static void UpdateAssetAssignedRouteList(List<AssetAssignedRoutes> _AUCA, string _AssetID, string _WebConfigurationName)
        {

            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var AssignedAssets = (from suv in gfdb.ObjectGeofence
                                      where suv.ObjectId == _AssetID
                                      select suv).ToList();

                AssignedAssets.ForEach(x => gfdb.ObjectGeofence.Remove(x));

                _AUCA.Where(x => x.IsAssigned == true)
                    .ToList()
                    .ForEach(x => gfdb.ObjectGeofence.Add(
                        new ObjectGeofence()
                        {
                            ObjectId = _AssetID,
                            GeofenceId = x.RouteID
                        }));

                gfdb.SaveChanges();
            }
        }

        #endregion

        #region Landmark
        public static List<Models.Geofence.LandmarkType> GetLandmarkTypeList(string _WebConfigurationName)
        {

            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var result = (from lt in gfdb.PointOfInterestType
                              where lt.PointOfInterestTypeId != 5 && lt.PointOfInterestTypeId != 21 && lt.PointOfInterestTypeId != 22
                              select new Models.Geofence.LandmarkType()
                              {
                                  Name = lt.Name,
                                  LandmarkTypeID = lt.PointOfInterestTypeId
                              }).ToList();

                if (result.Count() > 0)
                {
                    return result;
                }
                else
                {
                    return null;
                }
            }


        }

        public static List<Models.Geofence.Landmark> GetUserLandmarkList(int _UserID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {
                var filteredLandmark = (from z in gfdb.PointOfInterest
                                        where z.Geofence.UserId == _UserID
                                        select z).ToList();

                var result = (from l in filteredLandmark.ToList()
                              select new Models.Geofence.Landmark()
                              {
                                  RadiusInMeters = l.RadiusInMeters,
                                  LandmarkTypeID = l.PointOfInterestTypeId,
                                  Enabled = l.Geofence.Enabled,
                                  Name = l.Geofence.Name,
                                  UserID = l.Geofence.UserId,
                                  LandmarkID = l.PointOfInterestId,
                                  LandmarkTypeName = l.PointOfInterestType.Name,
                                  GeoCoordinateList = (from gc in l.Geofence.Geocoordinate
                                                       select new Models.Geofence.GeoCoordinate()
                                                       {
                                                           Latitude = gc.Latitude,
                                                           Longitude = gc.Longitude
                                                       }).ToList()
                              }).ToList();

                if (result.Count() > 0)
                {
                    return result;
                }
                else
                {
                    return result;
                }
            }
        }

        public static List<Models.Geofence.Landmark> GetAssetLandmarkList(string _AssetID, int _AccountID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {

                var filteredLandmark = (from z in gfdb.PointOfInterest
                                        where z.Geofence.ObjectGeofence.Any(x => x.ObjectId == _AssetID)
                                        && z.Geofence.UserId == _AccountID
                                        select z).ToList();

                var result = (from z in filteredLandmark
                              select new Models.Geofence.Landmark()
                              {
                                  RadiusInMeters = z.RadiusInMeters,
                                  LandmarkTypeID = z.PointOfInterestTypeId,
                                  Enabled = z.Geofence.Enabled,
                                  Name = z.Geofence.Name,
                                  UserID = z.Geofence.UserId,
                                  LandmarkID = z.PointOfInterestId,
                                  GeoCoordinateList = (from gc in z.Geofence.Geocoordinate
                                                       select new Models.Geofence.GeoCoordinate()
                                                       {
                                                           Latitude = gc.Latitude,
                                                           Longitude = gc.Longitude
                                                       }).ToList()
                              }).ToList();

                if (result.Count() > 0)
                {
                    return result;
                }
                else
                {
                    return null;
                }
            }
        }

        public static int? DeleteLandmark(int _LandmarkID, string _WebConfigurationName)
        {
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {

                var result = (from z in gfdb.Geofence
                              where z.GeofenceId == _LandmarkID
                              select z).ToList();

                if (result.Count() > 0)
                {

                    gfdb.Geofence.Remove(result.FirstOrDefault());
                    gfdb.SaveChanges();

                    return result.FirstOrDefault().GeofenceId;
                }
                else
                {
                    return null;
                }

            }
        }

        public static Models.Geofence.Landmark AddLandmark(Models.Geofence.Landmark _Landmark, int _AccountID, string _WebConfigurationName)
        {
            if (_Landmark.GeoCoordinateList.Count() == 0)
            {
                return null;
            }
            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {

                var landmarklist = GetUserLandmarkList(_AccountID, _WebConfigurationName);

                var checkifexist = landmarklist.Where(x => x.Name == _Landmark.Name).ToList();

                if (checkifexist.Count() == 0)
                {
                    var newGeofence = new DAL.Geofence()
                    {
                        Name = _Landmark.Name,
                        UserId = _AccountID,
                        TimeBased = false,
                        Enabled = _Landmark.Enabled,
                        TimeBasedStart = DateTime.Now,
                        TimeBasedEnd = DateTime.Now,
                        Color = "#fff",
                        GeofenceType = 1
                    };

                    newGeofence.PointOfInterest = new DAL.PointOfInterest()
                    {
                        RadiusInMeters = _Landmark.RadiusInMeters,
                        PointOfInterestTypeId = _Landmark.LandmarkTypeID
                    };

                    _Landmark.GeoCoordinateList.ForEach(gc => newGeofence.Geocoordinate.Add(new DAL.Geocoordinate()
                    {
                        Longitude = gc.Longitude,
                        Latitude = gc.Latitude
                    }));

                    if (_Landmark.GeoCoordinateList.Count() == 1)
                    {
                        var circle = CreateCircle(_Landmark.GeoCoordinateList.FirstOrDefault(), _Landmark.RadiusInMeters.AreaToRadius());
                        newGeofence.Geom = DbGeography.FromBinary(circle.STAsBinary().Buffer, 4326);

                    }

                    newGeofence.PointOfInterest.RadiusInMeters = _Landmark.RadiusInMeters;
                    gfdb.Geofence.Add(newGeofence);

                    gfdb.SaveChanges();
                    _Landmark.RadiusInMeters = _Landmark.RadiusInMeters;
                    _Landmark.LandmarkID = newGeofence.GeofenceId;
                    _Landmark.isExist = false;
                    return _Landmark;
                }
                else
                {
                    _Landmark.isExist = true;
                    return _Landmark;
                }
                
            }
        }

        public static Models.Geofence.Landmark UpdateLandmark(int _LandmarkID, int _AccountID, Models.Geofence.Landmark _Landmark, string _WebConfigurationName)
        {
            if (_Landmark.GeoCoordinateList.Count() == 0)
            {
                return null;
            }

            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(_WebConfigurationName))
            {

                var findGeofence = (from gz in gfdb.Geofence
                                    where gz.GeofenceId == _LandmarkID
                                    select gz).ToList();

                if (findGeofence.Count() > 0)
                {
                    var foundGeofence = findGeofence.FirstOrDefault();

                    var landmarklist = GetUserLandmarkList(_AccountID, _WebConfigurationName);

                    var checkifexist = landmarklist.Where(x => x.Name == _Landmark.Name && x.LandmarkID != foundGeofence.GeofenceId).ToList();

                    if(checkifexist.Count() == 0) {
                        foundGeofence.Name = _Landmark.Name;
                        foundGeofence.Enabled = _Landmark.Enabled;
                        foundGeofence.PointOfInterest.RadiusInMeters = _Landmark.RadiusInMeters;
                        foundGeofence.PointOfInterest.PointOfInterestTypeId = _Landmark.LandmarkTypeID;
                        foundGeofence.UserId = _AccountID;

                        var gclist = foundGeofence.Geocoordinate.ToList();
                        gclist.ForEach(gc => foundGeofence.Geocoordinate.Remove(gc));


                        foreach (var gc in gclist)
                        {
                            gfdb.Geocoordinate.Remove(gc);
                        }

                        gfdb.SaveChanges();
                        _Landmark.GeoCoordinateList.ForEach(gc => foundGeofence.Geocoordinate.Add(new DAL.Geocoordinate()
                        {
                            Longitude = gc.Longitude,
                            Latitude = gc.Latitude
                        }));


                        if (_Landmark.GeoCoordinateList.Count() == 1)
                        {
                            var circle = CreateCircle(_Landmark.GeoCoordinateList.FirstOrDefault(), _Landmark.RadiusInMeters.AreaToRadius());
                            foundGeofence.Geom = DbGeography.FromBinary(circle.STAsBinary().Buffer, 4326);
                        }
                        else
                        {
                            var polygon = CreatePolygon(_Landmark.GeoCoordinateList);
                            foundGeofence.Geom = DbGeography.FromBinary(polygon.STAsBinary().Buffer, 4326);
                        }

                        foundGeofence.PointOfInterest.RadiusInMeters = foundGeofence.Geom.Area ?? 0;
                        _Landmark.RadiusInMeters = foundGeofence.PointOfInterest.RadiusInMeters;
                        _Landmark.isExist = false;
                    }
                    else
                    {
                        _Landmark.isExist = true;
                    }

                    
                }

                gfdb.SaveChanges();

                return _Landmark;
            }
        }
        #endregion



        public static IEnumerable<TSource> DistinctBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
        {
            HashSet<TKey> seenKeys = new HashSet<TKey>();
            foreach (TSource element in source)
            {
                if (seenKeys.Add(keySelector(element)))
                {
                    yield return element;
                }
            }
        }
    }
}
