using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models.Track
{
    public class Report
    {
        public int ReportTypeID { get; set; }
        public string Name { get; set; }
        public bool isAssigned { get; set; }
    }
    public class CustomerReports
    {
        //public int CustomerReportsID { get; set; }
        //public int CustomerID { get; set; }
        public int? ReportsID { get; set; }
        //public bool IsAssigned { get; set; }
    }
}