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

            var result = TFDBHelpers.UpdateAccountPassword(AccountID, _AccountUpdate, WebConfigurationName);

            //Roles
            bool authorization = AccountID.IsRoleEnabled(new int[] { GroupCodeViewRoleValue.ToString().strToInt() }, WebConfigurationName);

            if (result == true)
            {

                return Ok("Successfully updated password");
            }
            else
            {

                return BadRequest("Old password is not correct");
            }
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

            //Roles
            bool authorization = AccountID.IsRoleEnabled(new int[] { AssignRoleValue.ToString().strToInt() }, WebConfigurationName);

            if (authorization)
            {
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
            else
            {
                return BadRequest("Not allowed");
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

            //Roles
            bool assignrole = AccountID.IsRoleEnabled(new int[] { AssignRoleValue.ToString().strToInt() }, WebConfigurationName);
            bool groupcodeviewrole = AccountID.IsRoleEnabled(new int[] { GroupCodeViewRoleValue.ToString().strToInt() }, WebConfigurationName);

            if (assignrole)
            {

                if (groupcodeviewrole)
                {

                    var CustomerList = Groupcodes.GetAssetListGroupcode(WebConfigurationName).ToList();
                    if (CustomerList != null)
                    {
                        List<AssignmentCustomer> auca = new List<AssignmentCustomer>();
                        foreach (var c in CustomerList)
                        {
                            var ac = new AssignmentCustomer()
                            {
                                CustomerID = c.CustomerID,
                                CustomerName = c.CustomerName
                            };

                            foreach (var asset in c.AssetList)
                            {
                                ac.AccountUserChildAssetList.Add(new AccountUserChildAsset()
                                {
                                    AssetID = asset.AssetID,
                                    AssetName = asset.Name,
                                    IsAssigned = false
                                });
                            }
                            auca.Add(ac);
                        }

                        TFDBHelpers.GetUserChildAssetList(ref auca, _ChildAccountID, WebConfigurationName);
                        return Ok(auca);
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
                        List<AssignmentCustomer> auca = new List<AssignmentCustomer>();
                        foreach (var c in CustomerList)
                        {
                            var ac = new AssignmentCustomer()
                            {
                                CustomerID = c.CustomerID,
                                CustomerName = c.CustomerName
                            };

                            foreach (var asset in c.AssetList)
                            {
                                ac.AccountUserChildAssetList.Add(new AccountUserChildAsset()
                                {
                                    AssetID = asset.AssetID,
                                    AssetName = asset.Name,
                                    IsAssigned = false
                                });
                            }
                            auca.Add(ac);
                        }

                        TFDBHelpers.GetUserChildAssetList(ref auca, _ChildAccountID, WebConfigurationName);
                        return Ok(auca);
                    }
                    else
                    {
                        return BadRequest("No Data");
                    }
                }
            }
            else
            {
                return BadRequest("Not allowed");
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

            //Roles
            bool assignrole = AccountID.IsRoleEnabled(new int[] { AssignRoleValue.ToString().strToInt() }, WebConfigurationName);
            bool groupcodeviewrole = AccountID.IsRoleEnabled(new int[] { GroupCodeViewRoleValue.ToString().strToInt() }, WebConfigurationName);

            if (assignrole)
            {

                if (groupcodeviewrole)
                {

                    var CustomerList = Groupcodes.GetAssetListGroupcode(WebConfigurationName).ToList();
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
                else
                {

                    var CustomerList = AccountID.GetAssetListAccount(WebConfigurationName);
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
            }
            else
            {
                return BadRequest("Not allowed");
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

            //Roles
            bool authorization = AccountID.IsRoleEnabled(new int[] { GroupCodeViewRoleValue.ToString().strToInt() }, WebConfigurationName);

            if (result != null)
            {

                return Ok(result);
            }
            else
            {

                return BadRequest("Error retrieving roles");
            }
        }

        //[Authorize]
        [Route("Session/Expired")]
        [HttpGet]
        public IHttpActionResult GetSessionExpiryDate()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            string SessionExpiryDate = Claims.Where(x => x.Type == "SessionExpiryDate").FirstOrDefault().Value.ToString();

            //int result = DateTime.Compare(DateTime.Parse(SessionExpiryDate), DateTime.Today);

            //if (result >= 0)
            //    return Ok("Session Not Expired");
            //else
            //    return Ok("Session Expired");
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

    }
}
