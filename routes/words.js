const express = require("express");
const router = express.Router();

const {
  getWords,
  getWord,
  createWord,
  updateWord,
  deleteWord,
  updateSaveWord,
  allClear,
} = require("../controller/words");

//"/api/v1/categories"
router.route("/").get(getWords).post(createWord);

router.route("/save").put(updateSaveWord);

router.route("/:id").get(getWord).put(updateWord).delete(deleteWord);
router.route("/allClear").post(allClear);

module.exports = router;
