using App.API.Session;
using App.API.Session.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Text.Json;


namespace VerseCraft.Session
{
    public class CreateSessionConfiguration
    {
        private readonly ILogger<CreateSessionConfiguration> _logger;

        public CreateSessionConfiguration(ILogger<CreateSessionConfiguration> logger)
        {
            _logger = logger;
        }

        [Function("CreateSessionConfiguration")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
        {
            var cosoms_auth_key = Environment.GetEnvironmentVariable("COSMOS_AUTH_KEY");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            dynamic data = JsonSerializer.Deserialize<SessionConfiguration>(requestBody, options);

            using (CosmosClient client = CosmosService.GetCosmosClient())
            {
                var container = CosmosService.GetSessionConfigurationContainer(client);
                try
                {
                    var response = await container.CreateItemAsync(data);
                    
                    _logger.LogInformation($"Saved data to Cosmos DB: {response.Resource}");
                    return new OkObjectResult("Saved: " + response.Resource);
                }
                catch (CosmosException ex)
                {
                    _logger.LogError($"Failed to save data to Cosmos DB: {ex.Message}");
                    return new StatusCodeResult(StatusCodes.Status500InternalServerError);
                }
            }
        }        
    }
}
