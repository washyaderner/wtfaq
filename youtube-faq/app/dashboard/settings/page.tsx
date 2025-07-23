import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ApiKeyForm from './api-key-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('openai_api_key')
    .single()

  const hasApiKey = profile?.openai_api_key !== null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your API keys and account settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>OpenAI API Key</CardTitle>
          <CardDescription>
            Your OpenAI API key is required for generating embeddings and AI responses.
            It will be encrypted and stored securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeyForm hasApiKey={hasApiKey} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Notice</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc list-inside space-y-1">
            <li>Your API key is encrypted before storage</li>
            <li>We never share your API key with third parties</li>
            <li>You can update or remove your API key at any time</li>
            <li>All API usage is associated with your account only</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}