import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://nvsvcgomyyahwxlbream.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52c3ZjZ29teXlhaHd4bGJyZWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYzMzY3NDcsImV4cCI6MjA0MTkxMjc0N30.tqtK07IkDbUuktwv2mTDkSj4fxep15UlFn7M02o3XUY"
);
