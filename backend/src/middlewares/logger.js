export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - start;
    const userId = req.user?.id ?? null;

    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        userId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
      })
    );
  });

  next();
}
