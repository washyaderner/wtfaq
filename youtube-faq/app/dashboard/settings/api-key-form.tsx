'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

const formSchema = z.object({
  apiKey: z.string().min(1, 'API key is required').regex(/^sk-/, 'Invalid OpenAI API key format'),
})

interface ApiKeyFormProps {
  hasApiKey: boolean
}

export default function ApiKeyForm({ hasApiKey }: ApiKeyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Update the profile with the API key
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No user found')
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ openai_api_key: values.apiKey })
        .eq('user_id', user.id)

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      form.reset()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRemoveApiKey() {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No user found')
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ openai_api_key: null })
        .eq('user_id', user.id)

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove API key')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {hasApiKey ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              API key is configured and active
            </p>
          </div>
          <Button
            onClick={handleRemoveApiKey}
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? 'Removing...' : 'Remove API Key'}
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OpenAI API Key</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="sk-..."
                        type={showApiKey ? 'text' : 'password'}
                        disabled={isLoading}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    You can find your API key in your{' '}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      OpenAI dashboard
                    </a>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            
            {success && (
              <div className="text-sm text-green-600">
                API key saved successfully!
              </div>
            )}
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save API Key'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}