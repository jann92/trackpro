using Philgps_WebAPI.DAL;
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
using Philgps_WebAPI.Helpers.MAPDB;
using System.Configuration;

namespace Philgps_WebAPI.Controllers.ObjectDelivery
{


    [RoutePrefix("Delivery")]
    public class DeliveryController : ApiController
    {
        public string DHLUsers = ConfigurationManager.AppSettings["DHL"];
        public string GroupCodeViewRoleValue = ConfigurationManager.AppSettings["GroupCodeViewRoleValue"];


        public class po_DeliveryDetails
        {
            public int objectDeliveryID { get; set; }
            public string deliveryNumber { get; set; }
            public string oldDeliveryNumber { get; set; }
            public string orderNumber { get; set; }
            public string description { get; set; }
            public string assetID { get; set; }
        }

        public class po_DHLImport
        {
            public string deliveryNumber { get; set; }
            public string customerID { get; set; }
        }

        public class po_Trigger
        {
            public int objectDeliveryID { get; set; }
            public string deliveryNumber { get; set; }
            public float longitude { get; set; }
            public float latitude { get; set; }
            public string location { get; set; }
        }

        public class po_AssignDeliver
        {
            public string deliveryNumber { get; set; }
            public string objectID { get; set; }

        }

        public class DeliveryDetails
        {
            public int objectDeliveryID { get; set; }
            public string orderNumber { get; set; }
            public string deliveryNumber { get; set; }
            public string oldDeliveryNumber { get; set; }
            public string start_datetime { get; set; }
            public string end_datetime { get; set; }
            public string assetID { get; set; }
            public bool started { get; set; }
            public string startLocation { get; set; }
            public string endLocation { get; set; }
        }

        public class ObjectDeliveryStatus
        {
            public List<string> deliveryNumberList { get; set; }
            public DateTime queryDateTime { get; set; }
            public DateTime gpsDateTime { get; set; }
            public string carRegistrationNumber { get; set; }
            public double longitude { get; set; }
            public double latitude { get; set; }
            public string location { get; set; }
        }

        [Authorize]
        [Route("DHL/Import")]
        [HttpPost]
        public IHttpActionResult DHLImport(string api_key, po_DHLImport deliveryDetails)
        {

            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {
                if (api_key.Trim().Length == 0 || api_key == null)
                {
                    return BadRequest("Invalid api_key.");
                }

                if (deliveryDetails.deliveryNumber.Trim().Length == 0 || deliveryDetails.deliveryNumber == null)
                {
                    return BadRequest("Invalid delivery number.");
                }

                if (tfdb.PGPS_ObjectDelivery.Where(x => x.delivery_number == deliveryDetails.deliveryNumber.Trim()).Count() > 0)
                {
                    return BadRequest("Delivery number already exist.");
                }

                var keyList = tfdb.S_SysUser.Where(x => x.api_key == api_key);

                if (keyList.Count() > 0)
                {

                    var keyOwner = keyList.FirstOrDefault();

                    if (keyOwner.api_status == true)
                    {
                        tfdb.PGPS_ObjectDelivery.Add(new PGPS_ObjectDelivery()
                        {
                            delivery_number = deliveryDetails.deliveryNumber,
                            description = deliveryDetails.customerID,
                            user_id = keyOwner.UserID,
                            creation_datetime = DateTime.Now,
                            enabled = false,
                            remarks = "DHL"
                        });
                        tfdb.SaveChanges();
                        return Ok(deliveryDetails);
                    }
                    else
                    {
                        return BadRequest("api_key is disabled");
                    }
                }
                else
                {
                    return BadRequest("api_key is wrong.");
                }

            }

        }

