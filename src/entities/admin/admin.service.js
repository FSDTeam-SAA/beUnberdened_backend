import User from "../auth/auth.model.js";

export const getMonthlyActiveUsers = async (year) => {
  const users = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        totalUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return months.map((month, i) => {
    const found = users.find((u) => u._id === i + 1);
    return { month, totalUsers: found ? found.totalUsers : 0 };
  });
};
