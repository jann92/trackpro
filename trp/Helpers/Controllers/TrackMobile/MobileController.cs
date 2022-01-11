using Philgps_WebAPI.DAL;
using Philgps_WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using Philgps_WebAPI.Helpers.SERVERDB;
using Philgps_WebAPI.Helpers.TFDB;
using Philgps_WebAPI.Helpers.MOBILE;
using Philgps_WebAPI.Helpers;
using Philgps_WebAPI.Models.Track;
using System.Configuration;

namespace Philgps_WebAPI.Controllers.Mobile
{
    public class DateTimeRange
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }

    [Authorize]
    [RoutePrefix("Mobile")]
    public class MobileController : ApiController
    {
        public string PhotosDirectory = ConfigurationManager.AppSettings["PhotosDirectory"];
        public string PhotosURL = ConfigurationManager.AppSettings["PhotosURL"];
        public string GroupCodeViewRoleValue = ConfigurationManager.AppSettings["GroupCodeViewRoleValue"];
        public int MaxHistoryQuery = ConfigurationManager.AppSettings["MaxHistoryQuery"].strToInt();

        [Authorize]
        [Route("Asset/List")]
        [HttpGet]
        public IHttpActionResult GetAssetList()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            //Roles
            bool authorization = AccountID.IsRoleEnabled(new int[] { GroupCodeViewRoleValue.ToString().strToInt() }, WebConfigurationName);

            if (authorization)
            {

                var CustomerList = Groupcodes.GetAssetListGroupcode(WebConfigurationName).ToList();
                if (CustomerList != null)
                {

                    return Ok(CustomerList);
                }
                else
                {
                    return BadRequest("No Data");
                }
            }
            else
            {

                var CustomerList = AccountID.GetAssetListAccount(WebConfigurationName);
                if (CustomerList != null)
                {

                    return Ok(CustomerList);
                }
                else
                {
                    return BadRequest("No Data");
                }
            }
        }

        [Authorize]
        [Route("Asset/ListStat/{_Status}")]
        [HttpGet]
        public IHttpActionResult GetAssetListPerStat(string _Status)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            //Roles
            bool authorization = AccountID.IsRoleEnabled(new int[] { GroupCodeViewRoleValue.ToString().strToInt() }, WebConfigurationName);

            if (authorization)
            {

                var CustomerList = Groupcodes.GetAssetListGroupcodePerStat(_Status, WebConfigurationName);
                if (CustomerList != null)
                {

                    return Ok(CustomerList);
                }
                else
                {
                    return BadRequest("No Data");
                }
            }
            else
            {

                var CustomerList = AccountID.GetAssetListAccountPerStat(_Status, WebConfigurationName);
                if (CustomerList != null)
                {

                    return Ok(CustomerList);
                }
                else
                {
                    return BadRequest("No Data");
                }
            }
        }



        [Authorize]
        [Route("Asset/Total")]
        [HttpGet]
        public IHttpActionResult GetAssetTotal()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            //Roles
            bool authorization = AccountID.IsRoleEnabled(new int[] { GroupCodeViewRoleValue.ToString().strToInt() }, WebConfigurationName);

            if (authorization)
            {

                var result = Groupcodes.GetTotalAssetCount(WebConfigurationName);
                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest("No Assets");
                }
            }
            else
            {

                var CustomerList = AccountID.GetAssetListAccount(WebConfigurationName);
                if (CustomerList != null)
                {

                    return Ok(CustomerList);
                }
                else
                {
                    return BadRequest("No Data");
                }
            }
        }

        [Authorize]
        [Route("Asset/GPS/{_AssetID}")]
        [HttpGet]
        public IHttpActionResult GetAssetGPS(string _AssetID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");


            var result = MobileHelper.GetAssetGPS(_AssetID, WebConfigurationName);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest("Can't find GPS Information");
            }

        }

        [Authorize]
        [Route("Asset/History/{_AssetID}")]
        [HttpPost]
        public IHttpActionResult GetTrackHistory(string _AssetID, DateTimeRange _DateTimeRange)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            //Roles
            bool authorization = AccountID.IsRoleEnabled(new int[] { GroupCodeViewRoleValue.ToString().strToInt() }, WebConfigurationName);

            DateTime Start = _DateTimeRange.Start;
            DateTime End = _DateTimeRange.End;

            if (End.Subtract(Start).TotalHours > MaxHistoryQuery)
            {
                return BadRequest("You can only query history for maximum of " + MaxHistoryQuery.ToString() + " hours.");
            }


            var result = MobileHelper.GetAssetGPSHistory(_AssetID, Start, End, WebConfigurationName);
            return Ok(result);

        }


        [Authorize]
        [Route("Asset/Settings/Update/{_AssetID}")]
        [HttpPost]
        public IHttpActionResult UpdateAssetSettings(string _AssetID, Asset _Asset)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var UpdatedAsset = MobileHelper.UpdateAssetSettings(_AssetID, _Asset, WebConfigurationName);
            if (UpdatedAsset != null)
            {
                return Ok(UpdatedAsset);
            }
            else
            {
                return BadRequest("Updating asset failed.");
            }
        }

        [Authorize]
        [Route("Asset/Name/Update/{_AssetID}")]
        [HttpPost]
        public IHttpActionResult UpdateAssetName(string _AssetID, Asset _Asset)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var UpdatedAsset = MobileHelper.UpdateAssetName(_AssetID, _Asset, WebConfigurationName);
            if (UpdatedAsset != null)
            {
                return Ok(UpdatedAsset);
            }
            else
            {
                return BadRequest("Updating asset failed.");
            }
        }

        //update 7/7
        [Authorize]
        [Route("Asset/Track/List")]
        [HttpPost]
        public IHttpActionResult GetAssetTrackList(List<String> _AssetIDList)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var result = MobileHelper.GetAssetTrackList(_AssetIDList, WebConfigurationName);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest("Updating asset failed.");
            }
        }



    }
}