        //[Authorize]
        [Route("DHL/Import/Bulk")]
        [HttpPost]
        public IHttpActionResult DHLImportBulk(string api_key, List<po_DHLImport> deliveryDetailsList)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {
                foreach (var deliveryDetails in deliveryDetailsList)
                {
                    if (api_key.Trim().Length == 0 || api_key == null)
                    {
                        return BadRequest("Invalid api_key.");
                    }

                    if (deliveryDetails.deliveryNumber.Trim().Length == 0 || deliveryDetails.deliveryNumber == null)
                    {
                        return BadRequest("Invalid delivery number.");
                    }

                    if (tfdb.PGPS_ObjectDelivery.Where(x => x.delivery_number == deliveryDetails.deliveryNumber.Trim()).Count() > 0)
                    {
                        return BadRequest("Delivery number already exist.");
                    }

                    var keyList = tfdb.S_SysUser.Where(x => x.api_key == api_key);

                    if (keyList.Count() > 0)
                    {
                        var keyOwner = keyList.FirstOrDefault();

                        if (keyOwner.api_status == true)
                        {
                            tfdb.PGPS_ObjectDelivery.Add(new PGPS_ObjectDelivery()
                            {
                                delivery_number = deliveryDetails.deliveryNumber,
                                description = deliveryDetails.customerID,
                                user_id = keyOwner.UserID,
                                creation_datetime = DateTime.Now,
                                enabled = false,
                                remarks = "DHL"
                            });
                        }
                        else
                        {
                            return BadRequest("api_key is disabled");
                        }
                    }
                    else
                    {
                        return BadRequest("api_key is wrong.");
                    }
                }
                tfdb.SaveChanges();
                return Ok("Success!");
            }
        }

