// src/types/AppContent/AppContent.ts

// Mirrors the backend APPCONTENT table: ID (string) + DATA (HTML/JSON text).
export interface AppContent {
  id: string;
  data: string;
}
