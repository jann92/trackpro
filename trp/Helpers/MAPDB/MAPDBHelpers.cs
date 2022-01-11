using Philgps_WebAPI.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GRM_2.Geocoding;

namespace Philgps_WebAPI.Helpers.MAPDB
{
    public static class MAPDBHelpers
    {


        public static string ReverseGeocode(Nullable<double> _Latitude, Nullable<double> _Longitude)
        {
            using (MAPDBEntities mdb = new MAPDBEntities())
            {
                mdb.Database.CommandTimeout = 3 * 60;

                if (_Latitude != null || _Longitude != null)
                {
                    var result = mdb.sp_ReverseGeocodeCM(_Latitude, _Longitude).ToList(); //sg server

                    if (result.Count() > 0)
                    {
                        return result.FirstOrDefault();
                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {
                    return null;
                }


            }
        }

        public static string ReverseGeocodeGoogle(Nullable<double> _Latitude, Nullable<double> _Longitude)
        {
            using (MAPDBEntities mdb = new MAPDBEntities())
            {

                GeoCoder gc = new GeoCoder();
                GeoCodeResult res = gc.GetGeographicInfo(_Longitude ?? 0.0, _Latitude ?? 0.0, true);
                var sta = "---";
                var n = res.results;
                if (n.Count() == 0)
                    return sta;
                else
                    return n.First().formatted_address;
            }
        }
    }
}