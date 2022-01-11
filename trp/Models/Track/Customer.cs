using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Philgps_WebAPI.Models.Track
{
    public class Customer
    {
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public List<Asset> AssetList { get; set; }

        public Customer()
        {
            this.AssetList = new List<Asset>();
        }
    }

    public class CustomerTrack
    {
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public int? ParentAccount { get; set; }
        public List<Track> AssetList { get; set; }
        public CustomerTrack()
        {
            this.AssetList = new List<Track>();
        }
    }

    public class CustomerListTrack
    {
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public int? ParentAccount { get; set; }
        public List<TrackList> AssetList { get; set; }
        public CustomerListTrack()
        {
            this.AssetList = new List<TrackList>();
        }
    }


    public class CustomerAssignedAssetsEmail
    {
        public string CustomerEmail { get; set; }
        public List<CustomerAssignedAssetsEmailList> AssignedAssetsEmailList { get; set; }

        public CustomerAssignedAssetsEmail()
        {
            this.AssignedAssetsEmailList = new List<CustomerAssignedAssetsEmailList>();
        }
    }

    public class CustomerAssignedAssetsEmailList
    {
        public string AssetID { get; set; }
        public string AssetName { get; set; }
        public bool? SendEmail { get; set; }
    }


}
