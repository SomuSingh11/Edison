const calculateTotalDuration = (chapters) => {
  if (!Array.isArray(chapters)) return 0;

  let totalMinutes = 0;
  chapters.forEach((chapter) => {
    if (typeof chapter.duration !== "string") return;

    const durationStr = chapter.duration.toLowerCase();
    let hours = 0;
    let minutes = 0;

    const hourMatch = durationStr.match(/(\d+)\s*hour/);
    if (hourMatch) {
      hours = parseInt(hourMatch[1], 10);
    }

    const minuteMatch = durationStr.match(/(\d+)\s*minute/);
    if (minuteMatch) {
      minutes = parseInt(minuteMatch[1], 10);
    }

    totalMinutes += hours * 60 + minutes;
  });

  const finalHours = Math.floor(totalMinutes / 60);
  const finalMinutes = totalMinutes % 60;

  if (finalHours > 0 && finalMinutes > 0) {
    return `${finalHours}h ${finalMinutes}m`;
  } else if (finalHours > 0) {
    return `${finalHours} hours`;
  } else {
    return `${finalMinutes} mins`;
  }
};

export default calculateTotalDuration;
