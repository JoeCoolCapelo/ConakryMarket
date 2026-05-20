exports.paginate = async (model, query, page, limit) => {
  const skip = (page - 1) * limit;
  const total = await model.countDocuments(query);
  const data = await model.find(query).skip(skip).limit(limit);
  return { data, total, page, pages: Math.ceil(total / limit) };
};
