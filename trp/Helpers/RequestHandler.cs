using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace Philgps_WebAPI.Helpers
{
    public class RequestHandler
    {
        public RequestHandler()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        public static string Process(string url)
        {
            //try
            //{
            var request = (HttpWebRequest)WebRequest.Create(url);
       
            request.AutomaticDecompression = DecompressionMethods.GZip;
            HttpWebResponse HttpWResp = (HttpWebResponse)request.GetResponse();
            Stream streamResponse = HttpWResp.GetResponseStream();

            // And read it out
            StreamReader reader = new StreamReader(streamResponse);
            string response = reader.ReadToEnd();

            reader.Close();
            reader.Dispose();


            return response;
            //}
            //catch (Exception e)
            //{

            //    return e.InnerException.InnerException.Message;
            //}




        }
    }
}