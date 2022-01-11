using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models.Track
{
    public class Delivery
    {
        public int DeliveryID { get; set; }
        public string Name { get; set; }
        public string ReferenceID { get; set; }
        public string Description { get; set; }
        public string Remarks { get; set; }
        public DateTime? CreationDateTime { get; set; }
        public DateTime? StartDateTime { get; set; }
        public DateTime? DeliveredDateTime { get; set; }
        public int? DeliveryType { get; set; }
        public string Status { get; set; }
        public DateTime? EstimatedDeliveryTime { get; set; }
        public DateTime? LastSendDateTime { get; set; }
        public DateTime? LastUpdateDateTime { get; set; }
    }

    public class DeliveryDetails
    {
        public string deliveryNumber { get; set; }
        public string orderNumber { get; set; }
        public string oldDeliveryNumber { get; set; }
        public string start_datetime { get; set; }
        public string end_datetime { get; set; }
        public string assetID { get; set; }
        public bool started { get; set; }
    }

    public class DeliveryType
    {
        public int DeliveryTypeID { get; set; }
        public string Name { get; set; }
        public bool? Enabled { get; set; }
    }

    public class DeliveryAssetAssignment
    {
        public int DeliveryAssetID { get; set; }
        public int DeliveryID { get; set; }
        public string AssetID { get; set; }
        public DateTime? AssignmentDateTime { get; set; }
    }
}