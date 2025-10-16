import prisma from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { sanitizeInput } from "@/utils/validation";
import { handleApiError, AppError } from "@/utils/errorHandler";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const PUT = async (request: Request) => {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      throw new AppError("Unauthorized - Please login", 401);
    }

    const body = await sanitizeInput.validateJsonInput(request);
    const { phone, address } = body;

    // Validate inputs
    if (phone && typeof phone !== 'string') {
      throw new AppError("Invalid phone number format", 400);
    }

    if (address && typeof address !== 'string') {
      throw new AppError("Invalid address format", 400);
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(phone && { phone: phone.trim() }),
        ...(address && { address: address.trim() }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        updatedAt: true,
      },
    });

    return new NextResponse(
      JSON.stringify({ 
        message: "Profile updated successfully",
        user: updatedUser 
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    return handleApiError(error);
  }
};

export const GET = async (request: Request) => {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      throw new AppError("Unauthorized - Please login", 401);
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return new NextResponse(
      JSON.stringify({ user }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    return handleApiError(error);
  }
};