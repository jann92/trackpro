using Philgps_WebAPI.DAL;
using Philgps_WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Philgps_WebAPI.Helpers
{
    public class PhilgpsUserRepository
    {
        public string WebConfigurationName { get; set; }

        public PhilgpsUserRepository(string _WebConfigurationName)
        {
            this.WebConfigurationName = _WebConfigurationName;
        }

        public Account FindUser(string _Username, string _Password)
        {
            using (TFDBEntities tfdb = new TFDBEntities(this.WebConfigurationName))
            {


                var result = (from s in tfdb.PGPS_SystemUser.ToList()
                              where s.username == _Username
                              && s.password == _Password
                              select new Account()
                              {
                                  AccountID = s.user_id,
                                  Groupcodes = "0",
                                  Password = s.password,
                                  Username = s.username,
                                  Email = s.email,
                                  //RoleList = (from r in s.S_UserRole
                                  //            from sr in tfdb.S_SysRole
                                  //            where r.RoleID == sr.RoleID
                                  //            select new Role()
                                  //            {
                                  //                Name = sr.RoleName,
                                  //                RoleID = sr.RoleID,
                                  //                Value = sr.RoleValue ?? 0
                                  //            }).ToList(),
                                 //ParentID = tfdb.PGPS_SystemUser.Where(x=> x.user_id == s.UserID).FirstOrDefault().parent_user_id ?? 0
                                 ParentID = s.parent_user_id ?? 0
                              }).ToList();

                if (result.Count() > 0)
                {
                    return result.FirstOrDefault();
                }
                else
                {
                    return null;
                }
            }
        }
    }
}
