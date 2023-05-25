const Word = require("../models/Words");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

exports.getWords = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // req.query = { en: { $regex: "like", $options: "i" } };

  // Object.keys(req.query).map((name) => {
  //   req.query[name] = { $regex: req.query[name], $options: "i" };
  // });

  if (req.query["en"]) {
    req.query["en"] = { $regex: req.query["en"], $options: "i" };
  }

  const pagination = await paginate(page, limit, Word, req.query);

  const words = await Word.find(req.query, select)
    .populate("category")
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  const countSaveWord = await Word.countDocuments({ saved: true });

  res.status(200).json({
    success: true,
    data: words,
    code: res.statusCode,
    pagination: { ...pagination, countSaveWord },
  });
});

exports.getWord = asyncHandler(async (req, res, next) => {
  const word = await Word.findById(req.params.id).populate("category");

  if (!word) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: word,
    code: res.statusCode,
  });
});

exports.createWord = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const word = await Word.create(req.body);

  res.status(200).json({
    success: true,
    data: word,
    code: res.statusCode,
  });
});

exports.updateWord = asyncHandler(async (req, res, next) => {
  const word = await Word.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!word) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
  }

  res.status(200).json({
    success: true,
    data: word,
    code: res.statusCode,
  });
});

exports.deleteWord = asyncHandler(async (req, res, next) => {
  let word = await Word.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: word,
    code: res.statusCode,
  });
});

exports.updateSaveWord = asyncHandler(async (req, res, next) => {
  // const word = await Word.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });

  // if (!word) {
  //   throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
  // }

  // let bulk = Word.initializeUnorderedBulkOp();

  // req.body.forEach((word) =>
  //   bulk.find({ id: word.id }).update({ $set: { saved: word.saved } })
  // );

  // bulk.execute();

  req.body.forEach(async (word) => {
    await Word.findByIdAndUpdate(
      word.id,
      { saved: word.saved },
      {
        new: true,
        runValidators: true,
      }
    );
  });

  res.status(200).json({
    success: true,
    // data: word,
    code: res.statusCode,
  });
});

exports.allClear = asyncHandler(async (req, res, next) => {
  let words = await Word.updateMany({}, { saved: false });

  res.status(200).json({
    success: true,
    data: words,
    code: res.statusCode,
  });
});
