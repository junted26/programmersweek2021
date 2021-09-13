using Mailjet.Client;
using Mailjet.Client.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PGWFunctions.Models;
using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace PGWFunctions
{
    public static class OnRegistrationReceived
    {
        [FunctionName("OnRegistrationReceived")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            [Table("registration")] IAsyncCollector<Registration> registrationTable,
            ILogger log)
        {
            var registrationId = Guid.NewGuid().ToString();
            log.LogInformation("Registration is received");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var registrationForm = JsonConvert.DeserializeObject<Registration>(requestBody);


            if (IsValidRequest(registrationForm))
            {
                return new BadRequestObjectResult(new { Error = "Invalid data" });
            }

            try
            {
                var registration = JsonConvert.DeserializeObject<Registration>(requestBody);

                registration.PartitionKey = "registrations";
                registration.RowKey = registrationId;

                await registrationTable.AddAsync(registration);

                var email = registration.Email;
                var fullName = $"{registration.FirstName} {registration.LastName}";


                MailjetClient client = new MailjetClient(
                    Environment.GetEnvironmentVariable("MailJetApiKey"),
                    Environment.GetEnvironmentVariable("MailJetApiSecret"));

                MailjetRequest request = new MailjetRequest
                {
                    Resource = SendV31.Resource,
                }
               .Property(Send.Messages, GenerateEmail(email, fullName));


                MailjetResponse response = await client.PostAsync(request);
                if (response.IsSuccessStatusCode)

                {
                    log.LogInformation($"Total: {response.GetTotal()}, Count: {response.GetCount()}\n");
                    log.LogInformation(response.GetData().ToString());
                }
                else
                {
                    log.LogError($"StatusCode: {response.StatusCode}\n");
                    log.LogError($"ErrorInfo: {response.GetErrorInfo()}\n");
                    log.LogError(response.GetData().ToString());
                    log.LogError($"ErrorMessage: {response.GetErrorMessage()}\n");
                }

                return new OkObjectResult(registrationId);
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
                return new BadRequestObjectResult(new { Error = "Invalid data" });
            }
        }

        private static JArray GenerateEmail(string email, string fullName)
        {
            return new JArray {
                   new JObject
                   {
                       {
                           "From",
                           new JObject {
                               {"Email", "<put your email here>"},
                               {"Name", "<put your name here>"}
                           }
                       }, {
                       "To",
                       new JArray {
                        new JObject {
                         {
                          "Email",
                          email.Replace("\r","") },
                         { "Name",
                            $"{fullName}"
                         }
                         }
                        }
                      },
                      { "Bcc",
                       new JArray {
                        new JObject {
                         {
                          "Email",
                          "<put your email here>"
                         }, {
                          "Name",
                           "<put your company here>"
                         }
                        }
                       }
                      }, {
                       "Subject",
                       "Registration Acknowledgement"
                      }, {
                       "TextPart",
                       $"Dear {fullName}  " +
                       $"Thank you for your interest in participating to Programmer's week. \n "
                   }, {
                       "HTMLPart",
                       $"Dear {fullName},<br/><br/><span>Thank you for your interest in participating to Programmer's week. " +
                       "<br><br>Respectfully yours, <br><Put your company here><br><br>"
                   }, {
                       "CustomID",
                       "AppGettingStartedTest"
                      }
                   }
                               };
        }

        private static bool IsValidRequest(Registration registrationForm)
        {
            return string.IsNullOrWhiteSpace(registrationForm.Salutation) ||
                            string.IsNullOrWhiteSpace(registrationForm.FirstName) ||
                            string.IsNullOrWhiteSpace(registrationForm.LastName) ||
                            string.IsNullOrWhiteSpace(registrationForm.Address) ||
                            string.IsNullOrWhiteSpace(registrationForm.Country) ||
                            string.IsNullOrWhiteSpace(registrationForm.Email) ||
                            string.IsNullOrWhiteSpace(registrationForm.PhoneNumber) ||
                            !Regex.IsMatch(registrationForm.Email, @"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$");
        }
    }
}
