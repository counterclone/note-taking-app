import { useMutation } from '@tanstack/react-query'

type SummaryResponse = {
  summary: string
}

export const useSummarize = () => {
  return useMutation<SummaryResponse, Error, string>({
    mutationFn: async (text: string) => {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
      if (!response.ok) throw new Error('Failed to summarize')
      return response.json() as Promise<SummaryResponse>
    },
  })
}