/**
 * Reusable Query Filtering, Searching & Pagination Helper
 * Applies search regex filters, field sorting, and pagination metadata to Mongoose queries.
 */
export async function applyQueryFeatures(model, queryParams = {}, searchFields = []) {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};

  // Apply search query across specified fields
  if (queryParams.search && searchFields.length > 0) {
    const searchRegex = new RegExp(queryParams.search, "i");
    filter.$or = searchFields.map((field) => ({ [field]: searchRegex }));
  }

  // Apply exact match filters (e.g. status, classVal, subject)
  if (queryParams.status) filter.status = queryParams.status;
  if (queryParams.classVal) filter.classVal = queryParams.classVal;
  if (queryParams.subject) filter.subject = queryParams.subject;

  // Sorting
  let sortOption = { createdAt: -1 };
  if (queryParams.sortBy) {
    if (queryParams.sortBy === "marks-desc") sortOption = { obtainedMarks: -1 };
    else if (queryParams.sortBy === "marks-asc") sortOption = { obtainedMarks: 1 };
    else if (queryParams.sortBy === "percentage-desc") sortOption = { percentage: -1 };
    else if (queryParams.sortBy === "percentage-asc") sortOption = { percentage: 1 };
  }

  const total = await model.countDocuments(filter);
  const data = await model.find(filter).sort(sortOption).skip(skip).limit(limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}
