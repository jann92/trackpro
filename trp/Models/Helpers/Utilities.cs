using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Helpers
{


    public static class Utilities
    {
        public static IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }

        public static bool InclusiveBetween(this IComparable a, IComparable b, IComparable c)
        {
            return a.CompareTo(b) >= 0 && a.CompareTo(c) <= 0;
        }

        public static bool ExclusiveBetween(this IComparable a, IComparable b, IComparable c)
        {
            return a.CompareTo(b) > 0 && a.CompareTo(c) < 0;
        }

        public static bool SqlBetween(this IComparable a, IComparable b, IComparable c)
        {
            return a.InclusiveBetween(b, c);
        }
    }
}