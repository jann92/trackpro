using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace GRM_2.Geocoding
{
    public class GeoCoder
    {
        public GeoCodeResult GetGeographicInfo(String address, bool usesSensor)
        {
            String strUrl = String.Empty;
            strUrl += "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&client=gme-philgpscorporation&sensor=" + usesSensor;
            SignUrl su = new SignUrl();

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(su.signer(strUrl));

            request.ServicePoint.Expect100Continue = false;

            request.Method = WebRequestMethods.Http.Get;
            request.Accept = "application/json";

            WebResponse response = request.GetResponse();

            string strResponse = String.Empty;

            using (var sr = new StreamReader(response.GetResponseStream()))
            {
                strResponse = sr.ReadToEnd();

                return JsonConvert.DeserializeObject<GeoCodeResult>(strResponse);
            }


       
        }

        public GeoCodeResult GetGeographicInfo(double latitude, double longitude, bool usesSensor)
        {
            String strUrl = String.Empty;
            strUrl += "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + longitude + "," + latitude + "&client=gme-philgpscorporation&sensor=" + usesSensor;
            SignUrl su = new SignUrl();

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(su.signer(strUrl));

            request.ServicePoint.Expect100Continue = false;

            request.Method = WebRequestMethods.Http.Get;
            request.Accept = "application/json";


            WebResponse response = request.GetResponse();

            string strResponse = String.Empty;

            using (var sr = new StreamReader(response.GetResponseStream()))
            {
                strResponse = sr.ReadToEnd();

                return JsonConvert.DeserializeObject<GeoCodeResult>(strResponse);
            }


        }
    }
}