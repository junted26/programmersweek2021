using Microsoft.WindowsAzure.Storage.Table;

namespace PGWFunctions.Models
{
    public class Registration : TableEntity
    {
        public string Salutation { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Country { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
