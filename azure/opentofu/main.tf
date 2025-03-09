# OpenTofu/Terraform configuration for Azure resources deployment
# This file defines all the infrastructure needed to run the Metaverse Social application

# Define the required providers - azurerm is the Azure Resource Manager provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"  # Use Azure provider version 3.x
    }
  }
}

# Configure the Azure provider
provider "azurerm" {
  features {}  # Required empty features block for azurerm provider
}

# Define common variables used throughout the configuration
locals {
  location        = "East US"  # Azure region to deploy resources
  environment_name = "prod"    # Environment name (prod, dev, test)
  app_name        = "metaverse-social"  # Base name for all resources
}

# App Service Plan - Defines the compute resources for the backend API
# Think of this as the "hosting plan" that determines performance and cost
resource "azurerm_service_plan" "backend" {
  name                = "${local.app_name}-backend-${local.environment_name}-plan"
  location            = local.location
  resource_group_name = var.resource_group_name  # Comes from variables.tf
  os_type             = "Linux"  # Using Linux-based hosting
  sku_name            = "B1"     # Basic tier, suitable for development/light production
}

# Backend App Service - This hosts the Scenario Management service (.NET Core API)
resource "azurerm_linux_web_app" "backend" {
  name                = "${local.app_name}-backend-${local.environment_name}"
  location            = local.location
  resource_group_name = var.resource_group_name
  service_plan_id     = azurerm_service_plan.backend.id  # Link to the service plan above
  https_only          = true  # Force HTTPS for security

  # Define the Docker container configuration
  site_config {
    application_stack {
      docker_image     = "mcr.microsoft.com/dotnet/aspnet"  # Base ASP.NET runtime image
      docker_image_tag = "7.0"  # .NET 7.0 version
    }
  }

  # Environment variables for the App Service
  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"  # Don't persist to file system
    "DOCKER_REGISTRY_SERVER_URL"          = "https://index.docker.io"  # Docker Hub
    "ASPNETCORE_ENVIRONMENT"              = local.environment_name  # prod, dev, etc.
  }
}

# Frontend Static Web App - This hosts the React frontend application
# Static Web Apps provide global CDN, CI/CD, and custom domains
resource "azurerm_static_site" "frontend" {
  name                = "${local.app_name}-frontend-${local.environment_name}"
  resource_group_name = var.resource_group_name
  location            = local.location
  sku_tier            = "Standard"  # Standard tier provides more features than Free
  sku_size            = "Standard"

  # Environment variables for the Static Web App
  app_settings = {
    "REACT_APP_API_URL"       = "https://${azurerm_linux_web_app.backend.default_hostname}/api"  # Connect to backend
    "REACT_APP_ENVIRONMENT"   = local.environment_name  # Used for environment-specific config
  }
}

# Output values that will be displayed after deployment
output "backend_url" {
  value = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "frontend_url" {
  value = azurerm_static_site.frontend.default_hostname
}
