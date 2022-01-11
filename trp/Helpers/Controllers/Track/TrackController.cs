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
using Philgps_WebAPI.Helpers;
using Philgps_WebAPI.Models.Track;
using System.Configuration;
using System.IO;
using System.IO.Compression;
using System.Drawing;
using System.Web.Hosting;
using System.Net.Mail;

namespace Philgps_WebAPI.Controllers.Track
{
    public class DateTimeRange
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }

    //[Authorize]
    [RoutePrefix("Track")]
    public class TrackController : ApiController
    {
        public string PhotosDirectory = ConfigurationManager.AppSettings["PhotosDirectory"];
        public string PhotosURL = ConfigurationManager.AppSettings["PhotosURL"];
        public string GroupCodeViewRoleValue = ConfigurationManager.AppSettings["GroupCodeViewRoleValue"];
        public int MaxHistoryQuery = ConfigurationManager.AppSettings["MaxHistoryQuery"].strToInt();
        public string AssignRoleValue = ConfigurationManager.AppSettings["AssignRoleValue"];

        private List<ImageList> GetPhotoUrl(string ObjectId,int PhotoCount)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            List<ImageList> imageList = new List<ImageList>();

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {
                var pho = (from a in tfdb.A_ObjectPhoto
                           where a.ObjectID == ObjectId
                           //where a.PhotoID != 2144
                           orderby a.RevTime descending
                           select a).Take(PhotoCount).ToList();
                if (pho.Count() > 0)
                {

                    foreach (var p in pho.ToList())
                    {
                        //string fileName = ObjectId + "_" + pho.FirstOrDefault().RevTime.Value.ToString("mmddyyhhmmss");
                        string fileName = ObjectId + "_" + p.RevTime.Value.ToString("mmddyyhhmmss");
                        string filedir = PhotosDirectory + fileName + ".jpg";
                        if (File.Exists(filedir))
                        {
                            //return PhotosURL + fileName + ".jpg";
                            var photoImg = PhotosURL + fileName + ".jpg";
                            imageList.Add(new ImageList() { Image = photoImg, RevTime = p.RevTime, PhotoID = p.PhotoID });
                            //return imageList.ToList();
                        }
                        else
                        {
                            using (var m = new MemoryStream(p.PhotoData))
                            {
                                var img = Image.FromStream(m);
                                img.Save(filedir);
                                var photoImg = PhotosURL + fileName + ".jpg";
                                imageList.Add(new ImageList() { Image = photoImg, RevTime = p.RevTime,PhotoID = p.PhotoID });
                                //return imageList.ToList();
                            }
                        }
                    }
                    return imageList.ToList();
                }
                else
                {
                    return imageList.ToList();
                }
            }
        }


        private  List<ImageList> GetPhoto(string ObjectId,int PhotoID,string Method)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            List<ImageList> imageList = new List<ImageList>();

             using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
             {

                 if (Method == "Next")
                 {
                   var res = (from a in tfdb.A_ObjectPhoto
                            where a.ObjectID == ObjectId
                            orderby a.RevTime ascending
                            select a).ToList();

                   if (res.Count() > 0) {

                       var pho = res.SkipWhile(x=> x.PhotoID != PhotoID).Skip(1).Take(1).FirstOrDefault();
                       
                       string fileName = ObjectId + "_" + pho.RevTime.Value.ToString("mmddyyhhmmss");
                       string filedir = PhotosDirectory + fileName + ".jpg";

                       if (File.Exists(filedir))
                       {
                           var photoImg = PhotosURL + fileName + ".jpg";
                           imageList.Add(new ImageList() { Image = photoImg, RevTime = pho.RevTime, PhotoID = pho.PhotoID });
                       }
                       else
                       {
                           using (var m = new MemoryStream(pho.PhotoData))
                           {
                               var img = Image.FromStream(m);
                               img.Save(filedir);
                               var photoImg = PhotosURL + fileName + ".jpg";
                               imageList.Add(new ImageList() { Image = photoImg, RevTime = pho.RevTime, PhotoID = pho.PhotoID });
                           }
                       }
                   }
                     
                     
                 }
                 else if(Method == "Prev")
                 {
                     var res = (from a in tfdb.A_ObjectPhoto
                                where a.ObjectID == ObjectId
                                orderby a.RevTime descending
                                select a).ToList();

                     if (res.Count() > 0)
                     {

                         var pho = res.SkipWhile(x => x.PhotoID != PhotoID).Skip(1).Take(1).FirstOrDefault();
                         string fileName = ObjectId + "_" + pho.RevTime.Value.ToString("mmddyyhhmmss");
                         string filedir = PhotosDirectory + fileName + ".jpg";

                         if (File.Exists(filedir))
                         {
                             var photoImg = PhotosURL + fileName + ".jpg";
                             imageList.Add(new ImageList() { Image = photoImg, RevTime = pho.RevTime, PhotoID = pho.PhotoID });
                         }
                         else
                         {
                             using (var m = new MemoryStream(pho.PhotoData))
                             {
                                 var img = Image.FromStream(m);
                                 img.Save(filedir);
                                 var photoImg = PhotosURL + fileName + ".jpg";
                                 imageList.Add(new ImageList() { Image = photoImg, RevTime = pho.RevTime, PhotoID = pho.PhotoID });
                             }
                         }
                     }
                 }
                 return imageList.ToList();
            }
        }

        #region asset
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
            bool groupcodeview = AccountID.IsRoleEnabled(new int[] { GroupCodeViewRoleValue.ToString().strToInt() }, WebConfigurationName);

            if (groupcodeview)
            {
                var result = Groupcodes.GetAssetListGroupcode(WebConfigurationName);
                if (result != null)
                {
                    result.ForEach(x => x.AssetList.OrderBy(y => y.Name));
                    return Ok(result.OrderBy(x => x.CustomerName).ToList());
                }
                else
                {
                    return BadRequest("No Data.");
                }

            }
            else
            {

                var CustomerList = AccountID.GetAssetListAccount(WebConfigurationName);
                if (CustomerList != null)
                {

                    CustomerList.ForEach(x => x.AssetList.OrderBy(y => y.Name));
                    return Ok(CustomerList.OrderBy(x => x.CustomerName));
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

            if (_AssetID.Length == 0 || _AssetID == null) {
                return BadRequest("Invalid Asset ID");
            }
            var result = TFDBHelpers.GetAssetGPS(_AssetID, WebConfigurationName);
            if (result != null)
            {


                var getimage = GetPhotoUrl(result.AssetID,5);
                if (getimage.Count() > 0)
                {
                    result.ImageUrl = getimage.FirstOrDefault().Image ?? null;
                    result.ImageList = getimage.OrderBy(x=> x.RevTime).ToList() ?? null;
                    result.ImageRevTime = getimage.FirstOrDefault().RevTime.Value.ToString("yyyy-MM-dd HH:mm:ss \"GMT\"zzz") ?? DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss \"GMT\"zzz");
                }
                else
                {
                    result.ImageUrl = "";
                    result.ImageRevTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss \"GMT\"zzz");
                }

                return Ok(result);

            }
            else
            {
                return Ok(new Models.Track.Track());
               // return BadRequest("No Data");
            }

        }

        [Authorize]
        [Route("Asset/GPSInfo/{_AssetID}")]
        [HttpGet]
        public IHttpActionResult GetAssetGPSInfo(string _AssetID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            if (_AssetID.Length == 0 || _AssetID == null)
            {
                return BadRequest("Invalid Asset ID");
            }
            var result = TFDBHelpers.GetAssetGPSInfo(_AssetID, WebConfigurationName);
            if (result != null)
            {

                var getimage = GetPhotoUrl(result.AssetID,5);
                if (getimage.Count() > 0)
                {
                    result.ImageUrl = getimage.FirstOrDefault().Image ?? null;
                    result.ImageList = getimage.OrderBy(x=> x.RevTime).ToList() ?? null;
                    result.ImageRevTime = getimage.FirstOrDefault().RevTime.Value.ToString("yyyy-MM-dd HH:mm:ss \"GMT\"zzz") ?? DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss \"GMT\"zzz");
                }
                else
                {
                    result.ImageUrl = "";
                    result.ImageRevTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss \"GMT\"zzz");
                }

                return Ok(result);

            }
            else
            {
                return Ok(new Models.Track.Track());
            }

        }

        [Authorize]
        [Route("Asset/NextPrev/Photo")]
        [HttpPost]
        public IHttpActionResult GetNextPrevPhoto(Models.AssetPhoto AssetPhoto)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {
                var auca = AssetPhoto;
                var result = GetPhoto(AssetPhoto.ObjectID, AssetPhoto.PhotoID, AssetPhoto.Method);

                return Ok(result);
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

                var result = Groupcodes.GetAssetTotalCount(WebConfigurationName);
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
                return BadRequest("No Data");

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

            var result = TFDBHelpers.GetAssetGPSHistory(_AssetID, Start, End, WebConfigurationName);
            return Ok(result);

        }

        [Authorize]
        [Route("Asset/Type/List")]
        [HttpGet]
        public IHttpActionResult GetAssetTypeList()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var AssetTypeList = TFDBHelpers.GetAssetTypeList(WebConfigurationName);
            if (AssetTypeList != null)
            {
                return Ok(AssetTypeList.OrderBy(x => x.ObjectOrder));
            }
            else
            {
                return BadRequest("No Data");
            }
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

            var UpdatedAsset = TFDBHelpers.UpdateAssetSettings(_AssetID, _Asset, WebConfigurationName);
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
        [Route("Asset/History/Export/{_AssetID}")]
        [HttpPost]
        public IHttpActionResult GetAssetGPSHistoryRow(string _AssetID, DateTimeRange _DateTimeRange)
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

            //if (End.Subtract(Start).TotalHours > MaxHistoryQuery)
            //{
            //    return BadRequest("You can only query history for maximum of " + MaxHistoryQuery.ToString() + " hours.");
            //}

            var result = TFDBHelpers.GetAssetGPSHistoryRow(_AssetID, Start, End, WebConfigurationName);
            return Ok(result);
        }
        #endregion

   
        #region email

        [Authorize]
        [Route("Customer/Assigned/Asset/Email/Update/{_CustomerID}")]
        [HttpPost]
        public IHttpActionResult CustomerAssignedAssetEmailUpdate(int _CustomerID, Models.Track.CustomerAssignedAssetsEmail auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            //Roles
            bool assignrole = AccountID.IsRoleEnabled(new int[] { AssignRoleValue.ToString().strToInt() }, WebConfigurationName);

            if (assignrole)
            {
                TFDBHelpers.CustomerAssignedAssetEmailUpdate(auca, _CustomerID, WebConfigurationName);
                return Ok(auca);
            }
            else
            {
                return BadRequest("Not allowed");
            }

        }

        [Authorize]
        [Route("User/Email/Update")]
        [HttpPost]
        public IHttpActionResult UserEmailUpdate(Models.Account auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.UserEmailUpdate(auca, AccountID, WebConfigurationName);
            return Ok(auca);
        }

        //[Authorize]
        [Route("User/Email/Get")]
        [HttpPost]
        public IHttpActionResult UserEmailSend(Models.AccountRecovery auca)
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var randomPass = new string(Enumerable.Repeat(chars, 10).Select(s => s[random.Next(s.Length)]).ToArray());
            var newPass = "Philgps" + randomPass;
            string WebConfigurationName = "TFDBEntities";

            var getData = TFDBHelpers.getUserEmail(auca, WebConfigurationName);
            if (getData != null)
            {
                var userEmail = getData.FirstOrDefault().Email;
                var lastEmailUpdate = getData.FirstOrDefault().LastEmailUpdate;
                if (userEmail != null)
                {
                    TimeSpan checktime = DateTime.Now.Subtract(lastEmailUpdate ?? DateTime.Now);
                    if (checktime.TotalMinutes > 30)
                    {

                        TFDBHelpers.updateLastEmailTime(getData.FirstOrDefault().AccountID, WebConfigurationName);

                        TFDBHelpers.changePasswordRecovery(auca, WebConfigurationName, newPass);
                    }
                    else
                    {
                        return BadRequest("You already send request.");
                    }
                    return Ok(userEmail);

                }
                else
                {
                    return BadRequest("There is no email address linked with your account, please send an email to <a href='mailto:support@philgps.com?subject=Forgot Password, Email not provided'>support@philgps.com</a>");
                }
            }
            else
            {
                return BadRequest("Username does not exist.");
            }

        }

        #endregion

        #region Reports

        [Authorize]
        [Route("Reports/Type/List")]
        [HttpGet]
        public IHttpActionResult GetReportsList()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var result = TFDBHelpers.GetReportTypeList(WebConfigurationName);

            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return Ok("No Data");
            }

        }


        [Authorize]
        [Route("Reports/Type/List/{_CustomerID}")]
        [HttpGet]
        public IHttpActionResult GetCustomerReportList(int _CustomerID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var result = TFDBHelpers.GetCustomerReportList(_CustomerID, WebConfigurationName);

            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return Ok("No Data");
            }

        }

        [Authorize]
        [Route("Reports/Type/Assign/{_CustomerID}")]
        [HttpPost]
        public IHttpActionResult AssignReportType(int _CustomerID, List<CustomerReports> auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.AssignReportType(auca, _CustomerID, WebConfigurationName);
            return Ok(auca);
        }
        #endregion

        #region driver

        [Authorize]
        [Route("Driver/List")]
        [HttpGet]
        public IHttpActionResult GetDriverList()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var customerList = Groupcodes.GetCustomerListGroupcode(WebConfigurationName).ToList();

            var driverList = TFDBHelpers.GetDriverList(AccountID, Groupcodes, WebConfigurationName);

            var result = (from i in driverList.ToList()
                          where customerList.Any(x => x.CustomerID == i.CustomerID)
                          select i).ToList();

            return Ok(result);

        }

        [Authorize]
        [Route("Driver/Simulate")]
        [HttpPost]
        public IHttpActionResult SimulateDriver(DriverTag auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.SimulateDriverTag(auca, WebConfigurationName);
            return Ok(auca);


        }

        [Authorize]
        [Route("Driver/Add")]
        [HttpPost]
        public IHttpActionResult AddDriver(Models.Driver auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.AddDriver(auca, WebConfigurationName);
            return Ok(auca);
        }

        [Authorize]
        [Route("Driver/Update")]
        [HttpPost]
        public IHttpActionResult UpdateDriver(Models.Driver auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.UpdateDriver(auca, WebConfigurationName);
            return Ok(auca);
        }

        [Authorize]
        [HttpPost]
        [Route("Driver/Delete")]
        public IHttpActionResult DeleteDriver(Models.Driver auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.DeleteDriver(auca, WebConfigurationName);
            return Ok(auca);
        }

        [Authorize]
        [HttpPost]
        [Route("Driver/Asset/Assign/Update/{_DriverID}")]
        public IHttpActionResult DriverAssetUpdate(int _DriverID, List<DriverAssignedAssets> auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.UpdateDriverAssignedAssetList(auca, _DriverID, WebConfigurationName);
            return Ok(auca);
        }

        [Authorize]
        [HttpGet]
        [Route("Driver/Asset/Assign/List/{_DriverID}")]
        public IHttpActionResult DriverAssetAssignList(int _DriverID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var result = TFDBHelpers.GetDriverAssignedAssetList(_DriverID, WebConfigurationName);
            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        [Route("Asset/Driver/Assign/Update/{_AssetID}")]
        public IHttpActionResult AssetDriverUpdate(string _AssetID, List<AssetAssignedDrivers> auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.UpdateAssetAssignedDriverList(auca, _AssetID, WebConfigurationName);
            return Ok(auca);
        }

        [Authorize]
        [HttpGet]
        [Route("Asset/Driver/Assign/List/{_AssetID}")]
        public IHttpActionResult AssetDriverAssignList(string _AssetID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var result = TFDBHelpers.GetAssetAssignedDriverList(_AssetID, WebConfigurationName);
            return Ok(result);
        }

        [Authorize]
        [HttpGet]
        [Route("Driver/Assign/List/{_AssetID}")]
        public IHttpActionResult AssignDriverList(string _AssetID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var assignDriverList = TFDBHelpers.GetAssignDriverList(_AssetID, AccountID, WebConfigurationName);

            var customerList = Groupcodes.GetCustomerListGroupcode(WebConfigurationName).ToList();

            var result = (from i in assignDriverList.ToList()
                          //where customerList.Any(x=> x.CustomerID == i.CustomerID)
                          select i).ToList();

            return Ok(assignDriverList);

        }

        [Authorize]
        [HttpPost]
        [Route("Driver/Assign/Remove")]
        public IHttpActionResult DriverAssignRemove(Models.AssignDriver auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.RemoveDriverAssignment(auca, WebConfigurationName);
            return Ok(auca);
        }

        [Authorize]
        [HttpGet]
        [Route("Driver/Active/List/{_AssetID}")]
        public IHttpActionResult ActiveDriverList(string _AssetID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var activeDriverList = TFDBHelpers.GetActiveDriverList(_AssetID, AccountID, WebConfigurationName);

            return Ok(activeDriverList);
        }

        [Authorize]
        [HttpPost]
        [Route("Driver/SetActive/")]
        public IHttpActionResult SetActiveDriver(Models.ActiveDriver _driver)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.SetActiveDriver(_driver, WebConfigurationName);

            return Ok(_driver);
        }

        [Authorize]
        [HttpPost]
        [Route("Driver/RemoveActive/")]
        public IHttpActionResult RemoveActiveDriver(Models.ActiveDriver _driver)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.RemoveActiveDriver(_driver, WebConfigurationName);

            return Ok("Remove Active Successfully");
        }

        [Authorize]
        [HttpPost]
        [Route("Driver/RemoveCurrentActive")]
        public IHttpActionResult RemoveCurrentActive(Models.ActiveDriver _driver)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.RemoveCurrentActiveDriver(_driver, WebConfigurationName);

            return Ok("Remove Current Active successfully");
        }

        [Authorize]
        [HttpGet]
        [Route("Driver/History/List/{_AssetID}")]
        public IHttpActionResult HistoryDriverList(string _AssetID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var historyDriverList = TFDBHelpers.GetAssetHistoryDriversList(_AssetID, WebConfigurationName);

            return Ok(historyDriverList);
        }


        #endregion

        #region notification
        [Authorize]
        [Route("Notification/Type/List")]
        [HttpGet]
        public IHttpActionResult GetNotificationTypes()
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            var result = TFDBHelpers.GetNotificationTypes(AccountID, WebConfigurationName);

            return Ok(result);
        }

        [Authorize]
        [Route("Notification/Update")]
        [HttpPost]
        public IHttpActionResult NotificationUpdate(Models.Track.UserSettings auca)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            TFDBHelpers.UpdateNotification(auca, AccountID, WebConfigurationName);
            return Ok(auca);
        }

        #endregion
    }
}
