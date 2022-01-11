using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Philgps_WebAPI.Models
{

    public class Account
    {
        public int AccountID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Groupcodes { get; set; }
        public string Email { get; set; }
        public List<Role> RoleList { get; set; }
        public int ParentID { get; set; }
        public DateTime? LastLoginTime { get; set; }
    }

    public class AccountRecovery
    {
        public int AccountID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public DateTime? LastEmailUpdate { get; set; }
        public string NewPassword { get; set; }
    }

    public class AccountUpdate
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class AccountChild
    {
        public int AccountID { get; set; }
        public string Username { get; set; }
        public string Groupcodes { get; set; }
    }

    public class AccountUserChildAsset
    {
        public string AssetID { get; set; }
        public string AssetName { get; set; }
        public bool IsAssigned { get; set; }
    }

    public class AssignmentCustomer
    {
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public List<AccountUserChildAsset> AccountUserChildAssetList { get; set; }
        public int Total { get; set; }

        public AssignmentCustomer()
        {
            this.AccountUserChildAssetList = new List<AccountUserChildAsset>();
        }
    }

    public class AccountSensorLabels
    {
        public int AccountID { get; set; }
        public string Sensor1Label { get; set; }
        public string Sensor2Label { get; set; }
    }

    public class AccountEmailReports
    {
        public int EmailReportsID { get; set; }
        public int UserID { get; set; }
        public List<AccountReportType> ReportTypeList { get; set; }
        public int? ReportType { get; set; }
        public int? Frequency { get; set; }
        public string Email { get; set; }

        public AccountEmailReports()
        {
            this.ReportTypeList = new List<AccountReportType>();
        }
    }

    public class AccountReportType
    {
        public int ReportTypeID { get; set; }
        public string ReportType { get; set; }
    }

}