using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models.Track
{
    public class Notification
    {
        public int NotificationID { get; set; }
        public string Name { get; set; }
        public int RoleValue { get; set; }
        public bool isCheck { get; set; }
        public List<int> total { get; set; }
    }
}