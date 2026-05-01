

export async function updateUserStreak(user: any) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  let diffInDays = -1;

  if (user.streak_data) {
    const lastDate = new Date(user.streak_data);
    lastDate.setHours(0, 0, 0, 0);

    const diff =
      currentDate.getTime() - lastDate.getTime();

    diffInDays = Math.round(diff / (1000 * 60 * 60 * 24));
  }

  if (diffInDays === 1) {
    user.streak += 1;
  } else if (diffInDays > 1 || diffInDays === -1) {
    user.streak = 1;
  }

  user.streak_data = new Date();
  user.mock_interviews = (user.mock_interviews || 0) + 1;

  await user.save();
}