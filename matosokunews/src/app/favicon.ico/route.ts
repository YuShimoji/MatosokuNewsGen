export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const target = new URL('/favicon.svg', origin);
  return Response.redirect(target, 308);
}
