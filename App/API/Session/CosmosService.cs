using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace App.API.Session
{
    public class CosmosService
    {
        public static readonly string ConnectionString = Environment.GetEnvironmentVariable("COSMOS_CONNECTION_STRING");
        public static readonly string PrimaryKey = "id";
        public static readonly string DatabaseId = "LearnerProfileTest";
        public static readonly string ContainerId = "session-state-config";

        public static CosmosClient GetCosmosClient()
        {
            return new CosmosClient(ConnectionString);
        }


        public static Container GetSessionConfigurationContainer(CosmosClient client)
        {
            return client.GetContainer(DatabaseId, ContainerId);
        }

        public static Container GetSessionLogContainer(CosmosClient client)
        {
            return client.GetContainer("session", "session-log");
        }

    }
}
