//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Philgps_WebAPI.DAL
{
    using System;
    using System.Collections.Generic;
    
    public partial class A_CTITrunk
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public A_CTITrunk()
        {
            this.A_CTIInCall = new HashSet<A_CTIInCall>();
            this.A_CTIOutCall = new HashSet<A_CTIOutCall>();
            this.A_CTIRecord = new HashSet<A_CTIRecord>();
            this.A_CTICsrs = new HashSet<A_CTICsrs>();
        }
    
        public int TrunksID { get; set; }
        public Nullable<byte> BoardNo { get; set; }
        public Nullable<int> TrunksNo { get; set; }
        public Nullable<byte> TrunksType { get; set; }
        public string TelNumber { get; set; }
        public string Remark { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<A_CTIInCall> A_CTIInCall { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<A_CTIOutCall> A_CTIOutCall { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<A_CTIRecord> A_CTIRecord { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<A_CTICsrs> A_CTICsrs { get; set; }
    }
}
