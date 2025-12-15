import { jwtDecode } from 'jwt-decode'
import { redirect } from 'next/dist/server/api-utils'
import { NextResponse } from 'next/server'

export const middleware = (request) => {
  const tokenCookie = request.cookies.get('token')
  const token = tokenCookie?.value
  const pathName = request.nextUrl.pathname

  if (!token) return NextResponse.redirect(new URL('/login', request.url))

    let decode;
    try {
        decode = jwtDecode(token)
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const role = decode?.role

    if(role === 'admin' && pathName.startsWith('/user')) return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    if(role === 'user' && pathName.startsWith('/admin')) return NextResponse.redirect(new URL('/user/dashboard', request.url))

    return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
  ]
}