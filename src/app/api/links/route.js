export const dynamic = 'force-static'

export async function GET() {
    return Response.json({link: 'https://www.google.com'})
}