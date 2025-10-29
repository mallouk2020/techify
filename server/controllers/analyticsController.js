const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

// Helper: parse range query into start/end timestamps
const resolveDateRange = (range = "today") => {
  const now = new Date();
  const end = new Date(now);
  let start;

  switch (range) {
    case "7d":
      start = new Date(now);
      start.setDate(start.getDate() - 6); // include today + previous 6 days
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "30d":
      start = new Date(now);
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "today":
    default:
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
};

const recordPageView = asyncHandler(async (req, res) => {
  const {
    path,
    sessionId,
    userAgent,
    referrer,
    userId,
  } = req.body;

  if (!path || typeof path !== "string") {
    throw new AppError("Path is required", 400);
  }

  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

  await prisma.pageView.create({
    data: {
      path,
      sessionId,
      userAgent,
      referrer,
      userId,
      ipAddress: typeof ipAddress === "string" ? ipAddress : null,
    },
  });

  res.status(201).json({ status: "recorded" });
});

const getVisitorsSummary = asyncHandler(async (req, res) => {
  const { range = "today" } = req.query;
  const { start, end } = resolveDateRange(range);

  const pageViews = await prisma.pageView.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    select: {
      sessionId: true,
      ipAddress: true,
      path: true,
      createdAt: true,
    },
  });

  const totalVisits = pageViews.length;

  const uniqueVisitorsSet = new Set(
    pageViews.map((view) => view.sessionId || view.ipAddress).filter(Boolean)
  );
  const uniqueVisitors = uniqueVisitorsSet.size;

  const dayBuckets = {};
  pageViews.forEach((view) => {
    const key = view.createdAt.toISOString().slice(0, 10);
    dayBuckets[key] = (dayBuckets[key] || 0) + 1;
  });

  const periodDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
  const averageDailyVisits = totalVisits ? totalVisits / periodDays : 0;

  res.status(200).json({
    totalVisits,
    uniqueVisitors,
    averageDailyVisits,
    dailyBreakdown: dayBuckets,
  });
});

module.exports = {
  recordPageView,
  getVisitorsSummary,
};