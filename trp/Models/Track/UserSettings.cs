using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models.Track
{
    public class UserSettings
    {
        public int UserSettingsID { get; set; }
        public int UserID { get; set; }
        public string Email { get; set; }
        public DateTime? LastEmailUpdate { get; set; }
        public int? SoundNotification { get; set; }
    }
}