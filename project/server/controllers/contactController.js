import Contact from "../models/contactModel.js";

export const contact = async (req, res) => {
  try {
    const { clientName, email, messages } = req.body;

    if (!clientName || !email || !messages) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newContact = await Contact.create({
      clientName,
      email,
      messages,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contact: newContact,
    });
  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
