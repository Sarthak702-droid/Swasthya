package config

import (
	"log"
	"os"
	"strconv"
)

type AppConfig struct {
	AppEnv         string
	HTTPPort       string
	DatabaseURL    string
	JWTSecret      string
	JWTTTLSeconds  int
	CORSOrigins    string
}

func LoadConfig() *AppConfig {
	cfg := &AppConfig{
		AppEnv:        getEnv("APP_ENV", "development"),
		HTTPPort:      getEnv("HTTP_PORT", "8080"),
		DatabaseURL:   getEnvOrFatal("DATABASE_URL"),
		JWTSecret:     getEnvOrFatal("JWT_SECRET"),
		JWTTTLSeconds: getEnvAsInt("JWT_TTL_SECONDS", 900),
		CORSOrigins:   getEnv("CORS_ORIGINS", "http://localhost:3000"),
	}
	return cfg
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func getEnvOrFatal(key string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	log.Fatalf("Missing required environment variable: %s", key)
	return ""
}

func getEnvAsInt(key string, fallback int) int {
	valStr := getEnv(key, "")
	if valStr == "" {
		return fallback
	}
	val, err := strconv.Atoi(valStr)
	if err != nil {
		log.Fatalf("Invalid integer for %s", key)
	}
	return val
}
