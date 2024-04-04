using App.API.Session;
using App.API.Session.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Azure;
using Azure.AI.OpenAI;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;


namespace VerseCraft.Session
{
    public class Interact
    {
        private readonly ILogger<Interact> _logger;

        public Interact(ILogger<Interact> logger)
        {
            _logger = logger;
        }

        [Function("Interact")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
        {
            var cosoms_auth_key = Environment.GetEnvironmentVariable("COSMOS_AUTH_KEY");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            dynamic incomingData = JsonSerializer.Deserialize<Interaction>(requestBody, options);

            using (CosmosClient client = CosmosService.GetCosmosClient())
            {
                var container = CosmosService.GetSessionConfigurationContainer(client);
                try
                {
                    var botResponse = GetBotResponse(incomingData.Media);
                    var responsInteraction = new Interaction
                    {
                        id = Guid.NewGuid().ToString(),
                        InResponseTo = incomingData.id,
                        SessionID = incomingData.SessionID,
                        Actor = Actor.Bot,
                        Media = botResponse,
                        MediaType = MediaType.Text,
                        CreatedAt = DateTime.UtcNow
                    };

                    // Log into Database
                    var dbResponseI = await container.CreateItemAsync(incomingData);
                    _logger.LogInformation($"Saved data to Cosmos DB: {dbResponseI.Resource}");

                    var dbResponseO = await container.CreateItemAsync(responsInteraction);
                    _logger.LogInformation($"Saved data to Cosmos DB: {dbResponseO.Resource}");

                    return new OkObjectResult("Saved: " + responsInteraction);
                }
                catch (CosmosException ex)
                {
                    _logger.LogError($"Failed to save data to Cosmos DB: {ex.Message}");
                    return new StatusCodeResult(StatusCodes.Status500InternalServerError);
                }
            }
        }

        public static async Task<string> GetBotResponse(string input)
        {
            // setup speech configuration
            // SPEECH_API_KEY is they key of the speech resource
            var speechConfig = SpeechConfig.FromSubscription(
            Environment.GetEnvironmentVariable("SPEECH_API_KEY"), "swedencentral");

            // Get the text from the microphone
            speechConfig.SpeechRecognitionLanguage = "en-US";
            using var audioConfig = AudioConfig.FromDefaultMicrophoneInput();
            using var recognizer = new SpeechRecognizer(speechConfig, audioConfig);
            Console.WriteLine("Say something...");
            var speechResult = await recognizer.RecognizeOnceAsync();

            OpenAIClient client = new OpenAIClient(
                new Uri("https://aoai-uc6-swed.openai.azure.com/"),
                new AzureKeyCredential( Environment.GetEnvironmentVariable("AZURE_OPENAI_API_KEY") )
            );

            var responseWithoutStream = await client.GetChatCompletionsAsync(
            "gpt-4-1106-sweden",
            new ChatCompletionsOptions()
            {
                Messages =
                {
                    new ChatMessage(ChatRole.System, 
                        @"You are an employee at a fast food restaurant called Subway that sells sandwiches. Your job is to:
                        1. First greet the customer,
                        2. Then take their order to make their sandwich
                        3. And finally, ask them to pay.           

                        Your overall tone and mood is rude and hurried.
                
                        You can only make the sandwich with options from the menu. Here are the menu options:

                        1. Bread: The bread for the sandwich is mandatory and can be only one of Italian, Multigrain or White.
                        2. Meat: Meat is optional. If the customer chooses meat, they can only get one of Turkey, Chicken, Roast Beef, Pepperoni or Meatballs.
                        3. Cheese: Cheese is optional and can be only one of Cheddar or Mozzarella.
                        4. Veggies: Veggies are optional and can be avocado, capsicum, onion, tomato, cucumber, lettuce, jalapenos and olives. There is no limit on the number of veggies the customer can choose.
                        5. Sauce: Sauce is optional and can be Sweet Onion, Honey Mustard or Ranch. The costumer cannot choose more than two sauces.
                        
                        After you make the sandwich, you ask if the customer wants a drink with their sandwich. Drink options are: Iced Tea, Pepsi or Water.
                        
                        Then you tell them how much it costs. A sandwich alone costs $7. A sandwich and drink together costs $10.
                        
                        Finally, you give them their order and wish them a good day."
                    ),
                    new ChatRequestMessage(ChatRole.User, speechResult.Text)
                },
                Temperature = (float)0.7,
                MaxTokens = 800,


                NucleusSamplingFactor = (float)0.95,
                FrequencyPenalty = 0,
                PresencePenalty = 0,
            });

            ChatCompletions response = responseWithoutStream.Value;
            // Set a voice name for synthesis
            speechConfig.SpeechSynthesisVoiceName = "en-US-EricNeural";
            using var synthesizer = new SpeechSynthesizer(speechConfig);
            await synthesizer.SpeakTextAsync(response.Value.Choices[0].Message.Content);
        }
    }
}
