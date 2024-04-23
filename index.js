const post = require("./post");
const create = require("./create");

const publish = async () => {
  await create();
  await post();
};
publish();
