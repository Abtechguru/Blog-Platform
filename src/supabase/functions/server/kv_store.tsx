import { createClient } from "@supabase/supabase-js";

// Initialize the client once (Singleton pattern) instead of on every call
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Check your .env file.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

const TABLE_NAME = "kv_store_302887ca";

// Set stores a key-value pair
export const set = async (key: string, value: any): Promise<void> => {
  const { error } = await supabase.from(TABLE_NAME).upsert({
    key,
    value
  });
  if (error) throw new Error(error.message);
};

// Get retrieves a key-value pair
export const get = async (key: string): Promise<any> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("value")
    .eq("key", key)
    .maybeSingle();
    
  if (error) throw new Error(error.message);
  return data?.value;
};

// Delete deletes a key-value pair
export const del = async (key: string): Promise<void> => {
  const { error } = await supabase.from(TABLE_NAME).delete().eq("key", key);
  if (error) throw new Error(error.message);
};

// Sets multiple key-value pairs
export const mset = async (keys: string[], values: any[]): Promise<void> => {
  const upsertData = keys.map((k, i) => ({ key: k, value: values[i] }));
  const { error } = await supabase.from(TABLE_NAME).upsert(upsertData);
  if (error) throw new Error(error.message);
};

// Gets multiple key-value pairs
export const mget = async (keys: string[]): Promise<any[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("value")
    .in("key", keys);
    
  if (error) throw new Error(error.message);
  return data?.map((d) => d.value) ?? [];
};

// Deletes multiple key-value pairs
export const mdel = async (keys: string[]): Promise<void> => {
  const { error } = await supabase.from(TABLE_NAME).delete().in("key", keys);
  if (error) throw new Error(error.message);
};

// Search for key-value pairs by prefix
export const getByPrefix = async (prefix: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("key, value")
    .like("key", `${prefix}%`);
    
  if (error) throw new Error(error.message);
  return data?.map((d) => d.value) ?? [];
};