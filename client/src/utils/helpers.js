export async function executePromisesWithLimit(concurrency, tasks) {
  try {
    const taskChunks = Array(Math.ceil(tasks.length / concurrency))
      .fill()
      .map((_, index) =>
        tasks.slice(index * concurrency, (index + 1) * concurrency)
      );

    const results = [];
    for (const chunk of taskChunks) {
      const batchResults = await Promise.allSettled(
        chunk.map((task) => task())
      );

      const modifiedResults = batchResults.map((result) =>
        result.status === "rejected"
          ? { ...result, message: result.reason.message }
          : result
      );

      results.push(...modifiedResults);
    }
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
