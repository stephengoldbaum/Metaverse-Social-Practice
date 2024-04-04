using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace VerseCraft.Session
{
    public class GetSessionConfiguration
    {
        private readonly ILogger<GetSessionConfiguration> _logger;

        public GetSessionConfiguration(ILogger<GetSessionConfiguration> logger)
        {
            _logger = logger;
        }

        [Function("GetSessionConfiguration")]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            var json = @"
            {
                ""template_name"": ""Test - Fast Food template 1"",
                ""session_location"": ""Fast Food"",
                ""cashier_types"": [
                    ""Speaking quickly"",
                    ""Mumbling"",
                    ""Friendly"",
                    ""Grumpy"",
                    ""Quiet"",
                    ""Loud""
                ],
                ""sessionId"": ""00000000-0000-0000-0000-000000000000"",
                ""playerId"": ""0"",
            }
            ";

            return new OkObjectResult(json);
        }
    }
}
