export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown) {
  console.error('Error:', error)

  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        message: error.message,
        code: error.code,
      }),
      {
        status: error.statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  if (error instanceof Error) {
    return new Response(
      JSON.stringify({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  return new Response(
    JSON.stringify({
      message: 'Internal server error',
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
} 