using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace GRM_2.Geocoding
{
    public struct GoogleSignedUrl
    {

        public static string Sign(string url, string keyString)
        {
            ASCIIEncoding encoding = new ASCIIEncoding();

            // converting key to bytes will throw an exception, need to replace '-' and '_' characters first.
            string usablePrivateKey = keyString.Replace("-", "+").Replace("_", "/");
            byte[] privateKeyBytes = Convert.FromBase64String(usablePrivateKey);

            Uri uri = new Uri(url);
            byte[] encodedPathAndQueryBytes = encoding.GetBytes(uri.LocalPath + uri.Query);

            // compute the hash
            HMACSHA1 algorithm = new HMACSHA1(privateKeyBytes);
            byte[] hash = algorithm.ComputeHash(encodedPathAndQueryBytes);

            // convert the bytes to string and make url-safe by replacing '+' and '/' characters
            string signature = Convert.ToBase64String(hash).Replace("+", "-").Replace("/", "_");

            // Add the signature to the existing URI.
            return uri.Scheme + "://" + uri.Host + uri.LocalPath + uri.Query + "&signature=" + signature;
        }
    }
    public class SignUrl
    {
        public string signer(string _urltoencode)
        {
            // Note: Generally, you should store your private key someplace safe
            // and read them into your code

            string keyString = "a1P1yz12j25eA3Z6u9gecszljAU=";

            // The URL shown in these examples is a static URL which should already
            // be URL-encoded. In practice, you will likely have code
            // which assembles your URL from user or web service input
            // and plugs those values into its parameters.
            string urlString = _urltoencode;

            return GoogleSignedUrl.Sign(urlString, keyString).ToString();
            //string inputUrl = null;
            //string inputKey = null;

            //Console.WriteLine("Enter the URL (must be URL-encoded) to sign: ");
            //inputUrl = Console.ReadLine();
            //if (inputUrl.Length == 0)
            //{
            //    inputUrl = urlString;
            //}

            //Console.WriteLine("Enter the Private key to sign the URL: ");
            //inputKey = Console.ReadLine();
            //if (inputKey.Length == 0)
            //{
            //    inputKey = keyString;
            //}

            //Console.WriteLine();
            //Console.ReadLine();
        }
    }
}