using Philgps_WebAPI.Models.Track;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Philgps_WebAPI.Models
{
    public class Asset
    {
        public string AssetID { get; set; }
        public string Name { get; set; }
        public string SIMNumber { get; set; }
        public int GroupID { get; set; }    
        public float FuelRatio { get; set; }
        public int? FuelTypeID { get; set; }
        public int TypeID { get; set; }
        public string TypeName { get; set; }
        public int CustomerID { get; set; }
        public bool? SendEmail { get; set; }
        public string ImageUrl { get; set; }
        public DateTime ImageRevTime { get; set; }
        public List<ImageList> ImageList { get; set; }
        public DateTime? Registration { get; set; }
        public DateTime? Insurance { get; set; }
        public DateTime? Service { get; set; }
        public DateTime? Permit { get; set; }
        public int? Schedule { get; set; }
        public int? ServiceOdo { get; set; }
        public int? ObjectOdometer { get; set; }
        public bool? isObjectOdometer { get; set; }
        public string VehicleModel { get; set; }
        public string VehicleBrand { get; set; }

    }

    public class ImageList
    {
        public int PhotoID { get; set; }
        public string Image { get; set; }
        public DateTime? RevTime { get; set; }
    }

    public class AssetPhoto
    {
        public string ObjectID { get; set; }
        public int PhotoID { get; set; }
        public string Method { get; set; }
    }

    public class AssetCamera
    {
        public string AssetID { get; set; }
        public string ImageUrl { get; set; }
        public string ImageRevTime { get; set; }
        public List<ImageList> ImageList { get; set; }
    }

    public class AssetBasic
    {
        public string AssetID { get; set; }
        public string Name { get; set; }
        public int TypeID { get; set; }
        public string TypeName { get; set; }
    }

    public class AssetType
    {
        public int AssetTypeID { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public int? ObjectOrder { get; set; }
        public string Remark { get; set; }
    }
}
