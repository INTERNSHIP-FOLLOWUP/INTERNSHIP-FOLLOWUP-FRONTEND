/**
 * Database Connection Service
 * 
 * This service provides utility functions to verify the backend API connection.
 * The frontend does not connect to the database directly - all database operations
 * are performed through the Laravel 12 backend API.
 * 
 * Configuration:
 * - VITE_API_URL: The base URL of the Laravel API (default: http://localhost:8000/api)
 * 
 * Make sure the Laravel backend is running and configured with the correct
 * database connection in .env (MySQL 8 with Passerelles Numeriques Cambodia database).
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

/**
 * Check if the API server is reachable
 */
export async function checkApiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      // Require CORS-enabled backend
      mode: 'cors',
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get the configured API URL
 */
export function getApiUrl(): string {
  return API_URL
}

/**
 * Verify database connection by hitting a health check endpoint
 */
export async function verifyDatabaseConnection(): Promise<{
  success: boolean
  message: string
}> {
  try {
    const isConnected = await checkApiConnection()
    if (isConnected) {
      return {
        success: true,
        message: 'API and database connection successful',
      }
    }
    return {
      success: false,
      message: 'Unable to connect to API server',
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection check failed',
    }
  }
}