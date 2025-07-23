import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, FileText, MessageSquare } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch user's channels
  const { data: channels, error: channelsError } = await supabase
    .from('channels')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch user's profile to check API key
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('openai_api_key')
    .single()

  const hasApiKey = profile?.openai_api_key !== null

  return (
    <div className="space-y-6">
      {/* API Key Warning */}
      {!hasApiKey && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900">Setup Required</CardTitle>
            <CardDescription className="text-yellow-700">
              You need to add your OpenAI API key to start using the FAQ system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/settings">
                Add API Key
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your YouTube channels and FAQ system
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/channels/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Channel
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Channels
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{channels?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Videos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Channels List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Channels</CardTitle>
          <CardDescription>
            Manage your YouTube channels and upload transcripts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {channels && channels.length > 0 ? (
            <div className="space-y-4">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium">{channel.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {channel.youtube_url}
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/channels/${channel.id}`}>
                      Manage
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No channels added yet. Add your first channel to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}