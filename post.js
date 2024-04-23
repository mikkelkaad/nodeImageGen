const InstagramPublisher = require("instagram-publisher");
const post = async () => {
  const client = new InstagramPublisher({
    email: process.env.USER,
    password: process.env.PASSWORD,
    verbose: true,
  });

  const photo = {
    image_path: "./text-overlay.jpg",
    caption:
      "Follow for more cool quotes! #quotes#quouteoftheday#qotd#foryou#foryoupage#fyp#motivation#motivationalqoutes#inspirational#inspiration#inspirationalqoutes#brilliantminds",
  };
  await require("./create");
  await client.createSingleImage(photo);
};

module.exports = post;
