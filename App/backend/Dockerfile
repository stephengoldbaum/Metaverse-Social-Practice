# Multi-stage Docker build for .NET backend API

# Stage 1: Build stage - uses the SDK image which includes compilers and build tools
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copy just the project file first to leverage Docker layer caching
# This step will be cached unless the project file changes
COPY ["App/backend/*.csproj", "./"]
RUN dotnet restore  # Restore NuGet packages based on project file

# Copy all source files and build the application
COPY App/backend/. .
# Publish the application with Release configuration
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime stage - uses the smaller ASP.NET runtime image
# This results in a much smaller final image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
# Copy only the published application from the build stage
COPY --from=build /app/publish .
EXPOSE 80  # Expose port 80 for web traffic
# Define the entry point - this will start the .NET application
ENTRYPOINT ["dotnet", "ScenarioManagement.dll"]
