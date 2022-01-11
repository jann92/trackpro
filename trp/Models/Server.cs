using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models
{
    public class Server
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public string Code { get; set; }
        public string ConfigurationName { get; set; }
        public string DefaultCoordinates { get; set; }
        public string ImagesUrl { get; set; }
    }
}