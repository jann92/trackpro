using Philgps_WebAPI.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using Philgps_WebAPI.Helpers.SERVERDB;
using Philgps_WebAPI.Helpers;
using Philgps_WebAPI.Helpers.GEOFENCEDB;
using Philgps_WebAPI.Helpers.TFDB;
using Philgps_WebAPI.Models;
using System.Configuration;
using Philgps_WebAPI.Models.Geofence;

namespace Philgps_WebAPI.Controllers.Geofence
{
    [RoutePrefix("Geofence")]
    public class GeofenceController : ApiController
    {
        public string GroupCodeViewRoleValue = ConfigurationManager.AppSettings["GroupCodeViewRoleValue"];
        public string AssignRoleValue = ConfigurationManager.AppSettings["AssignRoleValue"];
        #region Zone

        [Route("Zone/Type/List")]
        [HttpGet]
        public IHttpActionResult GetZoneTypeList()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var ZoneTypeList = GEOFENCEDBHelpers.GetZoneTypeList(WebConfigurationName);

            if (ZoneTypeList != null)
            {
                return Ok(ZoneTypeList);
            }
            else
            {
                return BadRequest("No Data");
            }
        }

        [Route("User/Zone/List")]
        [HttpGet]
        public IHttpActionResult GetUserZoneList()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var UserZoneList = GEOFENCEDBHelpers.GetUserZoneList(AccountID, WebConfigurationName);
            if (UserZoneList != null)
            {
                return Ok(UserZoneList);
            }
            else
            {
                return BadRequest("No Data");
            }
        }

        [Route("Asset/Zone/List/{_AssetID}")]
        [HttpGet]
        public IHttpActionResult GetAssetZoneList(string _AssetID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var AssetZoneList = GEOFENCEDBHelpers.GetAssetZoneList(_AssetID, AccountID, WebConfigurationName);

            if (AssetZoneList != null)
            {
                return Ok(AssetZoneList.OrderBy(x=> x.Name));
            }
            else
            {
                return Ok(AssetZoneList);
            }
}

        [Authorize]
        [Route("Zone/Add")]
        [HttpPost]
        public IHttpActionResult ZoneAdd(Models.Geofence.Zone _Zone)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var NewZone = GEOFENCEDBHelpers.AddZone(_Zone, AccountID, WebConfigurationName);

            if (NewZone != null)
            {
                return Ok(NewZone);
            }
            else
            {
                return BadRequest("Failed to add zone.");
            }
        }

        [Authorize]
        [Route("Zone/Delete/{_ZoneID}")]
        [HttpPost]
        public IHttpActionResult ZoneDelete(int _ZoneID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var DeletedZoneID = GEOFENCEDBHelpers.DeleteZone(_ZoneID, WebConfigurationName);

            if (DeletedZoneID != null)
            {
                return Ok(DeletedZoneID);
            }
            else
            {
                return BadRequest("Failed to delete zone.");
            }
        }

        [Authorize]
        [Route("Zone/Update/{_ZoneID}")]
        [HttpPost]
        public IHttpActionResult ZoneUpdate(int _ZoneID, Models.Geofence.Zone _Zone)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var UpdatedZone = GEOFENCEDBHelpers.UpdateZone(_ZoneID, AccountID, _Zone, WebConfigurationName);

            if (UpdatedZone != null)
            {
                return Ok(UpdatedZone);
            }
            else
            {
                return BadRequest("Failed to update zone.");
            }
        }

        [Authorize]
        [Route("Zone/Assigned/Asset/List/{_ZoneID}")]
        [HttpGet]
        public IHttpActionResult GetAssetZoneList(int _ZoneID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string TFDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");
            string GEOFENCEDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");
            //Roles
            bool assignrole = AccountID.IsRoleEnabled(new int[] { AssignRoleValue.ToString().strToInt() }, TFDBWebConfigurationName);
            bool groupcodeviewrole = AccountID.IsRoleEnabled(new int[] { GroupCodeViewRoleValue.ToString().strToInt() }, TFDBWebConfigurationName);

            if (assignrole)
            {

                if (groupcodeviewrole)
                {

                    var CustomerList = Groupcodes.GetAssetListGroupcode(TFDBWebConfigurationName).ToList();
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

                        GEOFENCEDBHelpers.GetZoneAssignedAssets(ref auca, _ZoneID, GEOFENCEDBWebConfigurationName);
                        auca.ForEach(x => x.AccountUserChildAssetList.OrderBy(y => y.AssetName));
                        auca.OrderBy(x => x.CustomerName);
                        return Ok(auca);
                    }
                    else
                    {
                        return BadRequest("No Data");
                    }
                }
                else
                {
                    var CustomerList = AccountID.GetAssetListAccount(TFDBWebConfigurationName);
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
                        GEOFENCEDBHelpers.GetZoneAssignedAssets(ref auca, _ZoneID, GEOFENCEDBWebConfigurationName);
                        auca.ForEach(x => x.AccountUserChildAssetList.OrderBy(y => y.AssetName));
                        auca.OrderBy(x => x.CustomerName);
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
        [Route("Asset/Assigned/Zone/List/{_AssetID}")]
        [HttpGet]
        public IHttpActionResult GetZoneAssetList(string _AssetID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string TFDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");
            string GEOFENCEDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            //Roles
            bool assignrole = AccountID.IsRoleEnabled(new int[] { AssignRoleValue.ToString().strToInt() }, TFDBWebConfigurationName);

            if (assignrole)
            {

                var result = GEOFENCEDBHelpers.GetAssetAssignedZones(_AssetID, AccountID, GEOFENCEDBWebConfigurationName);
                result.OrderBy(x => x.Name);
                return Ok(result);
            }
            else
            {
                return BadRequest("Not allowed");
            }
        }

        [Authorize]
        [Route("Zone/Assigned/Asset/Update/{_ZoneID}")]
        [HttpPost]
        public IHttpActionResult AssignmentUserChildAssetUpdate(int _ZoneID, List<ZoneAssignedAssets> auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string TFDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");
            string GEOFENCEDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            //Roles
            bool assignrole = AccountID.IsRoleEnabled(new int[] { AssignRoleValue.ToString().strToInt() }, TFDBWebConfigurationName);

            if (assignrole)
            {

                GEOFENCEDBHelpers.UpdateZoneAssignedAssetList(auca, _ZoneID, GEOFENCEDBWebConfigurationName);
                return Ok(auca);
            }
            else
            {
                return BadRequest("Not allowed");
            }
        }

        [Authorize]
        [Route("Asset/Assigned/Zone/Update/{_AssetID}")]
        [HttpPost]
        public IHttpActionResult AssignmentUserChildZoneUpdate(string _AssetID, List<AssetAssignedZones> auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string TFDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");
            string GEOFENCEDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            //Roles
            bool assignrole = AccountID.IsRoleEnabled(new int[] { AssignRoleValue.ToString().strToInt() }, TFDBWebConfigurationName);

            if (assignrole)
            {

                GEOFENCEDBHelpers.UpdateAssetAssignedZoneList(auca, _AssetID, GEOFENCEDBWebConfigurationName);
                return Ok(auca);
            }
            else
            {
                return BadRequest("Not allowed");
            }

        }
        #endregion


        #region route
        [Authorize]
        [Route("User/Route/List")]
        [HttpGet]
        public IHttpActionResult GetUserRouteList()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            try
            {
                var UserRouteList = GEOFENCEDBHelpers.GetUserRouteList(AccountID, WebConfigurationName);

                //if (UserRouteList != null)
                //{
                return Ok(UserRouteList);
                //}
                //else
                //{
                //    return Ok(UserRouteList);
                //}
            }
            catch (Exception ex)
            {
                return BadRequest("No Routes");
            }

            

        }

        [Route("Asset/Route/List/{_AssetID}")]
        [HttpGet]
        public IHttpActionResult GetAssetRouteList(string _AssetID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var AssetRouteList = GEOFENCEDBHelpers.GetAssetRouteList(_AssetID, AccountID, WebConfigurationName);

            if (AssetRouteList != null)
            {
                return Ok(AssetRouteList.OrderBy(x=> x.Name));
            }
            else
            {
                return Ok("No Data");
            }

        }

        [Route("Route/Assigned/Asset/List/{_RouteID}")]
        public IHttpActionResult GetAssetAssignedRouteList(int _RouteID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string TFDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");
            string GEOFENCEDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");
            //Roles
            bool assignrole = AccountID.IsRoleEnabled(new int[] { AssignRoleValue.ToString().strToInt() }, TFDBWebConfigurationName);
            bool groupcodeviewrole = AccountID.IsRoleEnabled(new int[] { GroupCodeViewRoleValue.ToString().strToInt() }, TFDBWebConfigurationName);

            if (assignrole)
            {

                if (groupcodeviewrole)
                {

                    var CustomerList = Groupcodes.GetAssetListGroupcode(TFDBWebConfigurationName).ToList();
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

                        GEOFENCEDBHelpers.GetRouteAssignedAssets(ref auca, _RouteID, GEOFENCEDBWebConfigurationName);
                        auca.ForEach(x => x.AccountUserChildAssetList.OrderBy(y => y.AssetName));
                        auca.OrderBy(x => x.CustomerName);
                        return Ok(auca);
                    }
                    else
                    {
                        return BadRequest("No Data");
                    }
                }
                else
                {
                    var CustomerList = AccountID.GetAssetListAccount(TFDBWebConfigurationName);
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
                        GEOFENCEDBHelpers.GetRouteAssignedAssets(ref auca, _RouteID, GEOFENCEDBWebConfigurationName);
                        auca.ForEach(x => x.AccountUserChildAssetList.OrderBy(y => y.AssetName));
                        auca.OrderBy(x => x.CustomerName);
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

        [Route("Asset/Assigned/Route/List/{_AssetID}")]
        [HttpGet]
        public IHttpActionResult GetRouteAssetList(string _AssetID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string TFDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");
            string GEOFENCEDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            //Roles
            bool assignrole = AccountID.IsRoleEnabled(new int[] { AssignRoleValue.ToString().strToInt() }, TFDBWebConfigurationName);

            if (assignrole)
            {

                var result = GEOFENCEDBHelpers.GetAssetAssignedRoutes(_AssetID, AccountID, GEOFENCEDBWebConfigurationName);
                result.OrderBy(x => x.Name);
                return Ok(result);
            }
            else
            {
                return BadRequest("Not allowed");
            }
        }


        [Authorize]
        [Route("Route/Add")]
        [HttpPost]
        public IHttpActionResult RouteAdd(Models.Geofence.Route _Route)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");
            var NewRoute = GEOFENCEDBHelpers.AddRoute(_Route, AccountID, WebConfigurationName);

            if (NewRoute != null)
            {
                return Ok(NewRoute);
            }
            else
            {
                return BadRequest("Failed to add route.");
            }
        }


        [Authorize]
        [Route("Route/Update/{_RouteID}")]
        [HttpPost]
        public IHttpActionResult RouteUpdate(int _RouteID, Models.Geofence.Route _Route)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var UpdateRoute = GEOFENCEDBHelpers.UpdateRoute(_RouteID, AccountID, _Route, WebConfigurationName);

            if (UpdateRoute != null)
            {
                return Ok(UpdateRoute);
            }
            else
            {
                return BadRequest("Failed to update zone.");
            }
        }


        [Authorize]
        [Route("Route/Delete/{_RouteID}")]
        [HttpPost]
        public IHttpActionResult RouteDelete(int _RouteID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");
            var DeletedRouteID = GEOFENCEDBHelpers.DeleteRoute(_RouteID, WebConfigurationName);

            if (DeletedRouteID != null)
            {
                return Ok(DeletedRouteID);
            }
            else
            {
                return BadRequest("Failed to delete zone.");
            }
        }

        [Authorize]
        [Route("Route/Assigned/Asset/Update/{_RouteID}")]
        [HttpPost]
        public IHttpActionResult AssignmentUserChildAssetUpdate(int _RouteID, List<RouteAssignedAssets> auca)
        {
            //return Ok(auca);
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string TFDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");
            string GEOFENCEDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            //Roles
            bool assignrole = AccountID.IsRoleEnabled(new int[] { AssignRoleValue.ToString().strToInt() }, TFDBWebConfigurationName);

            if (assignrole)
            {

                GEOFENCEDBHelpers.UpdateRouteAssignedAssetList(auca, _RouteID, GEOFENCEDBWebConfigurationName);
                return Ok(auca);
            }
            else
            {
                return BadRequest("Not allowed");
            }
        }

        [Route("Asset/Assigned/Route/Update/{_AssetID}")]
        [HttpPost]
        public IHttpActionResult AssignmentUserChildAssetUpdate(string _AssetID, List<AssetAssignedRoutes> auca)
        {
            //return Ok(auca);
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string TFDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");
            string GEOFENCEDBWebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            //Roles
            bool assignrole = AccountID.IsRoleEnabled(new int[] { AssignRoleValue.ToString().strToInt() }, TFDBWebConfigurationName);

            if (assignrole)
            {

                GEOFENCEDBHelpers.UpdateAssetAssignedRouteList(auca, _AssetID, GEOFENCEDBWebConfigurationName);
                return Ok(auca);
            }
            else
            {
                return BadRequest("Not allowed");
            }
        }

        #endregion
        #region Landmark

        [Route("Landmark/Type/List")]
        [HttpGet]
        public IHttpActionResult GetLandmarkTypeList()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var LandmarkTypeList = GEOFENCEDBHelpers.GetLandmarkTypeList(WebConfigurationName);

            if (LandmarkTypeList != null)
            {
                return Ok(LandmarkTypeList);
            }
            else
            {
                return BadRequest("No Data");
            }
        }

        [Route("User/Landmark/List")]
        [HttpGet]
        public IHttpActionResult GetUserLandmarkList()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var UserLandmarkList = GEOFENCEDBHelpers.GetUserLandmarkList(AccountID, WebConfigurationName);
            if (UserLandmarkList != null)
            {
                return Ok(UserLandmarkList.OrderBy(x=> x.Name));
            }
            else
            {
                return BadRequest("No Data");
            }
        }

        [Authorize]
        [Route("Landmark/Add")]
        [HttpPost]
        public IHttpActionResult LandmarkAdd(Models.Geofence.Landmark _Landmark)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var NewLandmark = GEOFENCEDBHelpers.AddLandmark(_Landmark, AccountID, WebConfigurationName);

            if (NewLandmark != null)
            {
                if (NewLandmark.isExist == true)
                {
                    return BadRequest("Exist");
                }
                else
                {
                    return Ok(NewLandmark);
                }

            }
            else
            {
                return BadRequest("Failed to add Landmark");
            }
        }

        [Authorize]
        [Route("Landmark/Delete/{_LandmarkID}")]
        [HttpPost]
        public IHttpActionResult LandmarkDelete(int _LandmarkID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var DeletedLandmarkID = GEOFENCEDBHelpers.DeleteLandmark(_LandmarkID, WebConfigurationName);

            if (DeletedLandmarkID != null)
            {
                return Ok(DeletedLandmarkID);
            }
            else
            {
                return BadRequest("Failed to delete landmark.");
            }
        }

        [Authorize]
        [Route("Landmark/Update/{_LandmarkID}")]
        [HttpPost]
        public IHttpActionResult LandmarkUpdate(int _LandmarkID, Models.Geofence.Landmark _Landmark)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("GEOFENCEDB");

            var UpdatedLandmark = GEOFENCEDBHelpers.UpdateLandmark(_LandmarkID, AccountID, _Landmark, WebConfigurationName);

            if (UpdatedLandmark != null)
            {
                if (UpdatedLandmark.isExist == true)
                {
                    return BadRequest("Exist");
                }
                else
                {
                    return Ok(UpdatedLandmark);
                }
            }
            else
            {
                return BadRequest("Failed to update landmark.");
            }
        }
        #endregion

    }
}
