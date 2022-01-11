using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Philgps_WebAPI.Models.Track
{
    public class CustomerMobile
    {
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public List<Asset> AssetList { get; set; }
        public List<TrackMobile> AssetListT { get; set; }

        public CustomerMobile()
        {
            this.AssetList = new List<Asset>();
        }
    }
}
