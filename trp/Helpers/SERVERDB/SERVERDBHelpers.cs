using Philgps_WebAPI.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Philgps_WebAPI.Helpers.SERVERDB
{
    public static class SERVERDBHelpers
    {

        public static string GetWebConfigurationName(this string _ConfigName, string _DatabaseName)
        {
            using (SERVERDBEntities sdb = new SERVERDBEntities())
            {
                var result = (from wsc in sdb.WebServerConfiguration
                              where wsc.config_name == _ConfigName &&
                              wsc.database_name == _DatabaseName
                              select wsc).ToList();
                if (result.Count() > 0)
                {
                    return result.FirstOrDefault().web_config_name;
                }
                else
                {
                    return null;
                }
            }
        }

        public static string GetDownloadsHistoryURL(this string _ConfigName, string _DatabaseName)
        {
            using (SERVERDBEntities sdb = new SERVERDBEntities())
            {
                var result = (from wsc in sdb.WebServerConfiguration
                              where wsc.config_name == _ConfigName &&
                              wsc.database_name == _DatabaseName
                              select wsc).ToList();
                if (result.Count() > 0)
                {
                    return result.FirstOrDefault().WebServers.downloads_url;
                }
                else
                {
                    return null;
                }
            }
        }

    }
}
