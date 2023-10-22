export const test = (req, res) => {
  {
    res.json({
      message: "Hello World!",
    });
    console.log("Someone connecting to /api/user/test");
  }
};
