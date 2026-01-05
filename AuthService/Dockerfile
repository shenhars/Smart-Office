# STAGE 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies (cached layer)
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build release
COPY . ./
RUN dotnet publish -c Release -o out

# STAGE 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 80
ENTRYPOINT ["dotnet", "AuthService.dll"]