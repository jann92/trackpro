using Philgps_WebAPI.DAL;
using Philgps_WebAPI.Helpers;
using Philgps_WebAPI.Helpers.SERVERDB;

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;

namespace Philgps_WebAPI.Controllers.History
{

    public class DateTimePeriod
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }

    public class HistoryParams
    {
        public string SelectedAsset { get; set; }
        public DateTimePeriod DateTimePeriod { get; set; }
    }

    public class HistoryDownload
    {
        public string Date { get; set; }
        public string URL { get; set; }
    }

    public class p_DatePeriod
    {
        public DateTime start { get; set; }
        public DateTime end { get; set; }
    }

    [Authorize]
    [RoutePrefix("History")]
    public class HistoryController : ApiController
    {
        public string GroupCodeViewRoleValue = ConfigurationManager.AppSettings["GroupCodeViewRoleValue"];
        public string AssignRoleValue = ConfigurationManager.AppSettings["AssignRoleValue"];

        [Authorize]
        [Route("CSV/Single")]
        [HttpPost]
        public IHttpActionResult HistoryCSV(HistoryParams _HistoryParams)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string DownloadsURL = Claims.Where(x => x.Type == "DownloadsURL").FirstOrDefault().Value.ToString();
            string REPWCN = ConfigurationName.GetWebConfigurationName("REPORTDB");

            using (SERVERDBEntities serverdb = new SERVERDBEntities())
            {
                if (_HistoryParams.SelectedAsset == null)
                {
                    return BadRequest("Cannot accept empty object list.");
                }

                List<HistoryDownload> FileNameList = new List<HistoryDownload>();

                DateTime end = (DateTime.Now - _HistoryParams.DateTimePeriod.End).TotalHours < 24 ? _HistoryParams.DateTimePeriod.End.AddDays(-1) : _HistoryParams.DateTimePeriod.End;

                foreach (DateTime queryDate in Utilities.EachDay(_HistoryParams.DateTimePeriod.Start, end))
                {
                    string assetid = _HistoryParams.SelectedAsset;
                    FileNameList.Add(new HistoryDownload()
                    {
                        Date = queryDate.ToString("yyyy-MM-dd"),
                        URL = DownloadsURL + queryDate.ToString("yyyyMMdd")+ "/" + assetid + "_" + queryDate.ToString("yyyyMMdd") + ".csv"
                    });
                }

                if (FileNameList.Count() == 0)
                {
                    return BadRequest("No result found.");
                }
                return Ok(FileNameList);

            }
        }


        #region Downloads
        [Route("Downloads/Get/Url")]
        [HttpGet]
        public IHttpActionResult GetDownloadsUrl()
        {
            return Ok(ConfigurationManager.AppSettings["Url"].ToString());
        }

        [Route("Downloads/History/{AssetID}")]
        [HttpPost]
        public IHttpActionResult GetDownloadsHistory(string AssetID, p_DatePeriod period)
        {
            try
            {
                List<string> files = new List<string>();
                foreach (DateTime queDate in EachDay(period.start, period.end))
                {
                    string filename = AssetID + "_" + queDate.ToString("yyyyMMdd");
                    files.Add(filename);

                }
                return Ok(files);
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException.Message.ToString());
            }
        }
        #endregion

        public static IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }
    }
}
