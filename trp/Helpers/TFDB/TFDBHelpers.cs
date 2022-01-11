using Philgps_WebAPI.DAL;
using Philgps_WebAPI.Models;
using Philgps_WebAPI.Models.Track;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Configuration;
using System.IO;
using System.Drawing;
using System.Web.Hosting;
using Philgps_WebAPI.Helpers.MAPDB;
using Philgps_WebAPI.Extensions;
using Philgps_WebAPI.Controllers.Track;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace Philgps_WebAPI.Helpers.TFDB
{
    public static class TFDBHelpers
    {

        public static string PhotosDirectory = ConfigurationManager.AppSettings["PhotosDirectory"];
        public static string PhotosURL = ConfigurationManager.AppSettings["PhotosURL"];

        //password encryption
        public class StringCipher
        {
            private const string key = "adminphilgps2014";
            public static string Encrypt(string input)
            {
                byte[] inputArray = UTF8Encoding.UTF8.GetBytes(input);
                TripleDESCryptoServiceProvider tripleDES = new TripleDESCryptoServiceProvider();
                tripleDES.Key = UTF8Encoding.UTF8.GetBytes(key);
                tripleDES.Mode = CipherMode.ECB;
                tripleDES.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tripleDES.CreateEncryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(inputArray, 0, inputArray.Length);
                tripleDES.Clear();
                return Convert.ToBase64String(resultArray, 0, resultArray.Length);
            }

        }

        #region asset
        //Get Asset list based on PGPS_SystemUser
        public static List<CustomerTrack> GetAssetListSystemUser(this int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {

                var assetList = (from a in tfdb.sp_PGPS_get_summary_info_sysuser(_AccountID)
                                 select a).ToList();

                var customerList = assetList.Select(c => new CustomerTrack()
                {
                    CustomerID = c.CustomerID ?? 0,
                    CustomerName = c.CustomerName,
                    CustomerEmail = c.CustomerEmail
                }).DistinctBy(b => b.CustomerID).ToList();

                customerList.ForEach(b => b.AssetList.AddRange(
                    assetList.Where(d => d.CustomerID == b.CustomerID).Select(c => new Track()
                    {
                        AssetID = c.AssetID,
                        CustomerID = c.CustomerID ?? 0,
                        Name = c.Name,
                        TypeID = c.TypeID ?? 0,
                        TypeName = c.TypeName,
                        Temperature1 = (int)c.Temperature1,
                        Temperature2 = (int)c.Temperature2,
                        CurrentDriver = c.Driver == null ? "--" : c.Driver,
                        CustomerName = c.CustomerName,
                        DirectionCardinal = c.Direction.Value.shrtToInt().degreesToCardinal(),
                        DirectionDegrees = c.Direction.ToString(),
                        Fuel = c.FuelRatio,
                        GPSTime = c.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                        Status = new Status()
                        {
                            Active = ((DateTime.Now - c.GPSTime.Value).TotalHours <= 24),
                            BatteryLow = c.BatteryLow == 1,
                            Description = c.Status,
                            Driving = c.Drive == 1,
                            EngineStop = c.EngineStop == 1,
                            GPSCut = c.GPSCut == 1,
                            Idling = c.Idle == 1,
                            InActive = ((DateTime.Now - c.GPSTime.Value).TotalHours > 24),
                            Parking = c.Park == 1,
                            Sensor1 = c.Sensor1 == 1,
                            Sensor2 = c.Sensor2 == 1,
                            SOS = c.SOS == 1,
                            StatusDes = c.StatusDes,
                            OverIdling = c.OverIdle == 1,
                            OverSpeeding = c.OverSpeed == 1,
                            PowerCut = c.BatteryCut == 1,
                            Mobile = c.Mobile == 1,
                        },
                        Speed = c.Speed,
                        Location = c.Location,
                        MobilePhoneNo = c.SIMNumber,
                        SIMNumber = c.SIMNumber,
                        Longitude = (double)c.Longitude,
                        Latitude = (double)c.Latitude,
                        Odometer = c.Odometer,
                        Registration = c.RegistrationExpiry,
                        Service = c.ServiceExpiry,
                        Insurance = c.InsuranceExpiry,
                        DeliveryCount = c.DeliveryCount ?? 0,
                        SendEmail = c.SendEmail,
                        Schedule = c.Schedule,
                        IsBan = c.IsBan ?? true,
                        ServiceOdo = c.ServiceOdo
                    }).ToList()
                    ));



                if (customerList.Count() > 0)
                {
                    return customerList.OrderBy(x => x.CustomerName).ToList();
                }
                else
                {
                    return null;
                }
            }
        }

        //Get Asset list only
        public static List<CustomerListTrack> GetAssetList(int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var assetList = tfdb.sp_PGPS_get_asset_list(_AccountID).ToList();

                var customerList = assetList.Select(c => new CustomerListTrack()
                {
                    CustomerID = c.CustomerID ?? 0,
                    CustomerName = c.CustomerName,
                    CustomerEmail = c.CustomerEmail
                }).DistinctBy(b => b.CustomerID).ToList();

                customerList.ForEach(b => b.AssetList.AddRange(
                    assetList.Where(d => d.CustomerID == b.CustomerID).Select(c => new TrackList()
                    {
                        AssetID = c.AssetID,
                        CustomerID = c.CustomerID ?? 0,
                        Name = c.Name,
                        CustomerName = c.CustomerName,
                        TypeID = c.TypeID ?? 0,
                        TypeName = c.TypeName,
                        Latitude = (double)c.Latitude,
                        Longitude = (double)c.Longitude,
                        Status = c.Status
                    }).ToList()
                    ));



                if (customerList.Count() > 0)
                {
                    return customerList.OrderBy(x => x.CustomerName).ToList();
                }
                else
                {
                    return null;
                }
            }
        }


        //Update Asset Map Location
        public static List<TrackMap> GetAssetListMap(int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                


                var assetList = (from c in tfdb.sp_PGPS_get_asset_map_new(_AccountID).ToList()
                                 select new TrackMap()
                                 {
                                     AssetID = c.AssetID,
                                     Name = c.Name,
                                     TypeID = c.TypeID ?? 0,
                                     TypeName = c.TypeName,
                                     DirectionCardinal = c.Direction.ToString().strToInt().degreesToCardinal(),
                                     DirectionDegrees = c.Direction.ToString(),
                                     GPSTime = c.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                     Status = c.Status,
                                     Speed = c.Speed,
                                     Longitude = (double)c.Longitude,
                                     Latitude = (double)c.Latitude,
                                     DeliveryNumber = c.DeliveryNumber
                                 }).ToList();

                return assetList;
            }
        }


        //Get Asset List filter by Status
        public static List<TrackFilterList> GetAssetListFilterStatus(string _Status, int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var result = (from c in tfdb.sp_PGPS_get_asset_filter_list(_AccountID, _Status).ToList()
                              select new TrackFilterList()
                              {
                                  AssetID = c.AssetID,
                                  Name = c.Name,
                                  Fuel = c.Fuel,
                                  Temperature1 = (int)c.Temperature1,
                                  Temperature2 = (int)c.Temperature2,
                                  Sensor1 = c.Sensor1 == 1 ? true : false,
                                  Sensor2 = c.Sensor2 == 1 ? true : false,
                                  DirectionCardinal = c.Direction.ToString().strToInt().degreesToCardinal(),
                                  DirectionDegrees = c.Direction.ToString(),
                                  GPSTime = c.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                  Status = c.Status,
                                  Speed = c.Speed,
                                  Location = c.Location,
                                  //Location = (c.Location == null || c.Location == "") ? MAPDBHelpers.ReverseGeocode((double)c.Latitude, (double)c.Longitude) : c.Location,
                                  Longitude = (double)c.Longitude,
                                  Latitude = (double)c.Latitude,
                              }).ToList();

                return result;

            }
        }


        //Export Asset List filter by Status
        public static List<TrackFilterList> GetAssetListFilterStatusExport(string _Status, int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var result = (from c in tfdb.sp_PGPS_get_asset_filter_list(_AccountID, _Status).ToList()
                              select new TrackFilterList()
                              {
                                  AssetID = c.AssetID,
                                  Name = c.Name,
                                  Fuel = c.Fuel,
                                  Temperature1 = (int)c.Temperature1,
                                  Temperature2 = (int)c.Temperature2,
                                  Sensor1 = c.Sensor1 == 1 ? true : false,
                                  Sensor2 = c.Sensor2 == 1 ? true : false,
                                  DirectionCardinal = c.Direction.ToString().strToInt().degreesToCardinal(),
                                  DirectionDegrees = c.Direction.ToString(),
                                  GPSTime = c.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                  Status = c.Status,
                                  Speed = c.Speed,
                                  Location = (c.Location == null || c.Location == "") ? MAPDBHelpers.ReverseGeocode((double)c.Latitude, (double)c.Longitude) : c.Location,
                                  Longitude = (double)c.Longitude,
                                  Latitude = (double)c.Latitude,
                              }).ToList();

                return result;

            }
        }

        //Get Asset List filter by Asset type
        public static List<TrackTypeFilterList> GetAssetTypeFilter(string _Type, int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var result = (from c in tfdb.sp_PGPS_get_asset_type_list(_AccountID, _Type).ToList()
                              select new TrackTypeFilterList()
                              {
                                  AssetID = c.AssetID,
                                  Name = c.Name,
                                  Fuel = c.Fuel,
                                  Temperature1 = (int)c.Temperature1,
                                  Temperature2 = (int)c.Temperature2,
                                  Sensor1 = c.Sensor1 == 1 ? true : false,
                                  Sensor2 = c.Sensor2 == 1 ? true : false,
                                  DirectionCardinal = c.Direction.ToString().strToInt().degreesToCardinal(),
                                  DirectionDegrees = c.Direction.ToString(),
                                  GPSTime = c.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                  Status = c.Status,
                                  Speed = c.Speed,
                                  Location = c.Location,
                                  Longitude = (double)c.Longitude,
                                  Latitude = (double)c.Latitude,
                              }).ToList();

                return result;

            }
        }

        //Get Asset List Count
        public static List<TrackCount> GetAssetListCount(int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var result = (from i in tfdb.sp_PGPS_get_asset_count_list(_AccountID).ToList()
                              select new TrackCount()
                              {
                                  Total = i.Total ?? 0,
                                  Active = i.Active ?? 0,
                                  InActive = i.InActive ?? 0,
                                  Driving = i.Driving ?? 0,
                                  Idling = i.Idling ?? 0,
                                  Parking = i.Parking ?? 0,
                                  OverSpeed = i.OverSpeed ?? 0,
                                  OverIdle = i.OverIdle ?? 0,
                                  OverPark = i.OverPark ?? 0,
                                  SOS = i.SOS ?? 0,
                                  PowerCut = i.PowerCut ?? 0
                              }).ToList();
                return result;

            }
        }


        //Get Customer list based on Groupcode
        public static List<CustomerTrack> GetSummaryListGroupcodeA(this string _GroupCodes, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {

                var assetList = (from a in tfdb.sp_PGPS_get_summary_info_group(_GroupCodes)
                                 select a).ToList();


                var customerList = assetList.Select(c => new CustomerTrack()
                {
                    CustomerID = c.CustomerID ?? 0,
                    CustomerName = c.CustomerName,
                    CustomerEmail = c.CustomerEmail
                }).DistinctBy(b => b.CustomerID).ToList();

                customerList.ForEach(b => b.AssetList.AddRange(
                    assetList.Where(d => d.CustomerID == b.CustomerID).Select(c => new Track()
                    {
                        AssetID = c.AssetID,
                        CustomerID = c.CustomerID ?? 0,
                        Name = c.Name,
                        TypeID = c.TypeID ?? 0,
                        TypeName = c.TypeName,
                        Temperature1 = (int)c.Temperature1,
                        Temperature2 = (int)c.Temperature2,
                        CurrentDriver = c.Driver == null ? "--" : c.Driver,
                        CustomerName = c.CustomerName,
                        DirectionCardinal = c.Direction.Value.degreesToCardinal(),
                        DirectionDegrees = c.Direction.ToString(),
                        Fuel = (int)c.FuelRatio,
                        GPSTime = c.GPSTime.Value.ToString("yyyy-MM-dd HH:mm:ss"),
                        Status = new Status()
                        {
                            Active = ((DateTime.Now - c.GPSTime.Value).TotalHours <= 24),
                            BatteryLow = c.BatteryLow == 1,
                            Description = c.Status,
                            Driving = c.Drive == 1,
                            EngineStop = c.EngineStop == 1,
                            GPSCut = c.GPSCut == 1,
                            Idling = c.Idle == 1,
                            InActive = ((DateTime.Now - c.GPSTime.Value).TotalHours > 24),
                            Parking = c.Park == 1,
                            Sensor1 = c.Sensor1 == 1,
                            Sensor2 = c.Sensor2 == 1,
                            SOS = c.SOS == 1,
                            StatusDes = c.StatusDes,
                            OverIdling = c.OverIdle == 1,
                            OverSpeeding = c.OverSpeed == 1,
                            PowerCut = c.BatteryCut == 1
                        },
                        Speed = c.Speed,
                        Location = c.Location,
                        MobilePhoneNo = c.SIMNumber,
                        SIMNumber = c.SIMNumber,
                        Longitude = (double)c.Longitude,
                        Latitude = (double)c.Latitude,
                        Odometer = c.Odometer,
                        Registration = c.RegistrationExpiry,
                        Service = c.ServiceExpiry,
                        Insurance = c.InsuranceExpiry,
                        DeliveryCount = c.DeliveryCount ?? 0,
                        SendEmail = c.SendEmail
                    }).ToList()
                    ));



                if (customerList.Count() > 0)
                {
                    return customerList.OrderByDescending(x => x.CustomerName).ToList();
                }
                else
                {
                    return null;
                }

            }
        }


        public static List<Customer> GetCustomerListGroupcode(this string _GroupCodes, string _WebConfigurationName)
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
                    var assetList = (from a in tfdb.A_ObjectInfo.ToList()
                                     where GroupCodesList.Contains(a.GISGroupID.ToString())
                                     select a).ToList();

                    var customerList = (from c in tfdb.A_CustomerInfo.ToList()
                                        where assetList.Any(x => x.CustomerID == c.CustomerID)
                                        select c).ToList();

                    List<Customer> CustomerList = new List<Customer>();
                    foreach (var customer in customerList)
                    {
                        CustomerList.Add(new Customer()
                        {
                            CustomerID = customer.CustomerID,
                            CustomerName = customer.Customer_Name,
                            CustomerEmail = customer.Contacter_email,
                        });
                    }

                    if (CustomerList.Count() > 0)
                    {
                        return CustomerList.OrderByDescending(x => x.CustomerName).ToList();
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
        public static List<Customer> GetAssetListGroupcode(this string _GroupCodes, string _WebConfigurationName)
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
                    var assetList = (from a in tfdb.A_ObjectInfo.ToList()
                                     where GroupCodesList.Contains(a.GISGroupID.ToString())
                                     select new Asset()
                                     {
                                         AssetID = a.ObjectID,
                                         Name = a.ObjectRegNum,
                                         TypeName = GetAssetType(a.ObjectType.HasValue == true ? (int)a.ObjectType.Value : 1, _WebConfigurationName),
                                         SIMNumber = a.GSMVoiceNum,
                                         CustomerID = a.CustomerID ?? 0,

                                     }).ToList();

                    var customerList = (from c in tfdb.A_CustomerInfo.ToList()
                                        where assetList.Any(x => x.CustomerID == c.CustomerID)
                                        select c).ToList();

                    List<Customer> CustomerList = new List<Customer>();
                    foreach (var customer in customerList)
                    {
                        CustomerList.Add(new Customer()
                        {
                            CustomerID = customer.CustomerID,
                            CustomerName = customer.Customer_Name,
                            CustomerEmail = customer.Contacter_email,
                            AssetList = assetList.Where(x => x.CustomerID == customer.CustomerID).ToList(),
                        });
                    }

                    if (CustomerList.Count() > 0)
                    {
                        return CustomerList.OrderByDescending(x => x.CustomerName).ToList();
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


        //Get Asset Info
        public static TrackDetails GetAssetGPSInfo(string _AssetID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {

                var assetinfo = tfdb.sp_PGPS_get_asset_information(_AssetID).ToList();

                if (assetinfo != null)
                {
                    var result = assetinfo;

                    if (result.Count() > 0)
                    {
                        var c = result.FirstOrDefault();

                        TrackDetails track = new TrackDetails()
                        {
                            AssetID = c.AssetID,
                            CustomerID = c.CustomerID ?? 0,
                            Name = c.Name,
                            Temperature1 = (int)c.Temperature1,
                            Temperature2 = (int)c.Temperature2,
                            CustomerName = c.CustomerName,
                            DirectionCardinal = c.DirectionDegrees.Value.degreesToCardinal(),
                            DirectionDegrees = c.DirectionDegrees.ToString(),
                            Fuel = c.Fuel,
                            GPSTime = c.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                            Status = c.Status,
                            Status1 = c.Status1,
                            AlertStatus = c.AlertStatus,
                            Speed = c.Speed,
                            Location = MAPDBHelpers.ReverseGeocode((double)c.Latitude, (double)c.Longitude),
                            SIMNumber = c.SIMNumber,
                            Longitude = (double)c.Longitude,
                            Latitude = (double)c.Latitude,
                            Odometer = c.Odometer,
                            Sensor1 = c.Sensor1 == 1 ? true : false,
                            Sensor2 = c.Sensor2 == 1 ? true : false,
                            PowerCut = c.PowerCut == 1 ? true : false,
                            SOS = c.SOS == 1 ? true : false,
                            Ignition = c.Ignition == 1 ? true : false,
                            Schedule = c.Schedule,
                            DeliveryNumber = c.DeliveryNumber
                        };


                        return track;
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

        //Get Track my asset info by assetid
        public static TrackMyAssetDetails GetTrackMyAssetGPSInfo(string _AssetID, string _Username, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var res = (from c in tfdb.sp_PGPS_track_asset_by_assetid(_AssetID, _Username).ToList()
                           select new TrackMyAssetDetails()
                           {
                               AssetID = c.AssetID,
                               CustomerID = c.CustomerID ?? 0,
                               Name = c.Name,
                               Temperature1 = (int)c.Temperature1,
                               Temperature2 = (int)c.Temperature2,
                               CustomerName = c.CustomerName,
                               DirectionCardinal = c.DirectionDegrees.Value.degreesToCardinal(),
                               DirectionDegrees = c.DirectionDegrees.ToString(),
                               Fuel = c.Fuel,
                               GPSTime = c.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                               Status = c.Status,
                               Status1 = c.Status1,
                               AlertStatus = c.AlertStatus,
                               Speed = c.Speed,
                               //Location = MAPDBHelpers.ReverseGeocodeGoogle((double)c.Latitude, (double)c.Longitude),
                               Location = MAPDBHelpers.ReverseGeocode((double)c.Latitude, (double)c.Longitude),
                               SIMNumber = c.SIMNumber,
                               Longitude = (double)c.Longitude,
                               Latitude = (double)c.Latitude,
                               Odometer = c.Odometer,
                               Sensor1 = c.Sensor1 == 1 ? true : false,
                               Sensor2 = c.Sensor2 == 1 ? true : false,
                               PowerCut = c.PowerCut == 1 ? true : false,
                               SOS = c.SOS == 1 ? true : false,
                               Ignition = c.Ignition == 1 ? true : false,
                               TypeName = c.TypeName
                           });
                if (res.Count() > 0)
                {
                    return res.FirstOrDefault();
                }
                else
                {
                    return null;
                }

            }
        }

        //Get Track my asset info by assetname
        public static TrackMyAssetDetails GetTrackMyAssetGPSInfoByAssetName(string _AssetName, string _UserName, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var assetname = _AssetName.Replace("%20", " ");

                var res = (from c in tfdb.sp_PGPS_track_asset_by_assetname(assetname, _UserName).ToList()
                           select new TrackMyAssetDetails()
                           {
                               AssetID = c.AssetID,
                               CustomerID = c.CustomerID ?? 0,
                               Name = c.Name,
                               Temperature1 = (int)c.Temperature1,
                               Temperature2 = (int)c.Temperature2,
                               CustomerName = c.CustomerName,
                               DirectionCardinal = c.DirectionDegrees.Value.degreesToCardinal(),
                               DirectionDegrees = c.DirectionDegrees.ToString(),
                               Fuel = c.Fuel,
                               GPSTime = c.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                               Status = c.Status,
                               Status1 = c.Status1,
                               AlertStatus = c.AlertStatus,
                               Speed = c.Speed,
                               //Location = MAPDBHelpers.ReverseGeocodeGoogle((double)c.Latitude, (double)c.Longitude),
                               Location = MAPDBHelpers.ReverseGeocode((double)c.Latitude, (double)c.Longitude),
                               SIMNumber = c.SIMNumber,
                               Longitude = (double)c.Longitude,
                               Latitude = (double)c.Latitude,
                               Odometer = c.Odometer,
                               Sensor1 = c.Sensor1 == 1 ? true : false,
                               Sensor2 = c.Sensor2 == 1 ? true : false,
                               PowerCut = c.PowerCut == 1 ? true : false,
                               SOS = c.SOS == 1 ? true : false,
                               Ignition = c.Ignition == 1 ? true : false,
                               TypeName = c.TypeName
                           });
                if (res.Count() > 0)
                {
                    return res.FirstOrDefault();
                } else
                {
                    return null;
                }


            }
        }

        public static TrackDriver GetAssetInfoDriver(string _AssetID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {

                var driver = new TrackDriver();

                StringBuilder dlsb = new StringBuilder();

                var ccd = tfdb.sp_PGPS_TRP_GetCurrentActiveDriver(_AssetID).ToList();

                for (int i = 0; i < ccd.Count(); i++)
                {
                    if (i != 0)
                    {
                        dlsb.Append(", ");
                    }

                    if (ccd[i].isAssigned == 0)
                    {
                        dlsb.Append(ccd[i].DriverName + "");
                        driver.isDriverAllowed = false;
                    }
                    else
                    {
                        driver.isDriverAllowed = true;
                        dlsb.Append(ccd[i].DriverName + "");
                    }

                }

                var checkIfHasAssign = tfdb.PGPS_ObjectDriver.Where(x => x.ObjectId == _AssetID && x.ActivePair == true).ToList();

                if (ccd.Count() > 0)
                {

                    if (checkIfHasAssign.Count() > 0)
                    {
                        if (checkIfHasAssign.FirstOrDefault().DriverId == ccd.FirstOrDefault().DriverId)
                        {
                            driver.BoardTime = ccd.FirstOrDefault().EventDateTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz");
                            driver.LicenseNo = ccd.FirstOrDefault().LicenseNo;
                            driver.LicenseType = ccd.FirstOrDefault().LicenseType;
                            driver.MobilePhoneNo = ccd.FirstOrDefault().MobilePhoneNo;
                            driver.CurrentDriver = dlsb.ToString() == "" ? "No Driver" : dlsb.ToString();
                            driver.TagDriver = dlsb.ToString() == "" ? "No Driver" : ccd.FirstOrDefault().Code;
                            driver.DriverSchedule = ccd.FirstOrDefault().Schedule;
                            driver.isDriverAvailable = ccd.FirstOrDefault().IsAvailable == 1 ? true : false;
                            driver.isDriverAllowed = true;
                        }
                        else
                        {
                            var driverid = checkIfHasAssign.FirstOrDefault().DriverId;
                            var Driver = tfdb.PGPS_Driver.Where(x => x.DriverID == driverid).FirstOrDefault();

                            driver.CurrentDriver = Driver.Name;
                            driver.BoardTime = DateTime.Now.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz");
                            driver.LicenseNo = Driver.LicenseNo;
                            driver.LicenseType = Driver.LicenseType;
                            driver.MobilePhoneNo = Driver.MobilePhoneNo;
                            //track.TagDriver = driver.PGPS_Tag.FirstOrDefault().Code;
                            driver.isDriverAllowed = false;
                        }

                    }
                    else
                    {
                        driver.BoardTime = ccd.FirstOrDefault().EventDateTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz");
                        driver.LicenseNo = ccd.FirstOrDefault().LicenseNo;
                        driver.LicenseType = ccd.FirstOrDefault().LicenseType;
                        driver.MobilePhoneNo = ccd.FirstOrDefault().MobilePhoneNo;
                        driver.CurrentDriver = dlsb.ToString() == "" ? "No Driver" : dlsb.ToString();
                        driver.TagDriver = dlsb.ToString() == "" ? "No Driver" : ccd.FirstOrDefault().Code;
                        driver.DriverSchedule = ccd.FirstOrDefault().Schedule;
                        driver.isDriverAvailable = ccd.FirstOrDefault().IsAvailable == 1 ? true : false;
                        driver.isDriverAllowed = true;
                    }

                }
                else
                {
                    driver.CurrentDriver = dlsb.ToString() == "" ? "No Driver" : dlsb.ToString();
                    if (checkIfHasAssign.Count() > 0)
                    {
                        var driverid = checkIfHasAssign.FirstOrDefault().DriverId;
                        var Driver = tfdb.PGPS_Driver.Where(x => x.DriverID == driverid).FirstOrDefault();

                        driver.CurrentDriver = Driver.Name;
                        driver.BoardTime = DateTime.Now.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz");
                        driver.LicenseNo = Driver.LicenseNo;
                        driver.LicenseType = Driver.LicenseType;
                        driver.MobilePhoneNo = Driver.MobilePhoneNo;
                        //track.TagDriver = driver.PGPS_Tag.FirstOrDefault().Code;
                        driver.isDriverAllowed = true;
                    }
                }

                return driver;
            }
        }

        public static TrackSettings GetAssetSettings(string _AssetID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {

                var result = tfdb.sp_PGPS_get_asset_settings(_AssetID).ToList();

                if (result.Count() > 0)
                {
                    var i = result.FirstOrDefault();

                    TrackSettings settings = new TrackSettings()
                    {
                        AssetID = i.AssetID,
                        SIMNumber = i.SIMNumber,
                        Name = i.Name,
                        TypeID = i.TypeID ?? 0,
                        TypeName = i.TypeName,
                        FuelRatio = i.FuelRatio,
                        FuelTypeID = i.FuelTypeID ?? 0,
                        ObjectOdometer = i.ObjectOdometer ?? 0,
                        Registration = i.RegistrationExpiry,
                        Insurance = i.InsuranceExpiry,
                        Permit = i.PermitExpiry,
                        Service = i.ServiceExpiry,
                        ServiceOdo = i.ServiceOdo,
                        Schedule = i.Schedule,
                        IsBan = i.IsBan ?? false,
                        VehicleModel = i.VehicleModel,
                        VehicleBrand = i.VehicleBrand
                    };

                    return settings;

                }
                else
                {
                    return null;
                }



            }
        }

        //Get Asset Pop-up info
        public static TrackPopupWindow GetAssetPopupInfo(string _AssetID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                //var result = (from i in tfdb.sp_PGPS_get_asset_popup_information1(_AssetID)
                var result = (from i in tfdb.sp_PGPS_get_asset_popup_information(_AssetID)
                              select new TrackPopupWindow()
                              {
                                  AssetID = i.AssetID,
                                  Name = i.Name,
                                  GPSTime = i.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                  Status = i.Status,
                                  Speed = i.Speed,
                                  DirectionCardinal = i.Direction.Value.degreesToCardinal(),
                                  DirectionDegrees = i.Direction.ToString(),
                                  Driver = i.Driver ?? "No Driver",
                                  //Delivery = i.DeliveryCount ?? 0
                                  Delivery = i.DeliveryNumber
                              }).ToList();

                if (result.Count() > 0)
                {
                    return result.FirstOrDefault();
                }
                else
                    return null;

            }
        }


        public static List<DeliveryDetails> GetAssetDeliveries(string _AssetID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var deliveryList = (from n in tfdb.PGPS_ObjectDelivery.ToList()
                                    where n.object_id == _AssetID
                                    && n.end_datetime == null
                                    && (n.cancelled != true)
                                    && n.enabled == true
                                    select new DeliveryDetails()
                                    {
                                        orderNumber = n.order_number,
                                        oldDeliveryNumber = n.delivery_number,
                                        end_datetime = (n.end_datetime == null) ? null : n.end_datetime.Value.ToString("yyyy-MM-dd HH:mm"),
                                        start_datetime = (n.start_datetime == null) ? null : n.start_datetime.Value.ToString("yyyy-MM-dd HH:mm"),
                                        assetID = n.object_id,
                                        started = (n.start_datetime == null) ? false : true
                                    }).ToList();
                return deliveryList;
            }
        }

        public static int GetAssetDeliveryCount(string _AssetID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var deliverycount = tfdb.PGPS_ObjectDelivery.ToList().Where(x => x.object_id == _AssetID && x.end_datetime == null && x.enabled == true && x.cancelled != true).Count();


                return deliverycount;
            }
        }


        //Get Asset Notifications
        public static List<TrackViolation> GetAssetViolation(int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var result = (from i in tfdb.sp_PGPS_get_asset_alert_notif_list(_AccountID).ToList()
                              .Where(x=> x.OverIdle == 1 || x.OverSpeed == 1 || x.OverPark == 1 || x.NoZone == 1 || x.OutOfZone ==1 || x.SOS == 1 || x.Sensor1 == 1 || x.Sensor2 == 1 || x.PowerCut == 1 || x.HarshBraking == 1 || x.HarshAcceleration == 1 || x.TemperatureUp == 1 || x.TemperatureDown == 1).ToList()
                              select new TrackViolation()
                              {
                                  AssetID = i.AssetID,
                                  Name = i.Name,
                                  GPSTime = i.GPSTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                  Latitude = i.Latitude,
                                  Longitude = i.Longitude,
                                  OverIdle = i.OverIdle == 1 ? true : false,
                                  OverSpeed = i.OverSpeed == 1 ? true : false,
                                  OverPark = i.OverPark == 1 ? true : false,
                                  NoZone = i.NoZone == 1 ? true : false,
                                  OutOfZone = i.OutOfZone == 1 ? true : false,
                                  Sensor1 = i.Sensor1 == 1 ? true : false,
                                  Sensor2 = i.Sensor2 == 1 ? true : false,
                                  SOS = i.SOS == 1 ? true : false,
                                  PowerCut = i.PowerCut == 1 ? true : false,
                                  HarshBraking = i.HarshBraking == 1 ? true : false,
                                  HarshAcceleration = i.HarshAcceleration == 1 ? true : false,
                                  TemperatureUp = i.TemperatureUp == 1 ? true : false,
                                  TemperatureDown = i.TemperatureDown == 1 ? true : false
                              }).ToList();

                return result.ToList().DistinctBy(x=> x.AssetID).ToList();
            }

        }

        public static IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }


        //Get Asset GPS History
        public static List<TrackHistory> GetAssetGPSHistory(string _AssetID, DateTime _Start, DateTime _End, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                if (
                    (_AssetID == null) ||
                    (_AssetID.Trim().Length == 0))
                {
                    return null;
                }

                if (_End > DateTime.Now)
                {
                    _End = DateTime.Now;
                }

                List<TrackHistory> trackHistoryList = new List<TrackHistory>();

                foreach (DateTime day in EachDay(_Start, _End))
                {
                    string trackTableName = "STAGE_" + day.ToString("yyyyMMdd");
                    string startDT = "";
                    string endDT = "";


                    startDT = _Start.ToString();
                    endDT = _End.ToString();

                    var result = tfdb.sp_PGPS_history_summary(_AssetID, trackTableName, DateTime.Parse(startDT), DateTime.Parse(endDT).AddSeconds(59)).ToList();

                    var tHistory = (from x in result
                                    select new TrackHistory()
                                    {
                                        AssetID = x.AssetID,
                                        DirectionCardinal = x.Direction.Value.degreesToCardinal(),
                                        DirectionDegrees = x.Direction.Value.ToString(),
                                        //GPSTime = x.Status.Contains("Drive") == true ? x.StartDateTime.Value.ToString("yyyy-MM-dd HH:mm:ss") : x.StartDateTime.Value.ToString("yyyy-MM-dd HH:mm:ss") + " to " + x.EndDateTime.Value.ToString("yyyy-MM-dd HH:mm:ss"),
                                        GPSTimeStart = x.StartDateTime.Value.ToString("yyyy-MM-dd HH:mm:ss"),
                                        GPSTimeEnd = x.Status == "Drive" ? x.StartDateTime.Value.ToString("yyyy-MM-dd HH:mm:ss") : x.EndDateTime.Value.ToString("yyyy-MM-dd HH:mm:ss"),
                                        Latitude = x.Latitude.Value,
                                        Location = x.Location,//== "---" ? MAPDBHelpers.ReverseGeocodeGoogle(x.Latitude.Value, x.Longitude.Value) : x.Location,
                                        Longitude = x.Longitude.Value,
                                        Speed = x.Speed.Value.dblToInt(),
                                        Status = TrackStatusHistory(x.StatusDes, x.StartDateTime.Value, x.Speed.Value.dblToInt()).Description,
                                        TimeZone = DateTime.Now.ToString("\"GMT\"zzz"),
                                        TrackID = x.TrackID ?? 0,
                                        Fuel = x.Fuel.Value == 0 ? x.Fuel.Value : 0
                                    });
                    trackHistoryList.AddRange(tHistory);

                }

                return trackHistoryList.OrderBy(x => x.GPSTime).ToList();
            }
        }

        //Get Asset GPS History Row
        public static List<TrackHistory> GetAssetGPSHistoryRow(string _AssetID, DateTime _Start, DateTime _End, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                tfdb.Database.CommandTimeout = 3 * 60;

                if (
                    (_AssetID == null) ||
                    (_AssetID.Trim().Length == 0))
                {
                    return null;
                }

                List<TrackHistory> trackHistoryList = new List<TrackHistory>();

                foreach (DateTime day in EachDay(_Start, _End))
                {
                    string trackTableName = "STAGE_" + day.ToString("yyyyMMdd");
                    string startDT = "";
                    string endDT = "";
                    if (day.ToString("yyyyMMdd") == _Start.ToString("yyyyMMdd"))
                    {
                        startDT = _Start.ToString();
                    }
                    else
                    {
                        startDT = new DateTime(day.Year, day.Month, day.Day, 00, 00, 01).ToString();
                    }
                    if (day.ToString("yyyyMMdd") == _End.ToString("yyyyMMdd"))
                    {
                        endDT = _End.ToString();
                    }
                    else
                    {
                        endDT = new DateTime(day.Year, day.Month, day.Day, 23, 59, 59).ToString();
                    }

                    var result = tfdb.sp_PGPS_history_summary(_AssetID, trackTableName, DateTime.Parse(startDT), DateTime.Parse(endDT)).ToList().AsParallel();

                    if (result.Count() > 0)
                    {
                        var t = result.FirstOrDefault();
                        var tHistory = (from x in result
                                        select new TrackHistory()
                                        {
                                            AssetID = x.AssetID,
                                            DirectionCardinal = x.Direction.Value.degreesToCardinal(),
                                            DirectionDegrees = x.Direction.Value.ToString(),
                                            GPSTime = (x.StartDateTime != null) ? x.StartDateTime.Value.ToString("yyyy-MM-dd HH:mm:ss") : DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                                            Latitude = x.Latitude.Value,
                                            //Location = x.Location == "" || x.Location == null ? MAPDBHelpers.ReverseGeocodeGoogle(x.Latitude.Value, x.Longitude.Value) : x.Location,
                                            Location = x.Location == "" || x.Location == null ? MAPDBHelpers.ReverseGeocode(x.Latitude.Value, x.Longitude.Value) : x.Location,
                                            Longitude = x.Longitude.Value,
                                            Speed = x.Speed.Value.dblToInt(),
                                            TrackID = x.TrackID.Value,
                                            Odometer = x.Odometer.HasValue ? x.Odometer.Value : 0,
                                            Status = TrackStatusHistory(x.StatusDes, x.StartDateTime.Value, x.Speed.Value.dblToInt()).Description,
                                            Fuel = x.Fuel.Value == 0 ? x.Fuel.Value : 0
                                        });

                        trackHistoryList.AddRange(tHistory);
                    }
                }

                return trackHistoryList.OrderBy(x => x.GPSTime).ToList();
            }
        }


        //Get Roles
        public static List<Role> GetRoleList(this int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var rolesList = (from sr in tfdb.S_SysRole
                                 select new Role()
                                 {
                                     Name = sr.RoleName,
                                     RoleID = sr.RoleID,
                                     Value = sr.RoleValue ?? 0,
                                     On = false
                                 }).ToList();

                var result = (from r in tfdb.S_UserRole
                              where r.UserID == _AccountID
                              select new Role()
                              {
                                  Name = r.S_SysRole.RoleName,
                                  RoleID = r.RoleID ?? 0,
                                  Value = r.S_SysRole.RoleValue ?? 0
                              }).ToList();

                rolesList.ForEach(x => x.On = result.Any(y => y.RoleID == x.RoleID));

                if (result.Count() > 0)
                {
                    return rolesList;
                }
                else
                {
                    return null;
                }
            }
        }


        //Get New Roles list
        public static List<ModuleRoles> GetNewRolesList(int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {

                List<ModuleRoles> ModuleRolesList = new List<ModuleRoles>();

                var checkuser = tfdb.PGPS_SystemUser.Where(x => x.user_id == _AccountID).ToList();

                if (checkuser.Count() > 0)
                {
                    var user = checkuser.FirstOrDefault();

                    var readRole = tfdb.sp_PGPS_get_roles_list(user.read_role_value).ToList();

                    var createRole = tfdb.sp_PGPS_get_roles_list(user.create_role_value).ToList();

                    var updateRole = tfdb.sp_PGPS_get_roles_list(user.update_role_value).ToList();

                    var deleteRole = tfdb.sp_PGPS_get_roles_list(user.delete_role_value).ToList();

                    var moduleList = tfdb.PGPS_Module.ToList();


                    foreach (var module in moduleList)
                    {
                        ModuleRolesList.Add(new ModuleRoles()
                        {

                            Module = module.name,
                            Read = readRole.ToList().Where(x => x.ModuleID == module.module_id).FirstOrDefault().Active == true ? true : false,
                            Create = createRole.ToList().Where(x => x.ModuleID == module.module_id).FirstOrDefault().Active == true ? true : false,
                            Update = updateRole.ToList().Where(x => x.ModuleID == module.module_id).FirstOrDefault().Active == true ? true : false,
                            Delete = deleteRole.ToList().Where(x => x.ModuleID == module.module_id).FirstOrDefault().Active == true ? true : false,

                        });

                    }

                    return ModuleRolesList;

                }
                else
                {

                    return null;

                }

            }

        }

        //Get Asset Type
        public static string GetAssetType(int _AssetTypeID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var result = (from at in tfdb.D_ObjectType
                              where at.ObjectType == _AssetTypeID
                              select at.ObjectTypeDet).ToList();
                return result.FirstOrDefault();
            }
        }


        //Get Asset Type List
        public static List<AssetType> GetAssetTypeList(string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var result = (from at in tfdb.D_ObjectType
                              orderby at.ObjectOrder
                              select new AssetType()
                              {
                                  AssetTypeID = at.ObjectType,
                                  Name = at.ObjectTypeDet,
                                  ObjectOrder = at.ObjectOrder,
                                  Remark = at.remark
                              }).ToList().Where(x => x.Remark != "SatPro");

                if (result.Count() > 0)
                {
                    return result.ToList();
                }
                else
                {
                    return null;
                }

            }
        }


        //Convert status des to detailed new status
        public static Status TrackStatus(string _Status, DateTime _GPSTime, decimal _Speed)
        {
            Status _StatusModel = new Status();
            StringBuilder Status = new StringBuilder();
            StringBuilder LastStatus = new StringBuilder();
            if (_Status == null)
            {
                _StatusModel.InActive = true;
                Status.Append("Inactive");
                _StatusModel.Description = Status.ToString();
                return _StatusModel;
            }
            bool Inactive = Math.Abs(_GPSTime.Subtract(DateTime.Now).TotalHours) > 24.0;
            bool Active = Math.Abs(_GPSTime.Subtract(DateTime.Now).TotalHours) < 24.0;
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

            _StatusModel.StatusDes = _Status;

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
                    if (!Inactive)
                    {
                        Status.Append(", Idling");
                    }
                    if (OverIdling)
                    {
                        _StatusModel.OverIdling = true;
                        Status.Append(", Over Idling");
                    }

                }
                else if (_Speed > 0 && !Inactive)
                {
                    _StatusModel.Driving = true;
                    Status.Append(", Driving");

                    if (OverSpeed)
                    {
                        _StatusModel.OverSpeeding = true;
                        Status.Append(", Overspeeding");
                    }
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
                    if (!Inactive)
                    {
                        Status.Append(", Parking");
                    }
                }
            }

            if (SOS && _StatusModel.InActive == true)
            {
                _StatusModel.SOS = true;
                LastStatus.Append(" SOS");
            };
            if (PowerCut && _StatusModel.InActive == true)
            {
                _StatusModel.PowerCut = true;
                LastStatus.Append(" Power Cut");
            };
            if (GPSCut && _StatusModel.InActive == true)
            {
                _StatusModel.GPSCut = true;
                LastStatus.Append(" GPS Cut");
            };
            if (BatteryLow && _StatusModel.InActive == true)
            {
                _StatusModel.BatteryLow = true;
                LastStatus.Append(" Battery Low");
            };
            if (EngineStop && _StatusModel.InActive == true)
            {
                _StatusModel.EngineStop = true;
                LastStatus.Append(" Engine Stopped");
            };
            if (Sensor1 && _StatusModel.InActive == true)
            {
                _StatusModel.Sensor1 = true;
                LastStatus.Append(" Sensor 1 On");
            };
            if (Sensor2 && _StatusModel.InActive == true)
            {
                _StatusModel.Sensor2 = true;
                LastStatus.Append(" Sensor 2 On");
            };

            if (SOS && _StatusModel.Active == true)
            {
                _StatusModel.SOS = true;
                Status.Append(", SOS");
            };
            if (PowerCut && _StatusModel.Active == true)
            {
                _StatusModel.PowerCut = true;
                Status.Append(", Power Cut");
            };
            if (GPSCut && _StatusModel.Active == true)
            {
                _StatusModel.GPSCut = true;
                Status.Append(", GPS Cut");
            };
            if (BatteryLow && _StatusModel.Active == true)
            {
                _StatusModel.BatteryLow = true;
                Status.Append(", Battery Low");
            };
            if (EngineStop && _StatusModel.Active == true)
            {
                _StatusModel.EngineStop = true;
                Status.Append(", Engine Stopped");
            };
            if (Sensor1 && _StatusModel.Active == true)
            {
                _StatusModel.Sensor1 = true;
                Status.Append(", Sensor 1 On");
            };
            if (Sensor2 && _StatusModel.Active == true)
            {
                _StatusModel.Sensor2 = true;
                Status.Append(", Sensor 2 On");
            };

            _StatusModel.LastReport = LastStatus.ToString() == "" ? null : LastStatus.ToString();
            _StatusModel.Description = Status.ToString();
            return _StatusModel;

        }
        
        //Convert status des to detailed new status
        public static Status TrackStatusHistory(string _Status, DateTime _GPSTime, decimal _Speed)
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
            bool Inactive = Math.Abs(_GPSTime.Subtract(DateTime.Now).TotalHours) > 24.0;
            bool Active = Math.Abs(_GPSTime.Subtract(DateTime.Now).TotalHours) < 24.0;
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
            bool HarshBraking = ls.Contains("harsh braking");
            bool HarshAcceleration = ls.Contains("harsh acceleration");
            bool CheckIn = ls.Contains("check in");
            bool CheckOut = ls.Contains("check out");
            bool LBS = ls.Contains("lbs");

            _StatusModel.StatusDes = _Status;

            if (AccOn)
            {
                if (_Speed == 0 && !OverIdling)
                {
                    _StatusModel.Idling = true;
                    Status.Append("Idling");

                }
                if (_Speed > 0)
                {
                    _StatusModel.Driving = true;
                    Status.Append("Driving");

                }
                if (OverSpeed)
                {
                    _StatusModel.OverSpeeding = true;
                    Status.Append(", OverSpeeding");
                }
                if (OverIdling)
                {
                    _StatusModel.OverIdling = true;
                    Status.Append(", OverIdling");
                }
                if (HarshBraking)
                {
                    _StatusModel.HarshBraking = true;
                    Status.Append(", Harsh Braking");
                }
                if (HarshAcceleration)
                {
                    _StatusModel.HarshAcceleration = true;
                    Status.Append(", Harsh Acceleration");
                }
                if (SOS)
                {
                    _StatusModel.SOS = true;
                    Status.Append(", SOS");
                }
                if (EngineStop)
                {
                    _StatusModel.EngineStop = true;
                    Status.Append(", Engine Stop");
                }
               

            }
            else if (AccOff)
            {
                if (_Speed == 0)
                {
                    _StatusModel.Parking = true;
                    Status.Append("Parking");
                }
                if (_Speed > 0)
                {
                    _StatusModel.Driving = true;
                    Status.Append("Driving");
                }
                if (SOS)
                {
                    _StatusModel.SOS = true;
                    Status.Append(", SOS");
                }
                if (EngineStop)
                {
                    _StatusModel.EngineStop = true;
                    Status.Append(", Engine Stop");
                }
            }

            //checkin/checkout trackme status
            if (CheckIn)
            {
                Status.Append(", Check In");
            }
            else if (CheckOut)
            {
                Status.Append(", Check Out");
            }

            if (SOS) { _StatusModel.SOS = true; Status.Append(" SOS"); };
            if (PowerCut) { _StatusModel.PowerCut = true; Status.Append(", Power Cut"); };
            if (GPSCut) { _StatusModel.GPSCut = true; Status.Append(", GPS Cut"); };
            if (BatteryLow) { _StatusModel.BatteryLow = true; Status.Append(", Battery Low"); };
            if (EngineStop) { _StatusModel.EngineStop = true; Status.Append(", Engine Stop"); };
            if (Sensor1) { _StatusModel.Sensor1 = true; Status.Append(", Sensor 1 On"); };
            if (Sensor2) { _StatusModel.Sensor2 = true; Status.Append(", Sensor 2 On"); };
            if (LBS) { Status.Append(" LBS"); }

            _StatusModel.Description = Status.ToString();
            return _StatusModel;

        }
        
        //Update Asset Information Settings
        public static void UpdateAssetSettings(string _AssetID, Asset _Asset, string _WebConfigurationName)
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
                    foundAsset.Registration = _Asset.Registration;
                    foundAsset.Insurance = _Asset.Insurance;
                    foundAsset.LastService = _Asset.Service;
                    foundAsset.Permit = _Asset.Permit;
                    foundAsset.Schedule = _Asset.Schedule;
                    foundAsset.ServiceOdo = _Asset.ServiceOdo;
                    foundAsset.ObjectModel = _Asset.VehicleModel;
                    foundAsset.ObjectBrand = _Asset.VehicleBrand;

                    //update object odometer
                    var asset = tfdb.A_ActiveTracks.Where(x => x.ObjectID == _AssetID).ToList();
                    if(asset.Count() > 0)
                    {
                        asset.FirstOrDefault().ObjectMileage = _Asset.ObjectOdometer ?? 0;

                        var assetodo = tfdb.A_ActiveOdo.Where(x => x.ObjectID == _AssetID).ToList();
                        if(assetodo.Count()> 0)
                        {
                            assetodo.OrderByDescending(x => x.LastDataTime).FirstOrDefault().ObjectMileage = _Asset.ObjectOdometer ?? 0;
                        }
                    }
                    tfdb.SaveChanges();
                }
            }
        }


        //Update Account Password
        public static void UpdateAccountPassword(int _AccountID, AccountUpdate _AccountUpdate, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {

                var password_encrypt = StringCipher.Encrypt(Regex.Replace(_AccountUpdate.NewPassword.Trim(), @"\s+", " "));

                tfdb.sp_PGPS_TRP_UpdatePassword(_AccountID.ToString(), _AccountUpdate.OldPassword, _AccountUpdate.NewPassword, password_encrypt);

            }
        }
        
        //Get Account Child List
        public static List<AccountChild> GetUserChildList(int _AccountID, string _GroupCodes, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {


                List<AccountChild> AccountChildList = new List<AccountChild>();

                var ChildAccounts = (from psu in tfdb.PGPS_SystemUser.ToList()
                                     where psu.parent_user_id == _AccountID
                                     select new AccountChild()
                                     {
                                         AccountID = psu.user_id,
                                         Username = psu.username,

                                     }).ToList();

                if (ChildAccounts.Count() > 0)
                {
                    AccountChildList.AddRange(ChildAccounts);
                }



                if (AccountChildList.Count() > 0)
                {
                    return AccountChildList.GroupBy(d => d.AccountID).Select(x => x.First()).ToList();
                }
                return null;


            }
        }
        
        //Get Account Asset List
        public static List<AssignmentCustomer> GetUserChildAssetList(int _AccountID, int _ChildAccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {

                var assetList = tfdb.sp_PGPS_TRP_getUserChildAssignmentList(_AccountID.ToString(), _ChildAccountID.ToString()).ToList();

                var customerList = assetList.Select(c => new CustomerTrack()
                {
                    CustomerID = c.CustomerID ?? 0,
                    CustomerName = c.CustomerName,

                }).DistinctBy(b => b.CustomerID).ToList();

                List<AssignmentCustomer> auca = new List<AssignmentCustomer>();

                foreach (var c in customerList)
                {
                    var ac = new AssignmentCustomer()
                    {
                        CustomerID = c.CustomerID,
                        CustomerName = c.CustomerName,
                        AccountUserChildAssetList = (from asset in assetList.ToList()
                                                     where asset.CustomerID == c.CustomerID
                                                     select new AccountUserChildAsset()
                                                     {
                                                         AssetID = asset.AssetID,
                                                         AssetName = asset.Name,
                                                         IsAssigned = asset.IsAssigned == 1 ? true : false
                                                     }).ToList()
                    };

                    auca.Add(ac);
                }

                return auca;

            }
        }
        
        //Update Account Asset Assigned Asset List
        public static void UpdateUserChildAssetList(List<AccountUserChildAsset> _AUCA, int _ChildAccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var AssignedAssets = (from suv in tfdb.PGPS_SystemUserObject
                                      where suv.user_id == _ChildAccountID
                                      select suv).ToList();

                AssignedAssets.ForEach(x => tfdb.PGPS_SystemUserObject.Remove(x));

                _AUCA.Where(x => x.IsAssigned == true)
                    .ToList()
                    .ForEach(x => tfdb.PGPS_SystemUserObject.Add(
                        new PGPS_SystemUserObject()
                        {
                            ObjectID = x.AssetID,
                            user_id = _ChildAccountID
                        }));

                tfdb.SaveChanges();
            }
        }
        
        //get account sensor labels
        public static AccountSensorLabels GetAccountSensorLabels(int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var res = (from i in tfdb.PGPS_SystemUser.ToList()
                           where i.user_id == _AccountID
                           select new AccountSensorLabels()
                           {
                               AccountID = i.user_id,
                               Sensor1Label = i.Sensor1Label,
                               Sensor2Label = i.Sensor2Label
                           });
                if (res.Count() > 0)
                {
                    return res.FirstOrDefault();
                }
                else
                {
                    return null;
                }

            }
        }
        
        //update account sensor labels
        public static void UpdateAccountSensorLabels(int _AccountID, string _WebConfigurationName, AccountSensorLabels _AccountSensorLabels)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var checkUser = tfdb.PGPS_SystemUser.Where(x => x.user_id == _AccountID);

                if (checkUser.Count() > 0)
                {
                    checkUser.FirstOrDefault().Sensor1Label = _AccountSensorLabels.Sensor1Label;
                    checkUser.FirstOrDefault().Sensor2Label = _AccountSensorLabels.Sensor2Label;

                    tfdb.SaveChanges();

                }
            }
        }
        #endregion

        #region Reports

        public static List<Report> GetReportTypeList(string _WebconfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebconfigurationName))
            {

                var result = (from i in tfdb.PGPS_ReportTypes
                              //where i.Name == "History"
                              select new Report()
                              {
                                  ReportTypeID = i.ReportTypesID,
                                  Name = i.Name
                              }).ToList();

                return result;
            }
        }

        //public static List<Report> GetCustomerReportList(int _CustomerID, string _WebConfigurationName)
        //{
        //    using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
        //    {

        //        var assignedReports = (from b in tfdb.PGPS_CustomerReports
        //                               where b.CustomerID == _CustomerID
        //                               select b.ReportsID).ToList();

        //        var customerReports = (from c in tfdb.PGPS_ReportTypes
        //                               select new Models.Track.Report()
        //                               {
        //                                   ReportTypeID = c.ReportTypesID,
        //                                   Name = c.Name,
        //                                   isAssigned = c.PGPS_CustomerReports.Where(x => x.CustomerID == _CustomerID).Count() > 0 ? true : false
        //                               }).ToList();

        //        if (customerReports.Count() > 0)
        //        {
        //            return customerReports;
        //        }
        //        else
        //        {
        //            return null;
        //        }
        //    }
        //}

        //public static void AssignReportType(List<CustomerReports> _AUCA, int _CustomerID, string _WebConfigurationName)
        //{
        //    using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
        //    {
        //        var AssignCustomerReports = (from x in tfdb.PGPS_CustomerReports
        //                                     where x.CustomerID == _CustomerID
        //                                     select x).ToList();
        //        AssignCustomerReports.ForEach(d => tfdb.PGPS_CustomerReports.Remove(d));

        //        _AUCA.ToList()
        //            .ForEach(d => tfdb.PGPS_CustomerReports.Add(
        //            new PGPS_CustomerReports()
        //            {
        //                CustomerID = _CustomerID,
        //                ReportsID = d.ReportsID
        //            }));
        //        tfdb.SaveChanges();
        //    }
        //}
        #endregion

        #region settings

        public static void CustomerAssignedAssetEmailUpdate(Models.Track.CustomerAssignedAssetsEmail _AUCA, int _CustomerID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var assignedAssetsSendEmail = (from d in tfdb.A_ObjectInfo
                                               where d.CustomerID == _CustomerID
                                               select d).ToList();
                assignedAssetsSendEmail.Where(x => x.SendEmail == true).ToList().ForEach(x => x.SendEmail = false);

                var checkCustomer = tfdb.A_CustomerInfo.Where(x => x.CustomerID == _CustomerID).ToList();

                if (checkCustomer.Count() > 0)
                {
                    var customer = checkCustomer.FirstOrDefault();
                    customer.Contacter_email = _AUCA.CustomerEmail;
                }

                _AUCA.AssignedAssetsEmailList.Where(x => x.SendEmail == true)
                    .ToList()
                    .ForEach(x => tfdb.A_ObjectInfo.ToList()
                        .Where(f => f.ObjectID == x.AssetID && f.CustomerID == _CustomerID)
                        .FirstOrDefault()
                        .SendEmail = true);

                tfdb.SaveChanges();
            }
        }

        public static void UserEmailUpdate(Models.Account _AUCA, int AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {

                tfdb.sp_PGPS_TRP_UpdateUserEmail(AccountID.ToString(), _AUCA.Email);


            }
        }

        public static List<AccountRecovery> getUserEmail(Models.AccountRecovery _AUCA, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                List<AccountRecovery> getUserEmail = new List<AccountRecovery>();
                //getUserEmail = tfdb.S_SysUser.Where(x => x.UserName == _AUCA.Username).ToList();

                getUserEmail = (from i in tfdb.PGPS_SystemUser
                                where i.username == _AUCA.Username
                                select new AccountRecovery()
                                {
                                    AccountID = i.user_id,
                                    Username = i.username,
                                    Email = i.email,
                                    LastEmailUpdate = i.last_update_time
                                }).ToList();

                if (getUserEmail.Count() > 0)
                {

                    return getUserEmail.ToList();

                }
                else
                {
                    return null;
                }
            }
        }

        public static void updateLastEmailTime(int _UserID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var updateLastEmail = tfdb.PGPS_SystemUser.Where(x => x.user_id == _UserID).FirstOrDefault();
                updateLastEmail.last_update_time = DateTime.Now;
                tfdb.SaveChanges();
            }
        }

        public static void changePasswordRecovery(Models.AccountRecovery _AUCA, string _WebConfigurationName, string _Password)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var getUser = tfdb.PGPS_SystemUser.Where(x => x.username == _AUCA.Username).ToList();
                var password_encrypt = StringCipher.Encrypt(Regex.Replace(_Password.Trim(), @"\s+", " "));

                if (getUser.Count() > 0)
                {
                    var user = getUser.FirstOrDefault();
                    user.password = _Password;
                    user.last_update_time = DateTime.Now;
                    user.encrypted_password = password_encrypt;
                    tfdb.SaveChanges();
                }
            }
        }

        public static void UserAssignEmailReports(Models.AccountEmailReports _EmailReports, int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var checkIfAlreadyAssign = tfdb.PGPS_EmailReports.Where(x => x.UserID == _AccountID);

                if (checkIfAlreadyAssign.Count() > 0)
                {
                    //delete all data first
                    checkIfAlreadyAssign.ToList().ForEach(x => tfdb.PGPS_EmailReports.Remove(x));

                }

                if(_EmailReports.ReportTypeList.Count() > 0)
                {
                    foreach (var r in _EmailReports.ReportTypeList)
                    {
                        PGPS_EmailReports em = new PGPS_EmailReports()
                        {
                            UserID = _AccountID,
                            ReportTypesID = r.ReportTypeID,
                            Frequency = _EmailReports.Frequency,
                            email = _EmailReports.Email
                        };

                        tfdb.PGPS_EmailReports.Add(em);
                    }
                }
                else
                {
                    PGPS_EmailReports em = new PGPS_EmailReports()
                    {
                        UserID = _AccountID,
                        ReportTypesID = null,
                        Frequency = _EmailReports.Frequency,
                        email = _EmailReports.Email
                    };

                    tfdb.PGPS_EmailReports.Add(em);
                }

                

                tfdb.SaveChanges();
            }
        }

        public static List<AccountEmailReports> GetUserAssignEmailReports(int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var res = (from i in tfdb.PGPS_EmailReports.Where(x => x.UserID == _AccountID).ToList()
                           select new AccountEmailReports()
                           {
                               EmailReportsID = i.RowID,
                               ReportType = i.ReportTypesID,
                               Email = i.email,
                               Frequency = i.Frequency,
                               UserID = _AccountID
                           }).ToList();

                if (res.Count() > 0)
                {
                    return res.ToList();
                }
                else
                {
                    return null;
                }
            }
        }

        #endregion

        #region driver
        public static List<Driver> GetDriverList(int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var driverList = (from dr in tfdb.PGPS_Driver
                                      //where customerList.Contains(dr.CustomerID ?? 0)
                                  select new Driver()
                                  {
                                      DriverID = dr.DriverID,
                                      Name = dr.Name,
                                      LicenseNo = dr.LicenseNo,
                                      LicenseType = dr.LicenseType,
                                      LicenseExpiryDate = dr.LicenseExpiryDate,
                                      Birthdate = dr.Birthdate,
                                      MobilePhoneNo = dr.MobilePhoneNo,
                                      Address = dr.Address,
                                      Nickname = dr.Nickname,
                                      StaffNo = dr.StaffNo,
                                      StaffType = dr.StaffType,
                                      Hiredate = dr.Hiredate,
                                      HomePhoneNo = dr.HomePhoneNo,
                                      OfficePhoneNo = dr.OfficePhoneNo,
                                      Gender = dr.Gender,
                                      Remarks = dr.Remarks,
                                      EmergencyContactName = dr.EmergencyContactName,
                                      EmergencyContactPhoneNo = dr.EmergencyContactPhoneNo,
                                      Status = dr.Status,
                                      CustomerID = dr.CustomerID,
                                      CustomerName = tfdb.A_CustomerInfo.Where(x => x.CustomerID == dr.CustomerID).FirstOrDefault().Customer_Name,
                                      Tag = dr.PGPS_Tag.FirstOrDefault().Code,
                                      TagType = dr.PGPS_Tag.FirstOrDefault().Type
                                  }).ToList();

                return driverList;
            }
        }

        public static void SimulateDriverTag(DriverTag _DriverTag, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var checkasset = (from a in tfdb.A_ActiveTracks
                                  where a.ObjectID == _DriverTag.ObjectID
                                  select a).ToList();
                if (checkasset.Count() > 0)
                {

                    var asset = checkasset.FirstOrDefault();

                    tfdb.spUpdateDriverTag(
                        _DriverTag.ObjectID
                        , DateTime.Now//_DriverTag.BoardTime
                        , _DriverTag.Longitude
                        , _DriverTag.Latitude
                        , _DriverTag.Speed
                        , _DriverTag.Direction.intToShrt()
                        , asset.GPSTime
                        , _DriverTag.GPSFlag
                        , _DriverTag.MDTStatus
                        , _DriverTag.Mileage
                        , _DriverTag.Fuel
                        , _DriverTag.TagID
                        , _DriverTag.TagType.intToShrt());
                }

            }
        }

        public static void AddDriver(Models.Driver _AUCA, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                PGPS_Driver driver = new PGPS_Driver()
                {
                    Name = _AUCA.Name,
                    LicenseNo = _AUCA.LicenseNo,
                    LicenseType = _AUCA.LicenseType,
                    LicenseExpiryDate = _AUCA.LicenseExpiryDate,
                    Birthdate = _AUCA.Birthdate,
                    MobilePhoneNo = _AUCA.MobilePhoneNo,
                    Address = _AUCA.Address,
                    Nickname = _AUCA.Nickname,
                    StaffNo = _AUCA.StaffNo,
                    StaffType = _AUCA.StaffType,
                    Hiredate = _AUCA.Hiredate,
                    HomePhoneNo = _AUCA.HomePhoneNo,
                    OfficePhoneNo = _AUCA.OfficePhoneNo,
                    Gender = _AUCA.Gender,
                    Remarks = _AUCA.Remarks,
                    EmergencyContactName = _AUCA.EmergencyContactName,
                    EmergencyContactPhoneNo = _AUCA.EmergencyContactPhoneNo,
                    Status = _AUCA.Status,
                    CustomerID = _AUCA.CustomerID
                };

                if (_AUCA.Tag != null)
                {
                    PGPS_Tag tag = new PGPS_Tag()
                    {
                        Code = _AUCA.Tag,
                        Type = _AUCA.TagType,
                        CustomerID = _AUCA.CustomerID
                    };

                    driver.PGPS_Tag.Add(tag);

                }

                tfdb.PGPS_Driver.Add(driver);
                tfdb.SaveChanges();
            }
        }

        public static void UpdateDriver(Models.Driver _AUCA, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var existDriver = tfdb.PGPS_Driver.Where(x => x.DriverID == _AUCA.DriverID).ToList();
                if (existDriver.Count() > 0)
                {
                    var driver = existDriver.FirstOrDefault();
                    driver.Name = _AUCA.Name;
                    driver.LicenseNo = _AUCA.LicenseNo;
                    driver.LicenseType = _AUCA.LicenseType;
                    driver.LicenseExpiryDate = _AUCA.LicenseExpiryDate;
                    driver.Birthdate = _AUCA.Birthdate;
                    driver.MobilePhoneNo = _AUCA.MobilePhoneNo;
                    driver.Address = _AUCA.Address;
                    driver.Nickname = _AUCA.Nickname;
                    driver.StaffNo = _AUCA.StaffNo;
                    driver.StaffType = _AUCA.StaffType;
                    driver.Hiredate = _AUCA.Hiredate;
                    driver.HomePhoneNo = _AUCA.HomePhoneNo;
                    driver.OfficePhoneNo = _AUCA.OfficePhoneNo;
                    driver.Gender = _AUCA.Gender;
                    driver.Remarks = _AUCA.Remarks;
                    driver.EmergencyContactName = _AUCA.EmergencyContactName;
                    driver.EmergencyContactPhoneNo = _AUCA.EmergencyContactPhoneNo;
                    driver.Status = _AUCA.Status;
                    driver.CustomerID = _AUCA.CustomerID;

                    var checkexisttag = tfdb.PGPS_Tag.Where(x => x.Code == _AUCA.OldTag);

                    if (_AUCA.OldTag != _AUCA.Tag)
                    {
                        if (checkexisttag.Count() > 0)
                        {
                            checkexisttag.FirstOrDefault().Code = _AUCA.Tag;
                            checkexisttag.FirstOrDefault().Type = _AUCA.TagType;
                            checkexisttag.FirstOrDefault().CustomerID = _AUCA.CustomerID;
                        }
                        else
                        {

                            driver.PGPS_Tag.Add(new PGPS_Tag()
                            {
                                Code = _AUCA.Tag,
                                Type = _AUCA.TagType,
                                CustomerID = _AUCA.CustomerID
                            });
                        }

                    }
                    tfdb.SaveChanges();
                }
            }
        }

        public static void DeleteDriver(Models.Driver _AUCA, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var existDriver = tfdb.PGPS_Driver.Where(x => x.DriverID == _AUCA.DriverID).ToList();

                if (existDriver.Count() > 0)
                {
                    tfdb.PGPS_Driver.Remove(existDriver.FirstOrDefault());
                    tfdb.SaveChanges();
                }
            }
        }

        public static List<AssignDriver> GetAssignDriverList(string _AssetID, int _AccountID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities((_WebConfigurationName)))
            {
                var activeDriver = tfdb.sp_PGPS_TRP_GetCurrentActiveDriver(_AssetID).ToList();
                int activeDriverId = 0;

                if (activeDriver.Count() > 0)
                {
                    activeDriverId = activeDriver.FirstOrDefault().DriverId ?? 0;
                }


                var assignDriverList = (from dr in tfdb.PGPS_ObjectDriver
                                        where _AssetID == dr.ObjectId
                                        select new AssignDriver()
                                        {
                                            ObjectDriverId = dr.ObjectDriverId,
                                            ObjectName = dr.A_ObjectInfo.ObjectRegNum,
                                            DriverId = dr.DriverId,
                                            DriverName = dr.PGPS_Driver.Name,
                                            ObjectId = dr.ObjectId,
                                            CustomerID = tfdb.A_CustomerInfo.Where(x => x.CustomerID == dr.PGPS_Driver.CustomerID).FirstOrDefault().CustomerID,
                                            //CustomerID = customerID,
                                            CustomerName = tfdb.A_CustomerInfo.Where(x => x.CustomerID == dr.PGPS_Driver.CustomerID).FirstOrDefault().Customer_Name,
                                            //ActivePair = activeDriverId == 0 ? false : ((dr.DriverId == activeDriverId) ? true : false),
                                            //ActivePair = (activeDriverId == 0 ? false : true),
                                            TagID = dr.PGPS_Driver.PGPS_Tag.FirstOrDefault().Code
                                        }).ToList();

                assignDriverList.ForEach(x => x.ActivePair = (activeDriverId == 0 ? false : ((x.DriverId == activeDriverId) ? true : false)));

                //if (assignDriverList.Count() > 0)
                //{
                return assignDriverList;///
                //}
                //else {
                //    return null;
                //}
            }
        }

        public static void RemoveDriverAssignment(Models.AssignDriver _AUCA, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var checkdriver = tfdb.PGPS_ObjectDriver.Where(x => x.ObjectId == _AUCA.ObjectId && x.DriverId == _AUCA.DriverId).ToList();

                if (checkdriver.Count() > 0)
                {
                    var driver = checkdriver.FirstOrDefault();

                    tfdb.PGPS_ObjectDriver.Remove(driver);
                    tfdb.SaveChanges();
                }
            }
        }

        public static List<ActiveDriver> GetActiveDriverList(string _AssetID, int _AccountID, string _WebConfigurationName)
        {
            //return ActiveDriverList(_AssetID, _WebConfigurationName);

            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {

                var checkDriverwithTag = tfdb.sp_PGPS_TRP_GetCurrentActiveDriver(_AssetID).ToList();

                var checkIfAssigned = tfdb.PGPS_ObjectDriver.Where(x => x.ObjectId == _AssetID && x.ActivePair == true).ToList();

                if (checkIfAssigned.Count() > 0)
                {

                    if (checkDriverwithTag.Count() > 0)
                    {
                        if (checkDriverwithTag.FirstOrDefault().DriverId != checkIfAssigned.FirstOrDefault().DriverId)
                        {
                            var driverid = checkIfAssigned.FirstOrDefault().DriverId ?? 0;
                            var datenow = DateTime.Now.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz");
                            var result = (from i in tfdb.PGPS_Driver
                                          where i.DriverID == driverid
                                          select new ActiveDriver()
                                          {
                                              DriverId = i.DriverID,
                                              DriverName = i.Name,
                                              TagID = i.PGPS_Tag.FirstOrDefault().Code,
                                              LicenseNo = i.LicenseNo,
                                              LicenseType = i.LicenseType,
                                              MobilePhoneNo = i.MobilePhoneNo,
                                              EventDateTime = datenow,
                                              isAllowed = false
                                          }).ToList();
                            return result;
                        }
                        else
                        {
                            var result = (from i in checkDriverwithTag.ToList()
                                          select new ActiveDriver()
                                          {
                                              DriverId = i.DriverId,
                                              DriverName = i.DriverName,
                                              TagID = i.TagId.ToString(),
                                              LicenseNo = i.LicenseNo,
                                              LicenseType = i.LicenseType,
                                              MobilePhoneNo = i.MobilePhoneNo,
                                              EventDateTime = i.EventDateTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                              isAllowed = true
                                          }).ToList();

                            return result;
                        }
                    }
                    else
                    {
                        var driverid = checkIfAssigned.FirstOrDefault().DriverId ?? 0;
                        var datenow = DateTime.Now.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz");
                        var result = (from i in tfdb.PGPS_Driver
                                      where i.DriverID == driverid
                                      select new ActiveDriver()
                                      {
                                          DriverId = i.DriverID,
                                          DriverName = i.Name,
                                          TagID = i.PGPS_Tag.FirstOrDefault().Code,
                                          LicenseNo = i.LicenseNo,
                                          LicenseType = i.LicenseType,
                                          MobilePhoneNo = i.MobilePhoneNo,
                                          EventDateTime = datenow,
                                          isAllowed = true
                                      }).ToList();
                        return result;
                    }

                }
                else
                {

                    if (checkDriverwithTag.Count() > 0)
                    {
                        var result = (from i in checkDriverwithTag.ToList()
                                      select new ActiveDriver()
                                      {
                                          DriverId = i.DriverId,
                                          DriverName = i.DriverName,
                                          TagID = i.TagId.ToString(),
                                          LicenseNo = i.LicenseNo,
                                          LicenseType = i.LicenseType,
                                          MobilePhoneNo = i.MobilePhoneNo,
                                          EventDateTime = i.EventDateTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                          isAllowed = true
                                      }).ToList();

                        return result;
                    }
                    else
                    {
                        return null;
                    }


                }

            }
        }

        private static List<ActiveDriver> ActiveDriverList(string _AssetID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var activeTagLists = (from ac in tfdb.A_ActiveTag
                                      where ac.ObjectID == _AssetID
                                      select ac).ToList();
                List<ActiveDriver> activeDriver = new List<ActiveDriver>();

                if (activeTagLists.Count() > 0)
                {
                    foreach (var at in activeTagLists)
                    {
                        var checktag = (from t in tfdb.PGPS_Tag
                                        where t.Code == at.TagID
                                        select t).ToList();
                        bool isAllowed;
                        // check if has active tag
                        if (checktag.Count() > 0)
                        {
                            var stag = checktag.FirstOrDefault();
                            if (stag.PGPS_Driver.Count() > 0) //check if has assignment for driver and tag
                            {

                                var driver = stag.PGPS_Driver.FirstOrDefault();

                                var checkAssignedDriver = tfdb.PGPS_ObjectDriver.Where(x => x.ObjectId == _AssetID).ToList();

                                if (checkAssignedDriver.Count() <= 0)
                                {
                                    isAllowed = true;
                                }
                                else
                                {
                                    var checkIfAllowed = (from dr in tfdb.PGPS_ObjectDriver
                                                          where dr.DriverId == driver.DriverID
                                                          && dr.ObjectId == _AssetID
                                                          //&& dr.ActivePair == true
                                                          select dr).ToList();

                                    if (checkIfAllowed.Count() > 0)
                                    {
                                        checkIfAllowed.FirstOrDefault().ActivePair = true;
                                        tfdb.SaveChanges();
                                        isAllowed = true;
                                    }
                                    else
                                    {
                                        isAllowed = false;
                                    }
                                }

                                var checkIfHasActiveDriver = tfdb.PGPS_ObjectDriver.Where(x => x.ObjectId == _AssetID && x.ActivePair == true).ToList();

                                if (checkIfHasActiveDriver.Count() > 0)
                                {
                                    var drID = checkIfHasActiveDriver.FirstOrDefault().DriverId;

                                    var checkDriverActive = tfdb.PGPS_Driver.Where(x => x.DriverID == drID).ToList();

                                    if (checkDriverActive.Count() > 0)
                                    {
                                        var driverActive = checkDriverActive.FirstOrDefault();

                                        activeDriver.Add(new ActiveDriver()
                                        {
                                            DriverId = driverActive.DriverID,
                                            DriverName = driverActive.Name,
                                            isAllowed = true,
                                            EventDateTime = DateTime.Now.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                            LicenseNo = driverActive.LicenseNo,
                                            LicenseType = driverActive.LicenseType,
                                            MobilePhoneNo = driverActive.MobilePhoneNo
                                        });

                                    }

                                }
                                else
                                {

                                    activeDriver.Add(new ActiveDriver()
                                    {
                                        DriverId = driver.DriverID,
                                        TagID = checktag.FirstOrDefault().Code,
                                        DriverName = checktag.FirstOrDefault().PGPS_Driver.FirstOrDefault().Name ?? null,
                                        isAllowed = isAllowed,
                                        EventDateTime = at.BoardTime.Value.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz") ?? DateTime.Now.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                        LicenseNo = driver.LicenseNo,
                                        LicenseType = driver.LicenseType,
                                        MobilePhoneNo = driver.MobilePhoneNo
                                    });
                                }

                            }
                            else
                            {
                                var checkIfHasActiveDriver = tfdb.PGPS_ObjectDriver.Where(x => x.ObjectId == _AssetID && x.ActivePair == true).ToList();

                                if (checkIfHasActiveDriver.Count() > 0)
                                {
                                    var drID = checkIfHasActiveDriver.FirstOrDefault().DriverId;

                                    var checkDriverActive = tfdb.PGPS_Driver.Where(x => x.DriverID == drID).ToList();

                                    if (checkDriverActive.Count() > 0)
                                    {
                                        var driverActive = checkDriverActive.FirstOrDefault();

                                        activeDriver.Add(new ActiveDriver()
                                        {
                                            DriverId = driverActive.DriverID,
                                            DriverName = driverActive.Name,
                                            isAllowed = true,
                                            EventDateTime = DateTime.Now.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                            LicenseNo = driverActive.LicenseNo,
                                            LicenseType = driverActive.LicenseType,
                                            MobilePhoneNo = driverActive.MobilePhoneNo,
                                        });

                                    }

                                }
                            }
                        }
                        else
                        {
                            var checkIfHasActiveDriver = tfdb.PGPS_ObjectDriver.Where(x => x.ObjectId == _AssetID && x.ActivePair == true).ToList();

                            if (checkIfHasActiveDriver.Count() > 0)
                            {
                                var drID = checkIfHasActiveDriver.FirstOrDefault().DriverId;

                                var checkDriverActive = tfdb.PGPS_Driver.Where(x => x.DriverID == drID).ToList();

                                if (checkDriverActive.Count() > 0)
                                {
                                    var driverActive = checkDriverActive.FirstOrDefault();

                                    activeDriver.Add(new ActiveDriver()
                                    {
                                        DriverId = driverActive.DriverID,
                                        DriverName = driverActive.Name,
                                        isAllowed = true,
                                        EventDateTime = DateTime.Now.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                        LicenseNo = driverActive.LicenseNo,
                                        LicenseType = driverActive.LicenseType,
                                        MobilePhoneNo = driverActive.MobilePhoneNo,
                                    });

                                }

                            }
                        }
                    };
                }
                else
                {
                    var checkIfHasActiveDriver = tfdb.PGPS_ObjectDriver.Where(x => x.ObjectId == _AssetID && x.ActivePair == true).ToList();

                    if (checkIfHasActiveDriver.Count() > 0)
                    {
                        var drID = checkIfHasActiveDriver.FirstOrDefault().DriverId;

                        var checkDriverActive = tfdb.PGPS_Driver.Where(x => x.DriverID == drID).ToList();

                        if (checkDriverActive.Count() > 0)
                        {
                            var driverActive = checkDriverActive.FirstOrDefault();

                            activeDriver.Add(new ActiveDriver()
                            {
                                DriverId = driverActive.DriverID,
                                DriverName = driverActive.Name,
                                isAllowed = true,
                                EventDateTime = DateTime.Now.ToString("dddd, MMMM dd, yyyy HH:mm:ss \"GMT\"zzz"),
                                LicenseNo = driverActive.LicenseNo,
                                LicenseType = driverActive.LicenseType,
                                MobilePhoneNo = driverActive.MobilePhoneNo
                            });

                        }

                    }
                }

                return activeDriver;

            }
        }

        public static void SetActiveDriver(DriverTag _DriverTag, string _WebConfigurationName)
        {
            //using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            //{
            //    var resetActiveDriver = tfdb.PGPS_ObjectDriver.Where(x => x.ObjectId == _AUCA.ObjectId).ToList();

            //    if (resetActiveDriver.Count() > 0)
            //    {
            //        resetActiveDriver.ForEach(x => x.ActivePair = false);
            //    }

            //    var checkActiveDriver = tfdb.PGPS_ObjectDriver.Where(x => x.DriverId == _AUCA.DriverId && x.ObjectId == _AUCA.ObjectId).ToList();

            //    if (checkActiveDriver.Count() > 0)
            //    {
            //        var activeDriver = checkActiveDriver.FirstOrDefault();

            //        activeDriver.ActivePair = true;

            //    }

            //    tfdb.SaveChanges();

            //}

            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var resetActiveDriver = tfdb.PGPS_ObjectDriver.Where(x => x.ObjectId == _DriverTag.ObjectID).ToList();

                if (resetActiveDriver.Count() > 0)
                {
                    resetActiveDriver.ForEach(x => x.ActivePair = false);
                }

                var checkasset = (from a in tfdb.A_ActiveTracks
                                  where a.ObjectID == _DriverTag.ObjectID
                                  select a).ToList();
                if (checkasset.Count() > 0)
                {

                    var asset = checkasset.FirstOrDefault();

                    tfdb.spUpdateDriverTag(
                        _DriverTag.ObjectID
                        , DateTime.Now//_DriverTag.BoardTime
                        , _DriverTag.Longitude
                        , _DriverTag.Latitude
                        , _DriverTag.Speed
                        , _DriverTag.Direction.intToShrt()
                        , asset.GPSTime
                        , _DriverTag.GPSFlag
                        , _DriverTag.MDTStatus
                        , _DriverTag.Mileage
                        , _DriverTag.Fuel
                        , _DriverTag.TagID
                        , _DriverTag.TagType.intToShrt());
                }


                var checkActiveDriver = tfdb.PGPS_ObjectDriver.Where(x => x.DriverId == _DriverTag.DriverID && x.ObjectId == _DriverTag.ObjectID).ToList();

                if (checkActiveDriver.Count() > 0)
                {
                    var activeDriver = checkActiveDriver.FirstOrDefault();

                    activeDriver.ActivePair = true;

                }

                tfdb.SaveChanges();

            }


        }

        public static void RemoveActiveDriver(Models.ActiveDriver _AUCA, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {

                var checkActiveDriver = tfdb.PGPS_ObjectDriver.Where(x => x.DriverId == _AUCA.DriverId && x.ObjectId == _AUCA.ObjectId).ToList();

                if (checkActiveDriver.Count() > 0)
                {
                    var activeDriver = checkActiveDriver.FirstOrDefault();

                    activeDriver.ActivePair = false;

                }
                tfdb.SaveChanges();

            }
        }


        public static void RemoveCurrentActiveDriver(Models.ActiveDriver _AUCA, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var checkActiveTag = tfdb.A_ActiveTag.Where(x => x.ObjectID == _AUCA.ObjectId).ToList();

                if (checkActiveTag.Count() > 0)
                {
                    checkActiveTag.ForEach(x => tfdb.A_ActiveTag.Remove(x));
                }
                //else
                //{
                var checkActiveDriver = tfdb.PGPS_ObjectDriver.Where(x => x.DriverId == _AUCA.DriverId && x.ObjectId == _AUCA.ObjectId).ToList();

                if (checkActiveDriver.Count() > 0)
                {
                    var activeDriver = checkActiveDriver.FirstOrDefault();

                    activeDriver.ActivePair = false;

                }
                //}


                tfdb.SaveChanges();
            }
        }

        public static void UpdateDriverAssignedAssetList(List<DriverAssignedAssets> _AUCA, int _DriverID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var AssignedAssets = (from da in tfdb.PGPS_ObjectDriver
                                      where da.DriverId == _DriverID
                                      select da).ToList();

                AssignedAssets.ForEach(x => tfdb.PGPS_ObjectDriver.Remove(x));

                _AUCA.Where(x => x.IsAssigned == true)
                    .ToList()
                    .ForEach(x => tfdb.PGPS_ObjectDriver.Add(
                        new PGPS_ObjectDriver()
                        {
                            ObjectId = x.AssetID,
                            DriverId = _DriverID,
                            //ActivePair = false
                        }));

                tfdb.SaveChanges();
            }
        }

        public static List<DriverAssignedAssets> GetDriverAssignedAssetList(int _DriverID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var getAssetAssignList = (from ad in tfdb.PGPS_ObjectDriver
                                          where ad.DriverId == _DriverID
                                          select new DriverAssignedAssets()
                                          {
                                              AssetID = ad.ObjectId,
                                              AssetName = ad.A_ObjectInfo.ObjectRegNum,
                                              IsAssigned = true
                                          }).ToList();
                return getAssetAssignList;
            }
        }

        public static void UpdateAssetAssignedDriverList(List<AssetAssignedDrivers> _AUCA, string _AssetID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var AssignedDrivers = (from da in tfdb.PGPS_ObjectDriver
                                       where da.ObjectId == _AssetID
                                       select da).ToList();

                AssignedDrivers.ForEach(x => tfdb.PGPS_ObjectDriver.Remove(x));

                _AUCA.Where(x => x.IsAssigned == true)
                    .ToList()
                    .ForEach(x => tfdb.PGPS_ObjectDriver.Add(
                        new PGPS_ObjectDriver()
                        {
                            ObjectId = _AssetID,
                            DriverId = x.DriverID,
                            ActivePair = false
                        }));

                tfdb.SaveChanges();
            }
        }

        public static List<AssetAssignedDrivers> GetAssetAssignedDriverList(string _AssetID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var getDriverAssignList = (from da in tfdb.PGPS_ObjectDriver
                                           where da.ObjectId == _AssetID
                                           select new AssetAssignedDrivers()
                                           {
                                               DriverID = da.DriverId,
                                               Name = da.PGPS_Driver.Name,
                                               IsAssigned = true
                                           }).ToList();
                return getDriverAssignList;
            }
        }

        public static List<sp_PGPS_TRP_getHistoryDriverList_Result> GetAssetHistoryDriversList(string _AssetID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var result = tfdb.sp_PGPS_TRP_getHistoryDriverList(_AssetID).ToList();

                return result;
            }

            //using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            //{
            //    var trackTagList = (from tt in tfdb.A_TrackTag
            //                        where tt.ObjectID == _AssetID
            //                        select tt).OrderByDescending(x => x.BoardTime).ToList();

            //    List<HistoryDrivers> historyDriver = new List<HistoryDrivers>();

            //    foreach (var tt in trackTagList.Take(10))
            //    {
            //        var checktag = (from t in tfdb.PGPS_Tag
            //                        where t.Code == tt.TagID
            //                        select t).ToList();

            //        if (checktag.Count() > 0)
            //        {
            //            var stag = checktag.FirstOrDefault();
            //            if (stag.PGPS_Driver.Count() > 0)
            //            {

            //                var driver = stag.PGPS_Driver.FirstOrDefault();

            //                var checkIfAllowed = (from dr in tfdb.PGPS_ObjectDriver
            //                                      where dr.DriverId == driver.DriverID
            //                                      && dr.ObjectId == _AssetID
            //                                      //&& dr.ActivePair == true
            //                                      select dr).ToList();

            //                historyDriver.Add(new HistoryDrivers()
            //                {
            //                    TracksID = tt.TracksID,
            //                    DriverID = driver.DriverID,
            //                    DriverName = driver.Name,
            //                    TagID = tt.TagID,
            //                    BoardTime = tt.BoardTime,
            //                    Longitude = tt.Lon,
            //                    Latitude = tt.Lat,
            //                    Location = MAPDBHelpers.ReverseGeocode(tt.Lat.Value.decToDbl(), tt.Lon.Value.decToDbl()),
            //                    Speed = tt.Speed,
            //                    Direction = tt.Direct,
            //                    GPSTime = tt.GPSTime,
            //                    GPSFlag = tt.GPSFlag,
            //                    MDTStatus = tt.MDTStatus,
            //                    Mileage = tt.Mileage,
            //                    Fuel = tt.Fuel
            //                });
            //            }
            //        }

            //    }


            //    return historyDriver;
            //}
        }

        public static List<Driver> GetDriverInfo(int _AccountID, int _DriverID, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var driverList = (from dr in tfdb.PGPS_Driver
                                  where dr.DriverID == _DriverID
                                  select new Driver()
                                  {
                                      DriverID = dr.DriverID,
                                      Name = dr.Name,
                                      LicenseNo = dr.LicenseNo,
                                      LicenseType = dr.LicenseType,
                                      LicenseExpiryDate = dr.LicenseExpiryDate,
                                      Birthdate = dr.Birthdate,
                                      MobilePhoneNo = dr.MobilePhoneNo,
                                      Address = dr.Address,
                                      Nickname = dr.Nickname,
                                      StaffNo = dr.StaffNo,
                                      StaffType = dr.StaffType,
                                      Hiredate = dr.Hiredate,
                                      HomePhoneNo = dr.HomePhoneNo,
                                      OfficePhoneNo = dr.OfficePhoneNo,
                                      Gender = dr.Gender,
                                      Remarks = dr.Remarks,
                                      EmergencyContactName = dr.EmergencyContactName,
                                      EmergencyContactPhoneNo = dr.EmergencyContactPhoneNo,
                                      Status = dr.Status,
                                      CustomerID = dr.CustomerID,
                                      CustomerName = tfdb.A_CustomerInfo.Where(x => x.CustomerID == dr.CustomerID).FirstOrDefault().Customer_Name,
                                      Tag = dr.PGPS_Tag.FirstOrDefault().Code,
                                      TagType = dr.PGPS_Tag.FirstOrDefault().Type
                                  }).ToList();

                return driverList;
            }
        }

        public static void DriverUpdateSchedule(int _DriverID, int _Schedule, string _WebConfigurationName)
        {
            using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
            {
                var checkDriver = tfdb.PGPS_Driver.Where(x => x.DriverID == _DriverID).ToList();

                if (checkDriver.Count() > 0)
                {
                    checkDriver.FirstOrDefault().Schedule = _Schedule;

                    tfdb.SaveChanges();
                }
            }
        }

        #endregion

        #region notification
        //public static List<Notification> GetNotificationTypes(int _AccountID, string _WebConfigurationName)
        //{
        //    using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
        //    {
        //        var notiflist = (from notif in tfdb.PGPS_SensorType
        //                         where notif.sensor_type_id != 1 &&
        //                         notif.sensor_type_id != 2 && notif.sensor_type_id != 3
        //                         && notif.sensor_type_id != 4 && notif.sensor_type_id != 5
        //                         && notif.sensor_type_id != 9 && notif.sensor_type_id != 6
        //                         select new Notification()
        //                         {
        //                             NotificationID = notif.sensor_type_id,
        //                             Name = notif.name,
        //                             RoleValue = notif.sensor_value,
        //                         }).ToList();

        //        var getUserSettings = tfdb.PGPS_UserSettings.Where(x => x.UserID == _AccountID).ToList();

        //        if (getUserSettings.Count() > 0)
        //        {
        //            List<int> test = new List<int>();

        //            foreach (var notif in notiflist)
        //            {
        //                test.Add(notif.RoleValue);
        //            }

        //            int[] tests = test.ToArray();

        //            var target = getUserSettings.FirstOrDefault().SoundNotification;

        //            var matches = (from subset in tests.SubSetsOf()
        //                           where subset.Sum() == target
        //                           select subset).FirstOrDefault().ToList();

        //            notiflist.FirstOrDefault().total = matches;

        //            foreach (var match in matches)
        //            {
        //                foreach (var notif in notiflist)
        //                {
        //                    if (match == notif.RoleValue)
        //                    {
        //                        notif.isCheck = true;
        //                    }
        //                }
        //            }
        //        }


        //        return notiflist;
        //    }
        //}


        //public static IEnumerable<IEnumerable<T>> SubSetsOf<T>(this IEnumerable<T> source)
        //{
        //    // Deal with the case of an empty source (simply return an enumerable containing a single, empty enumerable)
        //    if (!source.Any())
        //        return Enumerable.Repeat(Enumerable.Empty<T>(), 1);

        //    // Grab the first element off of the list
        //    var element = source.Take(1);

        //    // Recurse, to get all subsets of the source, ignoring the first item
        //    var haveNots = SubSetsOf(source.Skip(1));

        //    // Get all those subsets and add the element we removed to them
        //    var haves = haveNots.Select(set => element.Concat(set));

        //    // Finally combine the subsets that didn't include the first item, with those that did.
        //    return haves.Concat(haveNots);
        //}


        //public static void UpdateNotification(Models.Track.UserSettings _AUCA, int _AccountID, string _WebConfigurationName)
        //{
        //    using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
        //    {
        //        var checkifexist = tfdb.PGPS_UserSettings.Where(x => x.UserID == _AccountID).ToList();

        //        if (checkifexist.Count() > 0)
        //        {
        //            var getUserSettings = checkifexist.FirstOrDefault();
        //            getUserSettings.SoundNotification = _AUCA.SoundNotification;
        //        }
        //        else
        //        {
        //            PGPS_UserSettings usersettings = new PGPS_UserSettings()
        //            {
        //                UserID = _AUCA.UserID,
        //                SoundNotification = _AUCA.SoundNotification
        //            };
        //            tfdb.PGPS_UserSettings.Add(usersettings);
        //        }
        //        tfdb.SaveChanges();
        //    }
        //}


        //protocols 
        //public static void InsertProtocolLogs(int _AccountID, string _WebConfigurationName, Models.Track.ProtocolLogs _Param)
        //{
        //    using (TFDBEntities tfdb = new TFDBEntities(_WebConfigurationName))
        //    {
        //        tfdb.PGPS_ProtocolLogs.Add(new PGPS_ProtocolLogs()
        //        {
        //            protocol_id = _Param.protocol_id,
        //            asset_id = _Param.asset_id,
        //            date_time = DateTime.Now,
        //            alert = _Param.alert
        //        });
        //        tfdb.SaveChanges();
        //    }
        //}

        #endregion

    }
}