# STAGE 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj and restore (cached)
COPY *.csproj ./
RUN dotnet restore

# Build release
COPY . ./
RUN dotnet publish -c Release -o out

# STAGE 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 80
ENTRYPOINT ["dotnet", "ResourceService.dll"]