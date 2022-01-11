using Philgps_WebAPI.DAL;
using Philgps_WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;
using Philgps_WebAPI.Helpers.SERVERDB;
using Philgps_WebAPI.Helpers.TFDB;
using Philgps_WebAPI.Helpers;
using Philgps_WebAPI.Models.Track;
using System.Configuration;


namespace Philgps_WebAPI.Controllers.Dashboard
{
    public class Counter
    {
        public int Total { get; set; }
        public int Drive { get; set; }
        public int AccOn { get; set; }
        public int AccOff { get; set; }
        public int Sensor1 { get; set; }
        public int Sensor2 { get; set; }
        public int SOS { get; set; }
        public int BadGps { get; set; }
        public int InActive { get; set; }
        public int Alert { get; set; }
        public int InPool { get; set; }
    }

    public class VehicleParams
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class VehicleUtilize
    {

    }

    [RoutePrefix("Dashboard")]
    public class DashboardController : ApiController
    {
        [Authorize]
        [Route("Counter/Vehicles")]
        [HttpGet]
        public IHttpActionResult getTotalVehicles()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            string AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");
            string WebConfigurationNameGEO = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            using (GEOFENCEDBEntities gfdb = new GEOFENCEDBEntities(WebConfigurationNameGEO))
            {
                using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
                {
                    var countassetsinzone = gfdb.sp_pgps_count_assets_inside_zone(AccountID.strToInt()).FirstOrDefault();

                    var result = (from i in tfdb.sp_pgps_GetCounterByUserID(AccountID).ToList()
                                  select new Counter()
                                  {
                                      Total = i.Total ?? 0,
                                      AccOn = i.AccOn ?? 0,
                                      AccOff = i.AccOff ?? 0,
                                      Drive = i.Drive ?? 0,
                                      Alert = i.Alert ?? 0,
                                      BadGps = i.BadGps ?? 0,
                                      InActive = i.InActive ?? 0,
                                      // InPool = tfdb.sp_pgps_get_assets_inside_zone_count(AccountID).FirstOrDefault() ?? 0,
                                      InPool = countassetsinzone ?? 0,
                                      Sensor1 = i.Sensor1 ?? 0,
                                      Sensor2 = i.Sensor2 ?? 0
                                  }).ToList();
                    return Ok(result.FirstOrDefault());
                }
            }

        }

        [Authorize]
        [Route("Vehicle/Utilize")]
        [HttpPost]
        public IHttpActionResult getVehicleUtilize(VehicleParams _VehicleParams)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            string AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {

                var result = tfdb.sp_pgps_GetVehicleUtili(AccountID, _VehicleParams.StartDate, _VehicleParams.EndDate).ToList();

                return Ok(result);
            }
        }

        [Authorize]
        [Route("Vehicle/Distance")]
        [HttpPost]
        public IHttpActionResult getVehicleDistance(VehicleParams _VehicleParams)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            string AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {

                var result = tfdb.sp_pgps_GetVehicleDistance(AccountID, _VehicleParams.StartDate, _VehicleParams.EndDate).ToList();

                return Ok(result);
            }
        }      

    }
}
