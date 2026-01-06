export const normalizeWorkshopBody = (req, res, next) => {
  // 🔥 instructor
  if (req.body.instructorName) {
    req.body.instructor = {
      name: req.body.instructorName,
    };
    delete req.body.instructorName;
  }

  // numbers
  if (req.body.price) req.body.price = Number(req.body.price);
  if (req.body.maxParticipants)
    req.body.maxParticipants = Number(req.body.maxParticipants);

  // booleans
  if (req.body.isFeatured !== undefined)
    req.body.isFeatured = req.body.isFeatured === "true";

  next();
};