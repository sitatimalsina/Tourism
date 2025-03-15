const request = require("supertest");
const app = require("../index"); // Assuming your Express app is exported from index.js
const Booking = require("../model/Booking");

describe("Confirm Booking", () => {
  it("should confirm a booking for an admin user", async () => {
    // Create a mock booking
    const booking = await Booking.create({
      user: "mockUserId",
      package: "mockPackageId",
      numberOfPeople: 2,
      bookingDate: new Date(),
      userName: "John Doe",
      userEmail: "john@example.com",
      userPhone: "+1234567890",
      userAddress: "123 Main St",
      amountPaid: 100,
      status: "pending",
    });

    // Mock admin user token
    const token = "mockAdminToken"; // Replace with a valid token for testing

    const response = await request(app)
      .put(`/api/bookings/confirm/${booking._id}`)
      .set("Cookie", `jwt=${token}`) // Set the JWT token in the cookie
      .send();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe("Booking confirmed successfully!");
  });
});
