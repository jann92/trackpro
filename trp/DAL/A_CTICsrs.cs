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
    
    public partial class A_CTICsrs
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public A_CTICsrs()
        {
            this.A_CTICsrlog = new HashSet<A_CTICsrlog>();
            this.A_CTICsrs1 = new HashSet<A_CTICsrs>();
            this.A_CTICsrs2 = new HashSet<A_CTICsrs>();
            this.A_CTITrunk = new HashSet<A_CTITrunk>();
        }
    
        public string CsrID { get; set; }
        public byte[] Pin { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string E_Mail { get; set; }
        public string Tel { get; set; }
        public string Mob { get; set; }
        public string Status { get; set; }
        public string Remark { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<A_CTICsrlog> A_CTICsrlog { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<A_CTICsrs> A_CTICsrs1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<A_CTICsrs> A_CTICsrs2 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<A_CTITrunk> A_CTITrunk { get; set; }
    }
}