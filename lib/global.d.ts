declare global {
  let mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}

// Export an empty object to make this file a module
export {};
