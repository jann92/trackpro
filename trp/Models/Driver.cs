using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models
{
    public class Driver
    {
        public int DriverID { get; set; }
        public string Name { get; set; }
        public string LicenseNo { get; set; }
        public string LicenseType { get; set; }
        public DateTime? LicenseExpiryDate { get; set; }
        public DateTime? Birthdate { get; set; }
        public string MobilePhoneNo { get; set; }
        public string Address { get; set; }
        public string Nickname { get; set; }
        public string StaffNo { get; set; }
        public string StaffType { get; set; }
        public DateTime? Hiredate { get; set; }
        public string HomePhoneNo { get; set; }
        public string OfficePhoneNo { get; set; }
        public string Gender { get; set; }
        public string Remarks { get; set; }
        public string EmergencyContactName { get; set; }
        public string EmergencyContactPhoneNo { get; set; }
        public string Status { get; set; }
        public int? CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string OldTag { get; set; }
        public string Tag { get; set; }
        public string TagType { get; set; }
    }

    public class AssignDriver
    {
        public int ObjectDriverId { get; set; }
        public string ObjectId { get; set; }
        public string ObjectName { get; set; }
        public int? DriverId { get; set; }
        public string DriverName { get; set; }
        public bool? ActivePair { get; set; }
        public int? CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string TagID { get; set; }
    }

    public class ActiveDriver
    {
        public int ObjectDriverId { get; set; }
        public string ObjectId { get; set; }
        public string ObjectName { get; set; }
        public int? DriverId { get; set; }
        public string DriverName { get; set; }
        public string LicenseNo { get; set; }
        public string LicenseType { get; set; }
        public string MobilePhoneNo { get; set; }
        public bool? ActivePair { get; set; }
        public int? CustomerID { get; set; }
        public string CustomerName { get; set; }
        public bool? isAllowed { get; set; }
        public string TagID { get; set; }
        public string EventDateTime { get; set; }
    }

    public class DriverAssignedAssets 
    {
        public string AssetID { get; set; }
        public string AssetName { get; set; }
        public bool IsAssigned { get; set; }
    }

    public class AssetAssignedDrivers
    {
        public int? DriverID { get; set; }
        public string Name { get; set; }
        public bool IsAssigned { get; set; }
    }

    public class HistoryDrivers
    {
        public decimal TracksID { get; set; }
        public string TagID { get; set; }
        public string ObjectID { get; set; }
        public int DriverID { get; set; }
        public string DriverName { get; set; }
        public DateTime? BoardTime { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? Latitude { get; set; }
        public string Location { get; set; }
        public decimal? Speed { get; set; }
        public int? Direction { get; set; }
        public DateTime? GPSTime { get; set; }
        public int? GPSFlag { get; set; }
        public string MDTStatus { get; set; }
        public int? Mileage { get; set; }
        public decimal? Fuel { get; set; }
    }
}