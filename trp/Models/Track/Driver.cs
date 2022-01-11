using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models.Track
{
    public class Driver
    {
        public int DriverID { get; set; }
        public string Name { get; set; }
        public string LicenseNo { get; set; }
        public string LicenseType { get; set; }
        public DateTime? LicenseExpiryDate { get; set; }
        public DateTime? Birthdate { get; set; }
        public string Contact { get; set; }
        public string Address { get; set; }
    }
}