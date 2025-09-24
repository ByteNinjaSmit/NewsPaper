const Upload = require("../model/upload-model");
const path = require("path");

const imageUploader = async (req, res, next) => {
  try {
    const { title, isSpecialEdition, date } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    // Parse date from body or fallback to current date
    let parsedDate;
    if (date) {
      const tempDate = new Date(date);
      if (isNaN(tempDate)) {
        return res.status(400).json({ message: "Invalid date format." });
      }
      parsedDate = tempDate;
    } else {
      parsedDate = new Date();
    }

    // Separate PDF and image files
    const pages = [];
    let pdfFile = null;

    files.forEach((file) => {
      const ext = path.extname(file.originalname).toLowerCase();

      if (ext === ".pdf") {
        if (pdfFile) {
          return res
            .status(400)
            .json({ message: "Only one PDF file is allowed." });
        }
        pdfFile = file.path;
      } else if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        pages.push(file.path);
      }
    });

    if (!pdfFile) {
      return res.status(400).json({ message: "A PDF file is required." });
    }

    // Save to DB
    const newUpload = new Upload({
      title,
      date: parsedDate,
      pages,
      pdfFile,
      isSpecialEdition: isSpecialEdition || false,
    });

    const saved = await newUpload.save();

    return res.status(201).json({
      message: "Upload successful",
      data: saved,
    });
  } catch (error) {
    console.error("Upload error:", error);
    next(error);
  }
};

const getMedia = async (req, res, next) => {
  try {
    const { month } = req.query;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res
        .status(400)
        .json({
          message: "Invalid or missing 'month' parameter. Use format YYYY-MM.",
        });
    }

    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const uploads = await Upload.find({
      date: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({ date: -1 });
    
    const formattedUploads = uploads.map((upload) => ({
      _id: upload._id,
      title: upload.title,
      date: upload.date,
      isSpecialEdition: upload.isSpecialEdition,
      pdfFile: `/${upload.pdfFile.replace(/\\/g, "/")}`,
      pages: upload.pages.map((imgPath) => `/${imgPath.replace(/\\/g, "/")}`),
    }));

    res.status(200).json({
      message: "Uploads fetched successfully",
      data: formattedUploads,
    });
  } catch (error) {
    console.log(`Error From Get Media: `, error);
    next(error);
  }
};

module.exports = {
  imageUploader,
  getMedia,
};
