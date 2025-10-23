import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/",
  "/dashboard",
  "/dashboard/roles",
  "/dashboard/clerk",
  "/dashboard/users",
  "/dashboard/academicyear",
  "/dashboard/majors",
  "/dashboard/classes",
  "/dashboard/subjects",
  "/dashboard/schedules",
  "/dashboard/attendance",
  "/dashboard/typeviolations",
  "/dashboard/violations",
  "/dashboard/violations/teacher",
  "/dashboard/violations/student",
  "/dashboard/payments",
  "/dashboard/specialschedule",
  "/dashboard/calender",
  "/dashboard/teacher/schedule",
  "/dashboard/student/attendance",
  "/dashboard/student/schedule",
  "/dashboard/parent",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return (await auth()).redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// // Define public routes that don't require authentication
// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/api/webhooks(.*)", // If you use Clerk webhooks
// ]);

// // Define admin routes
// const isAdminRoute = createRouteMatcher(["/admin(.*)", "/dashboard/users(.*)", "/dashboard/roles(.*)"]);

// // Define teacher routes
// const isTeacherRoute = createRouteMatcher(["/teacher(.*)", "/dashboard/attendance(.*)", "/dashboard/schedules(.*)"]);

// // Define student routes
// const isStudentRoute = createRouteMatcher(["/student(.*)"]);

// // Define parent routes
// const isParentRoute = createRouteMatcher(["/parent(.*)"]);

// export default clerkMiddleware(async (auth, request) => {
//   const { userId, sessionClaims } = await auth();

//   // Allow public routes
//   if (isPublicRoute(request)) {
//     return NextResponse.next();
//   }

//   // Require authentication for protected routes
//   if (!userId) {
//     return auth().redirectToSignIn();
//   }

//   // Role-based access control (optional - if you store roles in Clerk metadata)
//   const userRole = sessionClaims?.metadata?.role as string | undefined;

//   // Check admin routes
//   if (isAdminRoute(request) && userRole !== "admin") {
//     return NextResponse.redirect(new URL("/unauthorized", request.url));
//   }

//   // Check teacher routes
//   if (isTeacherRoute(request) && userRole !== "teacher" && userRole !== "admin") {
//     return NextResponse.redirect(new URL("/unauthorized", request.url));
//   }

//   // Check student routes
//   if (isStudentRoute(request) && userRole !== "student" && userRole !== "admin") {
//     return NextResponse.redirect(new URL("/unauthorized", request.url));
//   }

//   // Check parent routes
//   if (isParentRoute(request) && userRole !== "parent" && userRole !== "admin") {
//     return NextResponse.redirect(new URL("/unauthorized", request.url));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };
