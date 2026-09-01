export class AppError extends Error {
  public statusCode: number
  public code?: string

  constructor(message: string, statusCode: number = 400, code?: string) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
  }

  get status() {
    return this.statusCode
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
    const message = error.message.toLowerCase()
    if (message.includes('ecconnrefused') || message.includes('querysrv') || message.includes('neon')) {
      return new Response(
        JSON.stringify({
          message: 'Database is temporarily unavailable. Please ensure your Neon database URL is valid and accessible.',
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

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