import { connectDatabase } from "../config/db";
import { Budget } from "../models/Budget";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";

async function seed() {
  await connectDatabase();

  let user = await User.findOne({ email: "demo@walletwave.app" });
  if (!user) {
    user = await User.create({
      name: "Demo User",
      email: "demo@walletwave.app",
      password: "password123",
      currency: "USD",
      monthlyBudget: 3200
    });
  }

  await Transaction.deleteMany({ user: user._id });
  await Budget.deleteMany({ user: user._id });

  await Transaction.insertMany([
    { user: user._id, title: "Monthly Salary", amount: 6200, type: "income", category: "Salary", date: new Date("2026-04-01") },
    { user: user._id, title: "Freelance Website", amount: 1450, type: "income", category: "Freelance", date: new Date("2026-04-11") },
    { user: user._id, title: "Groceries", amount: 210, type: "expense", category: "Food", date: new Date("2026-04-06") },
    { user: user._id, title: "Flight Booking", amount: 560, type: "expense", category: "Travel", date: new Date("2026-04-08") },
    { user: user._id, title: "Utilities", amount: 190, type: "expense", category: "Bills", date: new Date("2026-04-12") },
    { user: user._id, title: "Medical Checkup", amount: 130, type: "expense", category: "Health", date: new Date("2026-04-13") }
  ]);

  await Budget.create({
    user: user._id,
    month: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
    limit: 3200
  });

  console.log("Seeded demo user:");
  console.log("Email: demo@walletwave.app");
  console.log("Password: password123");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed", error);
  process.exit(1);
});
