using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Philgps_WebAPI.Helpers
{
    public static class Converter
    {
        public static int strToInt(this string str)
        {

            int y;
            Int32.TryParse(str, out y);

            return y;

        }

        public static DateTime strToDT(this string str)
        {

            DateTime y;
            DateTime.TryParse(str, out y);

            return y;

        }

        public static double strToDbl(this string str)
        {

            double y;
            double.TryParse(str, out y);

            return y;

        }

        public static float strToFlt(this string str)
        {

            float y;
            float.TryParse(str, out y);

            return y;

        }

        public static decimal strToDcl(this string str)
        {

            decimal y;
            decimal.TryParse(str, out y);

            return y;

        }

        public static byte strToByt(this string str)
        {

            byte y;
            byte.TryParse(str, out y);

            return y;

        }

        public static short intToShrt(this int i)
        {

            short y;
            short.TryParse(i.ToString(), out y);

            return y;

        }

        public static int shrtToInt(this short shrt)
        {

            int y;
            int.TryParse(shrt.ToString(), out y);

            return y;

        }

        public static double decToDbl(this decimal dec)
        {

            double y;
            double.TryParse(dec.ToString(), out y);

            return y;

        }

        public static int dblToInt(this double dbl)
        {

            int y;
            int.TryParse(dbl.ToString(), out y);

            return y;

        }

        public static decimal dblToDec(this double dbl)
        {

            decimal y;
            decimal.TryParse(dbl.ToString(), out y);

            return y;

        }

        public static int decToInt(this decimal dec)
        {

            int y;
            int.TryParse(dec.ToString(), out y);

            return y;

        }

        public static byte intToByt(this int i)
        {

            byte y;
            byte.TryParse(i.ToString(), out y);

            return y;

        }

        public static string degreesToCardinal(this int _direction)
        {
            var cardinal = "N";
            if ((_direction >= 0 && _direction < 22.5) || (_direction >= 337.5 && _direction <= 360))
            {
                cardinal = "N";
            }
            else if (_direction >= 22.5 && _direction < 67.5)
            {
                cardinal = "NE";
            }
            else if (_direction >= 67.5 && _direction < 112.5)
            {
                cardinal = "E";
            }
            else if (_direction >= 112.5 && _direction < 157.5)
            {
                cardinal = "SE";
            }
            else if (_direction >= 157.5 && _direction < 202.5)
            {
                cardinal = "S";
            }
            else if (_direction >= 202.5 && _direction < 247.5)
            {
                cardinal = "SW";
            }
            else if (_direction >= 247.5 && _direction < 292.5)
            {
                cardinal = "W";
            }
            else if (_direction >= 292.5 && _direction < 337.5)
            {
                cardinal = "NW";
            }
            else
            {
                cardinal = "N";
            }

            return cardinal;
        }

        public static byte[] imageToByteArray(this System.Drawing.Image image)
        {
            using (var ms = new MemoryStream())
            {
                image.Save(ms, image.RawFormat);
                return ms.ToArray();
            }
        }
    }
}
