document.addEventListener("DOMContentLoaded", function () {
  const SUPABASE_URL = "https://xcfnauotdoyxwufzdvua.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZm5hdW90ZG95eHd1ZnpkdnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzNTMzMzAsImV4cCI6MjAzNDkyOTMzMH0.DkdHLt7AXWpr-FCUFgDzJ9mAE2yUjt65pDfEoSLTaMs";

  window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
});
