using Philgps_WebAPI.DAL;
using Philgps_WebAPI.Models;
using Philgps_WebAPI.Models.Track;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using Philgps_WebAPI.Helpers.MAPDB;
using Philgps_WebAPI.Extensions;

namespace Philgps_WebAPI.Helpers.MOBILE
{
    public static class MobileHelper
    {


        //Get Asset Info
        public static Asset GetAssetInfo(string _AssetID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                if (
                    (_AssetID == null) ||
                    (_AssetID.Trim().Length == 0))
                {
                    return null;
                }
                var result = (from a in tfdb.A_ObjectInfo
                              from c in tfdb.A_CustomerInfo
                              where a.CustomerID == c.CustomerID &&
                              a.ObjectID == _AssetID
                              select new Asset()
                              {
                                  AssetID = a.ObjectID,
                                  Name = a.ObjectRegNum,
                                  FuelRatio = (float)a.FuelRatio,
                                  FuelTypeID = (byte)a.FuelType,
                                  GroupID = a.GISGroupID,
                                  SIMNumber = a.GSMVoiceNum,
                                  CustomerID = a.CustomerID ?? 0
                              }).ToList();

                if (result.Count() > 0)
                {
                    return result.FirstOrDefault();
                }
                else
                {
                    return null;
                }

            }
        }


