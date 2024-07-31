const APIFeatures = (query, queryString) => {
  const search = () => {
    const keyword = queryString.keyword
      ? {
          name: {
            $regex: queryString.keyword,
            $options: "i",
          },
        }
      : {};

    query = query.find({ ...keyword });
    return query;
  };

  const filter = () => {
    const querycopy = { ...queryString };

    // Removing fields from query
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((el) => delete querycopy[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(querycopy);
    queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, (match) => `$${match}`);

    query = query.find(JSON.parse(queryStr));
    return query;
  };

  const pagination = (resPerPage) => {
    const currentPage = Number(queryString.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    query = query.limit(resPerPage).skip(skip);
    return query;
  };

  return { search, filter, pagination };
};

module.exports = APIFeatures;
