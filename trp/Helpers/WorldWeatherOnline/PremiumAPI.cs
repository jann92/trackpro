using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Web.Script.Serialization;
using premium.localweather;
using premium.locationsearch;
using premium.timezone;
using premium.marineweather;
using premium.pastweather;
using Philgps_WebAPI.Helpers;

/// <summary>
/// Summary description for PremiumAPI
/// </summary>
public class WorldWeatherOnlinePremiumAPI
{
    public string ApiBaseURL = ConfigurationManager.AppSettings["WorldWeatherOnlinePremiumApiBaseURL"];
    public string PremiumAPIKey = ConfigurationManager.AppSettings["WorldWeatherOnlinePremiumAPIKey"];

    public LocalWeather GetLocalWeather(LocalWeatherInput input)
    {
        // create URL based on input paramters
        string apiURL = ApiBaseURL + "weather.ashx?q=" + input.query + "&format=" + input.format + "&extra=" + input.extra + "&num_of_days=" + input.num_of_days + "&date=" + input.date + "&fx=" + input.fx + "&cc=" + input.cc + "&includelocation=" + input.includelocation + "&show_comments=" + input.show_comments + "&callback=" + input.callback + "&key=" + PremiumAPIKey;

        // get the web response
        string result = RequestHandler.Process(apiURL);

        // serialize the json output and parse in the helper class
        LocalWeather lWeather = (LocalWeather)new JavaScriptSerializer().Deserialize(result, typeof(LocalWeather));

        return lWeather;
    }

    public LocationSearch SearchLocation(LocationSearchInput input)
    {
        // create URL based on input paramters
        string apiURL = ApiBaseURL + "search.ashx?q=" + input.query + "&format=" + input.format + "&timezone=" + input.timezone + "&popular=" + input.popular + "&num_of_results=" + input.num_of_results + "&callback=" + input.callback + "&key=" + PremiumAPIKey;

        // get the web response
        string result = RequestHandler.Process(apiURL);

        // serialize the json output and parse in the helper class
        LocationSearch locationSearch = (LocationSearch)new JavaScriptSerializer().Deserialize(result, typeof(LocationSearch));

        return locationSearch;
    }

    public Timezone GetTimeZone(TimeZoneInput input)
    {
        // create URL based on input paramters
        string apiURL = ApiBaseURL + "tz.ashx?q=" + input.query + "&format=" + input.format + "&callback=" + input.callback + "&key=" + PremiumAPIKey;

        // get the web response
        string result = RequestHandler.Process(apiURL);

        // serialize the json output and parse in the helper class
        Timezone timeZone = (Timezone)new JavaScriptSerializer().Deserialize(result, typeof(Timezone));

        return timeZone;
    }

    public WWOMarineWeather GetMarineWeather(WWOMarineWeatherInput input)
    {
        // create URL based on input paramters
        string apiURL = ApiBaseURL + "marine.ashx?q=" + input.query + "&format=" + input.format + "&key=" + PremiumAPIKey;

        // get the web response
        string result = RequestHandler.Process(apiURL);

        // serialize the json output and parse in the helper class
        WWOMarineWeather mWeather = (WWOMarineWeather)new JavaScriptSerializer().Deserialize(result, typeof(WWOMarineWeather));

        return mWeather;
    }

    public PastWeather GetPastWeather(PastWeatherInput input)
    {
        // create URL based on input paramters
        string apiURL = ApiBaseURL + "past-weather.ashx?q=" + input.query + "&format=" + input.format + "&extra=" + input.extra + "&enddate=" + input.enddate + "&date=" + input.date + "&includelocation=" + input.includelocation + "&callback=" + input.callback + "&key=" + PremiumAPIKey;

        // get the web response
        string result = RequestHandler.Process(apiURL);

        // serialize the json output and parse in the helper class
        PastWeather pWeather = (PastWeather)new JavaScriptSerializer().Deserialize(result, typeof(PastWeather));

        return pWeather;
    }
}