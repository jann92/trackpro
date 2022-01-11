using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Owin.Security.OAuth;
using System.Security.Claims;
using Philgps_WebAPI.Models;
using Philgps_WebAPI.Helpers.SERVERDB;
using System.Configuration;

namespace Philgps_WebAPI.Helpers
{
    public class PhilgpsAuthorizationProvider : OAuthAuthorizationServerProvider
    {

        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var data = await context.Request.ReadFormAsync();
            string ConfigurationName = data.Where(x => x.Key == "db").FirstOrDefault().Value.FirstOrDefault().ToString();

            var WebConfigurationName = ConfigurationName.GetWebConfigurationName("TFDB");
            var DownloadsURL = ConfigurationName.GetDownloadsHistoryURL("TFDB");

            PhilgpsUserRepository _repo = new PhilgpsUserRepository(WebConfigurationName);

            Account result = _repo.FindUser(context.UserName, context.Password);

            if (result == null)
            {
                context.SetError("invalid_grant", "The username or password is incorrect.");
                return;
            }
            
            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim("Username", result.Username));
            identity.AddClaim(new Claim("AccountID", result.AccountID.ToString()));
            identity.AddClaim(new Claim("Groupcodes", result.Groupcodes));
            //identity.AddClaim(new Claim("RoleValue", result.RoleList.Sum(x=> x.Value).ToString()));
            identity.AddClaim(new Claim("ConfigurationName", ConfigurationName));
            identity.AddClaim(new Claim("SessionExpiryDate", DateTime.Now.AddDays(1).ToString()));
            identity.AddClaim(new Claim("UserEmail", result.Email ?? "No Email"));
            identity.AddClaim(new Claim("DownloadsURL", DownloadsURL));
            identity.AddClaim(new Claim("ParentID", result.ParentID.ToString()));
            context.Validated(identity);

        }

        public override Task TokenEndpointResponse(OAuthTokenEndpointResponseContext context)
        {
            string thisIsTheToken = context.AccessToken;

            context.AdditionalResponseParameters.Add("GoogleClientID", ConfigurationManager.AppSettings["GoogleClientID"]);
            return base.TokenEndpointResponse(context);
        }
    }
}
