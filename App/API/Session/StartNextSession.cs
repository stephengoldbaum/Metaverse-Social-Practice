using App.API.Session.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace VerseCraft.Session
{
    public class StartNextSession
    {
        private readonly ILogger<StartNextSession> _logger;

        public StartNextSession(ILogger<StartNextSession> logger)
        {
            _logger = logger;
        }

        [Function("StartNextSession")]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            // Deserialize the StartNextSessionRequest instance from the POST contents of HttpRequest
            string requestBody = new StreamReader(req.Body).ReadToEnd();
            var request = JsonSerializer.Deserialize<StartNextSessionRequest>(requestBody);

            var sessionId = new Guid().ToString();
            var playerId = request.PlayerID;
            var managerId = request.ManagerID;

            // Load the next from database
            var nextSessionConfiguration = new SessionConfiguration();

            var response = new SessionStartedEvent {
                SessionID = sessionId,
                Player = playerId,
                Manager = managerId,
                configuration = nextSessionConfiguration
            };

            // Serialize the response to JSON
            var jsonResponse = JsonSerializer.Serialize(response);

            // Return the JSON response
            return new OkObjectResult(jsonResponse);
        }
    }

    public class StartNextSessionRequest {
        public string PlayerID { get; set; }
        
        public string ManagerID { get; set; }
    }

    public class SessionStartedEvent {
        public string SessionID { get; set; }
        public string Player { get; set; }
        public string Manager { get; set; }
        public DateTime Date { get; set; }

        public SessionConfiguration  configuration { get; set;}
    }
}