        [Authorize]
        [Route("Create")]
        [HttpPost]
        public IHttpActionResult CreateDelivery(po_DeliveryDetails deliveryDetails)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");


            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {

                var existDN = tfdb.PGPS_ObjectDelivery.Where(x => x.delivery_number == deliveryDetails.oldDeliveryNumber).ToList();
                var od = new PGPS_ObjectDelivery();

                if (existDN.Count() > 0)
                {
                    od = existDN.FirstOrDefault();
                    if (od.cancelled == true)
                    {
                        od.start_datetime = null;
                        od.cancelled = null;
                        od.object_id = deliveryDetails.assetID;
                        od.object_name = tfdb.A_ObjectInfo.Where(x => x.ObjectID == deliveryDetails.assetID).FirstOrDefault().ObjectRegNum;
                        od.creation_datetime = DateTime.Now;
                        od.order_number = deliveryDetails.orderNumber;
                        od.delivery_number = deliveryDetails.deliveryNumber;
                        od.description = deliveryDetails.description;
                        od.remarks = null;
                        od.enabled = false;
                        od.process_auto = false;
                        od.user_id = AccountID;
                    }
                    else
                    {
                        return BadRequest("The delivery number you are trying to add already exist");
                    }
                }
                else
                {
                    od.object_id = deliveryDetails.assetID;
                    od.object_name = tfdb.A_ObjectInfo.Where(x => x.ObjectID == deliveryDetails.assetID).FirstOrDefault().ObjectRegNum;
                    od.creation_datetime = DateTime.Now;
                    od.delivery_number = deliveryDetails.deliveryNumber;
                    od.order_number = deliveryDetails.orderNumber;
                    od.description = deliveryDetails.description;
                    od.remarks = null;
                    od.enabled = false;
                    od.process_auto = false;
                    //od.user_id = AccountID;

                    tfdb.PGPS_ObjectDelivery.Add(od);
                    tfdb.SaveChanges();


                }
                return Ok("Successfully Added");
            }
        }

        [Authorize]
        [Route("Delete/{objectDeliveryID}")]
        [HttpPost]
        public IHttpActionResult DeleteDelivery(int objectDeliveryID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {


                //if (deliveryNumber == null || deliveryNumber.Trim().Length < 1)
                //{
                //    return BadRequest("Delivery number invalid");
                //}
                var odf = tfdb.PGPS_ObjectDelivery.Where(x => x.object_delivery_id == objectDeliveryID).ToList();

                if(odf.Count() > 0)
                {
                    tfdb.PGPS_ObjectDelivery.Remove(odf.FirstOrDefault());
                    tfdb.SaveChanges();
                    return Ok("Delivery deleted");
                }
                else
                {
                    return BadRequest("Failed to delete");
                }

               
            }
        }

        [Authorize]
        [Route("Cancel/{objectDeliveryID}")]
        [HttpPost]
        public IHttpActionResult CancelDelivery(int objectDeliveryID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {


                var res = tfdb.PGPS_ObjectDelivery.Where(x => x.object_delivery_id == objectDeliveryID).ToList();

                if (res.Count() > 0)
                {
                    var o = res.FirstOrDefault();

                    //   foreach(var o in res)
                    //    {
                    o.enabled = false;
                    o.start_datetime = null;
                    o.start_longitude = null;
                    o.start_latitude = null;
                    o.start_location = null;
                    o.cancelled = true;
                    //    }


                }


                //tfdb.PGPS_ObjectDelivery.Remove(odf);

                tfdb.SaveChanges();
                return Ok("Delivery cancelled");
            }
        }

        [Authorize]
        [Route("Modify")]
        [HttpPost]
        public IHttpActionResult ModifyDelivery(po_DeliveryDetails deliveryDetails)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {


                //if (deliveryDetails.oldDeliveryNumber == null || deliveryDetails.oldDeliveryNumber.Trim().Length < 1)
                //{
                //    return BadRequest("Delivery number invalid");
                //}

                //if (deliveryDetails.deliveryNumber == null || deliveryDetails.deliveryNumber.Trim().Length < 1)
                //{
                //    return BadRequest("New delivery number invalid");
                //}

                //var on = tfdb.PGPS_ObjectDelivery.Where(x => x.delivery_number == deliveryDetails.deliveryNumber && x.delivery_number != deliveryDetails.oldDeliveryNumber).ToList();

                //if (on.Count() > 0)
                //{
                //    return BadRequest("Delivery number already exist");
                //}

                //var od = tfdb.PGPS_ObjectDelivery.Where(x => x.delivery_number == deliveryDetails.oldDeliveryNumber && x.object_delivery_id == deliveryDetails.objectDeliveryID).FirstOrDefault();
                var od = tfdb.PGPS_ObjectDelivery.Where(x => x.object_delivery_id == deliveryDetails.objectDeliveryID).FirstOrDefault();


                od.object_name = tfdb.A_ObjectInfo.Where(x => x.ObjectID == deliveryDetails.assetID).FirstOrDefault().ObjectRegNum;
                od.delivery_number = deliveryDetails.deliveryNumber;
                od.order_number = deliveryDetails.orderNumber;
                od.description = deliveryDetails.description;


                tfdb.SaveChanges();
                return Ok("Changes saved");
            }
        }

        [Authorize]
        [Route("Start")]
        [HttpPost]
        public IHttpActionResult StartDelivery(po_Trigger deliveryTrigger)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {

                if (deliveryTrigger.deliveryNumber == null || deliveryTrigger.deliveryNumber.Trim().Length < 1)
                {
                    return BadRequest("Delivery number invalid");
                }

                var odf = tfdb.PGPS_ObjectDelivery.Where(x => x.delivery_number == deliveryTrigger.deliveryNumber && x.object_delivery_id == deliveryTrigger.objectDeliveryID).FirstOrDefault();
                //var odf = tfdb.PGPS_ObjectDelivery.Where(x => x.delivery_number == deliveryTrigger.deliveryNumber).ToList();

                //if(odf.Count() > 0)
                //{
                //    foreach(var o in odf.ToList())
                //    {
                        odf.start_datetime = DateTime.Now;
                        odf.start_latitude = deliveryTrigger.latitude;
                        odf.start_longitude = deliveryTrigger.longitude;
                        //odf.start_location = MAPDBHelpers.ReverseGeocodeGoogle(deliveryTrigger.latitude, deliveryTrigger.longitude);
                        odf.start_location = MAPDBHelpers.ReverseGeocode(deliveryTrigger.latitude, deliveryTrigger.longitude);
                        odf.enabled = true;
                //    }
                //}
                tfdb.SaveChanges();

                return Ok("Delivery started");
            }
        }

        [Authorize]
        [Route("Complete")]
        [HttpPost]
        public IHttpActionResult CompleteDelivery(po_Trigger deliveryTrigger)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {


                if (deliveryTrigger.deliveryNumber == null || deliveryTrigger.deliveryNumber.Trim().Length < 1)
                {
                    return BadRequest("Delivery number invalid1");
                }

                var odf = tfdb.PGPS_ObjectDelivery.Where(x => x.delivery_number == deliveryTrigger.deliveryNumber && x.object_delivery_id == deliveryTrigger.objectDeliveryID).FirstOrDefault();
                //var odf = tfdb.PGPS_ObjectDelivery.Where(x => x.delivery_number == deliveryTrigger.deliveryNumber).ToList();

                //if(odf.Count() > 0)
                //{
                //    foreach (var o in odf)
                //    {
                        odf.end_datetime = DateTime.Now;
                        odf.end_latitude = deliveryTrigger.latitude;
                        odf.end_longitude = deliveryTrigger.longitude;
                        //odf.end_location = MAPDBHelpers.ReverseGeocodeGoogle(deliveryTrigger.latitude, deliveryTrigger.longitude);
                        odf.end_location = MAPDBHelpers.ReverseGeocode(deliveryTrigger.latitude, deliveryTrigger.longitude);
                        odf.enabled = false;
                //    }
                //}


              
                tfdb.SaveChanges();
                return Ok("Delivery completed");
            }
        }

        [Authorize]
        [Route("List/Completed/{objectID}")]
        [HttpGet]
        public IHttpActionResult DeliveryCompletedList(string objectID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");


            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {


                if (objectID == null || objectID.Trim().Length < 1)
                {
                    return BadRequest("Asset ID invalid");
                }



                var dfl = (from n in tfdb.PGPS_ObjectDelivery.ToList()
                           where n.object_id == objectID
                           && n.end_datetime != null
                           //&& n.user_id == AccountID
                           select new DeliveryDetails()
                           {
                               orderNumber = n.order_number,
                               oldDeliveryNumber = n.delivery_number,
                               end_datetime = (n.end_datetime == null) ? null : n.end_datetime.Value.ToString("yyyy-MM-dd HH:mm"),
                               start_datetime = (n.start_datetime == null) ? null : n.start_datetime.Value.ToString("yyyy-MM-dd HH:mm"),
                               assetID = n.object_id,
                               //startLocation = (n.start_location != "" && n.start_location != null) ? n.start_location : MAPDBHelpers.ReverseGeocodeGoogle(n.start_latitude, n.start_longitude),
                               //endLocation = (n.end_location != "" && n.start_location != null) ? n.end_location : MAPDBHelpers.ReverseGeocodeGoogle(n.end_latitude, n.end_longitude)
                               startLocation = (n.start_location != "" && n.start_location != null) ? n.start_location : MAPDBHelpers.ReverseGeocode(n.start_latitude, n.start_longitude),
                               endLocation = (n.end_location != "" && n.start_location != null) ? n.end_location : MAPDBHelpers.ReverseGeocode(n.end_latitude, n.end_longitude)
                           }).ToList();

                return Ok(dfl);


            }
        }

        [Authorize]
        [Route("List/Current/{_objectID}")]
        [HttpGet]
        public IHttpActionResult DeliveryCurrentList(string _objectID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");


            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {

                //var dfl = (from n in tfdb.PGPS_ObjectDelivery.ToList()
                //           where n.object_id == _objectID
                //           // && n.user_id == AccountID
                //           && n.end_datetime == null
                //           && (n.cancelled == null
                //           || n.cancelled == false)
                //           select new DeliveryDetails()
                //           {
                //               objectDeliveryID = n.object_delivery_id,
                //               orderNumber = n.order_number,
                //               oldDeliveryNumber = n.delivery_number,
                //               end_datetime = (n.end_datetime == null) ? null : n.end_datetime.Value.ToString("yyyy-MM-dd HH:mm"),
                //               start_datetime = (n.start_datetime == null) ? null : n.start_datetime.Value.ToString("yyyy-MM-dd HH:mm"),
                //               assetID = n.object_id,
                //               started = (n.start_datetime == null) ? false : true
                //           }).ToList();

                var dfl = (from i in tfdb.sp_pgps_get_ObjectDelivery(_objectID).ToList()
                           select new DeliveryDetails() {
                               objectDeliveryID = i.object_delivery_id ?? 0,
                               orderNumber = i.order_number,
                               oldDeliveryNumber = i.delivery_number,
                               start_datetime = (i.start_datetime == null ? null : i.start_datetime.Value.ToString("yyyy-MM-dd HH:mm")),
                               end_datetime = (i.end_datetime == null ? null : i.end_datetime.Value.ToString("yyyy-MM-dd HH:mm")),
                               assetID = i.object_id,
                               started = i.started ?? false
                           }).ToList();
                
                return Ok(dfl);

            }
        }

        [Authorize]
        [Route("List/Status/{objectID}")]
        [HttpGet]
        public IHttpActionResult DeliveryStatus(string objectID)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {


                if (objectID == null || objectID.Trim().Length < 1)
                {
                    return BadRequest("Asset ID invalid");
                }

                var dfnl = (from n in tfdb.PGPS_ObjectDelivery
                            where n.object_id == objectID
                            && n.end_datetime == null
                            && n.user_id == AccountID
                            //&& n.remarks == "DHL"
                            select n);


                var dfl = (from at in tfdb.A_ActiveTracks.ToList()
                           where at.ObjectID == objectID
                           select new ObjectDeliveryStatus()
                           {
                               gpsDateTime = at.GPSTime ?? DateTime.Now,
                               carRegistrationNumber = at.ObjectID,
                               location = MAPDBHelpers.ReverseGeocode(at.Lat.Value.decToDbl(), at.Lon.Value.decToDbl()),
                               queryDateTime = DateTime.Now,
                               longitude = at.Lon.Value.decToDbl(),
                               latitude = at.Lat.Value.decToDbl(),
                               deliveryNumberList = new List<string>()
                           }).ToList();


                foreach (var dfn in dfnl)
                {
                    dfl.FirstOrDefault().deliveryNumberList.Add(dfn.delivery_number);
                }

                return Ok(dfl.FirstOrDefault());
            }
        }


        [Authorize]
        [Route("Assign")]
        [HttpPost]
        public IHttpActionResult AssignDelivery(po_AssignDeliver deliveryAssign)
        {
            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {

                //var userid = Claims.Where(x => x.Type == "user_id").FirstOrDefault().Value.ToString().strToInt();

                if (deliveryAssign.deliveryNumber == null || deliveryAssign.deliveryNumber.Trim().Length < 1)
                {
                    return BadRequest("Delivery number invalid");
                }

                if (deliveryAssign.objectID == null || deliveryAssign.objectID.Trim().Length < 1)
                {
                    return BadRequest("Delivery number invalid");
                }

                var odfList = tfdb.PGPS_ObjectDelivery.Where(x => x.delivery_number == deliveryAssign.deliveryNumber);
                var objList = tfdb.A_ObjectInfo.Where(x => x.ObjectID == deliveryAssign.objectID);
                if (odfList.Count() > 0)
                {
                    if (objList.Count() > 0)
                    {
                        var odf = odfList.FirstOrDefault();

                        odf.object_id = deliveryAssign.objectID;
                        //return Ok(deliveryAssign.objectID);
                        odf.object_name = objList.FirstOrDefault().ObjectRegNum;

                        tfdb.SaveChanges();
                        return Ok("Successfully Assign");
                    }
                    else
                    {
                        return BadRequest("AssetID invalid");
                    }
                }
                else
                {
                    return BadRequest("Delivery number invalid");
                }


            }
        }


        [Authorize]
        [Route("List/Unassigned")]
        [HttpGet]
        public IHttpActionResult DeliveryUnassignedList()
        {

            var Identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> Claims = Identity.Claims;
            int AccountID = Claims.Where(x => x.Type == "AccountID").FirstOrDefault().Value.ToString().strToInt();
            string Groupcodes = Claims.Where(x => x.Type == "Groupcodes").FirstOrDefault().Value.ToString();
            string ConfigurationName = Claims.Where(x => x.Type == "ConfigurationName").FirstOrDefault().Value.ToString();
            string WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");

            using (TFDBEntities tfdb = new TFDBEntities(WebConfigurationName))
            {

                var dfl = (from n in tfdb.PGPS_ObjectDelivery.ToList()
                               //where n.object_id == null && n.remarks == "DHL" && n.user_id == AccountID
                           where n.object_id == null
                           && n.user_id == AccountID
                           select new DeliveryDetails()
                           {
                               oldDeliveryNumber = n.delivery_number,
                               orderNumber = n.order_number
                           }).ToList();
                return Ok(dfl);

            }
        }
    }
}