        public static TrackMobile GetAssetGPS(string _AssetID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                if (
                    (_AssetID == null) ||
                    (_AssetID.Trim().Length == 0))
                {
                    return null;
                }
                var result = (from at in tfdb.A_ActiveTracks//.AsParallel()                            
                              where at.ObjectID == _AssetID
                              select at).ToList();

                if (result.Count() > 0)
                {
                    var a = result.FirstOrDefault();
                    var ao = (from o in tfdb.A_ObjectInfo
                              where a.ObjectID == o.ObjectID
                              select o).ToList();
                    var ai = ao.FirstOrDefault();

                    TrackMobile track = new TrackMobile()
                    {
                        AssetID = a.ObjectID,
                        AssetName = ai.ObjectRegNum,
                        SIMNum = ai.GSMVoiceNum,
                        DirectionCardinal = (a.Direct != null) ? a.Direct.Value.ToString().strToInt().degreesToCardinal() : "N",
                        DirectionDegrees = (a.Direct != null) ? a.Direct.Value.ToString() : "0",
                        Fuel = (a.Exhaust != null) ? a.Exhaust.Value.decToInt() : 0,
                        GPSTime = (a.GPSTime != null) ? a.GPSTime.Value : DateTime.Now,
                        Latitude = (a.Lat != null) ? a.Lat.Value.decToDbl() : 0.0,
                        Longitude = (a.Lon != null) ? a.Lon.Value.decToDbl() : 0.0,
                        Speed = (a.Speed != null) ? a.Speed.Value.decToInt() : 0,
                        Odometer = (int?)a.MileAge,
                        Temperature1 = (int?)a.Temperature,
                        Temperature2 = ((int?)a.Temp2) != null ? (int?)a.Temp2 : 0,
                        Location = (MAPDBHelpers.ReverseGeocode(a.Lat.Value.decToDbl(), a.Lon.Value.decToDbl())) != null ? MAPDBHelpers.ReverseGeocode(a.Lat.Value.decToDbl(), a.Lon.Value.decToDbl()) : "No Location Available"

                    };

                    var trackStatus = TrackStatus(a.StatusDes, (a.GPSTime != null) ? a.GPSTime.Value : DateTime.Now, (a.Speed != null) ? a.Speed.Value.decToInt() : 0);
                    track.Status = trackStatus;

                    return track;
                }
                else
                {
                    return null;
                }

            }
        }

        public static IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }

        //Get Asset GPS History
        public static List<TrackMobileHistory> GetAssetGPSHistory(string _AssetID, DateTime _Start, DateTime _End, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                if (
                    (_AssetID == null) ||
                    (_AssetID.Trim().Length == 0))
                {
                    return null;
                }

                List<TrackMobileHistory> trackHistoryList = new List<TrackMobileHistory>();

                foreach (DateTime day in EachDay(_Start, _End))
                {
                    string trackTableName = "STAGE_" + day.ToString("yyyyMMdd");
                    string startDT = "";
                    string endDT = "";
                    if (day.ToString("yyyyMMdd") == _Start.ToString("yyyyMMdd"))
                    {
                        startDT = _Start.ToString("yyyy-MM-dd HH:mm:ss");

                    }
                    else
                    {
                        startDT = new DateTime(day.Year, day.Month, day.Day, 00, 00, 01).ToString("yyyy-MM-dd HH:mm:ss");
                    }
                    if (day.ToString("yyyyMMdd") == _End.ToString("yyyyMMdd"))
                    {

                        endDT = _End.ToString("yyyy-MM-dd HH:mm:ss");
                    }
                    else
                    {
                        endDT = new DateTime(day.Year, day.Month, day.Day, 23, 59, 59).ToString("yyyy-MM-dd HH:mm:ss");
                    }
                    var result = tfdb.sp_PGPS_GetTrackHistory_Staging(_AssetID, trackTableName, startDT, endDT).ToList().AsParallel();

                    if (result.Count() > 0)
                    {
                        var tHistory = (from x in result
                                        select new TrackMobileHistory()
                                        {
                                            AssetID = x.AssetID,
                                            DirectionCardinal = x.Direction.Value.degreesToCardinal(),
                                            DirectionDegrees = x.Direction.Value.ToString(),
                                            GPSTime = x.GPSTime.Value,
                                            Latitude = x.Latitude.Value,
                                            Location = x.Location,
                                            Longitude = x.Longitude.Value,
                                            Speed = x.Speed.Value.dblToInt(),
                                            TrackID = x.TrackID.Value,
                                            Status = TrackStatus(x.StatusDes, x.GPSTime.Value, x.Speed.Value.dblToInt())
                                        });

                        trackHistoryList.AddRange(tHistory);
                    }
                }

                return trackHistoryList.OrderBy(x => x.GPSTime).ToList();
            }
        }

        //Get Total Asset Count
        public static StatusCount GetTotalAssetCount(this string _GroupCodes, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                if (
                    (_GroupCodes == null) ||
                    (_GroupCodes.Trim().Length == 0))
                {
                    return null;
                }

                List<string> GroupCodesList = _GroupCodes.Split(new char[] { ',' }).ToList();

                if (GroupCodesList.Count() > 0)
                {
                    var assetList = (from a in tfdb.A_ObjectInfo.ToList().AsParallel()
                                     where GroupCodesList.Contains(a.GISGroupID.ToString())
                                     select a).ToList();

                    var totalCount = assetList.Count();
                    var activeCount = 0;
                    var inactiveCount = 0;
                    var drivingCount = 0;
                    var parkingCount = 0;
                    var idlingCount = 0;
                    var engineStopCount = 0;
                    var powerCutCount = 0;
                    var sosCount = 0;



                    foreach (var asset in assetList)
                    {
                        var activeAssetList = (from a in tfdb.A_ActiveTracks.ToList().AsParallel()
                                               where asset.ObjectID == a.ObjectID
                                               select a).ToList();

                        if (activeAssetList.Count() > 0)
                        {
                            var activeAsset = activeAssetList.FirstOrDefault();

                            var assetStatus = TrackStatus(activeAsset.StatusDes, (activeAsset.GPSTime != null) ? activeAsset.GPSTime.Value : DateTime.Now, (activeAsset.Speed != null) ? activeAsset.Speed.Value.decToInt() : 0);


                            if (assetStatus.Active == true)
                            {
                                activeCount += +1;
                            }
                            if (assetStatus.InActive == true)
                            {
                                inactiveCount += +1;
                            }
                            if (assetStatus.Driving == true)
                            {
                                drivingCount += 1;
                            }
                            if (assetStatus.Parking == true)
                            {
                                parkingCount += 1;
                            }
                            if (assetStatus.Idling == true)
                            {
                                idlingCount += 1;
                            }
                            if (assetStatus.EngineStop == true)
                            {
                                engineStopCount += 1;
                            }
                            if (assetStatus.PowerCut == true)
                            {
                                powerCutCount += 1;
                            }
                            if (assetStatus.SOS == true)
                            {
                                sosCount += 1;
                            }
                        }

                    }


                    StatusCount result = new StatusCount()
                    {
                        ParkingCount = parkingCount,
                        IdlingCount = idlingCount,
                        DrivingCount = drivingCount,
                        OverSpeedingCount = 0,
                        OverIdlingCount = 0,
                        GPSCutCount = 0,
                        PowerCutCount = powerCutCount,
                        EngineStopCount = engineStopCount,
                        ActiveCount = activeCount,
                        InactiveCount = inactiveCount,
                        Sensor1Count = 0,
                        Sensor2Count = 0,
                        BatteryLowCount = 0,
                        SOSCount = sosCount,
                        Total = totalCount
                    };

                    return result;
                }
                else
                {
                    return null;
                }

            }
        }

        //Convert status des to detailed new status
        public static Status TrackStatus(string _Status, DateTime _GPSTime, int _Speed)
        {
            Status _StatusModel = new Status();
            StringBuilder Status = new StringBuilder();
            if (_Status == null)
            {
                _StatusModel.InActive = true;
                Status.Append("Inactive");
                Status.Append(", Not Reporting");
                _StatusModel.Description = Status.ToString();
                return _StatusModel;

            }
            bool Inactive = Math.Abs(DateTime.Now.Subtract(_GPSTime).TotalHours) > 24.0;
            bool Active = Math.Abs(DateTime.Now.Subtract(_GPSTime).TotalHours) < 24.0;
            var ls = _Status.ToLower();
            bool AccOn = ls.Contains("acc on");
            bool AccOff = ls.Contains("acc off");
            bool SOS = ls.Contains("sos");
            bool PowerCut = ls.Contains("battery cut");
            bool GPSCut = ls.Contains("gps cut");
            bool OverIdling = ls.Contains("over idle");
            bool OverSpeed = ls.Contains("over speed");
            bool EngineStop = ls.Contains("engine stop");
            bool Sensor1 = ls.Contains("sensor 1");
            bool Sensor2 = ls.Contains("sensor 2");
            bool BatteryLow = ls.Contains("battery low");


            if (Inactive)
            {
                _StatusModel.InActive = Inactive;
                Status.Append("Inactive");
            }
            else
            {
                _StatusModel.Active = !Inactive;
                Status.Append("Active");
            };

            if (AccOn)
            {
                if (_Speed == 0)
                {
                    _StatusModel.Idling = true;
                    Status.Append(", Idling");

                }
                else if (_Speed > 0)
                {
                    _StatusModel.Driving = true;
                    Status.Append(", Driving");

                }
                else if (OverSpeed)
                {
                    _StatusModel.OverSpeeding = true;
                    Status.Append(", Overspeeding");
                }
                else if (OverIdling)
                {
                    _StatusModel.OverIdling = true;
                    Status.Append(", Over Idling");
                }
            }
            else if (AccOff)
            {
                if (_Speed == 0)
                {
                    _StatusModel.Parking = true;
                    Status.Append(", Parking");
                }
            }

            if (SOS) { _StatusModel.SOS = true; Status.Append(", SOS"); };
            if (PowerCut) { _StatusModel.PowerCut = true; Status.Append(", Power Cut"); };
            if (GPSCut) { _StatusModel.GPSCut = true; Status.Append(", GPS Cut"); };
            if (BatteryLow) { _StatusModel.BatteryLow = true; Status.Append(", Battery Low"); };
            if (EngineStop) { _StatusModel.EngineStop = true; Status.Append(", Engine Stopped"); };
            if (Sensor1) { _StatusModel.Sensor1 = true; Status.Append(", Sensor 1 On"); };
            if (Sensor2) { _StatusModel.Sensor2 = true; Status.Append(", Sensor 2 On"); };

            _StatusModel.Description = Status.ToString();
            return _StatusModel;

        }


        //Get Asset list based on S_SysUserVehicle
        public static List<CustomerMobile> GetAssetListAccountPerStat(this int _AccountID, string _Status, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {

                var AssetIDList = (from s in tfdb.S_SysUserVehicle
                                   where s.UserID == _AccountID
                                   select s.ObjectID).ToList();

                if (AssetIDList.Count() > 0)
                {


                    var assetList = (
                                       from o in tfdb.A_ObjectInfo.ToList()
                                       where AssetIDList.Contains(o.ObjectID)
                                       select new TrackMobile()
                                       {
                                           AssetID = o.ObjectID,
                                           AssetName = o.ObjectRegNum,
                                           CustomerID = o.CustomerID ?? 0

                                       }).ToList().Where(x => (_Status != "total") ? x.Description.Contains(_Status) : x.AssetID == x.AssetID);




                    var customerList = (from c in tfdb.A_CustomerInfo.ToList().AsParallel()
                                        where assetList.Any(x => x.CustomerID == c.CustomerID)
                                        select c).ToList();

                    List<CustomerMobile> CustomerList = new List<CustomerMobile>();
                    foreach (var customer in customerList)
                    {
                        CustomerList.Add(new CustomerMobile()
                        {
                            CustomerID = customer.CustomerID,
                            CustomerName = customer.Customer_Name,
                            AssetListT = assetList.Where(x => x.CustomerID == customer.CustomerID).ToList()
                        });
                    }

                    if (CustomerList.Count() > 0)
                    {
                        return CustomerList;
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

        //Get Asset list based on GroupCode
        public static List<CustomerMobile> GetAssetListGroupcodePerStat(this string _GroupCodes, string _Status, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                if (
                    (_GroupCodes == null) ||
                    (_GroupCodes.Trim().Length == 0))
                {
                    return null;
                }

                List<string> GroupCodesList = _GroupCodes.Split(new char[] { ',' }).ToList();

                if (GroupCodesList.Count() > 0)
                {

                    var assetList = (
       from o in tfdb.A_ObjectInfo.ToList()
       where GroupCodesList.Contains(o.GISGroupID.ToString())
       select new TrackMobile()
       {
           AssetID = o.ObjectID,
           AssetName = o.ObjectRegNum,
                        //Description = TrackStatus(a.StatusDes, a.GPSTime.Value, a.Speed.Value.decToInt()).Description,
                        CustomerID = o.CustomerID ?? 0
       }).ToList().Where(x => (_Status != "total") ? x.Description.ToLower().Contains(_Status) : x.AssetID == x.AssetID);


                    var customerList = (from c in tfdb.A_CustomerInfo.ToList().AsParallel()
                                        where assetList.Any(x => x.CustomerID == c.CustomerID)
                                        select c).ToList();

                    List<CustomerMobile> CustomerList = new List<CustomerMobile>();
                    foreach (var customer in customerList)
                    {
                        CustomerList.Add(new CustomerMobile()
                        {
                            CustomerID = customer.CustomerID,
                            CustomerName = customer.Customer_Name,
                            AssetListT = assetList.Where(x => x.CustomerID == customer.CustomerID).ToList()
                        });
                    }

                    if (CustomerList.Count() > 0)
                    {
                        return CustomerList;
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

        public static Asset UpdateAssetSettings(string _AssetID, Asset _Asset, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var result = (from a in tfdb.A_ObjectInfo
                              where a.ObjectID == _AssetID
                              select a).ToList();

                if (result.Count() > 0)
                {
                    var foundAsset = result.FirstOrDefault();

                    foundAsset.FuelRatio = (decimal?)_Asset.FuelRatio;
                    foundAsset.FuelType = (byte?)_Asset.FuelTypeID;
                    foundAsset.GSMVoiceNum = _Asset.SIMNumber;
                    foundAsset.ObjectType = (byte?)_Asset.TypeID;
                    foundAsset.ObjectRegNum = _Asset.Name;

                    tfdb.SaveChanges();

                    var asset = (from a in result
                                 select new Asset()
                                 {
                                     AssetID = a.ObjectID,
                                     Name = a.ObjectRegNum,
                                     FuelRatio = (float)a.FuelRatio,
                                     FuelTypeID = (byte)a.FuelType,
                                     GroupID = a.GISGroupID,
                                     SIMNumber = a.GSMVoiceNum,
                                     CustomerID = a.CustomerID ?? 0
                                 }).ToList();

                    return asset.FirstOrDefault();
                }
                else { return null; }
            }
        }

        public static Asset UpdateAssetName(string _AssetID, Asset _Asset, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var result = (from a in tfdb.A_ObjectInfo
                              where a.ObjectID == _AssetID
                              select a).ToList();

                if (result.Count() > 0)
                {
                    var foundAsset = result.FirstOrDefault();

                    //foundAsset.FuelRatio = (decimal?)_Asset.FuelRatio;
                    //foundAsset.FuelType = (byte?)_Asset.FuelTypeID;
                    //foundAsset.GSMVoiceNum = _Asset.SIMNumber;
                    //foundAsset.ObjectType = (byte?)_Asset.TypeID;
                    foundAsset.ObjectRegNum = _Asset.Name;

                    tfdb.SaveChanges();

                    var asset = (from a in result
                                 select new Asset()
                                 {
                                     AssetID = a.ObjectID,
                                     Name = a.ObjectRegNum,
                                     FuelRatio = (float)a.FuelRatio,
                                     FuelTypeID = (byte)a.FuelType,
                                     GroupID = a.GISGroupID,
                                     SIMNumber = a.GSMVoiceNum,
                                     CustomerID = a.CustomerID ?? 0
                                 }).ToList();

                    return asset.FirstOrDefault();
                }
                else { return null; }
            }
        }




        //update 7/7
        public static List<TrackMobile> GetAssetTrackList(List<String> _AssetIDList, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var tl = (from a in tfdb.A_ActiveTracks.ToList()
                          where _AssetIDList.Contains(a.ObjectID)
                          select new TrackMobile()
                          {
                              AssetID = a.ObjectID,
                              AssetName = a.ObjectRegNum,
                              GPSTime = (a.GPSTime != null) ? a.GPSTime.Value : DateTime.Now,
                              Latitude = (a.Lat != null) ? a.Lat.Value.decToDbl() : 0.0,
                              Longitude = (a.Lon != null) ? a.Lon.Value.decToDbl() : 0.0,
                              Speed = (a.Speed != null) ? a.Speed.Value.decToInt() : 0,
                              Description = TrackStatus(a.StatusDes, (a.GPSTime != null) ? a.GPSTime.Value : DateTime.Now, (a.Speed != null) ? a.Speed.Value.decToInt() : 0).Description

                          }).ToList();

                List<TrackMobile> trackList = new List<TrackMobile>();
                trackList.AddRange(tl);

                return trackList;
            }
        }


    }

}