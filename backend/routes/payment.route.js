const express = require("express");
const router = express.Router();
const { processKhaltiPayment } = require("../controller/payment.controller");

// Route to handle Khalti payment response
router.post("/process-khalti", async (req, res) => {
  try {
    const { pidx } = req.body;

    // Call the controller function to process the Khalti payment
    await processKhaltiPayment(req, res);
  } catch (error) {
    console.error("Error processing Khalti payment:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;