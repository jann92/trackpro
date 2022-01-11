using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models.Track
{
    public class Track
    {
        public int TrackID { get; set; }
        public string AssetID { get; set; }
        public string Location { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int? Odometer { get; set; }
        public decimal? Speed { get; set; }
        public string DirectionCardinal { get; set; }
        public string DirectionDegrees { get; set; }
        public string GPSTime { get; set; }
        public int? Temperature1 { get; set; }
        public int? Temperature2 { get; set; }
        public decimal? Fuel { get; set; }
        public decimal? FuelRatio { get; set; }
        public int? FuelTypeID { get; set; }
        public Status Status { get; set; }
        public string ImageUrl { get; set; }
        public string ImageRevTime { get; set; }
        public List<ImageList> ImageList { get; set; }
        public string CurrentDriver { get; set; }
        public string TagDriver { get; set; }
        public string BoardTime { get; set; }
        public string LicenseNo { get; set; }
        public string LicenseType { get; set; }
        public string MobilePhoneNo { get; set; }
        public bool isDriverAllowed { get; set; }
        public string Name { get; set; }
        public int TypeID { get; set; }
        public string TypeName { get; set; }
        public DateTime? Registration { get; set; }
        public DateTime? Insurance { get; set; }
        public DateTime? Service { get; set; }
        public DateTime? Permit { get; set; }
        public List<DeliveryDetails> DeliveryList { get; set; }
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public int DeliveryCount { get; set; }
        public bool? SendEmail { get; set; }
        public string SIMNumber { get; set; }
        public bool isAssigned { get; set; }
        public string Schedule { get; set; }
        public bool IsBan { get; set; }
        public string DriverSchedule { get; set; }
        public bool isDriverAvailable { get; set; }
        public int? ServiceOdo { get; set; }

    }


    public class TrackList
    {

        public string AssetID { get; set; }
        public int CustomerID { get; set; }
        public string Name { get; set; }
        public string CustomerName { get; set; }
        public int TypeID { get; set; }
        public string TypeName { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Status { get; set; }

    }

    public class TrackFilterList
    {
        public string AssetID { get; set; }
        public string Name { get; set; }
        public string GPSTime { get; set; }
        public decimal? Speed { get; set; }
        public string DirectionCardinal { get; set; }
        public string DirectionDegrees { get; set; }
        public string Location { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int? Temperature1 { get; set; }
        public int? Temperature2 { get; set; }
        public bool Sensor1 { get; set; }
        public bool Sensor2 { get; set; }
        public decimal? Fuel { get; set; }
        public string Status { get; set; }
    }

    public class TrackTypeFilterList
    {
        public string AssetID { get; set; }
        public string Name { get; set; }
        public string GPSTime { get; set; }
        public decimal? Speed { get; set; }
        public string DirectionCardinal { get; set; }
        public string DirectionDegrees { get; set; }
        public string Location { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int? Temperature1 { get; set; }
        public int? Temperature2 { get; set; }
        public bool Sensor1 { get; set; }
        public bool Sensor2 { get; set; }
        public decimal? Fuel { get; set; }
        public string Status { get; set; }
    }

    public class TrackZoneFilterList
    {
        public string AssetID { get; set; }
        public string Name { get; set; }
        public string GPSTime { get; set; }
        public decimal? Speed { get; set; }
        public string DirectionCardinal { get; set; }
        public string DirectionDegrees { get; set; }
        public string Location { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int? Temperature1 { get; set; }
        public int? Temperature2 { get; set; }
        public bool Sensor1 { get; set; }
        public bool Sensor2 { get; set; }
        public decimal? Fuel { get; set; }
        public string Status { get; set; }
        public string GeofenceName { get; set; }
    }

    public class TrackByAssetIDs
    {
        public string AssetID { get; set; }
        public string Name { get; set; }
        public string GPSTime { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Location { get; set; }
        public decimal? Speed { get; set; }
        public string DirectionCardinal { get; set; }
        public string DirectionDegrees { get; set; }
        public string Status { get; set; }
        public int TypeID { get; set; }
        public string TypeName { get; set; }
    }

    public class TrackDetails
    {
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string AssetID { get; set; }
        public string Name { get; set; }
        public string GPSTime { get; set; }
        public decimal? Speed { get; set; }
        public string DirectionCardinal { get; set; }
        public string DirectionDegrees { get; set; }
        public string Status { get; set; }
        public string Status1 { get; set; }
        public string AlertStatus { get; set; }
        public string SIMNumber { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public string Location { get; set; }
        public int? Odometer { get; set; }
        public string Schedule { get; set; }
        public bool IsBan { get; set; }
        public decimal? Fuel { get; set; }
        public bool Sensor1 { get; set; }
        public bool Sensor2 { get; set; }
        public int? Temperature1 { get; set; }
        public int? Temperature2 { get; set; }
        public bool? PowerCut { get; set; }
        public bool? SOS { get; set; }
        public bool? Ignition { get; set; }
        public string DeliveryNumber { get; set; }
    }


    public class TrackMyAssetDetails
    {
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string AssetID { get; set; }
        public string Name { get; set; }
        public string GPSTime { get; set; }
        public decimal? Speed { get; set; }
        public string DirectionCardinal { get; set; }
        public string DirectionDegrees { get; set; }
        public string Status { get; set; }
        public string Status1 { get; set; }
        public string AlertStatus { get; set; }
        public string SIMNumber { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public string Location { get; set; }
        public int? Odometer { get; set; }
        public string Schedule { get; set; }
        public bool IsBan { get; set; }
        public decimal? Fuel { get; set; }
        public bool Sensor1 { get; set; }
        public bool Sensor2 { get; set; }
        public int? Temperature1 { get; set; }
        public int? Temperature2 { get; set; }
        public bool? PowerCut { get; set; }
        public bool? SOS { get; set; }
        public bool? Ignition { get; set; }
        public string TypeName { get; set; }
    }

    public class TrackSettings
    {
        public string AssetID { get; set; }
        public string SIMNumber { get; set; }
        public string Name { get; set; }
        public int TypeID { get; set; }
        public string TypeName { get; set; }
        public decimal? FuelRatio { get; set; }
        public int FuelTypeID { get; set; }
        public int? ObjectOdometer { get; set; }
        public DateTime? Registration { get; set; }
        public DateTime? Insurance { get; set; }
        public DateTime? Service { get; set; }
        public DateTime? Permit { get; set; }
        public int? ServiceOdo { get; set; }
        public string Schedule { get; set; }
        public bool IsBan { get; set; }
        public string VehicleModel { get; set; }
        public string VehicleBrand { get; set; }
    }

    public class TrackDriver
    {
        public string AssetID { get; set; }
        public bool IsBan { get; set; }
        public string DriverSchedule { get; set; }
        public bool isDriverAvailable { get; set; }
        public bool isDriverAllowed { get; set; }
        public string CurrentDriver { get; set; }
        public string TagDriver { get; set; }
        public string BoardTime { get; set; }
        public string LicenseNo { get; set; }
        public string LicenseType { get; set; }
        public string MobilePhoneNo { get; set; }

    }

    public class TrackPopupWindow
    {
        public int TrackID { get; set; }
        public string AssetID { get; set; }
        public string Name { get; set; }
        public decimal? Speed { get; set; }
        public string DirectionCardinal { get; set; }
        public string DirectionDegrees { get; set; }
        public string GPSTime { get; set; }
        public string Status { get; set; }
        public string Driver { get; set; }
        public string Delivery { get; set; }
    }


    public class TrackImage
    {
        public string AssetID { get; set; }
        public string ImageUrl { get; set; }
        public string ImageRevTime { get; set; }
        public List<ImageList> ImageList { get; set; }
    }

    public class AssetIDList
    {
        public string AssetIDs { get; set; }
    }

    public class TrackMap
    {
        public string AssetID { get; set; }
        public string Name { get; set; }
        public string GPSTime { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public decimal? Speed { get; set; }
        public string DirectionCardinal { get; set; }
        public string DirectionDegrees { get; set; }
        public string Status { get; set; }
        public int TypeID { get; set; }
        public string TypeName { get; set; }
        public string DeliveryNumber { get; set; }

    }

    public class TrackViolation
    {
        public string AssetID { get; set; }
        public string Name { get; set; }
        public string GPSTime { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public bool OverIdle { get; set; }
        public bool OverSpeed { get; set; }
        public bool OverPark { get; set; }
        public bool SOS { get; set; }
        public bool Sensor1 { get; set; }
        public bool Sensor2 { get; set; }
        public bool NoZone { get; set; }
        public bool OutOfZone { get; set; }
        public bool PowerCut { get; set; }
        public bool HarshBraking { get; set; }
        public bool HarshAcceleration { get; set; }
        public bool TemperatureUp { get; set; }
        public bool TemperatureDown { get; set; }
    }

    public class TrackCount
    {
        public int Total { get; set; }
        public int Active { get; set; }
        public int InActive { get; set; }
        public int Driving { get; set; }
        public int Idling { get; set; }
        public int Parking { get; set; }
        public int OverSpeed { get; set; }
        public int OverIdle { get; set; }
        public int OverPark { get; set; }
        public int SOS { get; set; }
        public int PowerCut { get; set; }
    }

    public class TrackHistory
    {
        public int TrackID { get; set; }
        public string AssetID { get; set; }
        public string Location { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int? Speed { get; set; }
        public string DirectionCardinal { get; set; }
        public string DirectionDegrees { get; set; }
        public string GPSTime { get; set; }
        // public Status Status { get; set; }
        public string Status { get; set; }
        public string TimeZone { get; set; }
        public int? Odometer { get; set; }
        public string GPSTimeStart { get; set; }
        public string GPSTimeEnd { get; set; }
        public decimal? Fuel { get; set; }
    }

    public class ProtocolLogs
    {
        public int protocol_log_id { get; set; }
        public int protocol_id { get; set; }
        public string asset_id { get; set; }
        public DateTime date_time { get; set; }
        public string alert { get; set; }
    }

}