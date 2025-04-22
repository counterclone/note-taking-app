import { useMutation } from '@tanstack/react-query'

type SummarizeResponse = {
  summary: string
}

export const useSummarize = () => {
  return useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to summarize')
      }
      return response.json()
    },
  })
}
