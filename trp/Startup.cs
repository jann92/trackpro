using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Philgps_WebAPI.Helpers;
using Microsoft.Owin.Cors;

[assembly: OwinStartup(typeof(Philgps_WebAPI.Startup))]

namespace Philgps_WebAPI
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
           HttpConfiguration config = new HttpConfiguration();
            ConfigureAuth(app);
            WebApiConfig.Register(config);
            app.UseWebApi(config);
            app.MapSignalR();
            app.UseCors(CorsOptions.AllowAll);

        }

        public void ConfigureAuth(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);

            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                Provider = new PhilgpsAuthorizationProvider()    
            };
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
        }
    }
}
