using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models
{
    public class Role
    {
        public int RoleID { get; set; }
        public string Name { get; set; }
        public int Value { get; set; }
        public bool On { get; set; }
    }

    public class ModuleRoles
    {
        public string Module { get; set; }
        public bool Create { get; set; }
        public bool Read { get; set; }
        public bool Update { get; set; }
        public bool Delete { get; set; }

    }
}