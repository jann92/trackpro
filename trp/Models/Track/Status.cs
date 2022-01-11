using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models.Track
{
    public class Status
    {
        public bool Parking { get; set; }
        public bool Idling { get; set; }
        public bool Driving { get; set; }
        public bool OverSpeeding { get; set; }
        public bool OverIdling { get; set; }
        public bool GPSCut { get; set; }
        public bool PowerCut { get; set; }
        public bool EngineStop { get; set; }
        public bool Active { get; set; }
        public bool InActive { get; set; }
        public bool Sensor1 { get; set; }
        public bool Sensor2 { get; set; }
        public bool BatteryLow { get; set; }
        public bool SOS { get; set; }
        public bool HarshBraking { get; set; }
        public bool HarshAcceleration { get; set; }
        public string Description { get; set; }
        public string StatusDes { get; set; }
        public string LastReport { get; set; }
        public bool Mobile { get; set; }

    }

    public class StatusCount
    {
        public int ParkingCount { get; set; }
        public int IdlingCount { get; set; }
        public int DrivingCount { get; set; }
        public int OverSpeedingCount { get; set; }
        public int OverIdlingCount { get; set; }
        public int GPSCutCount { get; set; }
        public int PowerCutCount { get; set; }
        public int EngineStopCount { get; set; }
        public int ActiveCount { get; set; }
        public int InactiveCount { get; set; }
        public int Sensor1Count { get; set; }
        public int Sensor2Count { get; set; }
        public int BatteryLowCount { get; set; }
        public int SOSCount { get; set; }
        public int Total { get; set; }

    }
}