using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using Philgps_WebAPI.Helpers;
using Philgps_WebAPI.Helpers.SERVERDB;
using Philgps_WebAPI.Helpers.TFDB;
using System.Configuration;
using Philgps_WebAPI.Models;

namespace Philgps_WebAPI.Controllers.Account
{
    [Authorize]
    [RoutePrefix("Account")]
    public class AccountController : ApiController
    {
        public string GroupCodeViewRoleValue = ConfigurationManager.AppSettings["GroupCodeViewRoleValue"];
        public string AssignRoleValue = ConfigurationManager.AppSettings["AssignRoleValue"];

        [Authorize]
        [Route("Update/Password")]
        [HttpPost]
        public IHttpActionResult UpdateAccountPassword(AccountUpdate _AccountUpdate)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.UpdateAccountPassword(AccountID, _AccountUpdate, WebConfigurationName);

                return Ok("Successfully updated password");
        }

        [Authorize]
        [Route("Assignment/User/Child/List")]
        [HttpPost]
        public IHttpActionResult AssignmentUserChildList(AccountUpdate _AccountUpdate)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

                var result = TFDBHelpers.GetUserChildList(AccountID, Groupcodes, WebConfigurationName);
                if (result != null)
                {
                    return Ok(result);
                }

                else
                {
                    return BadRequest("No data.");
                }
       
        }

        [Authorize]
        [Route("Assignment/User/Child/Asset/List/{_ChildAccountID}")]
        [HttpGet]
        public IHttpActionResult AssignmentUserChildAssetList(int _ChildAccountID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");


            var CustomerList = TFDBHelpers.GetAssetListSystemUser(AccountID, WebConfigurationName).ToList();
            if (CustomerList != null)
            {

                var result = TFDBHelpers.GetUserChildAssetList(AccountID, _ChildAccountID, WebConfigurationName);
                return Ok(result);
            }
            else
            {
                return BadRequest("No Data");
            }

      
        }

        [Authorize]
        [Route("Assignment/User/Child/Asset/Update/{_ChildAccountID}")]
        [HttpPost]
        public IHttpActionResult AssignmentUserChildAssetUpdate(int _ChildAccountID, List<AccountUserChildAsset> auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var CustomerList = TFDBHelpers.GetAssetListSystemUser(AccountID, WebConfigurationName).ToList();
            if (CustomerList != null)
            {


                TFDBHelpers.UpdateUserChildAssetList(auca, _ChildAccountID, WebConfigurationName);
                return Ok(auca);
            }
            else
            {
                return BadRequest("No Data");
            }


        
        }

        [Authorize]
        [Route("User/Roles")]
        [HttpGet]
        public IHttpActionResult GetUserRoles()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var result = TFDBHelpers.GetRoleList(AccountID, WebConfigurationName);


            return Ok(result);

        }

        [Authorize]
        [Route("User/Roles/List")]
        public IHttpActionResult GetUserRolesList()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var result = TFDBHelpers.GetNewRolesList(AccountID, WebConfigurationName);

            return Ok(result);

        }

        //[Authorize]
        [Route("Session/Expired")]
        [HttpGet]
        public IHttpActionResult GetSessionExpiryDate()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            string SessionExpiryDate = Claims.Where(x => x.Type == "SessionExpiryDate").FirstOrDefault().Value.ToString();

            return Ok(DateTime.Parse(SessionExpiryDate));
        }


        [Route("User/Email")]
        [HttpGet]
        public IHttpActionResult GetUserEmail()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            string UserEmail = Claims.Where(x => x.Type == "UserEmail").FirstOrDefault().Value.ToString();

            return Ok(UserEmail);
        }

        [Authorize]
        [Route("User/SensorLabels")]
        [HttpGet]
        public IHttpActionResult GetUserLabels()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var res = TFDBHelpers.GetAccountSensorLabels(AccountID, WebConfigurationName);

            return Ok(res);

        }


        [Authorize]
        [Route("Update/User/SensorLabels")]
        [HttpPost]
        public IHttpActionResult UpdateAccountSensorLabels(AccountSensorLabels _AccountSensorLabels)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.UpdateAccountSensorLabels(AccountID, WebConfigurationName, _AccountSensorLabels);

            return Ok("Update Successfully.");
        }
    }
}
