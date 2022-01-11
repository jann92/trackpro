using Philgps_WebAPI.Helpers.MAPDB;
using Philgps_WebAPI.Models.Geofence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;

namespace Philgps_WebAPI.Controllers.Map
{
    [RoutePrefix("Map")]
    public class MapController : ApiController
    {
        [Authorize]
        [Route("Geocode/Reverse")]
        [HttpPost]
        public IHttpActionResult GeocodeReverse(GeoCoordinate _GeoCoordinate)
        {

            var address = MAPDBHelpers.ReverseGeocode(_GeoCoordinate.Latitude, _GeoCoordinate.Longitude);

            if (address != null)
            {
                return Ok(address);
            }
            else
            {
                return BadRequest("Failed to retrieve address.");
            }
        }
    }
}
