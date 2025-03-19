import AddFriendForm from '@/components/add-friend-form'
import BackButton from '@/components/back-button'

export default function Page() {
  return (
    <main className="h-full rounded-md border bg-white p-6 md:p-8">
      <div className="mb-8 flex items-center gap-2">
        <BackButton />
        <h1 className="text-xl font-bold">Add a Friend</h1>
      </div>

      <AddFriendForm />
    </main>
  )
}
