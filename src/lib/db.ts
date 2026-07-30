export async function connectDB() {
  try {
    const { seedAllData } = await import('./seed');
    await seedAllData();
  } catch (seedErr: any) {
    console.error('Auto seed execution error:', seedErr.message);
  }
  return true;
}

export default connectDB;
