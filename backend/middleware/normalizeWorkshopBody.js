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

  // Duration calculation
  if (req.body.startTime && req.body.endTime) {
    const [startHours, startMinutes] = req.body.startTime.split(':').map(Number);
    const [endHours, endMinutes] = req.body.endTime.split(':').map(Number);

    const startDate = new Date(0, 0, 0, startHours, startMinutes);
    const endDate = new Date(0, 0, 0, endHours, endMinutes);

    // Handle overnight workshops (if end time is before start time)
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const diffMs = endDate - startDate;
    const diffMins = Math.round(diffMs / 60000);

    req.body.duration = diffMins;
  }

  next();
};