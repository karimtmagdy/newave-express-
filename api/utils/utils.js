const asyncHandler = require("express-async-handler");

exports.fn = (callback) => asyncHandler(callback);

exports.paginate = async (
  model,
  query = {},
  page = 1,
  limit = 10,
  filter = {}
) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    model.find(filter).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    status: "success",
    results: total,
    currentPage: page,
    totalPages,
    itemsPerPage: limit,
    data,
  };
};
